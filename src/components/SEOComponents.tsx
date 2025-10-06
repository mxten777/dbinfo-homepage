// 🚀 SEO 최적화 컴포넌트
import React from 'react';
import { Helmet } from 'react-helmet-async';

// 📄 SEO Head 컴포넌트
export interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product' | 'profile';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  siteName?: string;
  locale?: string;
  alternateUrls?: { href: string; hreflang: string }[];
}

export const SEOHead: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  image = '/images/og-default.jpg',
  url,
  type = 'website',
  author = 'DB.INFO',
  publishedTime,
  modifiedTime,
  siteName = 'DB.INFO - IT 혁신을 선도하는 디지털 전문 기업',
  locale = 'ko_KR',
  alternateUrls = []
}) => {
  const fullTitle = `${title} | ${siteName}`;
  const currentUrl = url || typeof window !== 'undefined' ? window.location.href : '';
  const imageUrl = image.startsWith('http') ? image : `${typeof window !== 'undefined' ? window.location.origin : ''}${image}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <link rel="canonical" href={currentUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />

      {/* Article specific (for blog posts, news) */}
      {type === 'article' && (
        <>
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {author && <meta property="article:author" content={author} />}
        </>
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:creator" content="@dbinfo_kr" />
      <meta name="twitter:site" content="@dbinfo_kr" />

      {/* Alternate Language URLs */}
      {alternateUrls.map((alt, index) => (
        <link key={index} rel="alternate" href={alt.href} hrefLang={alt.hreflang} />
      ))}

      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': type === 'article' ? 'Article' : 'WebPage',
          headline: title,
          description: description,
          image: imageUrl,
          url: currentUrl,
          author: {
            '@type': 'Organization',
            name: author,
            url: 'https://dbinfo.co.kr'
          },
          publisher: {
            '@type': 'Organization',
            name: siteName,
            logo: {
              '@type': 'ImageObject',
              url: `${typeof window !== 'undefined' ? window.location.origin : ''}/images/logo.png`
            }
          },
          ...(publishedTime && { datePublished: publishedTime }),
          ...(modifiedTime && { dateModified: modifiedTime })
        })}
      </script>
    </Helmet>
  );
};

// 🏢 조직 스키마 컴포넌트
export const OrganizationSchema: React.FC = () => {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'DB.INFO',
    alternateName: ['디비인포', 'DB인포'],
    url: 'https://dbinfo.co.kr',
    logo: 'https://dbinfo.co.kr/images/logo.png',
    image: 'https://dbinfo.co.kr/images/company-photo.jpg',
    description: '13년간의 전문성과 혁신적 기술력으로 디지털 미래를 선도하는 IT 솔루션 파트너',
    foundingDate: '2011-01-01',
    founder: {
      '@type': 'Person',
      name: '창립자명'
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: '서울특별시 금천구 서부샛길 606',
      addressLocality: '서울',
      addressRegion: '서울특별시',
      postalCode: '08594',
      addressCountry: 'KR'
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+82-2-2025-8511',
        contactType: 'customer service',
        availableLanguage: ['Korean', 'English']
      },
      {
        '@type': 'ContactPoint',
        email: 'contact@dbinfo.co.kr',
        contactType: 'customer service'
      }
    ],
    sameAs: [
      'https://www.linkedin.com/company/dbinfo',
      'https://github.com/dbinfo',
      'https://blog.dbinfo.co.kr'
    ],
    service: [
      {
        '@type': 'Service',
        name: 'AI DataSet Platform',
        description: '인공지능 데이터셋 플랫폼 서비스',
        provider: {
          '@type': 'Organization',
          name: 'DB.INFO'
        }
      },
      {
        '@type': 'Service', 
        name: 'System Integration',
        description: '시스템 통합 구축 서비스',
        provider: {
          '@type': 'Organization',
          name: 'DB.INFO'
        }
      },
      {
        '@type': 'Service',
        name: 'E-Commerce Platform',
        description: '전자상거래 플랫폼 구축 서비스',
        provider: {
          '@type': 'Organization',
          name: 'DB.INFO'
        }
      }
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
    </Helmet>
  );
};

// 🍞 브레드크럼 스키마 컴포넌트
export const BreadcrumbSchema: React.FC<{
  items: Array<{ name: string; url: string }>;
}> = ({ items }) => {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
    </Helmet>
  );
};

// 📊 제품/서비스 스키마 컴포넌트
export const ServiceSchema: React.FC<{
  name: string;
  description: string;
  provider: string;
  category: string;
  offers?: {
    price?: string;
    priceCurrency?: string;
    availability?: string;
  };
}> = ({ name, description, provider, category, offers }) => {
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: name,
    description: description,
    category: category,
    provider: {
      '@type': 'Organization',
      name: provider,
      url: 'https://dbinfo.co.kr'
    },
    ...(offers && {
      offers: {
        '@type': 'Offer',
        ...offers,
        seller: {
          '@type': 'Organization',
          name: provider
        }
      }
    })
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(serviceSchema)}
      </script>
    </Helmet>
  );
};

// 📝 FAQ 스키마 컴포넌트
export const FAQSchema: React.FC<{
  faqs: Array<{ question: string; answer: string }>;
}> = ({ faqs }) => {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </script>
    </Helmet>
  );
};

// 🎯 지역 비즈니스 스키마 컴포넌트
export const LocalBusinessSchema: React.FC = () => {
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://dbinfo.co.kr/#organization',
    name: 'DB.INFO',
    description: 'IT 솔루션 및 시스템 통합 전문 기업',
    url: 'https://dbinfo.co.kr',
    logo: 'https://dbinfo.co.kr/images/logo.png',
    image: 'https://dbinfo.co.kr/images/office-photo.jpg',
    telephone: '+82-2-2025-8511',
    email: 'contact@dbinfo.co.kr',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '서울특별시 금천구 서부샛길 606',
      addressLocality: '서울',
      addressRegion: '서울특별시',
      postalCode: '08594',
      addressCountry: 'KR'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 37.4563,
      longitude: 126.8956
    },
    openingHours: [
      'Mo-Fr 09:00-18:00',
      'Sa 09:00-13:00'
    ],
    priceRange: '$$',
    currenciesAccepted: 'KRW',
    paymentAccepted: '신용카드, 계좌이체',
    areaServed: {
      '@type': 'Country',
      name: '대한민국'
    },
    knowsAbout: [
      'AI 데이터셋',
      '시스템 통합',
      '전자상거래',
      '챗봇 개발',
      '수요예측',
      'IT 컨설팅'
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(localBusinessSchema)}
      </script>
    </Helmet>
  );
};

// 📊 사이트맵 생성 유틸리티
export const generateSitemap = (pages: Array<{
  url: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}>) => {
  const baseUrl = 'https://dbinfo.co.kr';
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    ${page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : ''}
    ${page.changefreq ? `<changefreq>${page.changefreq}</changefreq>` : ''}
    ${page.priority ? `<priority>${page.priority}</priority>` : ''}
  </url>`).join('\n')}
</urlset>`;

  return sitemap;
};

// 🤖 robots.txt 생성 유틸리티
export const generateRobotsTxt = (options: {
  allowAll?: boolean;
  disallowPaths?: string[];
  sitemapUrl?: string;
  crawlDelay?: number;
}) => {
  const { allowAll = true, disallowPaths = [], sitemapUrl = 'https://dbinfo.co.kr/sitemap.xml', crawlDelay } = options;
  
  let robotsTxt = 'User-agent: *\n';
  
  if (allowAll && disallowPaths.length === 0) {
    robotsTxt += 'Allow: /\n';
  } else {
    disallowPaths.forEach(path => {
      robotsTxt += `Disallow: ${path}\n`;
    });
  }
  
  if (crawlDelay) {
    robotsTxt += `Crawl-delay: ${crawlDelay}\n`;
  }
  
  robotsTxt += `\nSitemap: ${sitemapUrl}`;
  
  return robotsTxt;
};