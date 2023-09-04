import { writeFileSync } from 'fs';

function getAllTags(allPosts) {
  const tags = {};

  allPosts.forEach((post) => {
    if (post.tags) post.tags.forEach((tag) => {
      const formattedTag = tag.replace(' ', '-').toLowerCase().trim();

      if (tags[formattedTag]) tags[formattedTag].count++;
      else tags[formattedTag] = {
        'children': tag,
        'count': 1,
        'display': tag,
        'href': `/blog/tag/${formattedTag}`,
        'id': formattedTag,
        'showType': false,
        'slug': formattedTag,
        'title': tag,
        'type': 'tag'
      };
    });
  });

  writeFileSync(`./app/content/tags.json`, JSON.stringify(Object.values(tags)));
}

export default getAllTags;
