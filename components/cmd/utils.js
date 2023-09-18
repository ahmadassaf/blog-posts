import { omit } from '@/lib/utils/contentlayer';

export const prepareLauncherCollection = (collection, type) => {

  collection.forEach((item, key) => {
    item.id = item.slug;
    item.type = type;
    item.showType = false;
    item.href = type === 'publication' ? item.href : `/blog/${item.slug}`;
    item.children = item.title;

    collection[key] = omit(item, [ 'featured', 'filePath', 'readingTime' ]);

  });
};
