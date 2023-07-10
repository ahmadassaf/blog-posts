const siteMetadata = {
  'about': `I am an independent software developer currently based in Singapore. I am the creator of the JavaScript framework Vue.js and the frontend build tool Vite. Most of my work is open source and publicly available on GitHub. If you happen to benefit from my OSS work, you can support me financially via GitHub Sponsors.
  
  You can follow me on Twitter where I mostly tweet about Vue and frontend technologies. If you happen to speak Chinese, my Chinese name is 尤雨溪 (yóu yǔ xī) and I have a Chinese-only Twitter alt for non-tech-focused musings. You can also find me on 微博 and 知乎.
  
  Outside of programming and helping my wife take care of our two kids, I enjoy video games, karaoke, sushi, watching UFC/F1, and collecting mechanical watches.`,
  'analytics': {

    // E.g. UA-000000-2 or G-XXXXXXX
    'googleAnalyticsId': '',

    // E.g. tailwind-nextjs-starter-blog.vercel.app
    'plausibleDataDomain': '',

    // Posthog.init e.g. phc_5yXvArzvRdqtZIsHkEm3Fkkhm3d0bEYUXCaFISzqPSQ
    'posthogAnalyticsId': '',

    // True or false
    'simpleAnalytics': false,

    // E.g. 123e4567-e89b-12d3-a456-426614174000
    'umamiWebsiteId': ''
  },
  'author': 'Ahmad Assaf',
  'comment': {

    'disqusConfig': {

      // https://help.disqus.com/en/articles/1717111-what-s-a-shortname
      'shortname': process.env.NEXT_PUBLIC_DISQUS_SHORTNAME
    },

    // Supported providers: giscus, utterances, disqus
    'giscusConfig': {

      'category': process.env.NEXT_PUBLIC_GISCUS_CATEGORY,

      'categoryId': process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID,

      // Theme when dark mode
      'darkTheme': 'transparent_dark',

      // Place the comment box above the comments. options: bottom, top
      'inputPosition': 'bottom',

      // Choose the language giscus will be displayed in. options: en, es, zh-CN, zh-TW, ko, ja etc
      'lang': 'en',

      'mapping': 'pathname',

      /*
       * Emoji reactions: 1 = enable / 0 = disable
       * Send discussion metadata periodically to the parent window: 1 = enable / 0 = disable
       */
      'metadata': '0',

      // Supported options: pathname, url, title
      'reactions': '1',

      /*
       * Visit the link below, and follow the steps in the 'configuration' section
       * https://giscus.app/
       */
      'repo': process.env.NEXT_PUBLIC_GISCUS_REPO,

      'repositoryId': process.env.NEXT_PUBLIC_GISCUS_REPOSITORY_ID,

      /*
       * Theme example: light, dark, dark_dimmed, dark_high_contrast
       * transparent_dark, preferred_color_scheme, custom
       */
      'theme': 'light',

      /*
       * If the theme option above is set to 'custom`
       * please provide a link below to your custom theme css file.
       * example: https://giscus.app/themes/custom_example.css
       */
      'themeURL': ''
    },

    /*
     * If you want to use a commenting system other than giscus you have to add it to the
     * content security policy in the `next.config.js` file.
     * Select a provider and use the environment variables associated to it
     * https://vercel.com/docs/environment-variables
     */
    'provider': 'giscus',
    'utterancesConfig': {

      // Theme when dark mode
      'darkTheme': '',

      'issueTerm': '',

      // Supported options: pathname, url, title
      'label': '',

      /*
       * Visit the link below, and follow the steps in the 'configuration' section
       * https://utteranc.es/
       */
      'repo': process.env.NEXT_PUBLIC_UTTERANCES_REPO,

      /*
       * Label (optional): Comment 💬
       * theme example: github-light, github-dark, preferred-color-scheme
       * github-dark-orange, icy-dark, dark-blue, photon-dark, boxy-light
       */
      'theme': ''
    }
  },
  'description': 'Applying Aritificial Intelligence to solve complex problem',
  'email': 'address@yoursite.com',
  'facebook': 'https://facebook.com',
  'github': 'https://github.com',
  'headerTitle': 'Ahmad Assaf',
  'image': '/static/images/avatar.png',
  'language': 'en-us',
  'linkedin': 'https://www.linkedin.com',
  'locale': 'en-US',
  'newsletter': {

    /*
     * Supports mailchimp, buttondown, convertkit, klaviyo, revue, emailoctopus
     * Please add your .env file and modify it according to your selection
     */
    'provider': 'buttondown'
  },
  'siteLogo': '/static/images/logo.svg',
  'siteRepo': 'https://github.com/timlrx/tailwind-nextjs-starter-blog',
  'siteUrl': 'https://tailwind-nextjs-starter-blog.vercel.app',
  'socialBanner': '/static/images/twitter-card.png',
  'theme': 'light',
  'title': 'Ahmad Assaf Personal Space',
  'twitter': 'https://twitter.com/Twitter',
  'youtube': 'https://youtube.com'
};

module.exports = siteMetadata;
