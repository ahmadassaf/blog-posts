import fs from 'fs';

import { MDXLayoutRenderer } from '@/components/mdx';
import generateRss from '@/lib/generate-rss';
import { formatSlug, getAllFilesFrontMatter, getFileBySlug, getFiles } from '@/lib/mdx';

const DEFAULT_LAYOUT = 'PostLayout';

export async function getStaticPaths() {
  const posts = getFiles('blog');

  return {
    'fallback': false,
    'paths': posts.map((p) => {
      return {
        'params': {
          'slug': formatSlug(p).split('/')
        }
      };
    })
  };
}

export async function getStaticProps({ params }) {

  const allPosts = await getAllFilesFrontMatter('blog');
  const postIndex = allPosts.findIndex((post) => formatSlug(post.slug) === params.slug.join('/'));
  const previousPost = allPosts[postIndex + 1] || null;
  const nextPost = allPosts[postIndex - 1] || null;
  const post = await getFileBySlug('blog', params.slug.join('/'));
  const authorList = post.frontMatter.authors || [ 'default' ];
  const authorPromise = authorList.map(async(author) => {
    const authorResults = await getFileBySlug('authors', [ author ]);

    return authorResults.frontMatter;
  });
  const authorDetails = await Promise.all(authorPromise);

  if (allPosts.length > 0) {
    const rss = generateRss(allPosts);

    fs.writeFileSync('./public/feed.xml', rss);
  }

  return { 'props': { authorDetails, nextPost, post, previousPost } };
}

export default function Blog({ post, authorDetails, previousPost, nextPost }) {
  const { mdxSource, toc, frontMatter } = post;

  return (
    <>
      <MDXLayoutRenderer layout={ frontMatter.layout || DEFAULT_LAYOUT } toc={ toc } mdxSource={ mdxSource } frontMatter={ frontMatter } authorDetails={ authorDetails } previousPost={ previousPost } nextPost={ nextPost }/>
    </>
  );
}
