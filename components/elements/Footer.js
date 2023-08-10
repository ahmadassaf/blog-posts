import Icon from '@/components/elements/Icon';
import NewsletterForm from '@/components/forms/NewsletterForm';
import siteMetadata from '@/data/meta/metadata';

const Footer = ({ navigation }) => (
  <footer aria-labelledby='footer-heading' className='border-t border-gray-200'>
    <div className='mx-auto max-w-7xl py-12 lg:py-16'>
      <div className='xl:grid xl:grid-cols-4 xl:gap-8'>
        <div className='grid grid-cols-1 gap-8 xl:col-span-2'>
          <div className='grid md:grid-cols-3 gap-8'>
            {navigation.categories.length && (
              <div>
                <h3 className='text-base font-medium text-gray-900 dark:text-white'>Categories</h3>
                <ul role='list' className='mt-4 space-y-4'>
                  {navigation.categories.slice(0, 4).reverse().map((category) => (
                    <li key={ category.id }>
                      <a href={ `/blog/category/${category.id}` } className='text-base capitalize text-gray-500 hover:text-blue-700'>
                        {category.title.replace('-', ' ')}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {navigation.projects && (
              <div>
                <h3 className='text-base font-medium text-gray-900 dark:text-white'>Projects</h3>
                <ul role='list' className='mt-4 space-y-4'>
                  {navigation.projects.slice(0, 4).map((project) => (
                    <li key={ project.href }>
                      <a href={ project.href } className='text-base text-gray-500 hover:text-blue-700'>
                        {project.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div>
              <h3 className='text-base font-medium text-gray-900 dark:text-white'>About</h3>
              <ul role='list' className='mt-4 space-y-4'>
                <li>
                  <a href={ '/about' } className='text-base text-gray-500 hover:text-blue-700'>Summary</a>
                </li>
                <li>
                  <a href='#' className='text-base text-gray-500 hover:text-blue-700'>Press</a>
                </li>
                <li>
                  <a href='#' className='text-base text-gray-500 hover:text-blue-700'>Publications</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {siteMetadata.newsletter.provider !== '' && <NewsletterForm />}

      </div>
      <div className='mt-8 border-t border-gray-200 pt-8 md:flex md:items-center md:justify-between'>

        <div className='flex space-x-6 md:order-2 sm:justify-center'>
          <Icon kind='mail' href={ `mailto:${siteMetadata.email}` } />
          <Icon kind='github' href={ siteMetadata.github }/>
          <Icon kind='youtube' href={ siteMetadata.youtube } />
          <Icon kind='linkedin' href={ siteMetadata.linkedin } />
          <Icon kind='twitter' href={ siteMetadata.twitter } />
        </div>

        <p className='mt-8 text-base text-gray-400 md:order-1 md:mt-0 sm:text-center'>
            &copy;{`${new Date().getFullYear()} ${siteMetadata.author}. All rights reserved`}
        </p>

      </div>
    </div>
  </footer>
);

export default Footer;
