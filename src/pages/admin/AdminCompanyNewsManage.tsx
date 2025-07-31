import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';


const initialForm = {
  title: '',
  content: '',
  author: '',
  date: '',
};

const AdminCompanyNewsManage: React.FC = () => {
  const navigate = useNavigate();
  const [newsList, setNewsList] = useState<any[]>([]);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      const snap = await getDocs(collection(db, 'companyNews'));
      setNewsList(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchNews();
  }, [message]);

  const handleEdit = (news: any) => {
    setForm({
      title: news.title || '',
      content: news.content || '',
      author: news.author || '',
      date: news.date || '',
    });
    setEditId(news.id);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      await deleteDoc(doc(db, 'companyNews', id));
      setMessage('삭제되었습니다.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateDoc(doc(db, 'companyNews', editId), form);
        setMessage('수정되었습니다.');
        setEditId(null);
      } else {
        await addDoc(collection(db, 'companyNews'), form);
        setMessage('등록되었습니다.');
      }
      setForm(initialForm);
    } catch (err) {
      setMessage('처리 실패: ' + (err as Error).message);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-extrabold mb-6 text-blue-800 tracking-tight text-center drop-shadow">사내소식 등록/수정/삭제</h2>
      {message && <div className="mb-4 text-green-600 font-semibold text-lg text-center">{message}</div>}
      <form onSubmit={handleSubmit} className="bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-2xl p-8 mb-10 grid grid-cols-1 md:grid-cols-2 gap-6 border border-blue-100">
        <div className="md:col-span-2">
          <label className="block text-base font-bold mb-2 text-gray-700">제목</label>
          <input name="title" value={form.title} onChange={handleChange} className="border-2 border-blue-200 rounded-lg px-3 py-2 w-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-300" required />
        </div>
        <div className="md:col-span-2">
          <label className="block text-base font-bold mb-2 text-gray-700">내용</label>
          <textarea name="content" value={form.content} onChange={handleChange} className="border-2 border-blue-200 rounded-lg px-3 py-2 w-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-300 min-h-[100px]" required />
        </div>
        <div>
          <label className="block text-base font-bold mb-2 text-gray-700">작성자</label>
          <input name="author" value={form.author} onChange={handleChange} className="border-2 border-blue-200 rounded-lg px-3 py-2 w-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-300" />
        </div>
        <div>
          <label className="block text-base font-bold mb-2 text-gray-700">등록일</label>
          <input name="date" type="date" value={form.date} onChange={handleChange} className="border-2 border-blue-200 rounded-lg px-3 py-2 w-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-300" />
        </div>
        <div className="md:col-span-2 flex gap-4 mt-4 justify-center">
          <button type="submit" className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-blue-700 transition-all duration-150">{editId ? '수정' : '등록'}</button>
          {editId && <button type="button" className="px-8 py-3 bg-gray-400 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-gray-500 transition-all duration-150" onClick={()=>{setForm(initialForm);setEditId(null);}}>취소</button>}
        </div>
      </form>
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-4xl mx-auto mt-6">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-blue-100 sticky top-0 z-10">
              <tr>
                <th className="border px-4 py-2">제목</th>
                <th className="border px-4 py-2">내용</th>
                <th className="border px-4 py-2">작성자</th>
                <th className="border px-4 py-2">등록일</th>
                <th className="border px-4 py-2">수정</th>
                <th className="border px-4 py-2">삭제</th>
              </tr>
            </thead>
            <tbody>
              {newsList.map(news => (
                <tr key={news.id} className="hover:bg-blue-50 transition">
                  <td className="border px-4 py-2 whitespace-nowrap truncate max-w-[200px]">{news.title}</td>
                  <td className="border px-4 py-2 whitespace-nowrap truncate max-w-[300px]">{news.content}</td>
                  <td className="border px-4 py-2">{news.author || '-'}</td>
                  <td className="border px-4 py-2">{news.date || '-'}</td>
                  <td className="border px-4 py-2">
                    <button onClick={() => handleEdit(news)} className="px-3 py-1 bg-yellow-200 text-yellow-900 rounded-lg font-bold shadow hover:bg-yellow-300 transition">수정</button>
                  </td>
                  <td className="border px-4 py-2">
                    <button onClick={() => handleDelete(news.id!)} className="px-3 py-1 bg-red-500 text-white rounded-lg font-bold shadow hover:bg-red-600 transition">삭제</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex justify-center my-8">
        <button className="bg-gray-200 px-6 py-2 rounded-full shadow text-lg font-semibold hover:bg-gray-300" onClick={() => navigate('/admin/home')}>관리자 홈으로</button>
      </div>
    </div>
  );
};

export default AdminCompanyNewsManage;
