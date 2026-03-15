# Browser Moderation Scanner v7.0

This browser-based moderation scanner is designed for OCR coursework moderation.

## What changed in v7.0
- scans **PPTX** and **DOCX** only
- clearer **two-section UI**:
  - **Possible plagiarism**
  - **AI review**
- copied sections shown **side by side** for faster comparison
- keeps the browser workflow from v5/v6:
  - Photopea-style folder access
  - folder-root parsing like `0599_Lily_Evans_R094_ChocoIndulgence`
  - class heatmap
  - sharing clusters
  - CSV and HTML exports

## Run locally
From the folder above `modscan_v6`:

```powershell
python -m http.server 8000
```

Then open:

```text
http://127.0.0.1:8000/modscan_v6/
```

## Hosting
This build is static and can be hosted on:
- GitHub Pages
- Vercel
- Netlify

Use Chrome or Edge for the best folder-access support.


## v7.0 patch
- picks one **primary submission file** per student for plagiarism and AI review
- ignores duplicate copies in nested task folders while still noting them
- calms the AI review so ordinary coursework phrasing is less aggressively flagged
- separates plagiarism and AI flags in the student overview


## v7.0 patch
- adds AI sensitivity modes: Off, Low, Normal, Strict
- defaults AI review to **Low**
- shows only the **primary submission files** in the loaded submissions table after scan
- AI review is stricter and less likely to over-flag normal coursework writing


New in v7.0:
- Download extracted primary texts
- Download ChatGPT pack ZIP
- Plagiarism network visual
