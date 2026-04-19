import html
import json
import re
from pathlib import Path


BASE_URL = "https://imediagenius.co.uk"
SITE_NAME = "iMedia Genius"
TODAY = "2026-04-19"

NOINDEX_PAGES = {
    "markable-mini-exam-marking-desk.html",
    "marking-desk-jun2025.html",
}

EXAM_PAGES = {
    "01-mini-exam.html",
    "markable-mini-exam.html",
    "r093-jun2025-exam.html",
    "nine-mark-ai-trainer.html",
    "nine-mark-ninja.html",
    "nine-marker-arena.html",
    "escape-room-r093.html",
    "exam-styles-showdown.html",
}


def slug_to_title(filename: str) -> str:
    slug = Path(filename).stem
    slug = re.sub(r"^\d+-", "", slug)
    slug = re.sub(r"^topic-\d+-", "", slug)
    slug = re.sub(r"^r093-", "R093 ", slug)
    slug = slug.replace("-", " ").title()
    replacements = {
        "Imedia": "iMedia",
        "R093": "R093",
        "Sfx": "SFX",
        "Vfx": "VFX",
        "Ipr": "IPR",
        "Ai": "AI",
    }
    for old, new in replacements.items():
        slug = slug.replace(old, new)
    return " ".join(slug.split())


def ascii_clean(value: str) -> str:
    replacements = {
        "\u2013": "-",
        "\u2014": "-",
        "\u2018": "'",
        "\u2019": "'",
        "\u201c": '"',
        "\u201d": '"',
        "\u2026": "...",
        "\u2022": "-",
        "\u2011": "-",
        "\u00a0": " ",
    }
    for old, new in replacements.items():
        value = value.replace(old, new)
    value = "".join(ch for ch in value if ord(ch) < 128)
    return " ".join(value.split())


def strip_tags(value: str) -> str:
    value = html.unescape(value)
    value = re.sub(r"<[^>]+>", " ", value)
    return " ".join(value.split())


def first_h1(text: str, fallback: str) -> str:
    match = re.search(r"(?is)<h1[^>]*>(.*?)</h1>", text)
    if not match:
        return fallback
    heading = strip_tags(match.group(1))
    return heading or fallback


def image_url(filename: str) -> str:
    if filename == "index.html":
        return f"{BASE_URL}/img/index-hero.png"
    stem = Path(filename).stem
    for ext in ("png", "jpg", "jpeg", "webp", "gif"):
        candidate = Path("img") / f"{stem}-hero.{ext}"
        if candidate.exists():
            return f"{BASE_URL}/{candidate.as_posix()}"
    return f"{BASE_URL}/img/index-hero.png"


