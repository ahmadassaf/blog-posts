import { PageSEO } from '@/components/utils/SEO';
import siteMetadata from '@/data/meta/metadata';
import ListLayout from '@/layouts/ListLayout';
import { getAllFilesFrontMatter } from '@/lib/mdx';

export async function getStaticProps() {
  const allPosts = await getAllFilesFrontMatter('blog');
  const posts = allPosts.filter((post) => post.type !== 'project');

  return { 'props': { posts } };
}

export default function Blog({ posts, initialDisplayPosts }) {
  return (
    <>
      <PageSEO title={ `Blog - ${siteMetadata.author}` } description={ siteMetadata.description } />
      <ListLayout posts={ posts } listTitle='All Posts' paginationURL='blog/page' baseURL='blog'/>
    </>
  );
}
