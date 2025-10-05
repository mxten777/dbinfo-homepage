import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, deleteDoc, doc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import type { Employee, Leave } from '../types/employee';
import FadeSlideIn from '../components/FadeSlideIn';

// 🎨 프리미엄 직원관리 스타일 시스템
const MANAGE_STYLES = {
  container: "min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 relative overflow-hidden",
  wrapper: "relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8",
  header: "text-center mb-12",
  card: "glass-card rounded-3xl shadow-glass border border-white/10 backdrop-blur-xl p-6 hover:border-white/20 transition-all duration-500",
  table: "glass rounded-2xl border border-white/20 backdrop-blur-sm overflow-hidden",
  button: {
    primary: "px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-blue-500/25 hover:scale-105 transition-all duration-300",
    success: "px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-green-500/25 hover:scale-105 transition-all duration-300",
    danger: "px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-red-500/25 hover:scale-105 transition-all duration-300",
    secondary: "px-4 py-2 glass rounded-xl border border-white/20 text-white font-semibold hover:bg-white/10 transition-all duration-300"
  },
  modal: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50",
  modalContent: "glass-card rounded-3xl shadow-2xl border border-white/20 p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
} as const;

// 🌟 배경 애니메이션 컴포넌트
const ManageBackground: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-float"></div>
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:60px_60px] opacity-10"></div>
  </div>
);

// 📊 통계 카드 컴포넌트
const StatCard: React.FC<{
  title: string;
  value: number;
  icon: string;
  color: string;
  delay?: number;
}> = ({ title, value, icon, color, delay = 0 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!isVisible) return;
    
    const duration = 1000;
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
      <div className={MANAGE_STYLES.card}>
        <div className="flex items-center justify-between">
          <div>
            <div className={`text-2xl font-black ${color}`}>
              {displayValue}
            </div>
            <div className="text-gray-300 font-medium text-sm">
              {title}
            </div>
          </div>
          <div className={`text-3xl ${color}`}>
            {icon}
          </div>
        </div>
      </div>
    </FadeSlideIn>
  );
};

// 📝 프리미엄 수정 모달 컴포넌트
const EditEmployeeModal: React.FC<{
  employee: Employee | null;
  onSave: (emp: Employee) => void;
  onClose: () => void;
  loading: boolean;
}> = ({ employee, onSave, onClose, loading }) => {
  const [editEmp, setEditEmp] = useState<Employee | null>(employee);

  useEffect(() => {
    setEditEmp(employee);
  }, [employee]);

  if (!editEmp) return null;

  const handleSave = () => {
    onSave(editEmp);
  };

  const inputFields = [
    { key: 'empNo', label: '사번', type: 'text' },
    { key: 'name', label: '이름', type: 'text' },
    { key: 'regNo', label: '주민번호', type: 'text' },
    { key: 'gender', label: '성별', type: 'text' },
    { key: 'position', label: '직급', type: 'text' },
    { key: 'department', label: '부서', type: 'text' },
    { key: 'jobType', label: '직종', type: 'text' },
    { key: 'joinDate', label: '입사일', type: 'date' },
    { key: 'email', label: '이메일', type: 'email' },
    { key: 'phone', label: '전화번호', type: 'tel' },
  ];

  return (
    <div className={MANAGE_STYLES.modal}>
      <div className={MANAGE_STYLES.modalContent}>
        <FadeSlideIn>
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            ✏️ 직원 정보 수정
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {inputFields.map((field) => (
              <div key={field.key} className="space-y-2">
                <label className="text-white font-semibold text-sm">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  className="w-full px-4 py-3 glass rounded-xl border border-white/20 text-white placeholder-white/50 focus:border-white/40 focus:outline-none transition-all duration-300"
                  value={(editEmp as any)[field.key] ?? ''}
                  onChange={(e) => setEditEmp({ ...editEmp, [field.key]: e.target.value })}
                  placeholder={field.label}
                />
              </div>
            ))}
          </div>

          <div className="flex gap-4 justify-center">
            <button
              className={MANAGE_STYLES.button.primary}
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? '저장 중...' : '💾 저장'}
            </button>
            <button
              className={MANAGE_STYLES.button.secondary}
              onClick={onClose}
            >
              ❌ 취소
            </button>
          </div>
        </FadeSlideIn>
      </div>
    </div>
  );
};

