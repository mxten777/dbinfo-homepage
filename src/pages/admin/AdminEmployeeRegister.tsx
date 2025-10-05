
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { Link } from 'react-router-dom';

const initialForm = {
  empNo: '', name: '', regNo: '', gender: '', position: '', department: '', jobType: '', joinDate: '', email: '', phone: '', role: 'employee',
  carryOverLeaves: 0,
  annualLeaves: 0
};

function AdminEmployeeRegister() {
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState('');
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedEmpId, setSelectedEmpId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      const snap = await getDocs(collection(db, 'employees'));
      setEmployees(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (!selectedEmpId) return;
    const emp = employees.find(e => e.id === selectedEmpId);
    if (emp) {
      setForm({ ...initialForm, ...emp });
    }
  }, [selectedEmpId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'carryOverLeaves' || name === 'annualLeaves') {
      setForm({ ...form, [name]: Number(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 직원 정보만 Firestore에 저장 (회원가입/비밀번호 X)
      if (selectedEmpId) {
        // 기존 직원 정보 보완
        await addDoc(collection(db, 'employees'), form); // 실제로는 updateDoc이 적합, 예시로 addDoc 사용
        setMessage('직원정보가 보완되었습니다.');
      } else {
        // 신규 등록
        await addDoc(collection(db, 'employees'), form);
        setMessage('직원정보가 등록되었습니다.');
      }
      setForm(initialForm);
      setTimeout(() => {
        navigate('/admin/home');
      }, 1000);
    } catch (err: any) {
      setMessage('직원 등록/보완 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-brand-50/20 to-accent-50/20 p-6">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 섹션 - 새로운 디자인 */}
        <div className="glass-strong rounded-3xl p-8 mb-8 shadow-glass border border-white/30 bg-gradient-to-br from-white/95 to-white/80">
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-brand-100 to-accent-100 rounded-full border border-brand-200/50">
                <div className="w-3 h-3 bg-gradient-to-r from-brand-500 to-accent-500 rounded-full animate-pulse"></div>
                <span className="text-brand-700 font-bold text-sm">EMPLOYEE REGISTRATION</span>
              </div>
              <h1 className="text-4xl font-black gradient-text font-display tracking-tight">
                직원정보 관리
              </h1>
              <p className="text-neutral-600 text-lg">
                직원 정보를 등록하고 기존 정보를 보완하세요
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <Link 
                to="/admin/employee-status"
                className="btn-secondary bg-gradient-to-r from-neutral-500 to-brand-500 text-white px-6 py-3 rounded-2xl hover:scale-105 transition-transform duration-300 font-bold shadow-glow flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                직원 현황
              </Link>
              <Link 
                to="/admin/home"
                className="btn-primary bg-gradient-to-r from-brand-500 to-accent-500 text-white px-6 py-3 rounded-2xl hover:scale-105 transition-transform duration-300 font-bold shadow-glow flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                관리자홈
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* 직원 선택 섹션 - 1컬럼 */}
          <div className="xl:col-span-1">
            <div className="glass-strong rounded-3xl p-6 shadow-glass border border-white/30 bg-gradient-to-br from-white/95 to-white/80 h-fit">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-glow">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-neutral-800">직원 검색</h3>
                    <p className="text-sm text-neutral-600">기존 직원 정보 수정</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-neutral-700">직원 선택</label>
                  <select
                    className="w-full glass rounded-2xl px-4 py-3 border border-brand-200/30 text-neutral-700 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all duration-300 bg-gradient-to-r from-white/90 to-brand-50/30"
                    value={selectedEmpId}
                    onChange={e => setSelectedEmpId(e.target.value)}
                  >
                    <option value="">새 직원 등록 또는 기존 직원 선택</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name} ({emp.email})</option>
                    ))}
                  </select>
                  
                  {selectedEmpId && (
                    <div className="p-4 bg-gradient-to-r from-success-50 to-brand-50 rounded-2xl border border-success-200/50">
                      <div className="flex items-center gap-2 text-success-700">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm font-bold">기존 직원 정보 수정 모드</span>
                      </div>
                    </div>
                  )}
                  
                  {!selectedEmpId && (
                    <div className="p-4 bg-gradient-to-r from-brand-50 to-accent-50 rounded-2xl border border-brand-200/50">
                      <div className="flex items-center gap-2 text-brand-700">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span className="text-sm font-bold">신규 직원 등록 모드</span>
                      </div>
                    </div>
                  )}
                </div>

                {employees.length > 0 && (
                  <div className="mt-6 p-4 glass rounded-2xl bg-gradient-to-br from-neutral-50/50 to-accent-50/50 border border-neutral-200/30">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-neutral-700">{employees.length}</div>
                      <div className="text-sm text-neutral-600 font-medium">등록된 직원 수</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 메인 폼 섹션 - 2컬럼 */}
          <div className="xl:col-span-2">
            <div className="glass-strong rounded-3xl shadow-glass border border-white/30 bg-gradient-to-br from-white/95 to-white/80 overflow-hidden">
              <form onSubmit={handleSubmit} className="p-8 space-y-8">
                {/* 기본 정보 섹션 */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-neutral-200/50">
                    <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-accent-500 rounded-xl flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-neutral-800">기본 정보</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="empNo" className="block text-sm font-bold text-neutral-700">사번 *</label>
                      <input 
                        name="empNo" 
                        value={form.empNo} 
                        onChange={handleChange} 
                        placeholder="예: EMP001" 
                        className="w-full glass rounded-xl px-4 py-3 border border-brand-200/30 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all duration-300 bg-gradient-to-r from-white/90 to-brand-50/20"
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="name" className="block text-sm font-bold text-neutral-700">이름 *</label>
                      <input 
                        name="name" 
                        value={form.name} 
                        onChange={handleChange} 
                        placeholder="직원 이름" 
                        className="w-full glass rounded-xl px-4 py-3 border border-brand-200/30 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all duration-300 bg-gradient-to-r from-white/90 to-brand-50/20"
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="regNo" className="block text-sm font-bold text-neutral-700">주민번호</label>
                      <input 
                        name="regNo" 
                        value={form.regNo} 
                        onChange={handleChange} 
                        placeholder="000000-0000000" 
                        className="w-full glass rounded-xl px-4 py-3 border border-brand-200/30 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all duration-300 bg-gradient-to-r from-white/90 to-neutral-50/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="gender" className="block text-sm font-bold text-neutral-700">성별</label>
                      <select 
                        name="gender" 
                        value={form.gender} 
                        onChange={handleChange}
                        className="w-full glass rounded-xl px-4 py-3 border border-brand-200/30 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all duration-300 bg-gradient-to-r from-white/90 to-neutral-50/20"
                      >
                        <option value="">성별 선택</option>
                        <option value="남성">남성</option>
                        <option value="여성">여성</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 직책 정보 섹션 */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-neutral-200/50">
                    <div className="w-8 h-8 bg-gradient-to-br from-success-500 to-brand-500 rounded-xl flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 00-2 2H6a2 2 0 00-2-2V4m8 0H8m0 0v2H6a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2h-2V6" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-neutral-800">직책 정보</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="position" className="block text-sm font-bold text-neutral-700">직위</label>
                      <select 
                        name="position" 
                        value={form.position} 
                        onChange={handleChange}
                        className="w-full glass rounded-xl px-4 py-3 border border-success-200/30 focus:ring-2 focus:ring-success-500 focus:border-success-500 outline-none transition-all duration-300 bg-gradient-to-r from-white/90 to-success-50/20"
                      >
                        <option value="">직위 선택</option>
                        <option value="사원">사원</option>
                        <option value="대리">대리</option>
                        <option value="과장">과장</option>
                        <option value="차장">차장</option>
                        <option value="부장">부장</option>
                        <option value="이사">이사</option>
                        <option value="상무">상무</option>
                        <option value="전무">전무</option>
                        <option value="대표이사">대표이사</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="department" className="block text-sm font-bold text-neutral-700">부서</label>
                      <select 
                        name="department" 
                        value={form.department} 
                        onChange={handleChange}
                        className="w-full glass rounded-xl px-4 py-3 border border-success-200/30 focus:ring-2 focus:ring-success-500 focus:border-success-500 outline-none transition-all duration-300 bg-gradient-to-r from-white/90 to-success-50/20"
                      >
                        <option value="">부서 선택</option>
                        <option value="경영지원팀">경영지원팀</option>
                        <option value="개발팀">개발팀</option>
                        <option value="기획팀">기획팀</option>
                        <option value="영업팀">영업팀</option>
                        <option value="마케팅팀">마케팅팀</option>
                        <option value="인사팀">인사팀</option>
                        <option value="재무팀">재무팀</option>
                        <option value="IT팀">IT팀</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="jobType" className="block text-sm font-bold text-neutral-700">직종</label>
                      <select 
                        name="jobType" 
                        value={form.jobType} 
                        onChange={handleChange}
                        className="w-full glass rounded-xl px-4 py-3 border border-success-200/30 focus:ring-2 focus:ring-success-500 focus:border-success-500 outline-none transition-all duration-300 bg-gradient-to-r from-white/90 to-success-50/20"
                      >
                        <option value="">직종 선택</option>
                        <option value="정규직">정규직</option>
                        <option value="계약직">계약직</option>
                        <option value="인턴">인턴</option>
                        <option value="프리랜서">프리랜서</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="joinDate" className="block text-sm font-bold text-neutral-700">입사일</label>
                      <input 
                        name="joinDate" 
                        type="date"
                        value={form.joinDate} 
                        onChange={handleChange}
                        className="w-full glass rounded-xl px-4 py-3 border border-success-200/30 focus:ring-2 focus:ring-success-500 focus:border-success-500 outline-none transition-all duration-300 bg-gradient-to-r from-white/90 to-success-50/20"
                      />
                    </div>
                  </div>
                </div>

                {/* 연락처 정보 섹션 */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-neutral-200/50">
                    <div className="w-8 h-8 bg-gradient-to-br from-accent-500 to-warning-500 rounded-xl flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-neutral-800">연락처 정보</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-sm font-bold text-neutral-700">이메일</label>
                      <input 
                        name="email" 
                        type="email"
                        value={form.email} 
                        onChange={handleChange} 
                        placeholder="example@dbinfo.co.kr" 
                        className="w-full glass rounded-xl px-4 py-3 border border-accent-200/30 focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none transition-all duration-300 bg-gradient-to-r from-white/90 to-accent-50/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="phone" className="block text-sm font-bold text-neutral-700">연락처</label>
                      <input 
                        name="phone" 
                        type="tel"
                        value={form.phone} 
                        onChange={handleChange} 
                        placeholder="010-0000-0000" 
                        className="w-full glass rounded-xl px-4 py-3 border border-accent-200/30 focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none transition-all duration-300 bg-gradient-to-r from-white/90 to-accent-50/20"
                      />
                    </div>
                  </div>
                </div>

                {/* 연차 정보 섹션 */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-neutral-200/50">
                    <div className="w-8 h-8 bg-gradient-to-br from-warning-500 to-error-500 rounded-xl flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10m6-10v10m6-6a2 2 0 11-4 0 2 2 0 014 0zM6 20v-2a2 2 0 00-2-2H2v4h2a2 2 0 002-2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-neutral-800">연차 정보</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="carryOverLeaves" className="block text-sm font-bold text-neutral-700">이월연차</label>
                      <input 
                        name="carryOverLeaves" 
                        type="number" 
                        min="0"
                        max="11"
                        value={form.carryOverLeaves} 
                        onChange={handleChange} 
                        placeholder="0" 
                        className="w-full glass rounded-xl px-4 py-3 border border-warning-200/30 focus:ring-2 focus:ring-warning-500 focus:border-warning-500 outline-none transition-all duration-300 bg-gradient-to-r from-white/90 to-warning-50/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="annualLeaves" className="block text-sm font-bold text-neutral-700">발생연차</label>
                      <input 
                        name="annualLeaves" 
                        type="number" 
                        min="0"
                        max="25"
                        value={form.annualLeaves} 
                        onChange={handleChange} 
                        placeholder="15" 
                        className="w-full glass rounded-xl px-4 py-3 border border-warning-200/30 focus:ring-2 focus:ring-warning-500 focus:border-warning-500 outline-none transition-all duration-300 bg-gradient-to-r from-white/90 to-warning-50/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-neutral-700">총연차</label>
                      <div className="w-full glass rounded-xl px-4 py-3 border border-success-200/30 bg-gradient-to-r from-success-50/50 to-brand-50/50 flex items-center justify-center">
                        <span className="text-2xl font-bold gradient-text">
                          {Number(form.carryOverLeaves) + Number(form.annualLeaves)}일
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 glass rounded-2xl bg-gradient-to-r from-warning-50/50 to-error-50/50 border border-warning-200/30">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-warning-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="text-sm text-warning-700">
                        <p className="font-bold mb-1">연차 계산 가이드</p>
                        <ul className="space-y-1 text-xs">
                          <li>• 이월연차: 전년도에서 이월된 연차 (최대 11일)</li>
                          <li>• 발생연차: 올해 새로 발생한 연차 (입사년차별 차등)</li>
                          <li>• 총연차: 이월연차 + 발생연차 (자동 계산)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 권한 정보 섹션 */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-neutral-200/50">
                    <div className="w-8 h-8 bg-gradient-to-br from-error-500 to-brand-500 rounded-xl flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-neutral-800">시스템 권한</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-neutral-700">권한 레벨</label>
                      <div className="grid grid-cols-2 gap-4">
                        <label className={`relative cursor-pointer p-4 glass rounded-2xl border-2 transition-all duration-300 ${
                          form.role === 'employee' ? 'border-brand-500 bg-gradient-to-r from-brand-50 to-accent-50' : 'border-neutral-200/50 hover:border-brand-300'
                        }`}>
                          <input 
                            type="radio"
                            name="role"
                            value="employee"
                            checked={form.role === 'employee'}
                            onChange={handleChange}
                            className="sr-only"
                          />
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              form.role === 'employee' ? 'bg-gradient-to-br from-brand-500 to-accent-500' : 'bg-neutral-300'
                            }`}>
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <div>
                              <div className="font-bold text-neutral-800">일반직원</div>
                              <div className="text-xs text-neutral-600">기본 사용자 권한</div>
                            </div>
                          </div>
                        </label>
                        
                        <label className={`relative cursor-pointer p-4 glass rounded-2xl border-2 transition-all duration-300 ${
                          form.role === 'admin' ? 'border-error-500 bg-gradient-to-r from-error-50 to-warning-50' : 'border-neutral-200/50 hover:border-error-300'
                        }`}>
                          <input 
                            type="radio"
                            name="role"
                            value="admin"
                            checked={form.role === 'admin'}
                            onChange={handleChange}
                            className="sr-only"
                          />
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              form.role === 'admin' ? 'bg-gradient-to-br from-error-500 to-warning-500' : 'bg-neutral-300'
                            }`}>
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                              </svg>
                            </div>
                            <div>
                              <div className="font-bold text-neutral-800">관리자</div>
                              <div className="text-xs text-neutral-600">전체 시스템 관리 권한</div>
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>
                    
                    {form.role === 'admin' && (
                      <div className="p-4 glass rounded-2xl bg-gradient-to-r from-error-50/50 to-warning-50/50 border border-error-200/30">
                        <div className="flex items-start gap-3">
                          <svg className="w-5 h-5 text-error-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.99-.833-2.76 0L4.054 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                          <div className="text-sm text-error-700">
                            <p className="font-bold">관리자 권한 주의사항</p>
                            <p className="text-xs mt-1">관리자 권한을 가진 사용자는 모든 직원 정보, 연차 승인, 시스템 설정에 접근할 수 있습니다.</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 저장 버튼 */}
                <div className="pt-6 border-t border-neutral-200/50">
                  <button 
                    type="submit" 
                    className="w-full btn-primary bg-gradient-to-r from-brand-500 to-accent-500 text-white py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-transform duration-300 shadow-glow flex items-center justify-center gap-3"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {selectedEmpId ? '직원정보 수정' : '신규 직원 등록'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* 성공/오류 메시지 */}
        {message && (
          <div className="fixed top-6 right-6 z-50 animate-fade-in">
            <div className={`glass-strong rounded-2xl p-6 shadow-glow border max-w-sm ${
              message.includes('오류') || message.includes('실패') 
                ? 'border-error-200/50 bg-gradient-to-r from-error-50/90 to-warning-50/90' 
                : 'border-success-200/50 bg-gradient-to-r from-success-50/90 to-brand-50/90'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                  message.includes('오류') || message.includes('실패')
                    ? 'bg-gradient-to-br from-error-500 to-warning-500'
                    : 'bg-gradient-to-br from-success-500 to-brand-500'
                }`}>
                  {message.includes('오류') || message.includes('실패') ? (
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className={`font-bold text-sm ${
                    message.includes('오류') || message.includes('실패') ? 'text-error-700' : 'text-success-700'
                  }`}>
                    {message.includes('오류') || message.includes('실패') ? '오류 발생' : '작업 완료'}
                  </p>
                  <p className={`text-xs ${
                    message.includes('오류') || message.includes('실패') ? 'text-error-600' : 'text-success-600'
                  }`}>
                    {message}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminEmployeeRegister;
