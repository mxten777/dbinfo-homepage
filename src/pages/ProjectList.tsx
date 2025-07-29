import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import type { Project } from '../types/project';

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      const snap = await getDocs(collection(db, 'projects'));
      setProjects(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project)));
      setLoading(false);
    };
    fetchProjects();
  }, []);

  // 등록일 내림차순 정렬
  const sorted = [...projects]
    .filter(p => !p.deleted)
    .sort((a, b) => (b.requestDate || '').localeCompare(a.requestDate || ''));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-10 px-2 flex flex-col items-center">
      <div className="w-full max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-center text-blue-700 flex items-center gap-2">
            <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 018 0v2M9 21h6a2 2 0 002-2v-2a2 2 0 00-2-2H9a2 2 0 00-2 2v2a2 2 0 002 2z" /></svg>
            프로젝트 현황
          </h1>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition"
            onClick={() => navigate('/')}
          >
            홈으로
          </button>
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          {loading ? (
            <div className="text-center py-8 text-gray-400 animate-pulse">
              <svg className="w-8 h-8 mx-auto mb-2 text-blue-300 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
              프로젝트 데이터를 불러오는 중...
            </div>
          ) : sorted.length === 0 ? (
            <div className="text-center py-8 text-gray-400">등록된 프로젝트가 없습니다.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[900px] w-full border-separate border-spacing-y-2">
                <thead>
                  <tr className="bg-blue-100 text-blue-900">
                    <th className="border px-4 py-2 rounded-tl-lg">번호</th>
                    <th className="border px-4 py-2">등록일</th>
                    <th className="border px-4 py-2">수행사</th>
                    <th className="border px-4 py-2">프로젝트개요</th>
                    <th className="border px-4 py-2">프로젝트기간</th>
                    <th className="border px-4 py-2">장소</th>
                    <th className="border px-4 py-2">요청기술</th>
                    <th className="border px-4 py-2 rounded-tr-lg">프로젝트 상태</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((proj, idx) => {
                    const filteredDeployments = (proj.deployments || []).filter(
                      d => d.status === '진행' || d.status === '마감'
                    );
                    if (filteredDeployments.length === 0) return null;
                    return (
                      <tr key={proj.id} className="bg-gray-50 hover:bg-blue-50 shadow rounded-lg">
                        <td className="border px-4 py-2 text-center font-semibold">{idx + 1}</td>
                        <td className="border px-4 py-2 text-center">{proj.requestDate}</td>
                        <td className="border px-4 py-2">{proj.client}</td>
                        <td className="border px-4 py-2 max-w-[220px] truncate" title={proj.project}>{proj.project}</td>
                        <td className="border px-4 py-2 text-center">{proj.period}</td>
                        <td className="border px-4 py-2">{proj.location}</td>
                        <td className="border px-4 py-2">{proj.developer}</td>
                        <td className="border px-4 py-2">
                          <ul className="list-none space-y-1">
                            {filteredDeployments.map((dep, dIdx) => (
                              <li key={dIdx} className="flex items-center gap-2 text-xs">
                                {dep.status === '진행' ? (
                                  <span className="inline-flex items-center px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-bold">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /></svg>
                                    진행
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full font-bold">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                    마감
                                  </span>
                                )}
                                <span className="inline-block bg-gray-100 text-gray-700 px-2 py-0.5 rounded">{dep.statusChangeDate}</span>
                                {dep.note && <span className="inline-block bg-green-100 text-green-700 px-2 py-0.5 rounded">{dep.note}</span>}
                              </li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectList;
