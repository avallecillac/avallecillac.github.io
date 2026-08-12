# nazayuwe.com

Personal site of Alejandro Vallecilla. Built with [Astro](https://astro.build), written in
Markdown, deployed to GitHub Pages.

## Writing a post

1. Create a Markdown file in the right folder:
   - `src/content/tech/` — tech writing, English → published at `/tech/<filename>/`
   - `src/content/ficcion/` — fiction, Spanish → published at `/ficcion/<filename>/`

   **The file name is the URL.** `src/content/tech/kubernetes-for-humans.md` becomes
   `nazayuwe.com/tech/kubernetes-for-humans/`. Use lowercase and hyphens, no dates, no spaces.

2. Start it with frontmatter:

   ```markdown
   ---
   title: "Kubernetes, in human words"
   date: 2026-08-12
   description: "One sentence for search results and the post list."
   ---

   Write here.
   ```

3. Commit and push to `master`. GitHub Actions builds and deploys it.

### Frontmatter reference

| Field            | Required | Default                 | What it does                                                            |
| ---------------- | -------- | ----------------------- | ----------------------------------------------------------------------- |
| `title`          | yes      | —                       | Post title                                                               |
| `date`           | yes      | —                       | Publication date, `YYYY-MM-DD`. Sorts the listings.                      |
| `description`    | yes\*    | —                       | The search-result and feed snippet. Aim for 120–158 characters.          |
| `lang`           | no       | `en` tech, `es` ficción | Sets `<html lang>`, date formatting and `og:locale`                      |
| `tags`           | no       | `[]`                    | e.g. `["aws", "basics"]`. Also feeds related posts.                      |
| `draft`          | no       | `false`                 | `true` hides it from the live site, still visible in `npm run dev`       |
| `updated`        | no       | —                       | Shown next to the date, and becomes `dateModified` for search engines    |
| `takeaways`      | no       | `[]`                    | 3–5 summary sentences. See below — this is the highest-value optional field. |
| `translationKey` | no       | —                       | Posts sharing a key are translations of each other; emits hreflang links |
| `ogImage`        | no       | `/og.png`               | Social card override, e.g. `/images/my-card.png`                         |
| `noindex`        | no       | `false`                 | Keeps a page out of search results and `llms.txt`                        |

\* Required only on published posts. Drafts can go without one while you work.

A bad or missing field fails the build with a clear message rather than publishing something
broken — that's the point of the schema in `src/content.config.ts`.

### `takeaways` — worth the two minutes

Three to five self-contained sentences summarising the post. They render as a "Key points" box
under the title, and go into the page's structured data as an `ItemList`.

```yaml
takeaways:
  - "A datacenter is a large building full of powerful computers, kept cool the same way a fridge keeps food from spoiling."
  - "The largest cloud providers are Amazon Web Services, Microsoft Azure and Google Cloud Platform."
```

Write each one so it still makes sense pulled out of context, with the subject named rather than
referred to as "it" or "this". That is what an AI answer engine quotes, and what a reader skims.

### Images

Put them in `src/assets/images/<topic>/` and reference them with a **relative** path:

```markdown
![Describe what the image shows](../../assets/images/cloud/fridge-sm.png)
```

Images under `src/` get built properly: converted to WebP, given `width`/`height` so the page
doesn't jump while loading, and lazy-loaded. (The three images in the cloud post went from 518KB
to 177KB this way.) Anything in `public/` is served untouched — fine for one-offs, but prefer
`src/assets/`.

Always write real alt text — screen readers announce it, it shows when the image fails to load,
and it's what image search indexes.

## Running it locally

Requires Node 22.12 or newer.

```bash
npm install
npm run dev
```

Then open http://localhost:4321. Edits reload instantly, drafts are visible.

| Command           | What it does                                    |
| ----------------- | ----------------------------------------------- |
| `npm run dev`     | Local dev server with live reload               |
| `npm run build`   | Production build into `dist/`                   |
| `npm run preview` | Serve the built `dist/` to check it before push |
| `npm run check`   | Type-check frontmatter, links and components    |

## How it's put together

```
src/
  content/tech/       English tech posts (Markdown)
  content/ficcion/    Spanish fiction (Markdown)
  assets/images/      Post images — optimised at build time
  content.config.ts   Frontmatter schema — the rules for a valid post
  site.ts             Site title, author identity, the two streams, date formatting
  posts.ts            Fetching, sorting, draft filtering, reading time, related posts
  schema.ts           JSON-LD builders (structured data)
  feed.ts             Shared RSS builder — renders full post HTML into the feed
  layouts/            Base.astro (page shell + all meta), Post.astro (article shell)
  components/         PostList.astro
  pages/              Routes. A file here is a URL.
  styles/global.css   All the styling, in one file
public/               Copied to the site root as-is (CNAME, robots.txt, og.png, favicon)
```

Machine-readable endpoints, all generated from the posts:

| URL              | For                                                             |
| ---------------- | --------------------------------------------------------------- |
| `/rss.xml`       | Everything, full article text included                            |
| `/tech/rss.xml`  | Tech only                                                         |
| `/ficcion/rss.xml` | Fiction only                                                    |
| `/sitemap.xml`   | Search engines. Real `lastmod` dates, hreflang pairs.             |
| `/llms.txt`      | AI answer engines — an index of the site ([llmstxt.org](https://llmstxt.org)) |
| `/llms-full.txt` | Every post's full text with attribution metadata                  |
| `/robots.txt`    | Crawl policy, including a per-bot list of AI crawlers             |

## SEO and AI answer engines

Per page, automatically: canonical URL, Open Graph and Twitter card meta, social card image,
and JSON-LD structured data (`BlogPosting`, `Person`, `BreadcrumbList`, and an `ItemList` of the
takeaways). Posts sharing a `translationKey` cross-declare with `hreflang` so search engines
serve the right language instead of treating the pair as duplicate content.

`public/robots.txt` lists the AI crawlers individually rather than leaving them to the wildcard,
so the choice is visible. All are currently allowed. The comments there explain the split between
crawlers that cite you and crawlers that only take training data — flip either group to
`Disallow: /` if you change your mind.

Two things not done, deliberately:

- **Tag pages.** They'd add internal linking, but with a handful of posts each page would be
  near-empty, and thin pages hurt more than the links help. Worth adding past ~15 posts.
- **Per-post social cards.** Every page currently shares `public/og.png`. Generating one per
  post needs a rendering dependency at build time; the shared card costs nothing and social
  cards aren't a ranking signal. Set `ogImage` on a post to override it.

## Deployment

Pushing to `master` triggers `.github/workflows/deploy.yml`, which builds the site and
publishes it to GitHub Pages. `public/CNAME` keeps the custom domain attached on every deploy.

Old Jekyll permalinks are redirected in `astro.config.mjs` so existing links keep working.
