'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ResetLeavesPage: React.FC = () => {
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
    if (!confirm('⚠️ 정말로 모든 연차 기록을 초기화하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다!')) return;
    
    setIsResetting(true);
    try {
      // 여기에 실제 초기화 로직 구현
      await new Promise(resolve => setTimeout(resolve, 2000)); // 시뮬레이션
      alert('✅ 연차 기록이 성공적으로 초기화되었습니다.');
      router.push('/admin/dashboard');
    } catch (error) {
      alert('❌ 초기화 중 오류가 발생했습니다.');
    }
    setIsResetting(false);
  };

  if (loading) return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center"><div className="text-white text-xl">로딩 중...</div></div>;
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-6 py-8">
        <div className="bg-red-500/10 backdrop-blur-md border border-red-500/30 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              </div>
              <div><h1 className="text-2xl font-bold text-white">연차 기록 초기화</h1><p className="text-red-200">⚠️ 모든 연차 데이터를 삭제합니다</p></div>
            </div>
            <button onClick={() => router.push('/admin/dashboard')} className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 hover:text-blue-200 rounded-xl transition-all duration-200 border border-blue-500/30">← 대시보드로</button>
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-red-500/20 rounded-2xl p-8">
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">연차 기록 초기화</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">모든 직원의 연차 사용 기록을 완전히 삭제하고 초기 상태로 되돌립니다.</p>
            
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 mb-8 max-w-lg mx-auto">
              <h3 className="text-xl font-bold text-red-300 mb-4">⚠️ 주의사항</h3>
              <ul className="text-red-200 text-left space-y-2">
                <li>• 모든 연차 사용 이력이 삭제됩니다</li>
                <li>• 승인된 연차 신청도 모두 제거됩니다</li>
                <li>• 이 작업은 되돌릴 수 없습니다</li>
                <li>• 연차 잔여일수가 초기값으로 리셋됩니다</li>
              </ul>
            </div>

            <button 
              onClick={handleReset}
              disabled={isResetting}
              className={`px-8 py-4 rounded-xl font-bold text-white transition-all duration-300 ${
                isResetting 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-red-600 hover:bg-red-700 hover:scale-105'
              }`}
            >
              {isResetting ? '🔄 초기화 중...' : '🗑️ 연차 기록 초기화 실행'}
            </button>
            
            <div className="mt-8"><p className="text-red-300 font-medium">이 기능은 시스템 관리자만 사용할 수 있습니다.</p></div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ResetLeavesPage;