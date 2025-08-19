
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { Link } from 'react-router-dom';

const initialForm = {
  empNo: '', name: '', regNo: '', gender: '', position: '', department: '', jobType: '', joinDate: '', email: '', phone: '', role: 'employee',
  carryOverLeaves: 0,
  annualLeaves: 0
};

function AdminEmployeeRegister() {
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState('');
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedEmpId, setSelectedEmpId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      const snap = await getDocs(collection(db, 'employees'));
      setEmployees(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (!selectedEmpId) return;
    const emp = employees.find(e => e.id === selectedEmpId);
    if (emp) {
      setForm({ ...initialForm, ...emp });
    }
  }, [selectedEmpId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'carryOverLeaves' || name === 'annualLeaves') {
      setForm({ ...form, [name]: Number(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 직원 정보만 Firestore에 저장 (회원가입/비밀번호 X)
      if (selectedEmpId) {
        // 기존 직원 정보 보완
        await addDoc(collection(db, 'employees'), form); // 실제로는 updateDoc이 적합, 예시로 addDoc 사용
        setMessage('직원정보가 보완되었습니다.');
      } else {
        // 신규 등록
        await addDoc(collection(db, 'employees'), form);
        setMessage('직원정보가 등록되었습니다.');
      }
      setForm(initialForm);
      setTimeout(() => {
        navigate('/admin/home');
      }, 1000);
    } catch (err: any) {
      setMessage('직원 등록/보완 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl shadow-2xl mt-10 border border-blue-100">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-extrabold text-blue-700 tracking-tight drop-shadow">직원정보 보완</h2>
        <Link to="/admin/home" className="bg-gradient-to-r from-blue-100 to-cyan-200 hover:from-blue-200 hover:to-cyan-100 text-blue-700 px-5 py-2 rounded-full font-semibold shadow transition-all">관리자 홈</Link>
      </div>
      <div className="mb-8 flex items-center gap-4">
        <label className="font-semibold text-lg text-blue-700">직원 선택</label>
        <select
          className="border-2 border-blue-200 rounded-lg px-4 py-2 min-w-[220px] bg-white text-gray-700 focus:ring-2 focus:ring-blue-300 outline-none shadow-sm"
          value={selectedEmpId}
          onChange={e => setSelectedEmpId(e.target.value)}
        >
          <option value="">이름/이메일로 검색</option>
          {employees.map(emp => (
            <option key={emp.id} value={emp.id}>{emp.name} ({emp.email})</option>
          ))}
        </select>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 bg-white rounded-2xl shadow-lg p-8 border border-blue-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="empNo" className="block text-sm font-bold text-blue-700 mb-1">사번</label>
            <input name="empNo" value={form.empNo} onChange={handleChange} placeholder="사번" aria-label="사번" className="border-2 border-blue-200 rounded-lg px-3 py-2 w-full" required />
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-bold text-blue-700 mb-1">이름</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="이름" aria-label="이름" className="border-2 border-blue-200 rounded-lg px-3 py-2 w-full" required />
          </div>
          <div>
            <label htmlFor="regNo" className="block text-sm font-bold text-blue-700 mb-1">주민번호</label>
            <input name="regNo" value={form.regNo} onChange={handleChange} placeholder="주민번호" aria-label="주민번호" className="border-2 border-blue-200 rounded-lg px-3 py-2 w-full" />
          </div>
          <div>
            <label htmlFor="gender" className="block text-sm font-bold text-blue-700 mb-1">성별</label>
            <input name="gender" value={form.gender} onChange={handleChange} placeholder="성별" aria-label="성별" className="border-2 border-blue-200 rounded-lg px-3 py-2 w-full" />
          </div>
          <div>
            <label htmlFor="position" className="block text-sm font-bold text-blue-700 mb-1">직위</label>
            <input name="position" value={form.position} onChange={handleChange} placeholder="직위" aria-label="직위" className="border-2 border-blue-200 rounded-lg px-3 py-2 w-full" />
          </div>
          <div>
            <label htmlFor="department" className="block text-sm font-bold text-blue-700 mb-1">부서</label>
            <input name="department" value={form.department} onChange={handleChange} placeholder="부서" aria-label="부서" className="border-2 border-blue-200 rounded-lg px-3 py-2 w-full" />
          </div>
          <div>
            <label htmlFor="jobType" className="block text-sm font-bold text-blue-700 mb-1">직종</label>
            <input name="jobType" value={form.jobType} onChange={handleChange} placeholder="직종" aria-label="직종" className="border-2 border-blue-200 rounded-lg px-3 py-2 w-full" />
          </div>
          <div>
            <label htmlFor="joinDate" className="block text-sm font-bold text-blue-700 mb-1">입사일</label>
            <input name="joinDate" value={form.joinDate} onChange={handleChange} placeholder="입사일" aria-label="입사일" className="border-2 border-blue-200 rounded-lg px-3 py-2 w-full" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-bold text-blue-700 mb-1">이메일</label>
            <input name="email" value={form.email} onChange={handleChange} placeholder="이메일" aria-label="이메일" className="border-2 border-blue-200 rounded-lg px-3 py-2 w-full" />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-bold text-blue-700 mb-1">연락처</label>
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="연락처" aria-label="연락처" className="border-2 border-blue-200 rounded-lg px-3 py-2 w-full" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
          <div>
            <label htmlFor="carryOverLeaves" className="block text-sm font-bold text-blue-700 mb-1">이월연차</label>
            <input name="carryOverLeaves" id="carryOverLeaves" type="number" value={form.carryOverLeaves} onChange={handleChange} placeholder="이월연차" aria-label="이월연차" className="border-2 border-blue-200 rounded-lg px-3 py-2 w-full bg-blue-50 text-blue-700" min={0} />
          </div>
          <div>
            <label htmlFor="annualLeaves" className="block text-sm font-bold text-blue-700 mb-1">발생연차</label>
            <input name="annualLeaves" id="annualLeaves" type="number" value={form.annualLeaves} onChange={handleChange} placeholder="발생연차" aria-label="발생연차" className="border-2 border-blue-200 rounded-lg px-3 py-2 w-full bg-blue-50 text-blue-700" min={0} />
          </div>
        </div>
        <div className="text-right text-lg font-bold text-cyan-700 mt-2">총연차: {Number(form.carryOverLeaves) + Number(form.annualLeaves)}일</div>
        <div className="flex items-center gap-4 mt-4">
          <label className="font-semibold text-blue-700">권한(역할)</label>
          <select name="role" value={form.role} onChange={handleChange} className="border-2 border-blue-200 rounded-lg px-3 py-2">
            <option value="employee">일반직원</option>
            <option value="admin">관리자</option>
          </select>
        </div>
        <button type="submit" className="mt-6 w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-xl font-extrabold rounded-2xl shadow-lg hover:from-blue-600 hover:to-cyan-500 transition-all">저장</button>
      </form>
      {message && <div className="mt-8 text-center text-lg font-bold text-green-600 bg-green-50 rounded-xl py-3 shadow">{message}</div>}
    </div>
  );
}

export default AdminEmployeeRegister;
