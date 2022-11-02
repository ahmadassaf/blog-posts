import fs from 'fs'
import matter from 'gray-matter'
import path from 'path'
import { getFiles } from '@/lib/mdx'
import kebabCase from '@/lib/utils/kebabCase'

import navigation from '@/data/navigation'

const root = process.cwd()

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  const files = await getFiles('blog')

  let categories = []

  files.forEach((file) => {
    const source = fs.readFileSync(path.join(root, 'data', 'blog', file), 'utf8')
    const { data } = matter(source)
    if (data.category && data.draft !== true) {
      categories.push(kebabCase(data.category))
    }
  })
  navigation.categories = [...new Set(categories)]
  res.status(200).json(navigation)
}
