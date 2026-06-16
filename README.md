# sammynorris.com

Personal portfolio for Sammy Norris, Senior Product Designer.
Built with [Astro](https://astro.build), hand-written CSS, and deployed on Vercel.

## Stack

- **Astro 6** (`output: 'server'`); a password gate in `src/middleware.ts` protects the deployed site
- **Vercel** adapter for deployment
- Custom CSS with design tokens in `src/styles/global.css` (no UI framework)
- Fonts: Instrument Serif + Geist (Google Fonts)

## Develop

```sh
npm install
npm run dev            # http://localhost:4321
```

## Commands

| Command           | Action                                |
| ----------------- | ------------------------------------- |
| `npm run dev`     | Start the local dev server            |
| `npm run build`   | Build the production site to `./dist` |
| `npm run preview` | Preview the production build locally  |

## Environment variables

| Variable        | Purpose                                                                          |
| --------------- | -------------------------------------------------------------------------------- |
| `SITE_PASSWORD` | Password for the gated site. If unset in production, the gate fails closed.       |

Set it on Vercel under Project Settings → Environment Variables, and locally
in `.env` (copy `.env.example`). Local `astro dev` skips the gate entirely.

## Structure

```text
src/
├── components/   # ThemeToggle, BackButton
├── layouts/      # Layout (base), CaseStudyLayout
├── pages/        # index, about, + 6 case studies
├── styles/       # global.css, case-study.css
└── middleware.ts # password gate for /commission
```
