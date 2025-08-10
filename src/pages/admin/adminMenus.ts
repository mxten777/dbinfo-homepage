
type IconType = (props: any) => React.ReactNode;

export interface AdminMenu {
  label: string;
  desc: string;
  color: string;
  icon: IconType;
  to: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export const adminMenus: AdminMenu[] = [
  {
    label: '직원관리',
    desc: '직원 정보 등록, 수정, 현황 관리',
    color: 'bg-blue-400',
    icon: FaUserEdit,
    to: '/admin/employee-manage',
  },
  {
    label: '프로젝트관리',
    desc: '프로젝트 등록, 수정, 삭제, 조회',
    color: 'bg-green-400',
    icon: FaProjectDiagram,
    to: '/admin/project-status',
  },
  {
    label: '연차관리',
    desc: '직원 연차 신청 및 승인/반려 관리',
    color: 'bg-cyan-400',
    icon: FaCalendarCheck,
    to: '/admin/leaves',
  },
  {
    label: '사내소식관리',
    desc: '사내 소식 등록 및 관리',
    color: 'bg-indigo-400',
    icon: FaUserPlus,
    to: '/admin/company-news-manage',
  },
  {
    label: '관리자대리 신청',
    desc: '관리자 대리 신청 및 승인',
    color: 'bg-pink-400',
    icon: FaUserShield,
    to: '/admin/deputy-request',
  },
  {
    label: '승인/반려처리',
    desc: '직원 및 대리신청 승인/반려 처리',
    color: 'bg-teal-400',
    icon: FaCheckCircle,
    to: '/admin/deputy-approval',
  },
];
import { FaCalendarCheck, FaProjectDiagram, FaUserEdit, FaUserPlus, FaUserShield, FaCheckCircle } from 'react-icons/fa';
