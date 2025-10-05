import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaUsers, FaCalendarCheck, FaProjectDiagram, FaChartBar, FaCog } from 'react-icons/fa';
import { adminMenus } from './adminMenus';
import { db } from '../../firebaseConfig';
import { collection, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';

const AdminHome: React.FC = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalLeaves: 0,
    pendingApprovals: 0,
    totalProjects: 0
  });
  const navigate = useNavigate();

  // 통계 데이터 로드
  useEffect(() => {
    const loadStats = async () => {
      try {
        const [employeesSnapshot, leavesSnapshot] = await Promise.all([
          getDocs(collection(db, 'employees')),
          getDocs(collection(db, 'leaves'))
        ]);
        
        const pendingLeaves = leavesSnapshot.docs.filter(doc => 
          doc.data().status === 'pending'
        ).length;

        setStats({
          totalEmployees: employeesSnapshot.docs.length,
          totalLeaves: leavesSnapshot.docs.length,
          pendingApprovals: pendingLeaves,
          totalProjects: 42 // Mock data
        });
      } catch (error) {
        console.error('통계 로딩 실패:', error);
      }
    };

    loadStats();
  }, []);

  // 모든 연차 데이터 삭제
  const handleClearLeaveData = async () => {
    if (!window.confirm('모든 연차 신청 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return;
    setIsDeleting(true);
    try {
      const leavesSnapshot = await getDocs(collection(db, 'leaves'));
      const deletePromises = leavesSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      alert(`총 ${leavesSnapshot.docs.length}개의 연차 신청 데이터가 삭제되었습니다.`);
      // 통계 업데이트
      setStats(prev => ({ ...prev, totalLeaves: 0, pendingApprovals: 0 }));
    } catch (error) {
      alert('연차 데이터 삭제에 실패했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  // 모든 대리신청 데이터 삭제
  const handleClearDeputyRequestData = async () => {
    if (!window.confirm('모든 대리신청 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return;
    setIsDeleting(true);
    try {
      const deputySnapshot = await getDocs(collection(db, 'deputyRequests'));
      const deletePromises = deputySnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      alert(`총 ${deputySnapshot.docs.length}개의 대리신청 데이터가 삭제되었습니다.`);
    } catch (error) {
      alert('대리신청 데이터 삭제에 실패했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  // 모든 직원 연차정보 초기화
  const handleResetEmployeeLeaveInfo = async () => {
    if (!window.confirm('모든 직원의 연차 사용일수와 잔여연차를 초기화하시겠습니까?')) return;
    setIsDeleting(true);
    try {
      const employeesSnapshot = await getDocs(collection(db, 'employees'));
      let updateCount = 0;
      for (const empDoc of employeesSnapshot.docs) {
        const emp = empDoc.data();
        const total = emp.totalLeaves ?? 15;
        await updateDoc(empDoc.ref, {
          usedLeaves: 0,
          remainingLeaves: total
        });
        updateCount++;
      }
      alert(`총 ${updateCount}명의 직원 연차정보가 초기화되었습니다.`);
    } catch (error) {
      alert('직원 연차정보 초기화에 실패했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-brand-50/20 to-accent-50/20">
      {/* 헤로 섹션 - 새로운 그리드 레이아웃 */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600/10 via-accent-600/5 to-neutral-900/10"></div>
        <div className="relative z-10 p-6 lg:p-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* 메인 헤더 - 8컬럼 */}
              <div className="lg:col-span-8 space-y-6">
                <div className="glass-strong rounded-3xl p-8 lg:p-12 shadow-glass border border-white/30 bg-gradient-to-br from-white/95 to-white/80 hover:shadow-glow transition-all duration-700">
                  <div className="space-y-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-4 flex-1">
                        <div className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-brand-100 to-accent-100 rounded-full border border-brand-200/50">
                          <div className="w-3 h-3 bg-gradient-to-r from-brand-500 to-accent-500 rounded-full animate-pulse"></div>
                          <span className="text-brand-700 font-bold text-sm">ADMIN DASHBOARD</span>
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-black gradient-text font-display tracking-tight leading-tight">
                          DB.INFO<br />
                          <span className="text-2xl lg:text-3xl font-semibold text-neutral-600">통합 관리 시스템</span>
                        </h1>
                        <p className="text-lg lg:text-xl text-neutral-600 font-medium leading-relaxed max-w-2xl">
                          기업의 모든 데이터를 하나의 플랫폼에서 관리하세요. 실시간 모니터링과 고급 분석으로 더 스마트한 의사결정을 내리세요.
                        </p>
                      </div>
                    </div>
                    
                    {/* 시스템 상태 바 */}
                    <div className="glass rounded-2xl p-6 bg-gradient-to-r from-success-50/80 to-brand-50/80 border border-success-200/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-success-500 to-brand-500 rounded-2xl flex items-center justify-center shadow-glow">
                            <FaCog className="w-6 h-6 text-white animate-spin-slow" />
                          </div>
                          <div>
                            <h3 className="font-bold text-success-800 text-lg">시스템 상태</h3>
                            <p className="text-success-600">모든 서비스 정상 운영 중</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-success-700">99.9%</div>
                          <div className="text-sm text-success-600">가동률</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 실시간 알림 패널 - 4컬럼 */}
              <div className="lg:col-span-4 space-y-6">
                <div className="glass-strong rounded-3xl p-6 shadow-glass border border-white/30 bg-gradient-to-br from-white/95 to-white/80">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-gradient-to-br from-accent-500 to-brand-500 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.343 12.344l7.078 7.078a1.5 1.5 0 002.121 0l7.078-7.078a1.5 1.5 0 000-2.121L13.542 3.145a1.5 1.5 0 00-2.121 0L4.343 10.223a1.5 1.5 0 000 2.121z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold gradient-text">실시간 알림</h3>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="p-4 bg-gradient-to-r from-brand-50 to-accent-50 rounded-xl border border-brand-200/30 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-brand-500 rounded-full mt-2 animate-pulse"></div>
                          <div className="flex-1">
                            <p className="font-semibold text-brand-800 text-sm">새로운 연차 신청</p>
                            <p className="text-brand-600 text-xs mt-1">{stats.pendingApprovals}건의 승인 대기</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-gradient-to-r from-success-50 to-neutral-50 rounded-xl border border-success-200/30 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-success-500 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <p className="font-semibold text-success-800 text-sm">시스템 업데이트 완료</p>
                            <p className="text-success-600 text-xs mt-1">모든 모듈이 최신 버전으로 업데이트됨</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-gradient-to-r from-warning-50 to-accent-50 rounded-xl border border-warning-200/30 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-warning-500 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <p className="font-semibold text-warning-800 text-sm">백업 스케줄링</p>
                            <p className="text-warning-600 text-xs mt-1">다음 백업: 오늘 오후 11시</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 고급 통계 대시보드 - 새로운 그리드 시스템 */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 -mt-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* 메인 통계 카드들 - 8컬럼 */}
          <div className="lg:col-span-8 space-y-8">
            {/* KPI 카드 그리드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-strong rounded-3xl p-8 shadow-glass border border-white/30 bg-gradient-to-br from-white/95 to-brand-50/50 group hover:shadow-glow transition-all duration-700 hover:scale-[1.02]">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-accent-500 rounded-3xl flex items-center justify-center shadow-glow group-hover:rotate-12 transition-transform duration-500">
                      <FaUsers className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-neutral-700">총 직원 수</h3>
                      <p className="text-sm text-neutral-500">전체 등록 직원</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="text-5xl font-black gradient-text font-display">{stats.totalEmployees}</div>
                  <div className="flex items-center gap-2 text-sm text-success-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <span className="font-semibold">+5.2% 증가</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-brand-500 to-accent-500 h-2 rounded-full" style={{width: '78%'}}></div>
                  </div>
                </div>
              </div>

              <div className="glass-strong rounded-3xl p-8 shadow-glass border border-white/30 bg-gradient-to-br from-white/95 to-success-50/50 group hover:shadow-glow transition-all duration-700 hover:scale-[1.02]">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-success-500 to-brand-500 rounded-3xl flex items-center justify-center shadow-glow group-hover:rotate-12 transition-transform duration-500">
                      <FaCalendarCheck className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-neutral-700">연차 신청</h3>
                      <p className="text-sm text-neutral-500">총 연차 신청 건수</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="text-5xl font-black gradient-text font-display">{stats.totalLeaves}</div>
                  <div className="flex items-center gap-2 text-sm text-success-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <span className="font-semibold">+12.8% 증가</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-success-500 to-brand-500 h-2 rounded-full" style={{width: '65%'}}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* 프로젝트 현황 카드 - 풀 너비 */}
            <div className="glass-strong rounded-3xl p-8 shadow-glass border border-white/30 bg-gradient-to-br from-white/95 to-accent-50/50 group hover:shadow-glow transition-all duration-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-brand-500 rounded-3xl flex items-center justify-center shadow-glow">
                      <FaProjectDiagram className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold gradient-text">프로젝트 현황</h3>
                      <p className="text-neutral-600">진행중인 모든 프로젝트 상태</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center p-4 bg-gradient-to-br from-accent-100 to-brand-100 rounded-2xl">
                      <div className="text-3xl font-black text-accent-700 mb-2">{stats.totalProjects}</div>
                      <div className="text-sm font-semibold text-accent-600">총 프로젝트</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-success-100 to-accent-100 rounded-2xl">
                      <div className="text-3xl font-black text-success-700 mb-2">28</div>
                      <div className="text-sm font-semibold text-success-600">완료 프로젝트</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="relative w-32 h-32 mx-auto">
                      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 144 144">
                        <circle cx="72" cy="72" r="60" fill="none" stroke="#e5e7eb" strokeWidth="8"/>
                        <circle cx="72" cy="72" r="60" fill="none" stroke="url(#gradient)" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${(28/42) * 377} 377`}/>
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#10b981"/>
                            <stop offset="100%" stopColor="#3b82f6"/>
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-neutral-700">67%</span>
                      </div>
                    </div>
                    <p className="text-sm text-neutral-600 mt-2">완료율</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 우측 사이드바 - 4컬럼 */}
          <div className="lg:col-span-4 space-y-6">
            {/* 승인 대기 알림 카드 */}
            <div className="glass-strong rounded-3xl p-6 shadow-glass border border-white/30 bg-gradient-to-br from-white/95 to-warning-50/50 hover:shadow-glow transition-all duration-700">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-warning-500 to-error-500 rounded-2xl flex items-center justify-center shadow-glow">
                    <FaChartBar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-warning-800">승인 대기</h3>
                    <p className="text-sm text-warning-600">즉시 처리 필요</p>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-6xl font-black text-warning-600 mb-2">{stats.pendingApprovals}</div>
                  <div className="text-sm text-warning-700 font-semibold">건의 승인 대기</div>
                </div>
                
                <button className="w-full btn-primary bg-gradient-to-r from-warning-500 to-error-500 text-white py-3 rounded-2xl hover:scale-105 transition-transform duration-300 font-bold shadow-lg">
                  즉시 처리하기
                </button>
              </div>
            </div>

            {/* 최근 활동 */}
            <div className="glass-strong rounded-3xl p-6 shadow-glass border border-white/30 bg-gradient-to-br from-white/95 to-neutral-50/50">
              <h3 className="text-lg font-bold text-neutral-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                최근 활동
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-brand-50 to-accent-50 rounded-xl">
                  <div className="w-8 h-8 bg-brand-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">김</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-neutral-800">김민수 연차 신청</p>
                    <p className="text-xs text-neutral-600">2시간 전</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-success-50 to-brand-50 rounded-xl">
                  <div className="w-8 h-8 bg-success-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">이</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-neutral-800">이영희 프로젝트 완료</p>
                    <p className="text-xs text-neutral-600">4시간 전</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-accent-50 to-warning-50 rounded-xl">
                  <div className="w-8 h-8 bg-accent-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">박</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-neutral-800">박철수 시스템 업데이트</p>
                    <p className="text-xs text-neutral-600">1일 전</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 고급 관리 도구 - 새로운 그리드 레이아웃 */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-brand-100 to-accent-100 rounded-full border border-brand-200/50 mb-6">
            <div className="w-6 h-6 bg-gradient-to-br from-brand-500 to-accent-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-brand-700 font-bold">MANAGEMENT TOOLS</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-black gradient-text font-display mb-4">빠른 작업</h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            효율적인 업무 관리를 위한 핵심 도구들을 한 곳에서 빠르게 접근하세요
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* 주요 관리 도구 - 8컬럼 */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {adminMenus.slice(0, 6).map((menu, index) => {
                const Icon = menu.icon;
                const gradients = [
                  'from-brand-500 to-accent-500',
                  'from-success-500 to-brand-500', 
                  'from-accent-500 to-warning-500',
                  'from-warning-500 to-error-500',
                  'from-brand-500 to-success-500',
                  'from-accent-500 to-brand-500'
                ];
                const bgGradients = [
                  'from-brand-50 to-accent-50',
                  'from-success-50 to-brand-50',
                  'from-accent-50 to-warning-50', 
                  'from-warning-50 to-error-50',
                  'from-brand-50 to-success-50',
                  'from-accent-50 to-brand-50'
                ];
                
                return (
                  <button
                    key={menu.label}
                    className={`group glass-strong rounded-3xl p-8 shadow-glass border border-white/30 bg-gradient-to-br from-white/95 to-white/80 hover:shadow-glow transition-all duration-700 hover:scale-[1.02] text-left overflow-hidden`}
                    onClick={() => navigate(menu.to)}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${bgGradients[index]} opacity-0 group-hover:opacity-50 transition-opacity duration-700`}></div>
                    
                    <div className="relative space-y-6">
                      <div className="flex items-start justify-between">
                        <div className={`w-20 h-20 bg-gradient-to-br ${gradients[index]} rounded-3xl flex items-center justify-center text-white shadow-glow group-hover:rotate-12 group-hover:scale-110 transition-transform duration-500`}>
                          <Icon size={32} />
                        </div>
                        
                        <div className="text-right opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <svg className="w-6 h-6 text-neutral-400 group-hover:text-brand-500 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h3 className="text-2xl font-bold text-neutral-800 group-hover:text-brand-700 transition-colors duration-300">{menu.label}</h3>
                        <p className="text-neutral-600 leading-relaxed group-hover:text-neutral-700 transition-colors duration-300">{menu.desc}</p>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm font-bold text-brand-600 group-hover:text-brand-700 transition-colors duration-300">
                        <span>바로가기</span>
                        <div className="w-4 h-0.5 bg-brand-500 rounded-full group-hover:w-8 transition-all duration-300"></div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 추가 정보 및 도움말 - 4컬럼 */}
          <div className="lg:col-span-4 space-y-6">
            {/* 도움말 카드 */}
            <div className="glass-strong rounded-3xl p-6 shadow-glass border border-white/30 bg-gradient-to-br from-white/95 to-neutral-50/50">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-glow">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-neutral-800">도움말</h3>
                    <p className="text-sm text-neutral-600">관리 가이드</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="p-3 bg-gradient-to-r from-brand-50 to-accent-50 rounded-xl border border-brand-200/30">
                    <h4 className="font-semibold text-brand-800 text-sm mb-1">직원 관리</h4>
                    <p className="text-xs text-brand-600">직원 정보 등록 및 수정 방법</p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-success-50 to-brand-50 rounded-xl border border-success-200/30">
                    <h4 className="font-semibold text-success-800 text-sm mb-1">연차 승인</h4>
                    <p className="text-xs text-success-600">연차 신청 승인 프로세스</p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-accent-50 to-warning-50 rounded-xl border border-accent-200/30">
                    <h4 className="font-semibold text-accent-800 text-sm mb-1">시스템 설정</h4>
                    <p className="text-xs text-accent-600">시스템 환경 설정 가이드</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 시스템 정보 */}
            <div className="glass-strong rounded-3xl p-6 shadow-glass border border-white/30 bg-gradient-to-br from-white/95 to-accent-50/50">
              <h3 className="text-lg font-bold text-neutral-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                시스템 정보
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">서버 상태</span>
                  <span className="text-sm font-semibold text-success-600">정상</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">데이터베이스</span>
                  <span className="text-sm font-semibold text-success-600">연결됨</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">마지막 백업</span>
                  <span className="text-sm font-semibold text-neutral-700">어제 23:00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">버전</span>
                  <span className="text-sm font-semibold text-neutral-700">v2.4.1</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 고급 개발자 도구 - 새로운 위험 관리 그리드 */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-warning-100 to-error-100 rounded-full border border-warning-200/50 mb-6">
            <div className="w-6 h-6 bg-gradient-to-br from-warning-500 to-error-500 rounded-full flex items-center justify-center">
              <FaCog className="w-4 h-4 text-white animate-spin-slow" />
            </div>
            <span className="text-warning-700 font-bold">DEVELOPER TOOLS</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-black gradient-text font-display mb-4">개발자 도구</h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            시스템 유지보수 및 개발을 위한 고급 관리 도구
          </p>
        </div>

        {/* 경고 배너 - 새로운 디자인 */}
        <div className="glass-strong rounded-3xl p-8 shadow-glass border border-warning-300/50 bg-gradient-to-br from-warning-50/90 to-error-50/90 mb-12 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-warning-500/10 to-error-500/10"></div>
          <div className="relative z-10">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-gradient-to-br from-warning-500 to-error-500 rounded-3xl flex items-center justify-center shadow-glow animate-pulse">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-warning-800 mb-2 flex items-center gap-2">
                    ⚠️ 위험 작업 구역
                  </h3>
                  <p className="text-lg text-warning-700 leading-relaxed">
                    아래 기능들은 <strong>개발 및 테스트 전용</strong>입니다. 
                    <span className="text-error-700 font-bold">실제 운영 데이터가 영구적으로 삭제</span>될 수 있으므로 각별한 주의가 필요합니다.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gradient-to-r from-error-100 to-warning-100 rounded-2xl border border-error-200/50">
                    <div className="text-error-700 font-bold text-sm mb-1">🚨 데이터 손실 위험</div>
                    <div className="text-error-600 text-xs">복구 불가능한 삭제</div>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-warning-100 to-accent-100 rounded-2xl border border-warning-200/50">
                    <div className="text-warning-700 font-bold text-sm mb-1">⏱️ 즉시 실행</div>
                    <div className="text-warning-600 text-xs">확인 후 바로 처리</div>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-accent-100 to-brand-100 rounded-2xl border border-accent-200/50">
                    <div className="text-accent-700 font-bold text-sm mb-1">🔒 관리자 전용</div>
                    <div className="text-accent-600 text-xs">최고 권한 필요</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 위험 작업 그리드 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* 데이터 관리 도구 - 8컬럼 */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* 연차 데이터 삭제 */}
              <button 
                onClick={handleClearLeaveData}
                disabled={isDeleting}
                className="group glass-strong rounded-3xl p-8 shadow-glass border border-error-300/50 bg-gradient-to-br from-white/95 to-error-50/50 hover:shadow-glow transition-all duration-700 hover:scale-[1.02] text-left disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-error-500/10 to-warning-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                <div className="relative space-y-6">
                  <div className="flex items-start justify-between">
                    <div className="w-20 h-20 bg-gradient-to-br from-error-500 to-error-600 rounded-3xl flex items-center justify-center text-white shadow-glow group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
                      <FaTrash size={32} />
                    </div>
                    
                    <div className="text-right opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="w-12 h-12 bg-error-100 rounded-2xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-error-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold text-error-800 mb-2">연차 데이터 삭제</h3>
                      <p className="text-error-600 leading-relaxed">
                        시스템의 모든 연차 신청 데이터를 완전히 삭제합니다. 
                        <strong>이 작업은 되돌릴 수 없습니다.</strong>
                      </p>
                    </div>
                    
                    <div className="glass p-4 rounded-2xl border border-error-200/50 bg-gradient-to-r from-error-100/50 to-warning-100/50">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-3 h-3 bg-error-500 rounded-full animate-pulse"></div>
                        <span className="text-error-700 font-bold text-sm">
                          {isDeleting ? '🔄 삭제 처리 중...' : '💀 영구 삭제 작업'}
                        </span>
                      </div>
                      <div className="text-xs text-error-600">
                        현재 {stats.totalLeaves}건의 연차 데이터가 삭제됩니다
                      </div>
                    </div>
                  </div>
                </div>
              </button>

              {/* 대리신청 삭제 */}
              <button 
                onClick={handleClearDeputyRequestData}
                disabled={isDeleting}
                className="group glass-strong rounded-3xl p-8 shadow-glass border border-warning-300/50 bg-gradient-to-br from-white/95 to-warning-50/50 hover:shadow-glow transition-all duration-700 hover:scale-[1.02] text-left disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-warning-500/10 to-error-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                <div className="relative space-y-6">
                  <div className="flex items-start justify-between">
                    <div className="w-20 h-20 bg-gradient-to-br from-warning-500 to-warning-600 rounded-3xl flex items-center justify-center text-white shadow-glow group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
                      <FaTrash size={32} />
                    </div>
                    
                    <div className="text-right opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="w-12 h-12 bg-warning-100 rounded-2xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-warning-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold text-warning-800 mb-2">대리신청 삭제</h3>
                      <p className="text-warning-600 leading-relaxed">
                        모든 대리신청 데이터를 시스템에서 완전히 제거합니다.
                        <strong>복구가 불가능</strong>합니다.
                      </p>
                    </div>
                    
                    <div className="glass p-4 rounded-2xl border border-warning-200/50 bg-gradient-to-r from-warning-100/50 to-accent-100/50">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-3 h-3 bg-warning-500 rounded-full animate-pulse"></div>
                        <span className="text-warning-700 font-bold text-sm">
                          {isDeleting ? '🔄 삭제 처리 중...' : '💀 영구 삭제 작업'}
                        </span>
                      </div>
                      <div className="text-xs text-warning-600">
                        모든 대리신청 기록이 제거됩니다
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            </div>

            {/* 연차 초기화 - 풀 너비 */}
            <div className="mt-8">
              <button 
                onClick={handleResetEmployeeLeaveInfo}
                disabled={isDeleting}
                className="w-full group glass-strong rounded-3xl p-8 shadow-glass border border-brand-300/50 bg-gradient-to-br from-white/95 to-brand-50/50 hover:shadow-glow transition-all duration-700 hover:scale-[1.02] text-left disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 to-accent-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                <div className="relative">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-brand-500 to-accent-500 rounded-3xl flex items-center justify-center text-white shadow-glow group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-brand-800 mb-2">연차 정보 초기화</h3>
                        <p className="text-brand-600">모든 직원의 연차 사용량을 리셋합니다</p>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-4xl font-black text-brand-700 mb-2">{stats.totalEmployees}</div>
                      <div className="text-sm text-brand-600 font-semibold">명의 직원 대상</div>
                    </div>
                    
                    <div className="glass p-4 rounded-2xl border border-brand-200/50 bg-gradient-to-r from-brand-100/50 to-accent-100/50">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-3 h-3 bg-brand-500 rounded-full animate-pulse"></div>
                        <span className="text-brand-700 font-bold text-sm">
                          {isDeleting ? '🔄 처리 중...' : '🔄 초기화 작업'}
                        </span>
                      </div>
                      <div className="text-xs text-brand-600">
                        사용연차: 0일, 잔여연차: 15일로 리셋
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* 시스템 모니터링 - 4컬럼 */}
          <div className="lg:col-span-4 space-y-6">
            {/* 작업 상태 모니터 */}
            <div className="glass-strong rounded-3xl p-6 shadow-glass border border-white/30 bg-gradient-to-br from-white/95 to-neutral-50/50">
              <h3 className="text-lg font-bold text-neutral-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                작업 상태
              </h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-success-50 to-brand-50 rounded-xl border border-success-200/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-success-800">시스템 상태</span>
                    <div className="w-3 h-3 bg-success-500 rounded-full animate-pulse"></div>
                  </div>
                  <div className="text-xs text-success-600">모든 서비스 정상 운영</div>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-brand-50 to-accent-50 rounded-xl border border-brand-200/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-brand-800">데이터베이스</span>
                    <div className="w-3 h-3 bg-brand-500 rounded-full"></div>
                  </div>
                  <div className="text-xs text-brand-600">연결 상태 양호</div>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-warning-50 to-accent-50 rounded-xl border border-warning-200/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-warning-800">백업</span>
                    <div className="w-3 h-3 bg-warning-500 rounded-full animate-pulse"></div>
                  </div>
                  <div className="text-xs text-warning-600">다음: 오늘 23:00</div>
                </div>
              </div>
            </div>

            {/* 작업 로그 */}
            <div className="glass-strong rounded-3xl p-6 shadow-glass border border-white/30 bg-gradient-to-br from-white/95 to-neutral-50/50">
              <h3 className="text-lg font-bold text-neutral-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                작업 로그
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-neutral-50 to-brand-50 rounded-xl">
                  <div className="w-2 h-2 bg-brand-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-neutral-800">시스템 시작</p>
                    <p className="text-xs text-neutral-600">오늘 09:00</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-success-50 to-brand-50 rounded-xl">
                  <div className="w-2 h-2 bg-success-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-neutral-800">백업 완료</p>
                    <p className="text-xs text-neutral-600">어제 23:00</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-warning-50 to-accent-50 rounded-xl">
                  <div className="w-2 h-2 bg-warning-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-neutral-800">업데이트 설치</p>
                    <p className="text-xs text-neutral-600">2일 전</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
