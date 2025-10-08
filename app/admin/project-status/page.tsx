'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ProjectStatusPage: React.FC = () => {
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
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
              </div>
              <div><h1 className="text-2xl font-bold text-white">프로젝트 현황</h1><p className="text-blue-200">진행 중인 프로젝트 상태 모니터링</p></div>
            </div>
            <button onClick={() => router.push('/admin/dashboard')} className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 hover:text-blue-200 rounded-xl transition-all duration-200 border border-blue-500/30">← 대시보드로</button>
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8">
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">프로젝트 현황 관리</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">현재 진행 중인 프로젝트들의 상태와 진척도를 모니터링하고 관리합니다.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="bg-white/5 border border-purple-500/20 rounded-xl p-6"><h3 className="text-lg font-bold text-white mb-2">프로젝트 목록</h3><p className="text-gray-400 text-sm">전체 프로젝트 현황 조회</p></div>
              <div className="bg-white/5 border border-purple-500/20 rounded-xl p-6"><h3 className="text-lg font-bold text-white mb-2">진척도 관리</h3><p className="text-gray-400 text-sm">프로젝트별 완료율 추적</p></div>
              <div className="bg-white/5 border border-purple-500/20 rounded-xl p-6"><h3 className="text-lg font-bold text-white mb-2">팀원 배정</h3><p className="text-gray-400 text-sm">프로젝트 팀원 관리</p></div>
            </div>
            <div className="mt-12"><p className="text-purple-300 font-medium">🔧 이 페이지는 현재 개발 중입니다.</p></div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProjectStatusPage;