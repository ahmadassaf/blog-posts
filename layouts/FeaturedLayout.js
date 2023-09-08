import { allPosts } from 'contentlayer/generated';

import { coreContent, sortPosts } from '@/lib/utils/contentlayer';
import formatDate from '@/lib/utils/formatDate';

export default function ListLayout() {

  const posts = coreContent(sortPosts(allPosts));

  const featuredPost = posts.slice(0, 1)[0];
  const displayPosts = posts.slice(1, 3);

  return (
    <div className='mx-auto grid max-w-7xl grid-cols-1 gap-x-8 gap-y-12 sm:gap-y-16 lg:grid-cols-2 border-none'>
      <article className='mx-auto w-full max-w-2xl lg:mx-0 lg:max-w-lg'>
        <time dateTime={ formatDate(featuredPost.date) } className='block text-sm leading-6 text-gray-600'>
          {formatDate(featuredPost.date)}
        </time>
        <h2 id='featured-post' className='mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>
          {featuredPost.title}
        </h2>
        <p className='mt-4 text-lg leading-8 text-gray-600'>{featuredPost.summary}</p>
        <div className='mt-4 flex flex-col justify-between gap-6 sm:mt-8 sm:flex-row-reverse sm:gap-8 lg:mt-4 lg:flex-col'>
          <div className='flex'>
            <a href={ `/blog/${featuredPost.slug}` } className='text-sm font-semibold leading-6 text-blue-600' aria-describedby='featured-post'>Continue reading <span aria-hidden='true'>&rarr;</span></a>
          </div>
        </div>
      </article>
      <div className='mx-auto w-full max-w-2xl border-t border-gray-900/10 pt-12 sm:pt-16 lg:mx-0 lg:max-w-none lg:border-t-0 lg:pt-0'>
        <div className='-my-12 divide-y divide-gray-900/10'>
          {displayPosts.map((post) => (
            <article key={ post.slug } className='py-10'>
              <div className='group relative max-w-xl'>
                <time dateTime={ post.datetime } className='block text-sm leading-6 text-gray-600'>
                  {formatDate(post.date)}
                </time>
                <h2 className='mt-2 text-lg font-semibold text-gray-900 group-hover:text-gray-600'>
                  <a href={ `/blog/${post.slug}` }>
                    <span className='absolute inset-0' />
                    {post.title}
                  </a>
                </h2>
                <p className='mt-4 text-sm leading-6 text-gray-600'>{post.summary}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
