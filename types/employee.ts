// 직원 타입 정의
export interface Employee {
  id?: string;
  uid?: string;
  empNo?: string;
  name: string;
  email: string;
  residentId?: string;
  gender?: string;
  position: string;
  department: string;
  jobType?: string;
  joinDate: string;
  contact?: string;
  phone: string;
  salary: number;
  role?: 'admin' | 'employee';
  status: 'active' | 'inactive' | 'on_leave';
  totalLeaves?: number;
  carryOverLeaves?: number;
  annualLeaves?: number;
  usedLeaves?: number;
  remainingLeaves?: number;
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