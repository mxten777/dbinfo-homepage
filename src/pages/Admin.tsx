
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// ...existing code...
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin-home'); // 로그인 성공 시 관리자 선택 페이지로 이동
    } catch (err: any) {
      setError('로그인 실패: ' + (err.message || '오류 발생'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-purple-100 animate-fade-in">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-purple-100 rounded-full p-4 mb-2">
            <svg className="w-10 h-10 text-purple-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0-1.657 1.343-3 3-3s3 1.343 3 3-1.343 3-3 3-3-1.343-3-3zm-6 8v-1a4 4 0 014-4h4a4 4 0 014 4v1" /></svg>
          </div>
          <h2 className="text-2xl font-extrabold text-purple-700 mb-1">관리자 로그인</h2>
          <div className="text-gray-500 text-sm">DB.INFO 관리자 전용</div>
        </div>
        <form onSubmit={handleLogin} className="mb-6 space-y-3">
          <div>
            <label className="block text-sm font-semibold mb-1 text-purple-700">이메일</label>
            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-200 transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-purple-700">비밀번호</label>
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-200 transition"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg shadow font-bold hover:scale-105 transition-transform"
            disabled={loading}
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>
        {error && <div className="mb-4 text-red-600 font-semibold text-center">{error}</div>}
        <button className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg shadow hover:bg-gray-300 font-semibold transition" onClick={() => navigate('/')}>홈으로</button>
      </div>
    </div>
  );
};

export default Admin;
