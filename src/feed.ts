import rss from '@astrojs/rss';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { render } from 'astro:content';
import { site, author } from './site';
import { postPath, type Post } from './posts';

/**
 * Renders each post's Markdown to HTML so the feed carries the full article,
 * not just a teaser. Feed readers and the crawlers that ingest RSS then have
 * the whole text without needing to fetch and parse the page.
 */
async function renderPosts(posts: Post[]) {
  const container = await AstroContainer.create();
  return Promise.all(
    posts.map(async (post) => {
      const { Content } = await render(post);
      const html = await container.renderToString(Content);
      return { post, html };
    }),
  );
}

/** Turns a list of posts into an RSS response. Used by every feed endpoint. */
export async function feed(opts: { title: string; description: string; posts: Post[] }) {
  const rendered = await renderPosts(opts.posts);

  return rss({
    title: opts.title,
    description: opts.description,
    site: site.url,
    // Match the site's `trailingSlash: 'always'` so feed links and canonical
    // URLs agree — otherwise readers treat them as two different pages.
    trailingSlash: true,
    items: rendered.map(({ post, html }) => ({
      title: post.data.title,
      description: post.data.description ?? '',
      pubDate: post.data.date,
      link: postPath(post),
      categories: post.data.tags,
      author: `${author.email} (${author.name})`,
      content: html,
    })),
    customData: `<language>en</language><copyright>© ${author.name}</copyright>`,
  });
}
