import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { uploadUniqueEmployees, clearEmployees, clearLeaves } from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const AdminHome: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [uploadMessage, setUploadMessage] = useState('');
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-8 text-center">관리자 메뉴</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {/* 직원정보등록 */}
        <div className="bg-gradient-to-br from-cyan-500 to-cyan-300 shadow-lg rounded-xl p-6 flex flex-col items-center hover:scale-105 transition-transform cursor-pointer" onClick={() => navigate('/admin-employee-manage')}>
          <span className="text-white text-xl font-bold mb-2">직원정보 등록</span>
          <span className="text-white/80 text-sm">직원정보 등록, 수정, 삭제</span>
        </div>
        {/* 연차관리 */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-300 shadow-lg rounded-xl p-6 flex flex-col items-center hover:scale-105 transition-transform cursor-pointer" onClick={() => navigate('/leaves')}>
          <span className="text-white text-xl font-bold mb-2">연차관리</span>
          <span className="text-white/80 text-sm">직원 연차 신청 및 승인/반려 관리</span>
        </div>
        {/* 프로젝트관리 */}
        <div className="bg-gradient-to-br from-green-500 to-green-300 shadow-lg rounded-xl p-6 flex flex-col items-center hover:scale-105 transition-transform cursor-pointer" onClick={() => navigate('/projects')}>
          <span className="text-white text-xl font-bold mb-2">프로젝트 관리</span>
          <span className="text-white/80 text-sm">프로젝트 등록, 수정, 삭제, 조회</span>
        </div>
        {/* 직원연차정보수정 */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-300 shadow-lg rounded-xl p-6 flex flex-col items-center hover:scale-105 transition-transform cursor-pointer" onClick={() => navigate('/admin-employee-edit')}>
          <span className="text-white text-xl font-bold mb-2">직원연차정보 수정</span>
          <span className="text-white/80 text-sm">직원 사번, 이름, 연차정보 수정</span>
        </div>
        {/* 직원정보초기화 */}
        <button
          onClick={() => clearEmployees(setUploadMessage)}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl p-6 flex flex-col items-center shadow-lg transition-transform hover:scale-105"
        >
          <span className="text-xl font-bold mb-2">직원정보 초기화</span>
          <span className="text-white/80 text-sm">직원정보 전체 삭제</span>
        </button>
        {/* 직원정보업로드 */}
        <button
          onClick={() => uploadUniqueEmployees(setUploadMessage)}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl p-6 flex flex-col items-center shadow-lg transition-transform hover:scale-105"
        >
          <span className="text-xl font-bold mb-2">직원정보 업로드</span>
          <span className="text-white/80 text-sm">샘플 직원정보 일괄 업로드</span>
        </button>
        {/* 연차기록초기화 */}
        <button
          onClick={() => clearLeaves(setUploadMessage)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-xl p-6 flex flex-col items-center shadow-lg transition-transform hover:scale-105"
        >
          <span className="text-xl font-bold mb-2">연차기록 초기화</span>
          <span className="text-white/80 text-sm">연차기록 전체 삭제</span>
        </button>
      </div>
      {uploadMessage && <div className="text-center text-green-600 font-semibold mb-4">{uploadMessage}</div>}
      <div className="flex justify-center">
        <button
          className="px-6 py-2 bg-gray-300 text-gray-800 rounded-full shadow hover:bg-gray-400 font-semibold transition"
          onClick={async () => {
            await logout();
            navigate('/');
          }}
        >
          홈으로
        </button>
      </div>
    </div>
  );
};

export default AdminHome;
