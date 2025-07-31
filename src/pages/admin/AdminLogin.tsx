
import React, { useState } from 'react';
import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { useNavigate } from 'react-router-dom';

const AdminLogin: React.FC = () => {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resetMsg, setResetMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await signInWithEmailAndPassword(auth, id, pw);
      setSuccess('로그인 성공!');
      setError('');
      navigate('/admin/home');
    } catch (err: any) {
      setError('로그인 실패: ' + (err?.message || '오류 발생'));
      setSuccess('');
    }
  };

  const handleResetPassword = async () => {
    if (!id) {
      setResetMsg('이메일을 입력하세요.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, id);
      setResetMsg('비밀번호 재설정 메일이 발송되었습니다.');
    } catch (err: any) {
      setResetMsg('재설정 실패: ' + (err?.message || '오류 발생'));
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white">
      <div className="w-full">
        <div className="w-full bg-gradient-to-r from-blue-600 to-cyan-400 h-12 flex items-center px-6 shadow mb-8">
          <span className="text-white font-extrabold text-xl tracking-wide">DB.INFO</span>
          <span className="ml-2 px-2 py-1 bg-white/30 text-xs text-white rounded-full font-semibold">IT INNOVATION</span>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-blue-700 text-center">관리자 로그인</h2>
        {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
        {success && <div className="text-green-600 text-center font-bold">{success}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="이메일"
            value={id}
            onChange={e => setId(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-blue-400"
            required
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={pw}
            onChange={e => setPw(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-blue-400"
            required
          />
          <button
            type="submit"
            className="px-8 py-2 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition"
          >
            로그인
          </button>
          <button
            type="button"
            className="mt-2 text-blue-600 underline text-sm hover:text-blue-800"
            onClick={handleResetPassword}
          >
            비밀번호 재설정
          </button>
        </form>
        {resetMsg && <div className="text-center text-sm mt-2 text-green-600">{resetMsg}</div>}
      </div>
    </div>
  );
};

export default AdminLogin;
