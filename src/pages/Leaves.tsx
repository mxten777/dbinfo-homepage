import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import type { Leave, Employee } from '../types/employee';

const Leaves: React.FC = () => {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLeave, setNewLeave] = useState({
    employeeId: '',
    startDate: '',
    endDate: '',
    reason: '',
    type: '연차' as '연차' | '반차' | '병가' | '기타'
  });

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

  const handleAddLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newLeave.employeeId || !newLeave.startDate || !newLeave.endDate || !newLeave.reason) {
      setMessage('모든 필드를 입력해주세요.');
      return;
    }

    try {
      const leaveData = {
        employeeId: newLeave.employeeId,
        startDate: newLeave.startDate,
        endDate: newLeave.endDate,
        reason: newLeave.reason,
        type: newLeave.type,
        status: '신청' as const,
        createdAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, 'leaves'), leaveData);
      
      const newLeaveWithId: Leave = {
        id: docRef.id,
        employeeId: leaveData.employeeId,
        startDate: leaveData.startDate,
        endDate: leaveData.endDate,
        reason: leaveData.reason,
        type: leaveData.type,
        status: leaveData.status,
        createdAt: leaveData.createdAt
      };

      setLeaves(prev => [...prev, newLeaveWithId]);
      setMessage('연차 신청이 성공적으로 등록되었습니다.');
      setShowAddForm(false);
      setNewLeave({
        employeeId: '',
        startDate: '',
        endDate: '',
        reason: '',
        type: '연차'
      });
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('연차 신청 실패:', error);
      setMessage('연차 신청에 실패했습니다.');
    }
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-700">연차 신청 관리</h1>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center space-x-2"
          >
            <span>{showAddForm ? '취소' : '+ 연차 신청'}</span>
          </button>
        </div>
        
        {message && (
          <div className={`mb-6 p-4 border rounded-lg ${
            message.includes('실패') 
              ? 'bg-red-100 border-red-400 text-red-700'
              : 'bg-green-100 border-green-400 text-green-700'
          }`}>
            {message}
          </div>
        )}

        {/* 연차 신청 폼 */}
        {showAddForm && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">새 연차 신청</h2>
            <form onSubmit={handleAddLeave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    직원 선택 *
                  </label>
                  <select
                    value={newLeave.employeeId}
                    onChange={(e) => setNewLeave(prev => ({ ...prev, employeeId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">직원을 선택하세요</option>
                    {employees.map(employee => (
                      <option key={employee.id} value={employee.id}>
                        {employee.name} ({employee.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    연차 유형 *
                  </label>
                  <select
                    value={newLeave.type}
                    onChange={(e) => setNewLeave(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="연차">연차</option>
                    <option value="반차">반차</option>
                    <option value="병가">병가</option>
                    <option value="기타">기타</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    시작일 *
                  </label>
                  <input
                    type="date"
                    value={newLeave.startDate}
                    onChange={(e) => setNewLeave(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    종료일 *
                  </label>
                  <input
                    type="date"
                    value={newLeave.endDate}
                    onChange={(e) => setNewLeave(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  신청 사유 *
                </label>
                <textarea
                  value={newLeave.reason}
                  onChange={(e) => setNewLeave(prev => ({ ...prev, reason: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="연차 신청 사유를 입력하세요"
                  required
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  신청 등록
                </button>
              </div>
            </form>
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
                        <div className="flex flex-col">
                          <span className="font-medium">{leave.type}</span>
                          <span className="text-xs text-gray-500">
                            {leave.date || `${leave.startDate} ~ ${leave.endDate}`}
                          </span>
                        </div>
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