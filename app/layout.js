
import { Inter } from 'next/font/google';

import Analytics from '@/components/analytics';
import ShapeContainer from '@/components/containers/ShapeContainer';
import Footer from '@/components/elements/Footer';
import Header from '@/components/elements/Header';
import { ThemeProviders } from '@/components/utils/ThemeProviders';

import '@/css/tailwind.css';
import '@/css/prism.css';
import 'katex/dist/katex.css';

// eslint-disable-next-line quote-props, sort-keys, sort-keys-fix/sort-keys-fix
export const font = Inter({ subsets: [ 'latin' ], weight: [ '400', '500', '600', '700', '800' ], variable: '--font-space-inter' });

export default function RootLayout({ children }) {
  return (
    <html className={ `${font.variable} scroll-smooth` } suppressHydrationWarning>
      <link rel='apple-touch-icon' sizes='76x76' href='/static/favicons/apple-touch-icon.png' />
      <link rel='icon' type='image/png' sizes='32x32' href='/static/favicons/favicon-32x32.png'/>
      <link rel='icon' type='image/png' sizes='16x16' href='/static/favicons/favicon-16x16.png'/>
      <link rel='manifest' href='/static/favicons/site.webmanifest' />
      <link rel='mask-icon' href='/static/favicons/safari-pinned-tab.svg' color='#fff' />
      <meta content='width=device-width, initial-scale=1' name='viewport' />
      <meta name='msapplication-TileColor' content='#000000' />
      <meta name='theme-color' media='(prefers-color-scheme: light)' content='#fff' />
      <meta name='theme-color' media='(prefers-color-scheme: dark)' content='#000' />
      <link rel='alternate' type='application/rss+xml' href='/feed.xml' />
      <body className='bg-white text-black antialiased dark:bg-gray-900 dark:text-white min-w-[414px]'>
        <ThemeProviders>
          <Analytics/>
          <div className='relative isolate overflow-x-hidden'>
            <div className='mx-auto px-4 sm:px-6 xl:max-w-7xl xl:px-0'>
              <ShapeContainer></ShapeContainer>
              <div className='flex h-screen flex-col justify-between'>
                <Header />
                <main className='mb-8'>{children}</main>
                <Footer />
              </div>
            </div>
          </div>
        </ThemeProviders>
      </body>
    </html>
  );
}
