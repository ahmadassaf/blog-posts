import preval from 'next-plugin-preval';

import { getAllCategories } from './lib/categories';

async function getFooterData() {
  const categories = await getAllCategories('blog');

  return categories;
}

export default preval(getFooterData());
