import CommandPalette, { filterItems, getItemIndex } from '@tmikeladze/react-cmdk';

import prepareLauncherCollection  from '@/components/cmd/utils';

import '@tmikeladze/react-cmdk/dist/cmdk.css';

function ProjectsCmd({ setPage, search, projects }) {

  prepareLauncherCollection(projects);

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
                <div style={{ 'display': 'flex', 'flexDirection': 'column' }}>
                  <h1 style={{ 'fontSize': '16px' }}>{ title }</h1>
                  <h4 style={{ 'fontSize': '13px' }}>{ subtitle }</h4>
                </div>
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
