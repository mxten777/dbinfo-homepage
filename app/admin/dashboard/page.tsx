'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

// 메뉴 아이템 타입 정의
interface MenuItem {
  title: string;
  icon: React.ReactElement;
  active?: boolean;
  path?: string;
  category?: 'enhanced' | 'original' | 'reset';
  badge?: string;
}

const AdminDashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState('');
  const [loading, setLoading] = useState(true);
  const [firebaseConnected, setFirebaseConnected] = useState(false);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalProjects: 0,
    totalLeaves: 0,
    totalRevenue: '0'
  });
  const router = useRouter();

  useEffect(() => {
    // 관리자 인증 확인
    const adminMode = localStorage.getItem('admin_mode');
    const user = localStorage.getItem('admin_user');
    
    if (adminMode === 'true' && user) {
      setIsAuthenticated(true);
      setAdminUser(user);
      loadFirebaseData();
    } else {
      router.push('/admin/login');
    }
    setLoading(false);
  }, [router]);

  // Firebase 데이터 로드
  const loadFirebaseData = async () => {
    try {
      if (!db) {
        console.log('Firebase가 연결되지 않음 - 데모 데이터 사용');
        setFirebaseConnected(false);
        return;
      }

      setFirebaseConnected(true);
      console.log('Firebase 데이터 로드 시작...');

      // 직원 수 확인
      const employeesSnapshot = await getDocs(collection(db, 'employees'));
      const employeeCount = employeesSnapshot.size;

      // 프로젝트 수 확인
      const projectsSnapshot = await getDocs(collection(db, 'projects'));
      const projectCount = projectsSnapshot.size;

      // 연차 신청 수 확인
      const leavesSnapshot = await getDocs(collection(db, 'leaves'));
      const leaveCount = leavesSnapshot.size;

      // 매출 계산 (프로젝트의 total 합산)
      let totalRevenue = 0;
      projectsSnapshot.forEach((doc) => {
        const project = doc.data();
        if (project.total) {
          totalRevenue += project.total;
        }
      });

      setStats({
        totalEmployees: employeeCount,
        totalProjects: projectCount,
        totalLeaves: leaveCount,
        totalRevenue: `₩ ${(totalRevenue / 1000000).toFixed(0)}M`
      });

      console.log('Firebase 데이터 로드 완료:', {
        employees: employeeCount,
        projects: projectCount,
        leaves: leaveCount,
        revenue: totalRevenue
      });

    } catch (error) {
      console.error('Firebase 데이터 로드 실패:', error);
      setFirebaseConnected(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_mode');
    localStorage.removeItem('admin_user');
    router.push('/admin/login');
  };

  const dashboardStats = [
    {
      title: '총 직원 수',
      value: firebaseConnected ? stats.totalEmployees.toString() : '로드 중...',
      change: firebaseConnected ? 'Firebase 연결됨' : '데모 모드',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: '연차 신청',
      value: firebaseConnected ? stats.totalLeaves.toString() : '로드 중...',
      change: firebaseConnected ? 'Firebase 연결됨' : '데모 모드',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      color: 'from-emerald-500 to-teal-500'
    },
    {
      title: '프로젝트 진행',
      value: firebaseConnected ? stats.totalProjects.toString() : '로드 중...',
      change: firebaseConnected ? 'Firebase 연결됨' : '데모 모드',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: '수익 현황',
      value: firebaseConnected ? stats.totalRevenue : '로드 중...',
      change: firebaseConnected ? 'Firebase 연결됨' : '데모 모드',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      color: 'from-orange-500 to-red-500'
    }
  ];

  const menuItems: MenuItem[] = [
    // 🚀 고도화된 5가지 기능 (enhanced functions)
    { 
      title: '고급 분석', 
      path: '/admin/analytics',
      category: 'enhanced',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      badge: '고급'
    },
    { 
      title: '실시간 모니터링', 
      path: '/admin/monitoring',
      category: 'enhanced',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      badge: '실시간'
    },
    { 
      title: '보안 관리', 
      path: '/admin/security',
      category: 'enhanced',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      badge: '보안'
    },
    { 
      title: '성능 최적화', 
      path: '/admin/performance',
      category: 'enhanced',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      badge: '고급'
    },
    { 
      title: '고급 설정', 
      path: '/admin/settings',
      category: 'enhanced',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      badge: '고급'
    },

    // 📋 기존 6가지 관리자 기능 (GitHub에서 확인됨) 
    { 
      title: '직원 현황', 
      path: '/admin/employee-status',
      category: 'original',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    { 
      title: '직원 관리', 
      path: '/admin/employees',
      category: 'original',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    { 
      title: '연차 관리', 
      path: '/admin/leaves',
      category: 'original',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    { 
      title: '프로젝트 관리', 
      path: '/admin/projects',
      category: 'original',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    { 
      title: '회사 소식', 
      path: '/admin/company-news-manage',
      category: 'original',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      )
    },
    { 
      title: '대리 신청', 
      path: '/admin/deputy-request',
      category: 'original',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },

    // 🔄 초기화 기능 3가지 (기존 관리자 메뉴에 있던 것들)
    { 
      title: '연차 기록 초기화', 
      path: '/admin/reset-leaves',
      category: 'reset',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      badge: '위험'
    },
    { 
      title: '대리신청 초기화', 
      path: '/admin/reset-deputy',
      category: 'reset',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      ),
      badge: '위험'
    },
    { 
      title: '관리자 시스템 초기화', 
      path: '/admin/reset-admin',
      category: 'reset',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      badge: '매우위험'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">로딩 중...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">DB.INFO</h1>
              <p className="text-sm text-blue-200">관리자 대시보드</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-white font-medium">{adminUser}</p>
              <p className="text-xs text-blue-200">관리자</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 rounded-xl transition-all duration-200 border border-red-500/30"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-80 bg-white/5 backdrop-blur-md border-r border-white/10 min-h-[calc(100vh-88px)] overflow-y-auto">
          <nav className="p-4">
            {/* 고도화된 기능 */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-blue-300 uppercase tracking-wider mb-3 px-2">
                🚀 고도화된 관리 기능
              </h3>
              <ul className="space-y-1">
                {menuItems.filter(item => item.category === 'enhanced').map((item, index) => (
                  <li key={index}>
                    <button 
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        item.active 
                          ? 'bg-gradient-to-r from-blue-500/40 to-indigo-500/40 text-white border border-blue-400/50 shadow-lg' 
                          : 'text-blue-200 hover:bg-white/10 hover:text-white hover:scale-105'
                      }`}
                      onClick={() => {
                        if (item.path) {
                          router.push(item.path);
                        } else {
                          alert(`${item.title} 기능을 준비 중입니다.`);
                        }
                      }}
                    >
                      {item.icon}
                      <div className="flex-1 text-left">
                        <span className="font-medium">{item.title}</span>
                        {item.badge && (
                          <span className="ml-2 px-2 py-0.5 bg-blue-400/20 text-blue-300 text-xs rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* 기존 기본 기능들 */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-3 px-2">
                📋 기존 관리 기능 (6가지)
              </h3>
              <ul className="space-y-1">
                {menuItems.filter(item => item.category === 'original').map((item, index) => (
                  <li key={`legacy-${index}`}>
                    <button 
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-emerald-200 hover:bg-emerald-500/10 hover:text-emerald-100 hover:scale-105"
                      onClick={() => {
                        if (item.path) {
                          router.push(item.path);
                        }
                      }}
                    >
                      {item.icon}
                      <div className="flex-1 text-left">
                        <span className="font-medium">{item.title}</span>
                        <div className="text-xs text-emerald-400 opacity-70">
                          {item.path}
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* 초기화 기능들 */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-red-300 uppercase tracking-wider mb-3 px-2">
                🔄 시스템 초기화 (3가지)
              </h3>
              <ul className="space-y-1">
                {menuItems.filter(item => item.category === 'reset').map((item, index) => (
                  <li key={`reset-${index}`}>
                    <button 
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-red-200 hover:bg-red-500/10 hover:text-red-100 hover:scale-105 border border-red-500/20"
                      onClick={() => {
                        if (item.path) {
                          // 위험한 기능이므로 확인 후 이동
                          if (confirm(`⚠️ ${item.title} 페이지로 이동하시겠습니까?\n\n주의: 이 기능은 되돌릴 수 없습니다!`)) {
                            router.push(item.path);
                          }
                        }
                      }}
                    >
                      {item.icon}
                      <div className="flex-1 text-left">
                        <span className="font-medium">{item.title}</span>
                        {item.badge && (
                          <span className="ml-2 px-2 py-0.5 bg-red-400/20 text-red-300 text-xs rounded-full">
                            {item.badge}
                          </span>
                        )}
                        <div className="text-xs text-red-400 opacity-70">
                          {item.path}
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* 통계 요약 */}
            <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10">
              <h4 className="text-sm font-semibold text-white mb-2">관리 기능 현황</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-blue-300">
                  <span>고도화 기능:</span>
                  <span className="font-bold">{menuItems.filter(item => item.category === 'enhanced').length}개</span>
                </div>
                <div className="flex justify-between text-emerald-300">
                  <span>기존 기능:</span>
                  <span className="font-bold">{menuItems.filter(item => item.category === 'original').length}개</span>
                </div>
                <div className="flex justify-between text-red-300">
                  <span>초기화 기능:</span>
                  <span className="font-bold">{menuItems.filter(item => item.category === 'reset').length}개</span>
                </div>
                <div className="flex justify-between text-white font-semibold border-t border-white/20 pt-2">
                  <span>총 기능:</span>
                  <span>{menuItems.length}개</span>
                </div>
              </div>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">환영합니다! 👋</h2>
            <p className="text-blue-200">DB.INFO 관리 시스템에 오신 것을 환영합니다.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {dashboardStats.map((stat, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center text-white`}>
                    {stat.icon}
                  </div>
                  <span className="text-emerald-400 text-sm font-semibold">{stat.change}</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
                <p className="text-blue-200 text-sm">{stat.title}</p>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* 방문자 통계 */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">방문자 통계</h3>
              <div className="h-64 bg-white/5 rounded-xl flex items-center justify-center">
                <p className="text-blue-200">차트 영역 (Chart.js 연동 예정)</p>
              </div>
            </div>

            {/* 최근 활동 */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">최근 활동</h3>
              <div className="space-y-4">
                {[
                  { type: '문의', content: '새로운 SI 프로젝트 문의가 등록되었습니다.', time: '5분 전' },
                  { type: '사용자', content: '새로운 사용자가 가입했습니다.', time: '12분 전' },
                  { type: '프로젝트', content: 'AI 데이터셋 플랫폼 업데이트가 완료되었습니다.', time: '1시간 전' },
                  { type: '시스템', content: '백업이 성공적으로 완료되었습니다.', time: '2시간 전' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-white/5 rounded-xl">
                    <div className="w-8 h-8 bg-blue-500/30 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{activity.content}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-blue-300 bg-blue-500/20 px-2 py-1 rounded-full">
                          {activity.type}
                        </span>
                        <span className="text-xs text-blue-200">{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">빠른 작업</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl hover:from-blue-500/30 hover:to-cyan-500/30 transition-all duration-200 text-left group">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h4 className="text-white font-medium mb-1">새 프로젝트</h4>
                <p className="text-blue-200 text-sm">새로운 프로젝트를 생성합니다</p>
              </button>

              <button className="p-4 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-xl hover:from-emerald-500/30 hover:to-teal-500/30 transition-all duration-200 text-left group">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h4 className="text-white font-medium mb-1">콘텐츠 추가</h4>
                <p className="text-blue-200 text-sm">새로운 콘텐츠를 추가합니다</p>
              </button>

              <button className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-200 text-left group">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h4 className="text-white font-medium mb-1">분석 보고서</h4>
                <p className="text-blue-200 text-sm">상세 분석 보고서를 생성합니다</p>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;