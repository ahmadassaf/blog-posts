import { allPosts } from 'contentlayer/generated';

import tags from '@/app/content/tags';
import { POSTS_PER_PAGE } from '@/components/elements/Pagination';
import ListLayout from '@/layouts/ListLayout';
import { coreContent, sortPosts } from '@/lib/utils/contentlayer';

export const generateStaticParams = async() => {
  const paths = tags.map((tag) => {
    const tagPages = Math.ceil(allPosts.filter(
      (post) => post.tags.map((_tag) => _tag.replace(' ', '-').toLowerCase().trim()).includes(tag.slug)
    ).length / POSTS_PER_PAGE);
    const tagPaths =  Array.from({ 'length': tagPages }, (_, index) => {
      return { 'page': (index + 1).toString(), 'tag': tag.slug };
    });

    return tagPaths;
  });

  return paths;
};

export default function Page({ params }) {

  const tag = decodeURI(params.tag);
  const title = tag.replace('-', ' ');
  const posts = coreContent(sortPosts(allPosts)).filter((post) => post.tags.map((_tag) => _tag.replace(' ', '-').toLowerCase()).includes(tag));
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
      <ListLayout posts={ filteredPosts } listTitle={ `${title} Posts` } currentPage={ pagination && pagination.currentPage } totalPages={ pagination && pagination.totalPages } paginationURL={ `blog/tags/${tag}/page` } baseURL={ `blog/tags/${tag}` }/>
    </>
  );
}
