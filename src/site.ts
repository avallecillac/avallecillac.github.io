/** Everything that is "about me" rather than "about a post" lives here. */
export const site = {
  title: 'nazayuwe',
  tagline: 'Explaining tech to humans kindly',
  /** Longer, self-contained description. Used on the home page and in llms.txt. */
  blurb:
    'Personal site of Alejandro Vallecilla, a cloud engineer in Amsterdam. Plain-language explanations of cloud and infrastructure concepts in English, and fiction in Spanish.',
  url: 'https://nazayuwe.com',
  /** Social-card image for pages that do not set their own. Lives in public/. */
  ogImage: '/og.png',
} as const;

/**
 * Author identity. Search engines and AI answer engines weigh who wrote
 * something, so this is stated explicitly rather than left implicit.
 */
export const author = {
  name: 'Alejandro Vallecilla',
  jobTitle: 'Cloud Engineer',
  location: 'Amsterdam, The Netherlands',
  email: 'avallecillac@gmail.com',
  bio: 'Cloud engineer with over ten years in the field, working with AWS, infrastructure, DevOps and automation.',
  url: 'https://nazayuwe.com/about/',
  /** `sameAs` in structured data — how machines link this person across sites. */
  sameAs: [
    'https://github.com/avallecillac',
    'https://www.linkedin.com/in/avallecillac/',
  ],
  social: {
    github: 'https://github.com/avallecillac',
    linkedin: 'https://www.linkedin.com/in/avallecillac/',
  },
} as const;

/** The two writing streams, in nav order. */
export const streams = [
  {
    collection: 'tech' as const,
    href: '/tech/',
    label: 'Tech',
    lang: 'en',
    title: 'Tech',
    description:
      'Cloud, infrastructure and everyday technology explained in plain language, without jargon.',
  },
  {
    collection: 'ficcion' as const,
    href: '/ficcion/',
    label: 'Ficción',
    lang: 'es',
    title: 'Ficción',
    description: 'Relatos y ficción breve, en español.',
  },
];

export function streamFor(collection: string) {
  const found = streams.find((s) => s.collection === collection);
  if (!found) throw new Error(`No stream configured for collection "${collection}"`);
  return found;
}

export function formatDate(date: Date, lang: string) {
  return new Intl.DateTimeFormat(lang === 'es' ? 'es-ES' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

/** BCP 47 / Open Graph locale codes. */
export const localeFor = (lang: string) => (lang === 'es' ? 'es_ES' : 'en_GB');
