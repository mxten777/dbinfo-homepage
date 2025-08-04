// Firebase 관리자 계정 비밀번호 재설정 도구
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from './firebaseConfig';

// 관리자 계정 비밀번호 재설정
export const resetAdminPassword = async (email: string) => {
  try {
    console.log(`${email} 비밀번호 재설정 이메일을 발송합니다...`);
    
    await sendPasswordResetEmail(auth, email);
    
    console.log(`✅ ${email}로 비밀번호 재설정 이메일이 발송되었습니다.`);
    console.log('📧 이메일을 확인하여 새 비밀번호를 설정하세요.');
    
    return true;
  } catch (error: any) {
    console.error(`❌ ${email} 비밀번호 재설정 실패:`, error.message);
    return false;
  }
};

// 모든 관리자 계정 비밀번호 재설정
export const resetAllAdminPasswords = async () => {
  console.log('🔐 관리자 계정 비밀번호 재설정을 시작합니다...');
  
  const adminEmails = [
    'hankjae@db-info.co.kr',
    '6511kesuk@db-info.co.kr'
  ];
  
  for (const email of adminEmails) {
    await resetAdminPassword(email);
    // 각 요청 사이에 잠시 대기
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('');
  console.log('📋 다음 단계:');
  console.log('1. 이메일을 확인하여 비밀번호 재설정 링크 클릭');
  console.log('2. 새 비밀번호를 admin1234!로 설정');
  console.log('3. 새 비밀번호로 다시 로그인');
  console.log('4. "🔐 관리자 계정 생성" 버튼으로 관리자 권한 부여');
};

// 브라우저 콘솔에서 사용할 수 있도록 전역 함수로 등록
if (typeof window !== 'undefined') {
  (window as any).resetAdminPassword = resetAdminPassword;
  (window as any).resetAllAdminPasswords = resetAllAdminPasswords;
  
  console.log('🔧 비밀번호 재설정 도구가 준비되었습니다!');
  console.log('콘솔에서 다음 명령어를 실행하세요:');
  console.log('- resetAllAdminPasswords() : 모든 관리자 비밀번호 재설정');
  console.log('- resetAdminPassword("이메일") : 특정 계정 비밀번호 재설정');
}

export default { resetAdminPassword, resetAllAdminPasswords };
