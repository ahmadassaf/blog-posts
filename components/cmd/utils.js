export const prepareLauncherCollection = (collection, type) => {
  collection.forEach((item) => {
    if (type === 'tag') item.title = item.display;

    item.id = item.slug;
    item.type = type;
    item.showType = false;
    item.href = `/blog/${item.slug}`;
    item.children = type === 'tags' ? item.display : item.title;

  });
};
