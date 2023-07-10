import Link from '@/components/mdx/Link';

const PostNavigation = ({ next, prev }) => (
  <div className='divide-gray-200 text-sm font-medium leading-5 dark:divide-gray-700'>
    {(next || prev) && (
      <div className='flex justify-between py-4'>
        {prev && (
          <div>
            <h2 className='text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400'>
                Previous Article
            </h2>
            <div className='text-primary-500 hover:text-primary-600 dark:hover:text-primary-400'>
              <Link href={ `/blog/${prev.slug}` }>{prev.title}</Link>
            </div>
          </div>
        )}
        {next && (
          <div>
            <h2 className='text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400'>
                Next Article
            </h2>
            <div className='text-primary-500 hover:text-primary-600 dark:hover:text-primary-400'>
              <Link href={ `/blog/${next.slug}` }>{next.title}</Link>
            </div>
          </div>
        )}
      </div>
    )}
  </div>
);

export default PostNavigation;
