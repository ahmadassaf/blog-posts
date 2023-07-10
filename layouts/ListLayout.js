import { useState } from 'react';

import { Pagination, POSTS_PER_PAGE } from '@/components/blocks/Pagination';
import Post from '@/components/blocks/Post';
import Search from '@/components/blocks/Search';
import Link from '@/components/mdx/Link';

const MAX_LIST_DISPLAY = 5;

export default function ListLayout({ posts, listTitle, linkAllPosts = false, paginate, currentPage, totalPages }) {

  const [ searchValue, setSearchValue ] = useState('');
  const initialDisplayPosts = posts.slice(0, MAX_LIST_DISPLAY);
  const pagination = { 'currentPage': currentPage || 1, 'totalPages': totalPages || Math.ceil(posts.length / POSTS_PER_PAGE) };

  const filteredBlogPosts = posts.filter((frontMatter) => {
    const searchContent = frontMatter.title + frontMatter.summary + frontMatter.tags.join(' ');

    return searchContent.toLowerCase().includes(searchValue.toLowerCase());
  });

  const displayPosts = initialDisplayPosts.length > 0 && !searchValue ? initialDisplayPosts : filteredBlogPosts;

  return (
    <>
      <div className='divide-y divide-gray-200 dark:divide-gray-700'>
        <div className='space-y-2 pt-6 md:space-y-5'>
          <h1 className='font-extrabold capitalize leading-9 tracking-tight text-gray-900 dark:text-gray-100 text-3xl sm:text-3xl sm:leading-10 md:text-5xl md:leading-14'>
            {listTitle}
          </h1>
        </div>
        <Search setSearchValue={ setSearchValue }></Search>
        <ul className='pt-8'>
          {!filteredBlogPosts.length && 'No posts found.'}
          {displayPosts.map((frontMatter) => (
            <Post key={ frontMatter.slug } frontMatter={ frontMatter } />
          ))}
        </ul>
        {linkAllPosts && posts.length > MAX_LIST_DISPLAY && (
          <div className='flex justify-end text-base font-medium leading-6 border-none'>
            <Link href='/blog' className='text-primary-500 hover:text-primary-600 dark:hover:text-primary-400' aria-label='all posts' >
              All Posts
            </Link>
          </div>
        )}
      </div>
      { paginate && pagination.totalPages > 1 && !searchValue && (
        <Pagination currentPage={ pagination.currentPage } totalPages={ pagination.totalPages } />
      )}
    </>
  );
}
