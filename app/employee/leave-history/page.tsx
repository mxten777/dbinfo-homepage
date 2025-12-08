'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

interface LeaveHistory {
  id?: string;
  employeeId: string;
  employeeName: string;
  startDate: string;
  endDate: string;
  reason: string;
  type: '연차' | '병가' | '경조사' | '기타';
  status: '신청' | '승인' | '반려';
  days: number;
  createdAt: string;
  approvedAt?: string;
  approvedBy?: string;
  rejectedReason?: string;
}

const LeaveHistoryPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  interface EmployeeInfo {
    name: string;
    department: string;
    position: string;
    empNo: string;
    totalLeaves: number;
    usedLeaves: number;
    remainingLeaves: number;
  }
  
  const [employeeInfo, setEmployeeInfo] = useState<EmployeeInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [firebaseConnected, setFirebaseConnected] = useState(false);
  const [leaves, setLeaves] = useState<LeaveHistory[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterYear, setFilterYear] = useState<string>('2024');
  const router = useRouter();

  useEffect(() => {
    const employeeMode = localStorage.getItem('employee_mode');
    const employeeInfoStr = localStorage.getItem('employee_info');
    
    if (employeeMode === 'true' && employeeInfoStr) {
      const info = JSON.parse(employeeInfoStr);
      setIsAuthenticated(true);
      setEmployeeInfo(info);
      loadLeaveHistory(info.empNo);
    } else {
      router.push('/employee');
    }
  }, [router]);

  const loadLeaveHistory = async (empNo: string) => {
    try {
      setLoading(true);
      
      if (!db) {
        console.log('Firebase가 연결되지 않음 - 데모 데이터 사용');
        setFirebaseConnected(false);
        // 데모 연차 이력 데이터
        setLeaves([
          {
            id: 'demo1',
            employeeId: empNo,
            employeeName: '김직원',
            startDate: '2024-12-20',
            endDate: '2024-12-22',
            reason: '개인사유',
            type: '연차',
            status: '신청',
            days: 3,
            createdAt: '2024-12-08T10:00:00Z'
          },
          {
            id: 'demo2',
            employeeId: empNo,
            employeeName: '김직원',
            startDate: '2024-11-15',
            endDate: '2024-11-15',
            reason: '병원 진료',
            type: '병가',
            status: '승인',
            days: 1,
            createdAt: '2024-11-10T09:30:00Z',
            approvedAt: '2024-11-10T14:20:00Z',
            approvedBy: 'admin'
          },
          {
            id: 'demo3',
            employeeId: empNo,
            employeeName: '김직원',
            startDate: '2024-10-01',
            endDate: '2024-10-03',
            reason: '가족 여행',
            type: '연차',
            status: '승인',
            days: 3,
            createdAt: '2024-09-25T16:45:00Z',
            approvedAt: '2024-09-26T09:15:00Z',
            approvedBy: 'admin'
          },
          {
            id: 'demo4',
            employeeId: empNo,
            employeeName: '김직원',
            startDate: '2024-08-15',
            endDate: '2024-08-16',
            reason: '개인 업무',
            type: '연차',
            status: '반려',
            days: 2,
            createdAt: '2024-08-10T11:20:00Z',
            rejectedReason: '업무 일정상 해당 기간 연차 불가'
          }
        ]);
        setLoading(false);
        return;
      }

      setFirebaseConnected(true);
      console.log('Firebase에서 연차 이력 로드 시작...');

      const leavesQuery = query(
        collection(db, 'leaves'),
        where('employeeId', '==', empNo),
        orderBy('createdAt', 'desc')
      );
      const leavesSnapshot = await getDocs(leavesQuery);
      const leavesList: LeaveHistory[] = [];
      
      leavesSnapshot.forEach((doc) => {
        leavesList.push({
          id: doc.id,
          ...doc.data()
        } as LeaveHistory);
      });

      setLeaves(leavesList);
      console.log(`연차 이력 ${leavesList.length}개 로드 완료`);
      
    } catch (error) {
      console.error('연차 이력 로드 실패:', error);
      setFirebaseConnected(false);
    } finally {
      setLoading(false);
    }
  };

  // 필터링된 연차 내역
  const filteredLeaves = leaves.filter(leave => {
    if (filterStatus !== 'all' && leave.status !== filterStatus) return false;
    if (filterType !== 'all' && leave.type !== filterType) return false;
    if (filterYear !== 'all' && !leave.startDate.startsWith(filterYear)) return false;
    return true;
  });

  // 연차 통계 계산
  const stats = {
    total: leaves.length,
    approved: leaves.filter(l => l.status === '승인').length,
    pending: leaves.filter(l => l.status === '신청').length,
    rejected: leaves.filter(l => l.status === '반려').length,
    totalDays: leaves.filter(l => l.status === '승인').reduce((sum, l) => sum + l.days, 0)
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">연차 이력을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !employeeInfo) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">연차 사용 내역</h1>
                <div className="flex items-center gap-2 mt-1">
                  <div className={`w-2 h-2 rounded-full ${firebaseConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <p className="text-sm text-blue-200">
                    {firebaseConnected ? 'Firebase 연결됨' : '데모 모드'} • 총 {filteredLeaves.length}건
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => router.push('/employee')}
              className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-colors"
            >
              ← 직원 포털
            </button>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-center">
            <div className="text-2xl font-bold text-white">{stats.total}</div>
            <div className="text-sm text-blue-200">총 신청</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-center">
            <div className="text-2xl font-bold text-green-400">{stats.approved}</div>
            <div className="text-sm text-blue-200">승인</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-center">
            <div className="text-2xl font-bold text-yellow-400">{stats.pending}</div>
            <div className="text-sm text-blue-200">대기</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-center">
            <div className="text-2xl font-bold text-red-400">{stats.rejected}</div>
            <div className="text-sm text-blue-200">반려</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-center">
            <div className="text-2xl font-bold text-blue-400">{stats.totalDays}</div>
            <div className="text-sm text-blue-200">사용일수</div>
          </div>
        </div>

        {/* 필터 */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">상태</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">전체</option>
                <option value="신청">신청</option>
                <option value="승인">승인</option>
                <option value="반려">반려</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">종류</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">전체</option>
                <option value="연차">연차</option>
                <option value="병가">병가</option>
                <option value="경조사">경조사</option>
                <option value="기타">기타</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">연도</label>
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">전체</option>
                <option value="2024">2024년</option>
                <option value="2023">2023년</option>
              </select>
            </div>
          </div>
        </div>

        {/* 연차 내역 목록 */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-bold text-white">연차 내역 ({filteredLeaves.length}건)</h2>
          </div>
          
          <div className="divide-y divide-white/10">
            {filteredLeaves.map((leave) => (
              <div key={leave.id} className="p-6 hover:bg-white/5 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
                      {leave.type}
                    </span>
                    <span className={`px-3 py-1 text-sm rounded-full ${
                      leave.status === '승인' ? 'bg-green-100 text-green-800' :
                      leave.status === '반려' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {leave.status}
                    </span>
                  </div>
                  <span className="text-sm text-gray-400">
                    신청일: {new Date(leave.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-white font-medium mb-1">기간</div>
                    <div className="text-gray-300">
                      {leave.startDate} ~ {leave.endDate} ({leave.days}일)
                    </div>
                  </div>
                  <div>
                    <div className="text-white font-medium mb-1">사유</div>
                    <div className="text-gray-300">{leave.reason}</div>
                  </div>
                </div>

                {leave.status === '승인' && leave.approvedAt && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                    <div className="text-green-300 text-sm">
                      승인일: {new Date(leave.approvedAt).toLocaleDateString()}
                      {leave.approvedBy && ` • 승인자: ${leave.approvedBy}`}
                    </div>
                  </div>
                )}

                {leave.status === '반려' && leave.rejectedReason && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                    <div className="text-red-300 text-sm">
                      반려사유: {leave.rejectedReason}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredLeaves.length === 0 && (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-white mb-2">연차 내역이 없습니다</h3>
              <p className="text-gray-400 mb-4">필터 조건을 변경하거나 새로운 연차를 신청해보세요.</p>
              <button
                onClick={() => router.push('/employee/leave-request')}
                className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-lg transition-colors"
              >
                연차 신청하기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaveHistoryPage;