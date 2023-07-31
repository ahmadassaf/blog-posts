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
  const allPosts = await getAllFilesFrontMatter('blog');
  const posts = allPosts.filter((post) => post.type !== 'project');
  const projects = allPosts.filter((post) => post.type === 'project');
  const tags = await getAllTags('blog');

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

  navigationMetadata.posts = posts;
  navigationMetadata.tags = tags;
  navigationMetadata.projects = projects;
  navigationMetadata.initialDisplayPosts = posts.slice(0, 3);

  res.status(200).json(navigationMetadata);
};
