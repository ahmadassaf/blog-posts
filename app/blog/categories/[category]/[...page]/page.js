import { allPosts } from 'contentlayer/generated';

import categories from '@/app/content/categories';
import { POSTS_PER_PAGE } from '@/components/elements/Pagination';
import ListLayout from '@/layouts/ListLayout';
import { coreContent, sortPosts } from '@/lib/utils/contentlayer';

export default function Page({ params }) {

  const category = decodeURI(params.category);
  const title = category.replace('-', ' ');
  const posts = coreContent(sortPosts(allPosts)).filter((post) => post.category.replace(' ', '-').toLowerCase() === category);
  const pageNumber = params.page[1] ? parseInt(params.page[1]) : null;

  let filteredPosts; let pagination;

  if (pageNumber) {
    filteredPosts = posts.slice(POSTS_PER_PAGE * (pageNumber - 1), POSTS_PER_PAGE * pageNumber);
    pagination = {
      'currentPage': pageNumber,
      'totalPages': Math.ceil(posts.length / POSTS_PER_PAGE)
    };
  } else {
    filteredPosts = posts;
  }

  return (
    <>
      <ListLayout posts={ filteredPosts } listTitle={ `${title} Posts` } currentPage={ pagination && pagination.currentPage } totalPages={ pagination && pagination.totalPages } paginationURL={ `blog/category/${categories}/page` } baseURL={ `blog/categories/${category}` }/>
    </>
  );
}
