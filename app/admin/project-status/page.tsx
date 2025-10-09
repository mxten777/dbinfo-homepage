'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, getDocs, updateDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import type { Project } from '../../../types/project';

const ProjectStatusPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [firebaseConnected, setFirebaseConnected] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const adminMode = localStorage.getItem('admin_mode');
    const user = localStorage.getItem('admin_user');
    if (adminMode === 'true' && user) {
      setIsAuthenticated(true);
      loadProjects();
    } else {
      router.push('/admin/login');
    }
    setLoading(false);
  }, [router]);

  const loadProjects = async () => {
    try {
      if (!db) {
        console.log('Firebase가 연결되지 않음 - 데모 데이터 사용');
        setFirebaseConnected(false);
        
        // 데모 프로젝트 상태 데이터
        const demoProjects: Project[] = [
          {
            id: 'demo1',
            requestDate: '2024-09-01',
            client: '삼성전자',
            project: 'AI 데이터 분석 플랫폼',
            period: '2024-09-01 ~ 2024-12-31',
            location: '서울',
            developer: '김개발',
            grade: '고급',
            department: '개발팀',
            skill: 'Python, ML, React',
            pay: 800000,
            supply: 880000,
            total: 96800000,
            result: '진행중',
            progress: 65,
            teamMembers: ['김개발', '이분석', '박시각'],
            milestones: [
              { name: '요구사항 분석', date: '2024-09-15', completed: true },
              { name: '시스템 설계', date: '2024-10-01', completed: true },
              { name: '개발 1차', date: '2024-10-31', completed: false },
              { name: '테스트', date: '2024-11-30', completed: false },
              { name: '배포', date: '2024-12-15', completed: false }
            ],
            deployments: [],
            createdAt: '2024-09-01T09:00:00Z',
            updatedAt: new Date().toISOString()
          },
          {
            id: 'demo2',
            requestDate: '2024-08-15',
            client: 'LG전자',
            project: 'IoT 관리 시스템',
            period: '2024-08-15 ~ 2024-11-30',
            location: '대전',
            developer: '박IoT',
            grade: '특급',
            department: '개발팀',
            skill: 'Node.js, IoT, MongoDB',
            pay: 900000,
            supply: 990000,
            total: 79200000,
            result: '진행중',
            progress: 85,
            teamMembers: ['박IoT', '김센서', '이네트워크'],
            milestones: [
              { name: '아키텍처 설계', date: '2024-08-30', completed: true },
              { name: '백엔드 개발', date: '2024-09-30', completed: true },
              { name: '프론트엔드 개발', date: '2024-10-15', completed: true },
              { name: '통합 테스트', date: '2024-11-15', completed: false },
              { name: '운영 배포', date: '2024-11-25', completed: false }
            ],
            deployments: [],
            createdAt: '2024-08-15T09:00:00Z',
            updatedAt: new Date().toISOString()
          }
        ];
        
        setProjects(demoProjects);
        return;
      }

      setFirebaseConnected(true);
      const projectsQuery = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
      const projectsSnapshot = await getDocs(projectsQuery);
      const projectsList: Project[] = [];
      
      projectsSnapshot.forEach((doc) => {
        const projectData = doc.data() as Project;
        const projectStatus: Project = {
          ...projectData,
          id: doc.id,
          progress: projectData.progress || Math.floor(Math.random() * 100),
          teamMembers: projectData.teamMembers || [projectData.developer],
          milestones: projectData.milestones || [
            { name: '시작', date: projectData.requestDate || '', completed: true },
            { name: '진행중', date: '', completed: false }
          ]
        };
        projectsList.push(projectStatus);
      });

      setProjects(projectsList);
      console.log(`${projectsList.length}개의 프로젝트 상태 로드 완료`);
      
    } catch (error) {
      console.error('프로젝트 상태 로드 실패:', error);
      setFirebaseConnected(false);
    }
  };

  const updateProgress = async (projectId: string, newProgress: number) => {
    if (!firebaseConnected || !db) {
      alert('Firebase가 연결되지 않았습니다.');
      return;
    }

    try {
      await updateDoc(doc(db, 'projects', projectId), {
        progress: newProgress,
        updatedAt: new Date().toISOString()
      });

      // 로컬 상태 업데이트
      setProjects(prev => prev.map(p => 
        p.id === projectId ? { ...p, progress: newProgress } : p
      ));
      
      setShowProgressModal(false);
      alert('진척도가 업데이트되었습니다.');
    } catch (error) {
      console.error('진척도 업데이트 실패:', error);
      alert('진척도 업데이트에 실패했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-white">프로젝트 상태를 로드하는 중...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const getProgressColor = (progress: number) => {
    if (progress < 30) return 'from-red-500 to-orange-500';
    if (progress < 70) return 'from-yellow-500 to-amber-500';
    return 'from-green-500 to-emerald-500';
  };

  const getStatusColor = (result: string) => {
    switch (result) {
      case '완료': return 'bg-green-100 text-green-800';
      case '진행중': return 'bg-blue-100 text-blue-800';
      case '검토중': return 'bg-yellow-100 text-yellow-800';
      case '보류': return 'bg-gray-100 text-gray-800';
      default: return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 lg:px-6 py-8">
        {/* 헤더 */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 lg:p-6 mb-6 lg:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 lg:w-7 lg:h-7 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-white">프로젝트 현황</h1>
                <div className="flex items-center gap-2 mt-1">
                  <div className={`w-2 h-2 rounded-full ${firebaseConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <p className="text-xs lg:text-sm text-blue-200">
                    {firebaseConnected ? 'Firebase 연결됨' : '데모 모드'} • {projects.length}개 프로젝트
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={loadProjects}
                className="px-3 py-1.5 lg:px-4 lg:py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 hover:text-purple-200 rounded-lg transition-all duration-200 border border-purple-500/30 text-sm"
              >
                새로고침
              </button>
              <button 
                onClick={() => router.push('/admin/dashboard')} 
                className="px-3 py-1.5 lg:px-4 lg:py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 hover:text-blue-200 rounded-lg transition-all duration-200 border border-blue-500/30 text-sm"
              >
                ← 대시보드
              </button>
            </div>
          </div>
        </div>

        {/* 프로젝트 통계 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 lg:p-4 border border-white/20">
            <div className="text-center">
              <div className="text-xl lg:text-2xl font-bold text-white">{projects.length}</div>
              <div className="text-xs lg:text-sm text-blue-200">총 프로젝트</div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 lg:p-4 border border-white/20">
            <div className="text-center">
              <div className="text-xl lg:text-2xl font-bold text-green-400">
                {projects.filter(p => p.result === '진행중').length}
              </div>
              <div className="text-xs lg:text-sm text-blue-200">진행중</div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 lg:p-4 border border-white/20">
            <div className="text-center">
              <div className="text-xl lg:text-2xl font-bold text-blue-400">
                {projects.filter(p => p.result === '완료').length}
              </div>
              <div className="text-xs lg:text-sm text-blue-200">완료</div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 lg:p-4 border border-white/20">
            <div className="text-center">
              <div className="text-xl lg:text-2xl font-bold text-purple-400">
                {Math.round(projects.reduce((acc, p) => acc + (p.progress || 0), 0) / projects.length) || 0}%
              </div>
              <div className="text-xs lg:text-sm text-blue-200">평균 진척도</div>
            </div>
          </div>
        </div>

        {/* 데스크톱 테이블 뷰 */}
        <div className="hidden lg:block bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden mb-8">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-bold text-white">프로젝트 상세 현황</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">프로젝트</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">고객사</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">진척도</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">팀원</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">기간</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">상태</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">작업</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-white/5">
                    <td className="px-4 py-4">
                      <div>
                        <div className="font-medium text-white">{project.project}</div>
                        <div className="text-sm text-gray-400">{project.skill}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-300">{project.client}</td>
                    <td className="px-4 py-4">
                      <div className="w-full bg-gray-700 rounded-full h-2 mb-1">
                        <div 
                          className={`h-2 rounded-full bg-gradient-to-r ${getProgressColor(project.progress || 0)}`}
                          style={{ width: `${project.progress || 0}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-300">{project.progress || 0}% 완료</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex -space-x-2">
                        {(project.teamMembers || []).slice(0, 3).map((member: string, idx: number) => (
                          <div key={idx} className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xs text-white font-medium border-2 border-gray-800">
                            {member.slice(0, 1)}
                          </div>
                        ))}
                        {(project.teamMembers || []).length > 3 && (
                          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-xs text-white border-2 border-gray-800">
                            +{(project.teamMembers || []).length - 3}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-300">{project.period}</td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(project.result || '')}`}>
                        {project.result}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => {
                          setSelectedProject(project);
                          setShowProgressModal(true);
                        }}
                        className="text-purple-400 hover:text-purple-300 text-sm"
                      >
                        진척도 수정
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 모바일 카드 뷰 */}
        <div className="lg:hidden space-y-4">
          {projects.map((project) => (
            <div key={project.id} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-white truncate">{project.project}</h3>
                  <p className="text-sm text-gray-400">{project.client}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(project.result || '')}`}>
                  {project.result}
                </span>
              </div>
              
              <div className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-400">진척도</span>
                  <span className="text-xs text-white font-medium">{project.progress || 0}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full bg-gradient-to-r ${getProgressColor(project.progress || 0)}`}
                    style={{ width: `${project.progress || 0}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div>
                  <span className="text-gray-400">기간:</span>
                  <div className="text-white">{project.period}</div>
                </div>
                <div>
                  <span className="text-gray-400">팀원:</span>
                  <div className="text-white">{(project.teamMembers || []).length}명</div>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedProject(project);
                  setShowProgressModal(true);
                }}
                className="w-full px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg transition-colors text-sm"
              >
                진척도 수정
              </button>
            </div>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-12 text-center">
            <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-white mb-2">진행중인 프로젝트가 없습니다</h3>
            <p className="text-gray-400 mb-4">새로운 프로젝트를 등록해보세요.</p>
            <button
              onClick={() => router.push('/admin/projects')}
              className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg transition-colors"
            >
              프로젝트 관리로 이동
            </button>
          </div>
        )}

        {/* 진척도 수정 모달 */}
        {showProgressModal && selectedProject && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 w-full max-w-md">
              <h3 className="text-xl font-bold text-white mb-4">진척도 수정</h3>
              <div className="mb-4">
                <div className="text-sm text-gray-400 mb-2">{selectedProject.project}</div>
                <div className="text-lg text-white font-medium">현재: {selectedProject.progress || 0}%</div>
              </div>
              <div className="mb-6">
                <input
                  type="range"
                  min="0"
                  max="100"
                  defaultValue={selectedProject.progress || 0}
                  onChange={(e) => {
                    const newProgress = parseInt(e.target.value);
                    setSelectedProject({...selectedProject, progress: newProgress});
                  }}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowProgressModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-500/20 hover:bg-gray-500/30 text-gray-300 rounded-lg transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={() => updateProgress(selectedProject.id!, selectedProject.progress || 0)}
                  className="flex-1 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg transition-colors"
                  disabled={!firebaseConnected}
                >
                  저장
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default ProjectStatusPage;