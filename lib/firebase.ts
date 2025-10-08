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

// 실제 Firebase 설정이 있을 때만 초기화
if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY && process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "demo-key") {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    
    // Analytics는 브라우저에서만 초기화
    if (typeof window !== 'undefined') {
      try {
        analytics = getAnalytics(app);
      } catch (error) {
        console.log('Analytics not available:', error);
      }
    }
    console.log('Firebase 연결 성공');
  } catch (error) {
    console.log('Firebase 초기화 실패:', error);
  }
} else {
  console.log('Firebase 환경변수가 설정되지 않음. 데모 모드로 실행됩니다.');
}

// Firebase 서비스 내보내기
export { db, auth, analytics };

export default app;