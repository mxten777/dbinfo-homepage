
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
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
};

const initialForm: EmployeeForm = {
  empNo: '', name: '', regNo: '', gender: '', position: '', department: '', jobType: '', joinDate: '', email: '', phone: ''
};

const AdminEmployeeManage: React.FC = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<any[]>([]);
  const [form, setForm] = useState<EmployeeForm>(initialForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      const snap = await getDocs(collection(db, 'employees'));
      setEmployees(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
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
    try {
      if (editId) {
        await updateDoc(doc(db, 'employees', editId), form);
        setMessage('수정 완료');
      } else {
        await addDoc(collection(db, 'employees'), form);
        setMessage('등록 완료');
      }
      setForm(initialForm);
      setEditId(null);
    } catch {
      setMessage('실패');
    }
    setTimeout(() => setMessage(''), 1500);
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
      phone: emp.phone || ''
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
      <h2 className="text-3xl font-extrabold mb-6 text-blue-800 tracking-tight text-center drop-shadow">직원정보 등록/수정/삭제</h2>
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
      <div className="overflow-x-auto">
        <table className="min-w-[1100px] border mb-6 whitespace-nowrap text-lg shadow-xl rounded-xl bg-white">
          <thead>
            <tr className="bg-blue-100 text-blue-900 text-lg">
              <th className="border px-4 py-3">사번</th>
              <th className="border px-4 py-3">성명</th>
              <th className="border px-4 py-3">주민번호</th>
              <th className="border px-4 py-3">성별</th>
              <th className="border px-4 py-3">직위</th>
              <th className="border px-4 py-3">부서</th>
              <th className="border px-4 py-3">직종</th>
              <th className="border px-4 py-3">입사일</th>
              <th className="border px-4 py-3">이메일</th>
              <th className="border px-4 py-3">연락처</th>
              <th className="border px-4 py-3">수정</th>
              <th className="border px-4 py-3">삭제</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp.id} className="hover:bg-blue-50 transition">
                <td className="border px-4 py-2 font-semibold">{emp.empNo}</td>
                <td className="border px-4 py-2 font-semibold">{emp.name}</td>
                <td className="border px-4 py-2">{emp.regNo || '-'}</td>
                <td className="border px-4 py-2">{emp.gender || '-'}</td>
                <td className="border px-4 py-2">{emp.position || '-'}</td>
                <td className="border px-4 py-2">{emp.department || '-'}</td>
                <td className="border px-4 py-2">{emp.jobType || '-'}</td>
                <td className="border px-4 py-2">{emp.joinDate || '-'}</td>
                <td className="border px-4 py-2">{emp.email || '-'}</td>
                <td className="border px-4 py-2">{emp.phone || '-'}</td>
                <td className="border px-4 py-2">
                  <button onClick={() => handleEditClick(emp)} className="px-3 py-1 bg-yellow-200 text-yellow-900 rounded-lg font-bold shadow hover:bg-yellow-300 transition">수정</button>
                </td>
                <td className="border px-4 py-2">
                  <button onClick={() => handleDelete(emp.id!)} className="px-3 py-1 bg-red-500 text-white rounded-lg font-bold shadow hover:bg-red-600 transition">삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-10">
        <button className="px-8 py-3 bg-gray-300 text-gray-800 rounded-full shadow-lg hover:bg-gray-400 font-bold text-lg transition-all duration-150" onClick={() => navigate('/admin-home')}>
          관리자 홈으로
        </button>
      </div>
    </div>
  );
};

export default AdminEmployeeManage;
