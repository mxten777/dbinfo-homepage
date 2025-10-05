import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { db } from '../firebaseConfig';
import type { Leave, Employee } from '../types/employee';
import { useAuth } from '../AuthContext';
import CompanyNewsList from '../components/CompanyNewsList';

// 🎨 스타일 시스템
const STYLES = {
  card: "glass-card rounded-3xl shadow-glass border border-white/20 bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl",
  primaryButton: "btn-primary bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105",
  secondaryButton: "glass rounded-xl px-6 py-3 border border-blue-200/50 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 font-semibold hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 hover:scale-105",
  dangerButton: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-red-500/25 transition-all duration-300 hover:scale-105",
  input: "glass rounded-xl px-4 py-3 border border-blue-200/30 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 bg-white/50",
  badge: "inline-flex items-center px-3 py-1 rounded-full text-sm font-bold",
  iconBox: "w-12 h-12 rounded-2xl flex items-center justify-center",
} as const;

// 📊 통계 카드 컴포넌트
const StatsCard: React.FC<{
  title: string;
  value: number;
  total?: number;
  icon: React.ReactNode;
  color: string;
  trend?: { value: number; isPositive: boolean };
}> = ({ title, value, total, icon, color, trend }) => (
  <div className={`${STYLES.card} p-6 group hover:shadow-xl transition-all duration-500 hover:-translate-y-2`}>
    <div className="flex items-start justify-between mb-4">
      <div className={`${STYLES.iconBox} bg-gradient-to-br ${color} shadow-lg`}>
        {icon}
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-sm font-semibold ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d={trend.isPositive 
              ? "M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L10 4.414 4.707 9.707a1 1 0 01-1.414 0z"
              : "M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L10 15.586l5.293-5.293a1 1 0 011.414 0z"
            } clipRule="evenodd" />
          </svg>
          {trend.value}
        </div>
      )}
    </div>
    
    <div className="space-y-2">
      <div className="text-3xl font-black text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
        {value}{total ? `/${total}` : ''}
      </div>
      <div className="text-sm font-medium text-gray-600">{title}</div>
      
      {total && (
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>사용률</span>
            <span>{Math.round((value / total) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-1000 ease-out`}
              style={{ width: `${Math.min((value / total) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  </div>
);

// 🎯 퀵 액션 버튼
const QuickActionButton: React.FC<{
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClick: () => void;
  color: string;
}> = ({ icon, title, subtitle, onClick, color }) => (
  <button
    onClick={onClick}
    className={`${STYLES.card} p-6 text-left group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:scale-105`}
  >
    <div className="flex items-start gap-4">
      <div className={`${STYLES.iconBox} bg-gradient-to-br ${color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <div>
        <div className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">{title}</div>
        <div className="text-sm text-gray-500 mt-1">{subtitle}</div>
      </div>
    </div>
  </button>
);

const EmployeeHome: React.FC = () => {
  // 연차 일수 자동 계산 함수
  const calculateLeaveDays = (start: string, end: string, type: string) => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diff = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24) + 1;
    if (type === '반차') return 0.5;
    return diff;
  };

  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [form, setForm] = useState({ 
    startDate: '', 
    endDate: '', 
    reason: '',
    type: '연차' as '연차' | '반차' | '병가' | '기타'
  });
  const [message, setMessage] = useState('');
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordMessage, setPasswordMessage] = useState('');

  // 🎨 애니메이션을 위한 상태
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const leaveSnap = await getDocs(collection(db, 'leaves'));
      setLeaves(
        leaveSnap.docs
          .filter(doc => doc.data().employeeId === user?.uid)
          .map(doc => {
            const data = doc.data();
            let days = data.days;
            if (typeof days === 'undefined' || days === null) {
              days = data.type === '반차' ? 0.5 : ((new Date(data.endDate).getTime() - new Date(data.startDate).getTime()) / (1000 * 60 * 60 * 24) + 1);
            } else if (typeof days === 'string') {
              days = Number(days);
              if (isNaN(days)) days = 0;
            }
            return { id: doc.id, ...data, days } as Leave;
          })
      );

      const employeesSnap = await getDocs(collection(db, 'employees'));
      const emp = employeesSnap.docs.find(doc => doc.data().uid === user?.uid);
      if (emp) {
        setEmployee({ id: emp.id, ...emp.data() } as Employee);
      }
      
      // 로딩 완료 애니메이션
      setTimeout(() => setIsLoaded(true), 300);
    };
    
    fetchData();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/employee-login');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.startDate || !form.endDate || !form.reason) {
      setMessage('모든 필드를 입력해주세요.');
      return;
    }

    const calculatedDays = calculateLeaveDays(form.startDate, form.endDate, form.type);
    
    try {
      const leaveRef = doc(collection(db, 'leaves'));
      await updateDoc(leaveRef, {
        employeeId: user?.uid,
        employeeName: employee?.name || user?.email?.split('@')[0] || '',
        startDate: form.startDate,
        endDate: form.endDate,
        reason: form.reason,
        type: form.type,
        days: calculatedDays,
        status: '신청',
        createdAt: new Date().toISOString()
      });

      setMessage('연차 신청이 완료되었습니다.');
      setForm({ startDate: '', endDate: '', reason: '', type: '연차' });
      setShowLeaveForm(false);
      
      // 목록 새로고침
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      setMessage('신청 중 오류가 발생했습니다.');
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage('새 비밀번호가 일치하지 않습니다.');
      return;
    }
    
    try {
      if (user) {
        const credential = EmailAuthProvider.credential(user.email!, passwordForm.currentPassword);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, passwordForm.newPassword);
        setPasswordMessage('비밀번호가 성공적으로 변경되었습니다.');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setShowPasswordChange(false);
      }
    } catch (error) {
      setPasswordMessage('비밀번호 변경에 실패했습니다. 현재 비밀번호를 확인해주세요.');
    }
  };

  const getLeaveStatusBadge = (status: string) => {
    const statusConfig = {
      '신청': { color: 'from-yellow-400 to-yellow-500', text: 'text-white' },
      '승인': { color: 'from-green-400 to-green-500', text: 'text-white' },
      '반려': { color: 'from-red-400 to-red-500', text: 'text-white' }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['신청'];
    
    return (
      <span className={`${STYLES.badge} bg-gradient-to-r ${config.color} ${config.text} shadow-lg`}>
        {status}
      </span>
    );
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-lg font-semibold text-gray-600">로딩 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* 🎨 배경 장식 요소들 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-200/20 rounded-full blur-2xl animate-pulse"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* 🏠 헤더 섹션 */}
        <div className={`${STYLES.card} p-8 mb-8 transform transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <div className="text-3xl font-black text-gray-800 mb-1">
                  안녕하세요, {employee?.name || '직원'}님! 👋
                </div>
                <div className="text-lg text-gray-600 font-medium">
                  {employee?.email || user?.email}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  오늘도 좋은 하루 되세요!
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className={STYLES.dangerButton}
            >
              <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              로그아웃
            </button>
          </div>
        </div>

        {/* 📊 연차 통계 대시보드 */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 transform transition-all duration-700 delay-200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <StatsCard
            title="총 연차"
            value={employee?.totalLeaves || 0}
            icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
            color="from-blue-500 to-blue-600"
          />
          <StatsCard
            title="사용한 연차"
            value={employee?.usedLeaves || 0}
            total={employee?.totalLeaves || 0}
            icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            color="from-green-500 to-green-600"
          />
          <StatsCard
            title="남은 연차"
            value={employee?.remainingLeaves || 0}
            icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            color="from-purple-500 to-purple-600"
            trend={{ value: 12, isPositive: true }}
          />
        </div>

        {/* 🎯 퀵 액션 버튼들 */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 transform transition-all duration-700 delay-400 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <QuickActionButton
            icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>}
            title="연차 신청"
            subtitle="새로운 연차를 신청하세요"
            onClick={() => setShowLeaveForm(true)}
            color="from-blue-500 to-indigo-600"
          />
          <QuickActionButton
            icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>}
            title="비밀번호 변경"
            subtitle="계정 보안을 강화하세요"
            onClick={() => setShowPasswordChange(true)}
            color="from-orange-500 to-red-600"
          />
          <QuickActionButton
            icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
            title="연차 내역"
            subtitle="신청 이력을 확인하세요"
            onClick={() => document.getElementById('leave-history')?.scrollIntoView({ behavior: 'smooth' })}
            color="from-teal-500 to-cyan-600"
          />
          <QuickActionButton
            icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>}
            title="사내 소식"
            subtitle="최신 공지사항을 확인하세요"
            onClick={() => document.getElementById('company-news')?.scrollIntoView({ behavior: 'smooth' })}
            color="from-violet-500 to-purple-600"
          />
        </div>

        {/* 💬 메시지 표시 */}
        {message && (
          <div className={`${STYLES.card} p-4 mb-6 border-l-4 ${message.includes('실패') || message.includes('오류') ? 'border-red-500 bg-red-50' : 'border-green-500 bg-green-50'}`}>
            <div className={`font-semibold ${message.includes('실패') || message.includes('오류') ? 'text-red-700' : 'text-green-700'}`}>
              {message}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 📋 연차 신청 내역 */}
          <div id="leave-history" className={`transform transition-all duration-700 delay-600 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className={`${STYLES.card} p-6`}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">연차 신청 내역</h3>
                  <p className="text-sm text-gray-500">최근 신청한 연차들을 확인하세요</p>
                </div>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {leaves.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div className="text-gray-500 font-medium">아직 신청한 연차가 없습니다</div>
                    <div className="text-sm text-gray-400 mt-1">연차 신청 버튼을 눌러 휴가를 신청해보세요</div>
                  </div>
                ) : (
                  leaves.map((leave) => (
                    <div key={leave.id} className="glass rounded-2xl p-4 border border-gray-200/50 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className={`${STYLES.badge} ${leave.type === '연차' ? 'bg-blue-100 text-blue-700' : leave.type === '반차' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                            {leave.type}
                          </span>
                          <span className="font-semibold text-gray-800">{leave.days}일</span>
                        </div>
                        {getLeaveStatusBadge(leave.status)}
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div><span className="font-medium">기간:</span> {leave.startDate} ~ {leave.endDate}</div>
                        <div><span className="font-medium">사유:</span> {leave.reason}</div>
                        {leave.createdAt && (
                          <div><span className="font-medium">신청일:</span> {new Date(leave.createdAt).toLocaleDateString('ko-KR')}</div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* 📰 사내 소식 */}
          <div id="company-news" className={`transform transition-all duration-700 delay-800 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className={`${STYLES.card} p-6`}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">사내 소식</h3>
                  <p className="text-sm text-gray-500">최신 공지사항과 소식을 확인하세요</p>
                </div>
              </div>
              <CompanyNewsList />
            </div>
          </div>
        </div>
      </div>

      {/* 🎨 연차 신청 모달 */}
      {showLeaveForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`${STYLES.card} p-8 w-full max-w-md max-h-[90vh] overflow-y-auto`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800">연차 신청</h3>
              </div>
              <button
                onClick={() => setShowLeaveForm(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">연차 종류</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                  className={STYLES.input}
                >
                  <option value="연차">연차</option>
                  <option value="반차">반차</option>
                  <option value="병가">병가</option>
                  <option value="기타">기타</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">시작일</label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className={STYLES.input}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">종료일</label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    className={STYLES.input}
                    required
                  />
                </div>
              </div>

              {form.startDate && form.endDate && (
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="text-sm text-blue-700 font-semibold">
                    신청 일수: {calculateLeaveDays(form.startDate, form.endDate, form.type)}일
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">사유</label>
                <textarea
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  className={`${STYLES.input} h-24 resize-none`}
                  placeholder="연차 사유를 입력해주세요..."
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className={`${STYLES.primaryButton} flex-1`}
                >
                  신청하기
                </button>
                <button
                  type="button"
                  onClick={() => setShowLeaveForm(false)}
                  className={`${STYLES.secondaryButton} flex-1`}
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🔐 비밀번호 변경 모달 */}
      {showPasswordChange && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`${STYLES.card} p-8 w-full max-w-md`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800">비밀번호 변경</h3>
              </div>
              <button
                onClick={() => setShowPasswordChange(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {passwordMessage && (
              <div className={`p-4 rounded-xl mb-4 ${passwordMessage.includes('실패') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
                {passwordMessage}
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">현재 비밀번호</label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className={STYLES.input}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">새 비밀번호</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className={STYLES.input}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">새 비밀번호 확인</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className={STYLES.input}
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className={`${STYLES.primaryButton} flex-1`}
                >
                  변경하기
                </button>
                <button
                  type="button"
                  onClick={() => setShowPasswordChange(false)}
                  className={`${STYLES.secondaryButton} flex-1`}
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeHome;