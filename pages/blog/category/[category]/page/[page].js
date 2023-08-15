import { allPosts } from 'contentlayer/generated';

import categories from '@/app/content/categories';
import { POSTS_PER_PAGE } from '@/components/elements/Pagination';
import { PageSEO } from '@/components/utils/SEO';
import siteMetadata from '@/data/meta/metadata';
import ListLayout from '@/layouts/ListLayout';
import kebabCase from '@/lib/utils/kebabCase';

export async function getStaticPaths() {
  const paths = categories.map((category) => {
    const categoryPages = Math.ceil(allPosts.filter((post) => kebabCase(post.category) === category.slug).length / POSTS_PER_PAGE);
    const categoryPaths =  Array.from({ 'length': categoryPages }, (_, index) => {
      return { 'category': category.slug, 'page': (index + 1).toString() };
    });

    return categoryPaths;
  });

  return {
    'fallback': false,
    'paths': paths.flat().map((path) => {
      return {
        'params': { 'category': path.category, 'page': path.page }
      };
    })
  };

}

export async function getStaticProps(context) {

  const { 'params': { page, category } } = context;

  const posts = allPosts.filter((post) => post.type !== 'project' && kebabCase(post.category) === category);
  const pageNumber = parseInt(page);
  const pagePosts = posts.slice(POSTS_PER_PAGE * (pageNumber - 1), POSTS_PER_PAGE * pageNumber);
  const pagination = {
    'currentPage': pageNumber,
    'totalPages': Math.ceil(posts.length / POSTS_PER_PAGE)
  };

  return { 'props': { category, pagePosts, pagination } };
}

export default function PostPage({ pagePosts, category, pagination }) {
  const title = category.replace('-', ' ');

  return (
    <>
      <PageSEO title={ siteMetadata.title } description={ siteMetadata.description } />
      <ListLayout posts={ pagePosts } listTitle={ `${title} Posts` } currentPage={ pagination.currentPage } totalPages={ pagination.totalPages } paginationURL={ `blog/category/${category}/page` } baseURL={ `blog/category/${category}` }/>
    </>
  );
}
