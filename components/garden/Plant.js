import Pill from '@/components/elements/Pill';
import Tag from '@/components/elements/Tag';
import formatDate from '@/lib/utils/formatDate';

const Post = ({ post }) => (
  <li key={ post._id } className='py-1'>
    <article className='group space-y-2 xl:grid xl:grid-cols-2 xl:items-baseline xl:space-y-0 cursor-pointer'>
      <div className='space-y-3 xl:col-span-3'>
        <dt className='sr-only'>Published on</dt>
        <dd className='text-sm leading-6 text-gray-500 dark:text-gray-400 group-hover:text-blue-400'>
          <time dateTime={ post.created }>{formatDate(post.created)}</time>
        </dd>
        {post.kind && <Tag text={ post.kind } />}
        <h3 className='text-md font-normal leading-8 tracking-tight'>
          <div href={ `/blog/${post._id}` } className='text-gray-900 dark:text-gray-100 group-hover:text-blue-700'>
            {post.title}
          </div>
        </h3>
      </div>
      <div>
        {post.keys && post.pills.split(',').map((tag) => <Pill key={ tag } text={ tag }/>)}
      </div>
    </article>
  </li>
);

export default Post;

