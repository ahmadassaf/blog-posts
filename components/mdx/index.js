/* eslint-disable react/display-name */
import { useMemo } from 'react';
import { getMDXComponent } from 'mdx-bundler/client';

import { BlogNewsletterForm } from '@/components/forms/NewsletterForm';
import Callout from '@/components/mdx/Callout';
import Image from '@/components/mdx/Image';
import CustomLink from '@/components/mdx/Link';
import Pre from '@/components/mdx/Pre';
import TOCInline from '@/components/mdx/TOCInline';

export const MDXComponents = {
  'BlogNewsletterForm': BlogNewsletterForm,
  'Callout': Callout,
  Image,
  TOCInline,
  'a': CustomLink,
  'pre': Pre,
  'wrapper': ({ components, layout, ...rest }) => {
    const Layout = require(`../../layouts/${layout}`).default;

    return <Layout { ...rest } />;
  }
};

export const MDXLayoutRenderer = ({ layout, mdxSource, ...rest }) => {
  const MDXLayout = useMemo(() => getMDXComponent(mdxSource), [ mdxSource ]);

  return <MDXLayout layout={ layout } components={ MDXComponents } { ...rest } />;
};
