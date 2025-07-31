import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import type { Project, Deployment } from '../types/project';
import { useAuth } from '../AuthContext';

const initialProject: Omit<Project, 'id' | 'deployments'> = {
  requestDate: '',
  client: '',
  project: '',
  period: '',
  location: '',
  developer: '',
  grade: '',
  department: '',
  skill: '',
  pay: undefined,
  supply: undefined,
  total: undefined,
  result: ''
};

const Projects: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user && user.email === 'west@naver.com';
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(initialProject);
// 오늘 날짜 yyyy-MM-dd 포맷 반환 함수
const getToday = () => {
  const d = new Date();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
};
const [deployForm, setDeployForm] = useState<Deployment>({ status: '등록', statusChangeDate: getToday(), note: '' });
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [message, setMessage] = useState('');
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      const snap = await getDocs(collection(db, 'projects'));
      setProjects(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project)));
      setLoading(false);
    };
    fetchProjects();
  }, [message]);

  // 프로젝트 등록/수정
  const handleAddOrEditProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) {
        // 수정
        const projectRef = doc(db, 'projects', editId);
        await updateDoc(projectRef, {
          ...form,
          grade: form.grade || '',
          department: form.department || '',
          skill: form.skill || '',
          pay: form.pay ?? 0,
          supply: form.supply ?? 0,
          total: form.total ?? 0,
          result: form.result || ''
        });
        setMessage('프로젝트가 수정되었습니다.');
      } else {
        // 등록
        await addDoc(collection(db, 'projects'), {
          ...form,
          grade: form.grade || '',
          department: form.department || '',
          skill: form.skill || '',
          pay: form.pay ?? 0,
          supply: form.supply ?? 0,
          total: form.total ?? 0,
          result: form.result || '',
          deployments: []
        });
        setMessage('프로젝트가 등록되었습니다.');
      }
      setForm(initialProject);
      setEditId(null);
      setTimeout(() => setMessage(''), 1500);
    } catch (e) {
      setMessage(editId ? '수정 실패' : '등록 실패');
      alert('등록 오류: ' + (e instanceof Error ? e.message : JSON.stringify(e)));
    }
  };

  // 프로젝트 삭제
  const handleDeleteProject = async (id: string) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await updateDoc(doc(db, 'projects', id), { deleted: true });
      setMessage('프로젝트가 삭제되었습니다.');
      setTimeout(() => setMessage(''), 1500);
    } catch {
      setMessage('삭제 실패');
    }
  };

  // 수정 버튼 클릭 시 폼에 데이터 채우기
  const handleEditProject = (id: string) => {
    const proj = projects.find(p => p.id === id);
    if (proj) {
      setForm({
        requestDate: proj.requestDate,
        client: proj.client,
        project: proj.project,
        period: proj.period,
        location: proj.location,
        developer: proj.developer,
        grade: proj.grade,
        department: proj.department,
        skill: proj.skill,
        pay: proj.pay,
        supply: proj.supply,
        total: proj.total,
        result: proj.result
      });
      setEditId(id);
    }
  };

