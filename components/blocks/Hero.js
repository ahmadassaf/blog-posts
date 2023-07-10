
import siteMetadata from '@/data/meta/site';

const Hero = () => (
  <div className='space-y-2 pt-6 pb-8 md:space-y-5'>
    <div>
      <div className='pt-6'>
        <h1 className='pb-6 text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14'>
          Hi, I'm{' '}
          <span className='text-primary-color-500 dark:text-primary-color-dark-500'>
            {siteMetadata.author}
          </span>
        </h1>
        <h2>{`Welcome to ${siteMetadata.description}. ${siteMetadata.about}`}</h2>
        <div className='mt-8 text-slate-600 dark:text-slate-400'>
          <span className='text-sm'>Press</span>{' '}
          <span className=' bg-gray-300 p-1 text-sm text-gray-900 dark:bg-gray-400'>
            ⌘
          </span>{' '}
          <span className='text-sm'>+ </span>
          <span className=' bg-gray-300 p-1 text-sm text-gray-900 dark:bg-gray-400'>
            K
          </span>{' '}
          <span className='text-sm'>to start</span>
        </div>
      </div>
    </div>
  </div>
);

export default Hero;
