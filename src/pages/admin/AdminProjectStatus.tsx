import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

const initialForm = {
  project: '',
  client: '',
  requestDate: '',
  period: '',
  location: '',
  developer: '',
  deployments: [{ status: '등록', statusChangeDate: '' }],
};

const AdminProjectStatus: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      const snap = await getDocs(collection(db, 'projects'));
      setProjects(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchProjects();
  }, [message]);

  const handleEdit = (project: any) => {
    setForm({
      project: project.project || '',
      client: project.client || '',
      requestDate: project.requestDate || '',
      period: project.period || '',
      location: project.location || '',
      developer: project.developer || '',
      deployments: project.deployments || [{ status: '등록', statusChangeDate: '' }],
    });
    setEditId(project.id);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'status' || name === 'statusChangeDate') {
      setForm({
        ...form,
        deployments: [{
          ...form.deployments[0],
          [name]: value,
        }],
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateDoc(doc(db, 'projects', editId), form);
        setMessage('수정되었습니다.');
        setEditId(null);
      } else {
        await addDoc(collection(db, 'projects'), form);
        setMessage('등록되었습니다.');
      }
      setForm(initialForm);
    } catch (err) {
      setMessage('처리 실패: ' + (err as Error).message);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      await deleteDoc(doc(db, 'projects', id));
      setMessage('삭제되었습니다.');
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl mb-6 text-blue-800 tracking-tight text-center drop-shadow">프로젝트 등록/수정/삭제</h2>
      {message && <div className="mb-4 text-green-600 font-semibold text-lg text-center">{message}</div>}
      <form onSubmit={handleSubmit} className="bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-2xl p-8 mb-10 grid grid-cols-1 md:grid-cols-2 gap-6 border border-blue-100">
        <div>
          <label className="block text-base font-bold mb-2 text-gray-700">프로젝트명</label>
          <input name="project" value={form.project} onChange={handleChange} className="border-2 border-blue-200 rounded-lg px-3 py-2 w-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-300" required />
        </div>
        <div>
          <label className="block text-base font-bold mb-2 text-gray-700">고객사</label>
          <input name="client" value={form.client} onChange={handleChange} className="border-2 border-blue-200 rounded-lg px-3 py-2 w-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-300" />
        </div>
        <div>
          <label className="block text-base font-bold mb-2 text-gray-700">등록일</label>
          <input name="requestDate" value={form.requestDate} onChange={handleChange} className="border-2 border-blue-200 rounded-lg px-3 py-2 w-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-300" />
        </div>
        <div>
          <label className="block text-base font-bold mb-2 text-gray-700">프로젝트기간</label>
          <input name="period" value={form.period} onChange={handleChange} className="border-2 border-blue-200 rounded-lg px-3 py-2 w-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-300" />
        </div>
        <div>
          <label className="block text-base font-bold mb-2 text-gray-700">장소</label>
          <input name="location" value={form.location} onChange={handleChange} className="border-2 border-blue-200 rounded-lg px-3 py-2 w-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-300" />
        </div>
        <div>
          <label className="block text-base font-bold mb-2 text-gray-700">개발자</label>
          <input name="developer" value={form.developer} onChange={handleChange} className="border-2 border-blue-200 rounded-lg px-3 py-2 w-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-300" />
        </div>
        <div>
          <label className="block text-base font-bold mb-2 text-gray-700">상태</label>
          <input name="status" value={form.deployments[0].status} onChange={handleChange} className="border-2 border-blue-200 rounded-lg px-3 py-2 w-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-300" />
        </div>
        <div>
          <label className="block text-base font-bold mb-2 text-gray-700">상태변경일</label>
          <input name="statusChangeDate" value={form.deployments[0].statusChangeDate} onChange={handleChange} className="border-2 border-blue-200 rounded-lg px-3 py-2 w-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-300" />
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
                <th className="border px-4 py-2">프로젝트명</th>
                <th className="border px-4 py-2">고객사</th>
                <th className="border px-4 py-2">등록일</th>
                <th className="border px-4 py-2">기간</th>
                <th className="border px-4 py-2">장소</th>
                <th className="border px-4 py-2">개발자</th>
                <th className="border px-4 py-2">상태</th>
                <th className="border px-4 py-2">상태변경일</th>
                <th className="border px-4 py-2">수정</th>
                <th className="border px-4 py-2">삭제</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(project => (
                <tr key={project.id} className="hover:bg-blue-50 transition">
                  <td className="border px-4 py-2">{project.project}</td>
                  <td className="border px-4 py-2">{project.client}</td>
                  <td className="border px-4 py-2">{project.requestDate || '-'}</td>
                  <td className="border px-4 py-2">{project.period || '-'}</td>
                  <td className="border px-4 py-2">{project.location || '-'}</td>
                  <td className="border px-4 py-2">{project.developer || '-'}</td>
                  <td className="border px-4 py-2">{project.deployments && project.deployments[0] ? project.deployments[0].status : '-'}</td>
                  <td className="border px-4 py-2">{project.deployments && project.deployments[0] ? project.deployments[0].statusChangeDate : '-'}</td>
                  <td className="border px-4 py-2">
                    <button onClick={() => handleEdit(project)} className="px-3 py-1 bg-yellow-200 text-yellow-900 rounded-lg font-bold shadow hover:bg-yellow-300 transition">수정</button>
                  </td>
                  <td className="border px-4 py-2">
                    <button onClick={() => handleDelete(project.id!)} className="px-3 py-1 bg-red-500 text-white rounded-lg font-bold shadow hover:bg-red-600 transition">삭제</button>
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

export default AdminProjectStatus;