import { POSTS_PER_PAGE } from '@/components/blocks/Pagination';
import { PageSEO } from '@/components/utils/SEO';
import siteMetadata from '@/data/meta/metadata';
import ListLayout from '@/layouts/ListLayout';
import { getAllFilesFrontMatter } from '@/lib/mdx';

export async function getStaticPaths() {
  const totalPosts = await getAllFilesFrontMatter('blog');
  const totalPages = Math.ceil(totalPosts.length / POSTS_PER_PAGE);
  const paths = Array.from({ 'length': totalPages }, (_, index) => {
    return { 'params': { 'page': (index + 1).toString() } };
  });

  return { 'fallback': false, paths };
}

export async function getStaticProps(context) {
  const { 'params': { page } } = context;
  const allPosts = await getAllFilesFrontMatter('blog');
  const posts = allPosts.filter((post) => post.type !== 'project');
  const pageNumber = parseInt(page);
  const pagePosts = posts.slice(POSTS_PER_PAGE * (pageNumber - 1), POSTS_PER_PAGE * pageNumber);
  const pagination = {
    'currentPage': pageNumber,
    'totalPages': Math.ceil(posts.length / POSTS_PER_PAGE)
  };

  return { 'props': { pagePosts, pagination } };
}

export default function PostPage({ pagePosts, pagination }) {
  return (
    <>
      <PageSEO title={ siteMetadata.title } description={ siteMetadata.description } />
      <ListLayout posts={ pagePosts } listTitle='All Posts' currentPage={ pagination.currentPage } totalPages={ pagination.totalPages } paginationURL='blog/page' baseURL='blog'/>
    </>
  );
}
