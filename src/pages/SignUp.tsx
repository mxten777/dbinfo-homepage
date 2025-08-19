import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { db } from '../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // 직원 정보 Firestore에 저장 (employees 컬렉션)
      await setDoc(doc(db, 'employees', userCredential.user.uid), {
        uid: userCredential.user.uid,
        email,
        name,
        createdAt: new Date().toISOString(),
      });
      setSuccess('회원가입이 완료되었습니다. 로그인 해주세요.');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err: any) {
      setError(err.message || '회원가입 실패');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleSignUp} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border">
        <h2 className="text-2xl font-bold mb-6 text-blue-700">회원가입</h2>
        {error && <div className="mb-4 text-red-600">{error}</div>}
        {success && <div className="mb-4 text-green-600">{success}</div>}
        <div className="mb-4">
          <label className="block mb-1 font-bold">이름</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full border rounded-xl px-4 py-2" />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-bold">이메일</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full border rounded-xl px-4 py-2" />
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-bold">비밀번호</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full border rounded-xl px-4 py-2" />
        </div>
        <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700">회원가입</button>
        <div className="mt-4 text-center">
          <span>이미 계정이 있으신가요? </span>
          <button type="button" className="text-blue-600 underline" onClick={() => navigate('/login')}>로그인</button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
