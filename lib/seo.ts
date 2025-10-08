// 🔍 SEO 및 메타데이터 유틸리티
import { Metadata } from 'next';

interface SEOData {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
  noIndex?: boolean;
}

const defaultSEO = {
  siteName: 'DBInfo - 데이터 기반 비즈니스 솔루션',
  siteUrl: 'https://dbinfo.co.kr',
  description: '13년간 축적된 IT 전문성으로 귀하의 비즈니스를 혁신합니다. ERP, 데이터 분석, AI 챗봇, 모바일 앱 개발 전문',
  keywords: ['DBInfo', '데이터 분석', 'ERP', 'AI 챗봇', '모바일 앱', 'IT 컨설팅', '시스템 통합', '비즈니스 솔루션'],
  ogImage: '/images/og-image.jpg',
  twitterHandle: '@dbinfo_kr',
};

export function generateMetadata({
  title,
  description,
  keywords = [],
  ogImage,
  canonical,
  noIndex = false,
}: SEOData = {}): Metadata {
  const fullTitle = title 
    ? `${title} | ${defaultSEO.siteName}`
    : defaultSEO.siteName;
  
  const metaDescription = description || defaultSEO.description;
  const imageUrl = ogImage || defaultSEO.ogImage;
  const allKeywords = [...defaultSEO.keywords, ...keywords];
  
  return {
    title: fullTitle,
    description: metaDescription,
    keywords: allKeywords.join(', '),
    
    // Open Graph
    openGraph: {
      title: fullTitle,
      description: metaDescription,
      url: canonical || defaultSEO.siteUrl,
      siteName: defaultSEO.siteName,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      locale: 'ko_KR',
      type: 'website',
    },
    
    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: metaDescription,
      images: [imageUrl],
      creator: defaultSEO.twitterHandle,
    },
    
    // 기타 메타 태그들
    robots: noIndex ? 'noindex, nofollow' : 'index, follow',
    
    // 추가 메타 태그들
    other: {
      'msapplication-TileColor': '#2563eb',
      'theme-color': '#2563eb',
    },
    
    // Verification tags (실제 사용시 추가)
    // verification: {
    //   google: 'your-google-verification-code',
    //   naver: 'your-naver-verification-code',
    // },
    
    // App-specific metadata
    appleWebApp: {
      capable: true,
      statusBarStyle: 'default',
      title: defaultSEO.siteName,
    },
    
    formatDetection: {
      telephone: false,
    },
    
    // Alternate languages (다국어 지원시)
    alternates: {
      canonical: canonical || defaultSEO.siteUrl,
      languages: {
        'ko-KR': canonical || defaultSEO.siteUrl,
        'en-US': `${canonical || defaultSEO.siteUrl}/en`,
      },
    },
  };
}

// 구조화된 데이터 생성
export function generateStructuredData(type: 'Organization' | 'WebSite' | 'Service' = 'Organization') {
  const baseUrl = defaultSEO.siteUrl;
  
  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'DBInfo',
    alternateName: '디비인포',
    url: baseUrl,
    logo: `${baseUrl}/images/logo.png`,
    description: defaultSEO.description,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'KR',
      addressLocality: '서울',
      addressRegion: '서울특별시',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+82-2-1234-5678',
      contactType: 'customer service',
      availableLanguage: ['Korean', 'English'],
    },
    sameAs: [
      'https://www.facebook.com/dbinfo.kr',
      'https://www.linkedin.com/company/dbinfo',
      'https://twitter.com/dbinfo_kr',
    ],
    foundingDate: '2012',
    numberOfEmployees: '10-50',
    industry: 'Information Technology',
  };

  const websiteData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: defaultSEO.siteName,
    url: baseUrl,
    description: defaultSEO.description,
    publisher: {
      '@type': 'Organization',
      name: 'DBInfo',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  switch (type) {
    case 'WebSite':
      return websiteData;
    case 'Organization':
    default:
      return organizationData;
  }
}

// 페이지별 SEO 설정
export const pageSEO = {
  home: {
    title: '홈',
    description: '데이터 기반 비즈니스 솔루션 전문기업 DBInfo입니다. ERP, 데이터 분석, AI 챗봇, 모바일 앱 개발 서비스를 제공합니다.',
    keywords: ['홈페이지', '메인', '비즈니스 솔루션'],
  },
  
  services: {
    title: '서비스',
    description: 'ERP 통합 시스템, 데이터 분석 플랫폼, AI 챗봇, 모바일 앱 개발 등 다양한 IT 서비스를 제공합니다.',
    keywords: ['서비스', 'ERP', '데이터 분석', 'AI 챗봇', '모바일 앱'],
  },
  
  about: {
    title: '회사소개',
    description: '13년간 축적된 IT 전문성과 노하우로 고객의 비즈니스 혁신을 이끌어가는 DBInfo를 소개합니다.',
    keywords: ['회사소개', '기업정보', 'IT 전문성'],
  },
  
  contact: {
    title: '문의하기',
    description: '비즈니스 문의, 서비스 상담, 프로젝트 의뢰 등 언제든지 연락주세요. 전문 컨설턴트가 도와드립니다.',
    keywords: ['문의', '상담', '연락처', '컨설팅'],
  },
};