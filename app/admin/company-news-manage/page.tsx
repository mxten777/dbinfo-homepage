'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

interface CompanyNews {
  id?: string;
  title: string;
  content: string;
  type: 'notice' | 'news' | 'event';
  priority: 'high' | 'medium' | 'low';
  status: 'draft' | 'published' | 'archived';
  author: string;
  createdAt: string;
  updatedAt?: string;
  publishDate: string;
  viewCount: number;
}

const CompanyNewsManagePage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState<CompanyNews[]>([]);
  const [firebaseConnected, setFirebaseConnected] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingNews, setEditingNews] = useState<CompanyNews | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'notice' as 'notice' | 'news' | 'event',
    priority: 'medium' as 'high' | 'medium' | 'low',
    status: 'draft' as 'draft' | 'published' | 'archived',
    publishDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const adminMode = localStorage.getItem('admin_mode');
    const user = localStorage.getItem('admin_user');
    
    if (adminMode === 'true' && user) {
      setIsAuthenticated(true);
      loadNews();
    } else {
      router.push('/admin/login');
    }
    setLoading(false);
  }, [router]);

  const loadNews = async () => {
    try {
      if (!db) {
        console.log('Firebase가 연결되지 않음 - 데모 데이터 사용');
        setFirebaseConnected(false);
        // 데모 뉴스 데이터
        setNews([
          {
            id: 'demo1',
            title: '2024년 4분기 전사 회의 안내',
            content: '2024년 4분기 전사 회의를 다음과 같이 개최합니다. 일시: 2024년 10월 15일(화) 오후 2시, 장소: 본사 대회의실, 주요 안건: 4분기 목표 수립, 신규 프로젝트 발표',
            type: 'notice',
            priority: 'high',
            status: 'published',
            author: 'admin',
            createdAt: '2024-10-01T09:00:00Z',
            publishDate: '2024-10-01',
            viewCount: 125
          },
          {
            id: 'demo2',
            title: 'DB-INFO 신규 서비스 런칭',
            content: '저희 DB-INFO가 새로운 데이터 분석 서비스를 출시했습니다. 고객들의 비즈니스 성장을 위한 혁신적인 솔루션을 제공합니다.',
            type: 'news',
            priority: 'medium',
            status: 'published',
            author: 'admin',
            createdAt: '2024-09-28T14:30:00Z',
            publishDate: '2024-09-28',
            viewCount: 89
          },
          {
            id: 'demo3',
            title: '직원 워크샵 개최 예정',
            content: '전 직원 대상 워크샵을 다음 주에 개최할 예정입니다. 팀워크 강화와 업무 효율성 증대를 목표로 합니다.',
            type: 'event',
            priority: 'medium',
            status: 'draft',
            author: 'admin',
            createdAt: '2024-10-05T11:20:00Z',
            publishDate: '2024-10-12',
            viewCount: 0
          }
        ]);
        return;
      }

      setFirebaseConnected(true);
      console.log('Firebase에서 회사 소식 데이터 로드 시작...');

      const newsQuery = query(collection(db, 'company_news'), orderBy('createdAt', 'desc'));
      const newsSnapshot = await getDocs(newsQuery);
      const newsList: CompanyNews[] = [];
      
      newsSnapshot.forEach((doc) => {
        newsList.push({
          id: doc.id,
          ...doc.data()
        } as CompanyNews);
      });

      setNews(newsList);
      console.log(`Firebase에서 ${newsList.length}개의 회사 소식을 로드했습니다.`);
      
    } catch (error) {
      console.error('회사 소식 데이터 로드 실패:', error);
      setFirebaseConnected(false);
    }
  };

  // Firebase 연동 함수들
  const handleAddNews = async () => {
    if (!firebaseConnected || !db) {
      alert('Firebase가 연결되지 않았습니다. 데모 모드에서는 추가할 수 없습니다.');
      return;
    }

    try {
      const newNews = {
        ...formData,
        author: localStorage.getItem('admin_user') || 'admin',
        createdAt: new Date().toISOString(),
        viewCount: 0
      };

      const docRef = await addDoc(collection(db, 'company_news'), newNews);
      console.log('새 회사 소식 추가됨:', docRef.id);
      
      resetForm();
      loadNews();
      alert('회사 소식이 성공적으로 추가되었습니다!');
    } catch (error) {
      console.error('회사 소식 추가 실패:', error);
      alert('회사 소식 추가에 실패했습니다.');
    }
  };

  const handleEditNews = async () => {
    if (!firebaseConnected || !db || !editingNews?.id) {
      alert('Firebase가 연결되지 않았습니다.');
      return;
    }

    try {
      await updateDoc(doc(db, 'company_news', editingNews.id), {
        ...formData,
        updatedAt: new Date().toISOString()
      });

      resetForm();
      loadNews();
      alert('회사 소식이 성공적으로 수정되었습니다!');
    } catch (error) {
      console.error('회사 소식 수정 실패:', error);
      alert('회사 소식 수정에 실패했습니다.');
    }
  };

  const handleDeleteNews = async (newsId: string) => {
    if (!firebaseConnected || !db) {
      alert('Firebase가 연결되지 않았습니다.');
      return;
    }

    if (confirm('정말로 이 소식을 삭제하시겠습니까?')) {
      try {
        await deleteDoc(doc(db, 'company_news', newsId));
        loadNews();
        alert('회사 소식이 삭제되었습니다!');
      } catch (error) {
        console.error('회사 소식 삭제 실패:', error);
        alert('회사 소식 삭제에 실패했습니다.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      type: 'notice',
      priority: 'medium',
      status: 'draft',
      publishDate: new Date().toISOString().split('T')[0]
    });
    setShowAddForm(false);
    setEditingNews(null);
  };

  const startEdit = (newsItem: CompanyNews) => {
    setEditingNews(newsItem);
    setFormData({
      title: newsItem.title,
      content: newsItem.content,
      type: newsItem.type,
      priority: newsItem.priority,
      status: newsItem.status,
      publishDate: newsItem.publishDate
    });
    setShowAddForm(true);
  };

  const filteredNews = news.filter(item => {
    if (filterType !== 'all' && item.type !== filterType) return false;
    if (filterStatus !== 'all' && item.status !== filterStatus) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">회사 소식을 로드하는 중...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 lg:px-6 py-8">
        {/* 헤더 */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 lg:p-6 mb-6 lg:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 lg:w-7 lg:h-7 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-white">회사 소식 관리</h1>
                <div className="flex items-center gap-2 mt-1">
                  <div className={`w-2 h-2 rounded-full ${firebaseConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <p className="text-xs lg:text-sm text-blue-200">
                    {firebaseConnected ? 'Firebase 연결됨' : '데모 모드'} • {news.length}개 소식
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAddForm(true)}
                className="px-3 py-1.5 lg:px-4 lg:py-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 hover:text-orange-200 rounded-lg transition-all duration-200 border border-orange-500/30 text-sm"
              >
                + 소식 작성
              </button>
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="px-3 py-1.5 lg:px-4 lg:py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 hover:text-blue-200 rounded-lg transition-all duration-200 border border-blue-500/30 text-sm"
              >
                ← 대시보드
              </button>
            </div>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 lg:p-4 border border-white/20">
            <div className="text-center">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <svg className="w-5 h-5 lg:w-6 lg:h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <div className="text-xl lg:text-2xl font-bold text-white">{news.length}</div>
              <div className="text-xs lg:text-sm text-blue-200">전체 소식</div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 lg:p-4 border border-white/20">
            <div className="text-center">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <svg className="w-5 h-5 lg:w-6 lg:h-6 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-xl lg:text-2xl font-bold text-white">{news.filter(n => n.status === 'published').length}</div>
              <div className="text-xs lg:text-sm text-blue-200">발행됨</div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 lg:p-4 border border-white/20">
            <div className="text-center">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <svg className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-xl lg:text-2xl font-bold text-white">{news.filter(n => n.status === 'draft').length}</div>
              <div className="text-xs lg:text-sm text-blue-200">임시저장</div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 lg:p-4 border border-white/20">
            <div className="text-center">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <svg className="w-5 h-5 lg:w-6 lg:h-6 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div className="text-xl lg:text-2xl font-bold text-white">{news.reduce((sum, n) => sum + n.viewCount, 0)}</div>
              <div className="text-xs lg:text-sm text-blue-200">총 조회수</div>
            </div>
          </div>
        </div>

        {/* 소식 작성/편집 폼 */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {editingNews ? '소식 편집' : '새 소식 작성'}
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="제목"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'notice' | 'news' | 'event' })}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="notice">공지사항</option>
                  <option value="news">뉴스</option>
                  <option value="event">이벤트</option>
                </select>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'high' | 'medium' | 'low' })}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="high">높음</option>
                  <option value="medium">보통</option>
                  <option value="low">낮음</option>
                </select>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' | 'archived' })}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="draft">임시저장</option>
                  <option value="published">발행</option>
                  <option value="archived">보관</option>
                </select>
              </div>
              <input
                type="date"
                value={formData.publishDate}
                onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                placeholder="내용"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={6}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mt-4 space-x-3">
              <button
                onClick={editingNews ? handleEditNews : handleAddNews}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingNews ? '수정하기' : '작성하기'}
              </button>
              <button
                onClick={resetForm}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                취소
              </button>
            </div>
          </div>
        )}

        {/* 필터 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-4">
            <label className="text-gray-700 font-medium">유형:</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">전체</option>
              <option value="notice">공지사항</option>
              <option value="news">뉴스</option>
              <option value="event">이벤트</option>
            </select>
            <label className="text-gray-700 font-medium ml-4">상태:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">전체</option>
              <option value="published">발행됨</option>
              <option value="draft">임시저장</option>
              <option value="archived">보관됨</option>
            </select>
          </div>
        </div>

        {/* 소식 목록 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h2 className="text-xl font-bold text-gray-800">
              회사 소식 목록 ({filteredNews.length}건)
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">제목</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">유형</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">우선순위</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">발행일</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">조회수</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">작업</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredNews.map((newsItem) => (
                  <tr key={newsItem.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{newsItem.title}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{newsItem.content}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        newsItem.type === 'notice' ? 'bg-blue-100 text-blue-800' :
                        newsItem.type === 'news' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {newsItem.type === 'notice' ? '공지사항' : 
                         newsItem.type === 'news' ? '뉴스' : '이벤트'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        newsItem.priority === 'high' ? 'bg-red-100 text-red-800' :
                        newsItem.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {newsItem.priority === 'high' ? '높음' : 
                         newsItem.priority === 'medium' ? '보통' : '낮음'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        newsItem.status === 'published' ? 'bg-green-100 text-green-800' :
                        newsItem.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {newsItem.status === 'published' ? '발행됨' : 
                         newsItem.status === 'draft' ? '임시저장' : '보관됨'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {newsItem.publishDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {newsItem.viewCount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                      <button
                        onClick={() => startEdit(newsItem)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        편집
                      </button>
                      <button
                        onClick={() => handleDeleteNews(newsItem.id!)}
                        className="text-red-600 hover:text-red-900"
                        disabled={!firebaseConnected}
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredNews.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                등록된 회사 소식이 없습니다.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default CompanyNewsManagePage;