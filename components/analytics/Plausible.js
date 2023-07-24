import Script from 'next/script';

import siteMetadata from '@/data/meta/metadata';

const PlausibleScript = () => (
  <>
    <Script
      strategy='lazyOnload'
      data-domain={ siteMetadata.analytics.plausibleDataDomain }
      src='https://plausible.io/js/plausible.js'
    />
    <Script strategy='lazyOnload' id='plausible-script'>
      {`
            window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }
        `}
    </Script>
  </>
);

export default PlausibleScript;

export const logEvent = (eventName, ...rest) => window.plausible?.(eventName, ...rest);
