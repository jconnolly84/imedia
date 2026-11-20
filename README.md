# iMedia Genius

Revision, coursework and creative tools for OCR Cambridge National Creative iMedia, published at
**https://imediagenius.co.uk** with GitHub Pages (branch `main`, root folder). The site is plain
HTML, CSS and JavaScript: there is no build step and nothing to install.

## Folder map

```
/                       Public pages. Their URLs are live and indexed, so they stay at the root.
  index.html            R093 revision home
  topic-NN-*.html       35 R093 topic guides
  *.html                Revision games, mini exams and marking desks
  help.html, privacy-policy.html, cookie-notice.html, terms-of-service.html
  CNAME, robots.txt, sitemap.xml, favicon.ico
  9df0e2c3….txt         Site-ownership key file. It must stay at the root.
  imediagenius_beta_v1.apk   App download linked from the home page

assets/
  css/studio.css        Shared shell: navigation, layout, hubs, topic and course pages
  css/studio-game.css   The dark "stage" skin for every game and exam tool
  css/studio-page.css   Help and legal pages
  css/*.css             Per-game styles (plus host.css/topic.css for the R093 pages)
  js/studio.js          Shared shell: builds the nav, breadcrumbs, course progress and guide rail
  js/game-shell.js      Shared game bar: tracking status, live score, links back to the arcade
  js/*.js               Per-game logic and data, Firebase config, engagement tracker
  img/brand/            Logo mark (SVG), app icons and the social sharing card

data/
  flashcards/NN_flashcards.csv   Flashcards loaded by each topic page
  exams/                         June 2025 exam questions and mark-scheme spec

img/                    R093 images (topic heroes, infographics, exam figures)
audio/                  R093 topic podcasts
r094/                   R094 graphics project: 15 guides, downloads, images
r097/                   R097 website project: 21 guides, downloads, images
r097-dreamweaver/       Dreamweaver build guide (15 video steps)
tools/                  iMedia Tools menu: PhotoCraft, VectorCraft, Voice Studio
plagiarism_ai_detector/ Standalone teacher tool (not linked from the site)
scripts/                Maintenance scripts (below)
```

## How pages are put together

Every page loads `assets/css/studio.css` and `assets/js/studio.js`. The `<body>` tells the shell
what kind of page it is:

| Page type | `<body>` attributes | Extra stylesheet |
| --- | --- | --- |
| R093 home / topic | `class="studio-site studio-home"` or `studio-topic`, `data-course="r093"` | none |
| R094 / R097 guide | `class="studio-site …" data-course="r094"` (or `r097`) | none |
| Game or exam tool | `class="studio-game" data-course="r093" data-studio-mode="game"` | `studio-game.css` |
| Help / legal | `class="studio-site studio-page" data-studio-mode="page"` | `studio-page.css` |
| Dreamweaver guide | `class="studio-site studio-guide" data-studio-mode="guide" data-root="../"` | guide's own `style.css` |
| iMedia Tools | `data-course="tools" data-studio-mode="tools" data-root="../"` | `tools/tools.css` |

`data-root` is the path back to the site root; it's only needed for pages in sub-folders that
aren't R094/R097.

## Adding or changing pages

1. Copy an existing page of the same type (for a new game, copy a similar game and its CSS/JS).
2. Run `node scripts/apply-studio-shell.mjs`. It adds any missing shell links, body attributes and
   icons, and moves a new game's navy colours onto the studio palette. Running it again changes
   nothing.
3. Add the page to `index.html` (games list or topic grid) if students should find it there.
4. Regenerate the sitemap (step 2 of the script below).

## Scripts

- `scripts/apply-studio-shell.mjs`: brings every page onto the shared shell (see above).
- `scripts/safe_seo_head_update.py`: SEO head tags, `sitemap.xml` and `robots.txt`. To rebuild only
  the sitemap: `python -c "import sys; sys.path.insert(0,'scripts'); import safe_seo_head_update as s; from pathlib import Path; s.update_sitemap(Path('.'))"`
- `scripts/test-studio.cjs`: browser check of every page at desktop and phone widths (headings,
  navigation, overflow, JS errors, missing files, broken links) plus the R093 tracker, flashcards
  and R094/R097 progress workflows. Serve the folder over HTTP first, then:
  `STUDIO_PREVIEW=http://127.0.0.1:4187 NODE_PATH=<playwright>/node_modules node scripts/test-studio.cjs`

## Progress and data

- The R093 tracker keeps its original local-storage keys.
- R094/R097 completion: `imediaStudioProgress:r094:v1` and `imediaStudioProgress:r097:v1`.
  Students can export and import their progress from each course hub.
- Everything is stored in the student's browser. Game scores are tracked by the worksheet app
  (`imediagenius.web.app`).

## iMedia Tools

The tools page links to the live deployments, which build and update from their own repositories:

- PhotoCraft: https://jconnolly84.github.io/photocraft/ (repo `jconnolly84/photocraft`)
- VectorCraft: https://jconnolly84.github.io/vectorcraft/ (repo `jconnolly84/vectorcraft`)
- Voice Studio: https://jconnolly84.github.io/voice-studio/ (repo `jconnolly84/voice-studio`)

They're linked rather than copied in because PhotoCraft and VectorCraft are about 700 MB together
and are staged by their own Actions workflows. This site is already over GitHub Pages' 1 GB
published-size guideline. The tool icons in `tools/img/` come from those projects (Apache-2.0/MIT).

## Known content gaps

- The games request sound effects (`sfx-correct.mp3`, `sfx-wrong.mp3`, `sfx-start.mp3`,
  `sfx-gameover.mp3`, and `sfx/*.mp3` for Research Methods) that have never been added, so the
  games play silently.

## Backups

A full copy of the site from before the November 2026 redesign is at
`C:\Users\jamco\Desktop\Exam App\live\imedia-backup-before-redesign-20261106-105757`. Git
history holds every earlier version, including all files removed in the clean-up.

## Artwork

- `img/studio-hero.webp`: course hero artwork (original PNG kept as `img/studio-hero.png`).
- `assets/img/brand/`: the iMedia Genius mark. Ink tile, a lowercase *i* with a lime dot and an
  open-ring *G*. Colours: ink `#202322`, paper `#f5f6f3`, lime `#e5f570`, coral `#ff927c`,
  teal `#8be0d0`.
- `img/imedia_genius_logo_transparent.png`: the previous shield logo. It's no longer used by the
  site, but kept in case the worksheet app or APK loads it by URL.
- Icons: Lucide 0.468.0 (ISC licence), bundled at `assets/js/lucide.min.js`.
