'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import app from '../../../lib/firebase';
import { useAdminAuth } from '../../../hooks/useAdminAuth';
import type { Employee } from '../../../types/employee';

const EmployeeManagement: React.FC = () => {
  const { isAuthenticated, isLoading: authLoading } = useAdminAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [firebaseConnected, setFirebaseConnected] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    empNo: '',
    name: '',
    email: '',
    residentId: '',
    gender: '' as '' | 'male' | 'female' | 'other',
    department: '',
    position: '',
    jobType: '',
    joinDate: '',
    contact: '',
    phone: '',
    salary: '',
    status: 'active' as 'active' | 'inactive' | 'on_leave',
    totalLeaves: '',
    usedLeaves: '',
    remainingLeaves: '',
    carryOverLeaves: ''
  });

  useEffect(() => {
    console.log('🔄 useEffect 실행 - isAuthenticated:', isAuthenticated);
    if (isAuthenticated) {
      console.log('✅ 인증됨 - loadEmployees 호출');
      
      // 타임아웃 추가 (10초 후 강제 로딩 해제)
      const timeout = setTimeout(() => {
        console.log('⏰ 타임아웃 - 강제 로딩 해제');
        setLoading(false);
      }, 10000);

      loadEmployees().finally(() => {
        clearTimeout(timeout);
      });
    } else {
      console.log('❌ 인증되지 않음');
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Firebase 연결 테스트 함수
  const testFirebaseConnection = async () => {
    console.log('🧪 Firebase 연결 테스트 시작...');
    
    if (!app) {
      alert('❌ Firebase App이 초기화되지 않았습니다.');
      return;
    }
    
    if (!db) {
      alert('❌ Firestore가 초기화되지 않았습니다.');
      return;
    }

    try {
      // 간단한 컬렉션 접근 테스트
      console.log('🔍 Firestore 접근 테스트...');
      const testCollection = collection(db, 'employees');
      console.log('✅ 컬렉션 레퍼런스 생성 성공');
      
      const snapshot = await getDocs(testCollection);
      console.log('✅ 쿼리 성공! 문서 수:', snapshot.size);
      
      snapshot.forEach((doc) => {
        console.log('📄 문서:', doc.id, doc.data());
      });
      
      alert(`✅ Firebase 연결 성공!\n문서 수: ${snapshot.size}개`);
      
    } catch (error) {
      console.error('❌ Firebase 연결 테스트 실패:', error);
      const firebaseError = error as { code?: string; message?: string };
      console.error('❌ 에러 코드:', firebaseError.code);
      console.error('❌ 에러 메시지:', firebaseError.message);
      alert(`❌ Firebase 연결 실패!\n에러: ${firebaseError.code || 'Unknown'}\n메시지: ${firebaseError.message || String(error)}`);
    }
  };

  // Firebase 데이터베이스 상태 확인 함수
  const checkFirebaseData = async () => {
    if (!db) {
      alert('Firebase가 연결되지 않았습니다.');
      return;
    }

    try {
      console.log('=== Firebase 데이터베이스 상태 확인 ===');
      
      // employees 컬렉션 확인
      const employeesSnapshot = await getDocs(collection(db, 'employees'));
      console.log('employees 컬렉션 문서 수:', employeesSnapshot.size);
      
      if (employeesSnapshot.empty) {
        console.log('employees 컬렉션이 비어있습니다.');
        alert(`Firebase 연결됨!\nemployees 컬렉션: 비어있음 (0개 문서)\n\n다른 컬렉션명을 사용하고 계신가요?`);
      } else {
        console.log('employees 컬렉션 문서들:');
        const docList: string[] = [];
        employeesSnapshot.forEach((doc) => {
          console.log(`문서 ID: ${doc.id}`, doc.data());
          docList.push(`- ${doc.id}: ${doc.data().name || '이름없음'}`);
        });
        alert(`Firebase 연결됨!\nemployees 컬렉션: ${employeesSnapshot.size}개 문서 발견\n\n${docList.join('\n')}`);
      }

      // 다른 가능한 컬렉션들도 확인
      const possibleCollections = ['employee', 'staff', 'users', 'members', 'people', 'person'];
      for (const collName of possibleCollections) {
        try {
          const snapshot = await getDocs(collection(db, collName));
          if (!snapshot.empty) {
            console.log(`${collName} 컬렉션에 ${snapshot.size}개 문서 발견`);
            alert(`추가 발견: ${collName} 컬렉션에 ${snapshot.size}개 문서가 있습니다!`);
          }
        } catch {
          // 컬렉션이 없을 수 있으므로 에러 무시
        }
      }

    } catch (error) {
      console.error('Firebase 데이터 확인 실패:', error);
      alert(`Firebase 확인 실패: ${error}`);
    }
  };

  const loadEmployees = async () => {
    console.log('🚀 loadEmployees 함수 시작');
    
    try {
      setLoading(true);
      console.log('✅ 로딩 상태 true로 설정');
      
      if (!db) {
        console.log('❌ Firebase가 연결되지 않음 - 데모 데이터 사용');
        setFirebaseConnected(false);
        // 데모 데이터
        setEmployees([
          {
            id: 'demo1',
            empNo: 'EMP001',
            name: '김철수',
            email: 'kim@db-info.co.kr',
            residentId: '901201-1******',
            gender: 'male',
            department: '개발팀',
            position: '시니어 개발자',
            jobType: '백엔드 개발',
            joinDate: '2023-01-15',
            contact: '02-1234-5678',
            phone: '010-1234-5678',
            salary: 5500000,
            status: 'active',
            totalLeaves: 15,
            usedLeaves: 7,
            remainingLeaves: 8,
            carryOverLeaves: 2
          },
          {
            id: 'demo2',
            empNo: 'EMP002',
            name: '이영희',
            email: 'lee@db-info.co.kr',
            residentId: '850315-2******',
            gender: 'female',
            department: '기획팀',
            position: '프로젝트 매니저',
            jobType: '서비스 기획',
            joinDate: '2022-08-20',
            contact: '02-2345-6789',
            phone: '010-2345-6789',
            salary: 4800000,
            status: 'active',
            totalLeaves: 15,
            usedLeaves: 12,
            remainingLeaves: 3,
            carryOverLeaves: 0
          }
        ]);
        console.log('✅ 데모 데이터 설정 완료, 로딩 false로 변경');
        setLoading(false);
        return;
      }

      setFirebaseConnected(true);
      console.log('🔥 Firebase에서 직원 데이터 로드 시작...');
      console.log('📋 Firebase 프로젝트 ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
      console.log('📁 현재 시도하는 컬렉션: employees');

      console.log('📡 Firebase 쿼리 시작...');
      console.log('🔑 Firebase 인스턴스 상태:', {
        app: !!app,
        db: !!db,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
      });
      
      const employeesSnapshot = await getDocs(collection(db, 'employees'));
      console.log('📊 employees 컬렉션 쿼리 성공:', employeesSnapshot.size, '개 문서');
      
      const employeeList: Employee[] = [];
      
      if (employeesSnapshot.empty) {
        console.log('⚠️ employees 컬렉션이 비어있습니다!');
      } else {
        console.log('📝 문서 데이터 처리 시작...');
        employeesSnapshot.forEach((doc) => {
          const employeeData = doc.data();
          console.log(`👤 직원 데이터 [${doc.id}]:`, employeeData);
          employeeList.push({
            id: doc.id,
            ...employeeData
          } as Employee);
        });
        console.log('✅ 문서 데이터 처리 완료');
      }

      console.log('🔄 상태 업데이트 시작...');
      setEmployees(employeeList);
      console.log(`✅ Firebase에서 ${employeeList.length}명의 직원 데이터를 로드했습니다.`);
      console.log('📋 최종 로드된 직원 목록:', employeeList);

      // employees 컬렉션이 비어있으면 다른 컬렉션 자동 확인
      if (employeeList.length === 0) {
        console.log('employees 컬렉션이 비어있습니다. 다른 컬렉션을 확인합니다...');
        const alternativeCollections = ['employee', 'staff', 'users', 'members', 'people'];
        
        for (const collName of alternativeCollections) {
          try {
            const altSnapshot = await getDocs(collection(db, collName));
            if (!altSnapshot.empty) {
              console.log(`✅ ${collName} 컬렉션에서 ${altSnapshot.size}개 문서 발견!`);
              altSnapshot.forEach((doc) => {
                console.log(`${collName} 문서:`, doc.id, doc.data());
              });
              alert(`발견! ${collName} 컬렉션에 ${altSnapshot.size}개의 데이터가 있습니다. 이 컬렉션을 사용하시겠습니까?`);
              break;
            }
          } catch {
            // 컬렉션이 없거나 접근 불가
          }
        }
      }
      
    } catch (error) {
      console.error('❌ 직원 데이터 로드 실패:', error);
      console.error('❌ 에러 상세:', error);
      setFirebaseConnected(false);
      setEmployees([]); // 에러시 빈 배열로 설정
    } finally {
      console.log('🏁 loadEmployees 함수 완료 - 로딩 false로 설정');
      setLoading(false);
    }
  };

  const handleAddEmployee = async () => {
    if (!firebaseConnected || !db) {
      alert('Firebase가 연결되지 않았습니다. 데모 모드에서는 추가할 수 없습니다.');
      return;
    }

    try {
      // undefined 값 필터링 및 연차 계산
      const totalLeaves = parseInt(formData.totalLeaves) || 15;
      const usedLeaves = parseInt(formData.usedLeaves) || 0;
      const remainingLeaves = totalLeaves - usedLeaves + (parseInt(formData.carryOverLeaves) || 0);

      const newEmployee = {
        empNo: formData.empNo || '',
        name: formData.name || '',
        email: formData.email || '',
        residentId: formData.residentId || '',
        gender: formData.gender || 'male',
        department: formData.department || '',
        position: formData.position || '',
        jobType: formData.jobType || '',
        joinDate: formData.joinDate || '',
        contact: formData.contact || '',
        phone: formData.phone || '',
        salary: parseInt(formData.salary) || 0,
        status: formData.status || 'active',
        totalLeaves: totalLeaves,
        usedLeaves: usedLeaves,
        remainingLeaves: remainingLeaves,
        carryOverLeaves: parseInt(formData.carryOverLeaves) || 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, 'employees'), newEmployee);
      console.log('새 직원 추가됨:', docRef.id);
      
      resetForm();
      loadEmployees();
      alert('직원이 성공적으로 추가되었습니다!');
    } catch (error) {
      console.error('직원 추가 실패:', error);
      alert('직원 추가에 실패했습니다.');
    }
  };

  const handleUpdateEmployee = async () => {
    if (!firebaseConnected || !db || !editingEmployee || !editingEmployee.id) {
      alert('Firebase가 연결되지 않았습니다.');
      return;
    }

    try {
      // undefined 값 필터링 및 연차 계산
      const totalLeaves = parseInt(formData.totalLeaves) || 15;
      const usedLeaves = parseInt(formData.usedLeaves) || 0;
      const remainingLeaves = totalLeaves - usedLeaves + (parseInt(formData.carryOverLeaves) || 0);

      const updatedEmployee = {
        empNo: formData.empNo || '',
        name: formData.name || '',
        email: formData.email || '',
        residentId: formData.residentId || '',
        gender: formData.gender || 'male',
        department: formData.department || '',
        position: formData.position || '',
        jobType: formData.jobType || '',
        joinDate: formData.joinDate || '',
        contact: formData.contact || '',
        phone: formData.phone || '',
        salary: parseInt(formData.salary) || 0,
        status: formData.status || 'active',
        totalLeaves: totalLeaves,
        usedLeaves: usedLeaves,
        remainingLeaves: remainingLeaves,
        carryOverLeaves: parseInt(formData.carryOverLeaves) || 0,
        updatedAt: new Date().toISOString()
      };

      await updateDoc(doc(db, 'employees', editingEmployee.id), updatedEmployee);
      console.log('직원 정보 업데이트됨:', editingEmployee.id);
      
      resetForm();
      loadEmployees();
      alert('직원 정보가 성공적으로 수정되었습니다!');
    } catch (error) {
      console.error('직원 정보 수정 실패:', error);
      alert('직원 정보 수정에 실패했습니다.');
    }
  };

  const handleDeleteEmployee = async (employeeId: string) => {
    if (!firebaseConnected || !db) {
      alert('Firebase가 연결되지 않았습니다. 데모 모드에서는 삭제할 수 없습니다.');
      return;
    }

    if (!confirm('정말로 이 직원을 삭제하시겠습니까?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'employees', employeeId));
      console.log('직원 삭제됨:', employeeId);
      
      loadEmployees();
      alert('직원이 성공적으로 삭제되었습니다!');
    } catch (error) {
      console.error('직원 삭제 실패:', error);
      alert('직원 삭제에 실패했습니다.');
    }
  };

  const resetForm = () => {
    setFormData({
      empNo: '',
      name: '',
      email: '',
      residentId: '',
      gender: '',
      department: '',
      position: '',
      jobType: '',
      joinDate: '',
      contact: '',
      phone: '',
      salary: '',
      status: 'active',
      totalLeaves: '',
      usedLeaves: '',
      remainingLeaves: '',
      carryOverLeaves: ''
    });
    setShowAddForm(false);
    setEditingEmployee(null);
  };

  const startEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData({
      empNo: employee.empNo || '',
      name: employee.name || '',
      email: employee.email || '',
      residentId: employee.residentId || '',
      gender: employee.gender || '',
      department: employee.department || '',
      position: employee.position || '',
      jobType: employee.jobType || '',
      joinDate: employee.joinDate || '',
      contact: employee.contact || '',
      phone: employee.phone || '',
      salary: employee.salary ? employee.salary.toString() : '0',
      status: employee.status || 'active',
      totalLeaves: employee.totalLeaves ? employee.totalLeaves.toString() : '15',
      usedLeaves: employee.usedLeaves ? employee.usedLeaves.toString() : '0',
      remainingLeaves: employee.remainingLeaves ? employee.remainingLeaves.toString() : '15',
      carryOverLeaves: employee.carryOverLeaves ? employee.carryOverLeaves.toString() : '0'
    });
    setShowAddForm(true);
  };

  if (!isAuthenticated) {
    return null; // useAdminAuth에서 리다이렉트 처리
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">직원 데이터를 로드하는 중...</p>
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
              <h1 className="text-3xl font-bold text-gray-800">직원 관리</h1>
              <div className="flex items-center mt-2">
                <div className={`w-3 h-3 rounded-full ${firebaseConnected ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
                <p className="text-gray-600">
                  {firebaseConnected ? 'Firebase 연결됨' : '데모 모드 (Firebase 연결 안됨)'}
                </p>
              </div>
            </div>
            <div className="space-x-3">
              <button
                onClick={testFirebaseConnection}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                disabled={!app}
              >
                🧪 연결 테스트
              </button>
              <button
                onClick={checkFirebaseData}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                disabled={!db}
              >
                🔍 DB 확인
              </button>
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
                + 직원 추가
              </button>
            </div>
          </div>
        </div>

        {/* 직원 추가/수정 폼 */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {editingEmployee ? '직원 정보 수정' : '새 직원 추가'}
            </h2>
            <div className="space-y-6">
              {/* 기본 정보 섹션 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">기본 정보</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="사번 (예: EMP001)"
                    value={formData.empNo}
                    onChange={(e) => setFormData({ ...formData, empNo: e.target.value })}
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="text"
                    placeholder="이름"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="email"
                    placeholder="이메일"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="text"
                    placeholder="주민등록번호 (예: 901010-1234567)"
                    value={formData.residentId}
                    onChange={(e) => setFormData({ ...formData, residentId: e.target.value })}
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'male' | 'female' | '' })}
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">성별 선택</option>
                    <option value="male">남성</option>
                    <option value="female">여성</option>
                  </select>
                </div>
              </div>

              {/* 근무 정보 섹션 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">근무 정보</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="부서"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="text"
                    placeholder="직급"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <select
                    value={formData.jobType}
                    onChange={(e) => setFormData({ ...formData, jobType: e.target.value as 'full_time' | 'part_time' | 'contract' | 'intern' | '' })}
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">고용형태 선택</option>
                    <option value="full_time">정규직</option>
                    <option value="contract">계약직</option>
                    <option value="part_time">파트타임</option>
                    <option value="intern">인턴</option>
                  </select>
                  <input
                    type="date"
                    placeholder="입사일"
                    value={formData.joinDate}
                    onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="number"
                    placeholder="급여 (원)"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' | 'on_leave' })}
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">활성</option>
                    <option value="inactive">비활성</option>
                    <option value="on_leave">휴직</option>
                  </select>
                </div>
              </div>

              {/* 연락처 정보 섹션 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">연락처 정보</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="연락처 (주소 등)"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="tel"
                    placeholder="전화번호"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* 연차 정보 섹션 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">연차 정보</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <input
                    type="number"
                    placeholder="총 연차 (일)"
                    value={formData.totalLeaves}
                    onChange={(e) => setFormData({ ...formData, totalLeaves: e.target.value })}
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="사용 연차 (일)"
                    value={formData.usedLeaves}
                    onChange={(e) => setFormData({ ...formData, usedLeaves: e.target.value })}
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="잔여 연차 (일)"
                    value={formData.remainingLeaves}
                    onChange={(e) => setFormData({ ...formData, remainingLeaves: e.target.value })}
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="이월 연차 (일)"
                    value={formData.carryOverLeaves}
                    onChange={(e) => setFormData({ ...formData, carryOverLeaves: e.target.value })}
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  * 잔여 연차는 총 연차에서 사용 연차를 뺀 값으로 자동 계산됩니다
                </div>
              </div>
            </div>
            <div className="mt-4 space-x-3">
              <button
                onClick={editingEmployee ? handleUpdateEmployee : handleAddEmployee}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingEmployee ? '수정하기' : '추가하기'}
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

        {/* 직원 목록 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h2 className="text-xl font-bold text-gray-800">
              직원 목록 ({employees.length}명)
            </h2>
          </div>
          {/* 데스크톱 테이블 뷰 */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">사번</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이름</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">주민번호</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">성별</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">부서</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">직급</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">고용형태</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">입사일</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">급여</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">연락처</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">연차정보</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작업</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-3 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                      {employee.empNo}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                        <div className="text-sm text-gray-500">{employee.email}</div>
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      {employee.residentId ? 
                        `${employee.residentId.slice(0, 6)}-*******` : 
                        '-'
                      }
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      {employee.gender === 'male' ? '남성' : employee.gender === 'female' ? '여성' : '-'}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">{employee.department}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">{employee.position}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      {employee.jobType === 'full_time' ? '정규직' : 
                       employee.jobType === 'contract' ? '계약직' : 
                       employee.jobType === 'part_time' ? '파트타임' : 
                       employee.jobType === 'intern' ? '인턴' : '-'}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">{employee.joinDate}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₩ {employee.salary ? Number(employee.salary).toLocaleString() : '0'}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div>{employee.contact || '-'}</div>
                        <div className="text-xs text-gray-500">{employee.phone || '-'}</div>
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="text-xs text-gray-600">
                        <div>총 {employee.totalLeaves || 15}일</div>
                        <div>사용 {employee.usedLeaves || 0}일</div>
                        <div>잔여 {employee.remainingLeaves || (employee.totalLeaves || 15)}일</div>
                        {employee.carryOverLeaves && Number(employee.carryOverLeaves) > 0 && (
                          <div className="text-blue-600">이월 {employee.carryOverLeaves}일</div>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        employee.status === 'active' ? 'bg-green-100 text-green-800' :
                        employee.status === 'inactive' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {employee.status === 'active' ? '활성' : 
                         employee.status === 'inactive' ? '비활성' : '휴직'}
                      </span>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                      <button
                        onClick={() => startEdit(employee)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => employee.id && handleDeleteEmployee(employee.id)}
                        className="text-red-600 hover:text-red-900"
                        disabled={!firebaseConnected || !employee.id}
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {employees.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                등록된 직원이 없습니다.
              </div>
            )}
          </div>

          {/* 모바일 카드 뷰 */}
          <div className="lg:hidden space-y-4">
            {employees.map((employee) => (
              <div key={employee.id} className="bg-white border rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{employee.name}</h3>
                    <p className="text-sm text-gray-500">{employee.email}</p>
                    <p className="text-xs font-mono text-gray-400">사번: {employee.empNo}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    employee.status === 'active' ? 'bg-green-100 text-green-800' :
                    employee.status === 'inactive' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {employee.status === 'active' ? '활성' : 
                     employee.status === 'inactive' ? '비활성' : '휴직'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">성별:</span>
                    <span className="ml-1 text-gray-900">
                      {employee.gender === 'male' ? '남성' : employee.gender === 'female' ? '여성' : '-'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">부서:</span>
                    <span className="ml-1 text-gray-900">{employee.department}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">직급:</span>
                    <span className="ml-1 text-gray-900">{employee.position}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">고용형태:</span>
                    <span className="ml-1 text-gray-900">
                      {employee.jobType === 'full_time' ? '정규직' : 
                       employee.jobType === 'contract' ? '계약직' : 
                       employee.jobType === 'part_time' ? '파트타임' : 
                       employee.jobType === 'intern' ? '인턴' : '-'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">입사일:</span>
                    <span className="ml-1 text-gray-900">{employee.joinDate}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">급여:</span>
                    <span className="ml-1 text-gray-900">₩ {employee.salary ? Number(employee.salary).toLocaleString() : '0'}</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">연락처:</span>
                    <div className="mt-1 text-gray-900">
                      <div>{employee.contact || '-'}</div>
                      <div className="text-gray-500">{employee.phone || '-'}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">연차 정보:</span>
                    <div className="mt-1 grid grid-cols-2 gap-2 text-xs">
                      <div>총 {employee.totalLeaves || 15}일</div>
                      <div>사용 {employee.usedLeaves || 0}일</div>
                      <div>잔여 {employee.remainingLeaves || (employee.totalLeaves || 15)}일</div>
                      {employee.carryOverLeaves && Number(employee.carryOverLeaves) > 0 && (
                        <div className="text-blue-600">이월 {employee.carryOverLeaves}일</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex space-x-3">
                  <button
                    onClick={() => startEdit(employee)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => employee.id && handleDeleteEmployee(employee.id)}
                    className="flex-1 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                    disabled={!firebaseConnected || !employee.id}
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
            {employees.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                등록된 직원이 없습니다.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeManagement;