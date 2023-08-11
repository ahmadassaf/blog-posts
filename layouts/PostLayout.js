import SectionContainer from '@/components/containers/SectionContainer';
import TableOfContents from '@/components/mdx/TableOfContents';
import Comments from '@/components/post/comments';
import PostHeader from '@/components/post/PostHeader';
import PostNavigation from '@/components/post/PostNavigation';
import { BlogSEO } from '@/components/utils/SEO';
import siteMetadata from '@/data/meta/metadata';

export default function PostLayout({ frontMatter, authorDetails, toc, next, prev, children }) {

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
            className={ `divide-y divide-gray-200 pb-8 dark:divide-gray-700 xl:grid xl:gap-x-6 xl:divide-y-0 ${toc.length > 3 ? 'xl:grid-cols-9' : 'xl:grid-cols-1'}` }
            style={{ 'gridTemplateRows': 'auto 1fr' }}
          >
            <div className={ `divide-y divide-gray-200 dark:divide-gray-700 xl:row-span-2 xl:pb-0 ${toc.length > 3 && 'xl:col-span-6'}` }>
              <div className='prose max-w-none pt-10 pb-8 dark:prose-dark '>{children}</div>

              <PostNavigation next={ next } prev={ prev }></PostNavigation>
              <Comments frontMatter={ frontMatter } />
            </div>
            { toc.length > 3 && <TableOfContents toc={ toc }/>}
          </div>
        </div>
      </article>
    </SectionContainer>
  );
}
