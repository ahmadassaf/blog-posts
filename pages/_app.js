import Head from 'next/head';
import Router from 'next/router';
import { ThemeProvider } from 'next-themes';
import NProgress from 'nprogress';

import Analytics from '@/components/analytics';
import { ClientReload } from '@/components/utils/ClientReload';
import LayoutWrapper from '@/components/wrappers/LayoutWrapper';
import siteMetadata from '@/data/meta/metadata';

import '@fontsource-variable/inter';

import '@/css/tailwind.css';
import '@/css/prism.css';
import 'katex/dist/katex.css';
import 'nprogress/nprogress.css';

const isDevelopment = process.env.NODE_ENV === 'development';
const isSocket = process.env.SOCKET;

const App = ({ Component, pageProps }) => {

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
      <LayoutWrapper>
        <Component { ...pageProps } />
      </LayoutWrapper>
    </ThemeProvider>
  );
};

export default App;
