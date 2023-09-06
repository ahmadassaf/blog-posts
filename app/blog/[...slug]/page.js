import { allPosts } from 'contentlayer/generated';

import { MDXComponents, MDXLayoutRenderer } from '@/components/mdx';
import PostLayout from '@/layouts/PostLayout';
import { coreContent, sortPosts } from '@/lib/utils/contentlayer';

export const generateStaticParams = async() => {
  const paths = allPosts.map((p) => {
    return { 'slug': p.slug.split('/') };
  });

  return paths;
};

export default async function Page({ params }) {
  const slug = decodeURI(params.slug.join('/'));
  const posts = coreContent(sortPosts(allPosts));
  const postIndex = posts.findIndex((_post) => _post.slug === slug);
  const post = allPosts.filter((_post) => _post.slug === slug)[0];

  return (
    <>
      <PostLayout content={ coreContent(post) } next={ posts[postIndex - 1] || null } prev={ posts[postIndex + 1] || null } toc={ post.toc }>
        <MDXLayoutRenderer code={ post.body.code } components={ MDXComponents } />
      </PostLayout>
    </>
  );
}
