const headerNavLinks = {
  links: [
    {
      href: '/about',
      title: 'About',
      hideInPath: false,
    },
    {
      href: '/blog/tags',
      title: 'Tags',
      hideInPath: '*',
      showInPath: '/blog',
    },
    {
      href: '/projects',
      title: 'Projects',
      hideInPath: false,
    },
    {
      href: '/blog',
      title: 'Blog',
      hideInPath: '/blog',
    },
  ],
}

export default headerNavLinks
