import PageSubTitle from '@/components/blocks/PageSubTitle'
import PageTitle from '@/components/blocks/PageTitle'
import Tag from '@/components/blocks/Tag'
import Category from '@/components/blocks/Category'
import PostSharing from '@/components/post/PostSharing'

const postDateTemplate = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }

const PostHeader = ({
  title,
  subtitle,
  date,
  tags,
  category,
  slug,
  siteMetadata,
  fileName,
  readingTime,
}) => {
  return (
    <div className="pt-6 xl:pb-6">
      <Category text={category}></Category>
      <div className="py-4 xl:py-4">
        <dt className="sr-only">Published on</dt>
        <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
          <time dateTime={date}>
            {new Date(date).toLocaleDateString(siteMetadata.locale, postDateTemplate)}
          </time>
        </dd>
      </div>
      <div className="space-y-1 text-left">
        <PageTitle>{title}</PageTitle>
        <PageSubTitle>{subtitle}</PageSubTitle>
      </div>
      <h4 className="text-gray-500">{readingTime.text}</h4>

      {tags && (
        <div className="mt-4 flex flex-wrap">
          {tags.map((tag) => (
            <Tag key={tag} text={tag} />
          ))}
        </div>
      )}
      <PostSharing siteMetadata={siteMetadata} slug={slug} fileName={fileName}></PostSharing>
    </div>
  )
}

export default PostHeader
