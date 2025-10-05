import React from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { adminMenus } from './admin/adminMenus';
import type { AdminMenu } from './admin/adminMenus';

const AdminHome: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h2 className="text-3xl font-extrabold mb-10 text-center text-primary-dark tracking-tight">관리자 메뉴</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-12">
        {adminMenus
          .filter(menu => menu.label !== '직원등록' && menu.label !== '연차정보 초기화')
          .map((menu: AdminMenu) => (
            <button
              key={menu.label}
              className={`group shadow-2xl rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-200 ${menu.color} hover:scale-105 hover:shadow-accent/40`}
              onClick={() => {
                if (menu.onClick) {
                  menu.onClick();
                } else {
                  navigate(menu.to);
                }
              }}
              tabIndex={0}
              role="menuitem"
              aria-label={`관리자 메뉴: ${menu.label}`}
            >
              {React.createElement(menu.icon as React.ElementType, { className: "text-white text-4xl mb-3" })}
              <span className="text-white font-extrabold mb-2 text-lg md:text-xl group-hover:underline">{menu.label}</span>
              <span className="text-white/80 text-sm md:text-base text-center">{menu.desc}</span>
            </button>
          ))}
      </div>
      <div className="flex flex-col items-center gap-3 mb-10">
        <button
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold shadow hover:scale-105 hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent"
          onClick={() => navigate('/admin/employee-manage')}
          aria-label="직원등록 (직원관리에서 통합)"
        >
          직원등록 (직원관리에서 통합)
        </button>
        <button
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold shadow hover:scale-105 hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent"
          onClick={() => navigate('/admin/employee-manage')}
          aria-label="연차초기화 (직원관리에서 통합)"
        >
          연차초기화 (직원관리에서 통합)
        </button>
      </div>
      <div className="flex justify-center">
        <button
          className="px-8 py-3 bg-gray-300 text-gray-800 rounded-full shadow hover:bg-gray-400 font-semibold transition focus:outline-none focus:ring-2 focus:ring-accent"
          onClick={async () => {
            await logout();
            navigate('/');
          }}
          aria-label="홈으로"
        >
          홈으로
        </button>
      </div>
    </div>
  );
};
export default AdminHome;