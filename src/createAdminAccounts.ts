// 관리자 계정 등록 스크립트
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';

// 관리자 계정 정보
const adminAccounts = [
  {
    email: 'jndgy@naver.com',
    password: 'admin1234!',
    name: '관리자'
  },
  {
    email: 'hankjae@db-info.co.kr',
    password: 'admin1234!',
    name: '한규재'
  },
  {
    email: '6511kesuk@db-info.co.kr', 
    password: 'admin1234!',
    name: '김애숙'
  }
];

// 관리자 계정 생성 함수
export const createAdminAccounts = async () => {
  console.log('관리자 계정 생성을 시작합니다...');
  
  for (const admin of adminAccounts) {
    try {
      console.log(`${admin.email} 계정 처리 중...`);
      
      let user;
      
      // 1. 먼저 계정 생성 시도
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth, 
          admin.email, 
          admin.password
        );
        user = userCredential.user;
        console.log(`✅ ${admin.email} 새 계정 생성 완료`);
      } catch (createError: any) {
        if (createError.code === 'auth/email-already-in-use') {
          console.log(`⚠️ ${admin.email}는 이미 등록된 계정입니다.`);
          
          // 현재 로그인된 사용자가 해당 이메일과 같은지 확인
          const currentUser = auth.currentUser;
          if (currentUser && currentUser.email === admin.email) {
            user = currentUser;
            console.log(`✅ ${admin.email} 현재 로그인된 계정에 관리자 권한 부여`);
          } else {
            console.log(`ℹ️ ${admin.email} 계정이 존재하지만 현재 로그인되지 않음`);
            console.log(`💡 해당 계정으로 로그인한 후 다시 시도하거나, Firebase 콘솔에서 직접 관리자 권한을 부여하세요.`);
            continue; // 다음 계정으로 넘어감
          }
        } else {
          throw createError; // 다른 오류는 재발생
        }
      }
      
      // 2. 사용자 프로필 업데이트
      await updateProfile(user, {
        displayName: admin.name
      });
      
      // 3. Firestore에 관리자 정보 저장 (admins 컬렉션에만 저장)
      await setDoc(doc(db, 'admins', user.uid), {
        email: admin.email,
        name: admin.name,
        role: 'admin',
        createdAt: new Date().toISOString(),
        permissions: ['all'], // 모든 권한
        isAdmin: true // 관리자 식별자
      });
      
      console.log(`✅ ${admin.email} 관리자 권한 설정 완료`);
      
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
