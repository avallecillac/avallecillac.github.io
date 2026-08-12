import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

// Shared shape for anything I publish. Keep the required set small — title,
// date, description — so writing a post stays a three-line frontmatter job.
// Everything else is optional and improves how the post is understood by
// search engines and AI answer engines.
const base = z.object({
  title: z.string(),
  date: z.coerce.date(),
  /**
   * The snippet search engines and feed readers show. Required on anything
   * published: without it Google invents one from the page text, usually
   * badly. Aim for 120-158 characters.
   */
  description: z.string().optional(),
  /** Drives <html lang>, date formatting and og:locale. */
  lang: z.enum(['en', 'es']).default('en'),
  tags: z.array(z.string()).default([]),
  /** Set to true to keep a post out of listings, feeds, sitemap and llms.txt. */
  draft: z.boolean().default(false),
  /** Shown alongside `date` when a post is meaningfully revised. */
  updated: z.coerce.date().optional(),
  /**
   * Three to five self-contained sentences summarising the post. Rendered as a
   * "Key points" box and fed to structured data — this is the part an AI answer
   * engine is most likely to lift and cite.
   */
  takeaways: z.array(z.string()).default([]),
  /**
   * Posts sharing a translationKey are versions of each other in different
   * languages. Used to emit hreflang links so search engines serve the right
   * one and don't read them as duplicate content.
   */
  translationKey: z.string().optional(),
  /** Social card override. Absolute path under public/, e.g. "/images/x.png". */
  ogImage: z.string().startsWith('/').optional(),
  /** Keeps a page out of search results while leaving it reachable. */
  noindex: z.boolean().default(false),
});

/** Checks that only make sense once the whole post is in view. */
const validate = <T extends typeof base>(schema: T) =>
  schema.superRefine((data, ctx) => {
    // Drafts are allowed to be incomplete; published posts are not.
    if (!data.draft && !data.description) {
      ctx.addIssue({
        code: 'custom',
        path: ['description'],
        message:
          'A published post needs a `description` — it is the search-result and feed snippet. Add one, or set `draft: true` while you work on it.',
      });
    }
    if (data.updated && data.updated < data.date) {
      ctx.addIssue({
        code: 'custom',
        path: ['updated'],
        message: '`updated` cannot be earlier than `date`.',
      });
    }
  });

const tech = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/tech' }),
  schema: validate(base),
});

const ficcion = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/ficcion' }),
  // Fiction is written in Spanish unless a post says otherwise.
  schema: validate(base.extend({ lang: z.enum(['en', 'es']).default('es') })),
});

export const collections = { tech, ficcion };
