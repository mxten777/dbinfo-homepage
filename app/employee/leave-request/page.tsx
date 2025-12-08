'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

interface LeaveRequest {
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
  rejectedReason?: string;
}

const LeaveRequestPage: React.FC = () => {
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
  const [loading, setLoading] = useState(false);
  const [firebaseConnected, setFirebaseConnected] = useState(false);
  const [myLeaves, setMyLeaves] = useState<LeaveRequest[]>([]);
  const router = useRouter();

  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: '',
    type: '연차' as '연차' | '병가' | '경조사' | '기타',
    days: 1
  });

  useEffect(() => {
    const employeeMode = localStorage.getItem('employee_mode');
    const employeeInfoStr = localStorage.getItem('employee_info');
    
    if (employeeMode === 'true' && employeeInfoStr) {
      const info = JSON.parse(employeeInfoStr);
      setIsAuthenticated(true);
      setEmployeeInfo(info);
      loadMyLeaves(info.empNo);
    } else {
      router.push('/employee');
    }
  }, [router]);

  // 연차 일수 자동 계산
  const calculateLeaveDays = (startDate: string, endDate: string): number => {
    if (!startDate || !endDate) return 1;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
    return Math.max(1, daysDiff);
  };

  // 날짜 변경 시 자동으로 일수 계산
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const days = calculateLeaveDays(formData.startDate, formData.endDate);
      setFormData(prev => ({ ...prev, days }));
    }
  }, [formData.startDate, formData.endDate]);

  const loadMyLeaves = async (empNo: string) => {
    try {
      if (!db) {
        console.log('Firebase가 연결되지 않음 - 데모 데이터 사용');
        setFirebaseConnected(false);
        // 데모 연차 데이터
        setMyLeaves([
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
            createdAt: '2024-11-10T09:30:00Z'
          }
        ]);
        return;
      }

      setFirebaseConnected(true);
      console.log('Firebase에서 내 연차 데이터 로드 시작...');

      const leavesQuery = query(
        collection(db, 'leaves'),
        where('employeeId', '==', empNo),
        orderBy('createdAt', 'desc')
      );
      const leavesSnapshot = await getDocs(leavesQuery);
      const leavesList: LeaveRequest[] = [];
      
      leavesSnapshot.forEach((doc) => {
        leavesList.push({
          id: doc.id,
          ...doc.data()
        } as LeaveRequest);
      });

      setMyLeaves(leavesList);
      console.log(`내 연차 ${leavesList.length}개 로드 완료`);
      
    } catch (error) {
      console.error('연차 데이터 로드 실패:', error);
      setFirebaseConnected(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 유효성 검사
    if (!formData.startDate || !formData.endDate) {
      alert('시작일과 종료일을 모두 입력해주세요.');
      setLoading(false);
      return;
    }
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      alert('종료일은 시작일보다 늦어야 합니다.');
      setLoading(false);
      return;
    }
    if (!formData.reason.trim()) {
      alert('신청 사유를 입력해주세요.');
      setLoading(false);
      return;
    }
    if (employeeInfo && formData.days > employeeInfo.remainingLeaves && formData.type === '연차') {
      alert(`잔여 연차(${employeeInfo.remainingLeaves}일)가 부족합니다.`);
      setLoading(false);
      return;
    }

    try {
      if (!employeeInfo) {
        alert('직원 정보를 불러올 수 없습니다.');
        setLoading(false);
        return;
      }

      const newLeave = {
        employeeId: employeeInfo.empNo,
        employeeName: employeeInfo.name,
        name: employeeInfo.name,
        ...formData,
        days: calculateLeaveDays(formData.startDate, formData.endDate),
        status: '신청' as const,
        createdAt: new Date().toISOString()
      };

      if (firebaseConnected && db) {
        // Firebase에 저장
        const docRef = await addDoc(collection(db, 'leaves'), newLeave);
        console.log('연차 신청 추가됨:', docRef.id);
      } else {
        // 데모 모드에서는 로컬 상태에만 추가
        setMyLeaves(prev => [{ ...newLeave, id: 'demo' + Date.now() }, ...prev]);
      }

      // 폼 리셋
      setFormData({
        startDate: '',
        endDate: '',
        reason: '',
        type: '연차',
        days: 1
      });

      alert('연차 신청이 성공적으로 제출되었습니다!');
      
      // 데이터 새로고침
      if (employeeInfo?.empNo) {
        loadMyLeaves(employeeInfo.empNo);
      }

    } catch (error) {
      console.error('연차 신청 실패:', error);
      alert('연차 신청에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || !employeeInfo) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">연차 신청</h1>
                <div className="flex items-center gap-2 mt-1">
                  <div className={`w-2 h-2 rounded-full ${firebaseConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <p className="text-sm text-blue-200">
                    {firebaseConnected ? 'Firebase 연결됨' : '데모 모드'} • 잔여 연차: {employeeInfo?.remainingLeaves || 0}일
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 연차 신청 폼 */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">새 연차 신청</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">연차 종류</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value as '연차' | '병가' | '경조사' | '기타'})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="연차">연차</option>
                  <option value="병가">병가</option>
                  <option value="경조사">경조사</option>
                  <option value="기타">기타</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">시작일</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">종료일</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    min={formData.startDate}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              {formData.startDate && formData.endDate && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                  <span className="text-blue-300 text-sm">
                    총 신청 일수: <span className="font-bold">{formData.days}일</span>
                    {formData.type === '연차' && employeeInfo && (
                      <span className="ml-2">
                        (잔여: {employeeInfo.remainingLeaves - formData.days}일)
                      </span>
                    )}
                  </span>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">사유 <span className="text-red-400">*</span></label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 h-24 resize-none"
                  placeholder="연차 사유를 입력하세요"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {loading ? '신청 중...' : '연차 신청하기'}
              </button>
            </form>
          </div>

          {/* 내 연차 신청 내역 */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">내 연차 신청 내역</h2>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {myLeaves.map((leave) => (
                <div key={leave.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        {leave.type}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        leave.status === '승인' ? 'bg-green-100 text-green-800' :
                        leave.status === '반려' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {leave.status}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(leave.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-white font-medium">
                      {leave.startDate} ~ {leave.endDate} ({leave.days}일)
                    </div>
                    <div className="text-gray-300 text-sm">
                      {leave.reason}
                    </div>
                    {leave.status === '반려' && leave.rejectedReason && (
                      <div className="bg-red-500/10 border border-red-500/20 rounded p-2 mt-2">
                        <span className="text-red-300 text-xs">
                          반려사유: {leave.rejectedReason}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {myLeaves.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-400">아직 연차 신청 내역이 없습니다.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequestPage;