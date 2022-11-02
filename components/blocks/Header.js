import Link from '@/components/mdx/Link'
import MobileNav from '@/components/navigation/MobileNav'
import siteMetadata from '@/data/siteMetadata'
import Menu from '@/components/navigation/Menu'
import ThemeLogo from '@/components/navigation/Logo'
import ThemeSwitch from '@/components/utils/ThemeSwitcher'

const Header = (props) => {
  return (
    <header className="flex items-center justify-between py-10">
      <Link href="/" aria-label={siteMetadata.headerTitle}>
        <div className="flex items-center justify-between">
          <div className="mr-3">
            <ThemeLogo />
          </div>
        </div>
      </Link>
      <div className="flex items-center text-base leading-5">
        <Menu navigationProps={props.navigationProps} />
        <ThemeSwitch />
        <MobileNav />
      </div>
    </header>
  )
}

export default Header
