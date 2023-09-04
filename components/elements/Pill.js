import Link from 'next/link';

const Pill = ({ text, slug }) => (
  <Link href={ `/blog/tag/${slug || text.replace(' ', '-').toLowerCase()}` } className='my-1 mr-1 inline-flex items-center rounded-sm bg-green-600 px-2.5 py-0.5 hover:cursor-pointer hover:bg-blue-200 text-xs text-white hover:text-primary-600 dark:hover:text-primary-400'>
    {text}
  </Link>
);

export default Pill;
