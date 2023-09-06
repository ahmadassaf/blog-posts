import { allPosts } from 'contentlayer/generated';

import { POSTS_PER_PAGE } from '@/components/elements/Pagination';
import ListLayout from '@/layouts/ListLayout';
import { coreContent, sortPosts } from '@/lib/utils/contentlayer';

export const generateStaticParams = async() => {
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
  const paths = Array.from({ 'length': totalPages }, (_, i) => {
    return { 'page': (i + 1).toString() };
  });

  return paths;
};

export default function Page({ params }) {
  const posts = coreContent(sortPosts(allPosts));
  const pageNumber = parseInt(params.page);
  const pagePosts = posts.slice(POSTS_PER_PAGE * (pageNumber - 1), POSTS_PER_PAGE * pageNumber);
  const pagination = {
    'currentPage': pageNumber,
    'totalPages': Math.ceil(posts.length / POSTS_PER_PAGE)
  };

  return (
    <ListLayout posts={ pagePosts } listTitle='All Posts' currentPage={ pagination.currentPage } totalPages={ pagination.totalPages } paginationURL='blog/page' baseURL='blog'/>
  );
}
