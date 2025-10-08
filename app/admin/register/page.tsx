'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const EmployeeRegisterPage: React.FC = () => {
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

  const handleGoBack = () => {
    router.push('/admin/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">로딩 중...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">직원 등록</h1>
                <p className="text-blue-200">새로운 직원을 시스템에 등록</p>
              </div>
            </div>
            <button
              onClick={handleGoBack}
              className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 hover:text-blue-200 rounded-xl transition-all duration-200 border border-blue-500/30"
            >
              ← 대시보드로
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8">
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-4">직원 등록 시스템</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              새로운 직원의 기본 정보를 입력하고 시스템에 등록할 수 있는 페이지입니다.
            </p>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              <div className="bg-white/5 border border-green-500/20 rounded-xl p-6">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">개인정보 입력</h3>
                <p className="text-gray-400 text-sm">이름, 연락처, 주소 등 기본 정보</p>
              </div>

              <div className="bg-white/5 border border-green-500/20 rounded-xl p-6">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">부서 배정</h3>
                <p className="text-gray-400 text-sm">소속 부서 및 직급 설정</p>
              </div>

              <div className="bg-white/5 border border-green-500/20 rounded-xl p-6">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">권한 설정</h3>
                <p className="text-gray-400 text-sm">시스템 접근 권한 및 역할 부여</p>
              </div>
            </div>

            <div className="mt-12">
              <p className="text-green-300 font-medium">
                🔧 이 페이지는 현재 개발 중입니다. 실제 기능은 추후 구현될 예정입니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeRegisterPage;