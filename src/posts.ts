import { getCollection, type CollectionEntry } from 'astro:content';
import { streams, streamFor } from './site';

export type Post = CollectionEntry<'tech' | 'ficcion'>;

/** Drafts are visible while writing locally, never in a production build. */
const isPublished = (post: Post) => import.meta.env.DEV || !post.data.draft;

const newestFirst = (a: Post, b: Post) => b.data.date.valueOf() - a.data.date.valueOf();

/** Published posts from one stream, newest first. */
export async function getPosts(collection: 'tech' | 'ficcion'): Promise<Post[]> {
  const posts = await getCollection(collection, isPublished);
  return posts.sort(newestFirst);
}

/** Published posts from every stream, newest first. */
export async function getAllPosts(): Promise<Post[]> {
  const perStream = await Promise.all(streams.map((s) => getPosts(s.collection)));
  return perStream.flat().sort(newestFirst);
}

/** The canonical path for a post, derived from its collection and file name. */
export function postPath(post: Post): string {
  return `${streamFor(post.collection).href}${post.id}/`;
}

/** Rough word count from the raw Markdown, used for reading time and schema. */
export function wordCount(post: Post): number {
  const text = (post.body ?? '')
    .replace(/```[\s\S]*?```/g, ' ') // code blocks
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // link text only
    .replace(/[#*_>`~|-]/g, ' ');
  return text.split(/\s+/).filter(Boolean).length;
}

/** Reading time in whole minutes, floored at 1. */
export const readingTime = (post: Post) => Math.max(1, Math.round(wordCount(post) / 200));

/**
 * Other-language versions of a post, matched on `translationKey`. Emitted as
 * hreflang links so search engines serve the right one instead of picking a
 * winner and treating the other as duplicate content.
 */
export async function getTranslations(post: Post): Promise<Post[]> {
  const key = post.data.translationKey;
  if (!key) return [];
  const all = await getAllPosts();
  return all.filter(
    (other) => other.data.translationKey === key && postPath(other) !== postPath(post),
  );
}

/**
 * Posts related to this one, most-shared-tags first, same language preferred.
 * Gives every post inbound internal links, which is how crawlers find and
 * weigh deeper pages.
 */
export async function getRelated(post: Post, limit = 3): Promise<Post[]> {
  const all = await getAllPosts();
  const translations = new Set((await getTranslations(post)).map(postPath));
  const tags = new Set(post.data.tags);

  return all
    .filter((other) => postPath(other) !== postPath(post) && !translations.has(postPath(other)))
    .map((other) => {
      const shared = other.data.tags.filter((tag) => tags.has(tag)).length;
      const sameLang = other.data.lang === post.data.lang ? 0.5 : 0;
      const sameStream = other.collection === post.collection ? 0.5 : 0;
      return { other, score: shared + sameLang + sameStream };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || newestFirst(a.other, b.other))
    .slice(0, limit)
    .map(({ other }) => other);
}
