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
    const checkAdminRole = async () => {
      if (!user) {
        setIsAdmin(false);
        setCheckingAdmin(false);
        return;
      }

      try {
        // admins 컬렉션에서 사용자 확인
        const adminDoc = await getDoc(doc(db, 'admins', user.uid));
        
        if (adminDoc.exists()) {
          setIsAdmin(true);
        } else {
          // employees 컬렉션에서 role이 admin인지 확인
          const empDoc = await getDoc(doc(db, 'employees', user.uid));
          if (empDoc.exists() && empDoc.data()?.role === 'admin') {
            setIsAdmin(true);
          } else {
            // 관리자 이메일 화이트리스트 확인
            const adminEmails = [
              'hankjae@db-info.co.kr',
              '6511kesuk@db-info.co.kr'
            ];
            setIsAdmin(adminEmails.includes(user.email || ''));
          }
        }
      } catch (error) {
        console.error('관리자 권한 확인 실패:', error);
        setIsAdmin(false);
      } finally {
        setCheckingAdmin(false);
      }
    };

    checkAdminRole();
  }, [user]);

  if (loading || checkingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">권한 확인 중...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (isAdmin === false) {
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

  return <Outlet />;
};

export default AdminProtectedRoute;
