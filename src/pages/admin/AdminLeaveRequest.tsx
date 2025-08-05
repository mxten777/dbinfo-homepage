import React, { useState, useEffect } from 'react';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useAuth } from '../../AuthContext';
import type { Employee } from '../../types/employee';

const AdminLeaveRequest: React.FC = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newLeave, setNewLeave] = useState({
    employeeId: '',
    startDate: '',
    endDate: '',
    reason: '',
    type: '연차' as '연차' | '반차' | '병가' | '기타'
  });

  // 직원 데이터 가져오기
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const employeesSnapshot = await getDocs(collection(db, 'employees'));
        const employeesData = employeesSnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Employee[];
        
        // 모든 직원 포함 (관리자 포함)
        setEmployees(employeesData);
      } catch (error) {
        console.error('직원 데이터 가져오기 실패:', error);
      }
    };

    fetchEmployees();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newLeave.employeeId || !newLeave.startDate || !newLeave.endDate || !newLeave.reason) {
      setMessage('모든 필드를 입력해주세요.');
      return;
    }

    if (!user?.email) {
      setMessage('로그인 정보를 확인할 수 없습니다.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 선택된 직원 정보 찾기
      const selectedEmployee = employees.find(emp => 
        emp.id === newLeave.employeeId || emp.email === newLeave.employeeId
      );

      const leaveData = {
        employeeId: selectedEmployee?.email || selectedEmployee?.id || newLeave.employeeId,
        employeeName: selectedEmployee?.name || '알 수 없음',
        startDate: newLeave.startDate,
        endDate: newLeave.endDate,
        reason: newLeave.reason,
        type: newLeave.type,
        status: '신청' as const,
        createdAt: new Date().toISOString(),
        requestedBy: user.email, // 누가 대신 신청했는지 기록
        isAdminRequest: true // 관리자가 대신 신청한 것으로 표시
      };

      await addDoc(collection(db, 'leaves'), leaveData);
      
      setMessage(`${selectedEmployee?.name}님의 연차 신청이 성공적으로 등록되었습니다.`);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateDays = () => {
    if (newLeave.startDate && newLeave.endDate) {
      const start = new Date(newLeave.startDate);
      const end = new Date(newLeave.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    }
    return 0;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">직원 연차 대리 신청</h1>
            <p className="text-gray-600">직원을 대신하여 연차를 신청하세요</p>
          </div>

          {message && (
            <div className={`p-4 rounded-lg mb-6 ${
              message.includes('성공') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                직원 선택 *
              </label>
              <select
                value={newLeave.employeeId}
                onChange={(e) => setNewLeave({...newLeave, employeeId: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">연차 신청할 직원을 선택하세요</option>
                {employees.map((employee) => (
                  <option key={employee.id || employee.email} value={employee.id || employee.email}>
                    {employee.name} ({employee.email}) - {employee.role || '직원'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                신청자 정보
              </label>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="font-semibold text-gray-900">
                  {user?.displayName || user?.email}
                </div>
                <div className="text-sm text-gray-500">관리자 (대리 신청)</div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                연차 유형
              </label>
              <select
                value={newLeave.type}
                onChange={(e) => setNewLeave({...newLeave, type: e.target.value as '연차' | '반차' | '병가' | '기타'})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="연차">연차</option>
                <option value="반차">반차</option>
                <option value="병가">병가</option>
                <option value="기타">기타</option>
              </select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  시작일
                </label>
                <input
                  type="date"
                  value={newLeave.startDate}
                  onChange={(e) => setNewLeave({...newLeave, startDate: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  종료일
                </label>
                <input
                  type="date"
                  value={newLeave.endDate}
                  onChange={(e) => setNewLeave({...newLeave, endDate: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {calculateDays() > 0 && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-blue-800">
                  <span className="font-semibold">신청 일수:</span> {calculateDays()}일
                </p>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                사유
              </label>
              <textarea
                value={newLeave.reason}
                onChange={(e) => setNewLeave({...newLeave, reason: e.target.value})}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="연차 사유를 입력하세요"
                required
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-6">
              <button
                type="button"
                onClick={() => setNewLeave({
                  employeeId: '',
                  startDate: '',
                  endDate: '',
                  reason: '',
                  type: '연차'
                })}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                초기화
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? '신청 중...' : '대리 연차 신청'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLeaveRequest;
