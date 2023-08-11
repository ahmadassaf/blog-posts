import { allPosts } from 'contentlayer/generated';

import siteMetadata from '@/data/meta/siteMetadata';

export default async function sitemap() {
  const { siteUrl } = siteMetadata;
  const blogRoutes = allPosts.map((post) => {

    return {
      'lastModified': post.date || new Date(),
      'url': `${siteUrl}/${post.path}`
    };
  });

  const routes = [ '', 'blog', 'projects', 'tags', 'about', 'categories' ].map((route) => {
    return {
      'lastModified': new Date().toISOString().split('T')[0],
      'url': `${siteUrl}/${route}`
    };
  });

  console.log('blogRoutes', blogRoutes);

  return [ ...routes, ...blogRoutes ];
}
