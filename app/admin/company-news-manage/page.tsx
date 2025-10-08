'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const CompanyNewsManagePage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const adminMode = localStorage.getItem('admin_mode');
    const user = localStorage.getItem('admin_user');
    if (adminMode === 'true' && user) setIsAuthenticated(true);
    else router.push('/admin/login');
    setLoading(false);
  }, [router]);

  if (loading) return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center"><div className="text-white text-xl">로딩 중...</div></div>;
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-6 py-8">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
              </div>
              <div><h1 className="text-2xl font-bold text-white">회사 소식</h1><p className="text-blue-200">회사 공지사항 및 뉴스 관리</p></div>
            </div>
            <button onClick={() => router.push('/admin/dashboard')} className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 hover:text-blue-200 rounded-xl transition-all duration-200 border border-blue-500/30">← 대시보드로</button>
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8">
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">회사 소식 관리</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">회사 공지사항, 뉴스, 이벤트 등의 정보를 작성하고 관리합니다.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="bg-white/5 border border-orange-500/20 rounded-xl p-6"><h3 className="text-lg font-bold text-white mb-2">공지사항 작성</h3><p className="text-gray-400 text-sm">새로운 공지사항 등록</p></div>
              <div className="bg-white/5 border border-orange-500/20 rounded-xl p-6"><h3 className="text-lg font-bold text-white mb-2">뉴스 관리</h3><p className="text-gray-400 text-sm">회사 뉴스 편집 및 삭제</p></div>
              <div className="bg-white/5 border border-orange-500/20 rounded-xl p-6"><h3 className="text-lg font-bold text-white mb-2">이벤트 관리</h3><p className="text-gray-400 text-sm">회사 행사 일정 관리</p></div>
            </div>
            <div className="mt-12"><p className="text-orange-300 font-medium">🔧 이 페이지는 현재 개발 중입니다.</p></div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CompanyNewsManagePage;