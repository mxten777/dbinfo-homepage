'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { collection, getDocs, addDoc, updateDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import type { Leave, Employee } from '../../../types/employee';

const LeavesManagePage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [firebaseConnected, setFirebaseConnected] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterStatus] = useState<string>('all');
  const router = useRouter();

  const [formData, setFormData] = useState({
    employeeId: '',
    employeeName: '',
    name: '',
    startDate: '',
    endDate: '',
    reason: '',
    type: '연차' as '연차' | '병가' | '경조사' | '기타',
    days: 1
  });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      await Promise.all([loadLeaves(), loadEmployees()]);
    } catch (error) {
      console.error('데이터 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const adminMode = localStorage.getItem('admin_mode');
    const user = localStorage.getItem('admin_user');
    
    if (adminMode === 'true' && user) {
      setIsAuthenticated(true);
      loadData();
    } else {
      router.push('/admin/login');
    }
    setLoading(false);
  }, [router, loadData]);

  const loadLeaves = async () => {
    try {
      if (!db) {
        console.log('Firebase가 연결되지 않음 - 데모 데이터 사용');
        setFirebaseConnected(false);
        // 데모 연차 데이터
        setLeaves([
          {
            id: 'demo1',
            employeeId: 'demo1',
            employeeName: '김철수',
            name: '김철수',
            startDate: '2024-10-15',
            endDate: '2024-10-16',
            reason: '개인사유',
            type: '연차',
            status: '신청',
            days: 2,
            createdAt: '2024-10-08T10:00:00Z'
          },
          {
            id: 'demo2',
            employeeId: 'demo2',
            employeeName: '이영희',
            name: '이영희',
            startDate: '2024-10-20',
            endDate: '2024-10-22',
            reason: '가족 여행',
            type: '연차',
            status: '승인',
            days: 3,
            createdAt: '2024-10-07T14:30:00Z',
            approvedAt: '2024-10-07T15:00:00Z',
            approvedBy: 'admin'
          }
        ]);
        return;
      }

      setFirebaseConnected(true);
      console.log('Firebase에서 연차 데이터 로드 시작...');

      const leavesQuery = query(collection(db, 'leaves'), orderBy('createdAt', 'desc'));
      const leavesSnapshot = await getDocs(leavesQuery);
      const leavesList: Leave[] = [];
      
      leavesSnapshot.forEach((doc) => {
        leavesList.push({
          id: doc.id,
          ...doc.data()
        } as Leave);
      });

      setLeaves(leavesList);
      console.log(`Firebase에서 ${leavesList.length}개의 연차 데이터를 로드했습니다.`);
      
    } catch (error) {
      console.error('연차 데이터 로드 실패:', error);
      setFirebaseConnected(false);
    }
  };

  const loadEmployees = async () => {
    try {
      if (!db) {
        // 데모 직원 데이터
        setEmployees([
          { id: 'demo1', name: '김철수', email: 'kim@db-info.co.kr', department: '개발팀', position: '시니어 개발자', joinDate: '2023-01-15', phone: '010-1234-5678', salary: 5500000, status: 'active' },
          { id: 'demo2', name: '이영희', email: 'lee@db-info.co.kr', department: '기획팀', position: '프로젝트 매니저', joinDate: '2022-08-20', phone: '010-2345-6789', salary: 4800000, status: 'active' }
        ]);
        return;
      }

      const employeesSnapshot = await getDocs(collection(db, 'employees'));
      const employeesList: Employee[] = [];
      
      employeesSnapshot.forEach((doc) => {
        employeesList.push({
          id: doc.id,
          ...doc.data()
        } as Employee);
      });

      setEmployees(employeesList);
      
    } catch (error) {
      console.error('직원 데이터 로드 실패:', error);
    }
  };

  // Firebase 연동 함수들
  const handleAddLeave = async () => {
    if (!firebaseConnected || !db) {
      alert('Firebase가 연결되지 않았습니다. 데모 모드에서는 추가할 수 없습니다.');
      return;
    }

    try {
      const selectedEmployee = employees.find(emp => emp.id === formData.employeeId);
      if (!selectedEmployee) {
        alert('직원을 선택해주세요.');
        return;
      }

      const newLeave = {
        ...formData,
        employeeName: selectedEmployee.name,
        name: selectedEmployee.name,
        status: '신청' as const,
        createdAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, 'leaves'), newLeave);
      console.log('새 연차 신청 추가됨:', docRef.id);
      
      resetForm();
      loadLeaves();
      alert('연차 신청이 성공적으로 추가되었습니다!');
    } catch (error) {
      console.error('연차 신청 추가 실패:', error);
      alert('연차 신청 추가에 실패했습니다.');
    }
  };

  const handleApproveLeave = async (leaveId: string) => {
    if (!firebaseConnected || !db) {
      alert('Firebase가 연결되지 않았습니다.');
      return;
    }

    try {
      await updateDoc(doc(db, 'leaves', leaveId), {
        status: '승인',
        approvedAt: new Date().toISOString(),
        approvedBy: localStorage.getItem('admin_user') || 'admin'
      });

      loadLeaves();
      alert('연차 신청이 승인되었습니다!');
    } catch (error) {
      console.error('연차 승인 실패:', error);
      alert('연차 승인에 실패했습니다.');
    }
  };

  const resetForm = () => {
    setFormData({
      employeeId: '',
      employeeName: '',
      name: '',
      startDate: '',
      endDate: '',
      reason: '',
      type: '연차',
      days: 1
    });
    setShowAddForm(false);
  };

  const filteredLeaves = leaves.filter(leave => {
    if (filterStatus === 'all') return true;
    return leave.status === filterStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">연차 데이터를 로드하는 중...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">연차 관리</h1>
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
                + 연차 신청
              </button>
            </div>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">전체 신청</p>
                <p className="text-2xl font-bold text-gray-800">{leaves.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">대기 중</p>
                <p className="text-2xl font-bold text-gray-800">{leaves.filter(l => l.status === '신청').length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">승인됨</p>
                <p className="text-2xl font-bold text-gray-800">{leaves.filter(l => l.status === '승인').length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">반려됨</p>
                <p className="text-2xl font-bold text-gray-800">{leaves.filter(l => l.status === '반려').length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 연차 신청 폼 */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">새 연차 신청</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={formData.employeeId}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">직원 선택</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name} ({employee.department})
                  </option>
                ))}
              </select>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as '연차' | '병가' | '경조사' | '기타' })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="연차">연차</option>
                <option value="병가">병가</option>
                <option value="경조사">경조사</option>
                <option value="기타">기타</option>
              </select>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="사유"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2"
              />
            </div>
            <div className="mt-4 space-x-3">
              <button
                onClick={handleAddLeave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                신청하기
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

        {/* 연차 목록 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h2 className="text-xl font-bold text-gray-800">
              연차 신청 목록 ({filteredLeaves.length}건)
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">직원</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">종류</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">기간</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">사유</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">작업</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLeaves.map((leave) => (
                  <tr key={leave.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {leave.employeeName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        {leave.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {leave.startDate} ~ {leave.endDate} ({leave.days}일)
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {leave.reason}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        leave.status === '승인' ? 'bg-green-100 text-green-800' :
                        leave.status === '반려' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {leave.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                      {leave.status === '신청' && (
                        <button
                          onClick={() => handleApproveLeave(leave.id!)}
                          className="text-green-600 hover:text-green-900"
                          disabled={!firebaseConnected}
                        >
                          승인
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredLeaves.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                등록된 연차 신청이 없습니다.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeavesManagePage;