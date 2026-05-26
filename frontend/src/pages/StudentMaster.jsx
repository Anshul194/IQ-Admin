import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Users, Trash2, Edit, Search, X, CheckCircle, AlertCircle, ChevronDown } from 'lucide-react';
import MainLayout from '../components/MainLayout';
import api from '../utils/api';

const GRADES = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];
const LANGUAGES = ['English', 'Hindi', 'Marathi', 'Bengali', 'Telugu', 'Tamil', 'Gujarati', 'Kannada', 'Other'];
const GENDERS = ['Male', 'Female', 'Other'];

const emptyForm = {
    studentName: '',
    mobileNumber: '',
    dob: '',
    gender: '',
    grade: '',
    language: '',
    address: '',
    password: '',
};

export default function StudentMaster({ user }) {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [search, setSearch] = useState('');
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const res = await api.get('/students');
            if (res.data.success) setStudents(res.data.data);
        } catch {
            showToast('Failed to load students', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchStudents(); }, []);

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editId) {
                await api.patch(`/students/${editId}`, form);
                showToast('Student updated successfully');
            } else {
                await api.post('/students', form);
                showToast('Student created successfully');
            }
            setForm(emptyForm);
            setEditId(null);
            setShowForm(false);
            fetchStudents();
        } catch (err) {
            showToast(err.response?.data?.message || 'Operation failed', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (student) => {
        setForm({
            studentName: student.studentName || '',
            mobileNumber: student.mobileNumber || '',
            dob: student.dob ? student.dob.slice(0, 10) : '',
            gender: student.gender || '',
            grade: student.grade || '',
            language: student.language || '',
            address: student.address || '',
            password: '',
        });
        setEditId(student._id);
        setShowForm(true);
        window.scrollTo(0, 0);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this student?')) return;
        try {
            await api.delete(`/students/${id}`);
            showToast('Student deleted');
            fetchStudents();
        } catch {
            showToast('Delete failed', 'error');
        }
    };

    const filtered = students.filter(s =>
        s.studentName?.toLowerCase().includes(search.toLowerCase()) ||
        s.mobileNumber?.includes(search)
    );

    return (
        <MainLayout user={user}>
            {/* Toast */}
            {toast && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`fixed top-4 right-4 z-[200] flex items-center gap-3 px-5 py-3 rounded shadow-xl font-bold text-sm ${toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}
                >
                    {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                    {toast.message}
                </motion.div>
            )}

            <div className="p-6 md:p-10 space-y-8 bg-white min-h-full">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900">Student Master</h1>
                        <p className="text-slate-400 text-sm font-medium mt-0.5">Manage all registered students</p>
                    </div>
                    <button
                        onClick={() => { setForm(emptyForm); setEditId(null); setShowForm(!showForm); }}
                        className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white font-bold text-sm hover:bg-violet-700 transition-all shadow-lg shadow-violet-100"
                    >
                        {showForm ? <X size={18} /> : <UserPlus size={18} />}
                        {showForm ? 'Cancel' : 'Add Student'}
                    </button>
                </div>

                {/* Form */}
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden"
                    >
                        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
                            <h2 className="font-bold text-slate-900 text-sm uppercase tracking-widest">
                                {editId ? 'Edit Student' : 'New Student Registration'}
                            </h2>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {/* Student Name */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Full Name *</label>
                                <input
                                    name="studentName" value={form.studentName} onChange={handleChange} required
                                    placeholder="e.g. Rahul Sharma"
                                    className="w-full border border-slate-200 rounded px-3 py-2.5 text-sm text-slate-900 font-medium focus:ring-2 ring-violet-300 outline-none transition-all"
                                />
                            </div>

                            {/* Mobile */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Mobile Number *</label>
                                <input
                                    name="mobileNumber" value={form.mobileNumber} onChange={handleChange} required
                                    placeholder="10-digit mobile number" type="tel"
                                    className="w-full border border-slate-200 rounded px-3 py-2.5 text-sm text-slate-900 font-medium focus:ring-2 ring-violet-300 outline-none transition-all"
                                />
                            </div>

                            {/* DOB */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Date of Birth</label>
                                <input
                                    name="dob" value={form.dob} onChange={handleChange} type="date"
                                    className="w-full border border-slate-200 rounded px-3 py-2.5 text-sm text-slate-900 font-medium focus:ring-2 ring-violet-300 outline-none transition-all"
                                />
                            </div>

                            {/* Gender */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Gender</label>
                                <div className="relative">
                                    <select
                                        name="gender" value={form.gender} onChange={handleChange}
                                        className="w-full border border-slate-200 rounded px-3 py-2.5 text-sm text-slate-900 font-medium focus:ring-2 ring-violet-300 outline-none transition-all appearance-none bg-white"
                                    >
                                        <option value="">Select Gender</option>
                                        {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                                    </select>
                                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* Grade */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Grade / Class *</label>
                                <div className="relative">
                                    <select
                                        name="grade" value={form.grade} onChange={handleChange} required
                                        className="w-full border border-slate-200 rounded px-3 py-2.5 text-sm text-slate-900 font-medium focus:ring-2 ring-violet-300 outline-none transition-all appearance-none bg-white"
                                    >
                                        <option value="">Select Grade</option>
                                        {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                                    </select>
                                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* Language */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Preferred Language *</label>
                                <div className="relative">
                                    <select
                                        name="language" value={form.language} onChange={handleChange} required
                                        className="w-full border border-slate-200 rounded px-3 py-2.5 text-sm text-slate-900 font-medium focus:ring-2 ring-violet-300 outline-none transition-all appearance-none bg-white"
                                    >
                                        <option value="">Select Language</option>
                                        {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                                    </select>
                                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* Address */}
                            <div className="space-y-1 md:col-span-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Address</label>
                                <input
                                    name="address" value={form.address} onChange={handleChange}
                                    placeholder="Student's home address"
                                    className="w-full border border-slate-200 rounded px-3 py-2.5 text-sm text-slate-900 font-medium focus:ring-2 ring-violet-300 outline-none transition-all"
                                />
                            </div>

                            {/* Password */}
                            {!editId && (
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Initial Password</label>
                                    <input
                                        name="password" value={form.password} onChange={handleChange}
                                        type="password" placeholder="Leave blank to auto-generate"
                                        className="w-full border border-slate-200 rounded px-3 py-2.5 text-sm text-slate-900 font-medium focus:ring-2 ring-violet-300 outline-none transition-all"
                                    />
                                </div>
                            )}

                            {/* Submit */}
                            <div className="md:col-span-2 lg:col-span-3 flex justify-end pt-2 border-t border-slate-100">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-10 py-3 bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 disabled:opacity-50 transition-all"
                                >
                                    {saving ? 'Saving...' : editId ? 'Update Student' : 'Register Student'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}

                {/* Student Table */}
                <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/30">
                        <div className="flex items-center gap-2 text-slate-500">
                            <Users size={16} />
                            <span className="text-sm font-bold">{filtered.length} Students</span>
                        </div>
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                value={search} onChange={e => setSearch(e.target.value)}
                                placeholder="Search by name or phone..."
                                className="pl-8 pr-4 py-2 text-sm border border-slate-200 rounded focus:ring-2 ring-violet-200 outline-none w-64"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50">
                                    {['Name', 'Mobile', 'Grade', 'Language', 'Gender', 'DOB', 'Actions'].map(h => (
                                        <th key={h} className="text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={7} className="text-center py-16 text-slate-400 font-medium">Loading students...</td></tr>
                                ) : filtered.length === 0 ? (
                                    <tr><td colSpan={7} className="text-center py-16 text-slate-300 font-bold">No students found. Add one above.</td></tr>
                                ) : filtered.map((s, i) => (
                                    <tr key={s._id} className={`border-b border-slate-50 hover:bg-slate-50/60 transition-all ${i % 2 === 0 ? '' : 'bg-slate-50/20'}`}>
                                        <td className="px-4 py-3 font-bold text-slate-800">{s.studentName}</td>
                                        <td className="px-4 py-3 text-slate-600 font-mono">{s.mobileNumber}</td>
                                        <td className="px-4 py-3">
                                            {s.grade ? <span className="px-2 py-0.5 bg-violet-50 text-violet-700 border border-violet-100 rounded text-xs font-bold">{s.grade}</span> : <span className="text-slate-300">—</span>}
                                        </td>
                                        <td className="px-4 py-3">
                                            {s.language ? <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded text-xs font-bold">{s.language}</span> : <span className="text-slate-300">—</span>}
                                        </td>
                                        <td className="px-4 py-3 text-slate-500">{s.gender || '—'}</td>
                                        <td className="px-4 py-3 text-slate-500 font-mono text-xs">{s.dob ? new Date(s.dob).toLocaleDateString('en-IN') : '—'}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => handleEdit(s)} className="p-1.5 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded transition-all"><Edit size={16} /></button>
                                                <button onClick={() => handleDelete(s._id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-all"><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
