'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, getDocs, doc, writeBatch } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

interface SystemStats {
  employees: number;
  projects: number;
  leaves: number;
  deputyRequests: number;
  companyNews: number;
  totalDocuments: number;
}

const ResetAdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isResetting, setIsResetting] = useState(false);
  const [firebaseConnected, setFirebaseConnected] = useState(false);
  const [systemStats, setSystemStats] = useState<SystemStats>({
    employees: 0,
    projects: 0,
    leaves: 0,
    deputyRequests: 0,
    companyNews: 0,
    totalDocuments: 0
  });
  const [resetProgress, setResetProgress] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const loadSystemStats = async () => {
      try {
        if (!db) {
          console.log('Firebase가 연결되지 않음 - 데모 데이터 사용');
          setFirebaseConnected(false);
          // 데모 통계
          setSystemStats({
            employees: 15,
            projects: 8,
            leaves: 23,
            deputyRequests: 7,
            companyNews: 12,
            totalDocuments: 65
          });
          return;
        }

        setFirebaseConnected(true);
        console.log('Firebase에서 시스템 통계 로드 시작...');

        // 모든 컬렉션의 문서 수 집계
        const collections = ['employees', 'projects', 'leaves', 'deputy_requests', 'company_news'];
        const stats: SystemStats = {
          employees: 0,
          projects: 0,
          leaves: 0,
          deputyRequests: 0,
          companyNews: 0,
          totalDocuments: 0
        };

        for (const collectionName of collections) {
          try {
            const snapshot = await getDocs(collection(db, collectionName));
            const count = snapshot.size;
            
            switch (collectionName) {
              case 'employees':
                stats.employees = count;
                break;
              case 'projects':
                stats.projects = count;
                break;
              case 'leaves':
                stats.leaves = count;
                break;
              case 'deputy_requests':
                stats.deputyRequests = count;
                break;
              case 'company_news':
                stats.companyNews = count;
                break;
            }
            stats.totalDocuments += count;
          } catch (error) {
            console.error(`${collectionName} 컬렉션 조회 실패:`, error);
          }
        }

        setSystemStats(stats);
        console.log('시스템 통계 로드 완료:', stats);
        
      } catch (error) {
        console.error('시스템 통계 로드 실패:', error);
        setFirebaseConnected(false);
      }
    };

    const adminMode = localStorage.getItem('admin_mode');
    const user = localStorage.getItem('admin_user');
    
    if (adminMode === 'true' && user) {
      setIsAuthenticated(true);
      loadSystemStats();
    } else {
      router.push('/admin/login');
    }
    setLoading(false);
  }, [router]);

  const handleReset = async () => {
    const confirmMessage = `🚨 관리자 시스템 완전 초기화 확인\n\n다음 모든 데이터가 영구 삭제됩니다:\n• 직원 정보: ${systemStats.employees}건\n• 프로젝트: ${systemStats.projects}건\n• 연차 신청: ${systemStats.leaves}건\n• 대리자 요청: ${systemStats.deputyRequests}건\n• 회사 소식: ${systemStats.companyNews}건\n• 총 문서: ${systemStats.totalDocuments}건\n\n⚠️ 이 작업은 절대 되돌릴 수 없습니다!\n정말로 전체 시스템을 초기화하시겠습니까?`;
    
    if (!confirm(confirmMessage)) return;

    // 1차 확인 - 숫자 입력
    const firstConfirm = prompt(`1차 확인: 삭제될 총 문서 수 "${systemStats.totalDocuments}"를 정확히 입력해주세요:`);
    if (firstConfirm !== systemStats.totalDocuments.toString()) {
      alert('입력이 일치하지 않습니다. 초기화가 취소되었습니다.');
      return;
    }

    // 2차 확인 - 텍스트 입력
    const finalConfirm = prompt('2차 확인: 정말로 초기화하시려면 "시스템완전초기화"를 정확히 입력해주세요:');
    if (finalConfirm !== '시스템완전초기화') {
      alert('입력이 일치하지 않습니다. 초기화가 취소되었습니다.');
      return;
    }

    // 3차 최종 확인
    const ultimateConfirm = confirm('⚠️ 최종 확인\n\n이것은 되돌릴 수 없는 작업입니다.\n정말로 모든 데이터를 삭제하고 시스템을 초기화하시겠습니까?');
    if (!ultimateConfirm) return;
    
    setIsResetting(true);
    setResetProgress([]);
    
    try {
      if (!firebaseConnected || !db) {
        alert('⚠️ Firebase가 연결되지 않았습니다. 데모 모드에서는 초기화할 수 없습니다.');
        setIsResetting(false);
        return;
      }

      console.log('시스템 완전 초기화 시작...');
      setResetProgress(prev => [...prev, '🔄 시스템 초기화 시작...']);

      const collections = [
        { name: 'employees', label: '직원 정보' },
        { name: 'projects', label: '프로젝트' },
        { name: 'leaves', label: '연차 신청' },
        { name: 'deputy_requests', label: '대리자 요청' },
        { name: 'company_news', label: '회사 소식' }
      ];

      let totalDeleted = 0;

      // 각 컬렉션별로 순차 삭제
      for (const coll of collections) {
        setResetProgress(prev => [...prev, `🔄 ${coll.label} 삭제 중...`]);
        
        try {
          const batch = writeBatch(db);
          const snapshot = await getDocs(collection(db, coll.name));
          let batchCount = 0;
          
          snapshot.forEach((document) => {
            batch.delete(doc(db!, coll.name, document.id));
            batchCount++;
          });

          if (batchCount > 0) {
            await batch.commit();
            totalDeleted += batchCount;
            setResetProgress(prev => [...prev, `✅ ${coll.label} ${batchCount}건 삭제 완료`]);
          } else {
            setResetProgress(prev => [...prev, `📝 ${coll.label} - 삭제할 데이터 없음`]);
          }
          
          // 각 컬렉션 처리 후 잠시 대기
          await new Promise(resolve => setTimeout(resolve, 1000));
          
        } catch (error) {
          console.error(`${coll.name} 컬렉션 삭제 실패:`, error);
          setResetProgress(prev => [...prev, `❌ ${coll.label} 삭제 실패: ${error}`]);
        }
      }

      setResetProgress(prev => [...prev, `🎉 시스템 초기화 완료! 총 ${totalDeleted}개 문서 삭제됨`]);
      
      // 상태 업데이트
      setSystemStats({
        employees: 0,
        projects: 0,
        leaves: 0,
        deputyRequests: 0,
        companyNews: 0,
        totalDocuments: 0
      });

      // 성공 메시지
      setTimeout(() => {
        alert(`✅ 시스템 완전 초기화 완료!\n\n총 ${totalDeleted}개의 문서가 삭제되었습니다.\n\n관리자 세션이 종료되며 로그인 페이지로 이동합니다.`);
        
        // 로컬 스토리지 완전 초기화
        localStorage.clear();
        sessionStorage.clear();
        
        // 로그인 페이지로 리다이렉트
        router.push('/admin/login');
      }, 2000);
      
    } catch (error) {
      console.error('시스템 초기화 실패:', error);
      setResetProgress(prev => [...prev, `❌ 시스템 초기화 중 심각한 오류 발생: ${error}`]);
      alert('❌ 시스템 초기화 중 심각한 오류가 발생했습니다.\n\n시스템 관리자에게 문의하세요.');
    }
    
    setIsResetting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">시스템 통계를 로드하는 중...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 - 최고 위험 경고 스타일 */}
        <div className="bg-red-900 border border-red-700 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center mb-2">
                <svg className="w-8 h-8 text-red-300 mr-3 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <h1 className="text-4xl font-bold text-red-100">🚨 시스템 완전 초기화</h1>
              </div>
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full ${firebaseConnected ? 'bg-green-400' : 'bg-red-400'} mr-2 animate-pulse`}></div>
                <p className="text-red-200 font-medium">
                  {firebaseConnected ? 'Firebase 연결됨 - 실제 데이터' : '데모 모드 (Firebase 연결 안됨)'}
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              대시보드로
            </button>
          </div>
        </div>

        {/* 극심한 경고 메시지 */}
        <div className="bg-red-800 border-l-8 border-red-600 text-red-100 p-6 mb-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <svg className="w-8 h-8 mr-3 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="text-2xl font-bold mb-2">🚨 극도로 위험한 작업</h4>
              <p className="text-lg">
                이 작업은 <span className="font-bold text-yellow-300">모든 시스템 데이터를 영구적으로 삭제</span>합니다.<br/>
                <span className="font-bold text-red-300">삭제된 데이터는 절대 복구할 수 없으며</span>, 전체 시스템이 공장 초기화됩니다.
              </p>
            </div>
          </div>
        </div>

        {/* 시스템 통계 - 위험 표시 */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <p className="text-sm text-gray-600">직원 정보</p>
              <p className="text-2xl font-bold text-blue-600">{systemStats.employees}</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <p className="text-sm text-gray-600">프로젝트</p>
              <p className="text-2xl font-bold text-green-600">{systemStats.projects}</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm text-gray-600">연차 신청</p>
              <p className="text-2xl font-bold text-yellow-600">{systemStats.leaves}</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="text-sm text-gray-600">대리자 요청</p>
              <p className="text-2xl font-bold text-purple-600">{systemStats.deputyRequests}</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500">
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <p className="text-sm text-gray-600">회사 소식</p>
              <p className="text-2xl font-bold text-indigo-600">{systemStats.companyNews}</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <p className="text-sm text-gray-600">총 문서</p>
              <p className="text-2xl font-bold text-red-600">{systemStats.totalDocuments}</p>
            </div>
          </div>
        </div>

        {/* 삭제될 데이터 상세 목록 */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="px-6 py-4 bg-red-50 border-b border-red-200">
            <h2 className="text-xl font-bold text-red-800">🚨 완전 삭제될 모든 데이터</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <span className="font-medium text-red-800">모든 직원 정보</span>
                  </div>
                  <span className="text-red-600 font-bold">{systemStats.employees}건</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <span className="font-medium text-red-800">모든 프로젝트</span>
                  </div>
                  <span className="text-red-600 font-bold">{systemStats.projects}건</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="font-medium text-red-800">모든 연차 기록</span>
                  </div>
                  <span className="text-red-600 font-bold">{systemStats.leaves}건</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <span className="font-medium text-red-800">모든 대리자 요청</span>
                  </div>
                  <span className="text-red-600 font-bold">{systemStats.deputyRequests}건</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    </div>
                    <span className="font-medium text-red-800">모든 회사 소식</span>
                  </div>
                  <span className="text-red-600 font-bold">{systemStats.companyNews}건</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-red-100 rounded-lg border-2 border-red-400">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-red-200 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </div>
                    <span className="font-bold text-red-800">총 삭제 문서</span>
                  </div>
                  <span className="text-red-700 font-bold text-xl">{systemStats.totalDocuments}건</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 진행 상태 표시 */}
        {isResetting && resetProgress.length > 0 && (
          <div className="bg-white rounded-lg shadow-md mb-6">
            <div className="px-6 py-4 bg-blue-50 border-b">
              <h2 className="text-xl font-bold text-blue-800">🔄 초기화 진행 상황</h2>
            </div>
            <div className="p-6">
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {resetProgress.map((log, index) => (
                  <div key={index} className="flex items-center p-2 bg-gray-50 rounded border-l-4 border-blue-500">
                    <span className="text-sm text-gray-700 font-mono">{log}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 초기화 실행 버튼 */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className={`w-12 h-12 text-red-600 ${!isResetting ? 'animate-pulse' : 'animate-spin'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-4">🚨 시스템 완전 초기화</h3>
            <p className="text-gray-600 mb-8 text-lg">
              아래 버튼을 클릭하면 <span className="font-bold text-red-600">모든 데이터가 영구적으로 삭제</span>됩니다.<br/>
              <span className="font-bold text-red-600">이 작업은 절대 되돌릴 수 없습니다!</span>
            </p>
            
            {isResetting ? (
              <div className="flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-red-600 mb-4"></div>
                <span className="text-red-600 font-bold text-xl">🔄 시스템 초기화 진행 중...</span>
                <p className="text-gray-500 mt-2">잠시만 기다려주세요...</p>
              </div>
            ) : (
              <button
                onClick={handleReset}
                disabled={systemStats.totalDocuments === 0 || !firebaseConnected}
                className={`px-12 py-4 rounded-lg font-bold text-white text-xl transition-colors ${
                  systemStats.totalDocuments === 0 || !firebaseConnected
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-offset-2 animate-pulse'
                }`}
              >
                {systemStats.totalDocuments === 0 
                  ? '삭제할 데이터가 없습니다' 
                  : !firebaseConnected
                  ? 'Firebase 연결 필요'
                  : `🚨 모든 데이터 삭제 (${systemStats.totalDocuments}건)`}
              </button>
            )}
            
            <div className="mt-6 space-y-2 text-sm text-gray-500">
              <p>⚠️ <span className="font-bold">3단계 확인 과정</span>을 거쳐야 실행됩니다</p>
              <p>🔒 <span className="font-bold">최고 관리자 권한</span>이 필요합니다</p>
              <p>💾 <span className="font-bold">백업 후 실행</span>을 강력히 권장합니다</p>
              <p>🚨 <span className="font-bold text-red-600">삭제된 데이터는 절대 복구할 수 없습니다</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ResetAdminPage;