import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import type { Leave, Employee } from '../../types/employee';

const AdminLeaves: React.FC = () => {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 직원 데이터 가져오기 (관리자 제외)
    const fetchEmployees = async () => {
      try {
        const employeesSnapshot = await getDocs(collection(db, 'employees'));
        const employeesData = employeesSnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Employee[];
        
        // 관리자는 휴가 관리 대상에서 제외 (일반 직원만 표시)
        const regularEmployees = employeesData.filter(emp => emp.role !== 'admin');
        setEmployees(regularEmployees);
      } catch (error) {
        console.error('직원 데이터 가져오기 실패:', error);
      }
    };

    // 연차 신청 실시간 가져오기
    const unsubscribe = onSnapshot(
      query(collection(db, 'leaves'), orderBy('createdAt', 'desc')),
      (snapshot) => {
        const leavesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          // 날짜 객체를 문자열로 변환
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
    const employee = employees.find(emp => 
      emp.id === leave.employeeId || 
      emp.email === leave.employeeId ||
      emp.name === leave.name || 
      emp.name === leave.employeeName
    );
    
    return {
      name: employee?.name || leave.employeeName || leave.name || '알 수 없음',
      email: employee?.email || leave.employeeId || ''
    };
  };

  const updateLeaveStatus = async (leaveId: string, status: '승인' | '거절' | 'approved' | 'rejected') => {
    try {
      await updateDoc(doc(db, 'leaves', leaveId), {
        status,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('연차 상태 업데이트 실패:', error);
      alert('상태 업데이트에 실패했습니다.');
    }
  };

  const formatDate = (date: any): string => {
    if (!date) return '날짜 없음';
    
    // Date 객체인 경우
    if (date instanceof Date) {
      return date.toLocaleDateString('ko-KR');
    }
    
    // 문자열인 경우
    if (typeof date === 'string') {
      const parsedDate = new Date(date);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate.toLocaleDateString('ko-KR');
      }
      return date;
    }
    
    // Firestore Timestamp인 경우
    if (date.toDate && typeof date.toDate === 'function') {
      return date.toDate().toLocaleDateString('ko-KR');
    }
    
    return '날짜 형식 오류';
  };

  const calculateLeaveDays = (startDate: any, endDate: any): number => {
    if (!startDate || !endDate) return 0;
    
    let start: Date;
    let end: Date;
    
    // Date 객체로 변환
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">연차 관리</h1>
      
      {leaves.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 text-lg">연차 신청이 없습니다.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 py-3 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    직원 정보
                  </th>
                  <th className="px-2 py-3 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    연차 기간
                  </th>
                  <th className="px-2 py-3 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    일수
                  </th>
                  <th className="px-2 py-3 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    사유
                  </th>
                  <th className="px-2 py-3 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-2 py-3 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaves.map((leave) => (
                  <tr key={leave.id} className="hover:bg-gray-50">
                    <td className="border px-2 py-2 sm:px-4 sm:py-2 whitespace-nowrap">
                      <div>
                        <div className="font-semibold text-gray-900">
                          {getEmployeeInfo(leave).name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {getEmployeeInfo(leave).email}
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div>{formatDate(leave.startDate)}</div>
                        <div className="text-gray-500">~ {formatDate(leave.endDate)}</div>
                      </div>
                    </td>
                    <td className="px-2 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-900">
                      {calculateLeaveDays(leave.startDate, leave.endDate)}일
                    </td>
                    <td className="px-2 py-2 sm:px-6 sm:py-4 text-sm text-gray-900 max-w-xs truncate">
                      {leave.reason || '사유 없음'}
                    </td>
                    <td className="px-2 py-2 sm:px-6 sm:py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        leave.status === '승인' || leave.status === 'approved'
                          ? 'bg-green-100 text-green-800' 
                          : leave.status === '거절' || leave.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {leave.status === '승인' || leave.status === 'approved' ? '승인' : 
                         leave.status === '거절' || leave.status === 'rejected' ? '거절' : '대기'}
                      </span>
                    </td>
                    <td className="px-2 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {(leave.status === '신청' || leave.status === 'pending') && (
                        <>
                          <button
                            onClick={() => updateLeaveStatus(leave.id!, '승인')}
                            className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-1 rounded transition-colors"
                          >
                            승인
                          </button>
                          <button
                            onClick={() => updateLeaveStatus(leave.id!, '거절')}
                            className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded transition-colors"
                          >
                            거절
                          </button>
                        </>
                      )}
                      {(leave.status !== '신청' && leave.status !== 'pending') && (
                        <span className="text-gray-400">처리 완료</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLeaves;
