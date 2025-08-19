import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import { adminMenus } from './adminMenus';
import { db } from '../../firebaseConfig';
import { collection, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';


// 사용하지 않는 oneTimeMenus 제거

const AdminHome: React.FC = () => {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);


  const handleClearDeputyRequestData = async () => {
    if (!window.confirm('모든 대리신청 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      return;
    }
    setIsDeleting(true);
    try {
      const deputySnapshot = await getDocs(collection(db, 'deputyRequests'));
      const deletePromises = deputySnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      alert(`총 ${deputySnapshot.docs.length}개의 대리신청 데이터가 삭제되었습니다.`);
    } catch (error) {
      console.error('대리신청 데이터 삭제 실패:', error);
      alert('대리신청 데이터 삭제에 실패했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClearLeaveData = async () => {
    if (!window.confirm('모든 연차 신청 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      return;
    }
    setIsDeleting(true);
    try {
      const leavesSnapshot = await getDocs(collection(db, 'leaves'));
      const deletePromises = leavesSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      alert(`총 ${leavesSnapshot.docs.length}개의 연차 신청 데이터가 삭제되었습니다.`);
    } catch (error) {
      console.error('연차 데이터 삭제 실패:', error);
      alert('연차 데이터 삭제에 실패했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };
  // 직원 연차정보 초기화 함수
  const handleResetEmployeeLeaveInfo = async () => {
    if (!window.confirm('모든 직원의 연차 사용일수와 잔여연차를 초기화하시겠습니까?')) return;
    try {
      const employeesSnapshot = await getDocs(collection(db, 'employees'));
      let updateCount = 0;
      for (const empDoc of employeesSnapshot.docs) {
        const emp = empDoc.data();
        const total = emp.totalLeaves ?? 15;
        await updateDoc(empDoc.ref, {
          usedLeaves: 0,
          remainingLeaves: total
        });
        updateCount++;
      }
      alert(`총 ${updateCount}명의 직원 연차정보가 초기화되었습니다.`);
    } catch (error) {
      console.error('직원 연차정보 초기화 실패:', error);
      alert('직원 연차정보 초기화에 실패했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-2 flex flex-col items-center">
      <div className="w-full max-w-5xl mx-auto">
        <h1 className="text-3xl font-extrabold text-center text-blue-700 mb-8 tracking-wide">관리자 메뉴</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {adminMenus.map(menu => (
            <button key={menu.label} className={`rounded-xl shadow-lg p-8 text-white text-center font-bold text-lg ${menu.color}`} onClick={() => navigate(menu.to)}>
              <menu.icon />
              <div className="mt-2 mb-1">{menu.label}</div>
              <div className="text-xs font-normal text-white/80">{menu.desc}</div>
            </button>
          ))}
        </div>
        {/* 임시 데이터 삭제/초기화 버튼 */}
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-lg font-semibold text-red-800 mb-2">개발자 도구</h3>
          <button 
            onClick={handleClearLeaveData}
            disabled={isDeleting}
            className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors"
          >
            <FaTrash size={16} />
            {isDeleting ? '삭제 중...' : '모든 연차 데이터 삭제'}
          </button>
          <button 
            onClick={handleClearDeputyRequestData}
            disabled={isDeleting}
            className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors mt-2"
          >
            <FaTrash size={16} />
            {isDeleting ? '삭제 중...' : '모든 대리신청 데이터 삭제'}
          </button>
          <p className="text-sm text-red-600 mt-1">⚠️ 테스트용 - 모든 연차 신청 데이터가 영구 삭제됩니다</p>

          {/* 직원 연차정보 초기화 버튼 */}
          <button
            onClick={handleResetEmployeeLeaveInfo}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 mt-4 transition-colors"
          >
            모든 직원 연차정보 초기화
          </button>
          <p className="text-sm text-blue-600 mt-1">⚠️ 모든 직원의 연차 사용일수와 잔여연차가 0, 총연차로 초기화됩니다</p>


        </div>
        <button className="bg-gray-200 px-6 py-2 rounded-full shadow text-lg font-semibold hover:bg-gray-300" onClick={() => navigate('/')}>홈으로</button>
      </div>
    </div>
  );
};

export default AdminHome;
