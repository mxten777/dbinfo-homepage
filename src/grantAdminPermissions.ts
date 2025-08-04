// 특정 이메일에 관리자 권한 부여 도구
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';

// 특정 이메일들에 관리자 권한 부여
export const grantAdminPermissions = async () => {
  console.log('🔐 관리자 권한을 부여합니다...');
  
  const adminEmails = [
    'hankjae@db-info.co.kr',
    '6511kesuk@db-info.co.kr',
    'jndgy@naver.com'
  ];
  
  const adminNames = {
    'hankjae@db-info.co.kr': '한규재',
    '6511kesuk@db-info.co.kr': '김애숙', 
    'jndgy@naver.com': '관리자'
  };
  
  try {
    // 현재 로그인된 사용자 확인
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.log('❌ 로그인된 사용자가 없습니다.');
      return;
    }
    
    console.log(`👤 현재 로그인 사용자: ${currentUser.email}`);
    
    // 현재 사용자가 관리자 이메일 목록에 있는지 확인
    if (adminEmails.includes(currentUser.email!)) {
      const adminName = adminNames[currentUser.email! as keyof typeof adminNames];
      
      // Firestore에 관리자 권한 데이터 추가
      await setDoc(doc(db, 'admins', currentUser.uid), {
        email: currentUser.email,
        name: adminName,
        role: 'admin',
        isAdmin: true,
        permissions: ['all'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      console.log(`✅ ${adminName} (${currentUser.email})에게 관리자 권한이 부여되었습니다!`);
      
      // 권한 확인
      const adminDoc = await getDoc(doc(db, 'admins', currentUser.uid));
      if (adminDoc.exists()) {
        console.log('📋 관리자 데이터:', adminDoc.data());
      }
      
      console.log('🎉 관리자 권한 부여 완료!');
      console.log('💡 페이지를 새로고침하고 다시 로그인해보세요.');
      
    } else {
      console.log(`❌ ${currentUser.email}은 관리자 이메일 목록에 없습니다.`);
      console.log('📋 관리자 이메일 목록:');
      adminEmails.forEach(email => {
        console.log(`   - ${email}`);
      });
    }
    
  } catch (error) {
    console.error('❌ 관리자 권한 부여 실패:', error);
  }
};

// 모든 관리자 이메일에 대해 권한 확인
export const checkAdminPermissions = async () => {
  console.log('🔍 관리자 권한을 확인합니다...');
  
  const adminEmails = [
    'hankjae@db-info.co.kr',
    '6511kesuk@db-info.co.kr', 
    'jndgy@naver.com'
  ];
  
  for (const email of adminEmails) {
    try {
      // 이메일로 사용자 UID를 찾기 위해 admins 컬렉션 확인
      console.log(`📧 ${email} 권한 확인 중...`);
      
      // 실제로는 Authentication에서 UID를 찾아야 하지만
      // 여기서는 현재 로그인된 사용자만 확인
      const currentUser = auth.currentUser;
      if (currentUser && currentUser.email === email) {
        const adminDoc = await getDoc(doc(db, 'admins', currentUser.uid));
        if (adminDoc.exists()) {
          console.log(`✅ ${email}: 관리자 권한 있음`);
          console.log('   데이터:', adminDoc.data());
        } else {
          console.log(`❌ ${email}: 관리자 권한 없음`);
        }
      }
    } catch (error) {
      console.error(`❌ ${email} 권한 확인 실패:`, error);
    }
  }
};

// 브라우저 콘솔에서 사용할 수 있도록 전역 함수로 등록
if (typeof window !== 'undefined') {
  (window as any).grantAdminPermissions = grantAdminPermissions;
  (window as any).checkAdminPermissions = checkAdminPermissions;
  
  console.log('🔧 관리자 권한 도구가 준비되었습니다!');
  console.log('콘솔에서 다음 명령어를 실행하세요:');
  console.log('- grantAdminPermissions() : 현재 사용자에게 관리자 권한 부여');
  console.log('- checkAdminPermissions() : 관리자 권한 확인');
}

export default { grantAdminPermissions, checkAdminPermissions };
