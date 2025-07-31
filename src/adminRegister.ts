// 관리자 계정 등록 스크립트 (1회 실행용)
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseConfig';

async function registerAdmin() {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, 'west@naver.com', '123456');
    console.log('관리자 계정 등록 성공:', userCredential.user);
  } catch (error: any) {
    console.error('관리자 계정 등록 실패:', error.message);
  }
}

registerAdmin();
