import CommandPalette, { filterItems, getItemIndex } from '@tmikeladze/react-cmdk';

import CmdTag from '@/components/cmd/types/CmdTag';

import '@tmikeladze/react-cmdk/dist/cmdk.css';

function ProjectsCmd({ setPage, search, tags }) {

  const tagItems = filterItems(
    [
      {
        'heading': 'Tags',
        'id': 'tags',
        'items': tags,
        'options': { 'filterOnListHeading': true }
      }
    ], search
  );

  return (
    <CommandPalette.Page id='tags' searchPrefix={ [ 'General', 'Tags' ] } onEscape={ () => {
      setPage('root');
    } }>

      {tagItems.length ? (
        tagItems.map((list) => (
          <CommandPalette.List key={ list.id } heading={ list.heading }>
            {list.items.map(({ id, title, count, ...rest }) => (
              <CommandPalette.ListItem
                key={ id }
                index={ getItemIndex(tagItems, id) }
                { ...rest }
              >
                <CmdTag title={ title } count={ count }/>
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

export default ProjectsCmd;
