import CommandPalette, { filterItems, getItemIndex } from '@tmikeladze/react-cmdk';

import CmdProject from '@/components/cmd/types/CmdProject';

import '@tmikeladze/react-cmdk/dist/cmdk.css';

function ProjectsCmd({ setPage, search, projects }) {

  const projectItems = filterItems(
    [
      {
        'heading': 'Projects',
        'id': 'projects',
        'items': projects,
        'options': { 'filterOnListHeading': true }
      }
    ], search
  );

  return (
    <CommandPalette.Page id='projects' searchPrefix={ [ 'General', 'Projects' ] } onEscape={ () => {
      setPage('root');
    } }>

      {projectItems.length ? (
        projectItems.map((list) => (
          <CommandPalette.List key={ list.id } heading={ list.heading }>
            {list.items.map(({ id, title, subtitle, ...rest }) => (
              <CommandPalette.ListItem
                key={ id }
                index={ getItemIndex(projectItems, id) }
                { ...rest }
              >
                <CmdProject title={ title } subtitle={ subtitle }/>
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
