
import React, { useState } from 'react';
import CommandPalette, { filterItems, getItemIndex } from '@tmikeladze/react-cmdk';
import { useTheme } from 'next-themes';

import CmdFooter from '@/components/cmd/CmdLauncherFooter';
import PostsCmd from '@/components/cmd/CmdLauncherPosts';
import PublicationsCmd from '@/components/cmd/CmdLauncherPublications';
import SearchCmd from '@/components/cmd/CmdLauncherSearch';
import SocialCmd from '@/components/cmd/CmdLauncherSocial';
import TagsCmd from '@/components/cmd/CmdLauncherTags';
import ProjectsCmd from '@/components/cmd/CmdLaunherProjects';
import CmdPost from '@/components/cmd/types/CmdPost';
import CmdProject from '@/components/cmd/types/CmdProject';
import CmdPublication from '@/components/cmd/types/CmdPublication';
import CmdTag from '@/components/cmd/types/CmdTag';
import { prepareLauncherCollection }  from '@/components/cmd/utils';

import '@tmikeladze/react-cmdk/dist/cmdk.css';

const CommandLauncher = ({ projects, posts, publications, tags, open, setOpen }) => {
  const [ page, setPage ] = useState('root');
  const [ search, setSearch ] = useState('');
  const [ showType ] = useState(true);
  const [ selected, setSelected ] = useState(0);
  const { theme, setTheme, resolvedTheme } = useTheme();

  prepareLauncherCollection(posts, 'post');
  prepareLauncherCollection(projects, 'project');
  prepareLauncherCollection(publications, 'publication');

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
              setSearch('');
            }
          },
          {
            'children': 'Posts',
            'closeOnSelect': false,
            'icon': 'RectangleStackIcon',
            'id': 'posts',
            'onClick': () => {
              setPage('posts');
              setSearch('');
            }
          },
          {
            'children': 'Publications',
            'closeOnSelect': false,
            'icon': 'NewspaperIcon',
            'id': 'publications',
            'onClick': () => {
              setPage('publications');
              setSearch('');
            }
          },
          {
            'children': 'Tags',
            'closeOnSelect': false,
            'icon': 'TagIcon',
            'id': 'tags',
            'onClick': () => {
              setPage('tags');
              setSearch('');
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
            'children': 'Reach out',
            'closeOnSelect': false,
            'icon': 'IdentificationIcon',
            'id': 'contact',
            'onClick': () => {
              setPage('contact');
              setSearch('');
            }
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
      },
      {
        'heading': 'Posts',
        'hidden': true,
        'id': 'posts',
        'items': posts,
        'options': { 'filterOnListHeading': true }
      },
      {
        'heading': 'Projects',
        'hidden': true,
        'id': 'projects',
        'items': projects,
        'options': { 'filterOnListHeading': true }
      },
      {
        'heading': 'Publications',
        'hidden': true,
        'id': 'publications',
        'items': publications,
        'options': { 'filterOnListHeading': true }
      },
      {
        'heading': 'Tags',
        'hidden': true,
        'id': 'tags',
        'items': tags,
        'options': { 'filterOnListHeading': true }
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
        showType={ showType }
        isOpen={ open }
        page={ page }
        footer={ <CmdFooter /> }
      >
        <CommandPalette.Page id='root' searchPrefix={ [ 'General' ] }>
          {filteredItems.length ? (
            filteredItems.map((list) => (
              <div key={ list.id } className={ search.toLowerCase() === list.heading.toLowerCase() ? 'hidden' : '' }>
                <div className={ list.hidden && !search.length ? 'hidden' : 'visible' }>
                  <CommandPalette.List key={ list.id } heading={ list.heading } >
                    {list.items.map(({ id, title, subtitle, category, count, type, children, ...rest }) => (
                      <CommandPalette.ListItem
                        key={ id }
                        index={ getItemIndex(filteredItems, id) }
                        { ...rest }
                      >
                        {(() => {
                          switch (type) {
                          case 'post':
                            return <CmdPost title={ title } category={ category }/>;
                          case 'tag':
                            return <CmdTag title={ title } count={ count } CmdTag={ CmdTag }/>;
                          case 'project':
                            return <CmdProject title={ title } subtitle={ subtitle } showType={ showType }/>;
                          case 'publications':
                            return <CmdPublication title={ title } subtitle={ subtitle } showType={ showType }/>;
                          default:
                            return <div>{children}</div>;
                          }
                        })()}

                      </CommandPalette.ListItem>
                    ))}
                  </CommandPalette.List>
                </div>
              </div>
            ))
          ) : (<SearchCmd search={ search } content={ [ ...posts, ...projects ] } />)}
        </CommandPalette.Page>

        <ProjectsCmd setPage={ setPage } search={ search } setSearch={ setSearch } projects= { projects } />
        <PostsCmd setPage={ setPage } search={ search } setSearch={ setSearch } posts= { posts } />
        <TagsCmd setPage={ setPage } search={ search } setSearch={ setSearch } tags= { tags } />
        <SocialCmd setPage={ setPage } search={ search } setSearch={ setSearch } />
        <PublicationsCmd setPage={ setPage } search={ search } setSearch={ setSearch } publications= { publications } />

      </CommandPalette>
    </div>
  );
};

export default CommandLauncher;
