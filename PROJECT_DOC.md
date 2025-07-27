# DB.INFO 공식 홈페이지 프로젝트

## 프로젝트 개요
- **목적:** 디비인포 공식 홈페이지 리뉴얼 및 내부 기능(프로젝트 실적/연차 관리 등) 포함 웹앱 구현
- **기술스택:**
  - Vite + React + TypeScript
  - Tailwind CSS 3.x
  - pnpm
  - Firebase(내부 기능 예정)
  - Vercel(배포)

## 폴더 구조(주요)
```
vite-project/
├── src/
│   ├── components/
│   │   └── Header.tsx, BusinessSection.tsx 등
│   └── pages/
│       ├── Home.tsx
│       └── Admin.tsx
├── public/
│   └── images/
├── my-mvp-template/   # 템플릿 저장용 폴더
├── postcss.config.cjs
├── tailwind.config.cjs
├── index.html
└── ...
```

## 주요 기능 및 섹션
- Hero(메인), 회사소개, 비전/미션, 연혁, 조직도, 사업영역, 구성원, 채용정보, 연락처
- 모바일 햄버거 메뉴, 스크롤 이동, 반응형 UI
- 관리자 페이지(로그인/홈으로 이동 버튼, 기능 미구현)


## Database 설계(예시)
- **주요 컬렉션 및 필드 구조 (Firebase Firestore 기준)**
  - `users` : 사용자 정보
    - uid (string): 사용자 고유 ID
    - name (string): 이름
    - email (string): 이메일
    - role (string): 'admin' | 'employee'
    - createdAt (timestamp): 가입일
  - `leaves` : 연차 신청/관리
    - id (string): 문서 ID
    - userId (string): 신청자 uid
    - userName (string): 신청자 이름
    - startDate (timestamp): 연차 시작일
    - endDate (timestamp): 연차 종료일
    - status (string): 'pending' | 'approved' | 'rejected'
    - createdAt (timestamp): 신청일시
    - approvedAt (timestamp): 승인/반려일시
    - approverId (string): 승인자 uid
  - `projects` : 프로젝트 실적
    - id (string): 문서 ID
    - title (string): 프로젝트명
    - description (string): 설명
    - startDate, endDate (timestamp): 기간
    - members (array): 참여자 uid 목록
    - ...
- **권장사항**
  - 각 컬렉션별 인덱스 설정(특히 userId, status 등)
  - Timestamp는 UTC 저장, UI에서는 KST 변환 표시
  - 샘플 데이터 구조는 필요시 별도 문서 참고

## 배포
- Vercel로 정적 배포(출력 디렉토리: `dist`)
- 빌드 명령어: `pnpm build` 또는 `npm run build`

## 실서비스 도메인 배포 가이드 (예: http://www.db-info.co.kr)
1. **Vercel에 프로젝트 배포**
   - Vercel 로그인 → New Project → GitHub 연동 → 리포지토리 선택 → 배포
   - 빌드 명령어: pnpm build (또는 npm run build), 출력 디렉토리: dist
2. **도메인 연결**
   - Vercel 대시보드 → 해당 프로젝트 → Settings → Domains
   - "Add" 클릭 후 db-info.co.kr 입력
   - 안내에 따라 도메인 업체(가비아, 카페24 등)에서 네임서버(NS) 또는 A/CNAME 레코드 변경
   - DNS 전파 후 http://www.db-info.co.kr 접속 시 리뉴얼 사이트 노출
3. **www 서브도메인 리디렉션(선택)**
   - www.db-info.co.kr도 동일하게 연결하거나, www 없는 주소로 리디렉션 설정 가능
4. **도메인 소유권/설정 문의**
   - 도메인 업체 고객센터에 "Vercel 연결" 문의 시 상세 안내 가능

## 향후 해야 할 일
1. **Firebase 연동**
   - 관리자 인증(로그인/로그아웃)
   - 프로젝트 실적/연차 관리 등 내부 기능 구현
2. **프로젝트/실적/연차 관리 UI 및 DB 설계**
   - 관리자만 접근 가능한 대시보드/CRUD 화면
3. **접근권한/보안 강화**
   - 관리자 인증/권한 분리, 데이터 보호
4. **반응형/접근성 추가 개선**
   - 모바일 UX, 웹 접근성(WA) 체크
5. **SEO/메타태그/오픈그래프 등 마크업 보강**
6. **테스트/배포 자동화(CI/CD) 연동**
7. **공식 홈페이지 컨텐츠 최신화 및 유지보수**

---

> 문의: info@dbinfo.co.kr / 02-1234-5678
