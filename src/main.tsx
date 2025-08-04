import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
// 사용자 현황 확인 도구 로드
import './checkUsers';
// 비밀번호 재설정 도구 로드
import './resetAdminPassword';
// 관리자 시스템 초기화 도구 로드
import './resetAdminSystem';
// 관리자 권한 부여 도구 로드
import './grantAdminPermissions';

const container = document.getElementById('app');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
