// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://www.sammynorris.com',
  output: 'server',

  vite: {
    plugins: [tailwindcss()]
  },

  adapter: vercel()
});