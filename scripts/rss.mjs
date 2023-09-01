import { mkdirSync, writeFileSync } from 'fs';
import path from 'path';

import { allPosts } from '../.contentlayer/generated/index.mjs';
import tags from '../app/content/tags.json' assert { type: 'json' };
import authorMetadata from '../data/meta/authorMetadata.js';
import siteMetadata from '../data/meta/siteMetadata.js';

export function _dateSortDesc(a, b) {
  if (a > b) return -1;
  if (a < b) return 1;

  return 0;
}

export function sortPosts(posts) {
  return posts.sort((a, b) => _dateSortDesc(a.date, b.date));
}

const _generateRssItem = (post) => `
  <item>
    <guid>${siteMetadata.siteUrl}/blog/${post.slug}</guid>
    <title>${post.title}</title>
    <link>${siteMetadata.siteUrl}/blog/${post.slug}</link>
    ${post.summary && `<description>${post.summary}</description>`}
    <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    <author>${authorMetadata.email} (${authorMetadata.name})</author>
    <category>${post.category.replace('-', ' ')}</category>
  </item>
`;

const _generateRss = (posts, page = 'feed.xml') => `
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>${siteMetadata.title}</title>
      <link>${siteMetadata.siteUrl}/blog</link>
      <description>${authorMetadata.description}</description>
      <language>${siteMetadata.language}</language>
      <managingEditor>${authorMetadata.email} (${authorMetadata.name})</managingEditor>
      <webMaster>${authorMetadata.email} (${authorMetadata.name})</webMaster>
      <lastBuildDate>${new Date(posts.date).toUTCString()}</lastBuildDate>
      <atom:link href="${siteMetadata.siteUrl}/${page}" rel="self" type="application/rss+xml"/>
      ${posts.map((post) => _generateRssItem(post)).join('')}
    </channel>
  </rss>
`;

async function generateRss(posts, page = 'feed.xml') {
  const rss = _generateRss(posts);

  writeFileSync(`./public/${page}`, rss);
}

const rss = () => {
  generateRss(sortPosts(allPosts));
  console.log('ℹ️ RSS feed generated ✅');
};

export default rss;
