import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';

import kebabCase from './utils/kebabCase';
import { getFiles } from './mdx';

const root = process.cwd();

export async function getAllCategories(type) {
  const files = await getFiles(type);

  const categories = {};

  files.forEach((file) => {
    const source = fs.readFileSync(path.join(root, 'data', type, file), 'utf8');
    const { data } = matter(source);

    if (data.category && data.draft !== true) {
      const formattedCategory = kebabCase(data.category).trim();

      if (categories[formattedCategory]) categories[formattedCategory].count++;
      else categories[formattedCategory] = {
        'count': 1,
        'display': data.category,
        'slug': formattedCategory
      };

    }
  });

  return categories;
}
