import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

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
  const [form, setForm] = useState<EmployeeForm>(initialForm);
  const [message, setMessage] = useState('');
  const [employees, setEmployees] = useState<any[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const empSnap = await getDocs(collection(db, 'employees'));
      setEmployees(empSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      // leave 관련 코드 완전 제거
    };
    fetchData();
  }, []);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'number' ? Number(value) : value }));
  };

  const handleAddOrEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('저장되었습니다.');
    setTimeout(() => setMessage(''), 1500);
    // 실제 Firestore 저장/수정 로직은 필요시 추가
  };

  const handleEditClick = (emp: any) => {
    setForm({
      empNo: emp.empNo ?? '',
      name: emp.name ?? '',
      regNo: emp.regNo ?? '',
      gender: emp.gender ?? '',
      position: emp.position ?? '',
      department: emp.department ?? '',
      jobType: emp.jobType ?? '',
      joinDate: emp.joinDate ?? '',
      email: emp.email ?? '',
      phone: emp.phone ?? '',
      carryOverLeaves: emp.carryOverLeaves ?? 0,
      annualLeaves: emp.annualLeaves ?? 0,
    });
    setEditId(emp.id);
  };

  const handleDelete = async (id: string) => {
  await deleteDoc(doc(db, 'employees', id));
  setEmployees(prev => prev.filter(e => e.id !== id));
  // setLeaves 관련 코드 완전 제거 (leave 관련 상태 없음)
  // leave 관련 코드 완전 제거
  };


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
      {/* 직원 테이블 */}
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-5xl mx-auto mt-6">
        <div className="overflow-x-auto w-full">
          <table className="min-w-[900px] w-full text-xs md:text-sm">
            <thead className="bg-blue-50">
              <tr>
                <th className="border px-2 py-2 whitespace-nowrap">사번</th>
                <th className="border px-2 py-2 whitespace-nowrap">성명</th>
                <th className="border px-2 py-2 whitespace-nowrap">주민번호</th>
                <th className="border px-2 py-2 whitespace-nowrap">성별</th>
                <th className="border px-2 py-2 whitespace-nowrap">직위</th>
                <th className="border px-2 py-2 whitespace-nowrap">부서</th>
                <th className="border px-2 py-2 whitespace-nowrap">직종</th>
                <th className="border px-2 py-2 whitespace-nowrap">입사일</th>
                <th className="border px-2 py-2 whitespace-nowrap">이월연차</th>
                <th className="border px-2 py-2 whitespace-nowrap">올해연차</th>
                <th className="border px-2 py-2 whitespace-nowrap">총연차</th>
                <th className="border px-2 py-2 whitespace-nowrap">연차사용일수</th>
                <th className="border px-2 py-2 whitespace-nowrap">잔여연차</th>
                <th className="border px-2 py-2 whitespace-nowrap">이메일</th>
                <th className="border px-2 py-2 whitespace-nowrap">연락처</th>
                <th className="border px-2 py-2 whitespace-nowrap">UID</th>
                <th className="border px-2 py-2 whitespace-nowrap">수정</th>
                <th className="border px-2 py-2 whitespace-nowrap">삭제</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, idx) => (
                <tr key={emp.id} className={idx % 2 === 0 ? 'bg-gray-50 hover:bg-blue-100 transition' : 'bg-white hover:bg-blue-100 transition'}>
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
                  <td className="border px-2 py-2 whitespace-nowrap">{emp.uid || '-'}</td>
                  <td className="border px-2 py-2 whitespace-nowrap text-center">
                    <button onClick={() => handleEditClick(emp)} className="px-2 py-1 md:px-3 md:py-1 bg-yellow-200 text-yellow-900 rounded-lg font-bold shadow hover:bg-yellow-300 transition text-xs md:text-sm">수정</button>
                  </td>
                  <td className="border px-2 py-2 whitespace-nowrap text-center">
                    <button onClick={() => handleDelete(emp.id!)} className="px-2 py-1 md:px-3 md:py-1 bg-red-500 text-white rounded-lg font-bold shadow hover:bg-red-600 transition text-xs md:text-sm">삭제</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* 연차 승인/반려 테이블 */}
      {/* 연차 승인/반려 테이블을 별도 카드로 분리 */}
  {/* 연차 승인/반려 테이블 제거: 직원관리 화면에서는 미노출 */}
      <div className="flex justify-center mt-10">
        <button className="px-8 py-3 bg-gray-300 text-gray-800 rounded-full shadow-lg hover:bg-gray-400 font-bold text-lg transition-all duration-150" onClick={() => navigate('/admin/home')}>
          관리자 홈으로
        </button>
      </div>
    </div>
  );
};

export default AdminEmployeeManage;