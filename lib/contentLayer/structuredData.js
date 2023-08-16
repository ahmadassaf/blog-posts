import siteMetadata from '../../data/meta/siteMetadata';

const structuredData = {
  'post': (doc) => {
    return {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      'author': doc.authors,
      'dateModified': doc.lastmod || doc.date,
      'datePublished': doc.date,
      'description': doc.summary,
      'headline': doc.title,
      'image': doc.images ? doc.images[0] : siteMetadata.socialBanner,
      'url': `${siteMetadata.siteUrl}/${doc._raw.flattenedPath}`
    };
  },
  'project': (doc) => {
    return {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      'author': doc.authors,
      'dateModified': doc.lastmod || doc.date,
      'datePublished': doc.date,
      'description': doc.summary,
      'headline': doc.title,
      'image': doc.images ? doc.images[0] : siteMetadata.socialBanner,
      'url': `${siteMetadata.siteUrl}/${doc._raw.flattenedPath}`
    };
  }
};

export default structuredData;
