import path from 'path';

import getAllFilesRecursively from './utils/files';

const root = process.cwd();

export function getFiles(type) {
  const prefixPaths = path.join(root, 'data', type);
  const files = getAllFilesRecursively(prefixPaths);

  return files.map((file) => file.slice(prefixPaths.length + 1).replace(/\\/g, '/'));
}

export function formatSlug(slug) {
  return slug.replace(/\.(?<mdx>mdx|md)/, '');
}
