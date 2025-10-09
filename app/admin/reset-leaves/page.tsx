'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, getDocs, doc, writeBatch } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import type { Leave, Employee } from '../../../types/employee';

const ResetLeavesPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isResetting, setIsResetting] = useState(false);
  const [firebaseConnected, setFirebaseConnected] = useState(false);
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [employees] = useState<Employee[]>([]);
  const [resetStats, setResetStats] = useState({
    totalLeaves: 0,
    approvedLeaves: 0,
    pendingLeaves: 0,
    affectedEmployees: 0
  });
  const router = useRouter();

  useEffect(() => {
    const adminMode = localStorage.getItem('admin_mode');
    const user = localStorage.getItem('admin_user');
    
    const loadData = async () => {
      try {
        setLoading(true);
        await Promise.all([loadLeaves(), loadEmployees()]);
      } catch (error) {
        console.error('데이터 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    if (adminMode === 'true' && user) {
      setIsAuthenticated(true);
      loadData();
    } else {
      router.push('/admin/login');
    }
    setLoading(false);
  }, [router]);

  const loadLeaves = async () => {
    try {
      if (!db) {
        console.log('Firebase가 연결되지 않음 - 데모 데이터 사용');
        setFirebaseConnected(false);
        // 데모 연차 데이터
        const demoLeaves: Leave[] = [
          {
            id: 'demo1',
            employeeId: 'demo1',
            employeeName: '김철수',
            name: '김철수',
            startDate: '2024-10-15',
            endDate: '2024-10-16',
            reason: '개인사유',
            type: '연차',
            status: '신청',
            days: 2,
            createdAt: '2024-10-08T10:00:00Z'
          },
          {
            id: 'demo2',
            employeeId: 'demo2',
            employeeName: '이영희',
            name: '이영희',
            startDate: '2024-10-20',
            endDate: '2024-10-22',
            reason: '가족 여행',
            type: '연차',
            status: '승인',
            days: 3,
            createdAt: '2024-10-07T14:30:00Z',
            approvedAt: '2024-10-07T15:00:00Z',
            approvedBy: 'admin'
          },
          {
            id: 'demo3',
            employeeId: 'demo1',
            employeeName: '김철수',
            name: '김철수',
            startDate: '2024-09-25',
            endDate: '2024-09-27',
            reason: '병가',
            type: '병가',
            status: '승인',
            days: 3,
            createdAt: '2024-09-20T09:00:00Z',
            approvedAt: '2024-09-20T10:00:00Z',
            approvedBy: 'admin'
          }
        ];
        setLeaves(demoLeaves);
        calculateResetStats(demoLeaves);
        return;
      }

      setFirebaseConnected(true);
      console.log('Firebase에서 연차 데이터 로드 시작...');

      const leavesSnapshot = await getDocs(collection(db, 'leaves'));
      const leavesList: Leave[] = [];
      
      leavesSnapshot.forEach((doc) => {
        leavesList.push({
          id: doc.id,
          ...doc.data()
        } as Leave);
      });

      setLeaves(leavesList);
      calculateResetStats(leavesList);
      console.log(`Firebase에서 ${leavesList.length}개의 연차 데이터를 로드했습니다.`);
      
    } catch (error) {
      console.error('연차 데이터 로드 실패:', error);
      setFirebaseConnected(false);
    }
  };

  const loadEmployees = async () => {
    try {
      if (!db) {
        // 데모 직원 데이터는 현재 사용하지 않음
        return;
      }

      // 직원 데이터는 현재 초기화 페이지에서 사용하지 않음
      
    } catch (error) {
      console.error('직원 데이터 로드 실패:', error);
    }
  };

  const calculateResetStats = (leavesData: Leave[]) => {
    const totalLeaves = leavesData.length;
    const approvedLeaves = leavesData.filter(l => l.status === '승인').length;
    const pendingLeaves = leavesData.filter(l => l.status === '신청').length;
    const affectedEmployees = new Set(leavesData.map(l => l.employeeId)).size;

    setResetStats({
      totalLeaves,
      approvedLeaves,
      pendingLeaves,
      affectedEmployees
    });
  };

  const handleReset = async () => {
    const confirmMessage = `⚠️ 연차 초기화 확인\n\n다음 데이터가 모두 삭제됩니다:\n• 총 연차 기록: ${resetStats.totalLeaves}건\n• 승인된 연차: ${resetStats.approvedLeaves}건\n• 대기 중인 연차: ${resetStats.pendingLeaves}건\n• 영향받는 직원: ${resetStats.affectedEmployees}명\n\n이 작업은 되돌릴 수 없습니다!\n정말로 모든 연차 기록을 초기화하시겠습니까?`;
    
    if (!confirm(confirmMessage)) return;

    // 2차 확인
    const finalConfirm = prompt('정말로 초기화하시려면 "연차초기화"를 정확히 입력해주세요:');
    if (finalConfirm !== '연차초기화') {
      alert('입력이 일치하지 않습니다. 초기화가 취소되었습니다.');
      return;
    }
    
    setIsResetting(true);
    try {
      if (!firebaseConnected || !db) {
        alert('⚠️ Firebase가 연결되지 않았습니다. 데모 모드에서는 초기화할 수 없습니다.');
        setIsResetting(false);
        return;
      }

      console.log('연차 기록 초기화 시작...');
      
      // 배치 삭제를 위한 batch 생성
      const batch = writeBatch(db);
      
      // 모든 연차 문서 삭제
      const leavesSnapshot = await getDocs(collection(db, 'leaves'));
      let deleteCount = 0;
      
      leavesSnapshot.forEach((document) => {
        batch.delete(doc(db!, 'leaves', document.id));
        deleteCount++;
      });

      // 배치 실행
      await batch.commit();
      
      console.log(`${deleteCount}개의 연차 기록이 삭제되었습니다.`);
      
      // 상태 업데이트
      setLeaves([]);
      setResetStats({
        totalLeaves: 0,
        approvedLeaves: 0,
        pendingLeaves: 0,
        affectedEmployees: 0
      });

      alert(`✅ 연차 초기화 완료!\n\n${deleteCount}개의 연차 기록이 성공적으로 삭제되었습니다.`);
      
      // 3초 후 대시보드로 이동
      setTimeout(() => {
        router.push('/admin/dashboard');
      }, 3000);
      
    } catch (error) {
      console.error('연차 초기화 실패:', error);
      alert('❌ 연차 초기화 중 오류가 발생했습니다.\n\n다시 시도해주세요.');
    }
    setIsResetting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">연차 데이터를 로드하는 중...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 - 위험 경고 스타일 */}
        <div className="bg-red-50 border border-red-200 rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center mb-2">
                <svg className="w-6 h-6 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <h1 className="text-3xl font-bold text-red-800">연차 기록 초기화</h1>
              </div>
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full ${firebaseConnected ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
                <p className="text-red-600">
                  {firebaseConnected ? 'Firebase 연결됨' : '데모 모드 (Firebase 연결 안됨)'}
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              대시보드로
            </button>
          </div>
        </div>

        {/* 경고 메시지 */}
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="font-bold">주의사항</h4>
              <p className="text-sm">
                이 작업은 모든 연차 기록을 영구적으로 삭제합니다. 삭제된 데이터는 복구할 수 없으니 신중하게 결정해주세요.
              </p>
            </div>
          </div>
        </div>

        {/* 초기화 통계 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">삭제될 총 연차</p>
                <p className="text-2xl font-bold text-red-600">{resetStats.totalLeaves}건</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">승인된 연차</p>
                <p className="text-2xl font-bold text-green-600">{resetStats.approvedLeaves}건</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">대기 중인 연차</p>
                <p className="text-2xl font-bold text-yellow-600">{resetStats.pendingLeaves}건</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">영향받는 직원</p>
                <p className="text-2xl font-bold text-blue-600">{resetStats.affectedEmployees}명</p>
              </div>
            </div>
          </div>
        </div>

        {/* 연차 목록 미리보기 */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h2 className="text-xl font-bold text-gray-800">삭제될 연차 목록 (최근 10개)</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">직원명</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">연차 유형</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">기간</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">사유</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">신청일</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaves.slice(0, 10).map((leave) => (
                  <tr key={leave.id} className="hover:bg-red-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {leave.employeeName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        {leave.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {leave.startDate} ~ {leave.endDate} ({leave.days}일)
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {leave.reason}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        leave.status === '승인' ? 'bg-green-100 text-green-800' :
                        leave.status === '반려' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {leave.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(leave.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {leaves.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                삭제할 연차 기록이 없습니다.
              </div>
            )}
          </div>
        </div>

        {/* 초기화 버튼 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-4">연차 기록 초기화</h3>
            <p className="text-gray-600 mb-6">
              아래 버튼을 클릭하면 모든 연차 기록이 영구적으로 삭제됩니다.<br/>
              이 작업은 되돌릴 수 없으니 신중하게 결정해주세요.
            </p>
            
            {isResetting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600 mr-3"></div>
                <span className="text-red-600 font-medium">초기화 진행 중...</span>
              </div>
            ) : (
              <button
                onClick={handleReset}
                disabled={resetStats.totalLeaves === 0 || !firebaseConnected}
                className={`px-8 py-3 rounded-lg font-bold text-white transition-colors ${
                  resetStats.totalLeaves === 0 || !firebaseConnected
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
                }`}
              >
                {resetStats.totalLeaves === 0 
                  ? '삭제할 연차 기록이 없습니다' 
                  : !firebaseConnected
                  ? 'Firebase 연결 필요'
                  : `모든 연차 기록 삭제 (${resetStats.totalLeaves}건)`}
              </button>
            )}
            
            <div className="mt-4 text-sm text-gray-500">
              <p>⚠️ 삭제된 데이터는 복구할 수 없습니다</p>
              <p>💾 필요시 백업을 먼저 진행하시기 바랍니다</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetLeavesPage;