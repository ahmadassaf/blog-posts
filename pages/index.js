import CommandLauncher from '@/components/blocks/CommandLauncher';
import { PageSEO } from '@/components/utils/SEO';
import siteMetadata from '@/data/meta/metadata';
import ListLayout from '@/layouts/ListLayout';
import { getAllFilesFrontMatter } from '@/lib/mdx';

export async function getStaticProps() {
  const posts = await getAllFilesFrontMatter('blog');

  return { 'props': { posts } };
}

export default function Home({ posts }) {
  return (
    <>
      <PageSEO title={ siteMetadata.title } description={ siteMetadata.description } />

      <div className='divide-y divide-gray-200 dark:divide-gray-700'>
        <div className='space-y-2 pt-6 pb-8 md:space-y-5'>
          <h1 className='pb-6 text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14'>
                Hi, I'm{' '}
            <span className='text-primary-color-500 dark:text-primary-color-dark-500'>
              {siteMetadata.author}
            </span>
          </h1>
          <h2>{`Welcome to ${siteMetadata.description}. ${siteMetadata.about}`}</h2>
          <CommandLauncher/>
        </div>
        <ListLayout posts={ posts } linkAllPosts={ true } listTitle='Latest Posts' />
      </div>
    </>
  );
}
