import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  
  // 스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 관리자/프로젝트 현황 화면에서 네비게이션 비활성화
  const isAdminScreen = ['/admin', '/admin-home', '/leaves', '/projects', '/project-list'].includes(location.pathname);
  // 프로젝트 현황 화면에서 모든 메뉴 비활성화 (홈만 예외)
  const isProjectListScreen = location.pathname === '/project-list';
  // 관리자 로그인 화면에서 프로젝트, 관리자로그인, 직원로그인 메뉴도 비활성화
  const isLoginScreen = location.pathname === '/admin';
  
  const { user, loading } = useAuth();
  // 관리자 이메일 예시
  const isAdmin = user && (user.email === 'west@naver.com' || user.email === 'hankjae@naver.com');

  // [자동 로그아웃] 관리자가 홈(/) 경로에 접근하면 자동 로그아웃
  useEffect(() => {
    if (user && isAdmin && window.location.pathname === '/') {
      // 로그아웃 후 새로고침 (firebaseConfig에서 auth 사용)
      import('../firebaseConfig').then(mod => {
        mod.auth.signOut();
        window.location.reload();
      });
    }
  }, [user, isAdmin]);

  // 직원 로그인 경로(직원 로그인/직원 홈) 또는 user가 있고 관리자 이메일이지만 직원 로그인 경로로 진입한 경우에도 직원 메뉴만 노출
  const isEmployeeMode = ['/employee-login', '/employee-home'].includes(location.pathname);
  // /admin/로 시작하는 모든 경로에서 관리자 메뉴 강제 노출
  const isAdminPage = location.pathname.startsWith('/admin/');
  
  let navLinks = null;
  if (loading) {
    navLinks = <div className="animate-pulse text-slate-500">로딩중...</div>;
  } else if (isEmployeeMode) {
    navLinks = (
      <>
        <Link to="/" className="nav-link">홈</Link>
        <Link to="/employee-home" className="nav-link">직원홈</Link>
      </>
    );
  } else if (isAdminPage && isAdmin) {
    navLinks = (
      <>
        <Link to="/admin/home" className="nav-link">관리자홈</Link>
        <Link to="/admin/projects" className="nav-link">프로젝트관리</Link>
      </>
    );
  } else {
    navLinks = (
      <>
        {!isLoginScreen && (
          <a href="#about" className="nav-link">회사소개</a>
        )}
        {!isLoginScreen && (
          <a href="#business" className="nav-link">사업영역</a>
        )}
        {!isLoginScreen && (
          <a href="#recruit" className="nav-link">채용</a>
        )}
        {!isLoginScreen && (
          <Link to="/project-list" className="nav-link">프로젝트</Link>
        )}
        {!isLoginScreen && (
          <Link to="/admin" className="nav-link">관리자로그인</Link>
        )}
        {!isLoginScreen && (
          <Link to="/employee-login" className="nav-link">직원로그인</Link>
        )}
      </>
    );
  }

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'backdrop-blur-xl bg-white/95 border-b border-neutral-200/50 shadow-glass' 
          : 'backdrop-blur-md bg-white/80 border-b border-white/30'
      }`} 
      role="banner" 
      aria-label="사이트 헤더 및 네비게이션"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
        {/* 리뉴얼된 로고 */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-brand-600 via-brand-700 to-accent-600 rounded-2xl flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-all duration-300 group-hover:scale-105">
              <span className="text-white font-black text-xl tracking-tight">DB</span>
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-success-500 to-accent-400 rounded-full animate-pulse-slow shadow-md"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-brand-600/20 to-accent-600/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300 opacity-60"></div>
          </div>
          <div className="hidden sm:block">
            <div className="text-2xl font-black gradient-text group-hover:gradient-text-light transition-all duration-300 font-display">
              DB.INFO
            </div>
            <div className="text-xs text-neutral-500 font-medium -mt-1 group-hover:text-neutral-600 transition-colors">
              IT Innovation Platform
            </div>
          </div>
        </Link>

        {/* 데스크탑 네비게이션 - 리뉴얼 */}
        <div className="hidden lg:flex items-center gap-1">
          {(location.pathname === '/' || (!isAdminScreen && !isProjectListScreen)) && (
            <nav className="flex gap-1 text-sm font-semibold" role="navigation" aria-label="주요 메뉴">
              <div className="flex items-center gap-1 glass-strong rounded-2xl p-1.5 shadow-soft">
                {navLinks}
              </div>
            </nav>
          )}
        </div>

        {/* 태블릿용 중간 네비게이션 - 리뉴얼 */}
        <div className="hidden md:flex lg:hidden items-center gap-1">
          {(location.pathname === '/' || (!isAdminScreen && !isProjectListScreen)) && (
            <nav className="flex gap-1 text-sm font-medium" role="navigation" aria-label="태블릿 메뉴">
              <div className="flex items-center gap-1 glass rounded-xl p-1.5 shadow-soft">
                {navLinks}
              </div>
            </nav>
          )}
        </div>

        {/* 리뉴얼된 햄버거 버튼 */}
        <button 
          className={`md:hidden relative w-12 h-12 rounded-2xl glass-strong flex flex-col items-center justify-center gap-1.5 hover:bg-white/30 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:ring-offset-2 focus:ring-offset-transparent group ${
            isMenuOpen ? 'bg-brand-500/20 border-brand-500/40' : ''
          }`} 
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
          aria-label={isMenuOpen ? "모바일 메뉴 닫기" : "모바일 메뉴 열기"} 
          aria-expanded={isMenuOpen} 
          aria-controls="mobile-nav"
        >
          <span className={`block w-6 h-0.5 bg-neutral-700 rounded-full transition-all duration-300 ${
            isMenuOpen ? 'rotate-45 translate-y-2 bg-brand-600' : 'group-hover:w-7'
          }`}></span>
          <span className={`block w-6 h-0.5 bg-neutral-700 rounded-full transition-all duration-300 ${
            isMenuOpen ? 'opacity-0 scale-0' : 'group-hover:w-5'
          }`}></span>
          <span className={`block w-6 h-0.5 bg-neutral-700 rounded-full transition-all duration-300 ${
            isMenuOpen ? '-rotate-45 -translate-y-2 bg-brand-600' : 'group-hover:w-7'
          }`}></span>
          
          {/* 버튼 배경 효과 */}
          <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-brand-500/10 to-accent-500/10 opacity-0 group-hover:opacity-100 transition-all duration-300 ${
            isMenuOpen ? 'opacity-100' : ''
          }`}></div>
        </button>
      </div>

      {/* 리뉴얼된 모바일 메뉴 드롭다운 */}
      <div className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
        isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <nav 
          id="mobile-nav" 
          className="bg-white/95 backdrop-blur-xl border-t border-neutral-200/50 shadow-glass" 
          role="navigation" 
          aria-label="모바일 메뉴"
        >
          <div className="px-6 py-6 space-y-1">
            {(location.pathname === '/' || (!isAdminScreen && !isProjectListScreen)) && navLinks && (
              <div className="space-y-1">
                {React.Children.map(navLinks, (child, index) => (
                  <div 
                    key={index}
                    className={`transform transition-all duration-300 ${
                      isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    {React.isValidElement(child) && React.cloneElement(child, {
                      className: "block w-full px-4 py-3 text-left text-base font-medium text-neutral-700 hover:text-brand-600 hover:bg-brand-50/80 rounded-xl transition-all duration-200 hover:translate-x-2 hover:shadow-soft border border-transparent hover:border-brand-100",
                      onClick: () => setIsMenuOpen(false)
                    } as any)}
                  </div>
                ))}
              </div>
            )}
            
            {/* 모바일 전용 추가 메뉴 */}
            <div className="pt-4 mt-4 border-t border-neutral-200/50">
              <div className="flex items-center gap-3 px-4 py-2 text-sm text-neutral-500">
                <div className="w-2 h-2 bg-success-400 rounded-full animate-pulse-slow"></div>
                <span>13년간의 IT 전문성</span>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}