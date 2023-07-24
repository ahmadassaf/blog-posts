import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';

import navigationMetadata from '@/data/meta/navigationMetadata';
import { getAllFilesFrontMatter, getFiles } from '@/lib/mdx';
import { getAllTags } from '@/lib/tags';
import kebabCase from '@/lib/utils/kebabCase';

const root = process.cwd();

// eslint-disable-next-line import/no-anonymous-default-export
export default async(req, res) => {
  const files = await getFiles('blog');
  const posts = await getAllFilesFrontMatter('blog');
  const tags = await getAllTags('blog');
  const initialDisplayPosts = posts.slice(0, 3);

  const categories = [];

  files.forEach((file) => {
    const source = fs.readFileSync(path.join(root, 'data', 'blog', file), 'utf8');
    const { data } = matter(source);

    if (data.category) categories.push(data.category);

  });
  navigationMetadata.categories = [ ...new Set(categories) ];
  navigationMetadata.categories = navigationMetadata.categories.map((category) => {
    return ({ 'description': navigationMetadata.categoriesMetadata[category], 'id': category, 'title': kebabCase(category) });
  });
  navigationMetadata.posts = initialDisplayPosts;
  navigationMetadata.tags = tags;
  res.status(200).json(navigationMetadata);
};