const AdminEmployeeManage: React.FC = () => {
  const [adminMap, setAdminMap] = useState<{ [uid: string]: boolean }>({});
  const [message, setMessage] = useState('');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetResult, setResetResult] = useState<string>('');
  const [editEmp, setEditEmp] = useState<Employee | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const navigate = useNavigate();

  // 직원 삭제 핸들러
  const handleDelete = async (id: string) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    
    try {
      await deleteDoc(doc(db, 'employees', String(id)));
      setEmployees((prev: Employee[]) => prev.filter(e => e.id !== id));
      setMessage('✅ 삭제되었습니다.');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ 삭제 실패: 다시 시도해 주세요.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // 직원 정보 수정 핸들러
  const handleEditSave = async (updatedEmp: Employee) => {
    setEditLoading(true);
    try {
      await updateDoc(doc(db, 'employees', String(updatedEmp.id)), {
        empNo: updatedEmp.empNo,
        regNo: updatedEmp.regNo,
        gender: updatedEmp.gender,
        joinDate: updatedEmp.joinDate,
        name: updatedEmp.name,
        department: updatedEmp.department,
        position: updatedEmp.position,
        phone: updatedEmp.phone,
        email: updatedEmp.email,
        jobType: updatedEmp.jobType,
      });
      
      setEmployees((prev) => 
        prev.map(e => e.id === updatedEmp.id ? { ...e, ...updatedEmp } : e)
      );
      setMessage('✅ 수정 완료!');
      setEditEmp(null);
    } catch {
      setMessage('❌ 수정 실패: 다시 시도해 주세요.');
    }
    setEditLoading(false);
    setTimeout(() => setMessage(''), 3000);
  };

  // 연차 승인/반려 핸들러
  const handleLeaveApproval = async (leave: Leave, status: '승인' | '반려') => {
    try {
      const now = Date.now();
      await updateDoc(doc(db, 'leaves', String(leave.id)), { status, updatedAt: now });
      
      if (status === '승인') {
        const emp = employees.find(e => e.id === leave.employeeId || e.name === leave.employeeName);
        if (emp) {
          const used = Number(emp.usedLeaves ?? 0) + Number(leave.days ?? 0);
          const remain = Number(emp.remainingLeaves ?? 0) - Number(leave.days ?? 0);
          await updateDoc(doc(db, 'employees', String(emp.id)), { 
            usedLeaves: used, 
            remainingLeaves: remain 
          });
          setEmployees((prev: Employee[]) => 
            prev.map(e => e.id === emp.id ? { ...e, usedLeaves: used, remainingLeaves: remain } : e)
          );
        }
      }
      
      setLeaves((prev: Leave[]) => 
        prev.map(l => l.id === leave.id ? { ...l, status, updatedAt: now } : l)
      );
      setMessage(`✅ 연차 ${status} 처리 완료`);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('❌ 처리 실패: 다시 시도해 주세요.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // 연차 기록 초기화
  const handleResetLeaves = async () => {
    setResetLoading(true);
    let success = 0, fail = 0;
    
    for (const emp of employees) {
      try {
        await updateDoc(doc(db, 'employees', String(emp.id)), {
          usedLeaves: 0,
          remainingLeaves: (Number(emp.carryOverLeaves) || 0) + (Number(emp.annualLeaves) || 0)
        });
        success++;
      } catch {
        fail++;
      }
    }
    
    setResetResult(`✅ 초기화 완료: ${success}명 성공, ${fail}명 실패`);
    setResetLoading(false);
    setTimeout(() => setResetResult(''), 5000);
    setShowResetModal(false);
    
    // 최신 데이터 반영
    const empSnap = await getDocs(collection(db, 'employees'));
    setEmployees(empSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Employee)));
  };

  // 관리자 권한 부여/해제 핸들러
  const handleAdminToggle = async (emp: Employee) => {
    if (!emp.uid) {
      setMessage('❌ UID가 없는 직원입니다.');
      return;
    }
    
    const adminDocRef = doc(db, 'admins', emp.uid);
    const isAdmin = !!adminMap[emp.uid];
    
    try {
      if (isAdmin) {
        await setDoc(adminDocRef, { isAdmin: false });
        setAdminMap(prev => ({ ...prev, [emp.uid!]: false }));
        setMessage(`✅ ${emp.name}님 관리자 권한 해제됨`);
      } else {
        await setDoc(adminDocRef, { isAdmin: true });
        setAdminMap(prev => ({ ...prev, [emp.uid!]: true }));
        setMessage(`✅ ${emp.name}님 관리자 권한 부여됨`);
      }
    } catch (e) {
      setMessage('❌ 권한 변경 실패: 다시 시도해 주세요.');
    }
    setTimeout(() => setMessage(''), 3000);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const empSnap = await getDocs(collection(db, 'employees'));
        setEmployees(empSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Employee)));
        
        const leaveSnap = await getDocs(collection(db, 'leaves'));
        const deputySnap = await getDocs(collection(db, 'deputyRequests'));
        const leavesData = leaveSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Leave));
        const deputyData = deputySnap.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data(), 
          isAdminRequest: true 
        } as Leave));
        setLeaves([...leavesData, ...deputyData]);

        // 관리자 권한 정보 불러오기
        const adminsSnap = await getDocs(collection(db, 'admins'));
        const adminMapObj: { [uid: string]: boolean } = {};
        adminsSnap.docs.forEach(doc => {
          const data = doc.data();
          if (data.isAdmin) adminMapObj[doc.id] = true;
        });
        setAdminMap(adminMapObj);
      } catch (error) {
        setMessage('❌ 데이터 로드 실패: 페이지를 새로고침해 주세요.');
      }
    };
    
    fetchData();
  }, []);

  // 통계 계산
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(emp => emp.uid).length;
  const pendingLeaves = leaves.filter(leave => leave.status === '대기중').length;
  const adminCount = Object.values(adminMap).filter(Boolean).length;

  return (
    <div className={MANAGE_STYLES.container}>
      <ManageBackground />
      
      <div className={MANAGE_STYLES.wrapper}>
        {/* 헤더 */}
        <div className={MANAGE_STYLES.header}>
          <FadeSlideIn>
            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-4">
              👥 직원 관리 시스템
            </h1>
            <p className="text-xl text-gray-300 font-medium">
              전체 직원 정보 및 권한 관리 센터
            </p>
          </FadeSlideIn>
        </div>

        {/* 메시지 출력 */}
        {message && (
          <FadeSlideIn>
            <div className="mb-6 p-4 glass-card rounded-2xl border border-white/20 text-center">
              <div className="text-lg font-semibold text-white">{message}</div>
            </div>
          </FadeSlideIn>
        )}

        {/* 통계 섹션 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard 
            title="총 직원" 
            value={totalEmployees} 
            icon="👥" 
            color="text-blue-400" 
            delay={100} 
          />
          <StatCard 
            title="활성 계정" 
            value={activeEmployees} 
            icon="✅" 
            color="text-green-400" 
            delay={200} 
          />
          <StatCard 
            title="승인 대기" 
            value={pendingLeaves} 
            icon="⏳" 
            color="text-yellow-400" 
            delay={300} 
          />
          <StatCard 
            title="관리자" 
            value={adminCount} 
            icon="👑" 
            color="text-purple-400" 
            delay={400} 
          />
        </div>

        {/* 빠른 작업 버튼들 */}
        <FadeSlideIn delay={500}>
          <div className="flex flex-wrap gap-4 mb-8 justify-center">
            <button
              className={MANAGE_STYLES.button.success}
              onClick={() => setShowResetModal(true)}
            >
              🔄 연차 기록 전체 초기화
            </button>
            {resetLoading && (
              <span className="text-green-400 font-bold flex items-center">
                <span className="animate-spin mr-2">⚡</span>
                초기화 중...
              </span>
            )}
            {resetResult && (
              <span className="text-green-400 font-bold">{resetResult}</span>
            )}
          </div>
        </FadeSlideIn>

        {/* 직원 테이블 */}
        <FadeSlideIn delay={600}>
          <div className={MANAGE_STYLES.card}>
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              📋 직원 정보 상세 현황
            </h2>
            
            <div className="overflow-x-auto">
              <div className={MANAGE_STYLES.table}>
                <table className="w-full text-sm">
                  <thead className="bg-white/5">
                    <tr>
                      {[
                        '사번', '이름', '주민번호', '성별', '직급', '부서', '직종', 
                        '입사일', '이월연차', '연차', '총연차', '사용연차', '잔여연차', 
                        '이메일', '전화번호', '권한', 'UID', '작업'
                      ].map((header) => (
                        <th key={header} className="px-4 py-3 text-white font-semibold text-left border-b border-white/10">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((emp, idx) => (
                      <tr 
                        key={emp.id} 
                        className={`${idx % 2 === 0 ? 'bg-white/5' : 'bg-white/2'} hover:bg-white/10 transition-all duration-300`}
                      >
                        <td className="px-4 py-3 text-gray-200 border-b border-white/5">{emp.empNo || '-'}</td>
                        <td className="px-4 py-3 text-white font-semibold border-b border-white/5">{emp.name || '-'}</td>
                        <td className="px-4 py-3 text-gray-200 border-b border-white/5">{emp.regNo || '-'}</td>
                        <td className="px-4 py-3 text-gray-200 border-b border-white/5">{emp.gender || '-'}</td>
                        <td className="px-4 py-3 text-gray-200 border-b border-white/5">{emp.position || '-'}</td>
                        <td className="px-4 py-3 text-gray-200 border-b border-white/5">{emp.department || '-'}</td>
                        <td className="px-4 py-3 text-gray-200 border-b border-white/5">{emp.jobType || '-'}</td>
                        <td className="px-4 py-3 text-gray-200 border-b border-white/5">{emp.joinDate || '-'}</td>
                        <td className="px-4 py-3 text-gray-200 border-b border-white/5">{emp.carryOverLeaves || 0}</td>
                        <td className="px-4 py-3 text-gray-200 border-b border-white/5">{emp.annualLeaves || 0}</td>
                        <td className="px-4 py-3 text-blue-300 font-semibold border-b border-white/5">
                          {(Number(emp.carryOverLeaves) || 0) + (Number(emp.annualLeaves) || 0)}
                        </td>
                        <td className="px-4 py-3 text-red-300 font-semibold border-b border-white/5">{emp.usedLeaves || 0}</td>
                        <td className="px-4 py-3 text-green-300 font-semibold border-b border-white/5">{emp.remainingLeaves || 0}</td>
                        <td className="px-4 py-3 text-gray-200 border-b border-white/5 text-xs">{emp.email || '-'}</td>
                        <td className="px-4 py-3 text-gray-200 border-b border-white/5">{emp.phone || '-'}</td>
                        <td className="px-4 py-3 border-b border-white/5">
                          <button
                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-300 ${
                              adminMap[emp.uid!] 
                                ? 'bg-purple-600 text-white hover:bg-purple-700' 
                                : 'bg-gray-600 text-gray-200 hover:bg-gray-700'
                            }`}
                            onClick={() => handleAdminToggle(emp)}
                            disabled={!emp.uid}
                          >
                            {adminMap[emp.uid!] ? '👑 관리자' : '👤 일반'}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-gray-300 border-b border-white/5 text-xs">{emp.uid || '-'}</td>
                        <td className="px-4 py-3 border-b border-white/5">
                          <div className="flex gap-2">
                            <button
                              className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 transition-all duration-300"
                              onClick={() => setEditEmp(emp)}
                            >
                              ✏️ 수정
                            </button>
                            <button
                              className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs hover:bg-red-700 transition-all duration-300"
                              onClick={() => handleDelete(emp.id)}
                            >
                              🗑️ 삭제
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </FadeSlideIn>

        {/* 연차 승인/반려 섹션 */}
        <FadeSlideIn delay={700}>
          <div className={`${MANAGE_STYLES.card} mt-8`}>
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              📅 연차 신청 승인 관리
            </h2>
            
            <div className="overflow-x-auto">
              <div className={MANAGE_STYLES.table}>
                <table className="w-full text-sm">
                  <thead className="bg-white/5">
                    <tr>
                      {['신청자', '시작일', '종료일', '일수', '사유', '상태', '신청일', '작업'].map((header) => (
                        <th key={header} className="px-4 py-3 text-white font-semibold text-left border-b border-white/10">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {leaves.map((leave, idx) => (
                      <tr 
                        key={leave.id} 
                        className={`${idx % 2 === 0 ? 'bg-white/5' : 'bg-white/2'} hover:bg-white/10 transition-all duration-300`}
                      >
                        <td className="px-4 py-3 text-white font-semibold border-b border-white/5">{leave.employeeName}</td>
                        <td className="px-4 py-3 text-gray-200 border-b border-white/5">{leave.startDate}</td>
                        <td className="px-4 py-3 text-gray-200 border-b border-white/5">{leave.endDate}</td>
                        <td className="px-4 py-3 text-blue-300 font-semibold border-b border-white/5">{leave.days}일</td>
                        <td className="px-4 py-3 text-gray-200 border-b border-white/5 max-w-xs truncate">{leave.reason}</td>
                        <td className="px-4 py-3 border-b border-white/5">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            leave.status === '승인' ? 'bg-green-600 text-white' :
                            leave.status === '반려' ? 'bg-red-600 text-white' :
                            'bg-yellow-600 text-white'
                          }`}>
                            {leave.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-200 border-b border-white/5 text-xs">
                          {leave.createdAt ? new Date(leave.createdAt).toLocaleDateString() : '-'}
                        </td>
                        <td className="px-4 py-3 border-b border-white/5">
                          {leave.status === '대기중' && (
                            <div className="flex gap-2">
                              <button
                                className="px-3 py-1 bg-green-600 text-white rounded-lg text-xs hover:bg-green-700 transition-all duration-300"
                                onClick={() => handleLeaveApproval(leave, '승인')}
                              >
                                ✅ 승인
                              </button>
                              <button
                                className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs hover:bg-red-700 transition-all duration-300"
                                onClick={() => handleLeaveApproval(leave, '반려')}
                              >
                                ❌ 반려
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </FadeSlideIn>

        {/* 홈으로 버튼 */}
        <FadeSlideIn delay={800}>
          <div className="flex justify-center mt-8">
            <button
              className="px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-2xl font-semibold shadow-2xl hover:shadow-gray-500/25 hover:scale-105 transition-all duration-300"
              onClick={() => navigate('/admin')}
            >
              🏠 관리자 홈으로
            </button>
          </div>
        </FadeSlideIn>
      </div>

      {/* 수정 모달 */}
      <EditEmployeeModal
        employee={editEmp}
        onSave={handleEditSave}
        onClose={() => setEditEmp(null)}
        loading={editLoading}
      />

      {/* 초기화 확인 모달 */}
      {showResetModal && (
        <div className={MANAGE_STYLES.modal}>
          <div className={MANAGE_STYLES.modalContent}>
            <FadeSlideIn>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-4">
                  ⚠️ 연차 기록 초기화
                </h3>
                <p className="text-gray-300 mb-6">
                  모든 직원의 연차 기록을 초기화하시겠습니까?<br/>
                  <span className="text-red-400 font-semibold">이 작업은 되돌릴 수 없습니다.</span>
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    className={MANAGE_STYLES.button.danger}
                    onClick={handleResetLeaves}
                  >
                    🔄 확인 및 초기화
                  </button>
                  <button
                    className={MANAGE_STYLES.button.secondary}
                    onClick={() => setShowResetModal(false)}
                  >
                    ❌ 취소
                  </button>
                </div>
              </div>
            </FadeSlideIn>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEmployeeManage;