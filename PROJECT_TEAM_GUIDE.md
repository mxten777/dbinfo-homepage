# DB.INFO 홈페이지 프론트엔드 고도화 프로젝트 문서

## 1. 프로젝트 개요
- Vite + React + TypeScript + Tailwind CSS 기반
- 주요 기능: 관리자/직원/프로젝트/연차 관리, 공통 컴포넌트, 반응형, 접근성 강화
- 배포: Vercel

## 2. 폴더/파일 구조
- src/components: 공통 UI 컴포넌트(Header, Footer, BusinessSection, CompanyNewsList, FadeSlideIn, ErrorBoundary 등)
- src/pages: 주요 페이지(Home, Projects, ProjectList, Leaves, AdminHome, AdminEmployeeManage, EmployeeHome 등)
- public/images: 이미지/에셋
- tailwind.config.js: 커스텀 컬러/폰트/유틸리티
- tsconfig.json: 타입스크립트 설정

## 3. 주요 컴포넌트/페이지별 역할
- Header/Footer: 사이트 전체 네비/정보, 접근성(role, aria-label), 반응형
- Home: 메인 비주얼, 회사소개, 사업영역, CTA, Stats, 동적 효과
- BusinessSection/CompanyNewsList: 사업영역/사내소식 카드, 디자인/접근성/인터랙션 강화
- EmployeeHome/AdminHome/ProjectList: 현황 테이블/카드, 반응형, 여백/폰트/컬러 일관성
- ErrorBoundary: 에러 표시, 접근성(role, aria-live, aria-label)

## 4. 접근성/디자인/일관성
- aria-label, role, focus, 키보드 접근성, 시맨틱 태그 적용
- 컬러/폰트/버튼/카드/테이블/모달 등 공통 스타일, 반응형 레이아웃
- Tailwind 커스텀 컬러/폰트/그라데이션/포인트 활용

## 5. 코드/운영 관리
- 타입/변수/함수 중복 선언 및 불필요한 코드 제거
- 주요 기능별 분리, 가독성/유지보수성 강화
- 최신 패키지(pnpm, firebase 등) 사용
- 배포: Vercel 실시간 무중단 배포

## 6. 문서/산출물
- README.md: 프로젝트 개요, 실행/배포 방법
- PROJECT_FINAL_REPORT.md: 전체 개선 내역, 주요 변경점, 산출물
- PROJECT_CHECKLIST.md: 시행착오 방지 체크리스트
- ROLE_STRUCTURE.md: 역할/권한 구조

## 7. 팀원 공유/협업 팁
- 코드/문서 일관성 유지, 커밋 메시지 명확하게 작성
- 기능별/페이지별 역할 분담, 변경점 주석화
- 배포 전 전체 테스트 및 접근성 점검

---

추가 문서화/팀원 안내가 필요하면 언제든 요청해 주세요.