import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { adminMenus } from './admin/adminMenus';
import type { AdminMenu } from './admin/adminMenus';
import FadeSlideIn from '../components/FadeSlideIn';

// 🎨 프리미엄 관리자 대시보드 스타일
const ADMIN_STYLES = {
  container: "min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 relative overflow-hidden",
  header: "relative z-10 text-center py-12",
  dashboard: "relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20",
  card: "glass-card rounded-3xl shadow-glass border border-white/10 backdrop-blur-xl p-8 hover:border-white/20 transition-all duration-500",
  statsGrid: "grid grid-cols-1 md:grid-cols-4 gap-6 mb-12",
  menuGrid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12",
  button: {
    primary: "group w-full h-32 glass-card rounded-3xl border border-white/10 p-6 hover:border-white/30 hover:shadow-glow hover:scale-105 transition-all duration-500 cursor-pointer",
    logout: "px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl font-semibold shadow-2xl hover:shadow-red-500/25 hover:scale-105 transition-all duration-300"
  }
} as const;

// 🌟 배경 애니메이션 컴포넌트
const AdminBackground: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden">
    {/* 그라데이션 오브 */}
    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-float"></div>
    
    {/* 그리드 패턴 */}
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:60px_60px] opacity-20"></div>
  </div>
);

// 📊 통계 카드 컴포넌트
const StatCard: React.FC<{
  title: string;
  value: number;
  suffix?: string;
  color: string;
  delay?: number;
}> = ({ title, value, suffix = "", color, delay = 0 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!isVisible) return;
    
    const duration = 1500;
    const startTime = Date.now();
    
    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.floor(easeOut * value));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  }, [isVisible, value]);

  return (
    <FadeSlideIn delay={delay}>
      <div className={ADMIN_STYLES.card}>
        <div className="text-center">
          <div className={`text-3xl md:text-4xl font-black mb-2 ${color}`}>
            {displayValue.toLocaleString()}{suffix}
          </div>
          <div className="text-gray-300 font-medium text-sm md:text-base">
            {title}
          </div>
        </div>
      </div>
    </FadeSlideIn>
  );
};

// 🎯 관리자 메뉴 카드 컴포넌트
const AdminMenuCard: React.FC<{
  menu: AdminMenu;
  delay?: number;
  onNavigate: (menu: AdminMenu) => void;
}> = ({ menu, delay = 0, onNavigate }) => {
  return (
    <FadeSlideIn delay={delay}>
      <button
        className={ADMIN_STYLES.button.primary}
        onClick={() => onNavigate(menu)}
        aria-label={`관리자 메뉴: ${menu.label}`}
      >
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="text-white/80 group-hover:text-white text-3xl mb-3 group-hover:scale-110 transition-all duration-300">
            {React.createElement(menu.icon as React.ElementType)}
          </div>
          <div className="text-white font-bold text-base group-hover:text-lg transition-all duration-300">
            {menu.label}
          </div>
          <div className="text-white/60 text-xs mt-1 group-hover:text-white/80 transition-all duration-300">
            {menu.desc}
          </div>
        </div>
      </button>
    </FadeSlideIn>
  );
};

// 🔧 빠른 작업 버튼 컴포넌트
const QuickActionButton: React.FC<{
  title: string;
  description: string;
  onClick: () => void;
  delay?: number;
}> = ({ title, description, onClick, delay = 0 }) => {
  return (
    <FadeSlideIn delay={delay}>
      <button
        className={`${ADMIN_STYLES.card} hover:scale-105 transition-all duration-300 text-left`}
        onClick={onClick}
      >
        <div className="text-white font-semibold text-lg mb-2">{title}</div>
        <div className="text-gray-300 text-sm">{description}</div>
      </button>
    </FadeSlideIn>
  );
};

const AdminHome: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  // 메뉴 네비게이션 핸들러
  const handleMenuClick = (menu: AdminMenu) => {
    if (menu.onClick) {
      menu.onClick();
    } else {
      navigate(menu.to);
    }
  };

  // 로그아웃 핸들러
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // 필터링된 메뉴 (통합된 메뉴들 제외)
  const filteredMenus = adminMenus.filter(
    menu => menu.label !== '직원등록' && menu.label !== '연차정보 초기화'
  );

  return (
    <div className={ADMIN_STYLES.container}>
      {/* 배경 애니메이션 */}
      <AdminBackground />
      
      {/* 헤더 섹션 */}
      <div className={ADMIN_STYLES.header}>
        <FadeSlideIn>
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-4">
            관리자 대시보드
          </h1>
          <p className="text-xl text-gray-300 font-medium">
            시스템 관리 및 모니터링 센터
          </p>
        </FadeSlideIn>
      </div>

      <div className={ADMIN_STYLES.dashboard}>
        {/* 통계 섹션 */}
        <div className={ADMIN_STYLES.statsGrid}>
          <StatCard 
            title="총 직원 수" 
            value={156} 
            suffix="명" 
            color="text-blue-400" 
            delay={100} 
          />
          <StatCard 
            title="금일 출근" 
            value={142} 
            suffix="명" 
            color="text-green-400" 
            delay={200} 
          />
          <StatCard 
            title="승인 대기" 
            value={8} 
            suffix="건" 
            color="text-yellow-400" 
            delay={300} 
          />
          <StatCard 
            title="시스템 상태" 
            value={99} 
            suffix="%" 
            color="text-purple-400" 
            delay={400} 
          />
        </div>

        {/* 관리자 메뉴 그리드 */}
        <FadeSlideIn delay={500}>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
            📋 주요 관리 기능
          </h2>
        </FadeSlideIn>

        <div className={ADMIN_STYLES.menuGrid}>
          {filteredMenus.map((menu, index) => (
            <AdminMenuCard
              key={menu.label}
              menu={menu}
              delay={600 + index * 100}
              onNavigate={handleMenuClick}
            />
          ))}
        </div>

        {/* 빠른 작업 섹션 */}
        <FadeSlideIn delay={1000}>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
            ⚡ 빠른 작업
          </h2>
        </FadeSlideIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <QuickActionButton
            title="직원 등록 (통합 관리)"
            description="직원관리 페이지에서 새로운 직원을 등록하고 관리하세요"
            onClick={() => navigate('/admin/employee-manage')}
            delay={1100}
          />
          <QuickActionButton
            title="연차 데이터 초기화"
            description="직원관리 페이지에서 연차 정보를 일괄 초기화하세요"
            onClick={() => navigate('/admin/employee-manage')}
            delay={1200}
          />
        </div>

        {/* 시스템 정보 */}
        <FadeSlideIn delay={1300}>
          <div className={`${ADMIN_STYLES.card} mb-12`}>
            <h3 className="text-xl font-bold text-white mb-4">💡 시스템 정보</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-gray-300">
                <span className="text-blue-400 font-semibold">서버 상태:</span> 정상 운영
              </div>
              <div className="text-gray-300">
                <span className="text-green-400 font-semibold">마지막 백업:</span> 2시간 전
              </div>
              <div className="text-gray-300">
                <span className="text-purple-400 font-semibold">버전:</span> v2.1.0 Premium
              </div>
            </div>
          </div>
        </FadeSlideIn>

        {/* 로그아웃 버튼 */}
        <FadeSlideIn delay={1400}>
          <div className="flex justify-center">
            <button
              className={ADMIN_STYLES.button.logout}
              onClick={handleLogout}
              aria-label="홈으로 나가기"
            >
              🏠 홈으로 돌아가기
            </button>
          </div>
        </FadeSlideIn>
      </div>
    </div>
  );
};

export default AdminHome;