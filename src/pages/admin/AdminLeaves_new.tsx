import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLeaves: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">연차 관리 대시보드</h1>
        <p className="text-gray-600">연차 신청과 승인을 관리할 수 있습니다.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 연차 신청 카드 */}
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">연차 신청</h2>
              <p className="text-gray-600 mt-1">관리자 연차를 신청합니다</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </div>
          <button
            onClick={() => navigate('/admin/leave-request')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            연차 신청하기
          </button>
        </div>

        {/* 연차 승인 카드 */}
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">연차 승인</h2>
              <p className="text-gray-600 mt-1">직원 연차 신청을 검토하고 승인합니다</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <button
            onClick={() => navigate('/admin/leave-approval')}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            연차 승인 관리
          </button>
        </div>
      </div>

      {/* 추가 정보 섹션 */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">연차 관리 안내</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">📝 연차 신청</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 관리자도 연차 신청이 필요합니다</li>
              <li>• 연차, 반차, 병가, 기타 유형 선택 가능</li>
              <li>• 신청 후 승인 처리됩니다</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">✅ 연차 승인</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 직원들의 연차 신청을 검토</li>
              <li>• 승인/거절 처리 가능</li>
              <li>• 실시간 상태 업데이트</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLeaves;
