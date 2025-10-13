// Firebase 컬렉션 확인 스크립트
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyAQegbBDZ5TFHUK_InrE2hzGASkNmdUKPc",
  authDomain: "vite-project-158c3.firebaseapp.com",
  projectId: "vite-project-158c3",
  storageBucket: "vite-project-158c3.appspot.com",
  messagingSenderId: "311468107707",
  appId: "1:311468107707:web:b7e6a27b503940cecc869e"
};

async function checkFirebaseCollections() {
  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    console.log('🔥 Firebase 프로젝트 연결됨:', firebaseConfig.projectId);
    console.log('=' .repeat(50));
    
    // 확인할 컬렉션 목록
    const collectionsToCheck = [
      'employees', 'employee', 'staff', 'users', 'members', 'people', 
      'person', 'workers', 'team', 'roster', 'personnel'
    ];
    
    for (const collectionName of collectionsToCheck) {
      try {
        const snapshot = await getDocs(collection(db, collectionName));
        
        if (!snapshot.empty) {
          console.log(`✅ ${collectionName} 컬렉션: ${snapshot.size}개 문서 발견`);
          
          // 문서 내용 확인
          snapshot.forEach((doc) => {
            const data = doc.data();
            console.log(`  - 문서 ID: ${doc.id}`);
            console.log(`    이름: ${data.name || data.displayName || data.fullName || '이름 없음'}`);
            console.log(`    이메일: ${data.email || '이메일 없음'}`);
            console.log(`    부서: ${data.department || data.dept || '부서 없음'}`);
            console.log('    ---');
          });
        } else {
          console.log(`❌ ${collectionName} 컬렉션: 비어있음`);
        }
      } catch (error) {
        console.log(`⚠️  ${collectionName} 컬렉션: 접근 불가 또는 없음`);
      }
    }
    
    console.log('=' .repeat(50));
    console.log('Firebase 컬렉션 확인 완료');
    
  } catch (error) {
    console.error('❌ Firebase 연결 실패:', error);
  }
}

checkFirebaseCollections();