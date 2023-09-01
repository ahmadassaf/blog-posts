
import Link from '@/components/elements/Link';
import IconGitMerge from '@/static/icons/gitMerge.svg';

const Preview = ({ link, title }) => (
  <Link href={ link } className='group inline-flex align-center align-middle mr-2 text-gray-800 no-underline'>
    <IconGitMerge className='w-8 h-8 mr-1 group-hover:fill-blue-600'/>{ title }
  </Link>
);

export default Preview;

