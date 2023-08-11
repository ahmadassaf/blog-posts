import { defineDocumentType, makeSource } from 'contentlayer/source-files';
import { writeFileSync } from 'fs';
import GithubSlugger from 'github-slugger';
import path from 'path';
import { extractTocHeadings,
  remarkCodeTitles,
  remarkExtractFrontmatter,
  remarkImgToJsx } from 'pliny/mdx-plugins/index.js';
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer.js';
import readingTime from 'reading-time';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeCitation from 'rehype-citation';
import rehypeKatex from 'rehype-katex';
import rehypePresetMinify from 'rehype-preset-minify';
import rehypePrismPlus from 'rehype-prism-plus';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import siteMetadata from './data/meta/siteMetadata';

const root = process.cwd();

const computedFields = {
  'filePath': {
    'resolve': (doc) => doc._raw.sourceFilePath,
    'type': 'string'
  },
  'path': {
    'resolve': (doc) => doc._raw.flattenedPath,
    'type': 'string'
  },
  'readingTime': { 'resolve': (doc) => readingTime(doc.body.raw), 'type': 'json' },
  'slug': {
    'resolve': (doc) => doc._raw.flattenedPath.replace(/^.+?(\/)/, ''),
    'type': 'string'
  },
  'toc': { 'resolve': (doc) => extractTocHeadings(doc.body.raw), 'type': 'string' }
};

/**
 * Count the occurrences of all tags across blog posts and write to json file
 */
function createTagCount(allBlogs) {
  const tagCount = {};

  allBlogs.forEach((file) => {
    if (file.tags && file.draft !== true) file.tags.forEach((tag) => {
      const formattedTag = GithubSlugger.slug(tag);

      if (formattedTag in tagCount) tagCount[formattedTag] += 1;
      else tagCount[formattedTag] = 1;

    });

  });
  writeFileSync('./app/tag-data.json', JSON.stringify(tagCount));
}

function createSearchIndex(allBlogs) {
  if (
    siteMetadata?.search?.provider === 'kbar' &&
    siteMetadata.search.kbarConfig.searchDocumentsPath
  ) {
    writeFileSync(
      `public/${siteMetadata.search.kbarConfig.searchDocumentsPath}`, JSON.stringify(allCoreContent(sortPosts(allBlogs)))
    );
    console.log('Local search index generated...');
  }
}

export const Post = defineDocumentType(() => {
  return {
    'computedFields': {
      ...computedFields,
      'structuredData': {
        'resolve': (doc) => {
          return {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            'author': doc.authors,
            'dateModified': doc.lastmod || doc.date,
            'datePublished': doc.date,
            'description': doc.summary,
            'headline': doc.title,
            'image': doc.images ? doc.images[0] : siteMetadata.socialBanner,
            'url': `${siteMetadata.siteUrl}/${doc._raw.flattenedPath}`
          };
        },
        'type': 'json'
      }
    },
    'contentType': 'mdx',
    'fields': {
      'bibliography': { 'type': 'string' },
      'category': { 'required': true, 'type': 'string' },
      'date': { 'required': true, 'type': 'date' },
      'draft': { 'type': 'boolean' },
      'featured': { 'type': 'boolean' },
      'layout': { 'type': 'string' },
      'subtitle': { 'required': false, 'type': 'string' },
      'summary': { 'type': 'string' },
      'tags': { 'default': [], 'of': { 'type': 'string' }, 'type': 'list' },
      'title': { 'required': true, 'type': 'string' }
    },
    'filePathPattern': 'blog/**/*.mdx',
    'name': 'Post'
  };
});

export const Project = defineDocumentType(() => {
  return {
    'computedFields': {
      ...computedFields,
      'structuredData': {
        'resolve': (doc) => {
          return {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            'author': doc.authors,
            'dateModified': doc.lastmod || doc.date,
            'datePublished': doc.date,
            'description': doc.summary,
            'headline': doc.title,
            'image': doc.images ? doc.images[0] : siteMetadata.socialBanner,
            'url': `${siteMetadata.siteUrl}/${doc._raw.flattenedPath}`
          };
        },
        'type': 'json'
      }
    },
    'contentType': 'mdx',
    'fields': {
      'bibliography': { 'type': 'string' },
      'category': { 'required': true, 'type': 'string' },
      'date': { 'required': true, 'type': 'date' },
      'draft': { 'type': 'boolean' },
      'featured': { 'type': 'boolean' },
      'github': { 'required': true, 'type': 'string' },
      'layout': { 'required': true, 'type': 'string' },
      'subtitle': { 'required': false, 'type': 'string' },
      'summary': { 'type': 'string' },
      'tags': { 'default': [], 'of': { 'type': 'string' }, 'type': 'list' },
      'title': { 'required': true, 'type': 'string' }
    },
    'filePathPattern': 'blog/**/*.mdx',
    'name': 'Project'
  };
});

export const Author = defineDocumentType(() => {
  return {
    computedFields,
    'contentType': 'mdx',
    'fields': {
      'avatar': { 'type': 'string' },
      'company': { 'type': 'string' },
      'email': { 'type': 'string' },
      'github': { 'type': 'string' },
      'layout': { 'type': 'string' },
      'linkedin': { 'type': 'string' },
      'name': { 'required': true, 'type': 'string' },
      'occupation': { 'type': 'string' },
      'twitter': { 'type': 'string' }
    },
    'filePathPattern': 'authors/**/*.mdx',
    'name': 'Author'
  };
});

export default makeSource({
  'contentDirPath': 'data',
  'documentTypes': [ Post, Author, Project ],
  'mdx': {
    'cwd': process.cwd(),
    'rehypePlugins': [
      rehypeSlug,
      rehypeAutolinkHeadings,
      rehypeKatex,
      [ rehypeCitation, { 'path': path.join(root, 'data') }],
      [ rehypePrismPlus, { 'defaultLanguage': 'js', 'ignoreMissing': true }],
      rehypePresetMinify
    ],
    'remarkPlugins': [
      remarkExtractFrontmatter,
      remarkGfm,
      remarkCodeTitles,
      remarkMath,
      remarkImgToJsx
    ]
  },
  'onSuccess': async(importData) => {
    const { allBlogs } = await importData();

    createTagCount(allBlogs);
    createSearchIndex(allBlogs);
  }
});
