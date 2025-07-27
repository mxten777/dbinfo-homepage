
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function Header() {

  const location = useLocation();
  // 관리자/프로젝트 현황 화면에서 네비게이션 비활성화
  const isAdminScreen = ['/admin', '/admin-home', '/leaves', '/projects', '/project-list'].includes(location.pathname);
  // 프로젝트 현황 화면에서 모든 메뉴 비활성화 (홈만 예외)
  const isProjectListScreen = location.pathname === '/project-list';
  // 관리자 로그인 화면에서 프로젝트, 관리자로그인, 직원로그인 메뉴도 비활성화
  const isLoginScreen = location.pathname === '/admin';
  const [menuOpen, setMenuOpen] = useState(false);
  // ...existing code...
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
  // 직원 로그인 예시(관리자 외)
  // ...existing code...

  // 직원 로그인 경로(직원 로그인/직원 홈) 또는 user가 있고 관리자 이메일이지만 직원 로그인 경로로 진입한 경우에도 직원 메뉴만 노출
  const isEmployeeMode = ['/employee-login', '/employee-home'].includes(location.pathname);
  let navLinks = null;
  if (loading) {
    navLinks = null;
  } else if (isProjectListScreen) {
    navLinks = (
      <>
        <span className="px-3 py-1 rounded bg-gray-300 text-gray-400 cursor-not-allowed block sm:inline-block" aria-disabled>회사소개</span>
        <span className="px-3 py-1 rounded bg-gray-300 text-gray-400 cursor-not-allowed block sm:inline-block" aria-disabled>사업영역</span>
        <span className="px-3 py-1 rounded bg-gray-300 text-gray-400 cursor-not-allowed block sm:inline-block" aria-disabled>채용</span>
        <span className="px-3 py-1 rounded bg-gray-300 text-gray-400 cursor-not-allowed block sm:inline-block" aria-disabled>프로젝트 현황</span>
        {/* <span className="px-3 py-1 rounded bg-gray-300 text-gray-400 cursor-not-allowed block sm:inline-block" aria-disabled>프로젝트</span> */}
        <span className="px-3 py-1 rounded bg-gray-300 text-gray-400 cursor-not-allowed block sm:inline-block" aria-disabled>관리자로그인</span>
        <span className="px-3 py-1 rounded bg-gray-300 text-gray-400 cursor-not-allowed block sm:inline-block" aria-disabled>직원로그인</span>
      </>
    );
  } else if (!user) {
    navLinks = (
      <>
        <a href="#about" className={`px-3 py-1 rounded ${isAdminScreen ? 'bg-gray-300 text-gray-400 cursor-not-allowed' : 'hover:bg-white/20 hover:text-yellow-200 text-white transition'} block sm:inline-block`} onClick={e => { if(isAdminScreen){e.preventDefault();return;} e.preventDefault(); const target = document.getElementById('about'); if (target) { const header = document.querySelector('header'); const headerHeight = header ? header.offsetHeight : 64; const y = target.getBoundingClientRect().top + window.scrollY - headerHeight; window.scrollTo({ top: y, behavior: 'smooth' }); setMenuOpen(false); } }} aria-disabled={isAdminScreen}>회사소개</a>
        <a href="#business" className={`px-3 py-1 rounded ${isAdminScreen ? 'bg-gray-300 text-gray-400 cursor-not-allowed' : 'hover:bg-white/20 hover:text-yellow-200 text-white transition'} block sm:inline-block`} onClick={e => { if(isAdminScreen){e.preventDefault();return;} e.preventDefault(); const target = document.getElementById('business'); if (target) { const header = document.querySelector('header'); const headerHeight = header ? header.offsetHeight : 64; const y = target.getBoundingClientRect().top + window.scrollY - headerHeight; window.scrollTo({ top: y, behavior: 'smooth' }); setMenuOpen(false); } }} aria-disabled={isAdminScreen}>사업영역</a>
        <a href="#recruit" className={`px-3 py-1 rounded ${isAdminScreen ? 'bg-gray-300 text-gray-400 cursor-not-allowed' : 'hover:bg-white/20 hover:text-yellow-200 text-white transition'} block sm:inline-block`} onClick={e => { if(isAdminScreen){e.preventDefault();return;} e.preventDefault(); const target = document.getElementById('recruit'); if (target) { const header = document.querySelector('header'); const headerHeight = header ? header.offsetHeight : 64; const y = target.getBoundingClientRect().top + window.scrollY - headerHeight; window.scrollTo({ top: y, behavior: 'smooth' }); setMenuOpen(false); } }} aria-disabled={isAdminScreen}>채용</a>
        <Link to="/project-list" className={`px-3 py-1 rounded ${(isAdminScreen || isLoginScreen) ? 'bg-gray-300 text-gray-400 cursor-not-allowed' : 'hover:bg-white/20 hover:text-yellow-200 text-white transition'} block sm:inline-block`} onClick={e => { if(isAdminScreen || isLoginScreen){e.preventDefault();return;} setMenuOpen(false); }} aria-disabled={isAdminScreen || isLoginScreen}>프로젝트 현황</Link>
        {/* <Link to="/projects" className={`px-3 py-1 rounded ${(isAdminScreen || isLoginScreen) ? 'bg-gray-300 text-gray-400 cursor-not-allowed' : 'hover:bg-white/20 hover:text-yellow-200 text-white transition'} block sm:inline-block`} onClick={e => { if(isAdminScreen || isLoginScreen){e.preventDefault();return;} setMenuOpen(false); }} aria-disabled={isAdminScreen || isLoginScreen}>프로젝트</Link> */}
        <Link to="/admin" className={`px-3 py-1 rounded ${(isAdminScreen || isLoginScreen) ? 'bg-gray-300 text-gray-400 cursor-not-allowed' : 'hover:bg-white/20 hover:text-yellow-200 text-white transition'} block sm:inline-block`} onClick={e => { if(isAdminScreen || isLoginScreen){e.preventDefault();return;} setMenuOpen(false); }} aria-disabled={isAdminScreen || isLoginScreen}>관리자로그인</Link>
        <Link to="/employee-login" className={`px-3 py-1 rounded ${(isAdminScreen || isLoginScreen) ? 'bg-gray-300 text-gray-400 cursor-not-allowed' : 'hover:bg-white/20 hover:text-yellow-200 text-white transition'} block sm:inline-block`} onClick={e => { if(isAdminScreen || isLoginScreen){e.preventDefault();return;} setMenuOpen(false); }} aria-disabled={isAdminScreen || isLoginScreen}>직원로그인</Link>
      </>
    );
  } else if (isEmployeeMode || (user && isAdmin && window.location.pathname.startsWith('/employee'))) {
    // 직원 로그인/직원 홈 경로에서는 네비게이션에 아무 메뉴도 노출하지 않음
    navLinks = null;
  } else if (isAdmin) {
    // 관리자 로그인: 회사소개/사업영역/채용/프로젝트/연차관리/프로젝트관리 등(기존대로)
    navLinks = (
      <>
        <a href="#about" className={`px-3 py-1 rounded ${isAdminScreen ? 'bg-gray-300 text-gray-400 cursor-not-allowed' : 'hover:bg-white/20 hover:text-yellow-200 text-white transition'} block sm:inline-block`} onClick={e => { if(isAdminScreen){e.preventDefault();return;} e.preventDefault(); const target = document.getElementById('about'); if (target) { const header = document.querySelector('header'); const headerHeight = header ? header.offsetHeight : 64; const y = target.getBoundingClientRect().top + window.scrollY - headerHeight; window.scrollTo({ top: y, behavior: 'smooth' }); setMenuOpen(false); } }} aria-disabled={isAdminScreen}>회사소개</a>
        <a href="#business" className={`px-3 py-1 rounded ${isAdminScreen ? 'bg-gray-300 text-gray-400 cursor-not-allowed' : 'hover:bg-white/20 hover:text-yellow-200 text-white transition'} block sm:inline-block`} onClick={e => { if(isAdminScreen){e.preventDefault();return;} e.preventDefault(); const target = document.getElementById('business'); if (target) { const header = document.querySelector('header'); const headerHeight = header ? header.offsetHeight : 64; const y = target.getBoundingClientRect().top + window.scrollY - headerHeight; window.scrollTo({ top: y, behavior: 'smooth' }); setMenuOpen(false); } }} aria-disabled={isAdminScreen}>사업영역</a>
        <a href="#recruit" className={`px-3 py-1 rounded ${isAdminScreen ? 'bg-gray-300 text-gray-400 cursor-not-allowed' : 'hover:bg-white/20 hover:text-yellow-200 text-white transition'} block sm:inline-block`} onClick={e => { if(isAdminScreen){e.preventDefault();return;} e.preventDefault(); const target = document.getElementById('recruit'); if (target) { const header = document.querySelector('header'); const headerHeight = header ? header.offsetHeight : 64; const y = target.getBoundingClientRect().top + window.scrollY - headerHeight; window.scrollTo({ top: y, behavior: 'smooth' }); setMenuOpen(false); } }} aria-disabled={isAdminScreen}>채용</a>
        {/* <Link to="/projects" className={`px-3 py-1 rounded ${(isAdminScreen || isLoginScreen) ? 'bg-gray-300 text-gray-400 cursor-not-allowed' : 'hover:bg-white/20 hover:text-yellow-200 text-white transition'} block sm:inline-block`} onClick={e => { if(isAdminScreen || isLoginScreen){e.preventDefault();return;} setMenuOpen(false); }} aria-disabled={isAdminScreen || isLoginScreen}>프로젝트</Link> */}
        <Link to="/leaves" className={`px-3 py-1 rounded ${isAdminScreen ? 'bg-gray-300 text-gray-400 cursor-not-allowed' : 'hover:bg-white/20 hover:text-yellow-200 text-white transition'} block sm:inline-block`} onClick={e => { if(isAdminScreen){e.preventDefault();return;} setMenuOpen(false); }} aria-disabled={isAdminScreen}>연차관리</Link>
        <Link to="/projects" className={`px-3 py-1 rounded ${isAdminScreen ? 'bg-gray-300 text-gray-400 cursor-not-allowed' : 'hover:bg-white/20 hover:text-yellow-200 text-white transition'} block sm:inline-block`} onClick={e => { if(isAdminScreen){e.preventDefault();return;} setMenuOpen(false); }} aria-disabled={isAdminScreen}>프로젝트관리</Link>
      </>
    );
  } else {
    // 직원 로그인(관리자 아님): 연차신청(직원용)과 로그아웃만 노출
    navLinks = (
      <>
        <Link to="/leaves" className={`px-3 py-1 rounded ${isAdminScreen ? 'bg-gray-300 text-gray-400 cursor-not-allowed' : 'hover:bg-white/20 hover:text-yellow-200 text-white transition'} block sm:inline-block`} onClick={e => { if(isAdminScreen){e.preventDefault();return;} setMenuOpen(false); }} aria-disabled={isAdminScreen}>연차신청</Link>
        {/* 로그아웃 버튼은 기존 위치에 있으면 됨 (예: 우측 상단 등) */}
      </>
    );
  }

  // 관리자 메뉴 버튼 완전 제거 (AdminHome에서만 노출)
  // ...existing code...

  return (
    <header className="bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-400 shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-end px-6 py-3">
        {/* 데스크탑 네비게이션: 관리자 화면에서는 숨김 */}
        <div className="flex items-center gap-4">
          {/* 프로젝트 현황(/project-list)에서는 네비게이션 숨김, 홈(/) 또는 그 외에서만 보이기 */}
          {(location.pathname === '/' || (!isAdminScreen && !isProjectListScreen)) && (
            <nav className="hidden sm:flex gap-2 sm:gap-6 text-base font-semibold">
              {navLinks}
            </nav>
          )}
        </div>
        {/* 모바일 햄버거 버튼 */}
        <button className="sm:hidden flex flex-col justify-center items-center w-10 h-10 rounded hover:bg-white/10 focus:outline-none" onClick={()=>setMenuOpen(v=>!v)} aria-label="메뉴 열기">
          <span className="block w-6 h-0.5 bg-white mb-1 rounded transition-all" style={{transform: menuOpen ? 'rotate(45deg) translateY(7px)' : 'none'}}></span>
          <span className={`block w-6 h-0.5 bg-white mb-1 rounded transition-all ${menuOpen ? 'opacity-0' : ''}`}></span>
          <span className="block w-6 h-0.5 bg-white rounded transition-all" style={{transform: menuOpen ? 'rotate(-45deg) translateY(-7px)' : 'none'}}></span>
        </button>
      </div>
      {/* 모바일 메뉴 드롭다운 */}
      {menuOpen && (
        <nav className="sm:hidden flex flex-col gap-2 px-6 pb-4 bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-400 text-base font-semibold animate-fade-in-down z-50">
          {navLinks}
        </nav>
      )}
    </header>
  );
}
