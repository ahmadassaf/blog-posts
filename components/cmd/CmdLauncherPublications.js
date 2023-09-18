import CommandPalette, { filterItems, getItemIndex } from '@tmikeladze/react-cmdk';

import CmdPublication from '@/components/cmd/types/CmdPublication';

import '@tmikeladze/react-cmdk/dist/cmdk.css';

function ProjectsCmd({ setPage, search, publications }) {

  const publicationItems = filterItems(
    [
      {
        'heading': 'Publications',
        'id': 'publications',
        'items': publications,
        'options': { 'filterOnListHeading': true }
      }
    ], search
  );

  return (
    <CommandPalette.Page id='publications' searchPrefix={ [ 'General', 'Publications' ] } onEscape={ () => {
      setPage('root');
    } }>

      {publicationItems.length ? (
        publicationItems.map((list) => (
          <CommandPalette.List key={ list.id } heading={ list.heading }>
            {list.items.map(({ id, title, year, ...rest }) => (
              <CommandPalette.ListItem
                key={ id }
                index={ getItemIndex(publicationItems, id) }
                { ...rest }
              >
                <CmdPublication title={ title } year={ year }/>
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
