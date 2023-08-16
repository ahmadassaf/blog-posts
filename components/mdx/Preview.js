
import { DiGithubBadge } from 'react-icons/di';

import Link from '@/components/elements/Link';

const Preview = ({ link, title }) => (
  <Link href={ link } className='inline-flex align-center align-middle mr-2 text-gray-800 no-underline'>
    <DiGithubBadge className='w-6 h-6'/>{ title }
  </Link>
);

export default Preview;

