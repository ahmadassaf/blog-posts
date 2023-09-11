/* eslint-disable no-shadow */
import SocialIcon from '@/components/elements/Icon';
import Link from '@/components/elements/Link';

const PostSharing = ({ siteMetadata, slug, fileName, title }) => {

  const editUrl = (fileName) => `${siteMetadata.siteRepo}/blob/master/data/blog/${fileName}`;
  const discussUrl = (slug, title) => `https://twitter.com/intent/tweet?text=${title}
  
  ${encodeURIComponent(
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
