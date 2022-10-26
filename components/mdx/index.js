/* eslint-disable react/display-name */
import { useMemo } from 'react'
import { getMDXComponent } from 'mdx-bundler/client'
import { BlogNewsletterForm } from '@/components/forms/NewsletterForm'
import Image from '@/components/mdx/Image'
import CustomLink from '@/components/mdx/Link'
import TOCInline from '@/components/mdx/TOCInline'
import Pre from '@/components/mdx/Pre'
import Callout from '@/components/mdx/Callout'

export const MDXComponents = {
  Image,
  TOCInline,
  a: CustomLink,
  pre: Pre,
  Callout: Callout,
  BlogNewsletterForm: BlogNewsletterForm,
  wrapper: ({ components, layout, ...rest }) => {
    const Layout = require(`../../layouts/${layout}`).default
    return <Layout {...rest} />
  },
}

export const MDXLayoutRenderer = ({ layout, mdxSource, ...rest }) => {
  const MDXLayout = useMemo(() => getMDXComponent(mdxSource), [mdxSource])

  return <MDXLayout layout={layout} components={MDXComponents} {...rest} />
}
