'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import type { Employee } from '../../../types/employee';

interface DeputyRequest {
  id?: string;
  requesterId: string;
  requesterName: string;
  requesterDepartment: string;
  deputyId: string;
  deputyName: string;
  deputyDepartment: string;
  startDate: string;
  endDate: string;
  reason: string;
  taskDescription: string;
  urgency: 'high' | 'medium' | 'low';
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
  approvedBy?: string;
  approvedDate?: string;
  rejectionReason?: string;
  notes?: string;
}

const DeputyRequestPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<DeputyRequest[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [firebaseConnected, setFirebaseConnected] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRequest] = useState<DeputyRequest | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterUrgency, setFilterUrgency] = useState<string>('all');
  const router = useRouter();

  const [formData, setFormData] = useState({
    requesterId: '',
    deputyId: '',
    startDate: '',
    endDate: '',
    reason: '',
    taskDescription: '',
    urgency: 'medium' as 'high' | 'medium' | 'low'
  });

  useEffect(() => {
    const adminMode = localStorage.getItem('admin_mode');
    const user = localStorage.getItem('admin_user');
    
    const loadData = async () => {
      try {
        setLoading(true);
        await Promise.all([loadRequests(), loadEmployees()]);
      } catch (error) {
        console.error('데이터 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    if (adminMode === 'true' && user) {
      setIsAuthenticated(true);
      loadData();
    } else {
      router.push('/admin/login');
    }
    setLoading(false);
  }, [router]);

  const loadRequests = async () => {
    try {
      if (!db) {
        console.log('Firebase가 연결되지 않음 - 데모 데이터 사용');
        setFirebaseConnected(false);
        // 데모 대리자 요청 데이터
        setRequests([
          {
            id: 'demo1',
            requesterId: 'demo1',
            requesterName: '김철수',
            requesterDepartment: '개발팀',
            deputyId: 'demo2',
            deputyName: '이영희',
            deputyDepartment: '기획팀',
            startDate: '2024-10-15',
            endDate: '2024-10-17',
            reason: '출장',
            taskDescription: '주간 프로젝트 미팅 참석 및 진행사항 보고',
            urgency: 'high',
            status: 'pending',
            requestDate: '2024-10-08T10:00:00Z'
          },
          {
            id: 'demo2',
            requesterId: 'demo2',
            requesterName: '이영희',
            requesterDepartment: '기획팀',
            deputyId: 'demo1',
            deputyName: '김철수',
            deputyDepartment: '개발팀',
            startDate: '2024-10-20',
            endDate: '2024-10-22',
            reason: '연차',
            taskDescription: '클라이언트 요구사항 문서 검토 및 피드백',
            urgency: 'medium',
            status: 'approved',
            requestDate: '2024-10-05T14:30:00Z',
            approvedBy: 'admin',
            approvedDate: '2024-10-06T09:00:00Z'
          },
          {
            id: 'demo3',
            requesterId: 'demo1',
            requesterName: '김철수',
            requesterDepartment: '개발팀',
            deputyId: 'demo3',
            deputyName: '박민수',
            deputyDepartment: '개발팀',
            startDate: '2024-10-25',
            endDate: '2024-10-26',
            reason: '병가',
            taskDescription: '코드 리뷰 및 버그 수정',
            urgency: 'low',
            status: 'rejected',
            requestDate: '2024-10-03T11:20:00Z',
            approvedBy: 'admin',
            approvedDate: '2024-10-04T16:00:00Z',
            rejectionReason: '대리자가 같은 기간에 다른 업무로 바쁨'
          }
        ]);
        return;
      }

      setFirebaseConnected(true);
      console.log('Firebase에서 대리자 요청 데이터 로드 시작...');

      const requestsQuery = query(collection(db, 'deputy_requests'), orderBy('requestDate', 'desc'));
      const requestsSnapshot = await getDocs(requestsQuery);
      const requestsList: DeputyRequest[] = [];
      
      requestsSnapshot.forEach((doc) => {
        requestsList.push({
          id: doc.id,
          ...doc.data()
        } as DeputyRequest);
      });

      setRequests(requestsList);
      console.log(`Firebase에서 ${requestsList.length}개의 대리자 요청을 로드했습니다.`);
      
    } catch (error) {
      console.error('대리자 요청 데이터 로드 실패:', error);
      setFirebaseConnected(false);
    }
  };

  const loadEmployees = async () => {
    try {
      if (!db) {
        // 데모 직원 데이터
        setEmployees([
          { id: 'demo1', empNo: 'EMP001', name: '김철수', email: 'kim@db-info.co.kr', department: '개발팀', position: '시니어 개발자', joinDate: '2023-01-15', phone: '010-1234-5678', salary: 5500000, status: 'active' },
          { id: 'demo2', empNo: 'EMP002', name: '이영희', email: 'lee@db-info.co.kr', department: '기획팀', position: '프로젝트 매니저', joinDate: '2022-08-20', phone: '010-2345-6789', salary: 4800000, status: 'active' },
          { id: 'demo3', empNo: 'EMP003', name: '박민수', email: 'park@db-info.co.kr', department: '개발팀', position: '주니어 개발자', joinDate: '2023-03-10', phone: '010-3456-7890', salary: 4200000, status: 'active' }
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
  const handleAddRequest = async () => {
    if (!firebaseConnected || !db) {
      alert('Firebase가 연결되지 않았습니다. 데모 모드에서는 추가할 수 없습니다.');
      return;
    }

    try {
      const requester = employees.find(emp => emp.id === formData.requesterId);
      const deputy = employees.find(emp => emp.id === formData.deputyId);
      
      if (!requester || !deputy) {
        alert('신청자와 대리자를 모두 선택해주세요.');
        return;
      }

      const newRequest = {
        ...formData,
        requesterName: requester.name,
        requesterDepartment: requester.department,
        deputyName: deputy.name,
        deputyDepartment: deputy.department,
        status: 'pending' as const,
        requestDate: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, 'deputy_requests'), newRequest);
      console.log('새 대리자 요청 추가됨:', docRef.id);
      
      resetForm();
      window.location.reload(); // 데이터 새로고침
      alert('대리자 요청이 성공적으로 추가되었습니다!');
    } catch (error) {
      console.error('대리자 요청 추가 실패:', error);
      alert('대리자 요청 추가에 실패했습니다.');
    }
  };

  const handleApproveRequest = async (requestId: string) => {
    if (!firebaseConnected || !db) {
      alert('Firebase가 연결되지 않았습니다.');
      return;
    }

    try {
      await updateDoc(doc(db, 'deputy_requests', requestId), {
        status: 'approved',
        approvedBy: localStorage.getItem('admin_user') || 'admin',
        approvedDate: new Date().toISOString()
      });

      window.location.reload(); // 데이터 새로고침
      alert('대리자 요청이 승인되었습니다!');
    } catch (error) {
      console.error('대리자 요청 승인 실패:', error);
      alert('대리자 요청 승인에 실패했습니다.');
    }
  };

  const handleRejectRequest = async (requestId: string, reason: string) => {
    if (!firebaseConnected || !db) {
      alert('Firebase가 연결되지 않았습니다.');
      return;
    }

    try {
      await updateDoc(doc(db, 'deputy_requests', requestId), {
        status: 'rejected',
        approvedBy: localStorage.getItem('admin_user') || 'admin',
        approvedDate: new Date().toISOString(),
        rejectionReason: reason
      });

      window.location.reload(); // 데이터 새로고침
      alert('대리자 요청이 반려되었습니다!');
    } catch (error) {
      console.error('대리자 요청 반려 실패:', error);
      alert('대리자 요청 반려에 실패했습니다.');
    }
  };

  const handleDeleteRequest = async (requestId: string) => {
    if (!firebaseConnected || !db) {
      alert('Firebase가 연결되지 않았습니다.');
      return;
    }

    if (confirm('정말로 이 대리자 요청을 삭제하시겠습니까?')) {
      try {
        await deleteDoc(doc(db, 'deputy_requests', requestId));
        window.location.reload(); // 데이터 새로고침
        alert('대리자 요청이 삭제되었습니다!');
      } catch (error) {
        console.error('대리자 요청 삭제 실패:', error);
        alert('대리자 요청 삭제에 실패했습니다.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      requesterId: '',
      deputyId: '',
      startDate: '',
      endDate: '',
      reason: '',
      taskDescription: '',
      urgency: 'medium'
    });
    setShowAddForm(false);
  };

  const filteredRequests = requests.filter(request => {
    if (filterStatus !== 'all' && request.status !== filterStatus) return false;
    if (filterUrgency !== 'all' && request.urgency !== filterUrgency) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">대리자 요청을 로드하는 중...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 lg:px-6 py-8">
        {/* 헤더 */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 lg:p-6 mb-6 lg:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 lg:w-7 lg:h-7 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-white">대리자 요청 관리</h1>
                <div className="flex items-center gap-2 mt-1">
                  <div className={`w-2 h-2 rounded-full ${firebaseConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <p className="text-xs lg:text-sm text-blue-200">
                    {firebaseConnected ? 'Firebase 연결됨' : '데모 모드'} • {requests.length}개 요청
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAddForm(true)}
                className="px-3 py-1.5 lg:px-4 lg:py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 hover:text-cyan-200 rounded-lg transition-all duration-200 border border-cyan-500/30 text-sm"
              >
                + 요청
              </button>
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="px-3 py-1.5 lg:px-4 lg:py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 hover:text-blue-200 rounded-lg transition-all duration-200 border border-blue-500/30 text-sm"
              >
                ← 대시보드
              </button>
            </div>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 lg:p-4 border border-white/20">
            <div className="text-center">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <svg className="w-5 h-5 lg:w-6 lg:h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="text-xl lg:text-2xl font-bold text-white">{requests.length}</div>
              <div className="text-xs lg:text-sm text-blue-200">전체 요청</div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 lg:p-4 border border-white/20">
            <div className="text-center">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <svg className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-xl lg:text-2xl font-bold text-white">{requests.filter(r => r.status === 'pending').length}</div>
              <div className="text-xs lg:text-sm text-blue-200">대기 중</div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 lg:p-4 border border-white/20">
            <div className="text-center">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <svg className="w-5 h-5 lg:w-6 lg:h-6 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="text-xl lg:text-2xl font-bold text-white">{requests.filter(r => r.status === 'approved').length}</div>
              <div className="text-xs lg:text-sm text-blue-200">승인됨</div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 lg:p-4 border border-white/20">
            <div className="text-center">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-red-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <svg className="w-5 h-5 lg:w-6 lg:h-6 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div className="text-xl lg:text-2xl font-bold text-white">{requests.filter(r => r.status === 'rejected').length}</div>
              <div className="text-xs lg:text-sm text-blue-200">반려됨</div>
            </div>
          </div>
        </div>

        {/* 대리자 요청 폼 */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">새 대리자 요청</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={formData.requesterId}
                onChange={(e) => setFormData({ ...formData, requesterId: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">신청자 선택</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name} ({employee.department})
                  </option>
                ))}
              </select>
              <select
                value={formData.deputyId}
                onChange={(e) => setFormData({ ...formData, deputyId: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">대리자 선택</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name} ({employee.department})
                  </option>
                ))}
              </select>
              <input
                type="date"
                placeholder="시작일"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                placeholder="종료일"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="사유"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={formData.urgency}
                onChange={(e) => setFormData({ ...formData, urgency: e.target.value as 'high' | 'medium' | 'low' })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">낮음</option>
                <option value="medium">보통</option>
                <option value="high">높음</option>
              </select>
              <textarea
                placeholder="업무 설명"
                value={formData.taskDescription}
                onChange={(e) => setFormData({ ...formData, taskDescription: e.target.value })}
                rows={3}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2"
              />
            </div>
            <div className="mt-4 space-x-3">
              <button
                onClick={handleAddRequest}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                요청하기
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

        {/* 필터 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-4">
            <label className="text-gray-700 font-medium">상태:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">전체</option>
              <option value="pending">대기 중</option>
              <option value="approved">승인됨</option>
              <option value="rejected">반려됨</option>
            </select>
            <label className="text-gray-700 font-medium ml-4">긴급도:</label>
            <select
              value={filterUrgency}
              onChange={(e) => setFilterUrgency(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">전체</option>
              <option value="high">높음</option>
              <option value="medium">보통</option>
              <option value="low">낮음</option>
            </select>
          </div>
        </div>

        {/* 대리자 요청 목록 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h2 className="text-xl font-bold text-gray-800">
              대리자 요청 목록 ({filteredRequests.length}건)
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">신청자</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">대리자</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">기간</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">사유</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">긴급도</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">작업</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{request.requesterName}</div>
                      <div className="text-sm text-gray-500">{request.requesterDepartment}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{request.deputyName}</div>
                      <div className="text-sm text-gray-500">{request.deputyDepartment}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {request.startDate} ~ {request.endDate}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                      <div className="truncate">{request.reason}</div>
                      <div className="text-xs text-gray-500 truncate">{request.taskDescription}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        request.urgency === 'high' ? 'bg-red-100 text-red-800' :
                        request.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {request.urgency === 'high' ? '높음' : 
                         request.urgency === 'medium' ? '보통' : '낮음'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        request.status === 'approved' ? 'bg-green-100 text-green-800' :
                        request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {request.status === 'approved' ? '승인됨' : 
                         request.status === 'rejected' ? '반려됨' : '대기 중'}
                      </span>
                      {request.rejectionReason && (
                        <div className="text-xs text-gray-500 mt-1">
                          반려사유: {request.rejectionReason}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                      {request.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApproveRequest(request.id!)}
                            className="text-green-600 hover:text-green-900"
                            disabled={!firebaseConnected}
                          >
                            승인
                          </button>
                          <button
                            onClick={() => {
                              const reason = prompt('반려 사유를 입력해주세요:');
                              if (reason) handleRejectRequest(request.id!, reason);
                            }}
                            className="text-red-600 hover:text-red-900"
                            disabled={!firebaseConnected}
                          >
                            반려
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDeleteRequest(request.id!)}
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
            {filteredRequests.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                등록된 대리자 요청이 없습니다.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeputyRequestPage;