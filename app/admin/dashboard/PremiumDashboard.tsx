'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { collection, getDocs, QuerySnapshot, DocumentData } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import {
  ChartBarIcon,
  UsersIcon,
  BriefcaseIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const PremiumAdminDashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalProjects: 0,
    totalLeaves: 0,
    totalRevenue: '0'
  });
  const [recentActivities, setRecentActivities] = useState<Array<{
    type: string;
    content: string;
    time: string;
    timestamp: Date;
  }>>([]);
  const router = useRouter();

  const loadRecentActivities = useCallback((employeesSnapshot: QuerySnapshot<DocumentData>, projectsSnapshot: QuerySnapshot<DocumentData>, leavesSnapshot: QuerySnapshot<DocumentData>) => {
    const activities: Array<{
      type: string;
      content: string;
      time: string;
      timestamp: Date;
    }> = [];

    employeesSnapshot.forEach((doc) => {
      const employee = doc.data();
      const createdAt = employee.createdAt?.toDate() || new Date();
      activities.push({
        type: '직원',
        content: `새로운 직원 ${employee.name || '직원'}이 등록되었습니다.`,
        time: getTimeAgo(createdAt),
        timestamp: createdAt
      });
    });

    projectsSnapshot.forEach((doc) => {
      const project = doc.data();
      const updatedAt = project.updatedAt?.toDate() || project.createdAt?.toDate() || new Date();
      activities.push({
        type: '프로젝트',
        content: `프로젝트 "${project.title || '프로젝트'}"가 ${project.status === 'completed' ? '완료' : '업데이트'}되었습니다.`,
        time: getTimeAgo(updatedAt),
        timestamp: updatedAt
      });
    });

    leavesSnapshot.forEach((doc) => {
      const leave = doc.data();
      const createdAt = leave.createdAt?.toDate() || new Date();
      const statusText = leave.status === 'approved' ? '승인' : leave.status === 'rejected' ? '반려' : '신청';
      activities.push({
        type: '연차',
        content: `${leave.employeeName || '직원'}의 연차 신청이 ${statusText}되었습니다.`,
        time: getTimeAgo(createdAt),
        timestamp: createdAt
      });
    });

    setRecentActivities(activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 5));
  }, []);

  const loadFirebaseData = useCallback(async () => {
    try {
      if (!db) return;

      const employeesSnapshot = await getDocs(collection(db, 'employees'));
      const projectsSnapshot = await getDocs(collection(db, 'projects'));
      const leavesSnapshot = await getDocs(collection(db, 'leaves'));

      let totalRevenue = 0;
      projectsSnapshot.forEach((doc) => {
        const project = doc.data();
        if (project.total) {
          const revenue = typeof project.total === 'string' ? parseInt(project.total.replace(/[^0-9]/g, '')) : project.total;
          totalRevenue += revenue || 0;
        }
      });

      setStats({
        totalEmployees: employeesSnapshot.size,
        totalProjects: projectsSnapshot.size,
        totalLeaves: leavesSnapshot.size,
        totalRevenue: `₩ ${(totalRevenue / 1000000).toFixed(0)}M`
      });

      loadRecentActivities(employeesSnapshot, projectsSnapshot, leavesSnapshot);
    } catch (error) {
      console.error('Firebase 데이터 로드 실패:', error);
    }
  }, [loadRecentActivities]);

  useEffect(() => {
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
  }, [router, loadFirebaseData]);

  const getTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffInSeconds < 60) return '방금 전';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}일 전`;
    return `${Math.floor(diffInSeconds / 2592000)}개월 전`;
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_mode');
    localStorage.removeItem('admin_user');
    router.push('/admin/login');
  };

  const menuItems = [
    { title: '대시보드', icon: ChartBarIcon, path: '/admin/dashboard', active: true, gradient: 'from-blue-600 to-cyan-600' },
    { title: '직원 관리', icon: UsersIcon, path: '/admin/employees', gradient: 'from-purple-600 to-pink-600' },
    { title: '프로젝트 관리', icon: BriefcaseIcon, path: '/admin/projects', gradient: 'from-orange-600 to-red-600' },
    { title: '연차 관리', icon: CalendarIcon, path: '/admin/leaves', gradient: 'from-green-600 to-teal-600' },
    { title: '대리 신청', icon: UsersIcon, path: '/admin/deputy-request', gradient: 'from-indigo-600 to-purple-600' },
    { title: '회사 소식', icon: BellIcon, path: '/admin/company-news-manage', gradient: 'from-pink-600 to-rose-600' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Premium Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl blur-lg opacity-50 animate-pulse"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <SparklesIcon className="w-7 h-7 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">DB.INFO</h1>
                <p className="text-sm text-gray-600 font-semibold">Premium Admin Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">{adminUser}</p>
                <p className="text-xs text-gray-500">관리자</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Banner */}
        <div className="mb-8 p-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl text-white">
          <h2 className="text-3xl font-black mb-2">환영합니다, {adminUser}님! 👋</h2>
          <p className="text-blue-100">오늘도 효율적인 관리를 위해 함께하겠습니다.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                  <UsersIcon className="w-7 h-7 text-white" />
                </div>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">활성</span>
              </div>
              <h3 className="text-gray-600 text-sm font-semibold mb-2">전체 직원</h3>
              <p className="text-4xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{stats.totalEmployees}</p>
            </div>
          </div>

          <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <BriefcaseIcon className="w-7 h-7 text-white" />
                </div>
                <span className="text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">진행중</span>
              </div>
              <h3 className="text-gray-600 text-sm font-semibold mb-2">진행 프로젝트</h3>
              <p className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{stats.totalProjects}</p>
            </div>
          </div>

          <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-teal-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                  <CalendarIcon className="w-7 h-7 text-white" />
                </div>
                <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">대기중</span>
              </div>
              <h3 className="text-gray-600 text-sm font-semibold mb-2">연차 신청</h3>
              <p className="text-4xl font-black bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">{stats.totalLeaves}</p>
            </div>
          </div>

          <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                  <ArrowTrendingUpIcon className="w-7 h-7 text-white" />
                </div>
                <span className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">+15%</span>
              </div>
              <h3 className="text-gray-600 text-sm font-semibold mb-2">총 매출</h3>
              <p className="text-3xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">{stats.totalRevenue}</p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-black mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">빠른 실행</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {menuItems.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => router.push(item.path!)}
                    className="group relative p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl hover:from-white hover:to-white border-2 border-transparent hover:border-gray-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className={`w-12 h-12 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg mx-auto`}>
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-sm font-bold text-gray-900 text-center">{item.title}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Activities */}
            <div className="mt-8 bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-black mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">최근 활동</h3>
              <div className="space-y-4">
                {recentActivities.length > 0 ? recentActivities.map((activity, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl hover:shadow-md transition-all duration-300">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{activity.content}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-bold text-blue-600 bg-white px-2 py-1 rounded-full">{activity.type}</span>
                        <span className="text-xs text-gray-500">{activity.time}</span>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BellIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-semibold">아직 활동이 없습니다</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* System Info */}
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-2xl">
              <h3 className="text-xl font-black mb-6">시스템 상태</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/10 backdrop-blur rounded-xl">
                  <span className="text-sm font-semibold">Firebase</span>
                  <span className="text-xs font-bold bg-green-500 px-3 py-1 rounded-full">정상</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/10 backdrop-blur rounded-xl">
                  <span className="text-sm font-semibold">데이터베이스</span>
                  <span className="text-xs font-bold bg-green-500 px-3 py-1 rounded-full">정상</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/10 backdrop-blur rounded-xl">
                  <span className="text-sm font-semibold">인증 시스템</span>
                  <span className="text-xs font-bold bg-green-500 px-3 py-1 rounded-full">정상</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-black mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">빠른 통계</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">오늘 신규 직원</span>
                  <span className="text-lg font-black text-blue-600">+2</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">대기 중인 연차</span>
                  <span className="text-lg font-black text-orange-600">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">진행 중 프로젝트</span>
                  <span className="text-lg font-black text-purple-600">{stats.totalProjects}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumAdminDashboard;
