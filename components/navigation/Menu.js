import { React, useState } from 'react';
import { useRouter } from 'next/router';

import CommandLauncher from '@/components/cmd/launcher';
import Link from '@/components/mdx/Link';
import MenuBlog from '@/components/navigation/MenuBlog';
import ThemeLogo from '@/components/navigation/MenuLogo';
import MenuMobile from '@/components/navigation/MenuMobile';
import MenuSearch from '@/components/navigation/MenuSearch';
import ThemeSwitch from '@/components/utils/ThemeSwitcher';
import siteMetadata from '@/data/meta/metadata';

const Menu = ({ navigation }) => {

  const router = useRouter();
  const path = router?.asPath;
  const [ mobileMenuOpen, setMobileMenuOpen ] = useState(false);
  const [ LauncherOpen, LauncherSetOpen ] = useState(false);

  return (<nav className='flex h-16 items-center justify-between px-0 py-16 first-letter:mx-auto max-w-7xl'>

    <Link href='/' aria-label={ siteMetadata.author.name }>
      <div className='flex items-center justify-between'>
        <div className='mr-3 flex'>
          <ThemeLogo />
        </div>
      </div>
    </Link>

    <div className='flex items-center flex-row-reverse'>

      <div className='flex lg:hidden'>
        <button type='button' className='-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700' onClick={ () => setMobileMenuOpen(true) }>
          <span className='sr-only'>Open main menu</span>
          <svg fill='none' viewBox='0 0 24 24' strokeWidth='1.5' stroke='currentColor' className='h-6 w-6 dark:stroke-white' aria-hidden='true'>
            <path strokeLinecap='round' strokeLinejoin='round' d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5' />
          </svg>
        </button>
      </div>

      <ThemeSwitch />

      {mobileMenuOpen ? (<MenuMobile navigation={ navigation } setMobileMenuOpen={ setMobileMenuOpen } setLaunherOpen={ LauncherSetOpen } />) : null}
      <div className='mx-auto max-w-7xl px-2 lg:px-8'>
        <div className='flex h-16 justify-between'>
          <div className='flex px-2 lg:px-0 relative'>
            <div className='hidden lg:ml-6 lg:flex lg:space-x-8'>
              <ul className='invisible lg:visible flex-row-reverse sm:flex items-center'>
                {navigation.links.map((link) => {
                  if (
                    (link.hideInPath === '*' || path.includes(link.hideInPath)) && !path.includes(link.showInPath)) return true;

                  return (
                    <li key={ link.href }>
                      <Link href={ link.href } className='p-1 font-medium sm:p-4 text-gray-900 dark:text-gray-100 hover:text-blue-600'>
                        {link.title}
                      </Link>
                    </li>
                  );
                })}

                <MenuBlog navigation={ navigation }></MenuBlog>

              </ul>
            </div>
          </div>

          <div className='max-sm:hidden flex flex-1 items-center justify-center px-2 lg:ml-6 lg:justify-end'>
            <MenuSearch setOpen={ LauncherSetOpen }></MenuSearch>
          </div>

        </div>
      </div>
      <CommandLauncher projects={ navigation.projects } posts={ navigation.posts } open={ LauncherOpen } setOpen={ LauncherSetOpen }/>
    </div>
  </nav>
  );
};

export default Menu;