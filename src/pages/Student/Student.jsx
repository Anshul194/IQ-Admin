import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, School, MapPin, Smartphone, CreditCard,
    Calendar, GraduationCap, Languages, Users,
    CheckCircle2, Plus, Building2, Save,
    RotateCcw, FileText, ChevronRight, Upload,
    Download, Monitor, UserPlus, Phone, Loader2,
    Search, List, LayoutGrid, Eye, Trash2, Edit3,
    Database, PlusCircle, AlertTriangle, X,
    Activity, ShieldCheck, Mail
} from 'lucide-react';
import {
    fetchSchools, createSchool, updateSchool, deleteSchool, fetchSchoolById,
    createStudent, fetchStudents, updateStudent, deleteStudent, fetchStudentById,
    fetchCoordinators,
    createExamCenter, fetchExamCenters, updateExamCenter, deleteExamCenter, fetchExamCenterById,
    resetStudentState
} from '../../store/slices/studentSlice';

// --- Reusable Atoms ---

const VerticalTab = ({ label, active, onClick, color }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group shadow-sm ${active
            ? 'text-white'
            : 'bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-slate-100'
            }`}
        style={active ? { backgroundColor: color, boxShadow: `0 8px 20px -6px ${color}` } : {}}
    >
        <div className="flex items-center space-x-3 text-left">
            <span className={`text-[11px] font-black uppercase tracking-widest transition-colors`}>
                {label}
            </span>
        </div>
        {active && (
            <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                <CheckCircle2 size={16} strokeWidth={3} />
            </motion.div>
        )}
    </button>
);

const ViewToggle = ({ mode, setMode, color }) => (
    <div className="flex items-center p-1 bg-slate-100/50 rounded-2xl w-fit mb-8 border border-slate-100">
        <button
            onClick={() => setMode('create')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all ${mode === 'create'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-400 hover:text-slate-600'
                }`}
        >
            <PlusCircle size={14} className={mode === 'create' ? '' : 'opacity-40'} style={mode === 'create' ? { color } : {}} />
            REGISTRATION
        </button>
        <button
            onClick={() => setMode('list')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all ${mode === 'list'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-400 hover:text-slate-600'
                }`}
        >
            <List size={14} className={mode === 'list' ? '' : 'opacity-40'} style={mode === 'list' ? { color } : {}} />
            DETAILED RECORDS LIST
        </button>
    </div>
);

const DetailItem = ({ label, value, icon: Icon }) => (
    <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100/50">
        <div className="mt-1 p-2 bg-white rounded-lg text-slate-400 shadow-sm">
            <Icon size={16} />
        </div>
        <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
            <p className="text-sm font-bold text-slate-900">{value || '—'}</p>
        </div>
    </div>
);

const DetailModal = ({ isOpen, onClose, data, type }) => (
    <AnimatePresence>
        {isOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                <motion.div
                    initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
                    className="bg-white rounded-[40px] max-w-2xl w-full shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute top-6 right-6">
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                            <X size={20} className="text-slate-400" />
                        </button>
                    </div>

                    <div className="p-8 md:p-12 space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-violet-50 text-violet-600 rounded-3xl">
                                {type === 'school' ? <Building2 size={32} /> : type === 'student' ? <User size={32} /> : <Monitor size={32} />}
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Record Details</h3>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{type === 'school' ? 'School' : type === 'student' ? 'Student' : 'Exam Center'} Master File</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {type === 'school' && (
                                <>
                                    <DetailItem label="School Name" value={data.schoolName} icon={Building2} />
                                    <DetailItem label="Coordinator" value={data.coordinator?.fullName || data.coordinator} icon={Users} />
                                    <DetailItem label="Contact" value={data.contactNumber} icon={Phone} />
                                    <DetailItem label="Associate" value={data.associateCoordinatorName} icon={UserPlus} />
                                    <div className="md:col-span-2">
                                        <DetailItem label="Full Address" value={data.address} icon={MapPin} />
                                    </div>
                                </>
                            )}
                            {type === 'student' && (
                                <>
                                    <DetailItem label="Student Name" value={data.studentName} icon={User} />
                                    <DetailItem label="Student ID" value={`#${data._id?.slice(-8)}`} icon={ShieldCheck} />
                                    <DetailItem label="Mobile" value={data.mobileNumber} icon={Smartphone} />
                                    <DetailItem label="Paid Amount" value={`₹${data.paidAmount}`} icon={CreditCard} />
                                    <DetailItem label="Grade / Class" value={data.grade} icon={GraduationCap} />
                                    <DetailItem label="Language" value={data.language} icon={Languages} />
                                    <DetailItem label="Gender" value={data.gender} icon={Activity} />
                                    <div className="md:col-span-2">
                                        <DetailItem label="Resident Address" value={data.address} icon={MapPin} />
                                    </div>
                                </>
                            )}
                            {type === 'center' && (
                                <>
                                    <DetailItem label="Firm Name" value={data.firmName} icon={Building2} />
                                    <DetailItem label="Respondent" value={data.respondentName} icon={User} />
                                    <DetailItem label="Total Units" value={`${data.computerCount} Computers`} icon={Monitor} />
                                    <DetailItem label="Contact" value={data.contactNumber} icon={Phone} />
                                    <div className="md:col-span-2">
                                        <DetailItem label="Location Address" value={data.address} icon={MapPin} />
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="flex justify-end pt-4">
                            <button onClick={onClose} className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10">
                                Close Details
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        )}
    </AnimatePresence>
);

