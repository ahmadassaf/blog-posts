import { useEffect } from 'react';
import Head from 'next/head';
import Router from 'next/router';
import { ThemeProvider } from 'next-themes';
import NProgress from 'nprogress';

import Analytics from '@/components/analytics';
import { ClientReload } from '@/components/utils/ClientReload';
import LayoutWrapper from '@/components/wrappers/LayoutWrapper';
import siteMetadata from '@/data/meta/metadata';

import '@/css/tailwind.css';
import '@/css/prism.css';
import 'katex/dist/katex.css';
import '@fontsource/inter/variable-full.css';
import 'nprogress/nprogress.css';

let navigationPropsCache;
const isDevelopment = process.env.NODE_ENV === 'development';
const isSocket = process.env.SOCKET;

const App = ({ Component, pageProps, navigationProps, posts, projects }) => {
  useEffect(() => {
    navigationPropsCache = navigationProps;
  }, [ navigationProps ]);

  Router.events.on('routeChangeStart', () => NProgress.start());
  Router.events.on('routeChangeComplete', () => NProgress.done());
  Router.events.on('routeChangeError', () => NProgress.done());

  return (
    <ThemeProvider attribute='class' defaultTheme={ siteMetadata.theme }>
      <Head>
        <meta content='width=device-width, initial-scale=1' name='viewport' />
      </Head>
      {isDevelopment && isSocket && <ClientReload />}
      <Analytics />
      <LayoutWrapper navigation={ navigationProps }>
        <Component { ...pageProps } />
      </LayoutWrapper>
    </ThemeProvider>
  );
};

App.getInitialProps = async() => {
  if (navigationPropsCache) return { 'navigationProps': navigationPropsCache };

  const res = await fetch('http://localhost:3000/api/navigation');
  const navigationProps = await res.json();

  navigationPropsCache = navigationProps;

  return { navigationProps };
};

export default App;
