const prepareLauncherCollection = (collection) => {
  collection.forEach((item) => {
    item.id = item.slug;
    item.children = item.title;
    item.href = `/blog/${item.slug}`;
  });
};

export default prepareLauncherCollection;
