import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const EmployeeLogin: React.FC = () => {
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
      navigate('/employee-home');
    } catch (err: any) {
      setError('로그인 실패: ' + (err.message || '오류 발생'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-blue-100 animate-fade-in">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-blue-100 rounded-full p-4 mb-2">
            <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </div>
          <h2 className="text-2xl font-extrabold text-blue-700 mb-1">직원 로그인</h2>
          <div className="text-gray-500 text-sm">DB.INFO 내부 직원 전용</div>
        </div>
        <form onSubmit={handleLogin} className="mb-6 space-y-3">
          <div>
            <label className="block text-sm font-semibold mb-1 text-blue-700">이메일</label>
            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-200 transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-blue-700">비밀번호</label>
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-200 transition"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg shadow font-bold hover:scale-105 transition-transform"
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

export default EmployeeLogin;
