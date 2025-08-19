// 프로젝트 실적 타입
export interface Deployment {
  status: '등록' | '진행' | '완료';
  statusChangeDate: string;
  note?: string;
}

export interface Project {
  id: string;
  requestDate: string; // 등록일
  client: string; // 고객사
  project: string; // 프로젝트명
  period: string; // 프로젝트기간
  location: string; // 장소
  developer: string; // 개발자
  deployments: Deployment[]; // 투입/철수 이력
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
}
