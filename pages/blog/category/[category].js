import { allPosts } from 'contentlayer/generated';

import categories from '@/app/content/categories';
import { TagSEO } from '@/components/utils/SEO';
import siteMetadata from '@/data/meta/metadata';
import ListLayout from '@/layouts/ListLayout';
import kebabCase from '@/lib/utils/kebabCase';

export async function getStaticPaths() {
  return {
    'fallback': false,
    'paths': categories.map((category) => {
      return {
        'params': {
          'category': category.slug
        }
      };
    })
  };
}

export async function getStaticProps({ params }) {

  const filteredPosts = allPosts.filter(
    (post) => kebabCase(post.category) === params.category
  );

  return { 'props': { 'category': params.category, 'posts': filteredPosts } };
}

export default function Category({ posts, category }) {
  const title = category.replace('-', ' ');

  return (
    <>
      <TagSEO title={ `Category:${category} | ${siteMetadata.title}` } description={ `Category:${category} | ${category.description}` }/>
      <ListLayout className='capitalize' posts={ posts } listTitle={ `${title} Posts` } paginationURL={ `blog/category/${category}/page` } baseURL={ `blog/category/${category}` }/>
    </>
  );
}
