import { writeFileSync } from 'fs';

import navigationMetadata from '../../data/meta/navigationMetadata.mjs';

function getAllCategories(allPosts) {
  const categories = {};

  allPosts.forEach((post) => {
    if (post.category) {
      const formattedCategory = post.category.replace(' ', '-').toLowerCase().trim();

      if (categories[formattedCategory]) categories[formattedCategory].count++;
      else categories[formattedCategory] = {
        'children': post.category,
        'count': 1,
        'description': navigationMetadata.categoriesMetadata[post.category],
        'href': `/blog/category/${formattedCategory}`,
        'id': formattedCategory,
        'showType': false,
        'slug': formattedCategory,
        'title': post.category.replace(' ', '-').toLowerCase(),
        'type': 'category'
      };
    }
  });

  writeFileSync(`./app/content/categories.json`, JSON.stringify(Object.values(categories)));
}

export default getAllCategories;
