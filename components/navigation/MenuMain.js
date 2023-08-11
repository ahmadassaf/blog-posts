import React from 'react';

import MenuDropDown from '@/components/elements/DropDown';
import Link from '@/components/mdx/Link';
import formatDate from '@/lib/utils/formatDate';

const MenuMain = ({ navigation }) => {
  const [ menuBlogOpen, setMenuBlogOpen ] = React.useState(false);

  return (<>

    <MenuDropDown name='Blog' menuDropDownOpen={ menuBlogOpen } setMenuDropDownOpen={ setMenuBlogOpen }></MenuDropDown>

    {menuBlogOpen ? (
      <div className='absolute left-1/2 z-10 mt-5 flex w-screen max-w-max -translate-x-1/2 px-4 top-10'>
        <div className='w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5'>
          <div className='p-4'>

            {navigation.categories.map((category) => (
              <div key={ category.id } className='group relative flex rounded-lg px-3 py-2 hover:bg-gray-50'>
                <div>
                  <a href={ `/blog/category/${category.id}` } className='font-semibold text-gray-900 hover:text-blue-600 capitalize'>
                    {category.title.replace('-', ' ')}
                    <span className='absolute inset-0'></span>
                    <p className='mt-1 text-gray-600 font-light text-s'>{category.description}</p>
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className='bg-blue-50 p-8'>
            <div className='flex justify-between'>
              <h3 className='text-sm font-semibold leading-6 text-gray-500'>Recent posts</h3>
              <Link href={ `/blog` } className='text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600' >See all &rarr;</Link>
            </div>
            <ul role='list' className='mt-2 space-y-6'>
              {navigation.initialDisplayPosts.map((post) => (
                <li key={ post.slug } className='relative'>
                  <time dateTime={ post.date } className='block text-xs leading-6 text-gray-600 font-light'>{formatDate(post.date)}</time>
                  <a href={ `/${post.slug}` } className='block truncate text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600'>
                    {post.title}
                    <span className='absolute inset-0'></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    ) : null}

  </>);
};

export default MenuMain;
