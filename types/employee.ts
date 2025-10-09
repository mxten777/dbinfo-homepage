// 직원 타입 정의
export interface Employee {
  id?: string;
  uid?: string;
  empNo: string;                        // 사원번호 (필수)
  name: string;                         // 이름
  email: string;                        // 이메일
  residentId?: string;                  // 주민번호
  gender?: 'male' | 'female' | 'other'; // 성별
  position: string;                     // 직급
  department: string;                   // 부서
  jobType?: string;                     // 직무유형
  joinDate: string;                     // 입사일
  contact?: string;                     // 연락처
  phone: string;                        // 전화번호
  salary?: number;                      // 급여
  role?: 'admin' | 'employee';
  status: 'active' | 'inactive' | 'on_leave';
  // 연차 관련 정보
  totalLeaves?: number;                 // 총 연차일수 (입사년도 기준)
  usedLeaves?: number;                  // 사용한 연차일수
  remainingLeaves?: number;             // 남은 연차일수
  carryOverLeaves?: number;             // 이월 연차일수
  createdAt?: string;
  updatedAt?: string;
}

// 연차 신청 타입 정의
export interface Leave {
  id?: string;
  employeeId: string;
  employeeName: string;
  name: string;
  startDate: string;
  endDate: string;
  reason: string;
  type: '연차' | '병가' | '경조사' | '기타';
  status: '신청' | '승인' | '반려';
  days: number;
  createdAt: string;
  approvedAt?: string;
  approvedBy?: string;
  rejectedAt?: string;
  rejectedBy?: string;
  rejectedReason?: string;
  isAdminRequest?: boolean;
}

// 관리자 타입 정의
export interface Admin {
  id?: string;
  uid: string;
  email: string;
  name: string;
  role: 'admin';
  isAdmin: boolean;
  permissions: string[];
  createdAt: string;
  updatedAt?: string;
}