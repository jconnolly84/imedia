"""Inject 'uplift' blocks (spec checklist, deep dives with credited photos, key terms, exam tips)
into topic/guide pages. Content lives in content_*.py; photo credits live in data/image-credits.json.

Usage (from the repo root):  python scripts/uplift/build.py [page-filter]
Re-running replaces the block between <!-- uplift:start --> and <!-- uplift:end -->, so it is safe to repeat.
"""
import sys, os, re, json, html, importlib.util, glob

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
CREDITS = json.load(open(os.path.join(ROOT, "data", "image-credits.json"), encoding="utf-8"))

def load(name):
    p = os.path.join(os.path.dirname(__file__), name)
    spec = importlib.util.spec_from_file_location(name[:-3], p)
    m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
    return m.PAGES

def md(s):
    """Minimal markdown: **bold**, *italic*."""
    s = html.escape(s, quote=False)
    s = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", s)
    s = re.sub(r"(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)", r"<em>\1</em>", s)
    return s

def figure(img_key, prefix):
    c = CREDITS[img_key]
    src = prefix + c["file"]
    cap = md(c.get("caption", ""))
    credit = (f'Photo: <a href="{html.escape(c["page"])}" rel="noopener" target="_blank">{html.escape(c["by"])}</a> '
              f'on <a href="{html.escape(c["site_url"])}" rel="noopener" target="_blank">{html.escape(c["site"])}</a>')
    return (f'<figure class="up-figure"><img src="{src}" alt="{html.escape(c["alt"])}" loading="lazy" width="1200" height="800">'
            f'<figcaption>{cap + " · " if cap else ""}{credit}</figcaption></figure>')

def block(p, prefix):
    out = ['<!-- uplift:start -->']
    # 1. Spec checklist
    lis = "".join(f"<li>{md(x)}</li>" for x in p["spec"])
    out.append(f'''<section class="topic-section uplift">
<h2>What the Specification Says</h2>
<div class="up-spec"><h3>{md(p.get("spec_title", "You need to know"))}</h3><p>{md(p.get("spec_intro", "Use this checklist to make sure you can cover every part of this topic."))}</p>
<ul>{lis}</ul><span class="up-ref">{md(p["ref"])}</span></div>
</section>''')
    # 2. Deep dive sections
    for d in p.get("deep", []):
        parts = [f'<section class="topic-section uplift">\n<h2>{md(d["title"])}</h2>']
        if d.get("intro"): parts.append(f'<p>{md(d["intro"])}</p>')
        for i, f in enumerate(d.get("features", [])):
            body = "".join(f"<p>{md(x)}</p>" for x in f.get("paras", []))
            if f.get("points"): body += "<ul>" + "".join(f"<li>{md(x)}</li>" for x in f["points"]) + "</ul>"
            parts.append(f'<div class="up-feature{" reverse" if i % 2 else ""}">{figure(f["img"], prefix)}<div><h3>{md(f["title"])}</h3>{body}</div></div>')
        if d.get("cards"):
            cards = []
            for c in d["cards"]:
                lab = f'<span class="up-label">{md(c["label"])}</span>' if c.get("label") else ""
                body = f'<p>{md(c["text"])}</p>' if c.get("text") else ""
                if c.get("points"): body += "<ul>" + "".join(f"<li>{md(x)}</li>" for x in c["points"]) + "</ul>"
                cards.append(f'<article class="up-card">{lab}<h3>{md(c["title"])}</h3>{body}</article>')
            parts.append('<div class="up-cards">' + "".join(cards) + "</div>")
        if d.get("scenario"):
            s = d["scenario"]
            parts.append(f'<div class="up-scenario"><h3>{md(s["title"])}</h3>' + "".join(f"<p>{md(x)}</p>" for x in s["paras"]) + "</div>")
        parts.append("</section>")
        out.append("\n".join(parts))
    # 3. Key terms
    if p.get("terms"):
        dl = "".join(f"<div><dt>{md(t)}</dt><dd>{md(d)}</dd></div>" for t, d in p["terms"])
        out.append(f'<section class="topic-section uplift">\n<h2>Key Terms</h2>\n<dl class="up-terms">{dl}</dl>\n</section>')
    # 4. Exam tips / common mistakes (or Good practice / Watch out for on NEA guides)
    if p.get("do") or p.get("dont"):
        do_t, dont_t = p.get("tips_titles", ("Exam tips", "Common mistakes"))
        do = "".join(f"<li>{md(x)}</li>" for x in p.get("do", []))
        dont = "".join(f"<li>{md(x)}</li>" for x in p.get("dont", []))
        out.append(f'''<section class="topic-section uplift">
<h2>{md(p.get("tips_heading", "Exam Tips & Common Mistakes"))}</h2>
<div class="up-tips"><div class="up-tip do"><h3>✔ {md(do_t)}</h3><ul>{do}</ul></div><div class="up-tip dont"><h3>✘ {md(dont_t)}</h3><ul>{dont}</ul></div></div>
</section>''')
    out.append('<!-- uplift:end -->')
    return "\n".join(out)

def inject(path, p):
    s = open(path, encoding="utf-8", newline="").read()
    prefix = "../" if "/r09" in path.replace("\\", "/") else ""
    blk = block(p, prefix)
    css = f'<link rel="stylesheet" href="{prefix}assets/css/uplift.css">'
    if "uplift.css" not in s:
        anchor = re.search(r'<link rel="stylesheet" href="(\.\./)?assets/css/studio\.css">', s)
        if not anchor: raise SystemExit("no studio.css link in " + path)
        s = s[:anchor.end()] + "\n" + css + s[anchor.end():]
    # Remove any existing block, then insert fresh so the position is always correct
    s = re.sub(r"<!-- uplift:start -->.*?<!-- uplift:end -->\n?", "", s, flags=re.S)
    if p.get("insert_before"):
        i = s.find(p["insert_before"])
        if i < 0: raise SystemExit(f"anchor {p['insert_before']!r} not found in {path}")
        main_end = s.find("</main>")
        if 0 <= main_end < i:   # footer sits outside <main>: keep the block inside the lesson layout
            i = main_end
        s = s[:i] + blk + "\n" + s[i:]
    else:
        where = p.get("insert_after", "topic-overview")
        i = s.find(where)
        if i < 0: raise SystemExit(f"anchor {where!r} not found in {path}")
        j = s.find("</section>", i) + len("</section>")
        s = s[:j] + "\n" + blk + s[j:]
    open(path, "w", encoding="utf-8", newline="").write(s)

def main():
    flt = sys.argv[1] if len(sys.argv) > 1 else ""
    pages = {}
    for f in sorted(glob.glob(os.path.join(os.path.dirname(__file__), "content_*.py"))):
        pages.update(load(os.path.basename(f)))
    n = 0
    for rel, p in pages.items():
        if flt and flt not in rel: continue
        inject(os.path.join(ROOT, rel), p); n += 1
        print("uplifted", rel)
    print(n, "page(s)")

if __name__ == "__main__":
    main()
