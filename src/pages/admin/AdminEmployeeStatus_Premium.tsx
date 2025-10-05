import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import FadeSlideIn from '../../components/FadeSlideIn';

// 🎨 프리미엄 직원상태 스타일 시스템
const STATUS_STYLES = {
  container: "min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 relative overflow-hidden",
  wrapper: "relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8",
  header: "text-center mb-12",
  card: "glass-card rounded-3xl shadow-glass border border-white/10 backdrop-blur-xl p-8 hover:border-white/20 transition-all duration-500",
  statsCard: "glass-card rounded-2xl shadow-glass border border-white/10 backdrop-blur-xl p-6 hover:border-white/20 transition-all duration-500",
  table: "glass rounded-3xl border border-white/20 backdrop-blur-sm overflow-hidden",
  employeeCard: "glass-card rounded-2xl border border-white/10 p-6 hover:border-white/20 hover:scale-105 transition-all duration-500",
  button: {
    primary: "px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-semibold shadow-2xl hover:shadow-blue-500/25 hover:scale-105 transition-all duration-300",
    success: "px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-green-500/25 hover:scale-105 transition-all duration-300",
    danger: "px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-red-500/25 hover:scale-105 transition-all duration-300",
    secondary: "px-4 py-2 glass rounded-xl border border-white/20 text-white font-semibold hover:bg-white/10 transition-all duration-300"
  },
  modal: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
} as const;

// 🌟 배경 애니메이션 컴포넌트
const StatusBackground: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '3s' }}></div>
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
  description?: string;
  delay?: number;
}> = ({ title, value, icon, color, description, delay = 0 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!isVisible) return;
    
    const duration = 1200;
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
      <div className={STATUS_STYLES.statsCard}>
        <div className="flex items-center justify-between mb-4">
          <div className={`text-3xl ${color}`}>
            {icon}
          </div>
          <div className={`text-3xl font-black ${color}`}>
            {displayValue}
          </div>
        </div>
        <div className="text-white font-bold text-lg mb-1">
          {title}
        </div>
        {description && (
          <div className="text-gray-300 text-sm">
            {description}
          </div>
        )}
      </div>
    </FadeSlideIn>
  );
};

