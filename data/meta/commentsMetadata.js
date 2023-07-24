const CommentsMetadata = {

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
};

module.exports = CommentsMetadata;

