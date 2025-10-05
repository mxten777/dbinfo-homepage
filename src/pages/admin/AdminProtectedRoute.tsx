import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

const AdminProtectedRoute: React.FC = () => {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  useEffect(() => {
    // 사용자 로딩 중이면 대기
    if (loading) return;
    
    // 사용자가 없으면 즉시 체크 종료
    if (!user) {
      console.log('User not logged in');
      setIsAdmin(false);
      setCheckingAdmin(false);
      return;
    }
    
    // 관리자 권한 체크 시작
    setCheckingAdmin(true);
    setIsAdmin(null);
    
    const checkAdminRole = async () => {
      try {
        console.log('Checking admin role for user:', user.email, 'UID:', user.uid);
        
        // 3초 타임아웃으로 단축
        const timeoutId = setTimeout(() => {
          console.log('Admin check timeout - assuming not admin');
          setIsAdmin(false);
          setCheckingAdmin(false);
        }, 3000);
        
        const adminDoc = await getDoc(doc(db, 'admins', user.uid));
        clearTimeout(timeoutId);
        
        console.log('Admin document exists:', adminDoc.exists());
        
        if (adminDoc.exists() && adminDoc.data()?.isAdmin === true) {
          console.log('User is admin');
          setIsAdmin(true);
        } else {
          console.log('User is not admin:', user.email);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('관리자 권한 확인 실패:', error);
        setIsAdmin(false);
      } finally {
        setCheckingAdmin(false);
      }
    };
    
    checkAdminRole();
  }, [user, loading]);


  useEffect(() => {
    console.log('렌더링 직전 isAdmin:', isAdmin);
    console.log('렌더링 직전 user:', user);
    console.log('렌더링 직전 checkingAdmin:', checkingAdmin);
  }, [isAdmin, user, checkingAdmin]);

  // Auth 로딩 중이거나 관리자 권한 체크 중일 때만 로딩 화면 표시
  if (loading || (user && checkingAdmin)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-brand-50/30">
        <div className="glass-strong rounded-3xl p-8 text-center shadow-glow">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-brand-500 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold gradient-text mb-2">권한 확인 중</h2>
          <p className="text-neutral-600 mb-4">
            {loading ? '사용자 인증 확인 중...' : checkingAdmin ? '관리자 권한 확인 중...' : '처리 중...'}
          </p>
          <div className="text-xs text-neutral-500">
            User: {user ? user.email : 'None'} | Loading: {loading.toString()} | Checking: {checkingAdmin.toString()} | IsAdmin: {isAdmin?.toString() || 'null'}
          </div>
        </div>
      </div>
    );
  }

  // 사용자가 없으면 로그인 페이지로 리다이렉트
  if (!loading && !user) {
    return <Navigate to="/admin/login" replace />;
  }

  // 관리자가 아닌 경우 접근 거부
  if (!loading && user && isAdmin === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">접근 권한이 없습니다</h2>
          <p className="text-gray-600 mb-4">관리자 권한이 필요한 페이지입니다.</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  // isAdmin === true일 때만 Outlet 렌더링 (try/catch로 감싸서 에러 원인 진단)
  try {
    return <Outlet />;
  } catch (error) {
    console.error('Outlet 렌더링 에러:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">관리자 페이지 오류</h2>
          <p className="text-gray-600 mb-4">관리자 권한 확인 중 오류가 발생했습니다.<br/>잠시 후 다시 시도해 주세요.</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }
}

export default AdminProtectedRoute;
