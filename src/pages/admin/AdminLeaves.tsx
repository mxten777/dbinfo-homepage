import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useAuth } from '../../AuthContext';
import type { Leave, Employee } from '../../types/employee';

const AdminLeaves: React.FC = () => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  console.log('AdminLeaves 컴포넌트 렌더링 시작, user:', user);

  // iframe 문제 해결을 위한 임시 코드
  useEffect(() => {
    const removeIframes = () => {
      const iframes = document.querySelectorAll('iframe');
      iframes.forEach(iframe => {
        if (iframe.style.height === '1px') {
          iframe.style.height = '100vh';
          iframe.style.minHeight = '800px';
          console.log('iframe 높이 수정됨:', iframe);
        }
      });
    };
    
    removeIframes();
    const interval = setInterval(removeIframes, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // 직원 데이터 가져오기
    const fetchEmployees = async () => {
      try {
        const employeesSnapshot = await getDocs(collection(db, 'employees'));
        const employeesData = employeesSnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Employee[];
        
        console.log('🔵 전체 직원 데이터:', employeesData);
        setEmployees(employeesData);
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
        
        console.log('🟠 전체 연차 데이터:', leavesData);
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
    console.log(`🔍 매칭 시도 - Leave ID: ${leave.id}, employeeId: ${leave.employeeId}`);
    
    // 1차: Firestore 문서 ID로 매칭 (관리자 대리신청)
    let employee = employees.find(emp => emp.id === leave.employeeId);
    if (employee) {
      console.log('✅ 1차 매칭 성공 (Firestore ID):', employee.name);
      return { name: employee.name, email: employee.email };
    }
    
    // 2차: Firebase Auth UID로 매칭 (직원 직접 신청)
    if (leave.employeeId) {
      employee = employees.find(emp => emp.uid === leave.employeeId);
      if (employee) {
        console.log('✅ 2차 매칭 성공 (Firebase UID):', employee.name);
        return { name: employee.name, email: employee.email };
      }
    }
    
    // 3차: 이메일로 매칭
    if (leave.employeeId?.includes('@')) {
      employee = employees.find(emp => emp.email === leave.employeeId);
      if (employee) {
        console.log('✅ 3차 매칭 성공 (이메일):', employee.name);
        return { name: employee.name, email: employee.email };
      }
    }
    
    // 4차: 이름으로 매칭 (fallback)
    if (leave.employeeName || leave.name) {
      employee = employees.find(emp => 
        emp.name === leave.employeeName || emp.name === leave.name
      );
      if (employee) {
        console.log('✅ 4차 매칭 성공 (이름):', employee.name);
        return { name: employee.name, email: employee.email };
      }
    }
    
    // 매칭 실패 시 fallback
    console.log('❌ 매칭 실패 - fallback 사용');
    return {
      name: leave.employeeName || leave.name || '알 수 없음',
      email: leave.employeeId?.includes('@') ? leave.employeeId : ''
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
    console.log('AdminLeaves: 로딩 중...');
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  console.log('AdminLeaves: 메인 컴포넌트 렌더링, leaves 개수:', leaves.length);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">전체 연차 현황</h1>
        <p className="text-gray-600">모든 직원의 연차 신청 현황을 확인할 수 있습니다.</p>
      </div>
      
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
                    유형
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
                      {(() => {
                        const employeeInfo = getEmployeeInfo(leave);
                        return (
                          <div>
                            <div className="font-semibold text-gray-900">
                              {employeeInfo.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {employeeInfo.email}
                            </div>
                          </div>
                        );
                      })()}
                    </td>
                    <td className="px-2 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        leave.type === '연차' ? 'bg-blue-100 text-blue-800' :
                        leave.type === '반차' ? 'bg-green-100 text-green-800' :
                        leave.type === '병가' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {leave.type || '연차'}
                      </span>
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
                            onClick={() => leave.id && updateLeaveStatus(leave.id, '승인')}
                            className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-1 rounded transition-colors"
                            disabled={!leave.id}
                          >
                            승인
                          </button>
                          <button
                            onClick={() => leave.id && updateLeaveStatus(leave.id, '거절')}
                            className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded transition-colors"
                            disabled={!leave.id}
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
