'use client';

import { useState } from 'react';

import Link from '@/components/elements/Link';
import { Pagination, POSTS_PER_PAGE } from '@/components/elements/Pagination';
import Post from '@/components/elements/Post';
import Search from '@/components/elements/Search';

export default function ListLayout({ posts, listTitle, linkAllPosts = false, baseURL, paginationURL, currentPage, totalPages }) {

  const [ searchValue, setSearchValue ] = useState('');
  const initialDisplayPosts = posts.slice(0, POSTS_PER_PAGE);
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
          <h1 className='font-extrabold capitalize leading-9 tracking-tight text-gray-900 dark:text-gray-100 text-3xl sm:text-3xl sm:leading-10 md:text-4xl md:leading-14'>
            {listTitle}
          </h1>
        </div>
        <Search setSearchValue={ setSearchValue }></Search>
        <ul className='pt-8'>
          {!filteredBlogPosts.length && 'No posts found'}
          {displayPosts.map((frontMatter) => (
            <Post key={ frontMatter.slug } frontMatter={ frontMatter } />
          ))}
        </ul>
        {linkAllPosts && (
          <div className='flex justify-end text-base font-medium leading-6 border-none'>
            <Link href='/blog' className='text-primary-500 hover:text-primary-600 dark:hover:text-primary-400' aria-label='all posts' >
              All Posts
            </Link>
          </div>
        )}
      </div>
      { pagination.totalPages > 1 && !searchValue && (
        <Pagination currentPage={ pagination.currentPage } totalPages={ pagination.totalPages } paginationURL={ paginationURL } baseURL={ baseURL }/>
      )}
    </>
  );
}
