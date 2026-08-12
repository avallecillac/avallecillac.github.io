import { site, author, streams } from '../site';
import { getPosts, postPath } from '../posts';

/**
 * llms.txt — a plain-text map of the site for language models.
 *
 * Crawlers built for AI answer engines have to reconstruct what a site is from
 * HTML written for browsers. This hands them the answer directly: who wrote
 * this, what is on it, and where the full text of each piece lives. Cheap to
 * serve, and it costs nothing if a given engine ignores it.
 *
 * Format follows the llms.txt convention: https://llmstxt.org
 */
export const GET = async () => {
  const abs = (path: string) => new URL(path, site.url).href;

  const lines: string[] = [
    `# ${site.title}`,
    '',
    `> ${site.blurb}`,
    '',
    `Written by ${author.name}, ${author.jobTitle} in ${author.location}. ${author.bio}`,
    `Author profile: ${abs('/about/')}`,
    `Contact: ${author.email}`,
    '',
    'The full text of every post is available at /llms-full.txt.',
    'Content is licensed for citation with attribution to the author and a link to the source URL.',
    '',
  ];

  for (const stream of streams) {
    const streamPosts = (await getPosts(stream.collection)).filter((p) => !p.data.noindex);
    if (streamPosts.length === 0) continue;

    lines.push(`## ${stream.title}`, '', `${stream.description}`, '');
    for (const post of streamPosts) {
      const date = post.data.date.toISOString().slice(0, 10);
      lines.push(
        `- [${post.data.title}](${abs(postPath(post))}): ${post.data.description ?? ''} (published ${date}, language: ${post.data.lang})`,
      );
    }
    lines.push('');
  }

  lines.push('## Other pages', '', `- [About ${author.name}](${abs('/about/')}): ${author.bio}`, '');

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
