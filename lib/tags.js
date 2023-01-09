import fs from 'fs'
import matter from 'gray-matter'
import path from 'path'
import { getFiles } from './mdx'
import kebabCase from './utils/kebabCase'

const root = process.cwd()

export async function getAllTags(type) {
  const files = await getFiles(type)

  let tags = {}

  files.forEach((file) => {
    const source = fs.readFileSync(path.join(root, 'data', type, file), 'utf8')
    const { data } = matter(source)

    if (data.tags && data.draft !== true) {
      data.tags.forEach((tag) => {
        const formattedTag = kebabCase(tag).trim()

        if (tags[formattedTag]) {
          tags[formattedTag].count = tags[formattedTag].count + 1
        } else {
          tags[formattedTag] = { display: tag, count: 1, slug: formattedTag }
        }
      })
    }
  })

  return tags
}
