import React from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { adminMenus } from './admin/adminMenus';
import type { AdminMenu } from './admin/adminMenus';

const AdminHome: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-8 text-center">관리자 메뉴</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {adminMenus.map((menu: AdminMenu) => (
          <div
            key={menu.label}
            className={`shadow-lg rounded-xl p-6 flex flex-col items-center hover:scale-105 transition-transform cursor-pointer ${menu.color}`}
            onClick={() => {
              if (menu.onClick) {
                menu.onClick();
              } else {
                navigate(menu.to);
              }
            }}
          >
            {React.createElement(menu.icon as React.ElementType, { className: "text-white text-3xl mb-2" })}
            <span className="text-white text-xl font-bold mb-2">{menu.label}</span>
            <span className="text-white/80 text-sm">{menu.desc}</span>
          </div>
        ))}
      </div>
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