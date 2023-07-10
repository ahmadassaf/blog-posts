import fs from 'fs';
import path from 'path';

const pipe =
  (...fns) => (x) => fns.reduce((v, f) => f(v), x);

const flattenArray = (input) => input.reduce((acc, item) => [ ...acc, ...(Array.isArray(item) ? item : [ item ]) ], []);

const map = (fn) => (input) => input.map(fn);

const pathJoinPrefix = (prefix) => (extraPath) => path.join(prefix, extraPath);

// eslint-disable-next-line no-use-before-define
const getAllFilesRecursively = (folder) => pipe(fs.readdirSync, map(pipe(pathJoinPrefix(folder), walkDir)), flattenArray)(folder);

const walkDir = (fullPath) => (fs.statSync(fullPath).isFile() ? fullPath : getAllFilesRecursively(fullPath));

export default getAllFilesRecursively;
