import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import type { Leave, Employee } from '../types/employee';

const Leaves: React.FC = () => {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leavesSnap, employeesSnap] = await Promise.all([
          getDocs(collection(db, 'leaves')),
          getDocs(collection(db, 'employees'))
        ]);

        const leavesData = leavesSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Leave));

        const employeesData = employeesSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Employee));

        setLeaves(leavesData);
        setEmployees(employeesData);
      } catch (error) {
        console.error('데이터 로드 실패:', error);
        setMessage('데이터 로드에 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleStatusChange = async (leaveId: string, newStatus: '승인' | '거절') => {
    try {
      await updateDoc(doc(db, 'leaves', leaveId), {
        status: newStatus
      });

      setLeaves(prev => 
        prev.map(leave => 
          leave.id === leaveId 
            ? { ...leave, status: newStatus }
            : leave
        )
      );

      setMessage(`연차 신청이 ${newStatus}되었습니다.`);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('상태 변경 실패:', error);
      setMessage('상태 변경에 실패했습니다.');
    }
  };

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee?.name || '알 수 없음';
  };

  const getEmployeeEmail = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee?.email || '';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-700 mb-8 text-center">연차 신청 관리</h1>
        
        {message && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {message}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                    직원정보
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                    연차기간
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                    사유
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                    신청일
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                    관리
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaves.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      연차 신청 내역이 없습니다.
                    </td>
                  </tr>
                ) : (
                  leaves.map((leave) => (
                    <tr key={leave.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="font-semibold text-gray-900">
                            {getEmployeeName(leave.employeeId)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {getEmployeeEmail(leave.employeeId)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {leave.date || `${leave.startDate} ~ ${leave.endDate}`}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {leave.reason}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {leave.createdAt ? new Date(leave.createdAt).toLocaleDateString('ko-KR') : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          leave.status === '승인' 
                            ? 'bg-green-100 text-green-800'
                            : leave.status === '거절'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {leave.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {leave.status === '신청' && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleStatusChange(leave.id, '승인')}
                              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs font-medium"
                            >
                              승인
                            </button>
                            <button
                              onClick={() => handleStatusChange(leave.id, '거절')}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-medium"
                            >
                              거절
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaves;