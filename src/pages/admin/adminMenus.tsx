import { FaUsers, FaCalendarCheck, FaProjectDiagram, FaBuilding, FaUserPlus, FaChartLine } from 'react-icons/fa';

export interface AdminMenu {
  label: string;
  to: string;
  icon: any;
  desc: string;
}

export const adminMenus: AdminMenu[] = [
  {
    label: "직원 현황",
    to: "/admin/employee-status",
    icon: FaUsers,
    desc: "등록된 직원들의 현황과 정보를 관리하세요"
  },
  {
    label: "직원 등록",
    to: "/admin/register", 
    icon: FaUserPlus,
    desc: "새로운 직원 정보를 등록하고 관리하세요"
  },
  {
    label: "연차 관리",
    to: "/admin/leaves",
    icon: FaCalendarCheck,
    desc: "직원들의 연차 신청과 승인을 관리하세요"
  },
  {
    label: "프로젝트 현황",
    to: "/admin/project-status",
    icon: FaProjectDiagram,
    desc: "진행 중인 프로젝트 상태를 모니터링하세요"
  },
  {
    label: "회사 소식",
    to: "/admin/company-news-manage",
    icon: FaBuilding,
    desc: "회사 공지사항과 소식을 작성하고 관리하세요"
  },
  {
    label: "대리 신청",
    to: "/admin/deputy-request",
    icon: FaChartLine,
    desc: "대리 업무 신청과 승인을 관리하세요"
  }
];