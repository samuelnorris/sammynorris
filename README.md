# sammynorris.com

Personal portfolio for Sammy Norris, Senior Product Designer.
Built with [Astro](https://astro.build), hand-written CSS, and deployed on Vercel.

## Stack

- **Astro 6** (`output: 'server'`, pages prerendered except the gated `/commission`)
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

| Variable              | Purpose                                                       |
| --------------------- | ------------------------------------------------------------- |
| `COMMISSION_PASSWORD` | Optional override for the `/commission` case study password.  |

If it's unset, the default password in `src/middleware.ts` is used. To
override it, set it locally in `.env` (copy `.env.example`) and on Vercel
under Project Settings → Environment Variables.

## Structure

```text
src/
├── components/   # ThemeToggle, BackButton
├── layouts/      # Layout (base), CaseStudyLayout
├── pages/        # index, about, + 6 case studies
├── styles/       # global.css, case-study.css
└── middleware.ts # password gate for /commission
```
