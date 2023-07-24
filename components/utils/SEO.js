import Head from 'next/head';
import { useRouter } from 'next/router';

import siteMetadata from '@/data/meta/metadata';

const CommonSEO = ({ title, description, ogType, ogImage, twImage, canonicalUrl }) => {
  const router = useRouter();

  return (
    <Head>
      <title>{title}</title>
      <meta name='robots' content='follow, index' />
      <meta name='description' content={ description } />
      <meta property='og:url' content={ `${siteMetadata.siteUrl}${router.asPath}` } />
      <meta property='og:type' content={ ogType } />
      <meta property='og:site_name' content={ siteMetadata.title } />
      <meta property='og:description' content={ description } />
      <meta property='og:title' content={ title } />
      {ogImage.constructor.name === 'Array' ? (
        ogImage.map(({ url }) => <meta property='og:image' content={ url } key={ url } />)
      ) : (
        <meta property='og:image' content={ ogImage } key={ ogImage } />
      )}
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:site' content={ siteMetadata.twitter } />
      <meta name='twitter:title' content={ title } />
      <meta name='twitter:description' content={ description } />
      <meta name='twitter:image' content={ twImage } />
      <link
        rel='canonical'
        href={ canonicalUrl || `${siteMetadata.siteUrl}${router.asPath}` }
      />
    </Head>
  );
};

export const PageSEO = ({ title, description }) => {
  const ogImageUrl = siteMetadata.siteUrl + siteMetadata.socialBanner;
  const twImageUrl = siteMetadata.siteUrl + siteMetadata.socialBanner;

  return (
    <CommonSEO
      title={ title }
      description={ description }
      ogType='website'
      ogImage={ ogImageUrl }
      twImage={ twImageUrl }
    />
  );
};

export const TagSEO = ({ title, description }) => {
  const ogImageUrl = siteMetadata.siteUrl + siteMetadata.socialBanner;
  const twImageUrl = siteMetadata.siteUrl + siteMetadata.socialBanner;
  const router = useRouter();

  return (
    <>
      <CommonSEO
        title={ title }
        description={ description }
        ogType='website'
        ogImage={ ogImageUrl }
        twImage={ twImageUrl }
      />
      <Head>
        <link
          rel='alternate'
          type='application/rss+xml'
          title={ `${description} - RSS feed` }
          href={ `${siteMetadata.siteUrl}${router.asPath}/feed.xml` }
        />
      </Head>
    </>
  );
};

export const BlogSEO = ({
  authorDetails,
  title,
  summary,
  date,
  lastmod,
  url,
  images = [],
  canonicalUrl
}) => {

  const publishedAt = new Date(date).toISOString();
  const modifiedAt = new Date(lastmod || date).toISOString();
  let imagesArr;

  if (images.length === 0) imagesArr = [ siteMetadata.socialBanner ];
  else imagesArr = typeof images === 'string' ? [ images ] : images;

  const featuredImages = imagesArr.map((img) => {
    return {
      '@type': 'ImageObject',
      'url': img.includes('http') ? img : siteMetadata.siteUrl + img
    };
  });

  let authorList;

  if (authorDetails) authorList = authorDetails.map((author) => {
    return {
      '@type': 'Person',
      'name': author.name
    };
  });
  else authorList = {
    '@type': 'Person',
    'name': siteMetadata.author
  };

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'author': authorList,
    'dateModified': modifiedAt,
    'datePublished': publishedAt,
    'description': summary,
    'headline': title,
    'image': featuredImages,
    'mainEntityOfPage': {
      '@id': url,
      '@type': 'WebPage'
    },
    'publisher': {
      '@type': 'Organization',
      'logo': {
        '@type': 'ImageObject',
        'url': `${siteMetadata.siteUrl}${siteMetadata.siteLogo}`
      },
      'name': siteMetadata.author
    }
  };

  const twImageUrl = featuredImages[0].url;

  return (
    <>
      <CommonSEO
        title={ title }
        description={ summary }
        ogType='article'
        ogImage={ featuredImages }
        twImage={ twImageUrl }
        canonicalUrl={ canonicalUrl }
      />
      <Head>
        {date && <meta property='article:published_time' content={ publishedAt } />}
        {lastmod && <meta property='article:modified_time' content={ modifiedAt } />}
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            '__html': JSON.stringify(structuredData, null, 2)
          }}
        />
      </Head>
    </>
  );
};
