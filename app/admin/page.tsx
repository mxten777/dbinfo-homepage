'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminRedirect() {
  const router = useRouter();

  useEffect(() => {
    // /admin 접근 시 자동으로 /admin/login으로 리다이렉트
    router.replace('/admin/login');
  }, [router]);

  // 리다이렉트 중 로딩 화면 표시
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-white">관리자 로그인 페이지로 이동 중...</p>
      </div>
    </div>
  );
}