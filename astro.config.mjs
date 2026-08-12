// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://nazayuwe.com',
  trailingSlash: 'always',
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      wrap: true,
    },
  },
  // The sitemap is a route (src/pages/sitemap.xml.ts) rather than an
  // integration, so entries can carry real `lastmod` dates from frontmatter
  // and declare translated pairs via hreflang alternates.
  //
  // Old Jekyll permalinks are kept alive as literal .html files in public/.
  // Astro's `redirects` option would emit them as directories
  // (`/2020/05/16/cloud.html/index.html`), which GitHub Pages does not serve
  // for the exact original URL.
});
