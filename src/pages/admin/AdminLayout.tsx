import React, { useState } from 'react';
import { adminMenus } from './adminMenus';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

type MenuBtnProps = {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  isActive: boolean;
};

function MenuBtn({ icon, label, onClick, isActive }: MenuBtnProps) {
  return (
    <button 
      className={`
        group relative px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-3 hover-lift
        ${isActive 
          ? 'glass-strong text-white shadow-glow' 
          : 'text-brand-100 hover:glass hover:text-white border border-transparent hover:border-white/20'
        }
      `}
      onClick={onClick}
    >
      <div className={`
        transition-transform duration-300 
        ${isActive ? 'scale-110' : 'group-hover:scale-110'}
      `}>
        {icon}
      </div>
      <span className="hidden lg:block">{label}</span>
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-brand-400/20 to-accent-400/20 rounded-xl -z-10"></div>
      )}
    </button>
  );
}

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentPath = location.pathname;

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-brand-50 to-accent-50">
      {/* Premium Header */}
      <header className="bg-gradient-to-r from-neutral-900 via-brand-900 to-accent-900 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full opacity-30" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
          <div className="absolute top-0 right-0 w-96 h-32 bg-brand-400/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-0 left-0 w-80 h-32 bg-accent-400/20 rounded-full blur-3xl animate-float-delayed"></div>
        </div>

        <div className="relative z-10 px-6 py-6">
          <div className="flex items-center justify-between">
            {/* Logo & Title */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-brand-500 to-accent-500 rounded-xl flex items-center justify-center shadow-glow">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white font-display gradient-text-light">DB.INFO</h1>
                <p className="text-brand-200 text-sm font-medium">Admin Dashboard</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-2">
              {adminMenus.map(menu => {
                const Icon = menu.icon;
                const isActive = currentPath.includes(menu.to.replace('/admin/', ''));
                return (
                  <MenuBtn 
                    key={menu.label} 
                    icon={<Icon size={20} />} 
                    label={menu.label} 
                    onClick={() => navigate(menu.to)}
                    isActive={isActive}
                  />
                );
              })}
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden w-10 h-10 glass rounded-lg flex items-center justify-center text-white border border-white/20 hover-lift"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <div className={`
        lg:hidden fixed inset-0 z-50 transition-opacity duration-300
        ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
      `}>
        <div className="absolute inset-0 bg-neutral-900/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}></div>
        <div className={`
          absolute left-0 top-0 h-full w-80 glass-strong shadow-2xl transform transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-brand-500 to-accent-500 rounded-lg flex items-center justify-center shadow-glow">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-neutral-800 font-display">관리자</span>
              </div>
              <button 
                className="w-8 h-8 glass rounded-lg flex items-center justify-center text-neutral-600 hover-lift"
                onClick={() => setSidebarOpen(false)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <nav className="space-y-2">
              {adminMenus.map(menu => {
                const Icon = menu.icon;
                const isActive = currentPath.includes(menu.to.replace('/admin/', ''));
                return (
                  <button
                    key={menu.label}
                    className={`
                      w-full p-4 rounded-xl text-left transition-all duration-300 flex items-center gap-3 hover-lift
                      ${isActive 
                        ? 'bg-gradient-to-r from-brand-500 to-accent-500 text-white shadow-glow' 
                        : 'text-neutral-700 hover:glass hover:text-neutral-900'
                      }
                    `}
                    onClick={() => {
                      navigate(menu.to);
                      setSidebarOpen(false);
                    }}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{menu.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-120px)] p-6">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
