export interface Leave {
  id: string;
  employeeId: string;
  employeeName?: string;
  name?: string;
  startDate: string;
  endDate: string;
  date?: string;
  reason: string;
  type: '연차' | '반차' | '병가' | '기타';
  status: '신청' | '승인' | '거절' | 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface Employee {
  id: string;
  empNo: string;
  name: string;
  email: string;
  carryOverLeaves?: number;
  annualLeaves?: number;
  totalLeaves: number;
  usedLeaves: number;
  remainingLeaves: number;
  role?: string;
  createdAt?: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  createdAt: string;
}