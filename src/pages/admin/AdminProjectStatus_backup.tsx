import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

const initialForm = {
  project: '',
  client: '',
  requestDate: '',
  period: '',
  location: '',
  developer: '',
  deployments: [{ status: '진행', statusChangeDate: '' }],
};

const AdminProjectStatus: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [message, setMessage] = useState('');

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
      deployments: project.deployments && project.deployments.length > 0
        ? project.deployments.map((d: any) => ({
            ...d,
            status: d.status === '진행중' ? '진행' : d.status
          }))
        : [{ status: '진행', statusChangeDate: '' }],
    });
    setEditId(project.id);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
        const newForm = {
          ...form,
          deployments: [{
            ...form.deployments[0],
            status: '진행',
          }],
        };
        await addDoc(collection(db, 'projects'), newForm);
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
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-brand-50/20 to-accent-50/20 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 섹션 */}
        <div className="glass-strong rounded-3xl p-8 mb-8 shadow-glass border border-white/30 bg-gradient-to-br from-white/95 to-white/80">
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-brand-100 to-accent-100 rounded-full border border-brand-200/50">
                <div className="w-3 h-3 bg-gradient-to-r from-brand-500 to-accent-500 rounded-full animate-pulse"></div>
                <span className="text-brand-700 font-bold text-sm">PROJECT MANAGEMENT</span>
              </div>
              <h1 className="text-4xl font-black gradient-text font-display tracking-tight">
                프로젝트 관리
              </h1>
              <p className="text-neutral-600 text-lg">
                프로젝트 등록, 수정, 삭제 및 진행 상황을 관리하세요
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="glass rounded-2xl p-4 bg-gradient-to-br from-brand-50/50 to-accent-50/50 border border-brand-200/30">
                <div className="text-center">
                  <div className="text-3xl font-bold text-brand-700">{projects.length}</div>
                  <div className="text-sm text-brand-600 font-medium">등록된 프로젝트</div>
                </div>
              </div>
              
              <Link 
                to="/admin/home"
                className="btn-primary bg-gradient-to-r from-brand-500 to-accent-500 text-white px-6 py-3 rounded-2xl hover:scale-105 transition-transform duration-300 font-bold shadow-glow flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                관리자홈
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* 프로젝트 등록/수정 폼 섹션 */}
          <div className="xl:col-span-1">
            <div className="glass-strong rounded-3xl shadow-glass border border-white/30 bg-gradient-to-br from-white/95 to-white/80 overflow-hidden">
              <div className="p-8">
                <div className="flex items-center gap-3 pb-6 border-b border-neutral-200/50">
                  <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-glow">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-neutral-800">
                      {editId ? '프로젝트 수정' : '새 프로젝트 등록'}
                    </h3>
                    <p className="text-sm text-neutral-600">
                      {editId ? '기존 프로젝트 정보를 수정합니다' : '새로운 프로젝트를 등록하세요'}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-neutral-700">프로젝트명 *</label>
                      <input 
                        name="project" 
                        value={form.project} 
                        onChange={handleChange} 
                        placeholder="프로젝트 이름을 입력하세요" 
                        className="w-full glass rounded-xl px-4 py-3 border border-brand-200/30 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all duration-300 bg-gradient-to-r from-white/90 to-brand-50/20"
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-neutral-700">고객사</label>
                      <input 
                        name="client" 
                        value={form.client} 
                        onChange={handleChange} 
                        placeholder="고객사명을 입력하세요" 
                        className="w-full glass rounded-xl px-4 py-3 border border-success-200/30 focus:ring-2 focus:ring-success-500 focus:border-success-500 outline-none transition-all duration-300 bg-gradient-to-r from-white/90 to-success-50/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-neutral-700">등록일</label>
                      <input 
                        name="requestDate" 
                        type="date"
                        value={form.requestDate} 
                        onChange={handleChange} 
                        className="w-full glass rounded-xl px-4 py-3 border border-success-200/30 focus:ring-2 focus:ring-success-500 focus:border-success-500 outline-none transition-all duration-300 bg-gradient-to-r from-white/90 to-success-50/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-neutral-700">프로젝트 기간</label>
                      <input 
                        name="period" 
                        value={form.period} 
                        onChange={handleChange} 
                        placeholder="예: 2024.01 ~ 2024.12" 
                        className="w-full glass rounded-xl px-4 py-3 border border-success-200/30 focus:ring-2 focus:ring-success-500 focus:border-success-500 outline-none transition-all duration-300 bg-gradient-to-r from-white/90 to-success-50/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-neutral-700">장소</label>
                      <input 
                        name="location" 
                        value={form.location} 
                        onChange={handleChange} 
                        placeholder="프로젝트 수행 장소" 
                        className="w-full glass rounded-xl px-4 py-3 border border-accent-200/30 focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none transition-all duration-300 bg-gradient-to-r from-white/90 to-accent-50/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-neutral-700">개발자</label>
                      <input 
                        name="developer" 
                        value={form.developer} 
                        onChange={handleChange} 
                        placeholder="담당 개발자명" 
                        className="w-full glass rounded-xl px-4 py-3 border border-accent-200/30 focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none transition-all duration-300 bg-gradient-to-r from-white/90 to-accent-50/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-neutral-700">프로젝트 상태</label>
                      <select
                        name="status"
                        value={form.deployments[0].status}
                        onChange={handleChange}
                        disabled={!editId}
                        className="w-full glass rounded-xl px-4 py-3 border border-warning-200/30 focus:ring-2 focus:ring-warning-500 focus:border-warning-500 outline-none transition-all duration-300 bg-gradient-to-r from-white/90 to-warning-50/20 disabled:opacity-50"
                      >
                        <option value="진행">진행중</option>
                        <option value="완료">완료</option>
                      </select>
                      {!editId && (
                        <p className="text-xs text-warning-600">* 신규 등록시 자동으로 '진행중'으로 설정됩니다</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-neutral-700">상태 변경일</label>
                      <input 
                        name="statusChangeDate" 
                        type="date"
                        value={form.deployments[0].statusChangeDate} 
                        onChange={handleChange} 
                        className="w-full glass rounded-xl px-4 py-3 border border-warning-200/30 focus:ring-2 focus:ring-warning-500 focus:border-warning-500 outline-none transition-all duration-300 bg-gradient-to-r from-white/90 to-warning-50/20"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button 
                      type="submit" 
                      className="flex-1 btn-primary bg-gradient-to-r from-brand-500 to-accent-500 text-white py-3 rounded-2xl font-bold hover:scale-105 transition-transform duration-300 shadow-glow flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {editId ? '수정 완료' : '프로젝트 등록'}
                    </button>
                    {editId && (
                      <button 
                        type="button" 
                        onClick={() => {setForm(initialForm);setEditId(null);}} 
                        className="px-6 btn-secondary bg-gradient-to-r from-neutral-500 to-brand-500 text-white py-3 rounded-2xl font-bold hover:scale-105 transition-transform duration-300 shadow-glow flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        취소
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* 프로젝트 목록 섹션 */}
          <div className="xl:col-span-1">
            <div className="glass-strong rounded-3xl shadow-glass border border-white/30 bg-gradient-to-br from-white/95 to-white/80 overflow-hidden">
              <div className="p-8">
                <div className="flex items-center gap-3 pb-6 border-b border-neutral-200/50">
                  <div className="w-10 h-10 bg-gradient-to-br from-success-500 to-brand-500 rounded-2xl flex items-center justify-center shadow-glow">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-neutral-800">프로젝트 목록</h3>
                    <p className="text-sm text-neutral-600">등록된 모든 프로젝트</p>
                  </div>
                </div>

                <div className="mt-6 space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {projects.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gradient-to-br from-neutral-400 to-neutral-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <h4 className="text-xl font-bold text-neutral-700 mb-2">등록된 프로젝트가 없습니다</h4>
                      <p className="text-neutral-600 mb-4">첫 번째 프로젝트를 등록해보세요.</p>
                    </div>
                  ) : (
                    projects.map((project, index) => (
                      <div 
                        key={project.id} 
                        className="group glass rounded-2xl p-6 border border-neutral-200/30 hover:border-brand-300/50 transition-all duration-300 hover:shadow-glow bg-gradient-to-br from-white/80 to-neutral-50/30"
                      >
                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2 flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-gradient-to-br from-brand-500 to-accent-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                                  {index + 1}
                                </div>
                                <h4 className="font-bold text-neutral-800 truncate">{project.project}</h4>
                                <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                                  project.deployments?.[0]?.status === '완료' 
                                    ? 'bg-gradient-to-r from-success-100 to-brand-100 text-success-700' 
                                    : 'bg-gradient-to-r from-warning-100 to-accent-100 text-warning-700'
                                }`}>
                                  {project.deployments?.[0]?.status || '진행'}
                                </div>
                              </div>
                              <div className="text-sm text-neutral-600 space-y-1">
                                <div><span className="font-medium">고객사:</span> {project.client || '-'}</div>
                                <div><span className="font-medium">기간:</span> {project.period || '-'}</div>
                                <div><span className="font-medium">개발자:</span> {project.developer || '-'}</div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-neutral-200/30">
                            <div className="text-xs text-neutral-500">
                              등록일: {project.requestDate || '미정'}
                            </div>

                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => handleEdit(project)} 
                                className="w-8 h-8 bg-gradient-to-br from-warning-500 to-accent-500 rounded-lg flex items-center justify-center text-white hover:scale-110 transition-transform duration-300 shadow-glow"
                                title="수정"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button 
                                onClick={() => handleDelete(project.id!)} 
                                className="w-8 h-8 bg-gradient-to-br from-error-500 to-warning-500 rounded-lg flex items-center justify-center text-white hover:scale-110 transition-transform duration-300 shadow-glow"
                                title="삭제"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 성공/오류 메시지 */}
        {message && (
          <div className="fixed top-6 right-6 z-50 animate-fade-in">
            <div className={`glass-strong rounded-2xl p-6 shadow-glow border max-w-sm ${
              message.includes('실패') || message.includes('오류') 
                ? 'border-error-200/50 bg-gradient-to-r from-error-50/90 to-warning-50/90' 
                : 'border-success-200/50 bg-gradient-to-r from-success-50/90 to-brand-50/90'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                  message.includes('실패') || message.includes('오류')
                    ? 'bg-gradient-to-br from-error-500 to-warning-500'
                    : 'bg-gradient-to-br from-success-500 to-brand-500'
                }`}>
                  {message.includes('실패') || message.includes('오류') ? (
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className={`font-bold text-sm ${
                    message.includes('실패') || message.includes('오류') ? 'text-error-700' : 'text-success-700'
                  }`}>
                    {message.includes('실패') || message.includes('오류') ? '오류 발생' : '작업 완료'}
                  </p>
                  <p className={`text-xs ${
                    message.includes('실패') || message.includes('오류') ? 'text-error-600' : 'text-success-600'
                  }`}>
                    {message}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
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
                    <td className="border px-4 py-2">{project.requestDate}</td>
                    <td className="border px-4 py-2">{project.period}</td>
                    <td className="border px-4 py-2">{project.location}</td>
                    <td className="border px-4 py-2">{project.developer}</td>
                    <td className="border px-4 py-2">{project.deployments?.[0]?.status || '-'}</td>
                    <td className="border px-4 py-2">{project.deployments?.[0]?.statusChangeDate || '-'}</td>
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
      </div>
    </div>
  );
};

export default AdminProjectStatus;