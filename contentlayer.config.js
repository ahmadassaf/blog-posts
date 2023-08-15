import { defineDocumentType, makeSource } from 'contentlayer/source-files';
import { writeFileSync } from 'fs';
import path from 'path';
import readingTime from 'reading-time';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeCitation from 'rehype-citation';
import rehypeKatex from 'rehype-katex';
import rehypePresetMinify from 'rehype-preset-minify';
import rehypePrismPlus from 'rehype-prism-plus';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import navigationMetadata from './data/meta/navigationMetadata';
import siteMetadata from './data/meta/siteMetadata';
import { extractTocHeadings,
  remarkCodeTitles,
  remarkExtractFrontmatter,
  remarkImgToJsx } from './lib/mdx/index.js';
import { allCoreContent, sortPosts } from './lib/utils/contentLayer.js';
import kebabCase from './lib/utils/kebabCase';

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

function getAllTags(allPosts) {
  const tags = {};

  allPosts.forEach((post) => {
    if (post.tags) post.tags.forEach((tag) => {
      const formattedTag = kebabCase(tag).trim();

      if (tags[formattedTag]) tags[formattedTag].count++;
      else tags[formattedTag] = {
        'children': tag,
        'count': 1,
        'display': tag,
        'href': `/blog/tag/${formattedTag}`,
        'id': formattedTag,
        'showType': false,
        'slug': formattedTag,
        'title': tag,
        'type': 'tag'
      };
    });
  });
  writeFileSync('./app/content/tags.json', JSON.stringify(Object.values(tags)));
}

function getAllCategories(allPosts) {
  const categories = {};

  allPosts.forEach((post) => {
    if (post.category) {
      const formattedCategory = kebabCase(post.category).trim();

      if (categories[formattedCategory]) categories[formattedCategory].count++;
      else categories[formattedCategory] = {
        'children': post.category,
        'count': 1,
        'description': navigationMetadata.categoriesMetadata[post.category],
        'href': `/blog/category/${formattedCategory}`,
        'id': formattedCategory,
        'showType': false,
        'slug': formattedCategory,
        'title': kebabCase(post.category),
        'type': 'category'
      };
    }
  });

  writeFileSync('./app/content/categories.json', JSON.stringify(Object.values(categories)));
}

function createSearchIndex(allPosts) {

  writeFileSync(
    `./app/content/sitedata.json`, JSON.stringify(allCoreContent(sortPosts(allPosts)))
  );
  console.log('Local search index generated...');

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
    const { allPosts } = await importData();

    createSearchIndex(allPosts);
    getAllTags(allPosts);
    getAllCategories(allPosts);
  }
});
