
export function _dateSortDesc(a, b) {
  if (a > b) return -1;
  if (a < b) return 1;

  return 0;
}

export function sortPosts(posts) {
  return posts.sort((a, b) => _dateSortDesc(a.date, b.date));
}

export const pick = (obj, keys) => keys.reduce((acc, key) => {
  acc[key] = obj[key] ?? null;

  return acc;
}, {});

export const omit = (obj, keys) => {
  const result = { ...obj };

  keys.forEach((key) => {
    delete result[key];
  });

  return result;
};

export function coreContent(content) {
  const _core = (item) => omit(item, [ 'body', '_raw', '_id', 'toc', 'structuredData' ]);

  return Array.isArray(content) ? content.map((item) => _core(item)) : _core(content);
}
