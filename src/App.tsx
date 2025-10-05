import AdminDeputyApproval from './pages/admin/AdminDeputyApproval';
import ErrorBoundary from './components/ErrorBoundary';
/// <reference types="react" />
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Projects from './pages/Projects';
import ProjectList from './pages/ProjectList';
import Leaves from './pages/Leaves';
import AdminLogin from './pages/admin/AdminLogin';
import AdminProtectedRoute from './pages/admin/AdminProtectedRoute';
import AdminDeputyRequest from './pages/admin/AdminDeputyRequest';
import AdminLayout from './pages/admin/AdminLayout';
import AdminHome from './pages/admin/AdminHome';
import AdminLeaves from './pages/admin/AdminLeaves';
import AdminProjectStatus from './pages/admin/AdminProjectStatus';
import AdminEmployeeManage from './pages/AdminEmployeeManage'; // export default로 오류 해결
import AdminEmployeeRegister from './pages/admin/AdminEmployeeRegister';
import AdminEmployeeStatus from './pages/admin/AdminEmployeeStatus';
import AdminCompanyNewsManage from './pages/admin/AdminCompanyNewsManage';
import AdminEmployeeLeaveEdit from './pages/admin/AdminEmployeeLeaveEdit';
import EmployeeLogin from './pages/EmployeeLogin';
import EmployeeHome from './pages/EmployeeHome';
import AdminEmployeeEdit from './pages/AdminEmployeeEdit';
import SignUp from './pages/SignUp';
import Login from './pages/Login';

// 관리자 인증 필요 페이지 보호용 컴포넌트
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-8">로딩 중...</div>;
  return user ? children : <Navigate to="/admin" replace />;
}



function BrandBar() {
  return (
    <div className="w-full bg-gradient-to-r from-blue-600 to-cyan-400 h-12 flex items-center px-6 shadow">
      <span className="text-white font-extrabold text-xl tracking-wide">DB.INFO</span>
      <span className="ml-2 px-2 py-1 bg-white/30 text-xs text-white rounded-full font-semibold">IT INNOVATION</span>
    </div>
  );
}

function AppRoutesWithHeader() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const hideHeader = location.pathname === '/admin-employee-manage';
  return (
    <>
      {!isAdminRoute && <BrandBar />}
      {!isAdminRoute && !hideHeader && <Header />}
      <main className="min-h-[60vh]">
        <ErrorBoundary>
          <Routes>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={
              <ProtectedRoute>
                <Projects />
              </ProtectedRoute>
            } />
            <Route path="/project-list" element={<ProjectList />} />
            <Route path="/leaves" element={
              <ProtectedRoute>
                <Leaves />
              </ProtectedRoute>
            } />
            {/* /admin 루트 경로 - 로그인 페이지로 리다이렉트 */}
            <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/*" element={<AdminProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/login" replace />} />
                <Route path="home" element={<AdminHome />} />
                <Route path="leaves" element={<AdminLeaves />} />
                <Route path="project-status" element={<AdminProjectStatus />} />
                <Route path="employee-manage" element={<AdminEmployeeManage />} />
                <Route path="register" element={<AdminEmployeeRegister />} />
                <Route path="company-news-manage" element={<AdminCompanyNewsManage />} />
                <Route path="employee-upload" element={<DummyPage title="직원정보 업로드" />} />
                <Route path="leave-reset" element={<DummyPage title="연차기록 초기화" />} />
                <Route path="employee-leave-edit" element={<AdminEmployeeLeaveEdit />} />
                <Route path="deputy-request" element={<AdminDeputyRequest />} />
                <Route path="deputy-approval" element={<AdminDeputyApproval />} />
                <Route path="employee-status" element={<AdminEmployeeStatus />} />
              </Route>
            </Route>
            <Route path="/employee-login" element={<EmployeeLogin />} />
            <Route path="/employee-home" element={<EmployeeHome />} />
            <Route path="/admin-employee-edit" element={<AdminEmployeeEdit />} />
            <Route path="/admin-employee-manage" element={<AdminEmployeeManage />} />
          </Routes>
        </ErrorBoundary>
      </main>
      {!isAdminRoute && <Footer />}
    </>
  );
}

function DummyPage({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <p className="text-gray-500">이 페이지는 준비 중입니다.</p>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutesWithHeader />
      </Router>
    </AuthProvider>
  );
}

// App 컴포넌트는 정상적으로 동작 중입니다. 특별히 수정할 부분이 없으나, 혹시 추가 요청이 있으시면 말씀해 주세요.

// tsconfig.json 파일에 다음과 같이 포함시켜야 함
// "include": ["src", "node_modules/@types"]
