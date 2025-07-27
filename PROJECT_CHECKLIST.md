# Vite+React+TypeScript 프로젝트 시행착오 방지 체크리스트

## 1. 타입 패키지와 버전 관리
- `@types/react`, `@types/react-dom`, `typescript` 등 타입 패키지를 항상 최신으로 유지
- `pnpm list typescript react`로 버전 확인

## 2. tsconfig.json 설정
- 반드시 아래 옵션을 추가
  ```json
  "jsx": "react-jsx"
  "include": ["src", "node_modules/@types"]
  ```

## 3. 파일 확장자
- React 컴포넌트 파일은 반드시 `.tsx` 확장자 사용

## 4. 중복 선언/불필요한 코드 정리
- 타입, 변수, import가 중복되거나 사용하지 않는 코드는 바로 정리

## 5. VSCode/IDE 캐시 관리
- 빌드 오류가 계속되면 VSCode를 완전히 종료 후 재시작
- 필요시 node_modules와 lock 파일 삭제 후 재설치

## 6. 환경 변수 및 배포 설정
- Vercel 등 배포 환경에서는 환경변수와 빌드 명령어를 정확히 관리

## 7. 작은 단위로 자주 커밋/백업
- 변경 사항을 자주 커밋하고, 문제가 생기면 이전 상태로 쉽게 복구

---

이 체크리스트를 지키면 대부분의 타입/빌드/배포 오류를 빠르게 해결할 수 있습니다.
