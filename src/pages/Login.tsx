import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/'); // 로그인 성공 시 홈페이지로 이동
    } catch (err: any) {
      setError(err.message || '로그인 실패');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border">
        <h2 className="text-2xl font-bold mb-6 text-blue-700">로그인</h2>
        {error && <div className="mb-4 text-red-600">{error}</div>}
        <div className="mb-4">
          <label className="block mb-1 font-bold">이메일</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full border rounded-xl px-4 py-2" />
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-bold">비밀번호</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full border rounded-xl px-4 py-2" />
        </div>
        <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700">로그인</button>
        <div className="mt-4 text-center">
          <span>계정이 없으신가요? </span>
          <button type="button" className="text-blue-600 underline" onClick={() => navigate('/signup')}>회원가입</button>
        </div>
      </form>
    </div>
  );
};

export default Login;
