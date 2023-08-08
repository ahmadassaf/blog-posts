import { POSTS_PER_PAGE } from '@/components/elements/Pagination';
import { PageSEO } from '@/components/utils/SEO';
import siteMetadata from '@/data/meta/metadata';
import ListLayout from '@/layouts/ListLayout';
import { getAllFilesFrontMatter } from '@/lib/mdx';
import { getAllTags } from '@/lib/tags';
import kebabCase from '@/lib/utils/kebabCase';

export async function getStaticPaths() {
  const tags = await getAllTags('blog');
  const allPosts = await getAllFilesFrontMatter('blog');

  const paths = Object.keys(tags).map((tag) => {
    const tagPages = Math.ceil(allPosts.filter(
      (post) => post.tags.map((_tag) => kebabCase(_tag)).includes(tag)
    ).length / POSTS_PER_PAGE);
    const tagPaths =  Array.from({ 'length': tagPages }, (_, index) => {
      return { 'page': (index + 1).toString(), tag };
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

  const allPosts = await getAllFilesFrontMatter('blog');
  const posts = allPosts.filter((post) => post.tags.map((_tag) => kebabCase(_tag)).includes(tag));
  const pageNumber = parseInt(page);
  const pagePosts = posts.slice(POSTS_PER_PAGE * (pageNumber - 1), POSTS_PER_PAGE * pageNumber);
  const pagination = {
    'currentPage': pageNumber,
    'totalPages': Math.ceil(posts.length / POSTS_PER_PAGE)
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
