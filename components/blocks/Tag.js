import Link from 'next/link'
import kebabCase from '@/lib/utils/kebabCase'

const Tag = ({ text, slug }) => {
  slug = !slug ? kebabCase(text) : slug
  return (
    <Link href={`/blog/tag/${slug}`} passHref>
      <span className="font-small m-1 inline-flex items-center rounded-sm bg-blue-600 px-2.5 py-0.5 text-sm hover:cursor-pointer hover:bg-blue-200">
        <a className="text-sm font-medium uppercase text-white hover:text-primary-600 dark:hover:text-primary-400">
          {text}
        </a>
      </span>
    </Link>
  )
}

export default Tag
