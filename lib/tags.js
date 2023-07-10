import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';

import kebabCase from './utils/kebabCase';
import { getFiles } from './mdx';

const root = process.cwd();

export async function getAllTags(type) {
  const files = await getFiles(type);

  const tags = {};

  files.forEach((file) => {
    const source = fs.readFileSync(path.join(root, 'data', type, file), 'utf8');
    const { data } = matter(source);

    if (data.tags && data.draft !== true) data.tags.forEach((tag) => {
      const formattedTag = kebabCase(tag).trim();

      if (tags[formattedTag]) tags[formattedTag].count++;
      else tags[formattedTag] = { 'count': 1, 'display': tag, 'slug': formattedTag };

    });

  });

  return tags;
}
