// Firestore 예시 데이터 및 추가 샘플
import type { Project } from './types/project';

const sampleProject: Project = {
  id: 'p1',
  requestDate: '2025-07-18',
  client: 'DB인포',
  project: 'DB 인포 홈페이지 리뉴얼',
  period: '2025.01 ~ 2025.06',
  location: '서울',
  developer: '홍길동',
  deployments: [],
  grade: '',
  department: '',
  skill: '',
  pay: 0,
  supply: 0,
  total: 0,
  result: '',
  deleted: false,
  description: '공식 홈페이지 UI/UX 개선 및 내부 기능 추가',
  manager: '홍길동',
  techStack: ['React', 'TypeScript', 'Firebase'],
  link: 'https://dbinfo.co.kr',
  thumbnailUrl: '/public/images/art-01.jpg'
};

console.log(sampleProject);