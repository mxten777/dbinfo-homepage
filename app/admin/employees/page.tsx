'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import type { Employee } from '../../../types/employee';

const EmployeeManagement: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [firebaseConnected, setFirebaseConnected] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    position: '',
    joinDate: '',
    salary: '',
    phone: '',
    status: 'active' as 'active' | 'inactive' | 'on_leave'
  });

  useEffect(() => {
    // 관리자 인증 확인
    const adminMode = localStorage.getItem('admin_mode');
    const user = localStorage.getItem('admin_user');
    
    if (adminMode === 'true' && user) {
      setIsAuthenticated(true);
      loadEmployees();
    } else {
      router.push('/admin/login');
    }
  }, [router]);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      
      if (!db) {
        console.log('Firebase가 연결되지 않음 - 데모 데이터 사용');
        setFirebaseConnected(false);
        // 데모 데이터
        setEmployees([
          {
            id: 'demo1',
            name: '김철수',
            email: 'kim@db-info.co.kr',
            department: '개발팀',
            position: '시니어 개발자',
            joinDate: '2023-01-15',
            salary: 5500000,
            phone: '010-1234-5678',
            status: 'active'
          },
          {
            id: 'demo2',
            name: '이영희',
            email: 'lee@db-info.co.kr',
            department: '기획팀',
            position: '프로젝트 매니저',
            joinDate: '2022-08-20',
            salary: 4800000,
            phone: '010-2345-6789',
            status: 'active'
          }
        ]);
        setLoading(false);
        return;
      }

      setFirebaseConnected(true);
      console.log('Firebase에서 직원 데이터 로드 시작...');

      const employeesSnapshot = await getDocs(collection(db, 'employees'));
      const employeeList: Employee[] = [];
      
      employeesSnapshot.forEach((doc) => {
        employeeList.push({
          id: doc.id,
          ...doc.data()
        } as Employee);
      });

      setEmployees(employeeList);
      console.log(`Firebase에서 ${employeeList.length}명의 직원 데이터를 로드했습니다.`);
      
    } catch (error) {
      console.error('직원 데이터 로드 실패:', error);
      setFirebaseConnected(false);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = async () => {
    if (!firebaseConnected || !db) {
      alert('Firebase가 연결되지 않았습니다. 데모 모드에서는 추가할 수 없습니다.');
      return;
    }

    try {
      const newEmployee = {
        ...formData,
        salary: parseInt(formData.salary),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, 'employees'), newEmployee);
      console.log('새 직원 추가됨:', docRef.id);
      
      resetForm();
      loadEmployees();
      alert('직원이 성공적으로 추가되었습니다!');
    } catch (error) {
      console.error('직원 추가 실패:', error);
      alert('직원 추가에 실패했습니다.');
    }
  };

  const handleUpdateEmployee = async () => {
    if (!firebaseConnected || !db || !editingEmployee || !editingEmployee.id) {
      alert('Firebase가 연결되지 않았습니다.');
      return;
    }

    try {
      const updatedEmployee = {
        ...formData,
        salary: parseInt(formData.salary),
        updatedAt: new Date().toISOString()
      };

      await updateDoc(doc(db, 'employees', editingEmployee.id), updatedEmployee);
      console.log('직원 정보 업데이트됨:', editingEmployee.id);
      
      resetForm();
      loadEmployees();
      alert('직원 정보가 성공적으로 수정되었습니다!');
    } catch (error) {
      console.error('직원 정보 수정 실패:', error);
      alert('직원 정보 수정에 실패했습니다.');
    }
  };

  const handleDeleteEmployee = async (employeeId: string) => {
    if (!firebaseConnected || !db) {
      alert('Firebase가 연결되지 않았습니다. 데모 모드에서는 삭제할 수 없습니다.');
      return;
    }

    if (!confirm('정말로 이 직원을 삭제하시겠습니까?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'employees', employeeId));
      console.log('직원 삭제됨:', employeeId);
      
      loadEmployees();
      alert('직원이 성공적으로 삭제되었습니다!');
    } catch (error) {
      console.error('직원 삭제 실패:', error);
      alert('직원 삭제에 실패했습니다.');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      department: '',
      position: '',
      joinDate: '',
      salary: '',
      phone: '',
      status: 'active'
    });
    setShowAddForm(false);
    setEditingEmployee(null);
  };

  const startEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name,
      email: employee.email,
      department: employee.department,
      position: employee.position,
      joinDate: employee.joinDate,
      salary: employee.salary.toString(),
      phone: employee.phone,
      status: employee.status
    });
    setShowAddForm(true);
  };

  if (!isAuthenticated) {
    return <div>인증 확인 중...</div>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">직원 데이터를 로드하는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">직원 관리</h1>
              <div className="flex items-center mt-2">
                <div className={`w-3 h-3 rounded-full ${firebaseConnected ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
                <p className="text-gray-600">
                  {firebaseConnected ? 'Firebase 연결됨' : '데모 모드 (Firebase 연결 안됨)'}
                </p>
              </div>
            </div>
            <div className="space-x-3">
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                대시보드로
              </button>
              <button
                onClick={() => setShowAddForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                + 직원 추가
              </button>
            </div>
          </div>
        </div>

        {/* 직원 추가/수정 폼 */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {editingEmployee ? '직원 정보 수정' : '새 직원 추가'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="이름"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="이메일"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="부서"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="직급"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                placeholder="입사일"
                value={formData.joinDate}
                onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="급여"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="tel"
                placeholder="전화번호"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' | 'on_leave' })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">활성</option>
                <option value="inactive">비활성</option>
                <option value="on_leave">휴직</option>
              </select>
            </div>
            <div className="mt-4 space-x-3">
              <button
                onClick={editingEmployee ? handleUpdateEmployee : handleAddEmployee}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingEmployee ? '수정하기' : '추가하기'}
              </button>
              <button
                onClick={resetForm}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                취소
              </button>
            </div>
          </div>
        )}

        {/* 직원 목록 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h2 className="text-xl font-bold text-gray-800">
              직원 목록 ({employees.length}명)
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이름</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">부서</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">직급</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">입사일</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">급여</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작업</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                        <div className="text-sm text-gray-500">{employee.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.position}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.joinDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        employee.status === 'active' ? 'bg-green-100 text-green-800' :
                        employee.status === 'inactive' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {employee.status === 'active' ? '활성' : 
                         employee.status === 'inactive' ? '비활성' : '휴직'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₩ {employee.salary.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                      <button
                        onClick={() => startEdit(employee)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDeleteEmployee(employee.id)}
                        className="text-red-600 hover:text-red-900"
                        disabled={!firebaseConnected}
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {employees.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                등록된 직원이 없습니다.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeManagement;