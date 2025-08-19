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
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }
      try {
        const adminDoc = await import('firebase/firestore').then(firestore =>
          firestore.getDoc(firestore.doc(db, 'admins', user.uid))
        );
        setIsAdmin(!!(adminDoc.exists && adminDoc.exists() && adminDoc.data()?.isAdmin === true));
      } catch {
        setIsAdmin(false);
      }
    };
    checkAdmin();
  }, [user]);
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
const [deployForm, setDeployForm] = useState<Deployment>({ status: '진행', statusChangeDate: getToday(), note: '' });
  const [selectedProjectId] = useState<string>('');
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
    if (!isAdmin) {
      setMessage('관리자 권한이 필요합니다.');
      return;
    }
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
    if (!isAdmin) {
      setMessage('관리자 권한이 필요합니다.');
      return;
    }
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
  if (!isAdmin) {
    setMessage('관리자 권한이 필요합니다.');
    return;
  }
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
    setDeployForm({ status: '진행', statusChangeDate: getToday(), note: '' });
    setTimeout(() => setMessage(''), 1500);
  } catch {
    setMessage('상태관리 실패');
  }
};

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white rounded-2xl shadow-xl p-10 border border-red-200 flex flex-col items-center">
          <div className="text-6xl mb-4 text-red-400">❗</div>
          <div className="text-2xl font-bold mb-2">접근 권한이 없습니다</div>
          <div className="mb-6 text-gray-600">관리자 권한이 필요한 페이지입니다.</div>
          <button onClick={() => navigate('/')} className="px-6 py-3 bg-blue-500 text-white rounded-xl text-lg shadow hover:bg-blue-600">홈으로 돌아가기</button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10 bg-gradient-to-br from-blue-50 to-white min-h-screen">
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-10 border border-blue-200 max-w-6xl mx-auto">
        <h2 className="text-2xl mb-8 text-blue-700 flex items-center gap-2 tracking-wide">
          <span>프로젝트 정보</span>
          <span className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-full">관리자</span>
        </h2>
        {message && <div className={`mb-4 px-4 py-2 rounded-xl text-center text-base ${message.includes('실패') ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>{message}</div>}
        {/* 프로젝트 추가 폼 */}
        <form onSubmit={handleAddOrEditProject} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* ...기존 코드... */}
        </form>
        {/* 프로젝트 상태관리 폼 */}
        <form onSubmit={handleAddDeployment} className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div>
            <label className="block font-bold mb-2 text-gray-700 text-base">상태</label>
            <select
              name="status"
              value={deployForm.status}
              onChange={e => setDeployForm({ ...deployForm, status: e.target.value as '진행' | '완료' })}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-blue-400 text-base"
              required
            >
              <option value="진행">진행</option>
              <option value="완료">완료</option>
            </select>
          </div>
          <div>
            <label className="block font-bold mb-2 text-gray-700 text-base">상태변경일</label>
            <input
              type="date"
              name="statusChangeDate"
              value={deployForm.statusChangeDate}
              onChange={e => setDeployForm({ ...deployForm, statusChangeDate: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-blue-400 text-base"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block font-bold mb-2 text-gray-700 text-base">비고</label>
            <input
              type="text"
              name="note"
              value={deployForm.note}
              onChange={e => setDeployForm({ ...deployForm, note: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-blue-400 text-base"
              placeholder="비고 입력"
            />
          </div>
          <div className="md:col-span-4 flex justify-center mt-2">
            <button type="submit" className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-blue-700 transition-all duration-150">등록됨</button>
          </div>
        </form>
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
                <th className="border px-4 py-3 text-blue-700">관리</th>
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
                            <span className={`inline-block px-2 py-0.5 rounded mr-1 ${dep.status === '등록' ? 'bg-gray-200 text-gray-700' : dep.status === '진행' ? 'bg-blue-200 text-blue-800' : 'bg-green-200 text-green-800'}`}>{dep.status}</span>
                            <span className="inline-block bg-gray-100 text-gray-700 px-2 py-0.5 rounded mr-1">{dep.statusChangeDate}</span>
                            {dep.note && <span className="inline-block bg-green-100 text-green-700 px-2 py-0.5 rounded">{dep.note}</span>}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-gray-400">상태 없음</span>
                    )}
                  </td>
                  <td className="border px-4 py-3 whitespace-nowrap">
                    <button className="px-3 py-1 bg-yellow-400 text-base rounded-xl mr-2 hover:bg-yellow-500 transition shadow" onClick={() => handleEditProject(proj.id)}>수정</button>
                    <button className="px-3 py-1 bg-red-400 text-base rounded-xl hover:bg-red-500 transition shadow" onClick={() => handleDeleteProject(proj.id)}>삭제</button>
                  </td>
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
