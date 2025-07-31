import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

const AdminProjectRegister: React.FC = () => {
  const [form, setForm] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.description) {
      setMessage('모든 항목을 입력하세요.');
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, 'projects'), {
        name: form.name,
        description: form.description,
        createdAt: new Date().toISOString(),
      });
      setMessage('프로젝트가 등록되었습니다!');
      setForm({ name: '', description: '' });
    } catch (err) {
      setMessage('등록 실패: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4 flex justify-center items-start">
      <div className="w-full max-w-xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100 flex flex-col gap-10">
          <h1 className="text-3xl font-extrabold text-blue-700 text-center mb-2 tracking-tight">프로젝트 정보 등록</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <label className="font-semibold mb-2 text-gray-700">프로젝트명</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-blue-400"
                placeholder="프로젝트명 입력"
                required
              />
            </div>
            <div>
              <label className="font-semibold mb-2 text-gray-700">설명</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-blue-400"
                placeholder="프로젝트 설명 입력"
                required
                rows={4}
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-blue-500 text-white rounded-xl font-bold text-lg shadow hover:bg-blue-600 transition"
              disabled={loading}
            >
              {loading ? '등록 중...' : '등록'}
            </button>
            {message && <div className="text-green-600 mt-4 text-center font-semibold">{message}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminProjectRegister;
