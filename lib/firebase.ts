// Firebase 설정 파일
import { initializeApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";
import { getAnalytics, Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:demo",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-DEMO"
};

// Firebase 앱 초기화 (환경변수가 없으면 null 반환)
let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;
let analytics: Analytics | null = null;

// Firebase 초기화
try {
  // Firebase 설정값 확인
  console.log('Firebase 초기화 시작...');
  console.log('API Key exists:', !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
  console.log('Project ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
  console.log('Auth Domain:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);
  
  app = initializeApp(firebaseConfig);
  
  // Firestore 초기화 시 에러 핸들링 추가
  try {
    db = getFirestore(app);
    console.log('✅ Firestore 초기화 성공');
  } catch (firestoreError) {
    console.error('❌ Firestore 초기화 실패:', firestoreError);
    db = null;
  }
  
  // Auth 초기화
  try {
    auth = getAuth(app);
    console.log('✅ Auth 초기화 성공');
  } catch (authError) {
    console.error('❌ Auth 초기화 실패:', authError);
    auth = null;
  }
  
  // Analytics는 브라우저에서만 초기화
  if (typeof window !== 'undefined') {
    try {
      analytics = getAnalytics(app);
      console.log('✅ Analytics 초기화 성공');
    } catch (error) {
      console.log('⚠️ Analytics not available:', error);
    }
  }
  
  console.log('🔥 Firebase 앱 연결 성공! Project ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
} catch (error) {
  console.error('❌ Firebase 앱 초기화 실패:', error);
  console.error('❌ 상세 에러:', error);
  // 초기화 실패시 null로 설정
  app = null;
  db = null;
  auth = null;
}

// Firebase 서비스 내보내기
export { db, auth, analytics };

export default app;