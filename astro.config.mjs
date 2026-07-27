// @ts-check
import { defineConfig } from 'astro/config';

import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://www.sammynorris.com',
  // On-demand rendering, so the password gate in src/middleware.ts runs on
  // every request. Prerendered pages are served straight from the CDN and
  // would skip middleware entirely, which is why this isn't 'static'.
  // Revert to the default static build once the gate is removed.
  output: 'server',
  adapter: vercel()
});
