import { writeFileSync } from 'fs';

import kebabCase from '../utils/kebabCase';

function getAllTags(allPosts) {
  const tags = {};

  allPosts.forEach((post) => {
    if (post.tags) post.tags.forEach((tag) => {
      const formattedTag = kebabCase(tag).trim();

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
