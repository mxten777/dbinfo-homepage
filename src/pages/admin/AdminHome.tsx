import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import { adminMenus } from './adminMenus';
import { db } from '../../firebaseConfig';
import { collection, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';


// 사용하지 않는 oneTimeMenus 제거

const AdminHome: React.FC = () => {

  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  // 모든 연차 데이터 삭제
  const handleClearLeaveData = async () => {
    if (!window.confirm('모든 연차 신청 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return;
    setIsDeleting(true);
    try {
      const leavesSnapshot = await getDocs(collection(db, 'leaves'));
      const deletePromises = leavesSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      alert(`총 ${leavesSnapshot.docs.length}개의 연차 신청 데이터가 삭제되었습니다.`);
    } catch (error) {
      alert('연차 데이터 삭제에 실패했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  // 모든 대리신청 데이터 삭제
  const handleClearDeputyRequestData = async () => {
    if (!window.confirm('모든 대리신청 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return;
    setIsDeleting(true);
    try {
      const deputySnapshot = await getDocs(collection(db, 'deputyRequests'));
      const deletePromises = deputySnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      alert(`총 ${deputySnapshot.docs.length}개의 대리신청 데이터가 삭제되었습니다.`);
    } catch (error) {
      alert('대리신청 데이터 삭제에 실패했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  // 모든 직원 연차정보 초기화
  const handleResetEmployeeLeaveInfo = async () => {
    if (!window.confirm('모든 직원의 연차 사용일수와 잔여연차를 초기화하시겠습니까?')) return;
    setIsDeleting(true);
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
      alert('직원 연차정보 초기화에 실패했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-2 flex flex-col items-center">
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white/80 border border-blue-100 rounded-3xl shadow-xl p-6 md:p-10 mb-10">
          <h1 className="text-3xl font-extrabold text-center text-blue-700 mb-8 tracking-wide drop-shadow">관리자 메뉴</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-8">
            {adminMenus.map(menu => {
              // 직원등록, 직원관리 메뉴만 텍스트 색상 변경
              const isEmployeeMenu = menu.label === '직원등록' || menu.label === '직원관리';
              return (
                <button
                  key={menu.label}
                  className={`flex flex-col items-center justify-center rounded-2xl shadow-md p-6 md:p-7 min-h-[140px] transition-all duration-150 ${menu.color} hover:scale-[1.04] hover:shadow-xl active:scale-100`}
                  onClick={() => navigate(menu.to)}
                >
                  <menu.icon size={36} className="mb-2 opacity-90" />
                  <div className={`mb-1 text-lg md:text-xl font-bold tracking-tight ${isEmployeeMenu ? 'text-blue-50 drop-shadow-sm' : ''}`}>{menu.label}</div>
                  <div className="text-xs md:text-sm font-normal text-white/80 mt-1">{menu.desc}</div>
                </button>
              );
            })}
          </div>
        </div>
        {/* 개발자 도구 */}
        <div className="mb-8 p-4 bg-blue-50 border border-blue-100 rounded-2xl shadow flex flex-col gap-2">
          <h3 className="text-base font-semibold text-blue-800 mb-1">개발자 도구</h3>
          <button 
            onClick={handleClearLeaveData}
            disabled={isDeleting}
            className="bg-blue-400 hover:bg-blue-500 disabled:bg-blue-200 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors"
          >
            <FaTrash size={16} />
            {isDeleting ? '삭제 중...' : '본인신청 연차정보 삭제'}
          </button>
          <button 
            onClick={handleClearDeputyRequestData}
            disabled={isDeleting}
            className="bg-cyan-400 hover:bg-cyan-500 disabled:bg-cyan-200 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors"
          >
            <FaTrash size={16} />
            {isDeleting ? '삭제 중...' : '대리신청 연차정보 삭제'}
          </button>
          <div className="text-xs text-blue-700 mt-1">⚠ 테스트용 - 모든 연차 신청 데이터가 영구 삭제됩니다</div>
          <button 
            onClick={handleResetEmployeeLeaveInfo}
            className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-bold"
          >
            모든 직원 연차정보 초기화
          </button>
          <div className="text-xs text-blue-700 mt-1">⚠ 모든 직원의 연차 사용일수와 잔여연차가 0, 총연차로 초기화됩니다</div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
