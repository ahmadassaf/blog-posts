import Link from 'next/link'
import kebabCase from '@/lib/utils/kebabCase'

const Category = ({ text }) => {
  return (
    <Link href={`/blog/category/${kebabCase(text).trim()}`} passHref>
      <span className="font-small mr-2 inline-flex items-center rounded-sm bg-green-600 px-2.5 py-0.5 text-sm hover:cursor-pointer hover:bg-green-200">
        <a className="text-sm font-medium uppercase text-white hover:text-black dark:hover:text-black">
          {text}
        </a>
      </span>
    </Link>
  )
}

export default Category
