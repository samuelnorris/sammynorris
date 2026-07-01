// @ts-check
import { defineConfig } from 'astro/config';

import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://www.sammynorris.com',
  // Fully static site (the default) — every page is prerendered at build
  // time and served from Vercel's CDN. The adapter is kept for deployment.
  adapter: vercel()
});
