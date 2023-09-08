import { allPosts } from 'contentlayer/generated';

import LauncherShortcut from '@/components/cmd/CmdLauncherShortcut';
import Link from '@/components/elements/Link';
import siteMetadata from '@/data/meta/metadata';
import FeaturedPostsLayout from '@/layouts/FeaturedLayout';
import ListLayout from '@/layouts/ListLayout';
import { coreContent, sortPosts } from '@/lib/utils/contentlayer';

export default function Home() {
  const displayPosts = coreContent(sortPosts(allPosts)).filter((post) => !post.featured);

  return (
    <>
      <div className='divide-y divide-gray-200 dark:divide-gray-700'>
        <div className='space-y-2 pt-6 pb-8 md:space-y-5'>
          <h1 className='pb-6 text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14'>
                Hi, I'm{' '}
            <span className='text-primary-color-500 dark:text-primary-color-dark-500'>
              {siteMetadata.author}
            </span>
          </h1>
          <h2>{`${siteMetadata.description}`}</h2>
          <h2>A driven AI and Machine Learning (ML) leader with a passion for discovering solutions to create the future of work through my current role as <strong >VP of AI and Data <Link className='text-blue-600' href='https://beamery.com'>@Beamery</Link></strong>. As one of the founding engineers, I have built and scaled engineering and data science teams and helped Beamery become one of the latest tech unicorns.</h2>
          <h2>I am a Knowledge Graph and Semantic Web Enthusiast (<strong>PhD in Semantic Web and Information Retrieval</strong>) with publications on Linked Data, Data Quality and Recommender Systems.</h2>
          <h2>I am currently leading the team working on various exciting AI and Machine Learning technologies, including recommender systems and personalization, Natural Language Processing methods such as text understanding and generation, entity disambiguation and reconciliation, and Large Language Models (LLMs). His team employs deep learning methods such as Convolutional Neural Networks (CNNs) and Generative Adversarial Networks (GANs).</h2>

          <LauncherShortcut />
        </div>
        <div className='pt-10'>
          <h1 className='pb-6 text-4xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-4xl md:leading-14'>Featured from the blog</h1>
        </div>
        <FeaturedPostsLayout />
        <ListLayout posts={ displayPosts.slice(0, 3) } linkAllPosts={ true } listTitle='Latest Posts' />
      </div>
    </>
  );
}
