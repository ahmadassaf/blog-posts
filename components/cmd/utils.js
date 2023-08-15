export const prepareLauncherCollection = (collection, type) => {

  collection.forEach((item) => {
    item.id = item.slug;
    item.type = type;
    item.showType = false;
    item.href = `/blog/${item.slug}`;
    item.children = item.title;

  });
};
