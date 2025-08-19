import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import type { Employee, Leave } from '../types/employee';

const AdminEmployeeManage: React.FC = () => {
  // 관리자 권한 상태 저장
  const [adminMap, setAdminMap] = useState<{ [uid: string]: boolean }>({});
  // 진입 확인용 테스트
  console.log('AdminEmployeeManage 컴포넌트 진입!');
  // 화면 최상단에 테스트용 텍스트와 버튼 추가
  const testAlert = () => alert('직원관리 화면입니다! (경로 진입 확인)');
  const [message, setMessage] = useState('');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetResult, setResetResult] = useState<string>('');
  const [editEmp, setEditEmp] = useState<Employee | null>(null); // 수정 모달용
  const [editLoading, setEditLoading] = useState(false);
  const navigate = useNavigate();

  // 직원 삭제 핸들러
  const handleDelete = async (id: string) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    await deleteDoc(doc(db, 'employees', String(id)));
    setEmployees((prev: Employee[]) => prev.filter(e => e.id !== id));
    setMessage('삭제되었습니다.');
    setTimeout(() => setMessage(''), 2000);
  };

  // 직원 정보 수정 핸들러
  const handleEditSave = async () => {
    if (!editEmp) return;
    setEditLoading(true);
    try {
      await updateDoc(doc(db, 'employees', String(editEmp.id)), {
        empNo: editEmp.empNo,
        regNo: editEmp.regNo,
        gender: editEmp.gender,
        joinDate: editEmp.joinDate,
        name: editEmp.name,
        department: editEmp.department,
        position: editEmp.position,
        phone: editEmp.phone,
        email: editEmp.email,
        jobType: editEmp.jobType,
        // 필요한 필드 추가
      });
      setEmployees((prev) => prev.map(e => e.id === editEmp.id ? { ...e, ...editEmp } : e));
      setMessage('수정 완료!');
      setEditEmp(null);
    } catch {
      setMessage('수정 실패: 다시 시도해 주세요.');
    }
    setEditLoading(false);
    setTimeout(() => setMessage(''), 2000);
  };

  // 연차 승인/반려 핸들러
  const handleLeaveApproval = async (leave: Leave, status: '승인' | '반려') => {
    try {
      const now = Date.now();
      await updateDoc(doc(db, 'leaves', String(leave.id)), { status, updatedAt: now });
      if (status === '승인') {
        const emp = employees.find(e => e.id === leave.employeeId || e.name === leave.employeeName);
        if (emp) {
          const used = Number(emp.usedLeaves ?? 0) + Number(leave.days ?? 0);
          const remain = Number(emp.remainingLeaves ?? 0) - Number(leave.days ?? 0);
          await updateDoc(doc(db, 'employees', String(emp.id)), { usedLeaves: used, remainingLeaves: remain });
          setEmployees((prev: Employee[]) => prev.map(e => e.id === emp.id ? { ...e, usedLeaves: used, remainingLeaves: remain } : e));
        }
      }
      setLeaves((prev: Leave[]) => prev.map(l => l.id === leave.id ? { ...l, status, updatedAt: now } : l));
      setMessage(`연차 ${status} 처리 완료`);
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      setMessage('처리 실패: 다시 시도해 주세요.');
      setTimeout(() => setMessage(''), 2000);
    }
  };

  // 연차 기록 초기화
  const handleResetLeaves = async () => {
    setResetLoading(true);
    let success = 0, fail = 0;
    for (const emp of employees) {
      try {
        await updateDoc(doc(db, 'employees', String(emp.id)), {
          usedLeaves: 0,
          remainingLeaves: (Number(emp.carryOverLeaves) || 0) + (Number(emp.annualLeaves) || 0)
        });
        success++;
      } catch {
        fail++;
      }
    }
    setResetResult(`초기화 완료: ${success}명 성공, ${fail}명 실패`);
    setResetLoading(false);
    setTimeout(() => setResetResult(''), 3000);
    setShowResetModal(false);
    // 최신 데이터 반영
    const empSnap = await getDocs(collection(db, 'employees'));
    setEmployees(empSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Employee)));
  };

  useEffect(() => {
    const fetchData = async () => {
      const empSnap = await getDocs(collection(db, 'employees'));
      setEmployees(empSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Employee)));
      const leaveSnap = await getDocs(collection(db, 'leaves'));
      const deputySnap = await getDocs(collection(db, 'deputyRequests'));
      const leavesData = leaveSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Leave));
      const deputyData = deputySnap.docs.map(doc => ({ id: doc.id, ...doc.data(), isAdminRequest: true } as Leave));
      setLeaves([...leavesData, ...deputyData]);

      // 관리자 권한 정보 불러오기
      const adminsSnap = await getDocs(collection(db, 'admins'));
      const adminMapObj: { [uid: string]: boolean } = {};
      adminsSnap.docs.forEach(doc => {
        const data = doc.data();
        if (data.isAdmin) adminMapObj[doc.id] = true;
      });
      setAdminMap(adminMapObj);
    };
    fetchData();
  }, []);

  // 관리자 권한 부여/해제 핸들러 (useEffect 바깥으로 이동)
  const handleAdminToggle = async (emp: Employee) => {
    if (!emp.uid) {
      setMessage('UID가 없는 직원입니다.');
      return;
    }
    const adminDocRef = doc(db, 'admins', emp.uid);
    const isAdmin = !!adminMap[emp.uid];
    try {
      if (isAdmin) {
        // 권한 해제
        await setDoc(adminDocRef, { isAdmin: false });
        setAdminMap(prev => ({ ...prev, [emp.uid!]: false }));
        setMessage(`${emp.name}님 관리자 권한 해제됨`);
      } else {
        // 권한 부여
        await setDoc(adminDocRef, { isAdmin: true });
        setAdminMap(prev => ({ ...prev, [emp.uid!]: true }));
        setMessage(`${emp.name}님 관리자 권한 부여됨`);
      }
    } catch (e) {
      setMessage('권한 변경 실패: 다시 시도해 주세요.');
    }
    setTimeout(() => setMessage(''), 2000);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto flex flex-col gap-8">
      {/* 직원 정보 수정 모달 */}
      {editEmp && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 border-2 border-blue-300 flex flex-col gap-4 min-w-[320px] max-w-[95vw] max-h-[90vh] overflow-y-auto">
            <div className="text-xl font-bold text-blue-700 mb-2">직원 정보 수정</div>
            <label className="font-semibold">사번</label>
            <input className="border rounded px-3 py-2 mb-2" value={editEmp.empNo ?? ''} onChange={e => setEditEmp({ ...editEmp, empNo: e.target.value })} />
            <label className="font-semibold">주민번호</label>
            <input className="border rounded px-3 py-2 mb-2" value={editEmp.regNo ?? ''} onChange={e => setEditEmp({ ...editEmp, regNo: e.target.value })} />
            <label className="font-semibold">성별</label>
            <input className="border rounded px-3 py-2 mb-2" value={editEmp.gender ?? ''} onChange={e => setEditEmp({ ...editEmp, gender: e.target.value })} />
            <label className="font-semibold">입사일</label>
            <input className="border rounded px-3 py-2 mb-2" value={editEmp.joinDate ?? ''} onChange={e => setEditEmp({ ...editEmp, joinDate: e.target.value })} />
            <label className="font-semibold">이름</label>
            <input className="border rounded px-3 py-2 mb-2" value={editEmp.name ?? ''} onChange={e => setEditEmp({ ...editEmp, name: e.target.value })} />
            <label className="font-semibold">부서</label>
            <input className="border rounded px-3 py-2 mb-2" value={editEmp.department ?? ''} onChange={e => setEditEmp({ ...editEmp, department: e.target.value })} />
            <label className="font-semibold">직급</label>
            <input className="border rounded px-3 py-2 mb-2" value={editEmp.position ?? ''} onChange={e => setEditEmp({ ...editEmp, position: e.target.value })} />
            <label className="font-semibold">전화번호</label>
            <input className="border rounded px-3 py-2 mb-2" value={editEmp.phone ?? ''} onChange={e => setEditEmp({ ...editEmp, phone: e.target.value })} />
            <label className="font-semibold">이메일</label>
            <input className="border rounded px-3 py-2 mb-2" value={editEmp.email ?? ''} onChange={e => setEditEmp({ ...editEmp, email: e.target.value })} />
            <label className="font-semibold">직종</label>
            <input className="border rounded px-3 py-2 mb-2" value={editEmp.jobType ?? ''} onChange={e => setEditEmp({ ...editEmp, jobType: e.target.value })} />
            <div className="flex gap-4 mt-4">
              <button className="px-6 py-2 bg-blue-600 text-white rounded-full font-bold shadow hover:bg-blue-700 transition" onClick={handleEditSave} disabled={editLoading}>{editLoading ? '저장 중...' : '저장'}</button>
              <button className="px-6 py-2 bg-gray-300 text-gray-700 rounded-full font-bold shadow hover:bg-gray-400 transition" onClick={() => setEditEmp(null)}>취소</button>
            </div>
          </div>
        </div>
      )}
      {/* 진입 확인용 테스트 영역 */}
      <div className="mb-4 p-4 bg-yellow-100 border-2 border-yellow-400 rounded-xl flex flex-col items-center">
        <h2 className="text-xl font-bold text-yellow-700 mb-2">직원관리 화면 진입 확인용</h2>
        <button className="px-4 py-2 bg-yellow-400 text-white rounded-full font-bold shadow hover:bg-yellow-500 transition" onClick={testAlert}>
          테스트 버튼 (클릭 시 alert)
        </button>
      </div>
      {/* 메시지 출력 */}
      {message && (
        <div className="mb-4 text-center text-lg font-bold text-blue-700 bg-blue-100 rounded-xl py-2 shadow">{message}</div>
      )}
      {/* 연차 기록 초기화 버튼 및 결과 */}
      <div className="flex gap-4 items-center mb-4">
        <button className="px-6 py-2 bg-green-600 text-white rounded-full font-bold shadow hover:bg-green-700 transition" onClick={()=>setShowResetModal(true)}>연차 기록 전체 초기화</button>
        {resetLoading && <span className="text-green-700 font-bold">초기화 중...</span>}
        {resetResult && <span className="text-green-700 font-bold">{resetResult}</span>}
      </div>
      {/* 초기화 모달 */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 border-2 border-green-300 flex flex-col gap-4">
            <div className="text-xl font-bold text-green-700">모든 직원의 연차 기록을 초기화하시겠습니까?</div>
            <div className="flex gap-4 mt-4">
              <button className="px-6 py-2 bg-green-600 text-white rounded-full font-bold shadow hover:bg-green-700 transition" onClick={handleResetLeaves}>확인</button>
              <button className="px-6 py-2 bg-gray-300 text-gray-700 rounded-full font-bold shadow hover:bg-gray-400 transition" onClick={()=>setShowResetModal(false)}>취소</button>
            </div>
          </div>
        </div>
      )}
      {/* 직원 테이블 */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <table className="min-w-full text-sm text-left">
          <thead>
            <tr>
              <th className="border px-2 py-2 whitespace-nowrap">사번</th>
              <th className="border px-2 py-2 whitespace-nowrap">이름</th>
              <th className="border px-2 py-2 whitespace-nowrap">주민번호</th>
              <th className="border px-2 py-2 whitespace-nowrap">성별</th>
              <th className="border px-2 py-2 whitespace-nowrap">직급</th>
              <th className="border px-2 py-2 whitespace-nowrap">부서</th>
              <th className="border px-2 py-2 whitespace-nowrap">직종</th>
              <th className="border px-2 py-2 whitespace-nowrap">입사일</th>
              <th className="border px-2 py-2 whitespace-nowrap">이월연차</th>
              <th className="border px-2 py-2 whitespace-nowrap">연차</th>
              <th className="border px-2 py-2 whitespace-nowrap">총연차</th>
              <th className="border px-2 py-2 whitespace-nowrap">사용연차</th>
              <th className="border px-2 py-2 whitespace-nowrap">잔여연차</th>
              <th className="border px-2 py-2 whitespace-nowrap">이메일</th>
              <th className="border px-2 py-2 whitespace-nowrap">전화번호</th>
              <th className="border px-2 py-2 whitespace-nowrap">권한</th>
              <th className="border px-2 py-2 whitespace-nowrap">UID</th>
              <th className="border px-2 py-2 whitespace-nowrap">삭제</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, idx) => (
              <tr key={emp.id} className={idx % 2 === 0 ? 'bg-gray-50 hover:bg-blue-50 transition' : 'bg-white hover:bg-blue-50 transition'}>
                <td className="border px-2 py-2 whitespace-nowrap">{emp.empNo}</td>
                <td className="border px-2 py-2 whitespace-nowrap">{emp.name}</td>
                <td className="border px-2 py-2 whitespace-nowrap">{emp.regNo || '-'}</td>
                <td className="border px-2 py-2 whitespace-nowrap">{emp.gender || '-'}</td>
                <td className="border px-2 py-2 whitespace-nowrap">{emp.position || '-'}</td>
                <td className="border px-2 py-2 whitespace-nowrap">{emp.department || '-'}</td>
                <td className="border px-2 py-2 whitespace-nowrap">{emp.jobType || '-'}</td>
                <td className="border px-2 py-2 whitespace-nowrap">{emp.joinDate || '-'}</td>
                <td className="border px-2 py-2 whitespace-nowrap">{emp.carryOverLeaves ?? '-'}</td>
                <td className="border px-2 py-2 whitespace-nowrap">{emp.annualLeaves ?? '-'}</td>
                <td className="border px-2 py-2 whitespace-nowrap">{(Number(emp.carryOverLeaves) || 0) + (Number(emp.annualLeaves) || 0)}</td>
                <td className="border px-2 py-2 whitespace-nowrap">{emp.usedLeaves ?? '-'}</td>
                <td className="border px-2 py-2 whitespace-nowrap">{emp.remainingLeaves ?? '-'}</td>
                <td className="border px-2 py-2 whitespace-nowrap">{emp.email || '-'}</td>
                <td className="border px-2 py-2 whitespace-nowrap">{emp.phone || '-'}</td>
                <td className="border px-2 py-2 whitespace-nowrap">
                  <div className="flex items-center justify-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${adminMap[emp.uid!] ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>{adminMap[emp.uid!] ? '관리자' : '일반직원'}</span>
                    <button
                      className={`px-3 py-1 rounded text-xs font-bold shadow-sm border ${adminMap[emp.uid!] ? 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200' : 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200'} transition`}
                      style={{ minWidth: '72px' }}
                      onClick={() => handleAdminToggle(emp)}
                    >
                      {adminMap[emp.uid!] ? '권한 해제' : '권한 부여'}
                    </button>
                  </div>
                </td>
                <td className="border px-2 py-2 whitespace-nowrap">{emp.uid || '-'}</td>
                <td className="border px-2 py-2 whitespace-nowrap text-center flex gap-1">
                  <button onClick={() => handleDelete(emp.id!)} className="px-2 py-1 md:px-3 md:py-1 bg-red-500 text-white rounded-lg font-bold shadow hover:bg-red-600 transition text-xs md:text-sm flex items-center gap-1">
                    <span>🗑️</span> 삭제
                  </button>
                  <button onClick={() => setEditEmp(emp)} className="px-2 py-1 md:px-3 md:py-1 bg-blue-500 text-white rounded-lg font-bold shadow hover:bg-blue-600 transition text-xs md:text-sm flex items-center gap-1">
                    <span>✏️</span> 수정
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* 연차신청 현황 카드 */}
      <div className="mb-8 bg-white rounded-xl shadow-lg p-6 border border-blue-200 flex flex-col gap-4">
        <div className="mb-4 text-2xl font-extrabold text-blue-700 text-center drop-shadow">연차신청 현황</div>
        <div className="flex gap-2 justify-center mb-4">
          <button className="px-4 py-2 rounded-full font-bold text-blue-700 bg-white border-2 border-blue-300 shadow hover:bg-blue-200" onClick={()=>setLeaves(leaves)}>전체</button>
          <button className="px-4 py-2 rounded-full font-bold text-yellow-700 bg-yellow-50 border-2 border-yellow-300 shadow hover:bg-yellow-100" onClick={()=>setLeaves(leaves.filter(l=>l.status==='신청'))}>신청</button>
          <button className="px-4 py-2 rounded-full font-bold text-green-700 bg-green-50 border-2 border-green-300 shadow hover:bg-green-100" onClick={()=>setLeaves(leaves.filter(l=>l.status==='승인'))}>승인</button>
          <button className="px-4 py-2 rounded-full font-bold text-red-700 bg-red-50 border-2 border-red-300 shadow hover:bg-red-100" onClick={()=>setLeaves(leaves.filter(l=>l.status==='반려'))}>반려</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-blue-50">
                <th className="border px-3 py-2 font-bold text-blue-700">직원명</th>
                <th className="border px-3 py-2 font-bold text-blue-700">유형</th>
                <th className="border px-3 py-2 font-bold text-blue-700">기간</th>
                <th className="border px-3 py-2 font-bold text-blue-700">일수</th>
                <th className="border px-3 py-2 font-bold text-blue-700">사유</th>
                <th className="border px-3 py-2 font-bold text-blue-700">상태</th>
                <th className="border px-3 py-2 font-bold text-blue-700">구분</th>
                <th className="border px-3 py-2 font-bold text-blue-700">작업</th>
              </tr>
            </thead>
            <tbody>
              {leaves.filter((l: Leave) => l.status === '신청').length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-400 text-lg font-bold">신청된 연차가 없습니다.</td>
                </tr>
              ) : (
                leaves.filter((leave: Leave) => leave.status === '신청').map((leave: Leave) => (
                  <tr key={leave.id} className="bg-white hover:bg-blue-50 transition">
                    <td className="border px-3 py-2 whitespace-nowrap">{leave.employeeName || leave.name || '-'}</td>
                    <td className="border px-3 py-2 whitespace-nowrap">{leave.type || '-'}</td>
                    <td className="border px-3 py-2 whitespace-nowrap">{leave.startDate} ~ {leave.endDate}</td>
                    <td className="border px-3 py-2 whitespace-nowrap text-blue-700 font-bold">{leave.days}</td>
                    <td className="border px-3 py-2 whitespace-nowrap">{leave.reason}</td>
                    <td className="border px-3 py-2 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        leave.status === '신청' ? 'bg-yellow-100 text-yellow-700' :
                        leave.status === '승인' ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'
                      }`}>{leave.status}</span>
                    </td>
                    <td className="border px-3 py-2 whitespace-nowrap">
                      {leave.isAdminRequest ? (
                        <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-xs">대리신청</span>
                      ) : (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">직원신청</span>
                      )}
                    </td>
                    <td className="border px-3 py-2 whitespace-nowrap text-center">
                      <button onClick={() => handleLeaveApproval(leave, '승인')} className="px-4 py-2 bg-green-500 text-white rounded-lg font-bold shadow hover:bg-green-600 transition mx-1">
                        <span>✔️</span> 승인
                      </button>
                      <button onClick={() => handleLeaveApproval(leave, '반려')} className="px-4 py-2 bg-red-500 text-white rounded-lg font-bold shadow hover:bg-red-600 transition mx-1">
                        <span>❌</span> 반려
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex flex-col items-center mt-10">
        {/* 처리현황(최신순) 카드 */}
        <div className="mb-8 bg-white rounded-xl shadow-lg p-6 border border-gray-200 flex flex-col gap-4 w-full">
          <div className="mb-4 text-2xl font-extrabold text-gray-700 text-center drop-shadow">처리현황(최신순)</div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border px-3 py-2 font-bold text-gray-700">직원명</th>
                  <th className="border px-3 py-2 font-bold text-gray-700">유형</th>
                  <th className="border px-3 py-2 font-bold text-gray-700">기간</th>
                  <th className="border px-3 py-2 font-bold text-gray-700">일수</th>
                  <th className="border px-3 py-2 font-bold text-gray-700">사유</th>
                  <th className="border px-3 py-2 font-bold text-gray-700">상태</th>
                  <th className="border px-3 py-2 font-bold text-gray-700">구분</th>
                  <th className="border px-3 py-2 font-bold text-gray-700">처리일자</th>
                </tr>
              </thead>
              <tbody>
                {leaves.filter((l: Leave) => l.status !== '신청').length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-gray-400 text-lg font-bold">처리된 연차가 없습니다.</td>
                  </tr>
                ) : (
                  leaves.filter((leave: Leave) => leave.status !== '신청').sort((a, b) => Number(b.updatedAt ?? 0) - Number(a.updatedAt ?? 0)).map((leave: Leave) => (
                    <tr key={leave.id} className="bg-white hover:bg-blue-50 transition">
                      <td className="border px-3 py-2 whitespace-nowrap">{leave.employeeName || leave.name || '-'}</td>
                      <td className="border px-3 py-2 whitespace-nowrap">{leave.type || '-'}</td>
                      <td className="border px-3 py-2 whitespace-nowrap">{leave.startDate} ~ {leave.endDate}</td>
                      <td className="border px-3 py-2 whitespace-nowrap text-blue-700 font-bold">{leave.days}</td>
                      <td className="border px-3 py-2 whitespace-nowrap">{leave.reason}</td>
                      <td className="border px-3 py-2 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          leave.status === '승인' ? 'bg-green-100 text-green-700' :
                          'bg-red-100 text-red-700'
                        }`}>{leave.status}</span>
                      </td>
                      <td className="border px-3 py-2 whitespace-nowrap">
                        {leave.isAdminRequest ? (
                          <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-xs">대리신청</span>
                        ) : (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">직원신청</span>
                        )}
                      </td>
                      <td className="border px-3 py-2 whitespace-nowrap text-gray-500 text-xs">
                        {leave.updatedAt ? new Date(leave.updatedAt).toLocaleDateString('ko-KR') : '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <button className="px-8 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 font-bold text-lg transition-all duration-150 flex items-center gap-2 mt-8" onClick={() => navigate('/admin/home')}>
          <span>🏠</span> 관리자 홈으로
        </button>
      </div>
    </div>
  );
};

export default AdminEmployeeManage;