import Link from '@/components/mdx/Link'
import { useRouter } from 'next/router'

const Menu = (props) => {
  const navigation = props.navigationProps
  const router = useRouter()
  const path = router?.asPath

  return (
    <ul className="hidden flex-row-reverse sm:flex">
      {navigation.links.map((link) => {
        if (
          (link.hideInPath == '*' || path.includes(link.hideInPath)) &&
          !path.includes(link.showInPath)
        ) {
          return
        }

        return (
          <li key={link.href}>
            <Link
              href={link.href}
              className="p-1 font-medium text-gray-900 dark:text-gray-100 sm:p-4"
            >
              {link.title}
            </Link>
          </li>
        )
      })}

      {path.includes('blog') &&
        navigation.categories.map((link) => {
          return (
            <li key={link}>
              <Link
                href={`/blog/category/${link}`}
                className="p-1 font-medium capitalize text-gray-900 dark:text-gray-100 sm:p-4"
              >
                {link.replace('-', ' ')}
              </Link>
            </li>
          )
        })}
    </ul>
  )
}

export default Menu