const DeleteModal = ({ isOpen, onClose, onConfirm, title }) => (
    <AnimatePresence>
        {isOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white rounded-[32px] p-8 max-w-sm w-full shadow-2xl border border-slate-100"
                >
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="p-4 bg-rose-50 text-rose-500 rounded-2xl">
                            <AlertTriangle size={32} strokeWidth={2.5} />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-black text-slate-900">Are you sure?</h3>
                            <p className="text-sm font-bold text-slate-400 leading-relaxed">
                                You are about to delete <span className="text-slate-900">"{title}"</span>. This action cannot be undone.
                            </p>
                        </div>
                        <div className="flex gap-3 w-full pt-4">
                            <button onClick={onClose} className="flex-1 py-3.5 bg-slate-50 text-slate-500 rounded-xl font-bold text-xs hover:bg-slate-100 transition-all border border-slate-100">Cancel</button>
                            <button onClick={onConfirm} className="flex-1 py-3.5 bg-rose-600 text-white rounded-xl font-bold text-xs hover:bg-rose-700 transition-all shadow-lg shadow-rose-100">Yes, Delete</button>
                        </div>
                    </div>
                </motion.div>
            </div>
        )}
    </AnimatePresence>
);

const InputField = ({ label, icon: Icon, placeholder, type = 'text', value, onChange, required = false }) => (
    <div className="space-y-1.5">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{label} {required && '*'}</label>
        <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-600 transition-colors">
                <Icon size={16} strokeWidth={2.5} />
            </div>
            <input
                type={type} placeholder={placeholder}
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500/40 transition-all font-bold text-slate-900 text-sm shadow-sm placeholder:text-slate-300"
                value={value || ''} onChange={(e) => onChange && onChange(e.target.value)} required={required}
            />
        </div>
    </div>
);

const SelectField = ({ label, icon: Icon, value, onChange, options, placeholder, required = false }) => (
    <div className="space-y-1.5">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{label} {required && '*'}</label>
        <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-600 transition-colors">
                <Icon size={16} strokeWidth={2.5} />
            </div>
            <select
                className="w-full pl-11 pr-10 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500/40 transition-all font-bold text-slate-900 text-sm appearance-none cursor-pointer shadow-sm"
                value={value || ''} onChange={(e) => onChange(e.target.value)} required={required}
            >
                <option value="" className="text-slate-400">{placeholder || 'Select Option'}</option>
                {options?.map((opt) => (
                    <option key={opt.id || opt} value={opt.id || opt}>{opt.label || opt}</option>
                ))}
            </select>
        </div>
    </div>
);

