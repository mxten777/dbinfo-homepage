// 테스트용 관리자 및 직원 계정 정보
// Firebase Authentication에 수동으로 생성해야 함

// 관리자 계정 (예시)
const adminAccounts = [
  {
    email: 'admin@dbinfo.co.kr',
    password: 'admin123!',
    role: 'admin',
    name: '관리자'
  },
  {
    email: 'manager@dbinfo.co.kr', 
    password: 'manager123!',
    role: 'admin',
    name: '매니저'
  }
];

// 직원 계정 (예시)
const employeeAccounts = [
  {
    email: 'hong@dbinfo.co.kr',
    password: 'emp123!',
    role: 'employee',
    name: '홍길동',
    empNo: '240801-001'
  },
  {
    email: 'kim@dbinfo.co.kr',
    password: 'emp123!', 
    role: 'employee',
    name: '김철수',
    empNo: '240801-002'
  },
  {
    email: 'lee@dbinfo.co.kr',
    password: 'emp123!',
    role: 'employee', 
    name: '이영희',
    empNo: '240801-003'
  }
];

// Firebase Authentication에서 수동으로 생성 후
// Firestore의 employees 컬렉션에 직원 정보 추가 필요

export { adminAccounts, employeeAccounts };
