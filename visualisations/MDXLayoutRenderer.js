'use client';

import { MDXComponents } from '@gaudi/design-system/mdx';
import { MDXLayoutRenderer as GaudiMDXLayoutRenderer } from '@gaudi/design-system/mdx/runtime';

import { VisualisationComponents } from './index';

const BlogMDXComponents = {
  ...MDXComponents,
  ...VisualisationComponents
};

/**
 * Renders compiled article MDX with Gaudi's generic MDX primitives and the
 * content-owned visualisation catalogue. The component map is assembled inside
 * this client boundary because React components cannot cross from a server page.
 */
export default function MDXLayoutRenderer(props) {
  return <GaudiMDXLayoutRenderer components={ BlogMDXComponents } { ...props } />;
}
