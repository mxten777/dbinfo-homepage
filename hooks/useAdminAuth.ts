import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const useAdminAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 클라이언트에서만 실행되도록 보장
    if (typeof window === 'undefined') return;

    const checkAuth = () => {
      try {
        const adminMode = localStorage.getItem('admin_mode');
        const user = localStorage.getItem('admin_user');
        
        if (adminMode === 'true' && user) {
          setIsAuthenticated(true);
        } else {
          router.push('/admin/login');
        }
      } catch (error) {
        console.error('인증 확인 중 오류:', error);
        router.push('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };

    // 약간의 지연을 두어 hydration 문제 방지
    setTimeout(checkAuth, 100);
  }, [router]);

  return { isAuthenticated, isLoading };
};