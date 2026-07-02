# sammynorris.com

Personal portfolio for Sammy Norris, Senior Product Designer.
Built with [Astro](https://astro.build), hand-written CSS, and deployed on Vercel.

## Stack

- **Astro 6**, fully static output (every page prerendered at build time)
- **Vercel** adapter for deployment
- Custom CSS with design tokens in `src/styles/global.css` (no UI framework)
- Fonts: Instrument Serif + Geist (Google Fonts)

## Develop

```sh
npm install
npm run dev            # http://localhost:4321
```

## Commands

| Command           | Action                                       |
| ----------------- | -------------------------------------------- |
| `npm run dev`     | Start the local dev server                   |
| `npm run build`   | Type-check, then build the production site   |
| `npm run check`   | Run `astro check` (types) on its own         |
| `npm run preview` | Preview the production build locally         |

## Structure

```text
src/
├── components/   # ThemeToggle, BackButton, Footer, BmxBike
├── layouts/      # Layout (base), CaseStudyLayout
├── pages/        # index, about, 6 case studies, + /bmx easter egg
├── scripts/      # reveal.ts (shared scroll-reveal)
└── styles/       # global.css, case-study.css
```
