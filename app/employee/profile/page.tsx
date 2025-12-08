'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const EmployeeProfile: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  interface EmployeeInfo {
    name: string;
    department: string;
    position: string;
    empNo: string;
    totalLeaves: number;
    usedLeaves: number;
    remainingLeaves: number;
    email: string;
    phone: string;
    address: string;
    joinDate: string;
    emergencyContact: string;
    emergencyName: string;
  }
  
  const [employeeInfo, setEmployeeInfo] = useState<EmployeeInfo | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  interface EditData {
    phone: string;
    email: string;
    address: string;
    emergencyContact: string;
    emergencyName: string;
  }
  
  const [editData, setEditData] = useState<EditData>({
    phone: '',
    email: '',
    address: '',
    emergencyContact: '',
    emergencyName: ''
  });
  const router = useRouter();

  useEffect(() => {
    const employeeMode = localStorage.getItem('employee_mode');
    const employeeInfoStr = localStorage.getItem('employee_info');
    
    if (employeeMode === 'true' && employeeInfoStr) {
      const info = JSON.parse(employeeInfoStr);
      setIsAuthenticated(true);
      const fullEmployeeInfo: EmployeeInfo = {
        ...info,
        email: 'kim.employee@db-info.co.kr',
        phone: '010-1234-5678',
        address: '서울특별시 강남구 테헤란로 123',
        joinDate: '2023-03-15',
        emergencyContact: '010-9876-5432',
        emergencyName: '김가족'
      };
      setEmployeeInfo(fullEmployeeInfo);
      setEditData({
        phone: '010-1234-5678',
        email: 'kim.employee@db-info.co.kr',
        address: '서울특별시 강남구 테헤란로 123',
        emergencyContact: '010-9876-5432',
        emergencyName: '김가족'
      });
    } else {
      router.push('/employee');
    }
  }, [router]);

  const handleSave = () => {
    // 실제로는 Firebase나 API로 업데이트
    if (employeeInfo) {
      const updatedInfo: EmployeeInfo = {
        ...employeeInfo,
        ...editData
      };
      setEmployeeInfo(updatedInfo);
    }
    setIsEditing(false);
    alert('개인정보가 업데이트되었습니다.');
  };

  const handleCancel = () => {
    if (employeeInfo) {
      setEditData({
        phone: employeeInfo.phone,
        email: employeeInfo.email,
        address: employeeInfo.address,
        emergencyContact: employeeInfo.emergencyContact,
        emergencyName: employeeInfo.emergencyName
      });
    }
    setIsEditing(false);
  };

  if (!isAuthenticated || !employeeInfo) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">개인 정보</h1>
                <p className="text-sm text-blue-200">개인정보 확인 및 수정</p>
              </div>
            </div>
            <button
              onClick={() => router.push('/employee')}
              className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-colors"
            >
              ← 직원 포털
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 기본 정보 */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">기본 정보</h2>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-lg font-bold">{employeeInfo.name.charAt(0)}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">이름</label>
                  <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white">
                    {employeeInfo.name}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">사원번호</label>
                  <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white">
                    {employeeInfo.empNo}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">부서</label>
                  <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white">
                    {employeeInfo.department}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">직급</label>
                  <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white">
                    {employeeInfo.position}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">입사일</label>
                <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white">
                  {employeeInfo.joinDate}
                </div>
              </div>
            </div>
          </div>

          {/* 연락처 정보 */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">연락처 정보</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg transition-colors"
              >
                {isEditing ? '편집 취소' : '편집'}
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">이메일</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData({...editData, email: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                ) : (
                  <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white">
                    {employeeInfo.email}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">휴대폰</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editData.phone}
                    onChange={(e) => setEditData({...editData, phone: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                ) : (
                  <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white">
                    {employeeInfo.phone}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">주소</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.address}
                    onChange={(e) => setEditData({...editData, address: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                ) : (
                  <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white">
                    {employeeInfo.address}
                  </div>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  저장
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 bg-gray-500/20 hover:bg-gray-500/30 text-gray-300 py-3 rounded-lg font-medium transition-colors"
                >
                  취소
                </button>
              </div>
            )}
          </div>

          {/* 비상 연락처 */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">비상 연락처</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">비상연락처 이름</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.emergencyName}
                    onChange={(e) => setEditData({...editData, emergencyName: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                ) : (
                  <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white">
                    {employeeInfo.emergencyName}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">비상연락처 번호</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editData.emergencyContact}
                    onChange={(e) => setEditData({...editData, emergencyContact: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                ) : (
                  <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white">
                    {employeeInfo.emergencyContact}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 연차 정보 */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">연차 정보</h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-500/10 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">{employeeInfo.totalLeaves}</div>
                <div className="text-sm text-gray-300">총 연차</div>
              </div>
              <div className="bg-orange-500/10 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-orange-400">{employeeInfo.usedLeaves}</div>
                <div className="text-sm text-gray-300">사용 연차</div>
              </div>
              <div className="bg-green-500/10 rounded-lg p-4 text-center col-span-2">
                <div className="text-3xl font-bold text-green-400">{employeeInfo.remainingLeaves}</div>
                <div className="text-sm text-gray-300">잔여 연차</div>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => router.push('/employee/leave-request')}
                className="w-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 py-3 rounded-lg font-medium transition-colors"
              >
                연차 신청하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;