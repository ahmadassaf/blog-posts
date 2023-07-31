import CommandPalette, { filterItems, getItemIndex } from '@tmikeladze/react-cmdk';

import prepareLauncherCollection  from '@/components/cmd/utils';

import '@tmikeladze/react-cmdk/dist/cmdk.css';

function PostsCmd({ setPage, search, posts }) {

  prepareLauncherCollection(posts);

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
            {list.items.map(({ id, title, ...rest }) => (
              <CommandPalette.ListItem
                key={ id }
                index={ getItemIndex(postsItems, id) }
                { ...rest }
              >
                { title }
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
