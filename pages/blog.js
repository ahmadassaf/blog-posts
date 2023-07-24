import { PageSEO } from '@/components/utils/SEO';
import siteMetadata from '@/data/meta/metadata';
import ListLayout from '@/layouts/ListLayout';
import { getAllFilesFrontMatter } from '@/lib/mdx';

export async function getStaticProps() {
  const posts = await getAllFilesFrontMatter('blog');

  return { 'props': { posts } };
}

export default function Blog({ posts, initialDisplayPosts }) {
  return (
    <>
      <PageSEO title={ `Blog - ${siteMetadata.author}` } description={ siteMetadata.description } />
      <ListLayout posts={ posts } paginate={ true } listTitle='All Posts'/>
    </>
  );
}
