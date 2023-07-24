import Script from 'next/script';

import siteMetadata from '@/data/meta/metadata';

const UmamiScript = () => (
  <>
    <Script
      async
      defer
      data-website-id={ siteMetadata.analytics.umamiWebsiteId }
      src='https://umami.example.com/umami.js'
    />
  </>
);

export default UmamiScript;
