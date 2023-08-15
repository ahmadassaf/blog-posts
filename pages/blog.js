import { allPosts } from 'contentlayer/generated';

import { PageSEO } from '@/components/utils/SEO';
import siteMetadata from '@/data/meta/metadata';
import ListLayout from '@/layouts/ListLayout';
import { sortPosts } from '@/lib/utils/contentlayer';

export default function Blog() {
  return (
    <>
      <PageSEO title={ `Blog - ${siteMetadata.author}` } description={ siteMetadata.description } />
      <ListLayout posts={ sortPosts(allPosts, 'date') } listTitle='All Posts' paginationURL='blog/page' baseURL='blog'/>
    </>
  );
}
