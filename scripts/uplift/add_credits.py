"""Add Pexels picks to data/image-credits.json and download each photo (1200x800 crop) into img/stock/.

Usage: python scripts/uplift/add_credits.py picks.json
picks.json maps image key -> {"id", "page", "by", "alt"} (as gathered from Pexels).
Captions and alt text come from the IMAGES dicts in content_*.py (our wording), falling back to Pexels' alt.
"""
import sys, os, json, glob, importlib.util, subprocess

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
CRED = os.path.join(ROOT, "data", "image-credits.json")

defs = {}
for f in glob.glob(os.path.join(os.path.dirname(__file__), "content_*.py")):
    s = importlib.util.spec_from_file_location("m", f); m = importlib.util.module_from_spec(s); s.loader.exec_module(m)
    defs.update(getattr(m, "IMAGES", {}))

picks = json.load(open(sys.argv[1], encoding="utf-8"))
cred = json.load(open(CRED, encoding="utf-8"))
ok = 0
for key, p in picks.items():
    if "id" not in p or not p.get("by"):
        print("skip (no pick):", key); continue
    out = os.path.join(ROOT, "img", "stock", key + ".jpg")
    url = f"https://images.pexels.com/photos/{p['id']}/pexels-photo-{p['id']}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200&h=800"
    subprocess.run(["curl", "-s", "-L", "-A", "Mozilla/5.0", "-o", out, url], check=True)
    if not os.path.exists(out) or os.path.getsize(out) < 5000 or open(out, "rb").read(2) != b"\xff\xd8":
        print("download failed:", key); continue
    q, caption, alt = defs.get(key, ("", "", p.get("alt", "")))
    cred[key] = {"file": f"img/stock/{key}.jpg", "alt": alt or p.get("alt", ""), "caption": caption,
                 "by": p["by"], "page": f"https://www.pexels.com/photo/{p['id']}/",
                 "site": "Pexels", "site_url": "https://www.pexels.com/"}
    ok += 1
json.dump(cred, open(CRED, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
print(ok, "photos added;", len(cred), "credits total")