// 프로젝트 상태관리 추가
const handleAddDeployment = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!selectedProjectId || !deployForm.statusChangeDate) {
    setMessage('프로젝트와 상태변경일을 입력하세요.');
    return;
  }
  try {
    const projectRef = doc(db, 'projects', selectedProjectId);
    const target = projects.find(p => p.id === selectedProjectId);
    const newDeployments = target?.deployments ? [...target.deployments, deployForm] : [deployForm];
    await updateDoc(projectRef, { deployments: newDeployments });
    setMessage('프로젝트 상태가 추가되었습니다.');
    setDeployForm({ status: '등록', statusChangeDate: getToday(), note: '' });
    setTimeout(() => setMessage(''), 1500);
  } catch {
    setMessage('상태관리 실패');
  }
};

  return (
    <div className="p-4 md:p-10 bg-gradient-to-br from-blue-50 to-white min-h-screen">
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-10 border border-blue-200 max-w-6xl mx-auto">
        <h2 className="text-2xl mb-8 text-blue-700 flex items-center gap-2 tracking-wide">
          <span>프로젝트 정보</span>
          {isAdmin && <span className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-full">관리자</span>}
        </h2>
        {message && <div className={`mb-4 px-4 py-2 rounded-xl text-center text-base ${message.includes('실패') ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>{message}</div>}
        {isAdmin && (
          <>
            {/* 프로젝트 추가 폼 */}
            <form onSubmit={handleAddOrEditProject} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-base mb-2 text-blue-700">등록일</label>
                <input name="requestDate" value={form.requestDate} onChange={e => setForm({ ...form, requestDate: e.target.value })} type="date" className="w-full px-4 py-2 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-300" required />
              </div>
              <div>
                <label className="block text-base mb-2 text-blue-700">수행사</label>
                <input name="client" value={form.client} onChange={e => setForm({ ...form, client: e.target.value })} className="w-full px-4 py-2 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-300" placeholder="수행사명" required />
              </div>
              <div>
                <label className="block text-base mb-2 text-blue-700">프로젝트개요</label>
                <input name="project" value={form.project} onChange={e => setForm({ ...form, project: e.target.value })} className="w-full px-4 py-2 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-300" placeholder="프로젝트개요" required />
              </div>
              <div>
                <label className="block text-base mb-2 text-blue-700">프로젝트기간</label>
                <input name="period" value={form.period} onChange={e => setForm({ ...form, period: e.target.value })} className="w-full px-4 py-2 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-300" placeholder="예: 6개월" required />
              </div>
              <div>
                <label className="block text-base mb-2 text-blue-700">장소</label>
                <input name="location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="w-full px-4 py-2 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-300" placeholder="장소" />
              </div>
              <div>
                <label className="block text-base mb-2 text-blue-700">요청기술</label>
                <input name="developer" value={form.developer} onChange={e => setForm({ ...form, developer: e.target.value })} className="w-full px-4 py-2 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-300" placeholder="요청기술" />
              </div>
              <div className="flex gap-3 mb-8 col-span-1 md:col-span-3">
                <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-xl text-base hover:bg-blue-700 transition shadow">{editId ? '수정' : '등록'}</button>
                {editId && <button type="button" className="px-5 py-2 bg-gray-400 text-white rounded-xl text-base hover:bg-gray-500 transition shadow" onClick={()=>{setForm(initialProject);setEditId(null);}}>취소</button>}
              </div>
            </form>
            {/* 프로젝트 상태관리 폼 */}
            <form onSubmit={handleAddDeployment} className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div>
                <label className="block text-base mb-2 text-blue-700">프로젝트 선택</label>
                <select value={selectedProjectId} onChange={e => setSelectedProjectId(e.target.value)} className="w-full px-4 py-2 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-300" required>
                  <option value="">프로젝트 선택</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.project}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-base mb-2 text-blue-700">상태</label>
                <select name="status" value={deployForm.status} onChange={e => setDeployForm({ ...deployForm, status: e.target.value as '등록' | '진행' | '마감' })} className="w-full px-4 py-2 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-300" required>
                  <option value="등록">등록</option>
                  <option value="진행">진행</option>
                  <option value="마감">마감</option>
                </select>
              </div>
              <div>
                <label className="block text-base mb-2 text-blue-700">상태변경일</label>
                <input name="statusChangeDate" value={deployForm.statusChangeDate} onChange={e => setDeployForm({ ...deployForm, statusChangeDate: e.target.value })} type="date" className="w-full px-4 py-2 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-300" required />
              </div>
              <div>
                <label className="block text-base mb-2 text-blue-700">비고</label>
                <input name="note" value={deployForm.note} onChange={e => setDeployForm({ ...deployForm, note: e.target.value })} className="w-full px-4 py-2 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-300" placeholder="비고" />
              </div>
              <div className="col-span-1 md:col-span-4 flex gap-3 mt-2">
                <button type="submit" className="px-5 py-2 bg-green-600 text-white rounded-xl text-base hover:bg-green-700 transition shadow">프로젝트 상태관리</button>
              </div>
            </form>
          </>
        )}
      </div>
      <div className="overflow-x-auto max-w-6xl mx-auto">
        {loading ? (
          <p className="text-base text-blue-600">로딩 중...</p>
        ) : (
          <table className="min-w-[900px] border bg-white rounded-2xl shadow-xl text-base">
            <thead className="bg-blue-100 sticky top-0">
              <tr>
                <th className="border px-4 py-3 text-blue-700">번호</th>
                <th className="border px-4 py-3 text-blue-700 whitespace-nowrap">등록일</th>
                <th className="border px-4 py-3 text-blue-700">수행사</th>
                <th className="border px-4 py-3 text-blue-700">프로젝트개요</th>
                <th className="border px-4 py-3 text-blue-700 whitespace-nowrap">프로젝트기간</th>
                <th className="border px-4 py-3 text-blue-700">장소</th>
                <th className="border px-4 py-3 text-blue-700">요청기술</th>
                <th className="border px-4 py-3 text-blue-700">프로젝트 상태</th>
                {isAdmin && <th className="border px-4 py-3 text-blue-700">관리</th>}
              </tr>
            </thead>
            <tbody>
              {projects.filter(p=>!p.deleted).map((proj, idx) => (
                <tr key={proj.id} className="hover:bg-blue-50 transition">
                  <td className="border px-4 py-3 text-center">{idx + 1}</td>
                  <td className="border px-4 py-3 text-center whitespace-nowrap">{proj.requestDate}</td>
                  <td className="border px-4 py-3">{proj.client}</td>
                  <td className="border px-4 py-3">{proj.project}</td>
                  <td className="border px-4 py-3 text-center whitespace-nowrap">{proj.period}</td>
                  <td className="border px-4 py-3">{proj.location}</td>
                  <td className="border px-4 py-3">{proj.developer}</td>
                  <td className="border px-4 py-3">
                    {proj.deployments && proj.deployments.length > 0 ? (
                      <ul className="list-disc list-inside space-y-1">
                        {proj.deployments.map((dep, dIdx) => (
                          <li key={dIdx} className="text-sm text-blue-700">
                            <span className="inline-block bg-blue-200 text-blue-800 px-2 py-0.5 rounded mr-1">{dep.status}</span>
                            <span className="inline-block bg-gray-100 text-gray-700 px-2 py-0.5 rounded mr-1">{dep.statusChangeDate}</span>
                            {dep.note && <span className="inline-block bg-green-100 text-green-700 px-2 py-0.5 rounded">{dep.note}</span>}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-gray-400">상태 없음</span>
                    )}
                  </td>
                  {isAdmin && (
                    <td className="border px-4 py-3 whitespace-nowrap">
                      <button className="px-3 py-1 bg-yellow-400 text-base rounded-xl mr-2 hover:bg-yellow-500 transition shadow" onClick={() => handleEditProject(proj.id)}>수정</button>
                      <button className="px-3 py-1 bg-red-400 text-base rounded-xl hover:bg-red-500 transition shadow" onClick={() => handleDeleteProject(proj.id)}>삭제</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="mt-10 flex justify-end max-w-6xl mx-auto">
        <button
          onClick={() => navigate('/admin-home')}
          className="px-6 py-3 bg-gray-300 text-gray-800 rounded-xl hover:bg-gray-400 text-lg shadow"
        >
          관리자 홈으로
        </button>
      </div>
    </div>
  );
};

export default Projects;
