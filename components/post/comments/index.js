import dynamic from 'next/dynamic';

import siteMetadata from '@/data/meta/metadata';

const UtterancesComponent = dynamic(
  () => import('@/components/post/comments/Utterances'), { 'ssr': false }
);
const GiscusComponent = dynamic(
  () => import('@/components/post/comments/Giscus'), { 'ssr': false }
);
const DisqusComponent = dynamic(
  () => import('@/components/post/comments/Disqus'), { 'ssr': false }
);

const Comments = ({ frontMatter }) => {
  const comment = siteMetadata?.comment;

  if (!comment || Object.keys(comment).length === 0) return <></>;

  return (
    <div id='comment' className='!border-t-0'>
      {siteMetadata.comment && siteMetadata.comment.provider === 'giscus' && <GiscusComponent />}
      {siteMetadata.comment && siteMetadata.comment.provider === 'utterances' && (
        <UtterancesComponent />
      )}
      {siteMetadata.comment && siteMetadata.comment.provider === 'disqus' && (
        <DisqusComponent frontMatter={ frontMatter } />
      )}
    </div>
  );
};

export default Comments;
