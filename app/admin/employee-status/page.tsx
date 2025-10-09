'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import type { Employee, Leave } from '../../../types/employee';

interface DepartmentStats {
  department: string;
  totalEmployees: number;
  activeEmployees: number;
  onLeave: number;
}

interface EmployeeWithStatus extends Employee {
  leaveStatus: 'active' | 'on-leave';
  currentLeave?: Leave;
  annualLeaveUsed: number;
  annualLeaveRemaining: number;
}

const EmployeeStatusPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState<EmployeeWithStatus[]>([]);
  const [firebaseConnected, setFirebaseConnected] = useState(false);
  const [departmentStats, setDepartmentStats] = useState<DepartmentStats[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const router = useRouter();

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        if (!db) {
          console.log('Firebase가 연결되지 않음 - 데모 데이터 사용');
          setFirebaseConnected(false);
          // 데모 직원 데이터
          const demoEmployees: EmployeeWithStatus[] = [
            { 
              id: 'demo1', 
              name: '김철수', 
              email: 'kim@db-info.co.kr', 
              department: '개발팀', 
              position: '시니어 개발자', 
              joinDate: '2023-01-15', 
              phone: '010-1234-5678', 
              salary: 5500000, 
              status: 'active',
              leaveStatus: 'active',
              annualLeaveUsed: 5,
              annualLeaveRemaining: 10
            },
            { 
              id: 'demo2', 
              name: '이영희', 
              email: 'lee@db-info.co.kr', 
              department: '기획팀', 
              position: '프로젝트 매니저', 
              joinDate: '2022-08-20', 
              phone: '010-2345-6789', 
              salary: 4800000, 
              status: 'active',
              leaveStatus: 'on-leave',
              annualLeaveUsed: 8,
              annualLeaveRemaining: 7,
              currentLeave: {
                id: 'demo1',
                employeeId: 'demo2',
                employeeName: '이영희',
                name: '이영희',
                startDate: '2024-10-08',
                endDate: '2024-10-10',
                reason: '개인사유',
                type: '연차',
                status: '승인',
                days: 3,
                createdAt: '2024-10-05T10:00:00Z'
              }
            },
            { 
              id: 'demo3', 
              name: '박민수', 
              email: 'park@db-info.co.kr', 
              department: '개발팀', 
              position: '주니어 개발자', 
              joinDate: '2023-03-10', 
              phone: '010-3456-7890', 
              salary: 4200000, 
              status: 'active',
              leaveStatus: 'active',
              annualLeaveUsed: 3,
              annualLeaveRemaining: 12
            }
          ];
          setEmployees(demoEmployees);
          calculateDepartmentStats(demoEmployees);
          return;
        }

        setFirebaseConnected(true);
        console.log('Firebase에서 직원 데이터 로드 시작...');

        const employeesSnapshot = await getDocs(collection(db, 'employees'));
        const employeesList: Employee[] = [];
        
        employeesSnapshot.forEach((doc) => {
          employeesList.push({
            id: doc.id,
            ...doc.data()
          } as Employee);
        });

        // 직원 상태 정보 추가
        const employeesWithStatus: EmployeeWithStatus[] = await Promise.all(
          employeesList.map(async (employee) => {
            const employeeId = employee.id || '';
            const annualLeaveUsed = await calculateAnnualLeaveUsed(employeeId);
            const currentLeave = await getCurrentLeave(employeeId);
            
            return {
              ...employee,
              leaveStatus: currentLeave ? 'on-leave' : 'active',
              currentLeave,
              annualLeaveUsed,
              annualLeaveRemaining: 15 - annualLeaveUsed // 기본 연차 15일 가정
            };
          })
        );

        setEmployees(employeesWithStatus);
        calculateDepartmentStats(employeesWithStatus);
        console.log(`Firebase에서 ${employeesWithStatus.length}개의 직원 데이터를 로드했습니다.`);
        
      } catch (error) {
        console.error('직원 데이터 로드 실패:', error);
        setFirebaseConnected(false);
      }
    };

    const calculateAnnualLeaveUsed = async (employeeId: string): Promise<number> => {
      try {
        if (!db) return Math.floor(Math.random() * 10); // 데모용

        const currentYear = new Date().getFullYear();
        const leavesQuery = query(
          collection(db, 'leaves'),
          where('employeeId', '==', employeeId),
          where('status', '==', '승인'),
          where('type', '==', '연차')
        );
        
        const leavesSnapshot = await getDocs(leavesQuery);
        let totalDays = 0;
        
        leavesSnapshot.forEach((doc) => {
          const leave = doc.data() as Leave;
          const leaveYear = new Date(leave.startDate).getFullYear();
          if (leaveYear === currentYear) {
            totalDays += leave.days || 1;
          }
        });
        
        return totalDays;
      } catch (error) {
        console.error('연차 사용일수 계산 실패:', error);
        return 0;
      }
    };

    const getCurrentLeave = async (employeeId: string): Promise<Leave | undefined> => {
      try {
        if (!db) {
          // 데모: 이영희가 현재 연차 중
          if (employeeId === 'demo2') {
            return {
              id: 'demo1',
              employeeId: 'demo2',
              employeeName: '이영희',
              name: '이영희',
              startDate: '2024-10-08',
              endDate: '2024-10-10',
              reason: '개인사유',
              type: '연차',
              status: '승인',
              days: 3,
              createdAt: '2024-10-05T10:00:00Z'
            };
          }
          return undefined;
        }

        const today = new Date().toISOString().split('T')[0];
        const leavesQuery = query(
          collection(db, 'leaves'),
          where('employeeId', '==', employeeId),
          where('status', '==', '승인')
        );
        
        const leavesSnapshot = await getDocs(leavesQuery);
        
        for (const doc of leavesSnapshot.docs) {
          const leave = doc.data() as Leave;
          if (leave.startDate <= today && leave.endDate >= today) {
            return { id: doc.id, ...leave };
          }
        }
        
        return undefined;
      } catch (error) {
        console.error('현재 연차 조회 실패:', error);
        return undefined;
      }
    };

    const calculateDepartmentStats = (employeesData: EmployeeWithStatus[]) => {
      const departments = Array.from(new Set(employeesData.map(emp => emp.department)));
      const stats: DepartmentStats[] = departments.map(dept => {
        const deptEmployees = employeesData.filter(emp => emp.department === dept);
        return {
          department: dept,
          totalEmployees: deptEmployees.length,
          activeEmployees: deptEmployees.filter(emp => emp.leaveStatus === 'active').length,
          onLeave: deptEmployees.filter(emp => emp.leaveStatus === 'on-leave').length
        };
      });
      setDepartmentStats(stats);
    };

    const loadData = async () => {
      try {
        setLoading(true);
        await loadEmployees();
      } catch (error) {
        console.error('데이터 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    const adminMode = localStorage.getItem('admin_mode');
    const user = localStorage.getItem('admin_user');
    
    if (adminMode === 'true' && user) {
      setIsAuthenticated(true);
      loadData();
    } else {
      router.push('/admin/login');
    }
  }, [router]);

  const filteredEmployees = selectedDepartment === 'all' 
    ? employees 
    : employees.filter(emp => emp.department === selectedDepartment);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">직원 현황을 로드하는 중...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">직원 현황</h1>
              <div className="flex items-center mt-2">
                <div className={`w-3 h-3 rounded-full ${firebaseConnected ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
                <p className="text-gray-600">
                  {firebaseConnected ? 'Firebase 연결됨' : '데모 모드 (Firebase 연결 안됨)'}
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              대시보드로
            </button>
          </div>
        </div>

        {/* 전체 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">전체 직원</p>
                <p className="text-2xl font-bold text-gray-800">{employees.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">근무 중</p>
                <p className="text-2xl font-bold text-gray-800">{employees.filter(e => e.leaveStatus === 'active').length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">연차 중</p>
                <p className="text-2xl font-bold text-gray-800">{employees.filter(e => e.leaveStatus === 'on-leave').length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">부서 수</p>
                <p className="text-2xl font-bold text-gray-800">{departmentStats.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 부서별 통계 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">부서별 현황</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departmentStats.map((dept) => (
              <div key={dept.department} className="border rounded-lg p-4">
                <h3 className="font-semibold text-gray-700 mb-2">{dept.department}</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">총 인원:</span>
                    <span className="font-medium">{dept.totalEmployees}명</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">근무 중:</span>
                    <span className="font-medium text-green-600">{dept.activeEmployees}명</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">연차 중:</span>
                    <span className="font-medium text-yellow-600">{dept.onLeave}명</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 필터 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-4">
            <label className="text-gray-700 font-medium">부서 필터:</label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">전체 부서</option>
              {departmentStats.map((dept) => (
                <option key={dept.department} value={dept.department}>
                  {dept.department}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 직원 목록 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h2 className="text-xl font-bold text-gray-800">
              직원 목록 ({filteredEmployees.length}명)
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">이름</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">부서</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">직급</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">연차 현황</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">입사일</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                          <span className="text-sm font-medium text-gray-600">
                            {employee.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                          <div className="text-sm text-gray-500">{employee.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {employee.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {employee.position}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        employee.leaveStatus === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {employee.leaveStatus === 'active' ? '근무 중' : '연차 중'}
                      </span>
                      {employee.currentLeave && (
                        <div className="text-xs text-gray-500 mt-1">
                          {employee.currentLeave.startDate} ~ {employee.currentLeave.endDate}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <div className="text-xs">
                          사용: {employee.annualLeaveUsed}일 / 잔여: {employee.annualLeaveRemaining}일
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(employee.annualLeaveUsed / 15) * 100}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {employee.joinDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredEmployees.length === 0 && (
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

export default EmployeeStatusPage;