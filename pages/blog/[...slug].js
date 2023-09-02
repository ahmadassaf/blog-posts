import { allPosts } from 'contentlayer/generated';

import { MDXComponents, MDXLayoutRenderer } from '@/components/mdx';
import PostLayout from '@/layouts/PostLayout';
import { coreContent, sortPosts } from '@/lib/utils/contentlayer';

const posts = coreContent(sortPosts(allPosts));

export async function getStaticPaths() {
  return {
    'fallback': false,
    'paths': posts.map((post) => {
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
  const postIndex = posts.findIndex((_post) => _post.slug === slug);
  const previousPost = posts[postIndex + 1] || null;
  const nextPost = posts[postIndex - 1] || null;

  return { 'props': { nextPost, previousPost, slug } };
}

export default function Blog({ nextPost, slug, previousPost }) {
  const post = allPosts.filter((_post) => _post.slug === slug)[0];
  const mainContent = coreContent(post);

  return (
    <>
      <PostLayout content={ mainContent } next={ nextPost } prev={ previousPost } toc={ post.toc }>
        <MDXLayoutRenderer code={ post.body.code } components={ MDXComponents } />
      </PostLayout>
    </>
  );
}
