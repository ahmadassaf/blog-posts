import { Index } from 'flexsearch';
import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';

import { getAllFilesFrontMatter, getFiles } from '@/lib/mdx';

// eslint-disable-next-line import/no-anonymous-default-export
export default async(req, res) => {
  const root = process.cwd();
  const index = new Index({
    'cache': true,
    'contextual': true,
    'preset': 'match',
    'tokenize': 'full'
  });

  const files = await getFiles('blog');
  const allPosts = await getAllFilesFrontMatter('blog');

  files.forEach((file) => {
    const source = fs.readFileSync(path.join(root, 'data', 'blog', file), 'utf8');
    const { data } = matter(source);
    const post = allPosts.find((_post) => _post.title === data.title);

    index.add(post.slug, source);

  });

  res.status(200).json(index.search(req.query.q));
};
