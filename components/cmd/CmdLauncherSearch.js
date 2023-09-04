import { useCallback, useEffect, useState } from 'react';
import CommandPalette, { getItemIndex } from '@tmikeladze/react-cmdk';
import { allPosts } from 'contentlayer/generated';
import { Index } from 'flexsearch';

import CmdPost from '@/components/cmd/types/CmdPost';
import CmdProject from '@/components/cmd/types/CmdProject';
import IconSearchError from '@/static/icons/searchError.svg';

import '@tmikeladze/react-cmdk/dist/cmdk.css';

const index = new Index({
  'cache': true,
  'contextual': true,
  'preset': 'match',
  'tokenize': 'full'
});

allPosts.forEach((post) => {
  index.add(post.slug, post.body.raw);
});

function SearchCmd({ search, setShowType, content }) {
  const [ searchResult, setSearchResult ] = useState([]);

  const searchAPI = useCallback(async(query) => {
    setSearchResult({ 'items': content.filter((_content) => index.search(query).includes(_content.slug)) });

  }, [ content ]);

  useEffect(() => {
    searchAPI(search).catch(console.error);
  }, [ searchAPI, search ]);

  if (!searchResult) searchAPI(search);

  return (
    <div>
      { searchResult.items && searchResult.items.length ? (
        <div>
          {searchResult.items && searchResult.items.length && (
            <CommandPalette.List key='fullTextSearch' heading={ 'Full-text Search Results' }>
              {searchResult.items.map(({ id, type, title, subtitle, category, ...rest }) => (
                <CommandPalette.ListItem
                  key={ id }
                  index={ getItemIndex([ searchResult ], id) }
                  { ...rest }
                >
                  {(() => {
                    switch (type) {
                    case 'post':
                      return <CmdPost title={ title } category={ category }/>;
                    case 'project':
                      return <CmdProject title={ title } subtitle={ subtitle } showType={ true }/>;
                    default:
                      return <CmdPost title={ title } category={ category }/>;
                    }
                  })()}
                </CommandPalette.ListItem>
              ))}
            </CommandPalette.List>
          )}
        </div>
      ) : (
        <div className='flex flex-column items-center'>
          <IconSearchError className='m-2'/>
          <p>Cannot find any match (Full-text search enabled)</p>
        </div>
      )}
    </div>
  );
}

export default SearchCmd;
