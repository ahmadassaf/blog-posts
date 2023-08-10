/* eslint-disable no-shadow */
import SocialIcon from '@/components/elements/Icon';
import Link from '@/components/mdx/Link';

const PostSharing = ({ siteMetadata, slug, fileName }) => {

  const editUrl = (fileName) => `${siteMetadata.siteRepo}/blob/master/data/blog/${fileName}`;
  const discussUrl = (slug) => `https://mobile.twitter.com/search?q=${encodeURIComponent(
    `${siteMetadata.siteUrl}/blog/${slug}`
  )}`;

  return (
    <div className='flex border-y py-6 text-sm text-gray-700 dark:text-gray-300'>
      <div className='mr-4 flex space-x-2 hover:text-blue-700'>
        <SocialIcon kind='twitter' href={ siteMetadata.github }/>
        <Link href={ discussUrl(slug) } rel='nofollow'>
          {'Discuss on Twitter'}
        </Link>
      </div>
      <div className='mr-4 flex  space-x-2 hover:text-blue-700'>
        <SocialIcon kind='github' href={ siteMetadata.github }/>
        <Link href={ editUrl(fileName) }>{'View on GitHub'}</Link>
      </div>
    </div>
  );
};

export default PostSharing;
