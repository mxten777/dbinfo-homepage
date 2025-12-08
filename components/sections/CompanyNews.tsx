'use client';

import { useEffect, useState } from 'react';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  category: string;
  date: string;
  createdAt: Date;
}

export default function CompanyNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      // Firebase 시도
      const { collection, getDocs, query, orderBy, limit } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');
      
      if (db) {
        const newsQuery = query(
          collection(db, 'company-news'),
          orderBy('createdAt', 'desc'),
          limit(6)
        );

        const snapshot = await getDocs(newsQuery);
        const newsData: NewsItem[] = [];

        snapshot.forEach((doc) => {
          const data = doc.data();
          newsData.push({
            id: doc.id,
            title: data.title || '',
            content: data.content || '',
            category: data.category || 'general',
            date: data.date || '',
            createdAt: data.createdAt?.toDate() || new Date(),
          });
        });

        if (newsData.length > 0) {
          setNews(newsData);
          setLoading(false);
          return;
        }
      }
    } catch {
      console.log('Firebase not available, using demo data');
    }
    
    // Firebase 실패 또는 데이터 없을 시 데모 데이터 사용
    setNews([
      {
        id: '1',
        title: 'DB.INFO 신규 AI 솔루션 출시',
        content: '최신 AI 기술을 활용한 데이터 분석 솔루션을 출시했습니다. 고객사의 비즈니스 인사이트를 더욱 빠르고 정확하게 제공합니다.',
        category: 'update',
        date: '2025-12-01',
        createdAt: new Date('2025-12-01'),
      },
      {
        id: '2',
        title: '2025년 고객 만족도 1위 달성',
        content: 'IT 서비스 부문에서 고객 만족도 조사 1위를 달성했습니다. 앞으로도 최고의 서비스를 제공하겠습니다.',
        category: 'notice',
        date: '2025-11-25',
        createdAt: new Date('2025-11-25'),
      },
      {
        id: '3',
        title: '연말 특별 프로모션 진행',
        content: '12월 한 달간 신규 고객을 위한 특별 할인 이벤트를 진행합니다. 자세한 내용은 문의 바랍니다.',
        category: 'event',
        date: '2025-11-20',
        createdAt: new Date('2025-11-20'),
      },
    ]);
    setLoading(false);
  };

  const getCategoryStyle = (category: string) => {
    switch (category) {
      case 'notice':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'event':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'update':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'press':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'notice':
        return '공지사항';
      case 'event':
        return '이벤트';
      case 'update':
        return '업데이트';
      case 'press':
        return '보도자료';
      default:
        return '일반';
    }
  };

  if (loading) {
    return (
      <section className="py-24 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4">
              회사 <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">소식</span>
            </h2>
            <p className="text-xl text-gray-600">DB.INFO의 최신 소식을 확인하세요</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-lg animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-8 bg-gray-300 rounded w-full mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // 데이터가 없을 때도 섹션은 표시
  if (news.length === 0) {
    return null;
  }

  return (
    <section id="news" className="py-24 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6">
            <span className="text-white font-bold text-lg">📰 Company News</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4">
            회사 <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">소식</span>
          </h2>
          <p className="text-xl text-gray-600">DB.INFO의 최신 소식과 업데이트를 확인하세요</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {news.map((item, index) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100 animate-in fade-in slide-in-from-bottom"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${getCategoryStyle(item.category)}`}>
                  {getCategoryLabel(item.category)}
                </span>
                <span className="text-sm text-gray-500 font-medium">{item.date}</span>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                {item.title}
              </h3>

              <p className="text-gray-600 line-clamp-3 leading-relaxed mb-4">
                {item.content}
              </p>

              <div className="flex items-center text-blue-600 font-semibold group-hover:gap-2 transition-all duration-300">
                <span>자세히 보기</span>
                <svg
                  className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {news.length >= 6 && (
          <div className="text-center mt-12">
            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
              더 많은 소식 보기
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
