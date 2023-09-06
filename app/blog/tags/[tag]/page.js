import { allPosts } from 'contentlayer/generated';

import tags from '@/app/content/tags';
import ListLayout from '@/layouts/ListLayout';
import { coreContent, sortPosts } from '@/lib/utils/contentlayer';
export const generateStaticParams = async() => {

  const paths = tags.map((tag) => {
    return {
      'tag': tag.slug
    };
  });

  return paths;
};

export default function Page({ params }) {
  const tag = decodeURI(params.tag);
  const title = tag.split('-').join(' ');
  const posts = coreContent(sortPosts(allPosts));

  const filteredPosts = posts.filter((post) => post.tags.map((_tag) => _tag.replace(' ', '-').toLowerCase()).includes(params.tag));

  return (
    <>
      <ListLayout posts={ filteredPosts } listTitle={ `${title} Posts` } paginationURL={ `blog/tags/${tag}/page` } baseURL={ `blog/tags/${tag}` }/>
    </>
  );
}
