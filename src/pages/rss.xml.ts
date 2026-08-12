import { site } from '../site';
import { getAllPosts } from '../posts';
import { feed } from '../feed';

export const GET = async () =>
  feed({
    title: site.title,
    description: site.blurb,
    posts: await getAllPosts(),
  });