def page_meta(filename: str, text: str) -> dict:
    fallback = slug_to_title(filename)
    heading = ascii_clean(first_h1(text, fallback))
    canonical = f"{BASE_URL}/" if filename == "index.html" else f"{BASE_URL}/{filename}"
    robots = (
        "noindex, nofollow, noarchive"
        if filename in NOINDEX_PAGES
        else "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
    )

    if filename == "index.html":
        return {
            "title": ascii_clean("OCR Creative iMedia Revision | R093 Revision Games and Exam Practice | iMedia Genius"),
            "description": ascii_clean("Free OCR Creative iMedia revision for R093 with topic guides, revision games, flashcards, exam practice, videos and podcasts for Creative iMedia in the Media Industry."),
            "canonical": canonical,
            "robots": robots,
            "image": f"{BASE_URL}/img/index-hero.png",
            "image_alt": ascii_clean("iMedia Genius homepage for OCR Creative iMedia R093 revision"),
            "schema_type": "CollectionPage",
        }

    if filename.startswith("topic-"):
        topic = slug_to_title(filename)
        return {
            "title": ascii_clean(f"{topic} Revision | OCR Creative iMedia R093 | iMedia Genius"),
            "description": ascii_clean(f"Revise {topic} for OCR Creative iMedia R093 with notes, examples, video, podcast, flashcards, practice questions and revision games."),
            "canonical": canonical,
            "robots": robots,
            "image": image_url(filename),
            "image_alt": ascii_clean(f"{topic} revision guide for OCR Creative iMedia R093"),
            "schema_type": "LearningResource",
        }

    custom = {
        "r093-jun2025-exam.html": (
            "R093 June 2025 Exam Practice | OCR Creative iMedia Mock Exam | iMedia Genius",
            "Practise the OCR Creative iMedia R093 exam with a full June 2025 style paper, timed conditions and markable answers.",
        ),
        "01-mini-exam.html": (
            "R093 Mini Exam | OCR Creative iMedia Exam Practice | iMedia Genius",
            "Test OCR Creative iMedia R093 knowledge with a focused mini exam built for revision, retrieval practice and exam confidence.",
        ),
        "markable-mini-exam.html": (
            "Markable R093 Mini Exam | OCR Creative iMedia Practice | iMedia Genius",
            "Complete a markable OCR Creative iMedia R093 mini exam with exam style questions and structured practice.",
        ),
        "markable-mini-exam-marking-desk.html": (
            "Marking Desk Pre-Mock 01 | OCR Creative iMedia R093 | iMedia Genius",
            "Internal marking desk for OCR Creative iMedia R093 pre-mock review.",
        ),
        "marking-desk-jun2025.html": (
            "June 2025 Marking Desk | OCR Creative iMedia R093 | iMedia Genius",
            "Internal marking desk for OCR Creative iMedia R093 June 2025 review.",
        ),
        "escape-room-r093.html": (
            "Escape Room R093 | OCR Creative iMedia Revision Game | iMedia Genius",
            "Revise OCR Creative iMedia R093 through an interactive escape room packed with retrieval practice.",
        ),
        "nine-mark-ai-trainer.html": (
            "9 Mark AI Trainer | OCR Creative iMedia R093 Revision | iMedia Genius",
            "Improve extended responses for OCR Creative iMedia R093 with AI ready 9 mark practice and exam technique support.",
        ),
    }

    if filename in custom:
        title, description = custom[filename]
    elif filename in EXAM_PAGES:
        title = f"{heading} | OCR Creative iMedia R093 Exam Practice | iMedia Genius"
        description = f"Build exam confidence for OCR Creative iMedia R093 with {heading} on iMedia Genius."
    else:
        title = f"{heading} | OCR Creative iMedia R093 Revision | iMedia Genius"
        description = f"Revise OCR Creative iMedia R093 with {heading} on iMedia Genius."

    return {
        "title": ascii_clean(title),
        "description": ascii_clean(description),
        "canonical": canonical,
        "robots": robots,
        "image": image_url(filename),
        "image_alt": ascii_clean(f"{heading} for OCR Creative iMedia R093"),
        "schema_type": "LearningResource",
    }


def schema_json(meta: dict) -> str:
    payload = {
        "@context": "https://schema.org",
        "@type": meta["schema_type"],
        "name": meta["title"],
        "description": meta["description"],
        "url": meta["canonical"],
        "inLanguage": "en-GB",
        "isPartOf": {
            "@type": "WebSite",
            "name": SITE_NAME,
            "url": BASE_URL,
        },
        "about": [
            "OCR Creative iMedia",
            "R093",
            "Creative iMedia in the Media Industry",
            "iMedia revision",
        ],
    }
    return json.dumps(payload, separators=(",", ":"))


def build_meta_block(meta: dict, newline: str) -> str:
    lines = [
        f"<title>{html.escape(meta['title'])}</title>",
        f'<meta name="description" content="{html.escape(meta["description"], quote=True)}"/>',
        f'<meta name="robots" content="{meta["robots"]}"/>',
        f'<link rel="canonical" href="{meta["canonical"]}"/>',
        '<meta property="og:locale" content="en_GB"/>',
        '<meta property="og:type" content="website"/>',
        f'<meta property="og:site_name" content="{SITE_NAME}"/>',
        f'<meta property="og:url" content="{meta["canonical"]}"/>',
        f'<meta property="og:title" content="{html.escape(meta["title"], quote=True)}"/>',
        f'<meta property="og:description" content="{html.escape(meta["description"], quote=True)}"/>',
        f'<meta property="og:image" content="{meta["image"]}"/>',
        f'<meta property="og:image:alt" content="{html.escape(meta["image_alt"], quote=True)}"/>',
        '<meta name="twitter:card" content="summary_large_image"/>',
        f'<meta name="twitter:title" content="{html.escape(meta["title"], quote=True)}"/>',
        f'<meta name="twitter:description" content="{html.escape(meta["description"], quote=True)}"/>',
        f'<meta name="twitter:image" content="{meta["image"]}"/>',
        f'<script type="application/ld+json">{schema_json(meta)}</script>',
    ]
    return newline.join(lines) + newline


