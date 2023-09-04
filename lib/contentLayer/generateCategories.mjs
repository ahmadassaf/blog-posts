import { writeFileSync } from 'fs';

import navigationMetadata from '../../data/meta/navigationMetadata.mjs';
import kebabCase from '../utils/kebabCase.mjs';

function getAllCategories(allPosts) {
  const categories = {};

  allPosts.forEach((post) => {
    if (post.category) {
      const formattedCategory = kebabCase(post.category).trim();

      if (categories[formattedCategory]) categories[formattedCategory].count++;
      else categories[formattedCategory] = {
        'children': post.category,
        'count': 1,
        'description': navigationMetadata.categoriesMetadata[post.category],
        'href': `/blog/category/${formattedCategory}`,
        'id': formattedCategory,
        'showType': false,
        'slug': formattedCategory,
        'title': kebabCase(post.category),
        'type': 'category'
      };
    }
  });

  writeFileSync(`./app/content/categories.json`, JSON.stringify(Object.values(categories)));
}

export default getAllCategories;
