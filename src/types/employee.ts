  export type LeaveType = '연차' | '반차' | '병가' | '경조사' | '기타';
  export type LeaveStatus = '신청' | '승인' | '반려';

  export interface Leave {
  id?: string;
  employeeId?: string;
  employeeName?: string;
  name?: string;
  type: LeaveType;
  status: LeaveStatus;
  startDate: string;
  endDate: string;
  days: number;
  reason?: string;
  createdAt?: number;
  updatedAt?: number;
  isAdminRequest?: boolean;
  }
  export interface Employee {
    id: string;
    uid?: string; // Firebase 
    empNo: string;
    name: string;
    email: string;
    carryOverLeaves?: number;
    annualLeaves?: number;
    totalLeaves: number;
    usedLeaves: number;
    remainingLeaves: number;
    regNo?: string;
    gender?: string;
    position?: string;
    department?: string;
    jobType?: string;
    joinDate?: string;
    phone?: string;
    role?: string;
  }