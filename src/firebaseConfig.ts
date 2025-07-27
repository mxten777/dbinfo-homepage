// Firebase 초기화 예시
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

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
