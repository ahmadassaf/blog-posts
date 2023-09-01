import { Client } from '@notionhq/client';
import { defineDatabase, makeSource as notionMakeSource } from 'contentlayer-source-notion';

const client = new Client({ 'auth': 'secret_umqBiUvYgxi2AXNUeNzHZQUnY46AFLu1Qb0KsA92JmI' });

export const Plant = defineDatabase(() => {
  return {
    'computedFields': {
      'title': {
        'resolve': (post) => post.name.replace('<b className="notion-text-bold">', '').replace('</b>', ''),
        'type': 'string'
      },
      'url': {
        'resolve': (post) => `/garden/${post._id}`,
        'type': 'string'
      }
    },
    'databaseId': '94152ca0b4224319bfbdadec211c4074',
    'name': 'Plant'
  };
});

export default notionMakeSource({
  client,
  'databaseTypes': [ Plant ]
});

