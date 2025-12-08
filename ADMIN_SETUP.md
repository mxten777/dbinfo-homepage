# Firebase Admin 계정 생성 가이드

## 사전 준비

1. **Firebase 프로젝트 Service Account Key 다운로드**
   - Firebase Console (https://console.firebase.google.com) 접속
   - 프로젝트 선택: `dbinfo-final`
   - 프로젝트 설정 ⚙️ → Service accounts 탭
   - "Generate new private key" 클릭
   - 다운로드된 JSON 파일을 프로젝트 루트에 `serviceAccountKey.json`으로 저장

2. **firebase-admin 패키지 설치**
   ```bash
   npm install firebase-admin --save-dev
   ```

## 관리자 계정 생성

### 방법 1: 스크립트 사용 (권장)

```bash
# 기본 사용법
node scripts/create-admin.js <이메일> <비밀번호>

# 예시
node scripts/create-admin.js hankjae@db-info.co.kr admin123!@#
```

### 방법 2: Firebase Console에서 직접 생성

#### Step 1: Authentication에서 사용자 생성
1. Firebase Console → Authentication → Users 탭
2. "Add user" 클릭
3. 이메일과 비밀번호 입력
4. 사용자 생성 후 UID 복사

#### Step 2: Firestore에 관리자 권한 추가
1. Firebase Console → Firestore Database
2. `admins` 컬렉션 생성 (없는 경우)
3. 문서 추가:
   - Document ID: (복사한 UID)
   - 필드:
     ```
     email: "hankjae@db-info.co.kr" (string)
     isAdmin: true (boolean)
     role: "super_admin" (string)
     createdAt: (timestamp - 서버 타임스탬프)
     displayName: "DB.INFO Admin" (string)
     permissions: ["all"] (array)
     ```

## 생성된 계정으로 로그인

1. 브라우저에서 관리자 로그인 페이지 접속
   - 로컬: http://localhost:3000/admin/login
   - 프로덕션: https://your-domain.vercel.app/admin/login

2. 생성한 이메일과 비밀번호로 로그인

## 문제 해결

### "시스템 오류입니다" 오류
- `.env.local` 파일의 Firebase 설정 확인
- Firebase 프로젝트가 활성화되어 있는지 확인

### "관리자 권한이 없습니다" 오류
- Firestore의 `admins` 컬렉션에 사용자가 제대로 추가되었는지 확인
- `isAdmin: true` 필드가 있는지 확인

### "이메일 또는 비밀번호가 올바르지 않습니다" 오류
- Firebase Authentication에 사용자가 생성되었는지 확인
- 이메일과 비밀번호가 정확한지 확인
- Firebase Console → Authentication → Sign-in method에서 "Email/Password" 활성화 확인

## 보안 주의사항

⚠️ **중요**: `serviceAccountKey.json` 파일은 절대 Git에 커밋하지 마세요!
- `.gitignore`에 추가되어 있는지 확인
- 이 파일은 프로젝트의 모든 권한을 가지고 있습니다

## 추가 관리자 생성

여러 관리자를 생성하려면 위의 스크립트를 다른 이메일로 반복 실행하세요:

```bash
node scripts/create-admin.js admin1@db-info.co.kr password1
node scripts/create-admin.js admin2@db-info.co.kr password2
node scripts/create-admin.js admin3@db-info.co.kr password3
```

## 관리자 권한 제거

Firestore Console에서 `admins` 컬렉션의 해당 문서를 삭제하거나 `isAdmin` 필드를 `false`로 변경하세요.
