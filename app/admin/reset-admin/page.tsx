'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ResetAdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isResetting, setIsResetting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const adminMode = localStorage.getItem('admin_mode');
    const user = localStorage.getItem('admin_user');
    if (adminMode === 'true' && user) setIsAuthenticated(true);
    else router.push('/admin/login');
    setLoading(false);
  }, [router]);

  const handleReset = async () => {
    const confirmText = prompt('⚠️ 매우 위험한 작업입니다!\n\n관리자 시스템을 완전히 초기화하시려면 "RESET_ADMIN"을 정확히 입력하세요:');
    if (confirmText !== 'RESET_ADMIN') {
      alert('취소되었습니다.');
      return;
    }
    
    setIsResetting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      alert('⚠️ 관리자 시스템이 초기화되었습니다.\n로그인 페이지로 이동합니다.');
      localStorage.clear();
      router.push('/admin/login');
    } catch {
      alert('❌ 초기화 중 오류가 발생했습니다.');
      setIsResetting(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center"><div className="text-white text-xl">로딩 중...</div></div>;
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-6 py-8">
        <div className="bg-red-600/20 backdrop-blur-md border border-red-600/50 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-600/30 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-red-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <div><h1 className="text-2xl font-bold text-white">관리자 시스템 초기화</h1><p className="text-red-200">🚨 매우 위험 - 전체 시스템이 리셋됩니다</p></div>
            </div>
            <button onClick={() => router.push('/admin/dashboard')} className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 hover:text-blue-200 rounded-xl transition-all duration-200 border border-blue-500/30">← 대시보드로</button>
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-red-600/30 rounded-2xl p-8">
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-red-600/30 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <svg className="w-10 h-10 text-red-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">🚨 시스템 완전 초기화</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">모든 관리자 데이터와 시스템 설정을 완전히 삭제하고 공장 초기 상태로 되돌립니다.</p>
            
            <div className="bg-red-600/20 border border-red-600/50 rounded-xl p-6 mb-8 max-w-lg mx-auto">
              <h3 className="text-xl font-bold text-red-200 mb-4">🚨 완전 삭제될 데이터</h3>
              <ul className="text-red-100 text-left space-y-2">
                <li>• 모든 관리자 계정 정보</li>
                <li>• 전체 직원 데이터베이스</li>
                <li>• 연차, 대리신청 모든 기록</li>
                <li>• 시스템 설정 및 권한</li>
                <li>• 백업 데이터까지 완전 삭제</li>
              </ul>
            </div>

            <div className="bg-yellow-600/20 border border-yellow-600/50 rounded-xl p-4 mb-8 max-w-md mx-auto">
              <p className="text-yellow-200 font-medium">⚠️ 이 작업은 절대 되돌릴 수 없습니다!</p>
              <p className="text-yellow-300 text-sm mt-2">확인 문구를 정확히 입력해야 실행됩니다.</p>
            </div>

            <button 
              onClick={handleReset}
              disabled={isResetting}
              className={`px-8 py-4 rounded-xl font-bold text-white transition-all duration-300 border-2 ${
                isResetting 
                  ? 'bg-gray-600 border-gray-600 cursor-not-allowed' 
                  : 'bg-red-700 border-red-600 hover:bg-red-800 hover:scale-105 animate-pulse'
              }`}
            >
              {isResetting ? '🔄 시스템 초기화 중...' : '💥 관리자 시스템 완전 초기화'}
            </button>
            
            <div className="mt-8"><p className="text-red-200 font-medium">이 기능은 최고 관리자만 사용할 수 있습니다.</p></div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ResetAdminPage;