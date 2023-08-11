
import React from 'react';

import NewsletterForm from '@/components/forms/NewsletterForm';
import Link from '@/components/mdx/Link';
import ThemeLogo from '@/components/navigation/MenuLogo';
import MenuSearch from '@/components/navigation/MenuSearch';
import siteMetadata from '@/data/meta/metadata';

const MenuMobile = ({ navigation, setMobileMenuOpen, setLauncherOpen }) => (
  <div className='lg:hidden' role='dialog' aria-modal='true'>

    <div className='fixed shadow dark:bg-gray-900 inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10'>
      <div className='flex items-center justify-between'>
        <div className='sm:invisible'>
          <ThemeLogo/>
        </div>
        <button type='button' className='-m-2.5 rounded-md p-2.5 text-gray-700' onClick={ () => setMobileMenuOpen(false) }>
          <span className='sr-only'>Close menu</span>
          <svg className='h-6 w-6 dark:stroke-white' fill='none' viewBox='0 0 24 24' strokeWidth='1.5' stroke='currentColor' aria-hidden='true'>
            <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
          </svg>
        </button>
      </div>
      <div className='flow-root'>
        <div className='-my-6 divide-y divide-gray-500/10'>
          <div className='space-y-2 py-6'>

            <div className='hidden max-sm:flex flex-1 items-center justify-center px-2 lg:ml-6 lg:justify-end mt-4'>
              <MenuSearch setOpen={ setLauncherOpen }></MenuSearch>
            </div>

            <Link href={ `/blog` } onClick={ () => setMobileMenuOpen(false) } className='-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-blue-50 dark:text-white dark:hover:text-gray-900'>Blog</Link>
            <div className='-mx-3'>

              <div className='mt-2 space-y-2' id='disclosure-1'>
                {navigation.categories.map((category) => (
                  <a key={ category.id } href={ `/blog/category/${category.id}` } className='group capitalize block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-blue-50 dark:text-white dark:hover:text-gray-900'>{category.title.replace('-', ' ')}
                    <p className='mt-1 text-gray-600 font-light text-s dark:text-gray-100 dark:group-hover:text-gray-600'>{category.description}</p>
                  </a>
                ))}
              </div>

            </div>

            {navigation.links.map((link) => (
              <a key={ link.href } href={ link.href } className='-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-blue-50 dark:text-white dark:hover:text-gray-900'>{link.title}</a>
            ))}

          </div>

          <div>
            {siteMetadata.newsletter.provider !== '' && <NewsletterForm />}
          </div>

        </div>
      </div>
    </div>
  </div>
);

export default MenuMobile;
