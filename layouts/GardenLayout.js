import { useState } from 'react';

import { Pagination } from '@/components/elements/Pagination';
import Search from '@/components/elements/Search';
import Plant from '@/components/garden/Plant';

export default function GardenLayout({ posts, baseURL, paginationURL, currentPage, totalPages }) {

  const [ searchValue, setSearchValue ] = useState('');
  const [ neuron, setNeuron ] = useState('');
  const initialDisplayPosts = posts.slice(0, 15);
  const pagination = { 'currentPage': currentPage || 1, 'totalPages': totalPages || Math.ceil(posts.length / 15) };
  const filteredBlogPosts = posts.filter((post) => {

    const searchContent = post.name + post.summary + post.keys;

    return searchContent.toLowerCase().includes(searchValue.toLowerCase());
  });

  const displayPosts = initialDisplayPosts.length > 0 && !searchValue ? initialDisplayPosts : filteredBlogPosts;
  const handleNeuronChange = (post) => {
    setNeuron(post);
  };

  return (
    <>
      <div className='grid grid-cols-3'>
        <div className='divide-y divide-gray-200 dark:divide-gray-700 col-span-2'>
          <div className='space-y-1'>
            <h1 className='font-extrabold capitalize leading-9 tracking-tight text-gray-900 dark:text-gray-100 text-3xl sm:text-3xl sm:leading-10 md:text-5xl md:leading-14'>
                My Second Brain
            </h1>
          </div>
          <Search setSearchValue={ setSearchValue }></Search>
          <ul className='pt-8'>
            {!filteredBlogPosts.length && 'No posts found'}
            {displayPosts.map((post) => (
              <Plant key={ post._id } post={ post } onClick={ () => handleNeuronChange(post) } />
            ))}
          </ul>
        </div>
        <div id='preview'>
          { neuron && <div dangerouslySetInnerHTML={{ '__html': neuron.body.html }} />}
        </div>
      </div>
      { pagination.totalPages > 1 && !searchValue && (
        <Pagination currentPage={ pagination.currentPage } totalPages={ pagination.totalPages } paginationURL={ paginationURL } baseURL={ baseURL }/>
      )}
    </>
  );
}
