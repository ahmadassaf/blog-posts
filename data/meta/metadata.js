import AnalyticsMetadata from './analyticsMetadata';
import AuthorMetadata from './authorMetadata';
import CommentsMetadata from './commentsMetadata';
import NewsLetterMetadata from './newsletterMetadata';
import SiteMetadata from './siteMetadata';

const siteMetadata = {
  'analytics': AnalyticsMetadata,
  'comments': CommentsMetadata,
  'newsletter': NewsLetterMetadata,
  ...AuthorMetadata,
  ...SiteMetadata
};

module.exports = siteMetadata;
