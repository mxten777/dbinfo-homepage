// 현재 시스템의 사용자 리스트 확인 스크립트
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';

// 관리자 리스트 확인
export const getCurrentAdmins = async () => {
  try {
    console.log('=== 📋 현재 관리자 리스트 ===');
    const adminsSnapshot = await getDocs(collection(db, 'admins'));
    
    if (adminsSnapshot.empty) {
      console.log('❌ 등록된 관리자가 없습니다.');
      return [];
    }
    
    const admins = adminsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }) as any);
    
    admins.forEach((admin: any, index: number) => {
      console.log(`${index + 1}. 👨‍💼 ${admin.name} (${admin.email})`);
      console.log(`   - 역할: ${admin.role}`);
      console.log(`   - 권한: ${admin.permissions?.join(', ') || 'N/A'}`);
      console.log(`   - 등록일: ${admin.createdAt || 'N/A'}`);
      console.log('');
    });
    
    return admins;
  } catch (error) {
    console.error('관리자 리스트 조회 실패:', error);
    return [];
  }
};

// 직원 리스트 확인
export const getCurrentEmployees = async () => {
  try {
    console.log('=== 👥 현재 직원 리스트 ===');
    const employeesSnapshot = await getDocs(collection(db, 'employees'));
    
    if (employeesSnapshot.empty) {
      console.log('❌ 등록된 직원이 없습니다.');
      return [];
    }
    
    const employees = employeesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }) as any);
    
    // 관리자가 아닌 직원만 필터링 (새로운 시스템 기준)
    const regularEmployees = employees.filter((emp: any) => emp.role !== 'admin');
    
    if (regularEmployees.length === 0) {
      console.log('❌ 일반 직원이 없습니다. (관리자만 있음)');
      return [];
    }
    
    regularEmployees.forEach((employee: any, index: number) => {
      console.log(`${index + 1}. 👤 ${employee.name} (${employee.email})`);
      console.log(`   - 사번: ${employee.empNo || 'N/A'}`);
      console.log(`   - 부서: ${employee.department || 'N/A'}`);
      console.log(`   - 직급: ${employee.position || 'N/A'}`);
      console.log(`   - 연차: ${employee.totalLeaves || 0}일 (사용: ${employee.usedLeaves || 0}일)`);
      console.log(`   - 입사일: ${employee.joinDate || 'N/A'}`);
      console.log('');
    });
    
    return regularEmployees;
  } catch (error) {
    console.error('직원 리스트 조회 실패:', error);
    return [];
  }
};

// 전체 사용자 현황 조회
export const getUserStatus = async () => {
  console.log('🔍 현재 시스템 사용자 현황을 조회합니다...\n');
  
  const admins = await getCurrentAdmins();
  const employees = await getCurrentEmployees();
  
  console.log('=== 📊 전체 현황 요약 ===');
  console.log(`👨‍💼 관리자: ${admins.length}명`);
  console.log(`👥 직원: ${employees.length}명`);
  console.log(`🏢 전체: ${admins.length + employees.length}명`);
  console.log('');
  
  // 시스템 설정된 관리자 정보
  console.log('=== ⚙️ 시스템 설정된 관리자 계정 ===');
  console.log('1. 👨‍💼 한규재 (hankjae@db-info.co.kr) / 비밀번호: admin1234!');
  console.log('2. 👩‍💼 김애숙 (6511kesuk@db-info.co.kr) / 비밀번호: admin1234!');
  console.log('');
  
  return {
    admins,
    employees,
    total: admins.length + employees.length
  };
};

// 브라우저 콘솔에서 사용할 수 있도록 전역 함수로 등록
if (typeof window !== 'undefined') {
  (window as any).getUserStatus = getUserStatus;
  (window as any).getCurrentAdmins = getCurrentAdmins;
  (window as any).getCurrentEmployees = getCurrentEmployees;
  
  console.log('🎯 사용자 현황 조회 도구가 준비되었습니다!');
  console.log('콘솔에서 다음 명령어를 실행하세요:');
  console.log('- getUserStatus() : 전체 현황 조회');
  console.log('- getCurrentAdmins() : 관리자만 조회');
  console.log('- getCurrentEmployees() : 직원만 조회');
}

export default { getUserStatus, getCurrentAdmins, getCurrentEmployees };
