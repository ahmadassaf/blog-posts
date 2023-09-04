import { allPosts } from 'contentlayer/generated';

import tags from '@/app/content/tags';
import { TagSEO } from '@/components/utils/SEO';
import siteMetadata from '@/data/meta/metadata';
import ListLayout from '@/layouts/ListLayout';
import { coreContent, sortPosts } from '@/lib/utils/contentlayer';

export async function getStaticPaths() {
  return {
    'fallback': false,
    'paths': tags.map((tag) => {
      return {
        'params': {
          'tag': tag.slug
        }
      };
    })
  };
}

export async function getStaticProps({ params }) {
  const posts = coreContent(sortPosts(allPosts));
  const filteredPosts = posts.filter((post) => post.tags.map((_tag) => _tag.replace(' ', '-').toLowerCase()).includes(params.tag));

  return { 'props': { 'posts': filteredPosts, 'tag': params.tag } };
}

export default function Tag({ posts, tag }) {
  const title = tag.split('-').join(' ');

  return (
    <>
      <TagSEO title={ `Tag:${tag}` } description={ `Tag:${tag} | ${siteMetadata.title}` }/>
      <ListLayout posts={ posts } listTitle={ `${title} Posts` } paginationURL={ `blog/tag/${tag}/page` } baseURL={ `blog/tag/${tag}` }/>
    </>
  );
}
