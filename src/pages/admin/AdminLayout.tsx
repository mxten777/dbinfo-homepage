// (잘못된 navigate 참조 제거)
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

type MenuBtnProps = {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
};

function MenuBtn({ icon, label, onClick }: MenuBtnProps) {
  return (
    <button className="admin-menu-btn" onClick={onClick}>
      {icon}
      <span>{label}</span>
    </button>
  );
}

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-700 text-white py-4 px-8 flex flex-col md:flex-row md:justify-between md:items-center shadow-lg">
        <h1 className="text-4xl font-extrabold tracking-wide mb-4 md:mb-0 flex items-center gap-3">
          <svg className="w-10 h-10 text-white drop-shadow" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          DB.INFO 관리자
        </h1>
        <nav className="flex flex-wrap gap-2 md:gap-4 items-center justify-center md:justify-end">
          <MenuBtn icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M3 6h18M3 18h18" /></svg>} label="홈" onClick={() => navigate('/admin/home')} />
          <MenuBtn icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>} label="직원관리" onClick={() => navigate('/admin/employee-manage')} />
          <MenuBtn icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 018 0v2M9 21h6a2 2 0 002-2v-2a2 2 0 00-2-2H9a2 2 0 00-2 2v2a2 2 0 002 2z" /></svg>} label="프로젝트관리" onClick={() => navigate('/admin/project-status')} />
          <MenuBtn icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /></svg>} label="대리연차신청" onClick={() => navigate('/admin/leave-request')} />
          <MenuBtn icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 17l4 4 4-4m-4-5v9" /></svg>} label="연차승인" onClick={() => navigate('/admin/leave-approval')} />
          <MenuBtn icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>} label="연차현황" onClick={() => navigate('/admin/leaves')} />
          <MenuBtn icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /></svg>} label="연차정보 초기화" onClick={() => navigate('/admin/employee-leave-edit')} />
          <MenuBtn icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>} label="사내소식관리" onClick={() => navigate('/admin/company-news-manage')} />
          <span className="hidden md:inline-block h-8 border-l border-blue-300 mx-2"></span>
        </nav>
      </header>
      {/* 메뉴 버튼 컴포넌트 */}
      <style>{`
        .admin-menu-btn {
          background: rgba(255,255,255,0.95);
          color: #2563eb;
          border-radius: 0.75rem;
          font-weight: 600;
          padding: 0.5rem 1.2rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          border: 2px solid transparent;
          transition: all 0.2s;
        }
        .admin-menu-btn:hover {
          background: #e0e7ff;
          color: #1e40af;
          border-color: #2563eb;
          box-shadow: 0 4px 16px rgba(37,99,235,0.08);
        }
      `}</style>
      {/* ...기존 코드... */}
      <main className="py-8 px-4">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
