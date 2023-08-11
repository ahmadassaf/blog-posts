import { useCallback, useEffect, useState } from 'react';
import { TbFaceIdError } from 'react-icons/tb';
import CommandPalette, { getItemIndex } from '@tmikeladze/react-cmdk';

import CmdPost from '@/components/cmd/types/CmdPost';
import CmdProject from '@/components/cmd/types/CmdProject';

import '@tmikeladze/react-cmdk/dist/cmdk.css';
function SearchCmd({ search, content }) {
  const [ searchResult, setSearchResult ] = useState([]);

  const searchAPI = useCallback(async(query) => {

    const searchQuery = await fetch(`http://127.0.0.1:3000/api/search?q=${query}`);
    const searchResponse = await searchQuery.json();

    setSearchResult({ 'items': content.filter((_content) => searchResponse.includes(_content.slug)) });

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
          <TbFaceIdError className='m-2'/>
          <p>Cannot find any match (Full-text search enabled)</p>
        </div>
      )}
    </div>
  );
}

export default SearchCmd;
