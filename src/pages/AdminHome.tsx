import React, { useState } from 'react';
// 자동 일괄 보정용 Firebase Admin REST API 활용
// import { getDocs, collection, updateDoc, doc } from 'firebase/firestore';
// import { db } from '../firebaseConfig';
// 이미 import된 firebase/firestore 함수 및 db는 중복 import하지 않음
import { useAuth } from '../AuthContext';
import { uploadUniqueEmployees, clearEmployees, clearLeaves } from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { getCurrentAdmins, getCurrentEmployees } from '../checkUsers';
import { createAdminAccounts } from '../createAdminAccounts';
import { resetAllAdminPasswords } from '../resetAdminPassword';
import { resetAdminSystem, createFreshAdminAccounts } from '../resetAdminSystem';

const AdminHome: React.FC = () => {
  // 자동 일괄 보정 함수 (REST API 활용 예시)
  // 실제 REST API가 없으므로, 아래 코드는 예시로만 남겨둡니다.
  // const handleAutoFixEmployeeUids = async () => {
  //   ...자동 일괄 보정 로직...
  // };
  // 직원 UID 일괄 보정 함수
  // 직원 UID 일괄 보정 함수는 서버 구현 필요. 프론트엔드에서는 전체 사용자 목록을 직접 가져올 수 없습니다.
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [uploadMessage, setUploadMessage] = useState('');
  const [userStatusMessage, setUserStatusMessage] = useState('');

  // 사용자 현황 확인 함수
  const checkUserStatus = async () => {
    try {
      setUserStatusMessage('사용자 현황을 조회하고 있습니다...');
      
      const admins = await getCurrentAdmins();
      const employees = await getCurrentEmployees();
      
      const statusText = `
📊 현재 시스템 사용자 현황:
👨‍💼 관리자: ${admins.length}명
👥 직원: ${employees.length}명
🏢 전체: ${admins.length + employees.length}명

상세 정보는 브라우저 콘솔(F12)에서 확인하세요.
      `;
      
      setUserStatusMessage(statusText);
      
      // 콘솔에 상세 정보 출력
      console.log('=== 📋 관리자 리스트 ===');
      admins.forEach((admin: any, index: number) => {
        console.log(`${index + 1}. 👨‍💼 ${admin.name} (${admin.email})`);
      });
      
      console.log('=== 👥 직원 리스트 ===');
      employees.forEach((emp: any, index: number) => {
        console.log(`${index + 1}. 👤 ${emp.name} (${emp.email}) - 사번: ${emp.empNo}`);
      });
      
    } catch (error) {
      console.error('사용자 현황 조회 실패:', error);
      setUserStatusMessage('❌ 사용자 현황 조회에 실패했습니다.');
    }
  };

  // 관리자 계정 생성 함수
  const handleCreateAdmins = async () => {
    try {
      setUserStatusMessage('관리자 계정을 생성하고 있습니다...');
      await createAdminAccounts();
      setUserStatusMessage(`✅ 관리자 계정 처리가 완료되었습니다!

📋 설정된 관리자 계정:
👨‍💼 한규재: hankjae@db-info.co.kr / admin1234!
👩‍💼 김애숙: 6511kesuk@db-info.co.kr / admin1234!

ℹ️ 현재 로그인된 계정에 관리자 권한이 부여됩니다.
💡 다른 관리자 계정의 경우 해당 계정으로 로그인 후 다시 실행하세요.
자세한 내용은 브라우저 콘솔(F12)을 확인하세요.`);
    } catch (error: any) {
      console.error('관리자 계정 처리 실패:', error);
      setUserStatusMessage(`❌ 관리자 계정 처리에 실패했습니다.

오류: ${error.message}

💡 해결 방법:
1. 현재 로그인된 계정이 관리자 이메일과 일치하는지 확인
2. Firebase 콘솔에서 기존 계정의 비밀번호 확인
3. 올바른 관리자 계정으로 로그인 후 다시 시도
4. 브라우저 콘솔(F12)에서 상세 오류 확인`);
    }
  };

  // 현재 로그인 사용자 확인 함수
  const checkCurrentUser = () => {
    const { user } = useAuth();
    if (user) {
      setUserStatusMessage(`👤 현재 로그인된 사용자:
이메일: ${user.email}
이름: ${user.displayName || 'N/A'}
UID: ${user.uid}

📝 관리자 권한을 부여하려면:
1. 위 이메일이 관리자 이메일(hankjae@db-info.co.kr 또는 6511kesuk@db-info.co.kr)과 일치하는지 확인
2. 일치한다면 "🔐 관리자 계정 생성" 버튼 클릭`);
    } else {
      setUserStatusMessage('❌ 로그인된 사용자가 없습니다.');
    }
  };

  // 관리자 비밀번호 재설정 함수
  const handleResetPasswords = async () => {
    try {
      setUserStatusMessage('관리자 계정 비밀번호 재설정 이메일을 발송하고 있습니다...');
      await resetAllAdminPasswords();
      setUserStatusMessage(`📧 비밀번호 재설정 이메일이 발송되었습니다!

📋 발송된 계정:
👨‍💼 한규재: hankjae@db-info.co.kr
👩‍💼 김애숙: 6511kesuk@db-info.co.kr

📝 다음 단계:
1. 📧 이메일을 확인하여 비밀번호 재설정 링크 클릭
2. 🔑 새 비밀번호를 admin1234!로 설정
3. 🚪 새 비밀번호로 다시 로그인
4. 🔐 "관리자 계정 생성" 버튼으로 관리자 권한 부여

⚠️ 이메일이 스팸함에 있을 수 있으니 확인해주세요.`);
    } catch (error: any) {
      console.error('비밀번호 재설정 실패:', error);
      setUserStatusMessage(`❌ 비밀번호 재설정에 실패했습니다.

오류: ${error.message}

💡 대안:
1. Firebase 콘솔에서 직접 비밀번호 재설정
2. 브라우저 콘솔에서 resetAllAdminPasswords() 실행`);
    }
  };
  // 관리자 시스템 완전 초기화 함수
  const handleResetAdminSystem = async () => {
    const confirmReset = window.confirm(`⚠️ 관리자 시스템 완전 초기화

이 작업은 다음을 수행합니다:
✅ 모든 관리자 데이터 삭제 (Firestore)
✅ 새로운 관리자 계정 생성 시도
⚠️ Firebase Auth 계정은 수동 삭제 필요

정말로 진행하시겠습니까?`);
    
    if (!confirmReset) return;
    
    try {
      setUserStatusMessage('🔄 관리자 시스템을 완전히 초기화하고 있습니다...');
      await resetAdminSystem();
      setUserStatusMessage(`🎉 관리자 시스템 초기화 완료!

📋 수행된 작업:
✅ 기존 관리자 데이터 삭제 (Firestore)
🔄 새로운 관리자 계정 생성 시도

📝 다음 단계 (중요!):
1. 🌐 Firebase 콘솔 (https://console.firebase.google.com) 접속
2. 🔐 Authentication → 사용자 탭 이동
3. 🗑️ 기존 관리자 계정들 수동 삭제:
   - hankjae@db-info.co.kr
   - 6511kesuk@db-info.co.kr
4. 🔄 "✨ 새 관리자 계정 생성" 버튼 클릭
5. 🚪 새 계정으로 로그인 테스트

💡 자세한 내용은 브라우저 콘솔(F12)을 확인하세요.`);
    } catch (error: any) {
      console.error('시스템 초기화 실패:', error);
      setUserStatusMessage(`❌ 시스템 초기화에 실패했습니다.

오류: ${error.message}

💡 대안:
1. 브라우저 콘솔에서 resetAdminSystem() 직접 실행
2. Firebase 콘솔에서 수동으로 계정 삭제 후 재시도`);
    }
  };

  // 새 관리자 계정만 생성하는 함수
  const handleCreateFreshAdmins = async () => {
    try {
      setUserStatusMessage('✨ 새로운 관리자 계정을 생성하고 있습니다...');
      await createFreshAdminAccounts();
      setUserStatusMessage(`✅ 새 관리자 계정 생성 완료!

📋 생성된 계정:
👨‍💼 한규재: hankjae@db-info.co.kr / admin1234!
👩‍💼 김애숙: 6511kesuk@db-info.co.kr / admin1234!

📝 다음 단계:
1. 🚪 위 계정으로 로그인 시도
2. ✅ 로그인 성공 시 관리자 권한 자동 부여
3. ❌ 로그인 실패 시 "🔧 비밀번호 재설정" 클릭

💡 자세한 내용은 브라우저 콘솔(F12)을 확인하세요.`);
    } catch (error: any) {
      console.error('새 관리자 계정 생성 실패:', error);
      setUserStatusMessage(`❌ 새 관리자 계정 생성에 실패했습니다.

오류: ${error.message}

💡 해결 방법:
1. Firebase 콘솔에서 기존 계정이 완전히 삭제되었는지 확인
2. 브라우저 콘솔에서 createFreshAdminAccounts() 직접 실행`);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-8 text-center">관리자 메뉴</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {/* 직원 UID 자동 일괄 보정 버튼 (REST API 구현 필요, 현재는 비활성화) */}
        {/* 직원 UID 일괄 보정 버튼 제거 (함수 미구현) */}
        {/* 직원정보등록 */}
        <div className="bg-gradient-to-br from-cyan-500 to-cyan-300 shadow-lg rounded-xl p-6 flex flex-col items-center hover:scale-105 transition-transform cursor-pointer" onClick={() => navigate('/admin-employee-manage')}>
          <span className="text-white text-xl font-bold mb-2">직원정보 등록</span>
          <span className="text-white/80 text-sm">직원정보 등록, 수정, 삭제</span>
        </div>
        {/* 연차관리 */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-300 shadow-lg rounded-xl p-6 flex flex-col items-center hover:scale-105 transition-transform cursor-pointer" onClick={() => navigate('/leaves')}>
          <span className="text-white text-xl font-bold mb-2">연차관리</span>
          <span className="text-white/80 text-sm">직원 연차 신청 및 승인/반려 관리</span>
        </div>
        {/* 프로젝트관리 */}
        <div className="bg-gradient-to-br from-green-500 to-green-300 shadow-lg rounded-xl p-6 flex flex-col items-center hover:scale-105 transition-transform cursor-pointer" onClick={() => navigate('/projects')}>
          <span className="text-white text-xl font-bold mb-2">프로젝트 관리</span>
          <span className="text-white/80 text-sm">프로젝트 등록, 수정, 삭제, 조회</span>
        </div>
        {/* 직원연차정보수정 */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-300 shadow-lg rounded-xl p-6 flex flex-col items-center hover:scale-105 transition-transform cursor-pointer" onClick={() => navigate('/admin-employee-edit')}>
          <span className="text-white text-xl font-bold mb-2">직원연차정보 수정</span>
          <span className="text-white/80 text-sm">직원 사번, 이름, 연차정보 수정</span>
        </div>
        {/* 직원정보초기화 */}
        <button
          onClick={() => clearEmployees(setUploadMessage)}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl p-6 flex flex-col items-center shadow-lg transition-transform hover:scale-105"
        >
          <span className="text-xl font-bold mb-2">직원정보 초기화</span>
          <span className="text-white/80 text-sm">직원정보 전체 삭제</span>
        </button>
        {/* 직원정보업로드 */}
        <button
          onClick={() => uploadUniqueEmployees(setUploadMessage)}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl p-6 flex flex-col items-center shadow-lg transition-transform hover:scale-105"
        >
          <span className="text-xl font-bold mb-2">직원정보 업로드</span>
          <span className="text-white/80 text-sm">샘플 직원정보 일괄 업로드</span>
        </button>
        {/* 연차기록초기화 */}
        <button
          onClick={() => clearLeaves(setUploadMessage)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-xl p-6 flex flex-col items-center shadow-lg transition-transform hover:scale-105"
        >
          <span className="text-xl font-bold mb-2">연차기록 초기화</span>
          <span className="text-white/80 text-sm">연차기록 전체 삭제</span>
        </button>

        {/* 사용자 현황 확인 */}
        <button
          onClick={checkUserStatus}
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl p-6 flex flex-col items-center shadow-lg transition-transform hover:scale-105"
        >
          <span className="text-xl font-bold mb-2">👥 사용자 현황</span>
          <span className="text-white/80 text-sm">관리자/직원 현황 조회</span>
        </button>

        {/* 관리자 계정 생성 */}
        <button
          onClick={handleCreateAdmins}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl p-6 flex flex-col items-center shadow-lg transition-transform hover:scale-105"
        >
          <span className="text-xl font-bold mb-2">🔐 관리자 계정 생성</span>
          <span className="text-white/80 text-sm">정식 관리자 계정 생성</span>
        </button>

        {/* 현재 사용자 확인 */}
        <button
          onClick={checkCurrentUser}
          className="bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-xl p-6 flex flex-col items-center shadow-lg transition-transform hover:scale-105"
        >
          <span className="text-xl font-bold mb-2">👤 현재 사용자</span>
          <span className="text-white/80 text-sm">로그인된 사용자 정보 확인</span>
        </button>

        {/* 비밀번호 재설정 */}
        <button
          onClick={handleResetPasswords}
          className="bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-xl p-6 flex flex-col items-center shadow-lg transition-transform hover:scale-105"
        >
          <span className="text-xl font-bold mb-2">🔧 비밀번호 재설정</span>
          <span className="text-white/80 text-sm">관리자 계정 비밀번호 재설정</span>
        </button>

        {/* 관리자 시스템 완전 초기화 */}
        <button
          onClick={handleResetAdminSystem}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl p-6 flex flex-col items-center shadow-lg transition-transform hover:scale-105"
        >
          <span className="text-xl font-bold mb-2">🔄 관리자 시스템 초기화</span>
          <span className="text-white/80 text-sm">관리자 완전 삭제 후 재생성</span>
        </button>

        {/* 새 관리자 계정 생성 */}
        <button
          onClick={handleCreateFreshAdmins}
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl p-6 flex flex-col items-center shadow-lg transition-transform hover:scale-105"
        >
          <span className="text-xl font-bold mb-2">✨ 새 관리자 계정 생성</span>
          <span className="text-white/80 text-sm">깨끗한 새 관리자 계정 생성</span>
        </button>
      </div>

      {uploadMessage && <div className="text-center text-green-600 font-semibold mb-4">{uploadMessage}</div>}
      {userStatusMessage && (
        <div className="text-center bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <pre className="text-sm text-blue-800 whitespace-pre-line">{userStatusMessage}</pre>
        </div>
      )}
      <div className="flex justify-center">
        <button
          className="px-6 py-2 bg-gray-300 text-gray-800 rounded-full shadow hover:bg-gray-400 font-semibold transition"
          onClick={async () => {
            await logout();
            navigate('/');
          }}
        >
          홈으로
        </button>
      </div>
    </div>
  );
};

export default AdminHome;
