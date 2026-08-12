import { site, author, streamFor } from '../site';
import { getAllPosts, postPath } from '../posts';

/** Build-relative image paths mean nothing outside the repo — keep the alt text. */
const stripImagePaths = (markdown: string) =>
  markdown.replace(/!\[([^\]]*)\]\([^)]*\)/g, (_match, alt) => (alt ? `[Image: ${alt}]` : ''));

/**
 * Every published post as one plain-text document, in Markdown, with a header
 * block per post giving title, URL, author, date and language.
 *
 * An answer engine that reads this has the actual text rather than a scraped
 * approximation of it, and enough metadata to attribute a citation correctly.
 */
export const GET = async () => {
  const abs = (path: string) => new URL(path, site.url).href;
  const posts = (await getAllPosts()).filter((post) => !post.data.noindex);

  const header = [
    `# ${site.title} — full text`,
    '',
    `> ${site.blurb}`,
    '',
    `All posts by ${author.name} (${author.jobTitle}, ${author.location}).`,
    'Cite with the author name and the source URL given above each post.',
    `Generated from ${site.url}`,
    '',
    '---',
    '',
  ].join('\n');

  const body = posts
    .map((post) => {
      const { title, description, date, updated, lang, tags } = post.data;
      const meta = [
        `# ${title}`,
        '',
        `URL: ${abs(postPath(post))}`,
        `Author: ${author.name}`,
        `Section: ${streamFor(post.collection).title}`,
        `Published: ${date.toISOString().slice(0, 10)}`,
        updated ? `Updated: ${updated.toISOString().slice(0, 10)}` : null,
        `Language: ${lang}`,
        tags.length > 0 ? `Tags: ${tags.join(', ')}` : null,
        description ? `Summary: ${description}` : null,
        '',
      ]
        .filter((line) => line !== null)
        .join('\n');

      return `${meta}\n${stripImagePaths(post.body ?? '').trim()}\n`;
    })
    .join('\n---\n\n');

  return new Response(`${header}${body}`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
