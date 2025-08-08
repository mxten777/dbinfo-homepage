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
  const [isFixing, setIsFixing] = useState(false);

  // 연차 employeeId를 직원 uid로 일괄 정리하는 함수
  const handleFixLeaveEmployeeIds = async () => {
    if (!window.confirm('모든 연차 데이터의 employeeId를 직원 uid로 일괄 정리하시겠습니까?')) return;
    setIsFixing(true);
    try {
      // 직원 데이터 가져오기
      const employeesSnapshot = await getDocs(collection(db, 'employees'));
      const employeesData = employeesSnapshot.docs.map(doc => ({
        id: doc.id,
        uid: doc.data().uid,
        name: doc.data().name,
        email: doc.data().email,
      }));

      // leaves 데이터 가져오기
      const leavesSnapshot = await getDocs(collection(db, 'leaves'));
      let updateCount = 0;

      for (const leaveDoc of leavesSnapshot.docs) {
        const leave = leaveDoc.data();
        // employeeId가 직원 uid가 아닌 경우만 처리
        const emp = employeesData.find(e =>
          e.id === leave.employeeId ||
          e.email === leave.employeeId ||
          e.name === leave.employeeName ||
          e.name === leave.name
        );
        if (emp && leave.employeeId !== emp.uid && emp.uid) {
          await updateDoc(leaveDoc.ref, { employeeId: emp.uid });
          updateCount++;
        }
      }

      alert(`총 ${updateCount}건의 연차 데이터 employeeId가 직원 uid로 정리되었습니다.`);
    } catch (error) {
      console.error('일괄 정리 실패:', error);
      alert('일괄 정리에 실패했습니다.');
    } finally {
      setIsFixing(false);
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
        
        {/* 임시 데이터 삭제 버튼 */}
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
          <p className="text-sm text-red-600 mt-1">⚠️ 테스트용 - 모든 연차 신청 데이터가 영구 삭제됩니다</p>

           {/* employeeId 일괄 uid 정리 버튼 */}
           <button
             onClick={handleFixLeaveEmployeeIds}
             disabled={isFixing}
             className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white px-4 py-2 rounded flex items-center gap-2 mt-4 transition-colors"
           >
             {isFixing ? '정리 중...' : '연차 employeeId 일괄 uid 정리'}
           </button>
           <p className="text-sm text-orange-600 mt-1">⚠️ 모든 연차 데이터의 employeeId를 직원 uid로 자동 정리합니다</p>
        </div>
        
        <button className="bg-gray-200 px-6 py-2 rounded-full shadow text-lg font-semibold hover:bg-gray-300" onClick={() => navigate('/')}>홈으로</button>
      </div>
    </div>
  );
};

export default AdminHome;