const Checkbox = ({ label, checked, onChange }) => (
    <label className="flex items-center space-x-3 cursor-pointer group">
        <div
            onClick={() => onChange(!checked)}
            className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${checked
                ? 'bg-violet-600 border-violet-600'
                : 'border-slate-200 group-hover:border-violet-300'
                }`}
        >
            {checked && <CheckCircle2 size={12} className="text-white" strokeWidth={3} />}
        </div>
        <span className={`text-xs font-bold ${checked ? 'text-slate-800' : 'text-slate-400'}`}>{label}</span>
    </label>
);

const ModernTable = ({ headers, data, loading, renderRow }) => (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm animate-fade-in">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50/50">
                        {headers.map(h => (
                            <th key={h} className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={headers.length} className="px-6 py-20 text-center">
                                <div className="flex flex-col items-center gap-3">
                                    <Loader2 className="animate-spin text-violet-500" size={32} />
                                    <p className="text-xs font-bold text-slate-400">Fetching records...</p>
                                </div>
                            </td>
                        </tr>
                    ) : data.length === 0 ? (
                        <tr>
                            <td colSpan={headers.length} className="px-6 py-20 text-center">
                                <div className="flex flex-col items-center gap-3 opacity-30">
                                    <LayoutGrid size={48} />
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">No records found</p>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        data.map((row, idx) => renderRow(row, idx))
                    )}
                </tbody>
            </table>
        </div>
    </div>
);

// --- Section Views ---

const SchoolMasterView = ({ coordinators, mode, setMode, schools, fetchLoading, setEditingId }) => {
    const dispatch = useDispatch();
    const { loading, success, error, currentEntity } = useSelector(state => state.student);
    const [formData, setFormData] = useState({ coordinator: '', contactNumber: '', schoolName: '', address: '', associateCoordinatorName: '' });
    const [deleteId, setDeleteId] = useState(null);
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        if (currentEntity && mode === 'create') {
            setFormData({
                coordinator: currentEntity.coordinator?._id || currentEntity.coordinator || '',
                contactNumber: currentEntity.contactNumber,
                schoolName: currentEntity.schoolName,
                address: currentEntity.address,
                associateCoordinatorName: currentEntity.associateCoordinatorName || ''
            });
        }
    }, [currentEntity, mode]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (currentEntity) dispatch(updateSchool({ id: currentEntity._id, data: formData }));
        else dispatch(createSchool(formData));
    };

    useEffect(() => {
        if (success) {
            setFormData({ coordinator: '', contactNumber: '', schoolName: '', address: '', associateCoordinatorName: '' });
            setEditingId(null);
            setTimeout(() => dispatch(resetStudentState()), 3000);
        }
    }, [success, dispatch, setEditingId]);

    if (mode === 'list') {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 text-center">
                <ModernTable
                    headers={['School Name', 'Coordinator', 'Contact', 'Address', 'Actions']}
                    data={schools}
                    loading={fetchLoading}
                    renderRow={(school, idx) => (
                        <tr key={school._id || idx} className="hover:bg-slate-50 transition-colors group">
                            <td className="px-6 py-4 text-xs font-bold text-slate-900">{school.schoolName}</td>
                            <td className="px-6 py-4 text-xs font-semibold text-slate-600">{school.coordinator?.fullName || school.coordinator || '—'}</td>
                            <td className="px-6 py-4 text-xs font-semibold text-slate-600">{school.contactNumber}</td>
                            <td className="px-6 py-4 text-xs font-medium text-slate-400 max-w-xs truncate">{school.address}</td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => { dispatch(fetchSchoolById(school._id)); setShowDetails(true); }} className="p-2 text-slate-400 hover:text-amber-500 transition-colors"><Eye size={14} /></button>
                                    <button onClick={() => { setEditingId(school._id); dispatch(fetchSchoolById(school._id)); setMode('create'); }} className="p-2 text-slate-400 hover:text-violet-600 transition-colors"><Edit3 size={14} /></button>
                                    <button onClick={() => setDeleteId(school._id)} className="p-2 text-slate-400 hover:text-rose-600 transition-colors"><Trash2 size={14} /></button>
                                </div>
                            </td>
                        </tr>
                    )}
                />
                <DeleteModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => { dispatch(deleteSchool(deleteId)); setDeleteId(null); }} title={schools.find(s => s._id === deleteId)?.schoolName || 'this school'} />
                {currentEntity && <DetailModal isOpen={showDetails} onClose={() => setShowDetails(false)} data={currentEntity} type="school" />}
            </motion.div>
        );
    }

    return (
        <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectField label="Coordinator" icon={Users} placeholder="Select Coordinator" options={coordinators.map(c => ({ id: c._id, label: c.fullName }))} value={formData.coordinator} onChange={v => setFormData(p => ({ ...p, coordinator: v }))} required />
                <InputField label="Contact Number" icon={Smartphone} placeholder="Enter contact" value={formData.contactNumber} onChange={v => setFormData(p => ({ ...p, contactNumber: v }))} required />
                <div className="md:col-span-2"><InputField label="School Name" icon={Building2} placeholder="Enter full school name" value={formData.schoolName} onChange={v => setFormData(p => ({ ...p, schoolName: v }))} required /></div>
                <div className="md:col-span-2"><InputField label="Address" icon={MapPin} placeholder="Enter school address" value={formData.address} onChange={v => setFormData(p => ({ ...p, address: v }))} required /></div>
                <InputField label="Associate Coordinator Name" icon={UserPlus} placeholder="Enter associate coordinator" value={formData.associateCoordinatorName} onChange={v => setFormData(p => ({ ...p, associateCoordinatorName: v }))} />
            </div>
            {error && <p className="text-xs font-bold text-rose-500 bg-rose-50 p-4 rounded-xl">{typeof error === 'string' ? error : 'Action failed'}</p>}
            {success && <p className="text-xs font-bold text-emerald-500 bg-emerald-50 p-4 rounded-xl">{currentEntity ? 'School updated' : 'School created'} successfully!</p>}
            <div className="flex flex-wrap gap-3">
                <button type="submit" disabled={loading} className="px-6 py-3 bg-violet-600 text-white rounded-xl font-bold text-xs hover:bg-violet-700 transition-all flex items-center gap-2 disabled:opacity-50">
                    {loading ? <Loader2 size={16} className="animate-spin" /> : currentEntity ? <Save size={16} /> : <Plus size={16} />} {currentEntity ? 'Update Changes' : 'Create School'}
                </button>
                {currentEntity && <button type="button" onClick={() => { setEditingId(null); dispatch(resetStudentState()); }} className="px-6 py-3 bg-slate-100 text-slate-500 rounded-xl font-bold text-xs hover:bg-rose-50 hover:text-rose-600 transition-all">Cancel Edit</button>}
            </div>
        </motion.form>
    );
};

const StudentMasterView = ({ coordinators, schools, mode, setMode, students, fetchLoading, setEditingId }) => {
    const dispatch = useDispatch();
    const { loading, success, error, currentEntity } = useSelector(state => state.student);
    const [deleteId, setDeleteId] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [formData, setFormData] = useState({ mobileNumber: '', paidAmount: '', studentName: '', address: '', coordinator: '', school: '', gender: '', dob: '', grade: '', language: '', sendWhatsappAlert: true, isActive: true, isSubscribed: true, password: 'studentPassword123' });

    useEffect(() => {
        if (currentEntity && mode === 'create') {
            setFormData({ ...currentEntity, coordinator: currentEntity.coordinator?._id || currentEntity.coordinator || '', school: currentEntity.school?._id || currentEntity.school || '', dob: currentEntity.dob ? new Date(currentEntity.dob).toISOString().split('T')[0] : '', password: 'studentPassword123' });
        }
    }, [currentEntity, mode]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const dataToSubmit = { ...formData, paidAmount: Number(formData.paidAmount) };
        if (currentEntity) dispatch(updateStudent({ id: currentEntity._id, data: dataToSubmit }));
        else dispatch(createStudent(dataToSubmit));
    };

    useEffect(() => {
        if (success) {
            setFormData({ mobileNumber: '', paidAmount: '', studentName: '', address: '', coordinator: '', school: '', gender: '', dob: '', grade: '', language: '', sendWhatsappAlert: true, isActive: true, isSubscribed: true, password: 'studentPassword123' });
            setEditingId(null);
            setTimeout(() => dispatch(resetStudentState()), 3000);
        }
    }, [success, dispatch, setEditingId]);

    if (mode === 'list') {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 text-center">
                <ModernTable
                    headers={['Student ID', 'Name', 'School', 'Class', 'Mobile', 'Actions']}
                    data={students}
                    loading={fetchLoading}
                    renderRow={(student, idx) => (
                        <tr key={student._id || idx} className="hover:bg-slate-50 transition-colors group">
                            <td className="px-6 py-4 text-xs font-black text-slate-400 capitalize">#{student._id?.slice(-6) || 'N/A'}</td>
                            <td className="px-6 py-4 text-xs font-bold text-slate-900">{student.studentName}</td>
                            <td className="px-6 py-4 text-xs font-semibold text-slate-600">{student.school?.schoolName || '—'}</td>
                            <td className="px-6 py-4 text-xs font-bold text-violet-600">{student.grade}</td>
                            <td className="px-6 py-4 text-xs font-semibold text-slate-600">{student.mobileNumber}</td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => { dispatch(fetchStudentById(student._id)); setShowDetails(true); }} className="p-2 text-slate-400 hover:text-amber-500 transition-colors"><Eye size={14} /></button>
                                    <button onClick={() => { setEditingId(student._id); dispatch(fetchStudentById(student._id)); setMode('create'); }} className="p-2 text-slate-400 hover:text-violet-600 transition-colors"><Edit3 size={14} /></button>
                                    <button onClick={() => setDeleteId(student._id)} className="p-2 text-slate-400 hover:text-rose-600 transition-colors"><Trash2 size={14} /></button>
                                </div>
                            </td>
                        </tr>
                    )}
                />
                <DeleteModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => { dispatch(deleteStudent(deleteId)); setDeleteId(null); }} title={students.find(s => s._id === deleteId)?.studentName || 'this student'} />
                {currentEntity && <DetailModal isOpen={showDetails} onClose={() => setShowDetails(false)} data={currentEntity} type="student" />}
            </motion.div>
        );
    }

    return (
        <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Mobile Number" icon={Smartphone} placeholder="Enter mobile number" value={formData.mobileNumber} onChange={v => setFormData(p => ({ ...p, mobileNumber: v }))} required />
                <SelectField label="Paid Amount" icon={CreditCard} placeholder="Select Amount" options={['500', '1000', '2500', '5000']} value={formData.paidAmount} onChange={v => setFormData(p => ({ ...p, paidAmount: v }))} required />
                <InputField label="Student Name" icon={User} placeholder="Enter name" value={formData.studentName} onChange={v => setFormData(p => ({ ...p, studentName: v }))} required />
                <div className="md:col-span-2"><InputField label="Address" icon={MapPin} placeholder="Enter address" value={formData.address} onChange={v => setFormData(p => ({ ...p, address: v }))} required /></div>
                <SelectField label="Coordinator" icon={Users} placeholder="Select Coordinator" options={coordinators.map(c => ({ id: c._id, label: c.fullName }))} value={formData.coordinator} onChange={v => setFormData(p => ({ ...p, coordinator: v }))} required />
                <SelectField label="School" icon={School} placeholder="Select School" options={schools.map(s => ({ id: s._id, label: s.schoolName }))} value={formData.school} onChange={v => setFormData(p => ({ ...p, school: v }))} required />
                <div className="grid grid-cols-2 gap-4 md:col-span-2">
                    <SelectField label="Gender" icon={User} options={['Male', 'Female', 'Other']} value={formData.gender} onChange={v => setFormData(p => ({ ...p, gender: v }))} required />
                    <InputField label="Date of Birth" icon={Calendar} type="date" value={formData.dob} onChange={v => setFormData(p => ({ ...p, dob: v }))} required />
                </div>
            </div>
            {error && <p className="text-xs font-bold text-rose-500 bg-rose-50 p-4 rounded-xl">{typeof error === 'string' ? error : 'Action failed'}</p>}
            {success && <p className="text-xs font-bold text-emerald-500 bg-emerald-50 p-4 rounded-xl">{currentEntity ? 'Student updated' : 'Student registered'} successfully!</p>}
            <div className="flex flex-wrap gap-3 mt-8">
                <button type="submit" disabled={loading} className="px-8 py-3.5 bg-violet-600 text-white rounded-xl font-bold text-xs hover:bg-violet-700 transition-all flex items-center gap-2 shadow-lg shadow-violet-100 disabled:opacity-50">
                    {loading ? <Loader2 size={16} className="animate-spin" /> : currentEntity ? <Save size={16} /> : <Plus size={16} strokeWidth={2.5} />} {currentEntity ? 'Update Record' : 'Register Student'}
                </button>
                {currentEntity && <button type="button" onClick={() => { setEditingId(null); dispatch(resetStudentState()); }} className="px-8 py-3.5 bg-slate-100 text-slate-500 rounded-xl font-bold text-xs hover:bg-rose-50 hover:text-rose-600 transition-all">Cancel Edit</button>}
            </div>
        </motion.form>
    );
};

const ExamCenterView = ({ schools, mode, setMode, examCenters, fetchLoading, setEditingId }) => {
    const dispatch = useDispatch();
    const { loading, success, error, currentEntity } = useSelector(state => state.student);
    const [deleteId, setDeleteId] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [formData, setFormData] = useState({ firmName: '', computerCount: '', respondentName: '', contactNumber: '', address: '', school: '' });

    useEffect(() => {
        if (currentEntity && mode === 'create') setFormData({ ...currentEntity, school: currentEntity.school?._id || currentEntity.school || '' });
    }, [currentEntity, mode]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const dataToSubmit = { ...formData, computerCount: Number(formData.computerCount) };
        if (currentEntity) dispatch(updateExamCenter({ id: currentEntity._id, data: dataToSubmit }));
        else dispatch(createExamCenter(dataToSubmit));
    };

    useEffect(() => {
        if (success) {
            setFormData({ firmName: '', computerCount: '', respondentName: '', contactNumber: '', address: '', school: '' });
            setEditingId(null);
            setTimeout(() => dispatch(resetStudentState()), 3000);
        }
    }, [success, dispatch, setEditingId]);

    if (mode === 'list') {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 text-center">
                <ModernTable
                    headers={['Center Name', 'Respondent', 'Quantity', 'Contact', 'Actions']}
                    data={examCenters}
                    loading={fetchLoading}
                    renderRow={(center, idx) => (
                        <tr key={center._id || idx} className="hover:bg-slate-50 transition-colors group">
                            <td className="px-6 py-4 text-xs font-bold text-slate-900">{center.firmName}</td>
                            <td className="px-6 py-4 text-xs font-semibold text-slate-600">{center.respondentName}</td>
                            <td className="px-6 py-4"><span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-lg text-[10px] font-black">{center.computerCount} NODES</span></td>
                            <td className="px-6 py-4 text-xs font-semibold text-slate-600">{center.contactNumber}</td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => { dispatch(fetchExamCenterById(center._id)); setShowDetails(true); }} className="p-2 text-slate-400 hover:text-amber-500 transition-colors"><Eye size={14} /></button>
                                    <button onClick={() => { setEditingId(center._id); dispatch(fetchExamCenterById(center._id)); setMode('create'); }} className="p-2 text-slate-400 hover:text-violet-600 transition-colors"><Edit3 size={14} /></button>
                                    <button onClick={() => setDeleteId(center._id)} className="p-2 text-slate-400 hover:text-rose-600 transition-colors"><Trash2 size={14} /></button>
                                </div>
                            </td>
                        </tr>
                    )}
                />
                <DeleteModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => { dispatch(deleteExamCenter(deleteId)); setDeleteId(null); }} title={examCenters.find(c => c._id === deleteId)?.firmName || 'this center'} />
                {currentEntity && <DetailModal isOpen={showDetails} onClose={() => setShowDetails(false)} data={currentEntity} type="center" />}
            </motion.div>
        );
    }

    return (
        <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Firm Name" icon={Building2} placeholder="Enter firm name" value={formData.firmName} onChange={v => setFormData(p => ({ ...p, firmName: v }))} required />
                <InputField label="Number of Computer/Tab" icon={Monitor} placeholder="Enter quantity" type="number" value={formData.computerCount} onChange={v => setFormData(p => ({ ...p, computerCount: v }))} required />
                <InputField label="Respondant Name" icon={User} placeholder="Enter respondent name" value={formData.respondentName} onChange={v => setFormData(p => ({ ...p, respondentName: v }))} required />
                <InputField label="Contact Number" icon={Smartphone} placeholder="Enter contact" value={formData.contactNumber} onChange={v => setFormData(p => ({ ...p, contactNumber: v }))} required />
                <div className="md:col-span-2"><InputField label="Address" icon={MapPin} placeholder="Enter address" value={formData.address} onChange={v => setFormData(p => ({ ...p, address: v }))} required /></div>
                <div className="md:col-span-2"><SelectField label="School" icon={School} placeholder="Select School" options={schools.map(s => ({ id: s._id, label: s.schoolName }))} value={formData.school} onChange={v => setFormData(p => ({ ...p, school: v }))} required /></div>
            </div>
            {error && <p className="text-xs font-bold text-rose-500 bg-rose-50 p-4 rounded-xl">{typeof error === 'string' ? error : 'Action failed'}</p>}
            {success && <p className="text-xs font-bold text-emerald-500 bg-emerald-50 p-4 rounded-xl">{currentEntity ? 'Center updated' : 'Center created'} successfully!</p>}
            <div className="flex flex-wrap gap-3 mt-8">
                <button type="submit" disabled={loading} className="px-8 py-3.5 bg-violet-600 text-white rounded-xl font-bold text-xs hover:bg-violet-700 transition-all flex items-center gap-2 shadow-lg shadow-violet-100 disabled:opacity-50">
                    {loading ? <Loader2 size={16} className="animate-spin" /> : currentEntity ? <Save size={16} /> : <Plus size={16} strokeWidth={2.5} />} {currentEntity ? 'Update Center' : 'Create Center'}
                </button>
                {currentEntity && <button type="button" onClick={() => { setEditingId(null); dispatch(resetStudentState()); }} className="px-8 py-3.5 bg-slate-100 text-slate-500 rounded-xl font-bold text-xs hover:bg-rose-50 hover:text-rose-600 transition-all">Cancel Edit</button>}
            </div>
        </motion.form>
    );
};

// --- Main Student Page ---

const Student = () => {
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState('Student Master');
    const [viewMode, setViewMode] = useState('create');
    const [editingId, setEditingId] = useState(null);
    const { schools, students, coordinators, examCenters, fetchLoading } = useSelector(state => state.student);

    const tabs = [
        { label: 'School Master', color: '#8b5cf6' },
        { label: 'Student Master', color: '#f43f5e' },
        { label: 'Exam Center Master', color: '#f59e0b' }
    ];

    const currentTabColor = tabs.find(t => t.label === activeTab)?.color || '#8b5cf6';

    useEffect(() => {
        dispatch(fetchSchools());
        dispatch(fetchCoordinators());
    }, [dispatch]);

    useEffect(() => {
        if (viewMode === 'list') {
            if (activeTab === 'School Master') dispatch(fetchSchools());
            if (activeTab === 'Student Master') dispatch(fetchStudents());
            if (activeTab === 'Exam Center Master') dispatch(fetchExamCenters());
        }
    }, [viewMode, activeTab, dispatch]);

    const handleTabChange = (label) => {
        setActiveTab(label);
        setViewMode('create');
        setEditingId(null);
        dispatch(resetStudentState());
    };

    return (
        <div className="animate-fade-in font-sans space-y-8 pb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Student Section</h1>
                    <div className="h-6 w-px bg-slate-200 hidden md:block" />
                    <span className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mt-1 pr-4 hidden md:block">{activeTab}</span>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row items-start gap-8">
                <div className="w-full lg:w-80 flex-shrink-0 space-y-3">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 mb-2">Category Selection</p>
                    <div className="space-y-2">
                        {tabs.map(tab => (
                            <div key={tab.label} className="w-full">
                                <VerticalTab label={tab.label} color={tab.color} active={activeTab === tab.label} onClick={() => handleTabChange(tab.label)} />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex-1 w-full lg:scale-[1.01] origin-top text-center">
                    <div className="bg-white border border-slate-100 rounded-[32px] p-6 md:p-10 shadow-sm relative overflow-hidden">
                        <ViewToggle mode={viewMode} setMode={setViewMode} color={currentTabColor} />
                        <AnimatePresence mode="wait">
                            <motion.div key={activeTab + viewMode + (editingId || 'new')} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                                {activeTab === 'School Master' && <SchoolMasterView coordinators={coordinators} mode={viewMode} setMode={setViewMode} schools={schools} fetchLoading={fetchLoading} setEditingId={setEditingId} />}
                                {activeTab === 'Student Master' && <StudentMasterView coordinators={coordinators} schools={schools} mode={viewMode} setMode={setViewMode} students={students} fetchLoading={fetchLoading} setEditingId={setEditingId} />}
                                {activeTab === 'Exam Center Master' && <ExamCenterView schools={schools} mode={viewMode} setMode={setViewMode} examCenters={examCenters} fetchLoading={fetchLoading} setEditingId={setEditingId} />}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Student;
