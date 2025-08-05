// Firebase 연차 데이터 초기화 스크립트
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

// Firebase 설정 (firebaseConfig.ts에서 복사)
const firebaseConfig = {
  apiKey: "AIzaSyD2FqNnC4hCCwDKN20SFB0c16-OL6tNhSg",
  authDomain: "dbinfo-homepage.firebaseapp.com",
  projectId: "dbinfo-homepage",
  storageBucket: "dbinfo-homepage.firebasestorage.app",
  messagingSenderId: "721930221418",
  appId: "1:721930221418:web:f1995cd02f17acfb9b5f8a",
  measurementId: "G-HD55M3GFHW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function clearLeavesData() {
  try {
    console.log('연차 데이터 삭제 시작...');
    
    // leaves 컬렉션의 모든 문서 가져오기
    const leavesSnapshot = await getDocs(collection(db, 'leaves'));
    
    console.log(`삭제할 연차 데이터: ${leavesSnapshot.docs.length}개`);
    
    // 각 문서 삭제
    const deletePromises = leavesSnapshot.docs.map(document => {
      console.log(`삭제 중: ${document.id}`);
      return deleteDoc(doc(db, 'leaves', document.id));
    });
    
    await Promise.all(deletePromises);
    
    console.log('모든 연차 데이터 삭제 완료!');
    
    // 삭제 후 확인
    const verifySnapshot = await getDocs(collection(db, 'leaves'));
    console.log(`삭제 후 남은 데이터: ${verifySnapshot.docs.length}개`);
    
  } catch (error) {
    console.error('데이터 삭제 중 오류:', error);
  }
}

// 스크립트 실행
clearLeavesData().then(() => {
  console.log('스크립트 완료');
  process.exit(0);
}).catch(error => {
  console.error('스크립트 실행 오류:', error);
  process.exit(1);
});
