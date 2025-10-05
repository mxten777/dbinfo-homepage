import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../firebaseConfig';
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';

interface Project {
  id?: string;
  name: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
  manager: string;
  progress: number;
  budget: number;
  team: string[];
  createdAt: string;
}

const AdminProjectStatus: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [formData, setFormData] = useState<Omit<Project, 'id' | 'createdAt'>>({
    name: '',
    description: '',
    status: 'planning',
    startDate: '',
    endDate: '',
    manager: '',
    progress: 0,
    budget: 0,
    team: []
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    let filtered = projects;
    
    if (searchTerm) {
      filtered = filtered.filter(project => 
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.manager.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(project => project.status === statusFilter);
    }
    
    setFilteredProjects(filtered);
  }, [projects, searchTerm, statusFilter]);

  const fetchProjects = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'projects'));
      const projectsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Project[];
      
      setProjects(projectsData);
      setLoading(false);
    } catch (error) {
      console.error('프로젝트 목록 조회 실패:', error);
      setMessage('프로젝트 목록을 불러오는데 실패했습니다.');
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const projectData = {
        ...formData,
        createdAt: new Date().toISOString().split('T')[0]
      };
      
      await addDoc(collection(db, 'projects'), projectData);
      setMessage('프로젝트가 성공적으로 등록되었습니다.');
      fetchProjects();
      resetForm();
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('프로젝트 등록 실패:', error);
      setMessage('프로젝트 등록에 실패했습니다.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const docRef = doc(db, 'projects', id);
      await updateDoc(docRef, { status: newStatus });
      
      setMessage('프로젝트 상태가 업데이트되었습니다.');
      fetchProjects();
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('상태 업데이트 실패:', error);
      setMessage('상태 업데이트에 실패했습니다.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      try {
        await deleteDoc(doc(db, 'projects', id));
        setMessage('프로젝트가 삭제되었습니다.');
        fetchProjects();
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        console.error('삭제 실패:', error);
        setMessage('삭제에 실패했습니다.');
        setTimeout(() => setMessage(''), 3000);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      status: 'planning',
      startDate: '',
      endDate: '',
      manager: '',
      progress: 0,
      budget: 0,
      team: []
    });
  };

  const getStatusStats = () => {
    const planning = projects.filter(p => p.status === 'planning').length;
    const inProgress = projects.filter(p => p.status === 'in-progress').length;
    const completed = projects.filter(p => p.status === 'completed').length;
    const paused = projects.filter(p => p.status === 'paused').length;
    return { planning, inProgress, completed, paused, total: projects.length };
  };

  const stats = getStatusStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-brand-50/20 to-accent-50/20 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="glass-strong rounded-3xl p-8 shadow-glass border border-white/30">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-neutral-200 rounded-2xl w-1/3"></div>
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-20 bg-neutral-200 rounded-2xl"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-brand-50/20 to-accent-50/20 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* 프로젝트 등록 폼 */}
          <div className="xl:col-span-1">
            <div className="glass-strong rounded-3xl shadow-glass border border-white/30 bg-gradient-to-br from-white/95 to-white/80 overflow-hidden">
              <div className="p-8">
                <div className="flex items-center justify-between pb-6 border-b border-neutral-200/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-glow">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-neutral-800">프로젝트 등록</h3>
                      <p className="text-sm text-neutral-600">새로운 프로젝트를 등록하세요</p>
                    </div>
                  </div>
                  <Link 
                    to="/admin/home"
                    className="btn-secondary bg-gradient-to-r from-neutral-500 to-brand-500 text-white px-4 py-2 rounded-xl font-bold hover:scale-105 transition-transform duration-300"
                  >
                    관리자홈
                  </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-neutral-700">프로젝트명</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                      className="w-full glass rounded-xl px-4 py-3 border border-brand-200/30 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all duration-300"
                      placeholder="프로젝트명을 입력하세요"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-neutral-700">프로젝트 설명</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      required
                      rows={3}
                      className="w-full glass rounded-xl px-4 py-3 border border-brand-200/30 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all duration-300"
                      placeholder="프로젝트 설명을 입력하세요"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-neutral-700">시작일</label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                        required
                        className="w-full glass rounded-xl px-4 py-3 border border-success-200/30 focus:ring-2 focus:ring-success-500 focus:border-success-500 outline-none transition-all duration-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-neutral-700">완료일</label>
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                        required
                        className="w-full glass rounded-xl px-4 py-3 border border-error-200/30 focus:ring-2 focus:ring-error-500 focus:border-error-500 outline-none transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-neutral-700">담당자</label>
                    <input
                      type="text"
                      value={formData.manager}
                      onChange={(e) => setFormData({...formData, manager: e.target.value})}
                      required
                      className="w-full glass rounded-xl px-4 py-3 border border-accent-200/30 focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none transition-all duration-300"
                      placeholder="담당자명을 입력하세요"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-neutral-700">예산 (만원)</label>
                    <input
                      type="number"
                      value={formData.budget}
                      onChange={(e) => setFormData({...formData, budget: Number(e.target.value)})}
                      required
                      min="0"
                      className="w-full glass rounded-xl px-4 py-3 border border-warning-200/30 focus:ring-2 focus:ring-warning-500 focus:border-warning-500 outline-none transition-all duration-300"
                      placeholder="예산을 입력하세요"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full btn-primary bg-gradient-to-r from-brand-500 to-accent-500 text-white py-3 px-6 rounded-xl font-bold hover:scale-105 transition-transform duration-300 shadow-glow"
                  >
                    프로젝트 등록
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* 프로젝트 목록 */}
          <div className="xl:col-span-2">
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
                    진행 중인 프로젝트들을 관리하세요
                  </p>
                </div>
              </div>

              {/* 통계 카드 */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                <div className="glass rounded-2xl p-4 bg-gradient-to-br from-brand-50/50 to-accent-50/50 border border-brand-200/30">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-brand-700">{stats.total}</div>
                    <div className="text-xs text-brand-600 font-medium">전체</div>
                  </div>
                </div>
                <div className="glass rounded-2xl p-4 bg-gradient-to-br from-warning-50/50 to-accent-50/50 border border-warning-200/30">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-warning-700">{stats.planning}</div>
                    <div className="text-xs text-warning-600 font-medium">기획중</div>
                  </div>
                </div>
                <div className="glass rounded-2xl p-4 bg-gradient-to-br from-accent-50/50 to-brand-50/50 border border-accent-200/30">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent-700">{stats.inProgress}</div>
                    <div className="text-xs text-accent-600 font-medium">진행중</div>
                  </div>
                </div>
                <div className="glass rounded-2xl p-4 bg-gradient-to-br from-success-50/50 to-brand-50/50 border border-success-200/30">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success-700">{stats.completed}</div>
                    <div className="text-xs text-success-600 font-medium">완료</div>
                  </div>
                </div>
                <div className="glass rounded-2xl p-4 bg-gradient-to-br from-error-50/50 to-warning-50/50 border border-error-200/30">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-error-700">{stats.paused}</div>
                    <div className="text-xs text-error-600 font-medium">중단</div>
                  </div>
                </div>
              </div>

              {/* 필터 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-neutral-700">프로젝트 검색</label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="프로젝트명, 담당자, 설명"
                    className="w-full glass rounded-xl px-4 py-3 border border-brand-200/30 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all duration-300"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-neutral-700">상태 필터</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full glass rounded-xl px-4 py-3 border border-success-200/30 focus:ring-2 focus:ring-success-500 focus:border-success-500 outline-none transition-all duration-300"
                  >
                    <option value="all">전체</option>
                    <option value="planning">기획중</option>
                    <option value="in-progress">진행중</option>
                    <option value="completed">완료</option>
                    <option value="paused">중단</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-neutral-700">빠른 액션</label>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('all');
                    }}
                    className="w-full btn-secondary bg-gradient-to-r from-neutral-500 to-brand-500 text-white py-3 rounded-xl font-bold hover:scale-105 transition-transform duration-300"
                  >
                    필터 초기화
                  </button>
                </div>
              </div>
            </div>

            {/* 프로젝트 목록 */}
            <div className="glass-strong rounded-3xl shadow-glass border border-white/30 bg-gradient-to-br from-white/95 to-white/80 overflow-hidden">
              <div className="p-8">
                <div className="flex items-center gap-3 pb-6 border-b border-neutral-200/50">
                  <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-glow">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-neutral-800">프로젝트 목록</h3>
                    <p className="text-sm text-neutral-600">총 {filteredProjects.length}개의 프로젝트</p>
                  </div>
                </div>

                <div className="mt-6 space-y-4 max-h-[800px] overflow-y-auto pr-2">
                  {filteredProjects.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gradient-to-br from-neutral-400 to-neutral-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <h4 className="text-xl font-bold text-neutral-700 mb-2">프로젝트가 없습니다</h4>
                      <p className="text-neutral-600">새로운 프로젝트를 등록해보세요.</p>
                    </div>
                  ) : (
                    filteredProjects.map((project, index) => (
                      <div 
                        key={project.id} 
                        className="group glass rounded-2xl p-6 border border-neutral-200/30 hover:border-brand-300/50 transition-all duration-300 hover:shadow-glow bg-gradient-to-br from-white/80 to-neutral-50/30"
                      >
                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-3 flex-1">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-accent-500 rounded-xl flex items-center justify-center text-white text-sm font-bold">
                                  {index + 1}
                                </div>
                                <h4 className="text-xl font-bold text-neutral-800">{project.name}</h4>
                                <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                                  project.status === 'completed' 
                                    ? 'bg-gradient-to-r from-success-100 to-brand-100 text-success-700' 
                                    : project.status === 'in-progress'
                                    ? 'bg-gradient-to-r from-accent-100 to-brand-100 text-accent-700'
                                    : project.status === 'paused'
                                    ? 'bg-gradient-to-r from-error-100 to-warning-100 text-error-700'
                                    : 'bg-gradient-to-r from-warning-100 to-accent-100 text-warning-700'
                                }`}>
                                  {project.status === 'completed' ? '완료' : 
                                   project.status === 'in-progress' ? '진행중' : 
                                   project.status === 'paused' ? '중단' : '기획중'}
                                </div>
                              </div>

                              <p className="text-neutral-600 bg-gradient-to-r from-neutral-50 to-brand-50/30 p-3 rounded-xl border border-neutral-200/30">
                                {project.description}
                              </p>

                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="space-y-2">
                                  <div><span className="font-bold text-neutral-700">담당자:</span> {project.manager}</div>
                                  <div><span className="font-bold text-neutral-700">기간:</span> {project.startDate} ~ {project.endDate}</div>
                                </div>
                                <div className="space-y-2">
                                  <div><span className="font-bold text-neutral-700">예산:</span> {project.budget.toLocaleString()}만원</div>
                                  <div><span className="font-bold text-neutral-700">등록일:</span> {project.createdAt}</div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 pt-4 border-t border-neutral-200/30">
                            {project.status !== 'completed' && (
                              <>
                                {project.status === 'planning' && (
                                  <button 
                                    onClick={() => handleStatusUpdate(project.id!, 'in-progress')}
                                    className="flex-1 btn-primary bg-gradient-to-r from-accent-500 to-brand-500 text-white py-2 px-4 rounded-xl font-bold hover:scale-105 transition-transform duration-300 shadow-glow"
                                  >
                                    진행 시작
                                  </button>
                                )}
                                {project.status === 'in-progress' && (
                                  <>
                                    <button 
                                      onClick={() => handleStatusUpdate(project.id!, 'completed')}
                                      className="flex-1 btn-primary bg-gradient-to-r from-success-500 to-brand-500 text-white py-2 px-4 rounded-xl font-bold hover:scale-105 transition-transform duration-300 shadow-glow"
                                    >
                                      완료 처리
                                    </button>
                                    <button 
                                      onClick={() => handleStatusUpdate(project.id!, 'paused')}
                                      className="flex-1 btn-secondary bg-gradient-to-r from-warning-500 to-error-500 text-white py-2 px-4 rounded-xl font-bold hover:scale-105 transition-transform duration-300 shadow-glow"
                                    >
                                      일시 중단
                                    </button>
                                  </>
                                )}
                                {project.status === 'paused' && (
                                  <button 
                                    onClick={() => handleStatusUpdate(project.id!, 'in-progress')}
                                    className="flex-1 btn-primary bg-gradient-to-r from-accent-500 to-brand-500 text-white py-2 px-4 rounded-xl font-bold hover:scale-105 transition-transform duration-300 shadow-glow"
                                  >
                                    재개
                                  </button>
                                )}
                              </>
                            )}
                            
                            <button 
                              onClick={() => handleDelete(project.id!)} 
                              className="w-10 h-10 bg-gradient-to-br from-error-500 to-warning-500 rounded-xl flex items-center justify-center text-white hover:scale-110 transition-transform duration-300 shadow-glow"
                              title="삭제"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
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
  );
};

export default AdminProjectStatus;