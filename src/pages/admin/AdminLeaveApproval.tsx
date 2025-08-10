import React, { useState, useEffect } from 'react';
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
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">연차 승인 관리</h1>
        <p className="text-gray-600">직원들의 연차 신청을 검토하고 승인/거절할 수 있습니다.</p>
      </div>

      {/* 필터 버튼 */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'all' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          전체 ({statusCounts.all})
        </button>
        <button
          onClick={() => setFilter('신청')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === '신청' 
              ? 'bg-yellow-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          신청 ({statusCounts.신청})
        </button>
        <button
          onClick={() => setFilter('승인')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === '승인' 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          승인 ({statusCounts.승인})
        </button>
        <button
          onClick={() => setFilter('반려')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === '반려' 
              ? 'bg-red-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          반려 ({statusCounts.반려})
        </button>
      </div>
      
      {filteredLeaves.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 text-lg">
            {filter === 'all' ? '연차 신청이 없습니다.' : 
             filter === '신청' ? '신청된 연차가 없습니다.' :
             filter === '승인' ? '승인된 연차가 없습니다.' :
             '반려된 연차가 없습니다.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    신청자
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    유형
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    연차 기간
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    일수
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    사유
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLeaves.map((leave) => {
                  const employeeInfo = getEmployeeInfo(leave);
                  return (
                    <tr key={leave.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="font-semibold text-gray-900">
                            {employeeInfo.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {employeeInfo.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          leave.type === '연차' ? 'bg-blue-100 text-blue-800' :
                          leave.type === '반차' ? 'bg-green-100 text-green-800' :
                          leave.type === '병가' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {leave.type || '연차'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div>{formatDate(leave.startDate)}</div>
                          <div className="text-gray-500">~ {formatDate(leave.endDate)}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {calculateLeaveDays(leave.startDate, leave.endDate)}일
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                        <div className="truncate" title={leave.reason || '사유 없음'}>
                          {leave.reason || '사유 없음'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          leave.status === '승인'
                            ? 'bg-green-100 text-green-800' 
                            : leave.status === '반려'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {leave.status === '승인' ? '승인' : 
                           leave.status === '반려' ? '반려' : '신청'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {leave.status === '신청' ? (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => leave.id && updateLeaveStatus(leave.id, '승인')}
                              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                              disabled={!leave.id}
                            >
                              승인
                            </button>
                            <button
                              onClick={() => leave.id && updateLeaveStatus(leave.id, '반려')}
                              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                              disabled={!leave.id}
                            >
                              반려
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-400">처리 완료</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLeaveApproval;
