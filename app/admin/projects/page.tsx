'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import type { Project } from '../../../types/project';

const ProjectManagement: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [firebaseConnected, setFirebaseConnected] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    requestDate: '',
    client: '',
    project: '',
    period: '',
    location: '',
    developer: '',
    grade: '',
    department: '',
    skill: '',
    pay: '',
    supply: '',
    total: '',
    result: ''
  });

  useEffect(() => {
    // 관리자 인증 확인
    const adminMode = localStorage.getItem('admin_mode');
    const user = localStorage.getItem('admin_user');
    
    if (adminMode === 'true' && user) {
      setIsAuthenticated(true);
      loadProjects();
    } else {
      router.push('/admin/login');
    }
  }, [router]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      
      if (!db) {
        console.log('Firebase가 연결되지 않음 - 데모 데이터 사용');
        setFirebaseConnected(false);
        // 데모 데이터
        setProjects([
          {
            id: 'demo1',
            requestDate: '2024-01-15',
            client: '삼성전자',
            project: '모바일 앱 개발',
            period: '2024-01-15 ~ 2024-06-30',
            location: '서울',
            developer: '김철수',
            grade: '고급',
            department: '개발팀',
            skill: 'React Native, Firebase',
            pay: 500000,
            supply: 50000,
            total: 550000,
            result: '진행중',
            deployments: []
          },
          {
            id: 'demo2',
            requestDate: '2024-02-01',
            client: 'LG화학',
            project: '웹 플랫폼 구축',
            period: '2024-02-01 ~ 2024-08-31',
            location: '부산',
            developer: '이영희',
            grade: '중급',
            department: '웹팀',
            skill: 'Next.js, TypeScript',
            pay: 400000,
            supply: 40000,
            total: 440000,
            result: '완료',
            deployments: []
          }
        ]);
        setLoading(false);
        return;
      }

      setFirebaseConnected(true);
      console.log('Firebase에서 프로젝트 데이터 로드 시작...');

      const projectsSnapshot = await getDocs(collection(db, 'projects'));
      const projectList: Project[] = [];
      
      projectsSnapshot.forEach((doc) => {
        projectList.push({
          id: doc.id,
          ...doc.data()
        } as Project);
      });

      setProjects(projectList);
      console.log(`Firebase에서 ${projectList.length}개의 프로젝트 데이터를 로드했습니다.`);
      
    } catch (error) {
      console.error('프로젝트 데이터 로드 실패:', error);
      setFirebaseConnected(false);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProject = async () => {
    if (!firebaseConnected || !db) {
      alert('Firebase가 연결되지 않았습니다. 데모 모드에서는 추가할 수 없습니다.');
      return;
    }

    try {
      const newProject = {
        ...formData,
        pay: parseInt(formData.pay) || 0,
        supply: parseInt(formData.supply) || 0,
        total: parseInt(formData.total) || 0,
        deployments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, 'projects'), newProject);
      console.log('새 프로젝트 추가됨:', docRef.id);
      
      resetForm();
      loadProjects();
      alert('프로젝트가 성공적으로 추가되었습니다!');
    } catch (error) {
      console.error('프로젝트 추가 실패:', error);
      alert('프로젝트 추가에 실패했습니다.');
    }
  };

  const handleUpdateProject = async () => {
    if (!firebaseConnected || !db || !editingProject || !editingProject.id) {
      alert('Firebase가 연결되지 않았습니다.');
      return;
    }

    try {
      const updatedProject = {
        ...formData,
        pay: parseInt(formData.pay) || 0,
        supply: parseInt(formData.supply) || 0,
        total: parseInt(formData.total) || 0,
        updatedAt: new Date().toISOString()
      };

      await updateDoc(doc(db, 'projects', editingProject.id), updatedProject);
      console.log('프로젝트 정보 업데이트됨:', editingProject.id);
      
      resetForm();
      loadProjects();
      alert('프로젝트 정보가 성공적으로 수정되었습니다!');
    } catch (error) {
      console.error('프로젝트 정보 수정 실패:', error);
      alert('프로젝트 정보 수정에 실패했습니다.');
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!firebaseConnected || !db) {
      alert('Firebase가 연결되지 않았습니다. 데모 모드에서는 삭제할 수 없습니다.');
      return;
    }

    if (!confirm('정말로 이 프로젝트를 삭제하시겠습니까?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'projects', projectId));
      console.log('프로젝트 삭제됨:', projectId);
      
      loadProjects();
      alert('프로젝트가 성공적으로 삭제되었습니다!');
    } catch (error) {
      console.error('프로젝트 삭제 실패:', error);
      alert('프로젝트 삭제에 실패했습니다.');
    }
  };

  const resetForm = () => {
    setFormData({
      requestDate: '',
      client: '',
      project: '',
      period: '',
      location: '',
      developer: '',
      grade: '',
      department: '',
      skill: '',
      pay: '',
      supply: '',
      total: '',
      result: ''
    });
    setShowAddForm(false);
    setEditingProject(null);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      requestDate: project.requestDate || '',
      client: project.client || '',
      project: project.project || '',
      period: project.period || '',
      location: project.location || '',
      developer: project.developer || '',
      grade: project.grade || '',
      department: project.department || '',
      skill: project.skill || '',
      pay: project.pay?.toString() || '0',
      supply: project.supply?.toString() || '0',
      total: project.total?.toString() || '0',
      result: project.result || '진행중'
    });
    setShowAddForm(true);
  };

  if (!isAuthenticated) {
    return <div>인증 확인 중...</div>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">프로젝트 데이터를 로드하는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">프로젝트 관리</h1>
              <div className="flex items-center mt-2">
                <div className={`w-3 h-3 rounded-full ${firebaseConnected ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
                <p className="text-gray-600">
                  {firebaseConnected ? 'Firebase 연결됨' : '데모 모드 (Firebase 연결 안됨)'}
                </p>
              </div>
            </div>
            <div className="space-x-3">
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                대시보드로
              </button>
              <button
                onClick={() => setShowAddForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                + 프로젝트 추가
              </button>
            </div>
          </div>
        </div>

        {/* 프로젝트 추가/수정 폼 */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {editingProject ? '프로젝트 정보 수정' : '새 프로젝트 추가'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <input
                type="date"
                placeholder="요청일"
                value={formData.requestDate}
                onChange={(e) => setFormData({ ...formData, requestDate: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="고객사"
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="프로젝트명"
                value={formData.project}
                onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="기간 (예: 2024-01-01 ~ 2024-06-30)"
                value={formData.period}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="근무지"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="개발자"
                value={formData.developer}
                onChange={(e) => setFormData({ ...formData, developer: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">등급 선택</option>
                <option value="초급">초급</option>
                <option value="중급">중급</option>
                <option value="고급">고급</option>
                <option value="특급">특급</option>
              </select>
              <input
                type="text"
                placeholder="부서"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="기술스택"
                value={formData.skill}
                onChange={(e) => setFormData({ ...formData, skill: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="급여"
                value={formData.pay}
                onChange={(e) => setFormData({ ...formData, pay: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="부대비용"
                value={formData.supply}
                onChange={(e) => setFormData({ ...formData, supply: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="총 금액"
                value={formData.total}
                onChange={(e) => setFormData({ ...formData, total: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={formData.result}
                onChange={(e) => setFormData({ ...formData, result: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">상태 선택</option>
                <option value="검토중">검토중</option>
                <option value="진행중">진행중</option>
                <option value="완료">완료</option>
                <option value="보류">보류</option>
                <option value="취소">취소</option>
              </select>
            </div>
            <div className="mt-4 space-x-3">
              <button
                onClick={editingProject ? handleUpdateProject : handleAddProject}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingProject ? '수정하기' : '추가하기'}
              </button>
              <button
                onClick={resetForm}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                취소
              </button>
            </div>
          </div>
        )}

        {/* 프로젝트 목록 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h2 className="text-xl font-bold text-gray-800">
              프로젝트 목록 ({projects.length}개)
            </h2>
          </div>
          {/* 데스크톱 테이블 뷰 */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">요청일</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">고객사</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">프로젝트</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">기간</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">근무지</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">개발자</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">등급</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">부서</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">스킬</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">단가</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">공급가</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">총금액</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">결과</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작업</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      {project.requestDate || '-'}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      {project.client}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{project.project}</div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      {project.period}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      {project.location || '-'}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      {project.developer}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        project.grade === '특급' ? 'bg-purple-100 text-purple-800' :
                        project.grade === '고급' ? 'bg-blue-100 text-blue-800' :
                        project.grade === '중급' ? 'bg-green-100 text-green-800' :
                        project.grade === '초급' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {project.grade || '-'}
                      </span>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      {project.department || '-'}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{project.skill || '-'}</div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₩ {project.pay ? Number(project.pay).toLocaleString() : '0'}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₩ {project.supply ? Number(project.supply).toLocaleString() : '0'}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ₩ {project.total ? Number(project.total).toLocaleString() : '0'}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        project.result === '완료' ? 'bg-green-100 text-green-800' :
                        project.result === '진행중' ? 'bg-blue-100 text-blue-800' :
                        project.result === '검토중' ? 'bg-yellow-100 text-yellow-800' :
                        project.result === '보류' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {project.result || '-'}
                      </span>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                      <button
                        onClick={() => startEdit(project)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => project.id && handleDeleteProject(project.id)}
                        className="text-red-600 hover:text-red-900"
                        disabled={!firebaseConnected || !project.id}
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {projects.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                등록된 프로젝트가 없습니다.
              </div>
            )}
          </div>

          {/* 모바일 카드 뷰 */}
          <div className="lg:hidden space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="bg-white border rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{project.project}</h3>
                    <p className="text-sm text-gray-500">{project.client}</p>
                    <p className="text-xs text-gray-400">요청일: {project.requestDate || '-'}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    project.result === '완료' ? 'bg-green-100 text-green-800' :
                    project.result === '진행중' ? 'bg-blue-100 text-blue-800' :
                    project.result === '검토중' ? 'bg-yellow-100 text-yellow-800' :
                    project.result === '보류' ? 'bg-gray-100 text-gray-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {project.result || '-'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                  <div>
                    <span className="font-medium text-gray-700">기간:</span>
                    <span className="ml-1 text-gray-900">{project.period}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">근무지:</span>
                    <span className="ml-1 text-gray-900">{project.location || '-'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">개발자:</span>
                    <span className="ml-1 text-gray-900">{project.developer}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">등급:</span>
                    <span className={`ml-1 px-2 py-1 text-xs rounded-full ${
                      project.grade === '특급' ? 'bg-purple-100 text-purple-800' :
                      project.grade === '고급' ? 'bg-blue-100 text-blue-800' :
                      project.grade === '중급' ? 'bg-green-100 text-green-800' :
                      project.grade === '초급' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {project.grade || '-'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">부서:</span>
                    <span className="ml-1 text-gray-900">{project.department || '-'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">스킬:</span>
                    <span className="ml-1 text-gray-900">{project.skill || '-'}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">금액 정보:</span>
                    <div className="mt-1 grid grid-cols-1 gap-1 text-xs">
                      <div className="flex justify-between">
                        <span>단가:</span>
                        <span>₩ {project.pay ? Number(project.pay).toLocaleString() : '0'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>공급가:</span>
                        <span>₩ {project.supply ? Number(project.supply).toLocaleString() : '0'}</span>
                      </div>
                      <div className="flex justify-between font-medium text-gray-900 pt-1 border-t">
                        <span>총금액:</span>
                        <span>₩ {project.total ? Number(project.total).toLocaleString() : '0'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex space-x-3">
                  <button
                    onClick={() => startEdit(project)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => project.id && handleDeleteProject(project.id)}
                    className="flex-1 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                    disabled={!firebaseConnected || !project.id}
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
            {projects.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                등록된 프로젝트가 없습니다.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectManagement;