const createNextPluginPreval = require('next-plugin-preval/config');
const withNextPluginPreval = createNextPluginPreval();
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  'enabled': process.env.ANALYZE === 'true'
});

// You might need to insert additional domains in script-src if you are using external services
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' giscus.app;
  style-src 'self' 'unsafe-inline';
  img-src * blob: data:;
  media-src 'none';
  connect-src *;
  font-src 'self';
  frame-src giscus.app
`;

const securityHeaders = [

  // https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
  {
    'key': 'Content-Security-Policy',
    'value': ContentSecurityPolicy.replace(/\n/g, '')
  },

  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
  {
    'key': 'Referrer-Policy',
    'value': 'strict-origin-when-cross-origin'
  },

  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
  {
    'key': 'X-Frame-Options',
    'value': 'DENY'
  },

  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
  {
    'key': 'X-Content-Type-Options',
    'value': 'nosniff'
  },

  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control
  {
    'key': 'X-DNS-Prefetch-Control',
    'value': 'on'
  },

  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
  {
    'key': 'Strict-Transport-Security',
    'value': 'max-age=31536000; includeSubDomains'
  },

  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy
  {
    'key': 'Permissions-Policy',
    'value': 'camera=(), microphone=(), geolocation=()'
  }
];

module.exports = withNextPluginPreval(
  withBundleAnalyzer({
    'eslint': {
      'dirs': [ 'pages', 'components', 'lib', 'layouts', 'scripts' ]
    },
    'experimental': { 'appDir': true },
    async headers() {
      return [
        {
          'headers': securityHeaders,
          'source': '/(.*)'
        }
      ];
    },
    'pageExtensions': [ 'js', 'jsx', 'md', 'mdx' ],
    'reactStrictMode': true,
    'webpack': (config, { dev, isServer }) => {
      config.module.rules.push({
        'test': /\.svg$/,
        'use': [ '@svgr/webpack' ]
      });

      if (!dev && !isServer) Object.assign(config.resolve.alias, {
        'react': 'preact/compat',
        'react-dom': 'preact/compat',
        'react-dom/test-utils': 'preact/test-utils',
        'react/jsx-runtime.js': 'preact/compat/jsx-runtime'
      });

      return config;
    }
  })
);
