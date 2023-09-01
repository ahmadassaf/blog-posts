import { allPosts } from 'contentlayer/generated';

import LauncherShortcut from '@/components/cmd/CmdLauncherShortcut';
import { PageSEO } from '@/components/utils/SEO';
import siteMetadata from '@/data/meta/metadata';
import ListLayout from '@/layouts/ListLayout';
import { sortPosts } from '@/lib/utils/contentlayer';

export default function Home() {
  return (
    <>
      <PageSEO title={ siteMetadata.title } description={ siteMetadata.description } />

      <div className='divide-y divide-gray-200 dark:divide-gray-700'>
        <div className='space-y-2 pt-6 pb-8 md:space-y-5'>
          <h1 className='pb-6 text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14'>
                Hi, I'm{' '}
            <span className='text-primary-color-500 dark:text-primary-color-dark-500'>
              {siteMetadata.author}
            </span>
          </h1>
          <h2>{`Welcome to ${siteMetadata.description}`}</h2>
          <h2>I am an independent software developer currently based in Singapore. I am the creator of the JavaScript framework Vue.js and the frontend build tool Vite. Most of my work is open source and publicly available on GitHub. If you happen to benefit from my OSS work, you can support me financially via GitHub Sponsors.

  You can follow me on Twitter where I mostly tweet about Vue and frontend technologies. If you happen to speak Chinese, my Chinese name is 尤雨溪 (yóu yǔ xī) and I have a Chinese-only Twitter alt for non-tech-focused musings. You can also find me on 微博 and 知乎.

  Outside of programming and helping my wife take care of our two kids, I enjoy video games, karaoke, sushi, watching UFC/F1, and collecting mechanical watches.</h2>
          <LauncherShortcut />
        </div>
        <ListLayout posts={ sortPosts(allPosts, 'date').slice(0, 5) } linkAllPosts={ true } listTitle='Latest Posts' />
      </div>
    </>
  );
}
