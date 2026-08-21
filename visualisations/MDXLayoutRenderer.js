'use client';

import CustomLink from '@gaudi/design-system/core/Link';
import Aside from '@gaudi/design-system/mdx/Aside';
import Callout from '@gaudi/design-system/mdx/Callout';
import FileTree from '@gaudi/design-system/mdx/FileTree';
import Highlight from '@gaudi/design-system/mdx/Highlight';
import Image from '@gaudi/design-system/mdx/Image';
import Preview from '@gaudi/design-system/mdx/Preview';
import Table, { TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '@gaudi/design-system/mdx/Table';
import Tooltip from '@gaudi/design-system/mdx/Tooltip';
import { MDXLayoutRenderer as GaudiMDXLayoutRenderer } from '@gaudi/design-system/mdx/runtime';
import dynamic from 'next/dynamic';

import { VisualisationComponents } from './index';

const Chart = dynamic(() => import('@gaudi/design-system/mdx/Chart'));

const BlogMDXComponents = {
  Aside,
  Callout,
  Chart,
  FileTree,
  Highlight,
  Image,
  Preview,
  Table,
  Tooltip,
  ...VisualisationComponents,
  'a': CustomLink,
  'table': Table,
  'tbody': TableBody,
  'td': TableCell,
  'th': TableHeaderCell,
  'thead': TableHead,
  'tr': TableRow
};

/**
 * Renders compiled article MDX with Gaudi's generic MDX primitives and the
 * content-owned visualisation catalogue. The component map is assembled inside
 * this client boundary because React components cannot cross from a server page.
 */
export default function MDXLayoutRenderer(props) {
  return <GaudiMDXLayoutRenderer components={ BlogMDXComponents } { ...props } />;
}
