import { allPosts } from 'contentlayer/generated';

import tags from '@/app/content/tags';
import { POSTS_PER_PAGE } from '@/components/elements/Pagination';
import { PageSEO } from '@/components/utils/SEO';
import siteMetadata from '@/data/meta/metadata';
import ListLayout from '@/layouts/ListLayout';
import { coreContent, sortPosts } from '@/lib/utils/contentlayer';

export async function getStaticPaths() {

  const paths = tags.map((tag) => {
    const tagPages = Math.ceil(allPosts.filter(
      (post) => post.tags.map((_tag) => _tag.replace(' ', '-').toLowerCase()).includes(tag.slug)
    ).length / POSTS_PER_PAGE);
    const tagPaths =  Array.from({ 'length': tagPages }, (_, index) => {
      return { 'page': (index + 1).toString(), 'tag': tag.slug };
    });

    return tagPaths;
  });

  return {
    'fallback': false,
    'paths': paths.flat().map((path) => {
      return {
        'params': { 'page': path.page, 'tag': path.tag }
      };
    })
  };

}

export async function getStaticProps(context) {

  const { 'params': { page, tag } } = context;

  const posts = coreContent(sortPosts(allPosts));
  const filteredPosts = posts.filter((post) => post.tags.map((_tag) => _tag.replace(' ', '-').toLowerCase()).includes(tag));

  const pageNumber = parseInt(page);
  const pagePosts = filteredPosts.slice(POSTS_PER_PAGE * (pageNumber - 1), POSTS_PER_PAGE * pageNumber);
  const pagination = {
    'currentPage': pageNumber,
    'totalPages': Math.ceil(filteredPosts.length / POSTS_PER_PAGE)
  };

  return { 'props': { pagePosts, pagination, tag } };
}

export default function PostPage({ pagePosts, tag, pagination }) {
  const title = tag.split('-').join(' ');

  return (
    <>
      <PageSEO title={ siteMetadata.title } description={ siteMetadata.description } />
      <ListLayout posts={ pagePosts } listTitle={ `${title} Posts` } currentPage={ pagination.currentPage } totalPages={ pagination.totalPages } paginationURL={ `blog/category/${tag}/page` } baseURL={ `blog/tag/${tag}` }/>
    </>
  );
}
