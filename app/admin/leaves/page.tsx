'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const LeavesManagePage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const adminMode = localStorage.getItem('admin_mode');
    const user = localStorage.getItem('admin_user');
    
    if (adminMode === 'true' && user) {
      setIsAuthenticated(true);
    } else {
      router.push('/admin/login');
    }
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
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">연차 관리</h1>
                <p className="text-blue-200">직원 연차 신청 및 승인 관리</p>
              </div>
            </div>
            <button onClick={() => router.push('/admin/dashboard')} className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 hover:text-blue-200 rounded-xl transition-all duration-200 border border-blue-500/30">← 대시보드로</button>
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8">
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">연차 관리 시스템</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">직원들의 연차 신청을 검토하고 승인/반려 처리할 수 있는 관리 페이지입니다.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="bg-white/5 border border-yellow-500/20 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-2">연차 신청 현황</h3>
                <p className="text-gray-400 text-sm">대기 중인 연차 신청 목록</p>
              </div>
              <div className="bg-white/5 border border-yellow-500/20 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-2">승인/반려 처리</h3>
                <p className="text-gray-400 text-sm">연차 신청 검토 및 처리</p>
              </div>
              <div className="bg-white/5 border border-yellow-500/20 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-2">연차 통계</h3>
                <p className="text-gray-400 text-sm">부서별, 월별 연차 사용 현황</p>
              </div>
            </div>
            <div className="mt-12"><p className="text-yellow-300 font-medium">🔧 이 페이지는 현재 개발 중입니다. 실제 기능은 추후 구현될 예정입니다.</p></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeavesManagePage;