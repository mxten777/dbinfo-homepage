import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import FadeSlideIn from './FadeSlideIn';

// 🎨 프리미엄 헤더 스타일 시스템
const HEADER_STYLES = {
  container: (isScrolled: boolean) => 
    `fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
      isScrolled 
        ? 'backdrop-blur-2xl bg-white/98 border-b-2 border-slate-200 shadow-2xl' 
        : 'backdrop-blur-xl bg-white/95 border-b border-slate-200'
    }`,
  wrapper: "max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4",
  logo: {
    container: "flex items-center gap-4 group cursor-pointer",
    icon: "relative w-14 h-14 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl group-hover:shadow-blue-500/25 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3",
    badge: "absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse shadow-lg",
    glow: "absolute inset-0 bg-gradient-to-br from-blue-600/30 to-purple-600/30 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-70",
    text: {
      main: "text-3xl font-black text-slate-900 group-hover:text-blue-700 transition-all duration-500 drop-shadow-sm",
      sub: "text-xs text-slate-700 font-bold -mt-1 group-hover:text-blue-600 transition-colors duration-300 tracking-wide"
    }
  },
  nav: {
    desktop: "hidden lg:flex items-center gap-2",
    tablet: "hidden md:flex lg:hidden items-center gap-2",
    container: "bg-white/95 backdrop-blur-xl rounded-2xl p-2 border-2 border-slate-200 shadow-2xl",
    link: "relative px-4 py-2 text-slate-800 font-bold rounded-xl transition-all duration-300 hover:bg-blue-600 hover:text-white hover:scale-105 group shadow-sm",
    linkActive: "bg-blue-600 text-white shadow-lg border border-blue-700"
  },
  mobile: {
    button: (isMenuOpen: boolean) => 
      `md:hidden relative w-14 h-14 rounded-2xl bg-white/90 backdrop-blur-xl flex flex-col items-center justify-center gap-1.5 hover:bg-white hover:scale-105 transition-all duration-300 focus:outline-none group border-2 border-slate-200 shadow-lg ${
        isMenuOpen ? 'bg-blue-600 border-blue-700 scale-105' : ''
      }`,
    line: (isMenuOpen: boolean, transform: string) =>
      `block w-7 h-0.5 rounded-full transition-all duration-300 ${
        isMenuOpen ? `${transform} bg-white` : 'bg-slate-700 group-hover:w-8 group-hover:bg-blue-600'
      }`,
    menu: (isMenuOpen: boolean) =>
      `md:hidden overflow-hidden transition-all duration-700 ease-out ${
        isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`,
    menuContent: "bg-white/95 backdrop-blur-2xl border-t-2 border-slate-200 shadow-2xl",
    menuItem: "block w-full px-6 py-4 text-left text-lg font-bold text-slate-800 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 hover:translate-x-2 border-b border-slate-200 last:border-b-0"
  }
} as const;

// 🌟 로고 애니메이션 컴포넌트
const PremiumLogo: React.FC = () => (
  <Link to="/" className={HEADER_STYLES.logo.container}>
    <div className="relative">
      <div className={HEADER_STYLES.logo.glow}></div>
      <div className={HEADER_STYLES.logo.icon}>
        <span className="text-white font-black text-2xl tracking-tight">DB</span>
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl"></div>
      </div>
      <div className={HEADER_STYLES.logo.badge}>
        <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1.5"></div>
      </div>
    </div>
    <div className="hidden sm:block">
      <div className={HEADER_STYLES.logo.text.main}>
        DB.INFO
      </div>
      <div className={HEADER_STYLES.logo.text.sub}>
        Premium IT Solutions
      </div>
    </div>
  </Link>
);

// 🎯 네비게이션 링크 컴포넌트
const NavLink: React.FC<{ 
  to?: string; 
  href?: string; 
  children: React.ReactNode; 
  isActive?: boolean;
  onClick?: () => void;
}> = ({ to, href, children, isActive = false, onClick }) => {
  const className = `${HEADER_STYLES.nav.link} ${isActive ? HEADER_STYLES.nav.linkActive : ''}`;
  
  if (to) {
    return (
      <Link to={to} className={className} onClick={onClick}>
        {children}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-purple-500/0 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
      </Link>
    );
  }
  
  return (
    <a href={href} className={className} onClick={onClick}>
      {children}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-purple-500/0 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
    </a>
  );
};

// 📱 모바일 햄버거 버튼 컴포넌트
const MobileMenuButton: React.FC<{
  isMenuOpen: boolean;
  onClick: () => void;
}> = ({ isMenuOpen, onClick }) => (
  <button 
    className={HEADER_STYLES.mobile.button(isMenuOpen)}
    onClick={onClick} 
    aria-label={isMenuOpen ? "모바일 메뉴 닫기" : "모바일 메뉴 열기"} 
    aria-expanded={isMenuOpen}
  >
    <span className={HEADER_STYLES.mobile.line(isMenuOpen, 'rotate-45 translate-y-2')}></span>
    <span className={HEADER_STYLES.mobile.line(isMenuOpen, 'opacity-0 scale-0')}></span>
    <span className={HEADER_STYLES.mobile.line(isMenuOpen, '-rotate-45 -translate-y-2')}></span>
    
    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
  </button>
);

// 📋 네비게이션 메뉴 생성 함수
const createNavLinks = (isLoginScreen: boolean) => {
  const links = [];
  
  if (!isLoginScreen) {
    links.push(
      <NavLink key="about" href="#about">🏢 회사소개</NavLink>,
      <NavLink key="business" href="#business">💼 사업영역</NavLink>,
      <NavLink key="recruit" href="#recruit">👥 채용정보</NavLink>,
      <NavLink key="projects" to="/project-list">🚀 프로젝트</NavLink>,
      <NavLink key="admin" to="/admin">🔐 관리자</NavLink>,
      <NavLink key="employee" to="/employee-login">👤 직원로그인</NavLink>
    );
  }
  
  return links;
};

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  
  // 스크롤 감지 - 향상된 성능
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 30);
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 경로별 조건 설정
  const isAdminScreen = ['/admin', '/admin-home', '/leaves', '/projects', '/project-list'].includes(location.pathname);
  const isProjectListScreen = location.pathname === '/project-list';
  const isLoginScreen = location.pathname === '/admin';
  
  const { user, loading } = useAuth();
  const isAdmin = user && (user.email === 'west@naver.com' || user.email === 'hankjae@naver.com');

  // 관리자 자동 로그아웃
  useEffect(() => {
    if (user && isAdmin && window.location.pathname === '/') {
      import('../firebaseConfig').then(mod => {
        mod.auth.signOut();
        window.location.reload();
      });
    }
  }, [user, isAdmin]);

  // 메뉴 닫기
  const closeMenu = () => setIsMenuOpen(false);

  // 네비게이션 링크 결정
  const isEmployeeMode = ['/employee-login', '/employee-home'].includes(location.pathname);
  const isAdminPage = location.pathname.startsWith('/admin/');
  
  let navLinks: React.ReactNode = null;
  
  if (loading) {
    navLinks = (
      <div className="flex items-center gap-2 text-blue-200">
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
        <span className="font-medium">로딩중...</span>
      </div>
    );
  } else if (isEmployeeMode) {
    navLinks = (
      <div className="flex items-center gap-2">
        <NavLink to="/">🏠 홈</NavLink>
        <NavLink to="/employee-home" isActive={location.pathname === '/employee-home'}>
          👤 직원홈
        </NavLink>
      </div>
    );
  } else if (isAdminPage && isAdmin) {
    navLinks = (
      <div className="flex items-center gap-2">
        <NavLink to="/admin/home" isActive={location.pathname === '/admin/home'}>
          🏛️ 관리자홈
        </NavLink>
        <NavLink to="/admin/projects" isActive={location.pathname === '/admin/projects'}>
          📊 프로젝트관리
        </NavLink>
      </div>
    );
  } else {
    const links = createNavLinks(isLoginScreen);
    navLinks = (
      <div className="flex items-center gap-1">
        {links}
      </div>
    );
  }

  return (
    <>
      <header 
        className={HEADER_STYLES.container(isScrolled)}
        role="banner" 
        aria-label="사이트 헤더 및 네비게이션"
      >
        <div className={HEADER_STYLES.wrapper}>
          {/* 프리미엄 로고 */}
          <FadeSlideIn>
            <PremiumLogo />
          </FadeSlideIn>

          {/* 데스크탑 네비게이션 */}
          {(location.pathname === '/' || (!isAdminScreen && !isProjectListScreen)) && (
            <FadeSlideIn delay={200}>
              <div className={HEADER_STYLES.nav.desktop}>
                <nav className={HEADER_STYLES.nav.container} role="navigation" aria-label="주요 메뉴">
                  {navLinks}
                </nav>
              </div>
            </FadeSlideIn>
          )}

          {/* 태블릿 네비게이션 */}
          {(location.pathname === '/' || (!isAdminScreen && !isProjectListScreen)) && (
            <FadeSlideIn delay={300}>
              <div className={HEADER_STYLES.nav.tablet}>
                <nav className={HEADER_STYLES.nav.container} role="navigation" aria-label="태블릿 메뉴">
                  {navLinks}
                </nav>
              </div>
            </FadeSlideIn>
          )}

          {/* 모바일 햄버거 버튼 */}
          <FadeSlideIn delay={400}>
            <MobileMenuButton 
              isMenuOpen={isMenuOpen} 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
            />
          </FadeSlideIn>
        </div>

        {/* 모바일 메뉴 드롭다운 */}
        <div className={HEADER_STYLES.mobile.menu(isMenuOpen)}>
          <nav 
            className={HEADER_STYLES.mobile.menuContent}
            role="navigation" 
            aria-label="모바일 메뉴"
          >
            <div className="px-2 py-4">
              {(location.pathname === '/' || (!isAdminScreen && !isProjectListScreen)) && navLinks && (
                <div className="space-y-1">
                  {React.Children.map(navLinks, (child, index) => {
                    if (React.isValidElement(child)) {
                      const childProps = child.props as any;
                      return (
                        <FadeSlideIn key={index} delay={500 + index * 100}>
                          <div className="transform transition-all duration-300">
                            {childProps?.to ? (
                              <Link 
                                to={childProps.to} 
                                className={HEADER_STYLES.mobile.menuItem}
                                onClick={closeMenu}
                              >
                                {childProps.children}
                              </Link>
                            ) : childProps?.href ? (
                              <a 
                                href={childProps.href} 
                                className={HEADER_STYLES.mobile.menuItem}
                                onClick={closeMenu}
                              >
                                {childProps.children}
                              </a>
                            ) : (
                              <div className={HEADER_STYLES.mobile.menuItem}>
                                {childProps?.children || child}
                              </div>
                            )}
                          </div>
                        </FadeSlideIn>
                      );
                    }
                    return null;
                  })}
                </div>
              )}
              
              {/* 모바일 전용 추가 정보 */}
              <FadeSlideIn delay={800}>
                <div className="pt-6 mt-6 border-t border-white/10">
                  <div className="flex items-center gap-3 px-6 py-3 text-sm text-gray-300">
                    <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse"></div>
                    <span className="font-medium">13년간의 IT 전문성과 혁신</span>
                  </div>
                  <div className="flex items-center gap-3 px-6 py-3 text-sm text-gray-400">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                    <span>프리미엄 솔루션 파트너</span>
                  </div>
                </div>
              </FadeSlideIn>
            </div>
          </nav>
        </div>
      </header>
      
      {/* 헤더 높이만큼 공간 확보 */}
      <div className="h-20"></div>
    </>
  );
}