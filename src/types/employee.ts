// 직원 및 연차 타입
export interface Employee {
  id: string;
  empNo: string; // 사번 YYMMDD-001 형식
  name: string;
  email?: string;
  totalLeaves?: number;        // 총연차(이월+올해, 기존 호환)
  carryOverLeaves?: number;    // 이월연차
  annualLeaves?: number;       // 올해연차
  usedLeaves?: number;         // 연차사용일수
  remainingLeaves?: number;    // 잔여연차(자동계산)
}

// 사번 생성 함수: 오늘 날짜 기준 YYMMDD-001 형식, 이미 존재하는 사번 배열을 받아 다음 번호 생성
export function generateEmpNo(existingEmpNos: string[]): string {
  const today = new Date();
  const yymmdd = today.getFullYear().toString().slice(2, 4) +
    ("0" + (today.getMonth() + 1)).slice(-2) +
    ("0" + today.getDate()).slice(-2);
  const prefix = `${yymmdd}-`;
  const nums = existingEmpNos
    .filter(no => no.startsWith(prefix))
    .map(no => parseInt(no.split("-")[1], 10))
    .filter(n => !isNaN(n));
  const nextNum = (nums.length > 0 ? Math.max(...nums) + 1 : 1).toString().padStart(3, "0");
  return `${prefix}${nextNum}`;
}

// 연차신청 타입
export interface Leave {
  id: string;
  employeeId: string;
  employeeName: string;
  name?: string; // 관리자가 직접 입력할 때 사용
  startDate?: string; // 시작일 (YYYY-MM-DD 형식)
  endDate?: string; // 종료일 (YYYY-MM-DD 형식)
  date: string; // 사용일자(직원이 입력, "YYYY-MM-DD~YYYY-MM-DD" 형식)
  reason: string;
  status: '신청' | '승인' | '거절' | '반려';
  createdAt?: string; // 신청일자(시스템 일시)
  processedAt?: string; // 승인/반려일자(시스템 일시)
}

export interface Project {
  id: string;
  project: string;
  description: string;
  period: string;
  manager: string;
  techStack: string[];
  link: string;
  thumbnailUrl: string;
}
