// Firebase 초기화 예시
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAQegbBDZ5TFHUK_InrE2hzGASkNmdUKPc",
  authDomain: "vite-project-158c3.firebaseapp.com",
  projectId: "vite-project-158c3",
  storageBucket: "vite-project-158c3.appspot.com",
  messagingSenderId: "311468107707",
  appId: "1:311468107707:web:b7e6a27b503940cecc869e"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Analytics는 브라우저에서만 초기화
export let analytics: any = undefined;
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.log('Analytics not available:', error);
  }
}
