import readingTime from 'reading-time';

import { extractTocHeadings } from '../mdx/index.js';

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

export default computedFields;
