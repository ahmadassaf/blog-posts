import { TagSEO } from '@/components/utils/SEO'
import siteMetadata from '@/data/siteMetadata'
import ListLayout from '@/layouts/ListLayout'
import generateRss from '@/lib/generate-rss'
import kebabCase from '@/lib/utils/kebabCase'
import { getAllFilesFrontMatter } from '@/lib/mdx'
import { getAllCategories } from '@/lib/categories'
import fs from 'fs'
import path from 'path'

const root = process.cwd()

export async function getStaticPaths() {
  const categories = await getAllCategories('blog')

  return {
    paths: Object.keys(categories).map((category) => ({
      params: {
        category,
      },
    })),
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const allPosts = await getAllFilesFrontMatter('blog')
  const filteredPosts = allPosts.filter(
    (post) => post.draft !== true && kebabCase(post.category) == params.category
  )

  // RSS
  if (filteredPosts.length > 0) {
    const rss = generateRss(filteredPosts, `category/${params.category}/feed.xml`)
    const rssPath = path.join(root, 'public', 'category', params.category)
    fs.mkdirSync(rssPath, { recursive: true })
    fs.writeFileSync(path.join(rssPath, 'feed.xml'), rss)
  }

  return { props: { posts: filteredPosts, category: params.category } }
}

export default function Category({ posts, category }) {
  const title = category.toUpperCase() + category.split(' ').join('-').slice(1)
  return (
    <>
      <TagSEO
        title={`${category} - ${siteMetadata.author}`}
        description={`${category} Category - ${siteMetadata.author}`}
      />
      <ListLayout posts={posts} title={title} />
    </>
  )
}
