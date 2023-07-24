import Link from '@/components/mdx/Link';

const Card = ({ title, subtitle, description, href }) => (
  <div
    className='min-h-80 group border-2 border-gray-200 border-opacity-60 hover:border-blue-700 dark:border-gray-700 dark:hover:border-blue-700'
  >
    <Link href={ href }>
      <div className='p-6'>
        <h2 className='mb-3 text-2xl font-bold leading-8 tracking-tight group-hover:text-blue-700'>
          {href ? (
            <Link href={ href } aria-label={ `Link to ${title}` }>
              {title}
            </Link>
          ) : (
            title
          )}
        </h2>
        <h4 className='group-hover:text-blue-400'>{subtitle}</h4>
        <p className='hidden'>{description}</p>
      </div>
    </Link>
  </div>
);

export default Card;
