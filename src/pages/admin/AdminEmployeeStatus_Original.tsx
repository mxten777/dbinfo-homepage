import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useNavigate } from 'react-router-dom';

const AdminEmployeeStatus: React.FC = () => {
  console.log('패치 확인: 직원관리 화면');
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'employees'));
      setEmployees(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      setError('직원 데이터를 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleEdit = (id: string) => {
    navigate(`/admin-employee-edit?id=${id}`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      await deleteDoc(doc(db, 'employees', id));
      setEmployees(prev => prev.filter(emp => emp.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-brand-50/20 to-accent-50/20 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 섹션 - 새로운 디자인 */}
        <div className="glass-strong rounded-3xl p-8 mb-8 shadow-glass border border-white/30 bg-gradient-to-br from-white/95 to-white/80">
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-brand-100 to-accent-100 rounded-full border border-brand-200/50">
                <div className="w-3 h-3 bg-gradient-to-r from-brand-500 to-accent-500 rounded-full animate-pulse"></div>
                <span className="text-brand-700 font-bold text-sm">EMPLOYEE MANAGEMENT</span>
              </div>
              <h1 className="text-4xl font-black gradient-text font-display tracking-tight">
                직원정보 상세현황
              </h1>
              <p className="text-neutral-600 text-lg">
                직원들의 연차 정보를 한눈에 확인하고 관리하세요
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="glass rounded-2xl p-4 bg-gradient-to-br from-brand-50/50 to-accent-50/50 border border-brand-200/30">
                <div className="text-center">
                  <div className="text-3xl font-bold text-brand-700">{employees.length}</div>
                  <div className="text-sm text-brand-600 font-medium">총 직원 수</div>
                </div>
              </div>
              
              <button 
                onClick={() => navigate('/admin/employee-register')}
                className="btn-primary bg-gradient-to-r from-brand-500 to-accent-500 text-white px-6 py-3 rounded-2xl hover:scale-105 transition-transform duration-300 font-bold shadow-glow flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                직원 추가
              </button>
            </div>
          </div>
        </div>

        {/* 메인 컨텐츠 */}
        <div className="glass-strong rounded-3xl shadow-glass border border-white/30 bg-gradient-to-br from-white/95 to-white/80 overflow-hidden">
          {loading ? (
            <div className="p-16 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-accent-500 rounded-3xl flex items-center justify-center mx-auto mb-6 animate-pulse">
                <svg className="w-8 h-8 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold gradient-text mb-2">데이터 로딩 중</h3>
              <p className="text-neutral-600">직원 정보를 불러오고 있습니다...</p>
            </div>
          ) : error ? (
            <div className="p-16 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-error-500 to-warning-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-error-700 mb-2">오류 발생</h3>
              <p className="text-error-600">{error}</p>
              <button 
                onClick={fetchEmployees}
                className="mt-4 btn-secondary bg-gradient-to-r from-error-500 to-warning-500 text-white px-6 py-2 rounded-xl hover:scale-105 transition-transform duration-300"
              >
                다시 시도
              </button>
            </div>
          ) : employees.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-neutral-400 to-neutral-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-neutral-700 mb-2">직원이 없습니다</h3>
              <p className="text-neutral-600 mb-6">아직 등록된 직원이 없습니다. 첫 번째 직원을 추가해보세요.</p>
              <button 
                onClick={() => navigate('/admin/employee-register')}
                className="btn-primary bg-gradient-to-r from-brand-500 to-accent-500 text-white px-8 py-3 rounded-2xl hover:scale-105 transition-transform duration-300 font-bold"
              >
                직원 추가하기
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {/* 새로운 고급 테이블 디자인 */}
              <div className="min-w-full">
                {/* 테이블 헤더 */}
                <div className="bg-gradient-to-r from-neutral-900 via-brand-900 to-accent-900 text-white">
                  <div className="grid grid-cols-11 gap-4 p-6 font-bold text-sm tracking-wide uppercase">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      이름
                    </div>
                    <div>이메일</div>
                    <div>사번</div>
                    <div>직급</div>
                    <div className="text-center">이월</div>
                    <div className="text-center">발생</div>
                    <div className="text-center">총연차</div>
                    <div className="text-center">사용</div>
                    <div className="text-center">잔여</div>
                    <div className="text-center">관리</div>
                    <div className="text-center">작업</div>
                  </div>
                </div>

                {/* 테이블 바디 */}
                <div className="divide-y divide-neutral-200/50">
                  {employees.map((emp, index) => {
                    const usedRatio = emp.totalLeaves > 0 ? (emp.usedLeaves / emp.totalLeaves) * 100 : 0;
                    const remainingLeaves = (emp.totalLeaves ?? 0) - (emp.usedLeaves ?? 0);
                    
                    return (
                      <div 
                        key={emp.id} 
                        className="grid grid-cols-11 gap-4 p-6 hover:bg-gradient-to-r hover:from-brand-50/30 hover:to-accent-50/30 transition-all duration-300 group"
                      >
                        {/* 이름 */}
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-accent-500 rounded-2xl flex items-center justify-center text-white font-bold shadow-glow">
                            {emp.name?.charAt(0) || 'N'}
                          </div>
                          <div>
                            <div className="font-bold text-neutral-800">{emp.name}</div>
                            <div className="text-xs text-neutral-500">직원 #{index + 1}</div>
                          </div>
                        </div>

                        {/* 이메일 */}
                        <div className="flex items-center">
                          <div>
                            <div className="font-medium text-neutral-700">{emp.email}</div>
                            <div className="text-xs text-neutral-500">연락처</div>
                          </div>
                        </div>

                        {/* 사번 */}
                        <div className="flex items-center">
                          <div className="px-3 py-1 bg-neutral-100 rounded-lg text-sm font-mono font-bold text-neutral-700">
                            {emp.empNo}
                          </div>
                        </div>

                        {/* 직급 */}
                        <div className="flex items-center">
                          <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                            emp.position === '관리자' ? 'bg-gradient-to-r from-brand-100 to-accent-100 text-brand-700' :
                            emp.position === '팀장' ? 'bg-gradient-to-r from-success-100 to-brand-100 text-success-700' :
                            'bg-gradient-to-r from-neutral-100 to-accent-100 text-neutral-700'
                          }`}>
                            {emp.position}
                          </div>
                        </div>

                        {/* 이월연차 */}
                        <div className="flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-lg font-bold text-neutral-700">{emp.carryOverLeaves ?? 0}</div>
                            <div className="text-xs text-neutral-500">일</div>
                          </div>
                        </div>

                        {/* 발생연차 */}
                        <div className="flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-lg font-bold text-brand-600">{emp.annualLeaves ?? 15}</div>
                            <div className="text-xs text-brand-500">일</div>
                          </div>
                        </div>

                        {/* 총연차 */}
                        <div className="flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-lg font-bold text-accent-600">{emp.totalLeaves ?? 15}</div>
                            <div className="text-xs text-accent-500">일</div>
                          </div>
                        </div>

                        {/* 사용연차 */}
                        <div className="flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-lg font-bold text-warning-600">{emp.usedLeaves ?? 0}</div>
                            <div className="text-xs text-warning-500">일</div>
                          </div>
                        </div>

                        {/* 잔여연차 */}
                        <div className="flex items-center justify-center">
                          <div className="text-center">
                            <div className={`text-lg font-bold ${remainingLeaves > 10 ? 'text-success-600' : remainingLeaves > 5 ? 'text-warning-600' : 'text-error-600'}`}>
                              {remainingLeaves}
                            </div>
                            <div className="text-xs text-neutral-500">일</div>
                            {/* 진행률 바 */}
                            <div className="w-16 h-1.5 bg-neutral-200 rounded-full mx-auto mt-1 overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all duration-500 ${
                                  usedRatio > 80 ? 'bg-gradient-to-r from-error-500 to-warning-500' :
                                  usedRatio > 50 ? 'bg-gradient-to-r from-warning-500 to-success-500' :
                                  'bg-gradient-to-r from-success-500 to-brand-500'
                                }`}
                                style={{ width: `${Math.min(usedRatio, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        {/* 관리 */}
                        <div className="flex items-center justify-center">
                          <button 
                            onClick={() => handleEdit(emp.id)}
                            className="group/btn w-10 h-10 bg-gradient-to-br from-brand-500 to-accent-500 rounded-xl flex items-center justify-center text-white hover:scale-110 transition-transform duration-300 shadow-glow hover:shadow-xl"
                            title="정보 수정"
                          >
                            <svg className="w-5 h-5 group-hover/btn:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        </div>

                        {/* 작업 */}
                        <div className="flex items-center justify-center">
                          <button 
                            onClick={() => handleDelete(emp.id)}
                            className="group/btn w-10 h-10 bg-gradient-to-br from-error-500 to-warning-500 rounded-xl flex items-center justify-center text-white hover:scale-110 transition-transform duration-300 shadow-glow hover:shadow-xl"
                            title="직원 삭제"
                          >
                            <svg className="w-5 h-5 group-hover/btn:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 요약 통계 */}
        {employees.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="glass rounded-3xl p-6 border border-success-200/30 bg-gradient-to-br from-success-50/50 to-brand-50/50">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-success-500 to-brand-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-2xl font-bold text-success-700">{employees.reduce((sum, emp) => sum + (emp.totalLeaves ?? 0), 0)}</div>
                <div className="text-sm text-success-600 font-medium">총 연차일수</div>
              </div>
            </div>

            <div className="glass rounded-3xl p-6 border border-warning-200/30 bg-gradient-to-br from-warning-50/50 to-accent-50/50">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-warning-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-2xl font-bold text-warning-700">{employees.reduce((sum, emp) => sum + (emp.usedLeaves ?? 0), 0)}</div>
                <div className="text-sm text-warning-600 font-medium">사용 연차일수</div>
              </div>
            </div>

            <div className="glass rounded-3xl p-6 border border-brand-200/30 bg-gradient-to-br from-brand-50/50 to-accent-50/50">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="text-2xl font-bold text-brand-700">{employees.reduce((sum, emp) => sum + ((emp.totalLeaves ?? 0) - (emp.usedLeaves ?? 0)), 0)}</div>
                <div className="text-sm text-brand-600 font-medium">잔여 연차일수</div>
              </div>
            </div>

            <div className="glass rounded-3xl p-6 border border-accent-200/30 bg-gradient-to-br from-accent-50/50 to-neutral-50/50">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-neutral-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-2xl font-bold text-accent-700">
                  {Math.round((employees.reduce((sum, emp) => sum + (emp.usedLeaves ?? 0), 0) / employees.reduce((sum, emp) => sum + (emp.totalLeaves ?? 0), 0)) * 100) || 0}%
                </div>
                <div className="text-sm text-accent-600 font-medium">평균 사용률</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEmployeeStatus;
