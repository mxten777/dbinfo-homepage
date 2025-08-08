
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import { FaTrash } from 'react-icons/fa';
// Header import가 있다면 주석처리 또는 제거 (이 파일에는 Header import 없음)
// 카드형 입력폼에 필요한 필드 추가 (주민번호, 성별, 직위, 부서, 직종, 입사일, 연락처)
type EmployeeForm = {
  empNo: string;
  name: string;
  regNo: string;
  gender: string;
  position: string;
  department: string;
  jobType: string;
  joinDate: string;
  email: string;
  phone: string;
  carryOverLeaves: number;
  annualLeaves: number;
};

const initialForm: EmployeeForm = {
  empNo: '', name: '', regNo: '', gender: '', position: '', department: '', jobType: '', joinDate: '', email: '', phone: '', carryOverLeaves: 0, annualLeaves: 0
};

const AdminEmployeeManage: React.FC = () => {
// 직원의 연차 신청 내역 전체 삭제 함수
const deleteAllLeavesForEmployee = async (employeeUid: string) => {
  if (!window.confirm('해당 직원의 모든 연차 신청 내역을 삭제하시겠습니까?')) return;
  const leavesSnap = await getDocs(collection(db, 'leaves'));
  const targetLeaves = leavesSnap.docs.filter(d => d.data().employeeId === employeeUid);
  for (const leaveDoc of targetLeaves) {
    await deleteDoc(doc(db, 'leaves', leaveDoc.id));
  }
  alert('연차 신청 내역이 모두 삭제되었습니다.');
};
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<any[]>([]);
  const [form, setForm] = useState<EmployeeForm>(initialForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      const snap = await getDocs(collection(db, 'employees'));
      // 관리자는 직원 목록에서 제외 (role이 'admin'이 아닌 직원만 표시)
      const employeeData = snap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }) as any)
        .filter((emp: any) => emp.role !== 'admin'); // 관리자 제외
      setEmployees(employeeData);
    };
    fetchEmployees();
  }, [message]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // 입사일 변경 시 사번 자동 생성 (YYYYMMDD-01)
    if (name === 'joinDate') {
      let empNo = '';
      if (value) {
        const ymd = value.replace(/-/g, '');
        empNo = `${ymd}-01`;
      }
      setForm({ ...form, joinDate: value, empNo });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleAddOrEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.empNo) {
      setMessage('이름과 사번을 입력하세요.');
      return;
    }
    
    if (!editId && !form.email) {
      setMessage('신규 직원 등록 시 이메일은 필수입니다.');
      return;
    }
    
    try {
      if (editId) {
        // 직원 정보 수정
        await updateDoc(doc(db, 'employees', editId), form);
        setMessage('수정 완료');
      } else {
        // 신규 직원 등록: Firebase Auth 계정 + Firestore 정보 생성
        const tempPassword = `temp${form.empNo}!`; // 임시 비밀번호 (사번 + !)
        
        // 1. Firebase Authentication 계정 생성
        const userCredential = await createUserWithEmailAndPassword(
          auth, 
          form.email, 
          tempPassword
        );
        
        // 2. 사용자 프로필 업데이트
        await updateProfile(userCredential.user, {
          displayName: form.name
        });
        
        // 3. Firestore employees 컬렉션에 직원 정보 저장
        await addDoc(collection(db, 'employees'), {
          ...form,
          uid: userCredential.user.uid, // Firebase Auth UID 연결
          createdAt: new Date().toISOString(),
          tempPassword: tempPassword, // 관리자가 알 수 있도록 임시 저장
          passwordChanged: false // 최초 로그인 후 비밀번호 변경 여부
        });
        
        setMessage(`등록 완료! 임시 비밀번호: ${tempPassword}`);
        
        // 관리자에게 임시 비밀번호 알림
        alert(`직원 등록 완료!\n이메일: ${form.email}\n임시 비밀번호: ${tempPassword}\n\n직원에게 최초 로그인 후 비밀번호 변경을 안내해주세요.`);
      }
      setForm(initialForm);
      setEditId(null);
    } catch (error: any) {
      console.error('직원 등록 실패:', error);
      if (error.code === 'auth/email-already-in-use') {
        setMessage('이미 사용 중인 이메일입니다.');
      } else if (error.code === 'auth/weak-password') {
        setMessage('비밀번호가 너무 약합니다.');
      } else {
        setMessage('등록 실패: ' + (error.message || '오류 발생'));
      }
    }
    setTimeout(() => setMessage(''), 3000);
  };

  const handleEditClick = (emp: any) => {
    setEditId(emp.id);
      setForm({
        empNo: emp.empNo || '',
        name: emp.name || '',
        regNo: emp.regNo || '',
        gender: emp.gender || '',
        position: emp.position || '',
        department: emp.department || '',
        jobType: emp.jobType || '',
        joinDate: emp.joinDate || '',
        email: emp.email || '',
        phone: emp.phone || '',
    carryOverLeaves: emp.carryOverLeaves || 0,
    annualLeaves: emp.annualLeaves || 0
      });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await deleteDoc(doc(db, 'employees', id));
      setMessage('삭제 완료');
    } catch {
      setMessage('삭제 실패');
    }
    setTimeout(() => setMessage(''), 1500);
  };

  // Header(네비게이션) 없이 화면만 출력
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl mb-6 text-blue-800 tracking-tight text-center drop-shadow">직원정보 등록/수정/삭제</h2>
      {message && <div className="mb-4 text-green-600 font-semibold text-lg text-center">{message}</div>}
      <form onSubmit={handleAddOrEdit} className="bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-2xl p-8 mb-10 grid grid-cols-1 md:grid-cols-2 gap-6 border border-blue-100">
        <div>
          <label className="block text-base font-bold mb-2 text-gray-700">사번</label>
          <input name="empNo" value={form.empNo} onChange={handleFormChange} className="border-2 border-blue-200 rounded-lg px-3 py-2 w-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-300" required />
        </div>
        <div>
          <label className="block text-base font-bold mb-2 text-gray-700">성명</label>
          <input name="name" value={form.name} onChange={handleFormChange} className="border-2 border-blue-200 rounded-lg px-3 py-2 w-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-300" required />
        </div>
        <div>
          <label className="block text-base font-bold mb-2 text-gray-700">주민번호</label>
          <input name="regNo" value={form.regNo} onChange={handleFormChange} className="border-2 border-blue-200 rounded-lg px-3 py-2 w-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-300" />
        </div>
        <div>
          <label className="block text-base font-bold mb-2 text-gray-700">성별</label>
          <select name="gender" value={form.gender} onChange={handleFormChange} className="border-2 border-blue-200 rounded-lg px-3 py-2 w-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-300">
            <option value="">선택</option>
            <option value="남">남</option>
            <option value="여">여</option>
          </select>
        </div>
        <div>
          <label className="block text-base font-bold mb-2 text-gray-700">직위</label>
          <input name="position" value={form.position} onChange={handleFormChange} className="border-2 border-blue-200 rounded-lg px-3 py-2 w-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-300" />
        </div>
        <div>
          <label className="block text-base font-bold mb-2 text-gray-700">부서</label>
          <input name="department" value={form.department} onChange={handleFormChange} className="border-2 border-blue-200 rounded-lg px-3 py-2 w-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-300" />
        </div>
        <div>
          <label className="block text-base font-bold mb-2 text-gray-700">직종</label>
          <input name="jobType" value={form.jobType} onChange={handleFormChange} className="border-2 border-blue-200 rounded-lg px-3 py-2 w-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-300" />
        </div>
        <div>
          <label className="block text-base font-bold mb-2 text-gray-700">입사일</label>
          <input name="joinDate" type="date" value={form.joinDate} onChange={handleFormChange} className="border-2 border-blue-200 rounded-lg px-3 py-2 w-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-300" />
        </div>
        <div>
          <label className="block text-base font-bold mb-2 text-gray-700">이월연차</label>
          <input name="carryOverLeaves" type="number" value={form.carryOverLeaves} onChange={handleFormChange} className="border-2 border-blue-200 rounded-lg px-3 py-2 w-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-300" />
        </div>
        <div>
          <label className="block text-base font-bold mb-2 text-gray-700">올해연차</label>
          <input name="annualLeaves" type="number" value={form.annualLeaves} onChange={handleFormChange} className="border-2 border-blue-200 rounded-lg px-3 py-2 w-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-300" />
        </div>
        <div>
          <label className="block text-base font-bold mb-2 text-gray-700">이메일</label>
          <input name="email" value={form.email} onChange={handleFormChange} className="border-2 border-blue-200 rounded-lg px-3 py-2 w-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-300" />
        </div>
        <div>
          <label className="block text-base font-bold mb-2 text-gray-700">연락처</label>
          <input name="phone" value={form.phone} onChange={handleFormChange} className="border-2 border-blue-200 rounded-lg px-3 py-2 w-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-300" />
        </div>
        <div className="md:col-span-2 flex gap-4 mt-4 justify-center">
          <button type="submit" className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-blue-700 transition-all duration-150">{editId ? '수정' : '등록'}</button>
          {editId && <button type="button" className="px-8 py-3 bg-gray-400 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-gray-500 transition-all duration-150" onClick={()=>{setForm(initialForm);setEditId(null);}}>취소</button>}
        </div>
      </form>
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-5xl mx-auto mt-6">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-blue-100 sticky top-0 z-10">
              <tr className="text-base font-semibold text-blue-900 text-center align-middle">
                <th className="border px-4 py-3 whitespace-nowrap">사번</th>
                <th className="border px-4 py-3 whitespace-nowrap">성명</th>
                <th className="border px-4 py-3 whitespace-nowrap">주민번호</th>
                <th className="border px-4 py-3 whitespace-nowrap">성별</th>
                <th className="border px-4 py-3 whitespace-nowrap">직위</th>
                <th className="border px-4 py-3 whitespace-nowrap">부서</th>
                <th className="border px-4 py-3 whitespace-nowrap">직종</th>
                <th className="border px-4 py-3 whitespace-nowrap">입사일</th>
                <th className="border px-4 py-3 whitespace-nowrap">이월연차</th>
                <th className="border px-4 py-3 whitespace-nowrap">올해연차</th>
                <th className="border px-4 py-3 whitespace-nowrap">총연차</th>
                <th className="border px-4 py-3 whitespace-nowrap">연차사용일수</th>
                <th className="border px-4 py-3 whitespace-nowrap">잔여연차</th>
                <th className="border px-4 py-3 whitespace-nowrap">이메일</th>
                <th className="border px-4 py-3 whitespace-nowrap">연락처</th>
                 <th className="border px-4 py-3 whitespace-nowrap">UID</th>
                <th className="border px-4 py-3 whitespace-nowrap">수정</th>
                <th className="border px-4 py-3 whitespace-nowrap">삭제</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, idx) => (
                <tr key={emp.id} className={idx % 2 === 0 ? 'bg-gray-50 hover:bg-blue-100 transition' : 'bg-white hover:bg-blue-100 transition'}>
                  <td className="border px-4 py-2 whitespace-nowrap">{emp.empNo}</td>
                  <td className="border px-4 py-2 whitespace-nowrap">{emp.name}</td>
                  <td className="border px-4 py-2 whitespace-nowrap">{emp.regNo || '-'}</td>
                  <td className="border px-4 py-2 whitespace-nowrap">{emp.gender || '-'}</td>
                  <td className="border px-4 py-2 whitespace-nowrap">{emp.position || '-'}</td>
                  <td className="border px-4 py-2 whitespace-nowrap">{emp.department || '-'}</td>
                  <td className="border px-4 py-2 whitespace-nowrap">{emp.jobType || '-'}</td>
                  <td className="border px-4 py-2 whitespace-nowrap">{emp.joinDate || '-'}</td>
                  <td className="border px-4 py-2 whitespace-nowrap">{emp.carryOverLeaves ?? '-'}</td>
                  <td className="border px-4 py-2 whitespace-nowrap">{emp.annualLeaves ?? '-'}</td>
                  <td className="border px-4 py-2 whitespace-nowrap">{(Number(emp.carryOverLeaves) || 0) + (Number(emp.annualLeaves) || 0)}</td>
                  <td className="border px-4 py-2 whitespace-nowrap">{emp.usedLeaves ?? '-'}</td>
                  <td className="border px-4 py-2 whitespace-nowrap">{emp.remainingLeaves ?? '-'}</td>
                  <td className="border px-4 py-2 whitespace-nowrap">{emp.email || '-'}</td>
                  <td className="border px-4 py-2 whitespace-nowrap">{emp.phone || '-'}</td>
                   <td className="border px-4 py-2 whitespace-nowrap">{emp.uid || '-'}</td>
                  <td className="border px-4 py-2 whitespace-nowrap">
                    <button onClick={() => handleEditClick(emp)} className="px-3 py-1 bg-yellow-200 text-yellow-900 rounded-lg font-bold shadow hover:bg-yellow-300 transition">수정</button>
                  </td>
                  <td className="border px-4 py-2 whitespace-nowrap">
                    <button onClick={() => handleDelete(emp.id!)} className="px-3 py-1 bg-red-500 text-white rounded-lg font-bold shadow hover:bg-red-600 transition">삭제</button>
                    <button onClick={() => deleteAllLeavesForEmployee(emp.uid)} title="연차 신청 내역 전체 삭제" className="ml-2 px-2 py-1 bg-gray-200 text-gray-700 rounded-lg font-bold shadow hover:bg-red-400 hover:text-white transition flex items-center gap-1">
                      <FaTrash /> 전체삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex justify-center mt-10">
        <button className="px-8 py-3 bg-gray-300 text-gray-800 rounded-full shadow-lg hover:bg-gray-400 font-bold text-lg transition-all duration-150" onClick={() => navigate('/admin/home')}>
          관리자 홈으로
        </button>
      </div>
    </div>
  );
};

export default AdminEmployeeManage;
