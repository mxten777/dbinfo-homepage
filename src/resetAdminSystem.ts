// 관리자 계정 완전 초기화 및 재설정 도구
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, deleteDoc, getDocs, collection, query, where } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';

// 기존 관리자 계정 완전 삭제
export const clearAllAdminAccounts = async () => {
  console.log('🗑️ 기존 관리자 계정을 완전히 삭제합니다...');
  
  try {
    // 1. Firestore에서 관리자 데이터 삭제
    console.log('📋 Firestore 관리자 데이터 삭제 중...');
    const adminsSnapshot = await getDocs(collection(db, 'admins'));
    
    for (const adminDoc of adminsSnapshot.docs) {
      await deleteDoc(doc(db, 'admins', adminDoc.id));
      console.log(`✅ 관리자 데이터 삭제: ${adminDoc.id}`);
    }
    
    // 2. employees 컬렉션에서 관리자 제거
    console.log('👥 직원 컬렉션에서 관리자 제거 중...');
    const employeesSnapshot = await getDocs(
      query(collection(db, 'employees'), where('role', '==', 'admin'))
    );
    
    for (const empDoc of employeesSnapshot.docs) {
      await deleteDoc(doc(db, 'employees', empDoc.id));
      console.log(`✅ 직원 컬렉션에서 관리자 제거: ${empDoc.id}`);
    }
    
    console.log('✅ 모든 관리자 데이터가 삭제되었습니다.');
    console.log('⚠️ Firebase Authentication의 사용자 계정은 Firebase 콘솔에서 수동으로 삭제해야 합니다.');
    
  } catch (error) {
    console.error('❌ 관리자 계정 삭제 실패:', error);
  }
};

// 새로운 관리자 계정 생성
export const createFreshAdminAccounts = async () => {
  console.log('🔐 새로운 관리자 계정을 생성합니다...');
  
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
  
  for (const admin of adminAccounts) {
    try {
      console.log(`👤 ${admin.name} (${admin.email}) 계정 생성 중...`);
      
      // 1. Firebase Authentication에 계정 생성
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        admin.email, 
        admin.password
      );
      
      const user = userCredential.user;
      
      // 2. 사용자 프로필 설정
      await updateProfile(user, {
        displayName: admin.name
      });
      
      // 3. Firestore에 관리자 정보 저장
      await setDoc(doc(db, 'admins', user.uid), {
        email: admin.email,
        name: admin.name,
        role: 'admin',
        isAdmin: true,
        permissions: ['all'],
        createdAt: new Date().toISOString()
      });
      
      console.log(`✅ ${admin.name} 관리자 계정 생성 완료`);
      
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        console.log(`⚠️ ${admin.email}는 이미 존재하는 계정입니다.`);
        console.log(`💡 Firebase 콘솔에서 해당 계정을 삭제한 후 다시 시도하세요.`);
      } else {
        console.error(`❌ ${admin.name} 계정 생성 실패:`, error.message);
      }
    }
  }
  
  console.log('🎉 관리자 계정 생성 프로세스 완료!');
};

// 완전 초기화 후 재생성
export const resetAdminSystem = async () => {
  console.log('🔄 관리자 시스템을 완전히 초기화하고 재설정합니다...');
  
  // 1단계: 기존 데이터 삭제
  await clearAllAdminAccounts();
  
  // 잠시 대기
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // 2단계: 새 계정 생성
  await createFreshAdminAccounts();
  
  console.log('');
  console.log('📋 완료! 다음 단계를 진행하세요:');
  console.log('1. 🌐 Firebase 콘솔 (https://console.firebase.google.com) 접속');
  console.log('2. 🔐 Authentication → 사용자 탭에서 기존 관리자 계정 삭제');
  console.log('3. 🔄 이 도구를 다시 실행하여 새 계정 생성');
  console.log('4. 🚪 새 계정으로 로그인 테스트');
};

// 브라우저 콘솔에서 사용할 수 있도록 전역 함수로 등록
if (typeof window !== 'undefined') {
  (window as any).clearAllAdminAccounts = clearAllAdminAccounts;
  (window as any).createFreshAdminAccounts = createFreshAdminAccounts;
  (window as any).resetAdminSystem = resetAdminSystem;
  
  console.log('🔧 관리자 시스템 초기화 도구가 준비되었습니다!');
  console.log('콘솔에서 다음 명령어를 실행하세요:');
  console.log('- resetAdminSystem() : 완전 초기화 후 재설정');
  console.log('- clearAllAdminAccounts() : 기존 관리자 데이터만 삭제');
  console.log('- createFreshAdminAccounts() : 새 관리자 계정만 생성');
}

export default { clearAllAdminAccounts, createFreshAdminAccounts, resetAdminSystem };
