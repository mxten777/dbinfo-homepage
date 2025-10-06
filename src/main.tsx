import React from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
// 사용자 현황 확인 도구 로드
import './checkUsers';
// 비밀번호 재설정 도구 로드
import './resetAdminPassword';
// 관리자 시스템 초기화 도구 로드
import './resetAdminSystem';
// 관리자 권한 부여 도구 로드
import './grantAdminPermissions';

// 🚀 Phase 8: 고급 성능 모니터링 및 분석 도구
import { initializePerformanceMonitoring } from './utils/performance';
import { initializeAnalytics } from './utils/analytics';

// CSS 파일 임포트 (side-effect import)
import './index.css';

// 🎯 성능 모니터링 초기화
initializePerformanceMonitoring();
initializeAnalytics();

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <HelmetProvider>
      <App />
    </HelmetProvider>
  );
}
