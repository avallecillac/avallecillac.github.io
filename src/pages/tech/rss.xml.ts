import { site, streamFor } from '../../site';
import { getPosts } from '../../posts';
import { feed } from '../../feed';

const stream = streamFor('tech');

export const GET = async () =>
  feed({
    title: `${site.title} — ${stream.title}`,
    description: stream.description,
    posts: await getPosts('tech'),
  });
