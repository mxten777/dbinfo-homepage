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
    <div className="p-4 md:p-8 bg-gradient-to-br from-blue-50 to-white min-h-screen">
      <div className="bg-white rounded-xl shadow p-6 mb-8 border border-blue-100 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
            <span>프로젝트 현황</span>
          </h2>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-semibold"
            onClick={() => navigate('/')}
          >홈으로</button>
        </div>
        {loading ? (
          <p>로딩 중...</p>
        ) : (
          <table className="min-w-[900px] border bg-white rounded-xl shadow text-sm">
            <thead className="bg-blue-50 sticky top-0">
              <tr>
                <th className="border px-3 py-2">번호</th>
                <th className="border px-3 py-2">등록일</th>
                <th className="border px-3 py-2">수행사</th>
                <th className="border px-3 py-2">프로젝트개요</th>
                <th className="border px-3 py-2">프로젝트기간</th>
                <th className="border px-3 py-2">장소</th>
                <th className="border px-3 py-2">요청기술</th>
                <th className="border px-3 py-2">프로젝트 상태</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((proj, idx) => {
                // 진행/마감 상태만 추출
                const filteredDeployments = (proj.deployments || []).filter(
                  d => d.status === '진행' || d.status === '마감'
                );
                if (filteredDeployments.length === 0) return null;
                return (
                  <tr key={proj.id} className="hover:bg-blue-50 transition">
                    <td className="border px-3 py-2 text-center">{idx + 1}</td>
                    <td className="border px-3 py-2 text-center">{proj.requestDate}</td>
                    <td className="border px-3 py-2">{proj.client}</td>
                    <td className="border px-3 py-2">{proj.project}</td>
                    <td className="border px-3 py-2 text-center">{proj.period}</td>
                    <td className="border px-3 py-2">{proj.location}</td>
                    <td className="border px-3 py-2">{proj.developer}</td>
                    <td className="border px-3 py-2">
                      <ul className="list-disc list-inside space-y-1">
                        {filteredDeployments.map((dep, dIdx) => (
                          <li key={dIdx} className="text-xs text-gray-700">
                            <span className={`inline-block px-2 py-0.5 rounded mr-1 ${dep.status === '진행' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-700'}`}>{dep.status}</span>
                            <span className="inline-block bg-gray-100 text-gray-700 px-2 py-0.5 rounded mr-1">{dep.statusChangeDate}</span>
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
        )}
      </div>
    </div>
  );
};

export default ProjectList;
