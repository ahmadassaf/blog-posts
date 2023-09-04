import Link from 'next/link';

const Tag = ({ text, slug }) => (
  <Link href={ `/blog/tag/${slug || text.replace(' ', '-').toLowerCase()}` } className='font-small my-1 mr-1 inline-flex items-center rounded-sm bg-blue-600 px-2.5 py-0.5 hover:cursor-pointer hover:bg-blue-200 text-sm font-medium uppercase text-white hover:text-primary-600 dark:hover:text-primary-400'>
    {text}
  </Link>
);

export default Tag;
