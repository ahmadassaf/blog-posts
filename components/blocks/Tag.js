import Link from 'next/link'
import kebabCase from '@/lib/utils/kebabCase'

const Tag = ({ text }) => {
  return (
    <Link href={`/tag/${kebabCase(text)}`} passHref>
      <span className="font-small mr-2 inline-flex items-center rounded-sm bg-blue-600 px-2.5 py-0.5 text-sm hover:cursor-pointer hover:bg-blue-200">
        <a className="text-sm font-medium uppercase text-white hover:text-primary-600 dark:hover:text-primary-400">
          {text.split(' ').join('-')}
        </a>
      </span>
    </Link>
  )
}

export default Tag
