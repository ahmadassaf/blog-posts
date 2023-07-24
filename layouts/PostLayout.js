import SectionContainer from '@/components/containers/SectionContainer';
import Comments from '@/components/post/comments';
import PostHeader from '@/components/post/PostHeader';
import PostNavigation from '@/components/post/PostNavigation';
import { BlogSEO } from '@/components/utils/SEO';
import siteMetadata from '@/data/meta/metadata';

export default function PostLayout({ frontMatter, authorDetails, next, prev, children }) {

  return (
    <SectionContainer>
      <BlogSEO
        url={ `${siteMetadata.siteUrl}/blog/${frontMatter.slug}` }
        authorDetails={ authorDetails }
        { ...frontMatter }
      />

      <article>
        <div>
          <PostHeader frontMatter={ frontMatter } siteMetadata={ siteMetadata }/>

          <div
            className='divide-y divide-gray-200 pb-8 dark:divide-gray-700 xl:grid xl:grid-cols-4 xl:gap-x-6 xl:divide-y-0'
            style={{ 'gridTemplateRows': 'auto 1fr' }}
          >
            <div className='divide-y divide-gray-200 dark:divide-gray-700 xl:col-span-3 xl:row-span-2 xl:pb-0'>
              <div className='prose max-w-none pt-10 pb-8 dark:prose-dark '>{children}</div>

              <PostNavigation next={ next } prev={ prev }></PostNavigation>
              <Comments frontMatter={ frontMatter } />
            </div>
          </div>
        </div>
      </article>
    </SectionContainer>
  );
}
