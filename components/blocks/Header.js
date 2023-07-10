
import Link from '@/components/mdx/Link';
import ThemeLogo from '@/components/navigation/Logo';
import Menu from '@/components/navigation/Menu';
import MobileNav from '@/components/navigation/MobileNav';
import ThemeSwitch from '@/components/utils/ThemeSwitcher';
import siteMetadata from '@/data/meta/site';

const Header = (props) => (
  <header className='flex items-center justify-between py-10'>
    <Link href='/' aria-label={ siteMetadata.headerTitle }>
      <div className='flex items-center justify-between'>
        <div className='mr-3 flex'>
          <ThemeLogo />
        </div>
      </div>
    </Link>
    <div className='flex items-center text-base leading-5'>
      <Menu navigationProps={ props.navigationProps } />
      <ThemeSwitch />
      <MobileNav navigationProps={ props.navigationProps }/>
    </div>
  </header>
);

export default Header;
