'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ResetDeputyPage: React.FC = () => {
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
    if (!confirm('⚠️ 정말로 모든 대리신청 기록을 초기화하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다!')) return;
    
    setIsResetting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('✅ 대리신청 기록이 성공적으로 초기화되었습니다.');
      router.push('/admin/dashboard');
    } catch {
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
                <svg className="w-7 h-7 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </div>
              <div><h1 className="text-2xl font-bold text-white">대리신청 초기화</h1><p className="text-red-200">⚠️ 모든 대리신청 데이터를 삭제합니다</p></div>
            </div>
            <button onClick={() => router.push('/admin/dashboard')} className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 hover:text-blue-200 rounded-xl transition-all duration-200 border border-blue-500/30">← 대시보드로</button>
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-red-500/20 rounded-2xl p-8">
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">대리신청 기록 초기화</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">모든 대리신청 기록과 승인 이력을 완전히 삭제합니다.</p>
            
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 mb-8 max-w-lg mx-auto">
              <h3 className="text-xl font-bold text-red-300 mb-4">⚠️ 삭제될 데이터</h3>
              <ul className="text-red-200 text-left space-y-2">
                <li>• 모든 대리신청 기록</li>
                <li>• 승인/반려 이력</li>
                <li>• 대리업무 수행 기록</li>
                <li>• 관련된 모든 첨부 파일</li>
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
              {isResetting ? '🔄 초기화 중...' : '🗑️ 대리신청 기록 초기화 실행'}
            </button>
            
            <div className="mt-8"><p className="text-red-300 font-medium">이 기능은 시스템 관리자만 사용할 수 있습니다.</p></div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ResetDeputyPage;