// 👤 프리미엄 직원 카드 컴포넌트
const EmployeeCard: React.FC<{
  employee: any;
  index: number;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  delay?: number;
}> = ({ employee, index, onEdit, onDelete, delay = 0 }) => {
  const usedRatio = employee.totalLeaves > 0 ? (employee.usedLeaves / employee.totalLeaves) * 100 : 0;
  const remainingLeaves = (employee.totalLeaves ?? 0) - (employee.usedLeaves ?? 0);
  
  // 상태별 색상 결정
  const getStatusColor = () => {
    if (remainingLeaves > 10) return 'text-green-400';
    if (remainingLeaves > 5) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getProgressColor = () => {
    if (usedRatio > 80) return 'bg-gradient-to-r from-red-500 to-orange-500';
    if (usedRatio > 50) return 'bg-gradient-to-r from-yellow-500 to-green-500';
    return 'bg-gradient-to-r from-green-500 to-blue-500';
  };

  return (
    <FadeSlideIn delay={delay}>
      <div className={STATUS_STYLES.employeeCard}>
        {/* 직원 정보 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-glow">
              {employee.name?.charAt(0) || 'N'}
            </div>
            <div>
              <div className="text-white text-xl font-bold">{employee.name}</div>
              <div className="text-gray-300 text-sm">#{employee.empNo}</div>
            </div>
          </div>
          <div className="text-right">
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${
              employee.position === '관리자' ? 'bg-purple-600 text-white' :
              employee.position === '팀장' ? 'bg-blue-600 text-white' :
              'bg-gray-600 text-white'
            }`}>
              {employee.position || '직원'}
            </div>
          </div>
        </div>

        {/* 연차 정보 그리드 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 glass rounded-xl">
            <div className="text-blue-400 text-2xl font-black">
              {employee.carryOverLeaves ?? 0}
            </div>
            <div className="text-gray-300 text-xs">이월연차</div>
          </div>
          <div className="text-center p-3 glass rounded-xl">
            <div className="text-green-400 text-2xl font-black">
              {employee.annualLeaves ?? 15}
            </div>
            <div className="text-gray-300 text-xs">발생연차</div>
          </div>
          <div className="text-center p-3 glass rounded-xl">
            <div className="text-orange-400 text-2xl font-black">
              {employee.usedLeaves ?? 0}
            </div>
            <div className="text-gray-300 text-xs">사용연차</div>
          </div>
          <div className="text-center p-3 glass rounded-xl">
            <div className={`text-2xl font-black ${getStatusColor()}`}>
              {remainingLeaves}
            </div>
            <div className="text-gray-300 text-xs">잔여연차</div>
          </div>
        </div>

        {/* 연차 사용률 진행 바 */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white font-semibold text-sm">연차 사용률</span>
            <span className="text-gray-300 text-sm">{usedRatio.toFixed(1)}%</span>
          </div>
          <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${getProgressColor()}`}
              style={{ width: `${Math.min(usedRatio, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* 추가 정보 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <div className="text-gray-400 text-xs mb-1">이메일</div>
            <div className="text-white text-sm font-medium truncate">{employee.email || '-'}</div>
          </div>
          <div>
            <div className="text-gray-400 text-xs mb-1">부서</div>
            <div className="text-white text-sm font-medium">{employee.department || '-'}</div>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex gap-3">
          <button
            className={STATUS_STYLES.button.success}
            onClick={() => onEdit(employee.id)}
          >
            ✏️ 수정
          </button>
          <button
            className={STATUS_STYLES.button.danger}
            onClick={() => onDelete(employee.id)}
          >
            🗑️ 삭제
          </button>
        </div>
      </div>
    </FadeSlideIn>
  );
};

// 📋 로딩 컴포넌트
const LoadingComponent: React.FC = () => (
  <FadeSlideIn>
    <div className={STATUS_STYLES.card}>
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-6 animate-pulse">
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">데이터 로딩 중</h3>
        <p className="text-gray-300">직원 정보를 불러오고 있습니다...</p>
      </div>
    </div>
  </FadeSlideIn>
);

// ❌ 에러 컴포넌트
const ErrorComponent: React.FC<{ error: string; onRetry: () => void }> = ({ error, onRetry }) => (
  <FadeSlideIn>
    <div className={STATUS_STYLES.card}>
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <span className="text-white text-3xl">⚠️</span>
        </div>
        <h3 className="text-2xl font-bold text-red-400 mb-2">오류 발생</h3>
        <p className="text-gray-300 mb-6">{error}</p>
        <button
          className={STATUS_STYLES.button.danger}
          onClick={onRetry}
        >
          🔄 다시 시도
        </button>
      </div>
    </div>
  </FadeSlideIn>
);

// 📭 빈 상태 컴포넌트
const EmptyComponent: React.FC<{ onAddEmployee: () => void }> = ({ onAddEmployee }) => (
  <FadeSlideIn>
    <div className={STATUS_STYLES.card}>
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-gradient-to-br from-gray-500 to-gray-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <span className="text-white text-3xl">👥</span>
        </div>
        <h3 className="text-2xl font-bold text-gray-300 mb-2">직원이 없습니다</h3>
        <p className="text-gray-400 mb-6">아직 등록된 직원이 없습니다. 첫 번째 직원을 추가해보세요.</p>
        <button
          className={STATUS_STYLES.button.primary}
          onClick={onAddEmployee}
        >
          👤 직원 추가하기
        </button>
      </div>
    </div>
  </FadeSlideIn>
);

const AdminEmployeeStatus: React.FC = () => {
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
      try {
        await deleteDoc(doc(db, 'employees', id));
        setEmployees(prev => prev.filter(emp => emp.id !== id));
      } catch (error) {
        alert('삭제 중 오류가 발생했습니다.');
      }
    }
  };

  // 통계 계산
  const totalEmployees = employees.length;
  const totalLeaves = employees.reduce((sum, emp) => sum + (emp.totalLeaves ?? 15), 0);
  const usedLeaves = employees.reduce((sum, emp) => sum + (emp.usedLeaves ?? 0), 0);
  const remainingLeaves = totalLeaves - usedLeaves;

  return (
    <div className={STATUS_STYLES.container}>
      <StatusBackground />
      
      <div className={STATUS_STYLES.wrapper}>
        {/* 헤더 */}
        <div className={STATUS_STYLES.header}>
          <FadeSlideIn>
            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-4">
              📋 직원 상태 관리
            </h1>
            <p className="text-xl text-gray-300 font-medium">
              전체 직원의 연차 사용 현황을 한눈에 확인하세요
            </p>
          </FadeSlideIn>
        </div>

        {/* 통계 대시보드 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="총 직원"
            value={totalEmployees}
            icon="👥"
            color="text-blue-400"
            description="등록된 직원 수"
            delay={100}
          />
          <StatCard
            title="총 연차"
            value={totalLeaves}
            icon="📅"
            color="text-green-400"
            description="전체 연차 일수"
            delay={200}
          />
          <StatCard
            title="사용 연차"
            value={usedLeaves}
            icon="✅"
            color="text-orange-400"
            description="사용된 연차 일수"
            delay={300}
          />
          <StatCard
            title="잔여 연차"
            value={remainingLeaves}
            icon="📊"
            color="text-purple-400"
            description="남은 연차 일수"
            delay={400}
          />
        </div>

        {/* 빠른 액션 버튼 */}
        <FadeSlideIn delay={500}>
          <div className="flex flex-wrap gap-4 justify-center mb-8">
            <button
              className={STATUS_STYLES.button.primary}
              onClick={() => navigate('/admin/employee-register')}
            >
              ➕ 새 직원 추가
            </button>
            <button
              className={STATUS_STYLES.button.secondary}
              onClick={() => navigate('/admin/employee-manage')}
            >
              ⚙️ 직원 관리
            </button>
            <button
              className={STATUS_STYLES.button.secondary}
              onClick={() => navigate('/admin')}
            >
              🏠 관리자 홈
            </button>
          </div>
        </FadeSlideIn>

        {/* 메인 컨텐츠 */}
        {loading ? (
          <LoadingComponent />
        ) : error ? (
          <ErrorComponent error={error} onRetry={fetchEmployees} />
        ) : employees.length === 0 ? (
          <EmptyComponent onAddEmployee={() => navigate('/admin/employee-register')} />
        ) : (
          <FadeSlideIn delay={600}>
            <div className={STATUS_STYLES.card}>
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                👤 직원별 상세 현황
              </h2>
              
              {/* 직원 카드 그리드 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {employees.map((employee, index) => (
                  <EmployeeCard
                    key={employee.id}
                    employee={employee}
                    index={index}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    delay={700 + index * 100}
                  />
                ))}
              </div>
            </div>
          </FadeSlideIn>
        )}
      </div>
    </div>
  );
};

export default AdminEmployeeStatus;