// 관리자 계정 등록 스크립트
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';

// 관리자 계정 정보
const adminAccounts = [
  {
    email: 'hankjae@db-info.co.kr',
    password: 'admin1234!',
    name: '한국재'
  },
  {
    email: '6511kesuk@db-info.co.kr', 
    password: 'admin1234!',
    name: '이수연'
  }
];

// 관리자 계정 생성 함수
export const createAdminAccounts = async () => {
  console.log('관리자 계정 생성을 시작합니다...');
  
  for (const admin of adminAccounts) {
    try {
      console.log(`${admin.email} 계정 생성 중...`);
      
      // Firebase Authentication에 사용자 생성
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        admin.email, 
        admin.password
      );
      
      const user = userCredential.user;
      
      // 사용자 프로필 업데이트
      await updateProfile(user, {
        displayName: admin.name
      });
      
      // Firestore에 관리자 정보 저장
      await setDoc(doc(db, 'admins', user.uid), {
        email: admin.email,
        name: admin.name,
        role: 'admin',
        createdAt: new Date().toISOString(),
        permissions: ['all'] // 모든 권한
      });
      
      // employees 컬렉션에도 추가 (직원 관리 시스템에서 조회되도록)
      await setDoc(doc(db, 'employees', user.uid), {
        empNo: `ADM${Date.now().toString().slice(-6)}`, // 관리자 사번
        name: admin.name,
        email: admin.email,
        role: 'admin',
        totalLeaves: 25, // 관리자는 25일 연차
        carryOverLeaves: 0,
        annualLeaves: 25,
        usedLeaves: 0,
        remainingLeaves: 25,
        createdAt: new Date().toISOString()
      });
      
      console.log(`✅ ${admin.email} 관리자 계정 생성 완료`);
      
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        console.log(`⚠️ ${admin.email}는 이미 등록된 계정입니다.`);
      } else {
        console.error(`❌ ${admin.email} 계정 생성 실패:`, error.message);
      }
    }
  }
  
  console.log('관리자 계정 등록 프로세스 완료');
};

// 관리자 권한 확인 함수
export const checkAdminPermissions = async (userEmail: string) => {
  try {
    const adminDoc = await import('firebase/firestore').then(firestore => 
      firestore.getDoc(firestore.doc(db, 'admins', userEmail))
    );
    
    if (adminDoc.exists()) {
      console.log('관리자 권한 확인됨:', adminDoc.data());
      return true;
    } else {
      console.log('일반 사용자입니다.');
      return false;
    }
  } catch (error) {
    console.error('권한 확인 실패:', error);
    return false;
  }
};

// 즉시 실행용 (개발 환경에서만 사용)
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  // 개발 환경에서만 자동 실행
  console.log('개발 환경에서 관리자 계정 생성 스크립트 준비됨');
  console.log('콘솔에서 createAdminAccounts() 실행하세요');
}

export default { createAdminAccounts, checkAdminPermissions };