def update_html(path: Path) -> None:
    raw = path.read_text(encoding="utf-8", newline="")
    newline = "\r\n" if "\r\n" in raw else "\n"
    meta = page_meta(path.name, raw)

    patterns = [
        r"(?is)<title>.*?</title>\s*",
        r'(?is)<meta\s+[^>]*name=["\']description["\'][^>]*>\s*',
        r'(?is)<meta\s+[^>]*name=["\']robots["\'][^>]*>\s*',
        r'(?is)<meta\s+[^>]*property=["\']og:[^"\']+["\'][^>]*>\s*',
        r'(?is)<meta\s+[^>]*name=["\']twitter:[^"\']+["\'][^>]*>\s*',
        r'(?is)<link\s+[^>]*rel=["\']canonical["\'][^>]*>\s*',
        r'(?is)<script\s+type=["\']application/ld\+json["\']>.*?</script>\s*',
    ]
    cleaned = raw
    for pattern in patterns:
        cleaned = re.sub(pattern, "", cleaned)

    block = build_meta_block(meta, newline)
    viewport = re.search(r'(?is)(<meta\s+[^>]*name=["\']viewport["\'][^>]*>\s*)', cleaned)
    charset = re.search(r'(?is)(<meta\s+charset=["\'][^"\']+["\']\s*/?>\s*)', cleaned)

    if viewport:
        updated = re.sub(
            r'(?is)(<meta\s+[^>]*name=["\']viewport["\'][^>]*>\s*)',
            lambda m: m.group(1) + block,
            cleaned,
            count=1,
        )
    elif charset:
        updated = re.sub(
            r'(?is)(<meta\s+charset=["\'][^"\']+["\']\s*/?>\s*)',
            lambda m: m.group(1) + block,
            cleaned,
            count=1,
        )
    else:
        updated = re.sub(r"(?is)(<head>\s*)", lambda m: m.group(1) + block, cleaned, count=1)

    path.write_text(updated, encoding="utf-8", newline="")


def update_sitemap(root: Path) -> None:
    html_files = sorted(root.glob("*.html"))
    entries = []
    for path in html_files:
        if path.name in NOINDEX_PAGES:
            continue
        if path.name == "index.html":
            loc = f"{BASE_URL}/"
            priority = "1.0"
        elif path.name.startswith("topic-"):
            loc = f"{BASE_URL}/{path.name}"
            priority = "0.9"
        elif path.name in EXAM_PAGES:
            loc = f"{BASE_URL}/{path.name}"
            priority = "0.85"
        else:
            loc = f"{BASE_URL}/{path.name}"
            priority = "0.7"
        entries.append(
            "  <url>\n"
            f"    <loc>{loc}</loc>\n"
            f"    <lastmod>{TODAY}</lastmod>\n"
            "    <changefreq>weekly</changefreq>\n"
            f"    <priority>{priority}</priority>\n"
            "  </url>\n"
        )

    xml = (
        '<?xml version="1.0" encoding="utf-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "".join(entries)
        + "</urlset>\n"
    )
    (root / "sitemap.xml").write_text(xml, encoding="utf-8", newline="")


def update_robots(root: Path) -> None:
    robots = (
        "User-agent: *\n"
        "Allow: /\n\n"
        "Host: imediagenius.co.uk\n"
        f"Sitemap: {BASE_URL}/sitemap.xml\n"
    )
    (root / "robots.txt").write_text(robots, encoding="utf-8", newline="")


def main() -> None:
    root = Path(".")
    for path in sorted(root.glob("*.html")):
        update_html(path)
    update_sitemap(root)
    update_robots(root)


if __name__ == "__main__":
    main()
