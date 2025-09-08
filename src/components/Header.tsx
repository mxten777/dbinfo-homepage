
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function Header() {
  const location = useLocation();
  const isAdminScreen = ['/admin', '/admin-home', '/leaves', '/projects', '/project-list'].includes(location.pathname);
  const isProjectListScreen = location.pathname === '/project-list';
  const isLoginScreen = location.pathname === '/admin';
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, loading } = useAuth();
  const isAdmin = user && (user.email === 'west@naver.com' || user.email === 'hankjae@naver.com');

  // 헤더 스크롤 효과
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (user && isAdmin && window.location.pathname === '/') {
      import('../firebaseConfig').then(mod => {
        mod.auth.signOut();
        window.location.reload();
      });
    }
  }, [user, isAdmin]);

  const isEmployeeMode = ['/employee-login', '/employee-home'].includes(location.pathname);
  const isAdminPage = location.pathname.startsWith('/admin/');
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
        <span className="px-3 py-1 rounded bg-gray-300 text-gray-400 cursor-not-allowed block sm:inline-block" aria-disabled>직원로그인</span>
      </>
    );
  } else if (isAdminPage) {
    navLinks = (
      <>
        <Link to="/admin/home" className="px-3 py-1 rounded hover:bg-white/20 hover:text-yellow-200 text-white transition block sm:inline-block">관리자홈</Link>
        <button onClick={()=>{import('../firebaseConfig').then(mod=>{mod.auth.signOut();window.location.href='/';});}} className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition block sm:inline-block">로그아웃</button>
      </>
    );
  } else if (!user || location.pathname === '/') {
    navLinks = (
      <>
        <a href="#about" className={`px-3 py-1 rounded ${isAdminScreen ? 'bg-gray-300 text-gray-400 cursor-not-allowed' : 'hover:bg-white/20 hover:text-yellow-200 text-white transition'} block sm:inline-block`} onClick={e => { if(isAdminScreen){e.preventDefault();return;} e.preventDefault(); const target = document.getElementById('about'); if (target) { const header = document.querySelector('header'); const headerHeight = header ? header.offsetHeight : 64; const y = target.getBoundingClientRect().top + window.scrollY - headerHeight; window.scrollTo({ top: y, behavior: 'smooth' }); setMenuOpen(false); } }} aria-disabled={isAdminScreen}>회사소개</a>
        <a href="#business" className={`px-3 py-1 rounded ${isAdminScreen ? 'bg-gray-300 text-gray-400 cursor-not-allowed' : 'hover:bg-white/20 hover:text-yellow-200 text-white transition'} block sm:inline-block`} onClick={e => { if(isAdminScreen){e.preventDefault();return;} e.preventDefault(); const target = document.getElementById('business'); if (target) { const header = document.querySelector('header'); const headerHeight = header ? header.offsetHeight : 64; const y = target.getBoundingClientRect().top + window.scrollY - headerHeight; window.scrollTo({ top: y, behavior: 'smooth' }); setMenuOpen(false); } }} aria-disabled={isAdminScreen}>사업영역</a>
        <a href="#recruit" className={`px-3 py-1 rounded ${isAdminScreen ? 'bg-gray-300 text-gray-400 cursor-not-allowed' : 'hover:bg-white/20 hover:text-yellow-200 text-white transition'} block sm:inline-block`} onClick={e => { if(isAdminScreen){e.preventDefault();return;} e.preventDefault(); const target = document.getElementById('recruit'); if (target) { const header = document.querySelector('header'); const headerHeight = header ? header.offsetHeight : 64; const y = target.getBoundingClientRect().top + window.scrollY - headerHeight; window.scrollTo({ top: y, behavior: 'smooth' }); setMenuOpen(false); } }} aria-disabled={isAdminScreen}>채용</a>
        <Link to="/project-list" className={`px-3 py-1 rounded ${(isAdminScreen || isLoginScreen) ? 'bg-gray-300 text-gray-400 cursor-not-allowed' : 'hover:bg-white/20 hover:text-yellow-200 text-white transition'} block sm:inline-block`} onClick={e => { if(isAdminScreen || isLoginScreen){e.preventDefault();return;} setMenuOpen(false); }} aria-disabled={isAdminScreen || isLoginScreen}>프로젝트 현황</Link>
        <Link to="/employee-login" className={`px-3 py-1 rounded ${(isAdminScreen || isLoginScreen) ? 'bg-gray-300 text-gray-400 cursor-not-allowed' : 'hover:bg-white/20 hover:text-yellow-200 text-white transition'} block sm:inline-block`} onClick={e => { if(isAdminScreen || isLoginScreen){e.preventDefault();return;} setMenuOpen(false); }} aria-disabled={isAdminScreen || isLoginScreen}>직원로그인</Link>
        <Link to="/login" className="px-3 py-1 rounded bg-white/20 text-white hover:bg-yellow-200 hover:text-blue-700 transition block sm:inline-block">로그인</Link>
      </>
    );
  } else if (isEmployeeMode || (user && !isAdmin)) {
    navLinks = (
      <>
        <Link to="/employee-home" className="px-3 py-1 rounded hover:bg-white/20 hover:text-yellow-200 text-white transition block sm:inline-block">직원홈</Link>
        <Link to="/leaves" className="px-3 py-1 rounded hover:bg-white/20 hover:text-yellow-200 text-white transition block sm:inline-block">연차신청</Link>
        <Link to="/employee-home#myinfo" className="px-3 py-1 rounded hover:bg-white/20 hover:text-yellow-200 text-white transition block sm:inline-block">내정보</Link>
        <button onClick={()=>{import('../firebaseConfig').then(mod=>{mod.auth.signOut();window.location.href='/';});}} className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition block sm:inline-block">로그아웃</button>
      </>
    );
  } else if (isAdmin) {
    navLinks = (
      <>
        <Link to="/admin/home" className="px-3 py-1 rounded hover:bg-white/20 hover:text-yellow-200 text-white transition block sm:inline-block">관리자홈</Link>
        <Link to="/admin/employee-manage" className="px-3 py-1 rounded hover:bg-white/20 hover:text-yellow-200 text-white transition block sm:inline-block">직원관리</Link>
        <button onClick={()=>{import('../firebaseConfig').then(mod=>{mod.auth.signOut();window.location.href='/';});}} className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition block sm:inline-block">로그아웃</button>
      </>
    );
  }

  // 헤더 스타일 동적 적용
  const headerClass = `backdrop-blur-md sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-blue-800/80 shadow-lg' : 'bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-400/90'}`;

  return (
    <header className={headerClass}>
      <div className="max-w-6xl mx-auto flex items-center justify-end px-6 py-3">
        <div className="flex items-center gap-4">
          {(location.pathname === '/' || (!isAdminScreen && !isProjectListScreen)) && (
            <nav className="hidden sm:flex gap-2 sm:gap-6 text-base font-semibold">
              {navLinks}
            </nav>
          )}
        </div>
        {/* 모바일 햄버거 버튼 */}
        <button
          className="sm:hidden flex flex-col justify-center items-center w-10 h-10 rounded hover:bg-white/10 focus:outline-none transition-all duration-300"
          onClick={()=>setMenuOpen(v=>!v)}
          aria-label="메뉴 열기"
        >
          <span className={`block w-6 h-0.5 bg-white mb-1 rounded transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-white mb-1 rounded transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-white rounded transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </div>
      {/* 모바일 메뉴 드롭다운 */}
      <nav
        className={`sm:hidden flex flex-col gap-2 px-6 pb-4 text-base font-semibold z-50 transition-all duration-500 ${menuOpen ? 'max-h-96 opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-4 pointer-events-none'} bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-400/90 backdrop-blur-md`}
        style={{overflow: 'hidden'}}
      >
        {navLinks}
      </nav>
    </header>
  );
}
