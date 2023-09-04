import Link from '@/components/elements/Link';
import formatDate from '@/lib/utils/formatDate';

const Post = ({ frontMatter }) => (
  <li key={ frontMatter.slug } className='py-4'>
    <article className='group space-y-2 xl:grid xl:grid-cols-2 xl:items-baseline xl:space-y-0 cursor-pointer'>
      <div className='space-y-3 xl:col-span-3'>
        <Link href={ `/blog/${frontMatter.slug}` } className='text-gray-900 dark:text-gray-100 group-hover:text-blue-700'>
          <div>
            <h3 className='text-2xl font-bold leading-8 tracking-tight'>
              {frontMatter.title}
              {frontMatter.draft && <span className='bg-yellow-500 text-white p-1 text-sm align-middle mx-2 uppercase'>Draft</span>}
            </h3>
            <h4 className='group-hover:text-blue-700'>{frontMatter.subtitle}</h4>
            <dt className='sr-only'>Published on</dt>
            <dd className='text-sm leading-6 text-gray-500 dark:text-gray-400 group-hover:text-blue-400'>
              <time dateTime={ frontMatter.date }>{formatDate(frontMatter.date)}</time>
            </dd>
          </div>
        </Link>
        <div className='prose max-w-none text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-white'>
          {frontMatter.summary}
        </div>
      </div>
    </article>
  </li>
);

export default Post;

