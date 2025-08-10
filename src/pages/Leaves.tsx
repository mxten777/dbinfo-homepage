import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from '../AuthContext';
import type { Leave, Employee } from '../types/employee';

// newLeave 타입 명확화 (파일 상단에 한 번만 선언)
type NewLeaveType = {
  startDate: string;
  endDate: string;
  reason: string;
  type: '연차' | '반차' | '병가' | '기타';
  employeeId?: string;
  employeeName?: string;
  name?: string;
  email?: string;
  days?: number;
};

const Leaves: React.FC = () => {
  // 연차 일수 자동 계산 함수
  const calculateLeaveDays = (start: string, end: string, type: string) => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diff = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24) + 1;
    if (type === '반차') return 0.5;
    return diff;
  };
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLeave2, setNewLeave2] = useState<NewLeaveType>({
    startDate: '',
    endDate: '',
    reason: '',
    type: '연차',
    days: 0
  });

  // 중복 선언 제거됨
  const { user } = useAuth();
  const [employee, setEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    // 로그인한 직원 정보 가져오기
    const fetchEmployee = async () => {
      const employeesSnap = await getDocs(collection(db, 'employees'));
      const empDoc = employeesSnap.docs.find(doc => doc.data().uid === user?.uid);
      if (empDoc) setEmployee({ id: empDoc.id, ...empDoc.data() } as Employee);
    };
    if (user?.uid) fetchEmployee();
  }, [user]);

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

      setEmployees(employeesData);
      // 직원 본인 연차만 필터링
      if (user?.uid) {
        setLeaves(leavesData.filter(l => l.employeeId === user.uid));
      } else {
        setLeaves([]);
      }
    } catch (error) {
      console.error('데이터 로드 실패:', error);
      setMessage('데이터 로드에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleStatusChange = async (leaveId: string, newStatus: '승인' | '반려' | '신청') => {
    try {
      await updateDoc(doc(db, 'leaves', leaveId), {
        status: newStatus
      });
      console.log(`[updateDoc] leave status 변경 성공: ${leaveId} → ${newStatus}`);

      // 승인일 때 직원 usedLeaves/remainingLeaves 반영 (관리자 승인과 동일하게)
      if (newStatus === '승인') {
        const leave = leaves.find(l => l.id === leaveId);
        if (leave) {
          const days = leave.type === '반차' ? 0.5 : calculateLeaveDays(leave.startDate, leave.endDate, leave.type);
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
      }

      setLeaves(prev => 
        prev.map(leave => 
          leave.id === leaveId 
            ? { ...leave, status: newStatus }
            : leave
        )
      );

      // 승인/반려 후 직원/연차 데이터 재조회
      await fetchData();

      setMessage(`연차 신청이 ${newStatus}되었습니다.`);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('[updateDoc] 상태 변경 실패:', error);
      setMessage('상태 변경에 실패했습니다.');
    }
  };


  const handleAddLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employee || !newLeave2.startDate || !newLeave2.endDate || !newLeave2.reason) {
      setMessage('모든 필드를 입력해주세요.');
      return;
    }
    try {
        const leaveData: Leave = {
          id: '',
          employeeId: employee.uid ?? '',
          employeeName: employee.name,
          name: employee.name,
          startDate: newLeave2.startDate,
          endDate: newLeave2.endDate,
          reason: newLeave2.reason,
          type: newLeave2.type,
          status: '신청',
          days: calculateLeaveDays(newLeave2.startDate, newLeave2.endDate, newLeave2.type),
          isAdminRequest: false,
          createdAt: Date.now(),
      };
      const docRef = await addDoc(collection(db, 'leaves'), leaveData);
      setLeaves(prev => [...prev, { ...leaveData, id: docRef.id }]);
      setMessage('연차 신청이 성공적으로 등록되었습니다.');
      setShowAddForm(false);
      setNewLeave2({
        startDate: '',
        endDate: '',
        reason: '',
        type: '연차',
        employeeId: '',
        employeeName: '',
        name: '',
        email: '',
        days: 0
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

        {/* 연차 요약 카드 */}
        {employee && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white shadow rounded-lg p-4 text-center">
              <div className="text-sm text-gray-500 mb-1">총 연차</div>
              <div className="text-2xl font-bold text-blue-700">{employee.totalLeaves ?? 0}일</div>
            </div>
            <div className="bg-white shadow rounded-lg p-4 text-center">
              <div className="text-sm text-gray-500 mb-1">사용 연차</div>
              <div className="text-2xl font-bold text-green-600">{employee.usedLeaves ?? 0}일</div>
            </div>
            <div className="bg-white shadow rounded-lg p-4 text-center">
              <div className="text-sm text-gray-500 mb-1">잔여 연차</div>
              <div className="text-2xl font-bold text-cyan-600">{employee.remainingLeaves ?? 0}일</div>
            </div>
          </div>
        )}

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
                    연차 유형 *
                  </label>
                  <select
                    value={newLeave2.type}
                    onChange={(e) => setNewLeave2(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="연차">연차</option>
                    <option value="반차">반차</option>
                    <option value="병가">병가</option>
                    <option value="기타">기타</option>
                  </select>
                </div>

                <div>
                {/* 직원 선택 드롭다운 제거됨 */}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    종료일 *
                  </label>
                  <input
                    type="date"
                    value={newLeave2.endDate}
                    onChange={(e) => {
                      const endDate = e.target.value;
                      setNewLeave2(prev => ({
                        ...prev,
                        endDate,
                        days: calculateLeaveDays(prev.startDate, endDate, prev.type)
                      }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  {/* 신청 일수 입력 필드 바로 아래에 표시 */}
                  <div className="mt-2 text-blue-700 font-bold text-base">
                    신청 일수: {calculateLeaveDays(newLeave2.startDate, newLeave2.endDate, newLeave2.type)}일
                    {newLeave2.type === '반차' && <span className="text-xs text-gray-500 ml-2">(반차는 0.5일로 계산)</span>}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  신청 사유 *
                </label>
                <textarea
                  value={newLeave2.reason}
                  onChange={(e) => setNewLeave2(prev => ({ ...prev, reason: e.target.value }))}
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">직원정보</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">유형 / 기간</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">사유</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">신청일</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">상태</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">관리</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaves.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">연차 신청 내역이 없습니다.</td>
                  </tr>
                ) : (
                  leaves.map((leave) => (
                    <tr key={leave.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="font-semibold text-gray-900">{employee?.name}</div>
                          <div className="text-sm text-gray-500">{employee?.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex flex-col">
                          <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                            leave.type === '연차' ? 'bg-blue-100 text-blue-700' :
                            leave.type === '반차' ? 'bg-green-100 text-green-700' :
                            leave.type === '병가' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {leave.type || '연차'}
                          </span>
                          <span className="text-xs text-gray-500 mt-1">{leave.createdAt ? new Date(leave.createdAt).toLocaleDateString('ko-KR') : `${leave.startDate} ~ ${leave.endDate}`}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{leave.reason}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{leave.createdAt ? new Date(leave.createdAt).toLocaleDateString('ko-KR') : '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          leave.status === '승인' 
                            ? 'bg-green-100 text-green-800'
                            : leave.status === '반려'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {leave.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {leave.status === '신청' && (
                          <button
                            onClick={() => leave.id ? handleStatusChange(leave.id, '반려') : undefined}
                            className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded text-xs font-medium"
                          >
                            신청 취소
                          </button>
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