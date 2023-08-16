/* eslint-disable no-new-func */
/* eslint-disable react/display-name */
/* eslint-disable camelcase */

import React from 'react';
import * as _jsx_runtime from 'react/jsx-runtime';
import ReactDOM from 'react-dom';

import CustomLink from '@/components/elements/Link';
import { BlogNewsletterForm } from '@/components/forms/NewsletterForm';
import Callout from '@/components/mdx/Callout';
import Faq from '@/components/mdx/Faq';
import Image from '@/components/mdx/Image';
import Pre from '@/components/mdx/Pre';
import Preview from '@/components/mdx/Preview';
import Quote from '@/components/mdx/Quote';
import Stats from '@/components/mdx/Stats';

export const MDXComponents = { BlogNewsletterForm, Callout, Faq, Image, Preview, Quote, Stats, 'a': CustomLink, 'pre': Pre };

const getMDXComponent = (code, globals = {}) => {
  const scope = { React, ReactDOM, _jsx_runtime, ...globals };
  const fn = new Function(...Object.keys(scope), code);

  return fn(...Object.values(scope)).default;
};

export const useMDXComponent = (
  code,
  globals = {}
) => React.useMemo(() => getMDXComponent(code, globals), [ code, globals ]);

export const MDXLayoutRenderer = ({ code, components, ...rest }) => {
  const Mdx = useMDXComponent(code);

  return <Mdx components={ components } { ...rest } />;
};
