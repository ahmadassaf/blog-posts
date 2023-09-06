import { allPosts } from 'contentlayer/generated';

import categories from '@/app/content/categories';
import { POSTS_PER_PAGE } from '@/components/elements/Pagination';
import ListLayout from '@/layouts/ListLayout';
import { coreContent, sortPosts } from '@/lib/utils/contentlayer';

export const generateStaticParams = async() => {
  const paths = categories.map((category) => {
    const categoryPages = Math.ceil(allPosts.filter(
      (post) => post.category.replace(' ', '-').toLowerCase().trim() === category.slug
    ).length / POSTS_PER_PAGE);
    const categoryPaths =  Array.from({ 'length': categoryPages }, (_, index) => {
      return { 'category': category.slug, 'page': (index + 1).toString() };
    });

    return categoryPaths;
  });

  return paths;
};

export default function Page({ params }) {

  const category = decodeURI(params.category);
  const title = category.replace('-', ' ');
  const posts = coreContent(sortPosts(allPosts)).filter((post) => post.category.replace(' ', '-').toLowerCase() === category);
  const pageNumber = parseInt(params.page);
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

  let pagination;

  const filteredPosts = posts.slice(POSTS_PER_PAGE * (pageNumber - 1), POSTS_PER_PAGE * pageNumber);

  if (pageNumber <= totalPages) pagination = {
    'currentPage': pageNumber,
    totalPages
  };

  return (
    <>
      <ListLayout posts={ filteredPosts } listTitle={ `${title} Posts` } currentPage={ pagination && pagination.currentPage } totalPages={ pagination && pagination.totalPages } paginationURL={ `blog/categories/${category}/page` } baseURL={ `blog/categories/${category}` }/>
    </>
  );
}
