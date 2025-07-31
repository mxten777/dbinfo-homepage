import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  author?: string;
  date?: string;
}

const CompanyNewsList: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      const snap = await getDocs(collection(db, 'companyNews'));
      setNews(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as NewsItem)));
      setLoading(false);
    };
    fetchNews();
  }, []);

  if (loading) return <div className="text-gray-400">사내소식 로딩 중...</div>;
  if (news.length === 0) return <div className="text-gray-400">등록된 사내소식 없음</div>;

  return (
    <ul className="space-y-2">
      {news.map(n => (
        <li key={n.id} className="p-3 bg-indigo-50 rounded-lg flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-indigo-700">{n.title}</span>
            <span className="text-xs text-gray-500">{n.date}</span>
          </div>
          <div className="text-gray-700 text-sm">{n.content}</div>
          {n.author && <div className="text-xs text-gray-400 mt-1">작성자: {n.author}</div>}
        </li>
      ))}
    </ul>
  );
};

export default CompanyNewsList;
