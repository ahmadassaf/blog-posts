import fs from 'fs';
import path from 'path';

import { TagSEO } from '@/components/utils/SEO';
import siteMetadata from '@/data/meta/metadata';
import ListLayout from '@/layouts/ListLayout';
import { getAllCategories } from '@/lib/categories';
import generateRss from '@/lib/generate-rss';
import { getAllFilesFrontMatter } from '@/lib/mdx';
import kebabCase from '@/lib/utils/kebabCase';

const root = process.cwd();

export async function getStaticPaths() {
  const categories = await getAllCategories('blog');

  return {
    'fallback': false,
    'paths': Object.keys(categories).map((category) => {
      return {
        'params': {
          category
        }
      };
    })
  };
}

export async function getStaticProps({ params }) {

  const allPosts = await getAllFilesFrontMatter('blog');
  const filteredPosts = allPosts.filter(
    (post) => kebabCase(post.category) === params.category
  );

  // RSS
  if (filteredPosts.length > 0) {
    const rss = generateRss(filteredPosts, `blog/category/${params.category}/feed.xml`);
    const rssPath = path.join(root, 'public', 'category', params.category);

    fs.mkdirSync(rssPath, { 'recursive': true });
    fs.writeFileSync(path.join(rssPath, 'feed.xml'), rss);
  }

  return { 'props': { 'category': params.category, 'posts': filteredPosts } };
}

export default function Category({ posts, category }) {
  const title = category.replace('-', ' ');

  return (
    <>
      <TagSEO
        title={ `${category} - ${siteMetadata.author}` }
        description={ `${category} Category - ${siteMetadata.author}` }
      />
      <ListLayout className='capitalize' posts={ posts } title={ title } paginate={ false }/>
    </>
  );
}
