var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// data/meta/siteMetadata.js
var require_siteMetadata = __commonJS({
  "data/meta/siteMetadata.js"(exports, module) {
    var SiteMetadata = {
      "language": "en-us",
      "locale": "en-US",
      "siteLogo": "/static/images/logo.svg",
      "siteRepo": "https://github.com/ahmadassaf/blog",
      "siteUrl": "https://assaf.website",
      "socialBanner": "/static/images/twitter-card.png",
      "theme": "light",
      "title": "Ahmad Assaf Personal Space"
    };
    module.exports = SiteMetadata;
  }
});

// contentlayer.config.js
var import_siteMetadata = __toESM(require_siteMetadata());
import { defineDocumentType, makeSource } from "contentlayer/source-files";
import { writeFileSync } from "fs";
import GithubSlugger from "github-slugger";
import path from "path";
import {
  extractTocHeadings,
  remarkCodeTitles,
  remarkExtractFrontmatter,
  remarkImgToJsx
} from "pliny/mdx-plugins/index.js";
import { allCoreContent, sortPosts } from "pliny/utils/contentlayer.js";
import readingTime from "reading-time";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeCitation from "rehype-citation";
import rehypeKatex from "rehype-katex";
import rehypePresetMinify from "rehype-preset-minify";
import rehypePrismPlus from "rehype-prism-plus";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
var root = process.cwd();
var computedFields = {
  "filePath": {
    "resolve": (doc) => doc._raw.sourceFilePath,
    "type": "string"
  },
  "path": {
    "resolve": (doc) => doc._raw.flattenedPath,
    "type": "string"
  },
  "readingTime": { "resolve": (doc) => readingTime(doc.body.raw), "type": "json" },
  "slug": {
    "resolve": (doc) => doc._raw.flattenedPath.replace(/^.+?(\/)/, ""),
    "type": "string"
  },
  "toc": { "resolve": (doc) => extractTocHeadings(doc.body.raw), "type": "string" }
};
function createTagCount(allBlogs) {
  const tagCount = {};
  allBlogs.forEach((file) => {
    if (file.tags && file.draft !== true)
      file.tags.forEach((tag) => {
        const formattedTag = GithubSlugger.slug(tag);
        if (formattedTag in tagCount)
          tagCount[formattedTag] += 1;
        else
          tagCount[formattedTag] = 1;
      });
  });
  writeFileSync("./app/tag-data.json", JSON.stringify(tagCount));
}
function createSearchIndex(allBlogs) {
  if (import_siteMetadata.default?.search?.provider === "kbar" && import_siteMetadata.default.search.kbarConfig.searchDocumentsPath) {
    writeFileSync(
      `public/${import_siteMetadata.default.search.kbarConfig.searchDocumentsPath}`,
      JSON.stringify(allCoreContent(sortPosts(allBlogs)))
    );
    console.log("Local search index generated...");
  }
}
var Post = defineDocumentType(() => {
  return {
    "computedFields": {
      ...computedFields,
      "structuredData": {
        "resolve": (doc) => {
          return {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "author": doc.authors,
            "dateModified": doc.lastmod || doc.date,
            "datePublished": doc.date,
            "description": doc.summary,
            "headline": doc.title,
            "image": doc.images ? doc.images[0] : import_siteMetadata.default.socialBanner,
            "url": `${import_siteMetadata.default.siteUrl}/${doc._raw.flattenedPath}`
          };
        },
        "type": "json"
      }
    },
    "contentType": "mdx",
    "fields": {
      "bibliography": { "type": "string" },
      "category": { "required": true, "type": "string" },
      "date": { "required": true, "type": "date" },
      "draft": { "type": "boolean" },
      "featured": { "type": "boolean" },
      "layout": { "type": "string" },
      "subtitle": { "required": false, "type": "string" },
      "summary": { "type": "string" },
      "tags": { "default": [], "of": { "type": "string" }, "type": "list" },
      "title": { "required": true, "type": "string" }
    },
    "filePathPattern": "blog/**/*.mdx",
    "name": "Post"
  };
});
var Project = defineDocumentType(() => {
  return {
    "computedFields": {
      ...computedFields,
      "structuredData": {
        "resolve": (doc) => {
          return {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "author": doc.authors,
            "dateModified": doc.lastmod || doc.date,
            "datePublished": doc.date,
            "description": doc.summary,
            "headline": doc.title,
            "image": doc.images ? doc.images[0] : import_siteMetadata.default.socialBanner,
            "url": `${import_siteMetadata.default.siteUrl}/${doc._raw.flattenedPath}`
          };
        },
        "type": "json"
      }
    },
    "contentType": "mdx",
    "fields": {
      "bibliography": { "type": "string" },
      "category": { "required": true, "type": "string" },
      "date": { "required": true, "type": "date" },
      "draft": { "type": "boolean" },
      "featured": { "type": "boolean" },
      "github": { "required": true, "type": "string" },
      "layout": { "required": true, "type": "string" },
      "subtitle": { "required": false, "type": "string" },
      "summary": { "type": "string" },
      "tags": { "default": [], "of": { "type": "string" }, "type": "list" },
      "title": { "required": true, "type": "string" }
    },
    "filePathPattern": "blog/**/*.mdx",
    "name": "Project"
  };
});
var Author = defineDocumentType(() => {
  return {
    computedFields,
    "contentType": "mdx",
    "fields": {
      "avatar": { "type": "string" },
      "company": { "type": "string" },
      "email": { "type": "string" },
      "github": { "type": "string" },
      "layout": { "type": "string" },
      "linkedin": { "type": "string" },
      "name": { "required": true, "type": "string" },
      "occupation": { "type": "string" },
      "twitter": { "type": "string" }
    },
    "filePathPattern": "authors/**/*.mdx",
    "name": "Author"
  };
});
var contentlayer_config_default = makeSource({
  "contentDirPath": "data",
  "documentTypes": [Post, Author, Project],
  "mdx": {
    "cwd": process.cwd(),
    "rehypePlugins": [
      rehypeSlug,
      rehypeAutolinkHeadings,
      rehypeKatex,
      [rehypeCitation, { "path": path.join(root, "data") }],
      [rehypePrismPlus, { "defaultLanguage": "js", "ignoreMissing": true }],
      rehypePresetMinify
    ],
    "remarkPlugins": [
      remarkExtractFrontmatter,
      remarkGfm,
      remarkCodeTitles,
      remarkMath,
      remarkImgToJsx
    ]
  },
  "onSuccess": async (importData) => {
    const { allBlogs } = await importData();
    createTagCount(allBlogs);
    createSearchIndex(allBlogs);
  }
});
export {
  Author,
  Post,
  Project,
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-3C273FI7.mjs.map
