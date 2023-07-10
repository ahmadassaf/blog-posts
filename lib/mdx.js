import fs from 'fs';
import matter from 'gray-matter';
import { bundleMDX } from 'mdx-bundler';
import path from 'path';
import readingTime from 'reading-time';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeCitation from 'rehype-citation';
import rehypeKatex from 'rehype-katex';
import rehypePresetMinify from 'rehype-preset-minify';
import rehypePrismPlus from 'rehype-prism-plus';
import rehypeSlug from 'rehype-slug';
import remarkFootnotes from 'remark-footnotes';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import getAllFilesRecursively from './utils/files';
import remarkCodeTitles from './remark-code-title';
import remarkExtractFrontmatter from './remark-extract-frontmatter';
import remarkImgToJsx from './remark-img-to-jsx';
import remarkTocHeadings from './remark-toc-headings';

const root = process.cwd();

export function getFiles(type) {
  const prefixPaths = path.join(root, 'data', type);
  const files = getAllFilesRecursively(prefixPaths);

  return files.map((file) => file.slice(prefixPaths.length + 1).replace(/\\/g, '/'));
}

export function formatSlug(slug) {
  // eslint-disable-next-line prefer-named-capture-group
  return slug.replace(/\.(mdx|md)/, '');
}

export function dateSortDesc(a, b) {
  if (a > b) return -1;
  if (a < b) return 1;

  return 0;
}

export async function getFileBySlug(type, slug) {
  const mdxPath = path.join(root, 'data', type, `${slug}.mdx`);
  const mdPath = path.join(root, 'data', type, `${slug}.md`);
  const source = fs.existsSync(mdxPath) ? fs.readFileSync(mdxPath, 'utf8') : fs.readFileSync(mdPath, 'utf8');

  if (process.platform === 'win32') process.env.ESBUILD_BINARY_PATH = path.join(root, 'node_modules', 'esbuild', 'esbuild.exe');
  else process.env.ESBUILD_BINARY_PATH = path.join(root, 'node_modules', 'esbuild', 'bin', 'esbuild');

  const toc = [];

  const { code, frontmatter } = await bundleMDX({

    // Mdx imports can be automatically source from the components directory
    'cwd': path.join(root, 'components'),

    'esbuildOptions': (options) => {
      options.loader = {
        ...options.loader,
        '.js': 'jsx'
      };

      return options;
    },
    source,
    xdmOptions(options) {

      // This is the recommended way to add custom remark/rehype plugins: The syntax might look weird, but it protects you in case we add/remove plugins in the future
      options.remarkPlugins = [
        ...(options.remarkPlugins ?? []),
        remarkExtractFrontmatter,
        [ remarkTocHeadings, { 'exportRef': toc }],
        remarkGfm,
        remarkCodeTitles,
        [ remarkFootnotes, { 'inlineNotes': true }],
        remarkMath,
        remarkImgToJsx
      ];
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        rehypeSlug,
        rehypeAutolinkHeadings,
        rehypeKatex,
        [ rehypeCitation, { 'linkCitations': true, 'path': path.join(root, 'data/meta') }],
        [ rehypePrismPlus, { 'ignoreMissing': true }],
        rehypePresetMinify
      ];

      return options;
    }
  });

  return {
    'frontMatter': {
      'fileName': fs.existsSync(mdxPath) ? `${slug}.mdx` : `${slug}.md`,
      'readingTime': readingTime(code),
      'slug': slug || null,
      ...frontmatter,
      'date': frontmatter.date ? new Date(frontmatter.date).toISOString() : null
    },
    'mdxSource': code,
    toc
  };
}

export async function getAllFilesFrontMatter(folder) {
  const prefixPaths = path.join(root, 'data', folder);

  const files = getAllFilesRecursively(prefixPaths);

  const allFrontMatter = [];

  files.forEach((file) => {
    const fileName = file.slice(prefixPaths.length + 1).replace(/\\/g, '/');

    if (path.extname(fileName) !== '.md' && path.extname(fileName) !== '.mdx') return;

    const source = fs.readFileSync(file, 'utf8');
    const { 'data': frontmatter } = matter(source);

    allFrontMatter.push({
      ...frontmatter,
      'date': frontmatter.date ? new Date(frontmatter.date).toISOString() : null,
      'slug': formatSlug(fileName)
    });

  });

  return allFrontMatter.sort((a, b) => dateSortDesc(a.date, b.date));
}
