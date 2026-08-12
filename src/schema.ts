/**
 * JSON-LD builders.
 *
 * Structured data is the single highest-leverage thing on this site for both
 * search engines and AI answer engines: it states, unambiguously and in a
 * format built for machines, what a page is, who wrote it, when, in what
 * language, and what it says. Everything else on a page has to be inferred.
 */
import { site, author, streamFor } from './site';
import { postPath, wordCount, type Post } from './posts';

const abs = (path: string) => new URL(path, site.url).href;

const personSchema = {
  '@type': 'Person',
  '@id': abs('/#author'),
  name: author.name,
  jobTitle: author.jobTitle,
  description: author.bio,
  email: `mailto:${author.email}`,
  url: author.url,
  sameAs: [...author.sameAs],
  knowsAbout: [
    'Cloud computing',
    'Amazon Web Services',
    'DevOps',
    'Infrastructure as code',
    'Automation',
    'Linux',
    'Containers',
    'Serverless',
  ],
} as const;

const websiteSchema = {
  '@type': 'WebSite',
  '@id': abs('/#website'),
  url: site.url,
  name: site.title,
  description: site.blurb,
  inLanguage: ['en', 'es'],
  publisher: { '@id': abs('/#author') },
} as const;

/** Wraps nodes in a single @graph so the whole page is one connected object. */
const graph = (nodes: object[]) => ({ '@context': 'https://schema.org', '@graph': nodes });

/** Home page: who this is and what the site is. */
export const websiteGraph = () => graph([websiteSchema, personSchema]);

/** About page: the author is the subject of the page. */
export const aboutGraph = () =>
  graph([
    websiteSchema,
    personSchema,
    {
      '@type': 'AboutPage',
      '@id': abs('/about/#page'),
      url: abs('/about/'),
      name: `About ${author.name}`,
      isPartOf: { '@id': abs('/#website') },
      mainEntity: { '@id': abs('/#author') },
    },
  ]);

/** A stream index is a Blog whose posts are listed in order. */
export const streamGraph = (collection: 'tech' | 'ficcion', posts: Post[]) => {
  const stream = streamFor(collection);
  return graph([
    websiteSchema,
    personSchema,
    {
      '@type': 'Blog',
      '@id': abs(`${stream.href}#blog`),
      url: abs(stream.href),
      name: `${stream.title} — ${site.title}`,
      description: stream.description,
      inLanguage: stream.lang,
      isPartOf: { '@id': abs('/#website') },
      author: { '@id': abs('/#author') },
      blogPost: posts.map((post) => ({
        '@type': 'BlogPosting',
        '@id': abs(`${postPath(post)}#post`),
        headline: post.data.title,
        url: abs(postPath(post)),
        datePublished: post.data.date.toISOString(),
      })),
    },
  ]);
};

/**
 * A post. `BlogPosting` plus a breadcrumb trail, and — when the post declares
 * takeaways — those same points restated so an answer engine can lift a
 * specific, attributable claim rather than guessing from prose.
 */
export const postGraph = (post: Post, ogImageUrl: string) => {
  const stream = streamFor(post.collection);
  const url = abs(postPath(post));
  const { title, description, date, updated, lang, tags, takeaways } = post.data;

  const nodes: object[] = [
    websiteSchema,
    personSchema,
    {
      '@type': 'BlogPosting',
      '@id': `${url}#post`,
      isPartOf: { '@id': abs('/#website') },
      mainEntityOfPage: url,
      url,
      headline: title,
      description,
      inLanguage: lang,
      datePublished: date.toISOString(),
      dateModified: (updated ?? date).toISOString(),
      author: { '@id': abs('/#author') },
      publisher: { '@id': abs('/#author') },
      image: ogImageUrl,
      articleSection: stream.title,
      keywords: tags.join(', '),
      wordCount: wordCount(post),
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumbs`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: site.title, item: abs('/') },
        { '@type': 'ListItem', position: 2, name: stream.title, item: abs(stream.href) },
        { '@type': 'ListItem', position: 3, name: title, item: url },
      ],
    },
  ];

  if (takeaways.length > 0) {
    nodes.push({
      '@type': 'ItemList',
      '@id': `${url}#takeaways`,
      name: lang === 'es' ? 'Puntos clave' : 'Key points',
      itemListElement: takeaways.map((point, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: point,
      })),
    });
  }

  return graph(nodes);
};
