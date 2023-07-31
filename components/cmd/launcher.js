
import React, { useState } from 'react';
import CommandPalette, { filterItems, getItemIndex } from '@tmikeladze/react-cmdk';
import { useTheme } from 'next-themes';

import PostsCmd from '@/components/cmd/posts';
import ProjectsCmd from '@/components/cmd/projects';

import '@tmikeladze/react-cmdk/dist/cmdk.css';

const CommandLauncher = ({ projects, posts, open, setOpen }) => {
  const [ page, setPage ] = useState('root');
  const [ search, setSearch ] = useState('');
  const [ selected, setSelected ] = useState(0);
  const { theme, setTheme, resolvedTheme } = useTheme();

  React.useEffect(() => {
    const down = (event) => {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen(!open);
        setPage('root');
      }
    };

    document.addEventListener('keydown', down);

    return () => document.removeEventListener('keydown', down);
  }, [ open, setOpen ]);

  const filteredItems = filterItems(
    [
      {
        'heading': 'Home',
        'id': 'home',
        'items': [
          {
            'children': 'Home',
            'href': '/',
            'icon': 'HomeIcon',
            'id': 'home'
          },
          {
            'children': 'Blog',
            'href': '/blog',
            'icon': 'BookOpenIcon',
            'id': 'blog'
          },
          {
            'children': 'Projects',
            'closeOnSelect': false,
            'icon': 'RectangleGroupIcon',
            'id': 'projects',
            'onClick': () => {
              setPage('projects');
            }
          },
          {
            'children': 'Posts',
            'closeOnSelect': false,
            'icon': 'RectangleStackIcon',
            'id': 'posts',
            'onClick': () => {
              setPage('posts');
            }
          }
        ]
      },
      {
        'heading': 'Other',
        'id': 'advanced',
        'items': [
          {
            'children': 'About me',
            'href': '/about',
            'icon': 'FingerPrintIcon',
            'id': 'privacy-policy'
          },
          {
            'children': 'Switch Theme',
            'closeOnSelect': false,
            'icon': 'ArrowRightOnRectangleIcon',
            'id': 'theme',
            'onClick': () => {
              setTheme(theme === 'dark' || resolvedTheme === 'dark' ? 'light' : 'dark');
            }
          }
        ]
      }
    ], search
  );

  return (
    <div>
      <CommandPalette
        commandPaletteContentClassName={ theme === `dark` ? `dark` : null }
        onChangeSelected={ setSelected }
        onChangeSearch={ setSearch }
        onChangeOpen={ setOpen }
        selected={ selected }
        search={ search }
        isOpen={ open }
        page={ page }
        footer={ <div className='text-sm p-2'>
          <div>Hit <span className='h-6 select-none items-center bg-gray-300 gap-1 rounded border bg-muted px-1.5 font-mono text-[12px] font-medium opacity-100'>esc</span> to go back to the previous page</div>
        </div> }
      >
        <CommandPalette.Page id='root' searchPrefix={ [ 'General' ] }>
          {filteredItems.length ? (
            filteredItems.map((list) => (
              <CommandPalette.List key={ list.id } heading={ list.heading }>
                {list.items.map(({ id, ...rest }) => (
                  <CommandPalette.ListItem
                    key={ id }
                    index={ getItemIndex(filteredItems, id) }
                    { ...rest }
                  />
                ))}
              </CommandPalette.List>
            ))
          ) : (
            <CommandPalette.FreeSearchAction />
          )}
        </CommandPalette.Page>

        <ProjectsCmd setPage={ setPage } search={ search } setSearch={ setSearch } projects= { projects } />
        <PostsCmd setPage={ setPage } search={ search } setSearch={ setSearch } posts= { posts } />

      </CommandPalette>
    </div>
  );
};

export default CommandLauncher;
