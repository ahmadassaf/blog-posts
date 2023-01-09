import SectionContainer from '@/components/containers/SectionContainer'
import { BlogSEO } from '@/components/utils/SEO'
import PostHeader from '@/components/post/PostHeader'
import siteMetadata from '@/data/siteMetadata'
import Comments from '@/components/post/comments'
import PostNavigation from '@/components/post/PostNavigation'
import ScrollTopAndComment from '@/components/post/ScrollTopAndComment'

export default function PostLayout({ frontMatter, authorDetails, next, prev, children }) {
  const { slug, fileName, date, title, subtitle, category, readingTime, tags } = frontMatter

  return (
    <SectionContainer>
      <BlogSEO
        url={`${siteMetadata.siteUrl}/blog/${slug}`}
        authorDetails={authorDetails}
        {...frontMatter}
      />
      <ScrollTopAndComment />

      <article>
        <div>
          <PostHeader
            title={title}
            subtitle={subtitle}
            date={date}
            tags={tags}
            category={category}
            siteMetadata={siteMetadata}
            slug={slug}
            fileName={fileName}
            readingTime={readingTime}
            next={next}
            prev={prev}
          />

          <div
            className="divide-y divide-gray-200 pb-8 dark:divide-gray-700 xl:grid xl:grid-cols-3 xl:gap-x-6 xl:divide-y-0"
            style={{ gridTemplateRows: 'auto 1fr' }}
          >
            <div className="divide-y divide-gray-200 dark:divide-gray-700 xl:col-span-3 xl:row-span-2 xl:pb-0">
              <div className="prose max-w-none pt-10 pb-8 dark:prose-dark">{children}</div>

              <PostNavigation next={next} prev={prev}></PostNavigation>
              <Comments frontMatter={frontMatter} />
            </div>
          </div>
        </div>
      </article>
    </SectionContainer>
  )
}
