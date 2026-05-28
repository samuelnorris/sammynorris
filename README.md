# sammynorris.com

Personal portfolio for Sammy Norris — Senior Product Designer.
Built with [Astro](https://astro.build), hand-written CSS, and deployed on Vercel.

## Stack

- **Astro 6** (`output: 'server'`, pages prerendered except the gated `/commission`)
- **Vercel** adapter for deployment
- Custom CSS with design tokens in `src/styles/global.css` (no UI framework)
- Fonts: Instrument Serif + Geist (Google Fonts)

## Develop

```sh
npm install
cp .env.example .env   # then set COMMISSION_PASSWORD
npm run dev            # http://localhost:4321
```

## Commands

| Command           | Action                                |
| ----------------- | ------------------------------------- |
| `npm run dev`     | Start the local dev server            |
| `npm run build`   | Build the production site to `./dist` |
| `npm run preview` | Preview the production build locally  |

## Environment variables

| Variable              | Purpose                                              |
| --------------------- | --------------------------------------------------- |
| `COMMISSION_PASSWORD` | Password for the gated `/commission` case study.    |

Set it locally in `.env` and on Vercel under Project Settings → Environment
Variables. If it's unset the commission page stays locked for everyone.

## Structure

```text
src/
├── components/   # ThemeToggle, BackButton
├── layouts/      # Layout (base), CaseStudyLayout
├── pages/        # index, about, + 6 case studies
├── styles/       # global.css, case-study.css
└── middleware.ts # password gate for /commission
```
