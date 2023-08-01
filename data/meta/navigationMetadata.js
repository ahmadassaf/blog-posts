const NavigationMetadata = {
  'categoriesMetadata': {
    'data': 'Everything AI, ML and Semantic Web',
    'development': 'Development, programming and code',
    'productivity': 'Productivity, tools and tips',
    'semantic-web': 'Linked Data, RDF, SPARQL, etc.'
  },
  'links': [
    {
      'hideInPath': '/blog',
      'href': '/about',
      'title': 'About'
    },
    {
      'href': '/blog/projects',
      'showInPath': '*',
      'title': 'Projects'
    },
    {
      'hideInPath': '*',
      'href': '/blog/tags',
      'showInPath': '/blog',
      'title': 'Tags'
    }
  ]
};

export default NavigationMetadata;
