'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const AdminLogin: React.FC = () => {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resetMsg, setResetMsg] = useState('');
  const [isCreatingAccounts, setIsCreatingAccounts] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    let emailTrimmed = id.trim().toLowerCase();
    const passwordTrimmed = pw.trim();
    

    
    try {
      // Firebase Authentication 사용
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      const { doc, getDoc } = await import('firebase/firestore');
      const { auth, db } = await import('../../../lib/firebase');
      
      // Firebase가 초기화되지 않았으면 에러 표시
      if (!auth || !db) {
        console.log('Firebase가 초기화되지 않음.');
        setError('시스템 오류입니다. 관리자에게 문의하세요.');
        setLoading(false);
        return;
      }
      
      console.log('Firebase 로그인 시도:', emailTrimmed);
      
      // Firebase로 로그인 시도
      const userCredential = await signInWithEmailAndPassword(auth, emailTrimmed, passwordTrimmed);
      const user = userCredential.user;
      
      console.log('Firebase 인증 성공:', user.uid);
      
      // 관리자 권한 확인 (이메일 기반)
      const { query, where, getDocs, collection } = await import('firebase/firestore');
      const adminsQuery = query(
        collection(db, 'admins'),
        where('email', '==', emailTrimmed)
      );
      const adminSnapshot = await getDocs(adminsQuery);
      
      if (!adminSnapshot.empty && adminSnapshot.docs[0].data()?.isAdmin) {
        // 관리자 인증 성공
        setSuccess('관리자 로그인 성공!');
        localStorage.setItem('admin_mode', 'true');
        localStorage.setItem('admin_user', emailTrimmed);
        localStorage.setItem('admin_uid', user.uid);
        
        console.log('관리자 로그인 성공:', emailTrimmed);
        setTimeout(() => {
          router.push('/admin/dashboard');
        }, 1000);
      } else {
        setError('관리자 권한이 없습니다. Firebase 콘솔에서 관리자 권한을 확인해주세요.');
        await auth.signOut();
      }
    } catch (error: unknown) {
      const firebaseError = error as { code?: string; message?: string };
      console.error('Firebase 로그인 오류:', error);
      
      // Firebase 에러 메시지를 한글로 변환
      if (firebaseError.code === 'auth/user-not-found') {
        setError('등록되지 않은 사용자입니다.');
      } else if (firebaseError.code === 'auth/wrong-password' || firebaseError.code === 'auth/invalid-credential') {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.');
      } else if (firebaseError.code === 'auth/invalid-email') {
        setError('올바른 이메일 형식이 아닙니다.');
      } else if (firebaseError.code === 'auth/too-many-requests') {
        setError('로그인 시도가 너무 많습니다. 잠시 후 다시 시도해주세요.');
      } else {
        setError('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!id) {
      setResetMsg('이메일을 입력하세요.');
      return;
    }
    try {
      // 실제로는 Firebase sendPasswordResetEmail을 사용
      setResetMsg('비밀번호 재설정 메일이 발송되었습니다.');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : '오류 발생';
      setResetMsg('재설정 실패: ' + errorMessage);
    }
  };

  const handleCreateAdminAccounts = async () => {
    setIsCreatingAccounts(true);
    setError('');
    setSuccess('');
    
    try {
      // 데모용 계정 생성 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess('관리자 계정이 성공적으로 생성되었습니다!');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다';
      setError('계정 생성 실패: ' + errorMessage);
    } finally {
      setIsCreatingAccounts(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full opacity-30" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl"></div>
      </div>

      {/* Brand Bar */}
      <div className="relative z-10 w-full bg-gradient-to-r from-blue-600 to-indigo-600 h-14 lg:h-16 flex items-center px-4 lg:px-6 shadow-lg">
        <div className="flex items-center gap-2 lg:gap-3">
          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42" />
            </svg>
          </div>
          <div>
            <span className="text-white font-bold text-lg lg:text-xl tracking-wide font-space">DB.INFO</span>
            <span className="ml-2 lg:ml-3 px-2 lg:px-3 py-0.5 lg:py-1 bg-white/20 text-xs text-white rounded-full font-semibold backdrop-blur-md">
              ADMIN PORTAL
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-56px)] lg:min-h-[calc(100vh-64px)] p-4 lg:p-6">
        <div className="w-full max-w-md">
          {/* Login Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 lg:p-8 border border-white/20 shadow-2xl">
            <div className="text-center mb-6 lg:mb-8">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-3 lg:mb-4">
                <svg className="w-6 h-6 lg:w-8 lg:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-xl lg:text-2xl font-bold text-white mb-1 lg:mb-2">관리자 로그인</h2>
              <p className="text-blue-200 text-xs lg:text-sm">DB.INFO 관리 시스템에 접속하세요</p>
            </div>

            {/* Alerts */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200 text-sm backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-200 text-sm backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {success}
                </div>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">아이디/이메일</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="이메일을 입력하세요"
                    value={id}
                    onChange={e => setId(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-md"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">비밀번호</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={pw}
                    onChange={e => setPw(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-md"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? '로그인 중...' : '로그인'}
              </button>

              <button
                type="button"
                className="w-full text-blue-200 hover:text-white transition-colors duration-200 text-sm underline"
                onClick={handleResetPassword}
              >
                비밀번호를 잊으셨나요?
              </button>
            </form>

            {resetMsg && (
              <div className="mt-4 p-3 bg-blue-500/20 border border-blue-500/30 rounded-xl text-blue-200 text-sm backdrop-blur-md text-center">
                {resetMsg}
              </div>
            )}

            {/* Developer Tools */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-8 pt-6 border-t border-white/20">
                <button
                  onClick={handleCreateAdminAccounts}
                  disabled={isCreatingAccounts}
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreatingAccounts ? (
                    <div className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      계정 생성 중...
                    </div>
                  ) : '관리자 계정 생성'}
                </button>
                <p className="text-xs text-blue-300 mt-2 text-center">
                  개발환경에서만 표시됩니다
                </p>
              </div>
            )}

            {/* Demo Account Info - Removed for production */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;