import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarCheck, FaProjectDiagram, FaUserEdit, FaUserPlus, FaTrashAlt, FaUpload, FaEraser } from 'react-icons/fa';

const topMenus = [
  {
    label: '직원관리',
    desc: '직원 정보 등록, 수정, 현황 관리',
    color: 'bg-blue-400',
    icon: <FaUserEdit size={32} className="mb-2" />,
    to: '/admin/employee-manage',
  },
  {
    label: '프로젝트관리',
    desc: '프로젝트 등록, 수정, 삭제, 조회',
    color: 'bg-green-400',
    icon: <FaProjectDiagram size={32} className="mb-2" />,
    to: '/admin/project-status',
  },
  {
    label: '연차관리',
    desc: '직원 연차 신청 및 승인/반려 관리',
    color: 'bg-cyan-400',
    icon: <FaCalendarCheck size={32} className="mb-2" />,
    to: '/admin/leaves',
  },
];
const bottomMenus = [
  {
    label: '연차정보 초기화',
    desc: '직원 연차정보 일괄 수정',
    color: 'bg-yellow-400',
    icon: <FaEraser size={32} className="mb-2" />,
    to: '/admin/employee-leave-edit',
  },
  {
    label: '사내소식관리',
    desc: '사내 소식 등록 및 관리',
    color: 'bg-indigo-400',
    icon: <FaUserPlus size={32} className="mb-2" />,
    to: '/admin/company-news-manage',
  },
];

const oneTimeMenus = [];

const AdminHome: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-2 flex flex-col items-center">
      <div className="w-full max-w-5xl mx-auto">
        <h1 className="text-3xl font-extrabold text-center text-blue-700 mb-8 tracking-wide">관리자 메뉴</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {topMenus.map((menu) => (
            <div key={menu.label} className={`${menu.color} rounded-xl shadow p-6 text-white font-bold text-lg flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition`} onClick={() => navigate(menu.to)}>
              {menu.icon}
              <span className="text-xl font-bold mb-1">{menu.label}</span>
              <span className="text-sm font-normal text-white/90">{menu.desc}</span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {bottomMenus.map((menu) => (
            <div key={menu.label} className={`${menu.color} rounded-xl shadow p-6 text-white font-bold text-lg flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition`} onClick={() => navigate(menu.to)}>
              {menu.icon}
              <span className="text-xl font-bold mb-1">{menu.label}</span>
              <span className="text-sm font-normal text-white/90">{menu.desc}</span>
            </div>
          ))}
        </div>
        <button className="bg-gray-200 px-6 py-2 rounded-full shadow text-lg font-semibold hover:bg-gray-300" onClick={() => navigate('/')}>홈으로</button>
      </div>
    </div>
  );
};

export default AdminHome;
