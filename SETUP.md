# 🛠️ DB.INFO 설치 및 설정 가이드

## 📋 사전 요구사항

- **Node.js** 18.0 이상
- **npm** 또는 **yarn**
- **Firebase** 계정
- **Vercel** 계정 (배포용)

## 🚀 설치 단계

### 1. 프로젝트 클론

```bash
git clone https://github.com/mxten777/dbinfo-homepage.git
cd dbinfo-final
```

### 2. 의존성 설치

```bash
npm install
# 또는
yarn install
```

### 3. Firebase 프로젝트 설정

#### 3.1 Firebase Console에서 프로젝트 생성
1. [Firebase Console](https://console.firebase.google.com/) 접속
2. "프로젝트 추가" 클릭
3. 프로젝트 이름: `dbinfo-final` 입력
4. Google Analytics 활성화 (선택사항)

#### 3.2 Firebase 서비스 활성화

**Authentication 설정:**
1. Firebase Console → Authentication → 시작하기
2. 로그인 방법 → 이메일/비밀번호 활성화
3. 사용자 추가 → 관리자 계정 생성

**Firestore Database 설정:**
1. Firebase Console → Firestore Database → 데이터베이스 만들기
2. 보안 규칙: 테스트 모드로 시작 (나중에 수정)
3. 위치: asia-northeast3 (서울) 선택

**Storage 설정:**
1. Firebase Console → Storage → 시작하기
2. 보안 규칙: 테스트 모드로 시작

#### 3.3 Firebase 구성 키 가져오기
1. Firebase Console → 프로젝트 설정 (⚙️)
2. "앱 추가" → 웹 앱 선택
3. 앱 닉네임: `dbinfo-web`
4. Firebase SDK 구성 정보 복사

### 4. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일 생성:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Admin Configuration
NEXT_PUBLIC_ADMIN_EMAIL=your_admin_email@domain.com
```

### 5. Firebase 보안 규칙 설정

#### Firestore Rules (`firestore.rules`):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 직원 컬렉션
    match /employees/{document} {
      allow read, write: if request.auth != null;
    }
    
    // 프로젝트 컬렉션
    match /projects/{document} {
      allow read, write: if request.auth != null;
    }
    
    // 연차 컬렉션
    match /leaves/{document} {
      allow read, write: if request.auth != null;
    }
    
    // 회사 소식 컬렉션
    match /company-news/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

#### Storage Rules (`storage.rules`):
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 6. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

## 🔑 초기 데이터 설정

### 관리자 계정 설정
1. Firebase Console → Authentication → 사용자
2. "사용자 추가" 클릭
3. 이메일/비밀번호 입력
4. `.env.local`의 `NEXT_PUBLIC_ADMIN_EMAIL`을 해당 이메일로 설정

### 테스트 데이터 추가 (선택사항)

**직원 데이터 (`employees` 컬렉션):**
```json
{
  "name": "김철수",
  "department": "개발팀",
  "position": "팀장", 
  "email": "kim@db-info.co.kr",
  "phone": "010-1234-5678",
  "totalLeaves": 15,
  "usedLeaves": 3,
  "createdAt": "Firebase Timestamp"
}
```

**프로젝트 데이터 (`projects` 컬렉션):**
```json
{
  "title": "AI 플랫폼 개발",
  "description": "머신러닝 기반 데이터 분석 플랫폼",
  "status": "in-progress",
  "startDate": "2025-01-01",
  "endDate": "2025-12-31",
  "total": "50000000",
  "team": ["김철수", "이영희"],
  "createdAt": "Firebase Timestamp"
}
```

## 🚀 배포

### Vercel 배포
1. [Vercel](https://vercel.com) 계정 생성/로그인
2. GitHub 저장소와 연동
3. 환경 변수 설정 (`.env.local` 내용 복사)
4. 배포 완료

### 환경 변수 확인
배포 전 모든 `NEXT_PUBLIC_*` 환경 변수가 Vercel에 설정되었는지 확인

## 🔧 문제 해결

### Firebase 연결 오류
```bash
# Firebase CLI 설치
npm install -g firebase-tools

# 로그인
firebase login

# 프로젝트 연결
firebase use your_project_id
```

### 빌드 오류
```bash
# 타입 검사
npm run type-check

# 린트 검사  
npm run lint

# 빌드 테스트
npm run build
```

### Port 3000 사용 중
```bash
# 다른 포트로 실행
npm run dev -- -p 3001
```

## 📞 지원

문제가 발생하면 다음을 확인하세요:

1. **Firebase 구성**: `.env.local` 파일의 모든 키가 정확한지 확인
2. **인터넷 연결**: Firebase 서비스 접근 가능한지 확인  
3. **Node.js 버전**: 18.0 이상인지 확인
4. **브라우저 콘솔**: 오류 메시지 확인

추가 도움이 필요하면 GitHub Issues에 문의하세요.