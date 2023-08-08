import CommandPalette, { filterItems, getItemIndex } from '@tmikeladze/react-cmdk';

import CmdPost from '@/components/cmd/types/CmdPost';

import '@tmikeladze/react-cmdk/dist/cmdk.css';

function PostsCmd({ setPage, search, posts }) {

  const postsItems = filterItems(
    [
      {
        'heading': 'Posts',
        'id': 'posts',
        'items': posts,
        'options': { 'filterOnListHeading': true }
      }
    ], search
  );

  return (
    <CommandPalette.Page id='posts' searchPrefix={ [ 'General', 'Posts' ] } onEscape={ () => {
      setPage('root');
    } }>

      {postsItems.length ? (
        postsItems.map((list) => (
          <CommandPalette.List key={ list.id } heading={ list.heading }>
            {list.items.map(({ id, title, category, ...rest }) => (
              <CommandPalette.ListItem
                key={ id }
                index={ getItemIndex(postsItems, id) }
                { ...rest }
              >
                <CmdPost title={ title } category={ category } />
              </CommandPalette.ListItem>
            ))}
          </CommandPalette.List>
        ))
      ) : (
        <CommandPalette.FreeSearchAction />
      )}
    </CommandPalette.Page>
  );
}

export default PostsCmd;
