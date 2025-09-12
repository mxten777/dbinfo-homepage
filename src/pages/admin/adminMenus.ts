
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
    label: '직원정보 보완',
    desc: '직원정보 추가/수정',
    color: 'bg-blue-600',
    icon: FaUserPlus,
    to: '/admin/register',
  },
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
      label: '직원연차 관리',
      desc: '직원 및 대리신청 승인/반려 관리',
      color: 'bg-cyan-400',
      icon: FaCalendarCheck,
      to: '/admin/deputy-approval',
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
  // ...기존 승인/반려처리 메뉴 제거
  ];
import { FaUserPlus, FaUserEdit, FaProjectDiagram, FaCalendarCheck, FaUserShield } from 'react-icons/fa';
