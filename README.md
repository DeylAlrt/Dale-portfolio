# Dale Alerta portfolio

Plain HTML, CSS and JavaScript. No build step.

## Files

| File | What's in it |
|---|---|
| `index.html` | All the content: text, projects, links, experience |
| `css/style.css` | All the styling. Colours and fonts are variables at the top (`:root`) |
| `js/main.js` | Animations, scroll effects, live project frames, the edit toolbar |

## Edit it in VS Code

1. Open this folder in VS Code (File → Open Folder).
2. Install **Live Server** when VS Code suggests it (or from the Extensions tab).
3. Right-click `index.html` → **Open with Live Server**. The site opens in your browser and refreshes every time you save.

## Common edits

- **Text, projects, experience:** search for the words in `index.html` and change them.
- **Colours:** in `css/style.css`, change the values in `:root` at the top (`--red`, `--black`, `--ink`).
- **A project's live frame:** each project in `index.html` has a `data-src="..."` on its `<iframe>`. Change that link.
- **Highlights under a project:** the `<ul class="hl">` list inside that project.

## Put it online with Vercel

1. Create a GitHub repository and upload this folder's files (or use GitHub Desktop).
2. On vercel.com, choose Add New → Project, import the repository, and press Deploy.

## Before you share it

- **Résumé:** save it as `Dale-Alerta-Resume.pdf` in this folder (next to `index.html`). The three Résumé buttons (nav, hero, contact) stay hidden until that file exists, then appear on their own.
- **Link previews:** the two `og:` lines at the top of `index.html` point to `https://dale-alerta.vercel.app`. If you move to another address (like your own domain), update them, or LinkedIn and WhatsApp won't show the preview image (`img/og.jpg`).
- **Project screenshots** are in `img/work/`. They show before a visitor clicks "Load live preview". Retake them when a project's design changes.

## Photos

The cut-out photos live in `img/` as WebP (transparent background, 707×1000):

| File | Where |
|---|---|
| `hero-1.webp` | Hero, frame 1: the jump that slides in from the right |
| `hero-2.webp` | Hero, frame 2: standing wave |
| `about-1.webp` | About laptop, frame 1: reaching up as it rises |
| `about-2.webp` | About laptop, frame 2: thumbs up |

To swap one, export a transparent image at the same 1414×2000 (or 707×1000) canvas and keep the file name. The jump shot is scaled up 1.35× in `css/style.css` (`.actor .fr.f1 img`) so its size matches frame 2; adjust that if a new photo is framed differently. The About crop is set by `.lap-in` (`width` and `bottom`).
