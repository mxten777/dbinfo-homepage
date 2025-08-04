// Firebase 사용자 관리 유틸리티
import { auth, db } from './firebaseConfig';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile 
} from 'firebase/auth';
import { doc, setDoc, collection, getDocs } from 'firebase/firestore';

// 현재 등록된 모든 직원 조회
export const getAllEmployees = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'employees'));
    const employees = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    console.log('등록된 직원 목록:', employees);
    return employees;
  } catch (error) {
    console.error('직원 조회 실패:', error);
    return [];
  }
};

// 관리자 계정 생성 (개발용)
export const createAdminAccount = async (email: string, password: string, name: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // 프로필 업데이트
    await updateProfile(user, { displayName: name });
    
    // Firestore에 관리자 정보 저장 (선택사항)
    await setDoc(doc(db, 'admins', user.uid), {
      email,
      name,
      role: 'admin',
      createdAt: new Date().toISOString()
    });
    
    console.log('관리자 계정 생성 완료:', email);
    return user;
  } catch (error) {
    console.error('관리자 계정 생성 실패:', error);
    throw error;
  }
};

// 직원 계정 생성 (개발용)
export const createEmployeeAccount = async (
  email: string, 
  password: string, 
  name: string, 
  empNo: string
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // 프로필 업데이트
    await updateProfile(user, { displayName: name });
    
    // Firestore에 직원 정보 저장
    await setDoc(doc(db, 'employees', user.uid), {
      empNo,
      name,
      email,
      totalLeaves: 15,
      carryOverLeaves: 0,
      annualLeaves: 15,
      usedLeaves: 0,
      remainingLeaves: 15,
      createdAt: new Date().toISOString()
    });
    
    console.log('직원 계정 생성 완료:', email);
    return user;
  } catch (error) {
    console.error('직원 계정 생성 실패:', error);
    throw error;
  }
};

// 테스트 로그인
export const testLogin = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('로그인 성공:', userCredential.user.email);
    return userCredential.user;
  } catch (error) {
    console.error('로그인 실패:', error);
    throw error;
  }
};
