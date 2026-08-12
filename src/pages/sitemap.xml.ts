import { site, streams } from '../site';
import { getAllPosts, getPosts, postPath, type Post } from '../posts';

/**
 * Hand-rolled instead of @astrojs/sitemap so that entries carry a real
 * `lastmod` taken from post frontmatter, `noindex` pages are left out, and
 * translated posts declare each other via xhtml:link alternates.
 */

const abs = (path: string) => new URL(path, site.url).href;
const day = (date: Date) => date.toISOString().slice(0, 10);

const escape = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

interface Entry {
  path: string;
  lastmod?: Date;
  changefreq: string;
  priority: string;
  alternates?: Array<{ lang: string; path: string }>;
}

function render(entries: Entry[]) {
  const urls = entries
    .map((entry) => {
      const alternates = (entry.alternates ?? [])
        .map(
          (alt) =>
            `\n    <xhtml:link rel="alternate" hreflang="${escape(alt.lang)}" href="${escape(abs(alt.path))}"/>`,
        )
        .join('');
      const lastmod = entry.lastmod ? `\n    <lastmod>${day(entry.lastmod)}</lastmod>` : '';
      return `  <url>
    <loc>${escape(abs(entry.path))}</loc>${lastmod}
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>${alternates}
  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;
}

export const GET = async () => {
  const posts = await getAllPosts();
  const indexed = posts.filter((post) => !post.data.noindex);
  const newest = (list: Post[]) => list[0]?.data.updated ?? list[0]?.data.date;

  // Posts sharing a translationKey point at each other.
  const byKey = new Map<string, Post[]>();
  for (const post of indexed) {
    const key = post.data.translationKey;
    if (!key) continue;
    byKey.set(key, [...(byKey.get(key) ?? []), post]);
  }

  const entries: Entry[] = [
    { path: '/', lastmod: newest(indexed), changefreq: 'weekly', priority: '1.0' },
    { path: '/about/', changefreq: 'yearly', priority: '0.5' },
  ];

  for (const stream of streams) {
    const streamPosts = (await getPosts(stream.collection)).filter((p) => !p.data.noindex);
    entries.push({
      path: stream.href,
      lastmod: newest(streamPosts),
      changefreq: 'weekly',
      priority: '0.8',
    });
  }

  for (const post of indexed) {
    const siblings = (byKey.get(post.data.translationKey ?? '') ?? []).filter((o) => o !== post);
    entries.push({
      path: postPath(post),
      lastmod: post.data.updated ?? post.data.date,
      changefreq: 'monthly',
      priority: '0.7',
      alternates:
        siblings.length > 0
          ? [
              { lang: post.data.lang, path: postPath(post) },
              ...siblings.map((o) => ({ lang: o.data.lang, path: postPath(o) })),
            ]
          : undefined,
    });
  }

  return new Response(render(entries), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
