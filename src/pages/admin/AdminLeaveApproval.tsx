import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, doc, updateDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import type { Leave, Employee } from '../../types/employee';

const AdminLeaveApproval: React.FC = () => {
  // 직원 데이터 재조회 함수
  const fetchEmployees = async () => {
    try {
      const employeesSnapshot = await getDocs(collection(db, 'employees'));
      const employeesData = employeesSnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Employee[];
      setEmployees(employeesData);
    } catch (error) {
      console.error('직원 데이터 가져오기 실패:', error);
    }
  };
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | '신청' | '승인' | '반려'>('all');

  useEffect(() => {
    // 연차 신청 실시간 가져오기
    const unsubscribe = onSnapshot(
      query(collection(db, 'leaves'), orderBy('createdAt', 'desc')),
      (snapshot) => {
        const leavesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          startDate: doc.data().startDate?.toDate?.() || doc.data().startDate,
          endDate: doc.data().endDate?.toDate?.() || doc.data().endDate,
          createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt
        })) as Leave[];
        setLeaves(leavesData);
        setLoading(false);
      },
      (error) => {
        console.error('연차 데이터 실시간 가져오기 실패:', error);
        setLoading(false);
      }
    );
    fetchEmployees();
    return () => unsubscribe();
  }, []);

  const getEmployeeInfo = (leave: Leave) => {
    // 1차: employeeId로 직원 찾기 (관리자 대리신청 & 직원 직접신청 모두 해당)
    let employee = employees.find(emp => emp.id === leave.employeeId);
    
    // 2차: employeeId가 Firebase Auth UID인 경우 (직원 직접 신청)
    if (!employee && leave.employeeId) {
      employee = employees.find(emp => emp.uid === leave.employeeId);
    }
    
    // 3차: email로 찾기
    if (!employee && leave.employeeId?.includes('@')) {
      employee = employees.find(emp => emp.email === leave.employeeId);
    }
    
    // 4차: 이름으로 찾기 (fallback)
    if (!employee && (leave.employeeName || leave.name)) {
      employee = employees.find(emp => 
        emp.name === leave.employeeName || emp.name === leave.name
      );
    }
    
    return {
      name: employee?.name || leave.employeeName || leave.name || '알 수 없음',
      email: employee?.email || (leave.employeeId?.includes('@') ? leave.employeeId : '') || ''
    };
  };

  const updateLeaveStatus = async (leaveId: string, status: '승인' | '반려') => {
    try {
      await updateDoc(doc(db, 'leaves', leaveId), {
        status,
        updatedAt: new Date().toISOString(),
        approvedBy: 'admin' // 승인자 정보
      });

      // 승인일 때 직원 연차 반영
      if (status === '승인') {
        const leave = leaves.find(l => l.id === leaveId);
        if (leave) {
          // leave.days 필드가 있으면 우선 사용, 없으면 기존 계산
          const days = typeof leave.days === 'number' ? leave.days : (leave.type === '반차' ? 0.5 : calculateLeaveDays(leave.startDate, leave.endDate));
          // 직원 매칭: uid > id > email
          let emp = employees.find(emp => emp.uid === leave.employeeId);
          if (!emp) emp = employees.find(emp => emp.id === leave.employeeId);
          if (!emp && leave.employeeId?.includes('@')) emp = employees.find(emp => emp.email === leave.employeeId);
          if (emp) {
            const newUsed = (emp.usedLeaves ?? 0) + days;
            const newRemain = (emp.totalLeaves ?? 0) - newUsed;
            await updateDoc(doc(db, 'employees', emp.id), {
              usedLeaves: newUsed,
              remainingLeaves: newRemain
            });
            console.log(`[updateDoc] 직원 연차 반영 성공: ${emp.id} used=${newUsed} remain=${newRemain}`);
          } else {
            console.warn(`[updateDoc] 직원 정보 매칭 실패: leave.employeeId=${leave.employeeId}`);
          }
        }
  // 승인 후 직원 데이터 즉시 갱신
  await fetchEmployees();
      }
    } catch (error) {
      console.error('연차 상태 업데이트 실패:', error);
      alert('상태 업데이트에 실패했습니다.');
    }
  };

  const formatDate = (date: any): string => {
    if (!date) return '날짜 없음';
    
    if (date instanceof Date) {
      return date.toLocaleDateString('ko-KR');
    }
    
    if (typeof date === 'string') {
      const parsedDate = new Date(date);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate.toLocaleDateString('ko-KR');
      }
      return date;
    }
    
    if (date.toDate && typeof date.toDate === 'function') {
      return date.toDate().toLocaleDateString('ko-KR');
    }
    
    return '날짜 형식 오류';
  };

  const calculateLeaveDays = (startDate: any, endDate: any): number => {
    if (!startDate || !endDate) return 0;
    
    let start: Date;
    let end: Date;
    
    if (startDate instanceof Date) {
      start = startDate;
    } else if (typeof startDate === 'string') {
      start = new Date(startDate);
    } else if (startDate.toDate) {
      start = startDate.toDate();
    } else {
      return 0;
    }
    
    if (endDate instanceof Date) {
      end = endDate;
    } else if (typeof endDate === 'string') {
      end = new Date(endDate);
    } else if (endDate.toDate) {
      end = endDate.toDate();
    } else {
      return 0;
    }
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
    
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const filteredLeaves = leaves.filter(leave => {
    if (filter === 'all') return true;
    if (filter === '신청') return leave.status === '신청';
    if (filter === '승인') return leave.status === '승인';
    if (filter === '반려') return leave.status === '반려';
    return true;
  });

  const getStatusCounts = () => {
    return {
      all: leaves.length,
      신청: leaves.filter(l => l.status === '신청').length,
      승인: leaves.filter(l => l.status === '승인').length,
      반려: leaves.filter(l => l.status === '반려').length,
    };
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-brand-50/20 to-accent-50/20 p-6 flex items-center justify-center">
        <div className="glass-strong rounded-3xl p-12 shadow-glass border border-white/30 bg-gradient-to-br from-white/95 to-white/80 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-accent-500 rounded-3xl flex items-center justify-center mx-auto mb-6 animate-pulse">
            <svg className="w-8 h-8 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold gradient-text mb-2">데이터 로딩 중</h3>
          <p className="text-neutral-600">연차 승인 현황을 불러오고 있습니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-brand-50/20 to-accent-50/20 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 섹션 */}
        <div className="glass-strong rounded-3xl p-8 mb-8 shadow-glass border border-white/30 bg-gradient-to-br from-white/95 to-white/80">
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-brand-100 to-accent-100 rounded-full border border-brand-200/50">
                <div className="w-3 h-3 bg-gradient-to-r from-brand-500 to-accent-500 rounded-full animate-pulse"></div>
                <span className="text-brand-700 font-bold text-sm">LEAVE APPROVAL MANAGEMENT</span>
              </div>
              <h1 className="text-4xl font-black gradient-text font-display tracking-tight">
                연차 승인 관리
              </h1>
              <p className="text-neutral-600 text-lg">
                직원들의 연차 신청을 검토하고 승인/반려 처리하세요
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="glass rounded-2xl p-3 bg-gradient-to-br from-warning-50/50 to-accent-50/50 border border-warning-200/30 text-center">
                  <div className="text-xl font-bold text-warning-700">{statusCounts.신청}</div>
                  <div className="text-xs text-warning-600 font-medium">대기중</div>
                </div>
                <div className="glass rounded-2xl p-3 bg-gradient-to-br from-success-50/50 to-brand-50/50 border border-success-200/30 text-center">
                  <div className="text-xl font-bold text-success-700">{statusCounts.승인}</div>
                  <div className="text-xs text-success-600 font-medium">승인완료</div>
                </div>
              </div>
              
              <Link 
                to="/admin/home"
                className="btn-primary bg-gradient-to-r from-brand-500 to-accent-500 text-white px-6 py-3 rounded-2xl hover:scale-105 transition-transform duration-300 font-bold shadow-glow flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                관리자홈
              </Link>
            </div>
          </div>
        </div>

        {/* 필터 섹션 */}
        <div className="glass-strong rounded-3xl p-6 mb-8 shadow-glass border border-white/30 bg-gradient-to-br from-white/95 to-white/80">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-accent-500 rounded-xl flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-neutral-800">상태별 필터</h3>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setFilter('all')}
                className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 flex items-center gap-2 ${
                  filter === 'all' 
                    ? 'bg-gradient-to-r from-brand-500 to-accent-500 text-white shadow-glow scale-105' 
                    : 'glass border border-neutral-200/50 text-neutral-700 hover:border-brand-300 hover:scale-105'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                전체 ({statusCounts.all})
              </button>
              
              <button
                onClick={() => setFilter('신청')}
                className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 flex items-center gap-2 ${
                  filter === '신청' 
                    ? 'bg-gradient-to-r from-warning-500 to-accent-500 text-white shadow-glow scale-105' 
                    : 'glass border border-warning-200/50 text-warning-700 hover:border-warning-300 hover:scale-105'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                신청 ({statusCounts.신청})
              </button>
              
              <button
                onClick={() => setFilter('승인')}
                className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 flex items-center gap-2 ${
                  filter === '승인' 
                    ? 'bg-gradient-to-r from-success-500 to-brand-500 text-white shadow-glow scale-105' 
                    : 'glass border border-success-200/50 text-success-700 hover:border-success-300 hover:scale-105'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                승인 ({statusCounts.승인})
              </button>
              
              <button
                onClick={() => setFilter('반려')}
                className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 flex items-center gap-2 ${
                  filter === '반려' 
                    ? 'bg-gradient-to-r from-error-500 to-warning-500 text-white shadow-glow scale-105' 
                    : 'glass border border-error-200/50 text-error-700 hover:border-error-300 hover:scale-105'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                반려 ({statusCounts.반려})
              </button>
            </div>
          </div>
        </div>
        
        {/* 연차 신청 목록 */}
        <div className="glass-strong rounded-3xl shadow-glass border border-white/30 bg-gradient-to-br from-white/95 to-white/80 overflow-hidden">
          {filteredLeaves.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-neutral-400 to-neutral-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-neutral-700 mb-2">
                {filter === 'all' ? '연차 신청이 없습니다' : 
                 filter === '신청' ? '대기 중인 신청이 없습니다' :
                 filter === '승인' ? '승인된 연차가 없습니다' :
                 '반려된 연차가 없습니다'}
              </h3>
              <p className="text-neutral-600">
                {filter === 'all' ? '아직 연차 신청이 등록되지 않았습니다.' : 
                 filter === '신청' ? '현재 승인 대기 중인 연차 신청이 없습니다.' :
                 filter === '승인' ? '승인 처리된 연차 신청이 없습니다.' :
                 '반려 처리된 연차 신청이 없습니다.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-200/50">
              {filteredLeaves.map((leave) => {
                const employeeInfo = getEmployeeInfo(leave);
                const leaveDays = calculateLeaveDays(leave.startDate, leave.endDate);
                
                return (
                  <div 
                    key={leave.id} 
                    className="p-6 hover:bg-gradient-to-r hover:from-brand-50/30 hover:to-accent-50/30 transition-all duration-300 group"
                  >
                    <div className="flex items-center justify-between">
                      {/* 신청자 정보 */}
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-accent-500 rounded-2xl flex items-center justify-center text-white font-bold shadow-glow">
                          {employeeInfo.name?.charAt(0) || 'N'}
                        </div>
                        <div>
                          <div className="font-bold text-neutral-800">{employeeInfo.name}</div>
                          <div className="text-sm text-neutral-500">{employeeInfo.email}</div>
                        </div>
                      </div>

                      {/* 연차 정보 */}
                      <div className="flex items-center gap-6">
                        {/* 연차 유형 */}
                        <div className="text-center">
                          <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                            leave.type === '연차' ? 'bg-gradient-to-r from-brand-100 to-accent-100 text-brand-700' :
                            leave.type === '반차' ? 'bg-gradient-to-r from-success-100 to-brand-100 text-success-700' :
                            leave.type === '병가' ? 'bg-gradient-to-r from-error-100 to-warning-100 text-error-700' :
                            'bg-gradient-to-r from-neutral-100 to-accent-100 text-neutral-700'
                          }`}>
                            {leave.type || '연차'}
                          </div>
                        </div>

                        {/* 기간 및 일수 */}
                        <div className="text-center">
                          <div className="font-bold text-neutral-800">{formatDate(leave.startDate)}</div>
                          <div className="text-xs text-neutral-500">~ {formatDate(leave.endDate)}</div>
                          <div className="text-sm font-bold text-brand-600">{leaveDays}일</div>
                        </div>

                        {/* 사유 */}
                        <div className="max-w-xs">
                          <div className="text-sm text-neutral-700 line-clamp-2" title={leave.reason || '사유 없음'}>
                            {leave.reason || '사유 없음'}
                          </div>
                        </div>

                        {/* 상태 */}
                        <div className="text-center">
                          <div className={`px-4 py-2 rounded-2xl font-bold text-sm ${
                            leave.status === '승인'
                              ? 'bg-gradient-to-r from-success-100 to-brand-100 text-success-700 border border-success-300/50' 
                              : leave.status === '반려'
                              ? 'bg-gradient-to-r from-error-100 to-warning-100 text-error-700 border border-error-300/50'
                              : 'bg-gradient-to-r from-warning-100 to-accent-100 text-warning-700 border border-warning-300/50'
                          }`}>
                            {leave.status === '승인' ? '✓ 승인완료' : 
                             leave.status === '반려' ? '✗ 반려처리' : '⏳ 승인대기'}
                          </div>
                        </div>

                        {/* 작업 버튼 */}
                        <div className="flex items-center gap-2">
                          {leave.status === '신청' ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => leave.id && updateLeaveStatus(leave.id, '승인')}
                                className="group/btn w-12 h-12 bg-gradient-to-br from-success-500 to-brand-500 rounded-xl flex items-center justify-center text-white hover:scale-110 transition-transform duration-300 shadow-glow hover:shadow-xl"
                                disabled={!leave.id}
                                title="승인"
                              >
                                <svg className="w-5 h-5 group-hover/btn:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </button>
                              <button
                                onClick={() => leave.id && updateLeaveStatus(leave.id, '반려')}
                                className="group/btn w-12 h-12 bg-gradient-to-br from-error-500 to-warning-500 rounded-xl flex items-center justify-center text-white hover:scale-110 transition-transform duration-300 shadow-glow hover:shadow-xl"
                                disabled={!leave.id}
                                title="반려"
                              >
                                <svg className="w-5 h-5 group-hover/btn:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ) : (
                            <div className="w-24 text-center">
                              <div className="text-xs text-neutral-500 font-medium">처리완료</div>
                              <div className={`text-xs font-bold ${
                                leave.status === '승인' ? 'text-success-600' : 'text-error-600'
                              }`}>
                                {new Date(leave.updatedAt || '').toLocaleDateString('ko-KR')}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLeaveApproval;
