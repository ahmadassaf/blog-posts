
import Link from '@/components/elements/Link';

const Quote = ({ text, author, link }) => (
  <figure className='border-l border-indigo-600 pl-8'>

    <p className='text-lg font-medium leading-8 tracking-tight text-gray-900'>{text}</p>

    <figcaption className='flex gap-x-4'>
      <div className='text-sm leading-6'>
        <div className='font-semibold text-gray-900 capitalize'>{ author }</div>
        { link && <Link href={ `http://twitter.com/${link}` } className='text-gray-600'>{ link } </Link> }
      </div>
    </figcaption>
  </figure>
);

export default Quote;

