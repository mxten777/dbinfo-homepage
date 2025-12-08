/**
 * Firebase 관리자 계정 생성 스크립트
 * 
 * 사용법:
 * node scripts/create-admin.js <email> <password>
 * 
 * 예시:
 * node scripts/create-admin.js hankjae@db-info.co.kr admin1234
 */

import admin from 'firebase-admin';
import serviceAccount from '../serviceAccountKey.json' assert { type: 'json' };

// Firebase Admin SDK 초기화
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const auth = admin.auth();

async function createAdminUser(email, password) {
  try {
    console.log(`\n🔄 관리자 계정 생성 중: ${email}`);
    
    // 1. Firebase Authentication에 사용자 생성
    let user;
    try {
      user = await auth.createUser({
        email: email,
        password: password,
        emailVerified: true,
        displayName: 'DB.INFO Admin'
      });
      console.log('✅ Firebase Auth 사용자 생성 완료:', user.uid);
    } catch (error) {
      if (error.code === 'auth/email-already-exists') {
        console.log('⚠️  이미 존재하는 이메일입니다. 기존 사용자 정보 가져오는 중...');
        user = await auth.getUserByEmail(email);
        console.log('✅ 기존 사용자 UID:', user.uid);
      } else {
        throw error;
      }
    }
    
    // 2. Firestore에 관리자 권한 추가
    await db.collection('admins').doc(user.uid).set({
      email: email,
      isAdmin: true,
      role: 'super_admin',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      displayName: 'DB.INFO Admin',
      permissions: ['all']
    });
    console.log('✅ Firestore 관리자 권한 설정 완료');
    
    // 3. Custom Claims 설정 (선택사항)
    await auth.setCustomUserClaims(user.uid, { admin: true, role: 'super_admin' });
    console.log('✅ Custom Claims 설정 완료');
    
    console.log('\n🎉 관리자 계정 생성 완료!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📧 이메일: ${email}`);
    console.log(`🔑 비밀번호: ${password}`);
    console.log(`👤 UID: ${user.uid}`);
    console.log(`🔐 권한: super_admin`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('이제 관리자 로그인 페이지에서 로그인할 수 있습니다.');
    console.log('URL: http://localhost:3000/admin/login\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// 명령줄 인자 확인
const args = process.argv.slice(2);
if (args.length < 2) {
  console.error('❌ 사용법: node scripts/create-admin.js <email> <password>');
  console.error('예시: node scripts/create-admin.js hankjae@db-info.co.kr admin1234');
  process.exit(1);
}

const [email, password] = args;

// 이메일 유효성 검사
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  console.error('❌ 올바른 이메일 형식이 아닙니다.');
  process.exit(1);
}

// 비밀번호 유효성 검사
if (password.length < 6) {
  console.error('❌ 비밀번호는 최소 6자 이상이어야 합니다.');
  process.exit(1);
}

// 관리자 생성 실행
createAdminUser(email, password);
