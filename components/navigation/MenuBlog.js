import React from 'react';

import MenuDropDown from '@/components/elements/DropDown';

const MenuBlog = ({ categories }) => {
  const [ menuBlogOpen, setMenuBlogOpen ] = React.useState(false);

  return (<>

    <MenuDropDown name='Categories' menuDropDownOpen={ menuBlogOpen } setMenuDropDownOpen={ setMenuBlogOpen }></MenuDropDown>

    {menuBlogOpen ? (
      <div className='absolute left-1/2 z-10 mt-5 flex w-screen max-w-max -translate-x-1/2 px-3 py-2 top-10'>
        <div className='w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5'>
          <div className='p-4'>

            {categories.map((category) => (
              <div key={ category.id } className='group relative flex rounded-lg p-3 hover:bg-gray-50'>
                <div>
                  <a href={ `/blog/categories/${category.id}` } className='font-semibold text-gray-900 hover:text-blue-600 capitalize'>
                    {category.title.replace('-', ' ')}
                    <span className='absolute inset-0'></span>
                    <p className='mt-1 text-gray-600 font-light text-s'>{category.description}</p>
                  </a>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    ) : null}

  </>);
};

export default MenuBlog;
