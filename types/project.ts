// 프로젝트 타입 정의
export interface Deployment {
  status: string;
  statusChangeDate: string;
}

export interface Milestone {
  name: string;
  date: string;
  completed: boolean;
}

export interface Project {
  id?: string;
  requestDate: string;
  client: string;
  project: string;
  period: string;
  location: string;
  developer: string;
  deployments: Deployment[];
  grade?: string;
  department?: string;
  skill?: string;
  pay?: number;
  supply?: number;
  total?: number;
  result?: string;
  deleted?: boolean;
  description?: string;
  manager?: string;
  techStack?: string[];
  link?: string;
  thumbnailUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  // 프로젝트 상태 관리용 추가 속성
  progress?: number;
  teamMembers?: string[];
  milestones?: Milestone[];
}