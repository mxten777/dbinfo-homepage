import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
// 사용자 현황 확인 도구 로드
import './checkUsers';
// 비밀번호 재설정 도구 로드
import './resetAdminPassword';
// 관리자 시스템 초기화 도구 로드
import './resetAdminSystem';
// 관리자 권한 부여 도구 로드
import './grantAdminPermissions';

// CSS 파일 임포트 (side-effect import)
import './index.css';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
