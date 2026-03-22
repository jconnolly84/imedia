import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT_URL = 'https://imediagenius.co.uk/';
const OUTPUT_PATH = path.resolve('public/data/strands.generated.json');
const limitArg = process.argv.find((arg) => arg.startsWith('--limit='));
const LIMIT = limitArg ? Number(limitArg.split('=')[1]) : null;

const clean = (value = '') => value
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/g, ' ')
  .replace(/&amp;/g, '&')
  .replace(/&#39;/g, "'")
  .replace(/&quot;/g, '"')
  .replace(/\s+/g, ' ')
  .trim();

function matchAll(html, regex) {
  return [...html.matchAll(regex)];
}

function extractTopicLinks(homeHtml) {
  const matches = matchAll(homeHtml, /href="(topic-\d{2}-[^"]+\.html)"[^>]*>(?:<[^>]+>)*\s*([^<]+?)\s*(?:<[^>]+>)*\s*(\d{2})\s*<\/a>/gi);
  const rows = matches.map((match) => ({
    href: new URL(match[1], ROOT_URL).toString(),
    title: clean(match[2]),
    code: match[3]
  }));
  const unique = [];
  const seen = new Set();
  for (const row of rows) {
    if (seen.has(row.href)) continue;
    seen.add(row.href);
    unique.push(row);
  }
  return LIMIT ? unique.slice(0, LIMIT) : unique;
}

function extractSection(html, startHeading, endHeading) {
  const escapedStart = startHeading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const escapedEnd = endHeading ? endHeading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : null;
  const regex = escapedEnd
    ? new RegExp(`<h[23][^>]*>${escapedStart}<\\/h[23]>([\\s\\S]*?)<h[23][^>]*>${escapedEnd}<\\/h[23]>`, 'i')
    : new RegExp(`<h[23][^>]*>${escapedStart}<\\/h[23]>([\\s\\S]*)$`, 'i');
  const match = html.match(regex);
  return match ? match[1] : '';
}

function bulletsFrom(sectionHtml) {
  return matchAll(sectionHtml, /<li[^>]*>([\s\S]*?)<\/li>/gi).map((m) => clean(m[1])).filter(Boolean);
}

function paragraphsFrom(sectionHtml, max = 2) {
  return matchAll(sectionHtml, /<p[^>]*>([\s\S]*?)<\/p>/gi).map((m) => clean(m[1])).filter(Boolean).slice(0, max);
}

function questionsFrom(html, code) {
  const examSection = extractSection(html, 'Exam Practice', 'Can You Now…?');
  const matches = matchAll(examSection, /<h3[^>]*>\s*Q(\d+)\.\s*([\s\S]*?)<\/h3>[\s\S]*?<p[^>]*>\s*Technique:\s*([\s\S]*?)<\/p>/gi);
  return matches.map((match) => {
    const prompt = clean(match[2]);
    const hint = clean(match[3]);
    const markMatch = prompt.match(/\((\d+) mark/);
    const marks = markMatch ? Number(markMatch[1]) : 1;
    const lowered = prompt.toLowerCase();
    const type = marks === 1 ? 'short_text' : 'explain';
    const tokens = Array.from(new Set(clean(prompt).toLowerCase().split(/\s+/).filter((word) => word.length > 4))).slice(0, 6);
    return {
      id: `${code}-q${match[1]}`,
      type,
      prompt,
      hint,
      marks,
      accepted: type === 'short_text' ? tokens : undefined,
      criteria: type === 'explain' ? [tokens.slice(0, 2), tokens.slice(2, 4), tokens.slice(4, 6)].filter((row) => row.length) : undefined
    };
  });
}

function buildReading(html) {
  const intro = paragraphsFrom(html, 3).slice(1, 3);
  const remember = extractSection(html, 'Key points you must remember', 'Video Overview');
  const glanceMatch = matchAll(html, /<h3[^>]*>([^<]+)<\/h3>\s*<p[^>]*>([^<]+)<\/p>\s*<ul[^>]*>([\s\S]*?)<\/ul>/gi).slice(0, 2);
  const glanceSections = glanceMatch.map((m) => ({ heading: clean(m[1]), body: clean(m[2]), bullets: bulletsFrom(m[3]).slice(0, 6) }));
  return [
    { heading: 'Overview', body: intro.join(' '), bullets: bulletsFrom(remember).slice(0, 6) },
    ...glanceSections
  ].filter((row) => row.body || row.bullets?.length);
}

function slugFromUrl(url) {
  const pathname = new URL(url).pathname;
  return pathname.split('/').pop().replace('.html', '');
}

async function main() {
  const homeHtml = await fetch(ROOT_URL).then((r) => r.text());
  const topics = extractTopicLinks(homeHtml);
  const output = [];

  for (const topic of topics) {
    const html = await fetch(topic.href).then((r) => r.text());
    const summaryMatch = html.match(/<h1[^>]*>[\s\S]*?<\/h1>\s*<p[^>]*>([\s\S]*?)<\/p>/i);
    const summary = clean(summaryMatch?.[1] || '');
    const reading = buildReading(html);
    const questions = questionsFrom(html, topic.code);
    output.push({
      id: `strand-${topic.code}`,
      code: `Strand ${topic.code}`,
      topicNumber: Number(topic.code),
      title: topic.title,
      summary,
      sourceUrl: topic.href,
      tags: Array.from(new Set(topic.title.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean))).slice(0, 5),
      slug: slugFromUrl(topic.href),
      reading,
      questions
    });
    console.log(`Imported ${topic.code} ${topic.title}`);
  }

  await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await fs.writeFile(OUTPUT_PATH, JSON.stringify(output, null, 2));
  console.log(`Saved ${output.length} strands to ${OUTPUT_PATH}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
