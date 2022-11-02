import '@/css/tailwind.css'
import '@/css/prism.css'
import 'katex/dist/katex.css'

import '@fontsource/inter/variable-full.css'

import { useEffect } from 'react'
import { ThemeProvider } from 'next-themes'
import Head from 'next/head'

import siteMetadata from '@/data/siteMetadata'
import Analytics from '@/components/analytics'
import LayoutWrapper from '@/components/wrappers/LayoutWrapper'
import { ClientReload } from '@/components/utils/ClientReload'

let navigationPropsCache
const isDevelopment = process.env.NODE_ENV === 'development'
const isSocket = process.env.SOCKET

const App = ({ Component, pageProps, navigationProps }) => {
  useEffect(() => {
    navigationPropsCache = navigationProps
  }, [])

  return (
    <ThemeProvider attribute="class" defaultTheme={siteMetadata.theme}>
      <Head>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      {isDevelopment && isSocket && <ClientReload />}
      <Analytics />
      <LayoutWrapper navigationProps={navigationProps}>
        <Component {...pageProps} />
      </LayoutWrapper>
    </ThemeProvider>
  )
}

App.getInitialProps = async () => {
  if (navigationPropsCache) {
    return { navigationProps: navigationPropsCache }
  }

  const res = await fetch('http://localhost:3000/api/navigation')
  const navigationProps = await res.json()
  navigationPropsCache = navigationProps

  return { navigationProps }
}

export default App
