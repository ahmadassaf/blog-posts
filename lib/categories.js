import fs from 'fs'
import matter from 'gray-matter'
import path from 'path'
import { getFiles } from './mdx'
import kebabCase from './utils/kebabCase'

const root = process.cwd()

export async function getAllCategories(type) {
  const files = await getFiles(type)

  let categories = {}

  files.forEach((file) => {
    const source = fs.readFileSync(path.join(root, 'data', type, file), 'utf8')
    const { data } = matter(source)
    if (data.category && data.draft !== true) {
      const formattedCategory = kebabCase(data.category).trim()

      if (categories[formattedCategory]) {
        categories[formattedCategory].count = categories[formattedCategory].count + 1
      } else {
        categories[formattedCategory] = {
          display: data.category,
          count: 1,
          slug: formattedCategory,
        }
      }
    }
  })

  return categories
}
