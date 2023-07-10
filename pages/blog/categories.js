import Category from '@/components/blocks/Category';
import Link from '@/components/mdx/Link';
import { PageSEO } from '@/components/utils/SEO';
import siteMetadata from '@/data/meta/site';
import { getAllCategories } from '@/lib/categories';

export async function getStaticProps() {
  const categories = await getAllCategories('blog');

  return { 'props': { categories } };
}

export default function Categories({ categories }) {
  return (
    <>
      <PageSEO title={ `Categories - ${siteMetadata.author}` } description='Things I blog about' />
      <div className='flex flex-col items-start justify-start divide-y divide-gray-200 dark:divide-gray-700 md:mt-24 md:flex-row md:items-center md:justify-center md:space-x-6 md:divide-y-0'>
        <div className='space-x-2 pt-6 pb-8 md:space-y-5'>
          <h1 className='text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:border-r-2 md:px-6 md:text-6xl md:leading-14'>
            Categories
          </h1>
        </div>
        <div className='flex max-w-lg flex-wrap'>
          {Object.keys(categories).length === 0 && 'No Categories found'}
          {Object.keys(categories).map((category) => (
            <div key={ category } className='mt-2 mb-2 mr-5'>
              <Category text={ categories[category].display } slug={ categories[category].slug } />
              <Link
                href={ `/categories/${category}` }
                className='-ml-2 text-sm font-semibold uppercase text-gray-600 dark:text-gray-300'
              >
                  &nbsp;{` (${categories[category].count})`}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
