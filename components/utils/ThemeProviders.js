'use client';

import { ThemeProvider } from 'next-themes';

import siteMetadata from '@/data/meta/metadata';

export function ThemeProviders({ children }) {
  return (
    <ThemeProvider attribute='class' defaultTheme={ siteMetadata.theme }>
      {children}
    </ThemeProvider>
  );
}
