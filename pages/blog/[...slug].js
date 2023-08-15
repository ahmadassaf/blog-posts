import { allPosts } from 'contentlayer/generated';

import { MDXComponents, MDXLayoutRenderer } from '@/components/mdx';
import PostLayout from '@/layouts/PostLayout';

export async function getStaticPaths() {
  return {
    'fallback': false,
    'paths': allPosts.map((post) => {
      return {
        'params': {
          'slug': post.slug.split('/')
        }
      };
    })
  };
}

export async function getStaticProps({ params }) {

  const slug = decodeURI(params.slug.join('/'));

  const postIndex = allPosts.findIndex((_post) => _post.slug === slug);
  const previousPost = allPosts[postIndex + 1] || null;
  const nextPost = allPosts[postIndex - 1] || null;
  const post = allPosts.filter((_post) => _post.slug === slug)[0];

  return { 'props': { nextPost, post, previousPost } };
}

export default function Blog({ nextPost, post, previousPost }) {
  return (
    <>
      <PostLayout content={ post } next={ nextPost } prev={ previousPost } toc={ post.toc }>
        <MDXLayoutRenderer code={ post.body.code } components={ MDXComponents } />
      </PostLayout>
    </>
  );
}
