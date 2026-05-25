import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    UserPlus, MapPin, Smartphone, Upload, Check, ChevronRight,
    UserCircle2, Eraser, X, FileText, Loader2, CheckCircle2,
    ChevronDown, Search, RefreshCw, Phone, MapPinIcon,
    ShieldCheck, Users2, Eye, Trash2, Pencil, LayoutGrid,
    List, UserCheck, AlertTriangle, Save, ExternalLink, Calendar
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {
    createTeamMember, resetTeamState, fetchUsersByRole, fetchAllTeamMembers,
    getTeamMemberById, updateTeamMember, deleteTeamMember,
    resetUpdateState, resetDeleteState, clearSelectedMember
} from '../../store/slices/teamSlice';

// ─── Role Config ─────────────────────────────────────────────────────────────
const ROLES = [
    { name: 'Chief Administrative Officer', short: 'CAO', color: '#7c3aed', bg: '#7c3aed15' },
    { name: 'Administrative Officer', short: 'AO', color: '#8b5cf6', bg: '#8b5cf615' },
    { name: 'Chief Administrator', short: 'CA', color: '#a78bfa', bg: '#a78bfa15' },
    { name: 'Administrator', short: 'Admin', color: '#10b981', bg: '#10b98115' },
    { name: 'Coordinator', short: 'Coord', color: '#f59e0b', bg: '#f59e0b15' },
];

const getParentRole = (role) => ({
    'Administrative Officer': 'Chief Administrative Officer',
    'Chief Administrator': 'Administrative Officer',
    'Administrator': 'Chief Administrator',
    'Coordinator': 'Administrator',
}[role] || null);

const getParentLabel = (role) => ({
    'Administrative Officer': 'CAO',
    'Chief Administrator': 'Administrative Officer',
    'Administrator': 'Chief Administrator',
    'Coordinator': 'Administrator',
}[role] || 'Authority');

// Maps actual API parent fields to a unified { _id, fullName, role } object
// API returns: parentCAO | parentAdminOfficer | parentChiefAdmin | parentAdmin
const getParentFromMember = (member) => {
    if (!member) return null;
    return (
        member.parentCAO ||
        member.parentAdminOfficer ||
        member.parentChiefAdmin ||
        member.parentAdmin ||
        member.parentUser ||
        null
    );
};

// ─── Reusable Atoms ───────────────────────────────────────────────────────────
const VerticalTab = ({ role, active, onClick, color }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 group ${active ? 'bg-white shadow-sm text-slate-900 ring-1 ring-slate-200/50' : 'text-slate-400 hover:bg-slate-50'
            }`}
    >
        <div className="flex items-center space-x-3">
            <div className={`w-1.5 h-6 rounded-full transition-all duration-300 ${active ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'}`} style={{ background: color }} />
            <span className={`text-xs font-bold uppercase tracking-wider transition-colors ${active ? 'text-slate-900' : 'group-hover:text-slate-600'}`}>{role}</span>
        </div>
        {active && <ChevronRight size={14} className="text-slate-300" />}
    </button>
);

const InputField = ({ label, icon: Icon, placeholder, type = 'text', value, onChange, readOnly }) => (
    <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{label}</label>
        <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-violet-600 transition-colors">
                <Icon size={16} strokeWidth={2.5} />
            </div>
            <input type={type} placeholder={placeholder} readOnly={readOnly}
                className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-4 focus:ring-violet-500/5 focus:border-violet-500/30 transition-all font-semibold text-slate-700 text-sm ${readOnly ? 'bg-slate-50 border-slate-100 cursor-default text-slate-500' : 'bg-slate-50/50 border-slate-100 focus:bg-white'
                    }`}
                value={value} onChange={(e) => onChange && onChange(e.target.value)}
            />
        </div>
    </div>
);

const SelectField = ({ label, icon: Icon, value, onChange, options, loading }) => (
    <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{label}</label>
        <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-violet-600 transition-colors">
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Icon size={16} strokeWidth={2.5} />}
            </div>
            <select
                className="w-full pl-11 pr-10 py-3 bg-slate-50/50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-violet-500/5 focus:border-violet-500/30 focus:bg-white transition-all font-semibold text-slate-700 text-sm appearance-none cursor-pointer"
                value={value} onChange={(e) => onChange(e.target.value)}
            >
                <option value="">{loading ? 'Fetching accounts...' : 'Select Parent Account'}</option>
                {options?.map((opt) => (
                    <option key={opt._id} value={opt._id}>{opt.fullName} ({opt.contactNumber})</option>
                ))}
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-300"><ChevronDown size={16} /></div>
        </div>
    </div>
);

const RoleBadge = ({ role }) => {
    const cfg = ROLES.find(r => r.name === role) || { short: role, color: '#94a3b8', bg: '#f1f5f9' };
    return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider" style={{ color: cfg.color, backgroundColor: cfg.bg }}>
            {cfg.short}
        </span>
    );
};

// ─── Delete Confirmation Modal ────────────────────────────────────────────────
const DeleteModal = ({ member, onConfirm, onCancel, loading }) => {
    const role = member?.role || member?._role;
    const cfg = ROLES.find(r => r.name === role) || { color: '#94a3b8' };
    const initials = (member?.fullName || '?').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={onCancel}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92 }}
                onClick={e => e.stopPropagation()}
                className="bg-white rounded-3xl shadow-2xl shadow-slate-200/60 p-8 max-w-md w-full"
            >
                <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500">
                        <AlertTriangle size={22} strokeWidth={2.5} />
                    </div>
                    <button onClick={onCancel} className="p-2 text-slate-300 hover:text-slate-600 transition-colors rounded-xl hover:bg-slate-50">
                        <X size={18} />
                    </button>
                </div>
                <h2 className="text-lg font-black text-slate-900 mb-1">Confirm Deletion</h2>
                <p className="text-sm text-slate-500 font-medium mb-6">This action is permanent and cannot be undone.</p>

                <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-2xl mb-6">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-sm flex-shrink-0" style={{ backgroundColor: cfg.color }}>
                        {initials}
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-900">{member?.fullName}</p>
                        <RoleBadge role={role} />
                    </div>
                </div>

                <div className="flex gap-3">
                    <button onClick={onCancel}
                        className="flex-1 py-3 bg-slate-50 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-100 transition-all">
                        Cancel
                    </button>
                    <button onClick={onConfirm} disabled={loading}
                        className="flex-1 py-3 bg-rose-500 text-white font-bold text-sm rounded-xl hover:bg-rose-600 disabled:opacity-60 transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-100">
                        {loading ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                        {loading ? 'Deleting...' : 'Yes, Delete'}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

// ─── View Member Modal ────────────────────────────────────────────────────────
const ViewModal = ({ member, onClose, onEdit }) => {
    const role = member?.role || member?._role;
    const cfg = ROLES.find(r => r.name === role) || { color: '#94a3b8' };
    const initials = (member?.fullName || '?').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    const parent = getParentFromMember(member);

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92 }}
                onClick={e => e.stopPropagation()}
                className="bg-white rounded-3xl shadow-2xl shadow-slate-200/60 p-8 max-w-lg w-full"
            >
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-md" style={{ backgroundColor: cfg.color }}>
                            {initials}
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900 leading-none">{member?.fullName}</h2>
                            <div className="mt-1.5"><RoleBadge role={role} /></div>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-300 hover:text-slate-600 transition-colors rounded-xl hover:bg-slate-50">
                        <X size={18} />
                    </button>
                </div>

                <div className="space-y-3 mb-6">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-4 bg-slate-50 rounded-xl">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Contact</p>
                            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                                <Phone size={13} className="text-slate-400" />
                                {member?.contactNumber || '—'}
                            </div>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${member?.status === 'active' ? 'bg-emerald-400' : 'bg-slate-300'}`} />
                                <span className={`text-sm font-bold capitalize ${member?.status === 'active' ? 'text-emerald-600' : 'text-slate-500'}`}>{member?.status || 'active'}</span>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Address</p>
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                            <MapPinIcon size={13} className="text-slate-400" />
                            {member?.address || '—'}
                        </div>
                    </div>
                    {parent && (
                        <div className="p-4 bg-violet-50 rounded-xl">
                            <p className="text-[10px] font-black text-violet-400 uppercase tracking-widest mb-1">Reports To</p>
                            <p className="text-sm font-bold text-violet-900">{parent?.fullName || '—'}</p>
                            <p className="text-[10px] text-violet-400 font-semibold mt-0.5">{parent?.role}</p>
                        </div>
                    )}
                    {member?.idProof?.fileUrl && (
                        <div className="p-4 bg-slate-50 rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <FileText size={16} className="text-slate-400" />
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID Proof</p>
                                    <p className="text-xs font-bold text-slate-700">{member.idProof.fileName}</p>
                                </div>
                            </div>
                            <a href={`http://localhost:5000/${member.idProof.fileUrl}`} target="_blank" rel="noreferrer"
                                className="p-2 text-violet-500 hover:bg-violet-50 rounded-lg transition-all">
                                <ExternalLink size={15} />
                            </a>
                        </div>
                    )}
                    <div className="p-4 bg-slate-50 rounded-xl">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Joined</p>
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                            <Calendar size={13} className="text-slate-400" />
                            {member?.createdAt ? new Date(member.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : '—'}
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-3 bg-slate-50 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-100 transition-all">Close</button>
                    <button onClick={onEdit} className="flex-1 py-3 bg-slate-900 text-white font-bold text-sm rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                        <Pencil size={15} /> Edit Member
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

// ─── Edit Member Modal ────────────────────────────────────────────────────────
const EditModal = ({ member, onClose }) => {
    const dispatch = useDispatch();
    const { updateLoading, updateSuccess, error, parentUsers, fetchingParents } = useSelector(s => s.team);
    const role = member?.role || member?._role;

    const existingParent = getParentFromMember(member);

    const [formData, setFormData] = useState({
        name: member?.fullName || '',
        contactNumber: member?.contactNumber || '',
        address: member?.address || '',
        parentId: existingParent?._id || '',
    });
    const [idProof, setIdProof] = useState(null);
    const [filePreview, setFilePreview] = useState(null);

    useEffect(() => {
        const parentRole = getParentRole(role);
        if (parentRole) dispatch(fetchUsersByRole(parentRole));
    }, [role, dispatch]);

    // Once parentUsers list loads, ensure the existing parent is pre-selected
    useEffect(() => {
        if (parentUsers.length > 0 && existingParent?._id) {
            const match = parentUsers.find(u => u._id === existingParent._id);
            if (match) setFormData(prev => ({ ...prev, parentId: existingParent._id }));
        }
    }, [parentUsers]);

    useEffect(() => {
        if (updateSuccess) {
            const t = setTimeout(() => { dispatch(resetUpdateState()); dispatch(fetchAllTeamMembers()); onClose(); }, 1500);
            return () => clearTimeout(t);
        }
    }, [updateSuccess, dispatch, onClose]);


    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setIdProof(file);
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => setFilePreview(reader.result);
            reader.readAsDataURL(file);
        } else { setFilePreview('document'); }
    };

    const handleSave = () => {
        const data = new FormData();
        data.append('name', formData.name);
        data.append('contactNumber', formData.contactNumber);
        data.append('address', formData.address);
        if (formData.parentId) data.append('parentId', formData.parentId);
        if (idProof) data.append('idProof', idProof);
        dispatch(updateTeamMember({ id: member._id, formData: data }));
    };

    const cfg = ROLES.find(r => r.name === role) || { color: '#94a3b8' };

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92 }}
                onClick={e => e.stopPropagation()}
                className="bg-white rounded-3xl shadow-2xl shadow-slate-200/60 p-8 max-w-lg w-full my-4"
            >
                {/* Success overlay */}
                <AnimatePresence>
                    {updateSuccess && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-white/95 z-10 flex flex-col items-center justify-center rounded-3xl">
                            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle2 size={32} strokeWidth={2.5} />
                            </div>
                            <p className="text-lg font-black text-slate-900">Saved!</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm" style={{ backgroundColor: cfg.color }}>
                            <Pencil size={18} />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-slate-900 leading-none">Edit Member</h2>
                            <p className="text-xs text-slate-400 font-semibold mt-0.5">{member?.fullName}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-300 hover:text-slate-600 rounded-xl hover:bg-slate-50 transition-all">
                        <X size={18} />
                    </button>
                </div>

                <div className="space-y-4">
                    {role !== 'Chief Administrative Officer' && (
                        <div className="space-y-1.5">
                            <SelectField label={`Parent ${getParentLabel(role)}`} icon={UserCircle2}
                                value={formData.parentId} onChange={val => setFormData({ ...formData, parentId: val })}
                                options={parentUsers} loading={fetchingParents} />
                            {/* Show currently assigned parent as a hint */}
                            {existingParent && (
                                <div className="flex items-center gap-2 px-3 py-2 bg-violet-50 rounded-xl">
                                    <div className="w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0" />
                                    <p className="text-[10px] font-bold text-violet-500 uppercase tracking-widest">
                                        Currently assigned:
                                    </p>
                                    <p className="text-[11px] font-black text-violet-700 truncate">
                                        {existingParent.fullName}
                                        {existingParent.contactNumber ? ` (${existingParent.contactNumber})` : ''}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                    <InputField label="Full Name" icon={UserCircle2} placeholder="Full legal name"
                        value={formData.name} onChange={val => setFormData({ ...formData, name: val })} />
                    <InputField label="Contact Number" icon={Smartphone} placeholder="Phone number"
                        value={formData.contactNumber} onChange={val => setFormData({ ...formData, contactNumber: val })} />
                    <InputField label="Address" icon={MapPin} placeholder="Registered address"
                        value={formData.address} onChange={val => setFormData({ ...formData, address: val })} />

                    {/* File upload */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Upload size={16} className="text-slate-400" />
                                <div>
                                    <p className="text-xs font-bold text-slate-700">Update ID Proof</p>
                                    <p className="text-[10px] text-slate-400 font-medium">PDF, PNG or JPG max 5MB</p>
                                </div>
                            </div>
                            <label className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[11px] font-black text-slate-500 cursor-pointer hover:border-violet-500 hover:text-violet-600 transition-all">
                                Choose
                                <input type="file" className="hidden" onChange={handleFileChange} />
                            </label>
                        </div>
                        {idProof && (
                            <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 overflow-hidden flex items-center justify-center">
                                        {filePreview === 'document' ? <FileText size={20} className="text-slate-300" /> : <img src={filePreview} alt="Preview" className="w-full h-full object-cover" />}
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-900">{idProof.name}</p>
                                        <p className="text-[10px] text-slate-400 font-semibold">{(idProof.size / (1024 * 1024)).toFixed(2)} MB</p>
                                    </div>
                                </div>
                                <button onClick={() => { setIdProof(null); setFilePreview(null); }} className="p-1.5 text-slate-300 hover:text-rose-500 transition-all">
                                    <X size={16} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {error && <div className="mt-4 p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-500 text-xs font-bold text-center">Save failed: {typeof error === 'string' ? error : 'Please try again.'}</div>}

                <div className="flex gap-3 mt-6">
                    <button onClick={onClose} className="flex-1 py-3 bg-slate-50 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-100 transition-all">Cancel</button>
                    <button onClick={handleSave} disabled={updateLoading || !formData.name || !formData.contactNumber}
                        className="flex-1 py-3 bg-slate-900 text-white font-bold text-sm rounded-xl hover:bg-slate-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-100">
                        {updateLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        {updateLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

// ─── Directory View ───────────────────────────────────────────────────────────
const DirectoryView = () => {
    const dispatch = useDispatch();
    const { allMembers, fetchingAll, selectedMember, fetchingSelected, deleteLoading, deleteSuccess } = useSelector(s => s.team);
    const [search, setSearch] = useState('');
    const [filterRole, setFilterRole] = useState('All');
    const [viewMode, setViewMode] = useState('list');
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [viewTarget, setViewTarget] = useState(null);
    const [editTarget, setEditTarget] = useState(null);
    const [actionLoading, setActionLoading] = useState(null); // memberId being fetched

    useEffect(() => { dispatch(fetchAllTeamMembers()); }, [dispatch]);

    // After delete success: close modal & refresh
    useEffect(() => {
        if (deleteSuccess) { setDeleteTarget(null); dispatch(resetDeleteState()); dispatch(fetchAllTeamMembers()); }
    }, [deleteSuccess, dispatch]);

    // When selectedMember arrives, open correct modal
    useEffect(() => {
        if (selectedMember && actionLoading) {
            const action = actionLoading.action;
            setActionLoading(null);
            if (action === 'view') setViewTarget(selectedMember);
            if (action === 'edit') setEditTarget(selectedMember);
        }
    }, [selectedMember]);

    const handleFetch = (member, action) => {
        const id = member._id;
        setActionLoading({ id, action });
        dispatch(clearSelectedMember());
        dispatch(getTeamMemberById(id));
    };

    const filtered = allMembers.filter(m => {
        const role = m.role || m._role;
        const matchRole = filterRole === 'All' || role === filterRole;
        const matchSearch = !search ||
            (m.fullName || '').toLowerCase().includes(search.toLowerCase()) ||
            (m.contactNumber || '').includes(search);
        return matchRole && matchSearch;
    });

    const roleCounts = ROLES.map(r => ({ ...r, count: allMembers.filter(m => (m.role || m._role) === r.name).length }));

    // ── Action buttons (shared) ──────────────────────────────────────────────
    const ActionBtns = ({ member }) => {
        const isLoading = actionLoading?.id === member._id;
        return (
            <div className="flex items-center justify-end gap-1">
                <button onClick={() => handleFetch(member, 'edit')}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-all" title="Edit">
                    {isLoading && actionLoading.action === 'edit' ? <Loader2 size={14} className="animate-spin text-violet-400" /> : <Pencil size={14} />}
                </button>
                <button onClick={() => handleFetch(member, 'view')}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-50 transition-all" title="View">
                    {isLoading && actionLoading.action === 'view' ? <Loader2 size={14} className="animate-spin text-amber-400" /> : <Eye size={14} />}
                </button>
                <button onClick={() => setDeleteTarget(member)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all" title="Delete">
                    <Trash2 size={14} />
                </button>
            </div>
        );
    };

    // ── Grid card ────────────────────────────────────────────────────────────
    const GridCard = ({ member }) => {
        const role = member.role || member._role;
        const cfg = ROLES.find(r => r.name === role) || { color: '#94a3b8' };
        const initials = (member.fullName || '?').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
        return (
            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} whileHover={{ y: -4 }}
                className="bg-white border border-slate-100 rounded-2xl p-5 flex flex-col gap-3 shadow-sm hover:shadow-md hover:border-slate-200 transition-all group">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm shadow" style={{ backgroundColor: cfg.color }}>{initials}</div>
                        <div>
                            <p className="text-sm font-bold text-slate-900 leading-tight">{member.fullName}</p>
                            <RoleBadge role={role} />
                        </div>
                    </div>
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${member.status === 'active' ? 'bg-emerald-400' : 'bg-slate-300'}`} />
                </div>
                <div className="text-[11px] font-semibold text-slate-500 space-y-1.5">
                    <div className="flex items-center gap-2"><Phone size={11} className="text-slate-300" /><span>{member.contactNumber || '—'}</span></div>
                    {member.address && <div className="flex items-center gap-2"><MapPinIcon size={11} className="text-slate-300" /><span className="truncate">{member.address}</span></div>}
                </div>
                <div className="pt-2 border-t border-slate-50 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ActionBtns member={member} />
                </div>
            </motion.div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Modals */}
            <AnimatePresence>
                {deleteTarget && (
                    <DeleteModal member={deleteTarget} loading={deleteLoading}
                        onCancel={() => setDeleteTarget(null)}
                        onConfirm={() => dispatch(deleteTeamMember(deleteTarget._id))} />
                )}
                {viewTarget && (
                    <ViewModal member={viewTarget} onClose={() => setViewTarget(null)}
                        onEdit={() => { setEditTarget(viewTarget); setViewTarget(null); }} />
                )}
                {editTarget && (
                    <EditModal member={editTarget} onClose={() => { setEditTarget(null); dispatch(resetUpdateState()); }} />
                )}
            </AnimatePresence>

            {/* Role Filter Pills */}
            <div className="flex flex-wrap gap-2">
                <button onClick={() => setFilterRole('All')}
                    className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${filterRole === 'All' ? 'bg-slate-900 text-white border-slate-900 shadow' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'}`}>
                    <Users2 size={13} /><span>All ({allMembers.length})</span>
                </button>
                {roleCounts.map(r => (
                    <button key={r.name} onClick={() => setFilterRole(r.name)}
                        className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${filterRole === r.name ? 'text-white border-transparent shadow' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'}`}
                        style={filterRole === r.name ? { backgroundColor: r.color } : {}}>
                        <ShieldCheck size={12} style={{ color: filterRole === r.name ? '#fff' : r.color }} />
                        <span>{r.short} ({r.count})</span>
                    </button>
                ))}
            </div>

            {/* Search + View Toggle + Refresh */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                    <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or phone..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-100 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-4 focus:ring-violet-500/5 focus:border-violet-400/30 transition-all shadow-sm" />
                </div>
                <div className="flex items-center bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm">
                    <button onClick={() => setViewMode('list')} title="List View"
                        className={`p-2.5 transition-all ${viewMode === 'list' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'}`}>
                        <List size={16} />
                    </button>
                    <button onClick={() => setViewMode('grid')} title="Grid View"
                        className={`p-2.5 transition-all ${viewMode === 'grid' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'}`}>
                        <LayoutGrid size={16} />
                    </button>
                </div>
                <button onClick={() => dispatch(fetchAllTeamMembers())} title="Refresh"
                    className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-violet-600 hover:border-violet-200 transition-all shadow-sm active:scale-95">
                    <RefreshCw size={16} className={fetchingAll ? 'animate-spin' : ''} />
                </button>
            </div>

            {/* Content */}
            {fetchingAll ? (
                <div className="flex flex-col items-center justify-center py-24 space-y-4">
                    <Loader2 size={36} className="animate-spin text-violet-300" />
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Directory...</p>
                </div>
            ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 space-y-3">
                    <Users2 size={48} strokeWidth={1} className="text-slate-200" />
                    <p className="text-sm font-bold text-slate-400">No members found</p>
                    <p className="text-xs text-slate-300">Try adjusting the filter or search term</p>
                </div>
            ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filtered.map(m => <GridCard key={m._id || Math.random()} member={m} />)}
                </div>
            ) : (
                <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-50 bg-slate-50/60">
                                <th className="px-5 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">#</th>
                                <th className="px-5 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Member</th>
                                <th className="px-5 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest hidden sm:table-cell">Role</th>
                                <th className="px-5 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest hidden md:table-cell">Contact</th>
                                <th className="px-5 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest hidden lg:table-cell">Address</th>
                                <th className="px-5 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-5 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filtered.map((member, idx) => {
                                const role = member.role || member._role;
                                const cfg = ROLES.find(r => r.name === role) || { color: '#94a3b8' };
                                const initials = (member.fullName || '?').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
                                return (
                                    <motion.tr key={member._id || idx} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                        className="hover:bg-violet-50/20 transition-colors group">
                                        <td className="px-5 py-4 text-xs font-bold text-slate-300">{idx + 1}</td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-xs flex-shrink-0 shadow-sm" style={{ backgroundColor: cfg.color }}>
                                                    {initials}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900 leading-none">{member.fullName}</p>
                                                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5 sm:hidden">{member.contactNumber}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 hidden sm:table-cell"><RoleBadge role={role} /></td>
                                        <td className="px-5 py-4 hidden md:table-cell text-xs font-semibold text-slate-500">{member.contactNumber || '—'}</td>
                                        <td className="px-5 py-4 hidden lg:table-cell text-xs font-semibold text-slate-400 max-w-[180px] truncate">{member.address || '—'}</td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center space-x-1.5">
                                                <div className={`w-1.5 h-1.5 rounded-full ${member.status === 'active' ? 'bg-emerald-400' : 'bg-slate-300'}`} />
                                                <span className={`text-[10px] font-black uppercase tracking-wider ${member.status === 'active' ? 'text-emerald-500' : 'text-slate-400'}`}>
                                                    {member.status || 'active'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                <ActionBtns member={member} />
                                            </div>
                                        </td>
                                    </motion.tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <div className="px-5 py-3.5 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{filtered.length} member{filtered.length !== 1 ? 's' : ''} found</p>
                        <div className="flex items-center space-x-1.5">
                            <UserCheck size={12} className="text-emerald-400" />
                            <span className="text-[10px] font-bold text-emerald-500">{allMembers.filter(m => m.status === 'active').length} Active</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// ─── Onboarding Form View ─────────────────────────────────────────────────────
const OnboardingView = () => {
    const dispatch = useDispatch();
    const { loading, success, error, parentUsers, fetchingParents } = useSelector(s => s.team);

    const [activeRole, setActiveRole] = useState('Chief Administrative Officer');
    const [formData, setFormData] = useState({ name: '', contactNumber: '', address: '', parentId: '' });
    const [idProof, setIdProof] = useState(null);
    const [filePreview, setFilePreview] = useState(null);

    const currentRole = ROLES.find(r => r.name === activeRole);

    useEffect(() => {
        const parentRole = getParentRole(activeRole);
        if (parentRole) dispatch(fetchUsersByRole(parentRole));
        setFormData(prev => ({ ...prev, parentId: '' }));
    }, [activeRole, dispatch]);

    useEffect(() => {
        if (success) { const t = setTimeout(() => { dispatch(resetTeamState()); handleClear(); }, 3000); return () => clearTimeout(t); }
    }, [success, dispatch]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setIdProof(file);
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => setFilePreview(reader.result);
            reader.readAsDataURL(file);
        } else { setFilePreview('document'); }
    };

    const handleClear = () => { setFormData({ name: '', contactNumber: '', address: '', parentId: '' }); setIdProof(null); setFilePreview(null); dispatch(resetTeamState()); };

    const handleOnboarding = () => {
        const data = new FormData();
        data.append('name', formData.name);
        data.append('contactNumber', formData.contactNumber);
        data.append('address', formData.address);
        data.append('role', activeRole);
        if (formData.parentId) data.append('parentId', formData.parentId);
        if (idProof) data.append('idProof', idProof);
        dispatch(createTeamMember(data));
    };

    return (
        <div className="flex flex-col lg:flex-row items-start gap-8">
            <div className="w-full lg:w-72 flex-shrink-0">
                <div className="bg-slate-50/80 p-2 rounded-2xl flex lg:flex-col flex-wrap gap-1 overflow-x-auto lg:overflow-visible no-scrollbar">
                    {ROLES.map(role => (
                        <div key={role.name} className="flex-shrink-0 lg:w-full">
                            <VerticalTab role={role.name} color={role.color} active={activeRole === role.name} onClick={() => setActiveRole(role.name)} />
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex-1 w-full">
                <motion.div key={activeRole} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-slate-100 rounded-3xl p-6 md:p-10 shadow-sm relative overflow-hidden">
                    <AnimatePresence>
                        {success && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-white/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-center p-10">
                                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                                    <CheckCircle2 size={40} strokeWidth={2.5} />
                                </div>
                                <h2 className="text-2xl font-black text-slate-900 mb-2">Onboarding Successful!</h2>
                                <p className="text-slate-500 font-medium">The new {activeRole} has been registered.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="flex items-center space-x-5 mb-10 pb-6 border-b border-slate-50">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: currentRole.color }}>
                            <UserPlus size={24} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">Add {activeRole}</h2>
                            <p className="text-slate-400 text-xs font-semibold mt-1">Personnel Information & Credentials</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        {activeRole !== 'Chief Administrative Officer' && (
                            <div className="md:col-span-2">
                                <SelectField label={`Select Parent ${getParentLabel(activeRole)}`} icon={UserCircle2}
                                    value={formData.parentId} onChange={val => setFormData({ ...formData, parentId: val })}
                                    options={parentUsers} loading={fetchingParents} />
                            </div>
                        )}
                        <InputField label="Contact Primary" icon={Smartphone} placeholder="86697XXXXX"
                            value={formData.contactNumber} onChange={val => setFormData({ ...formData, contactNumber: val })} />
                        <div className="md:col-span-2">
                            <InputField label={`${activeRole} Full Name`} icon={UserCircle2} placeholder="Enter full legal name"
                                value={formData.name} onChange={val => setFormData({ ...formData, name: val })} />
                        </div>
                        <div className="md:col-span-2">
                            <InputField label="Registered Address" icon={MapPin} placeholder="Current residential address"
                                value={formData.address} onChange={val => setFormData({ ...formData, address: val })} />
                        </div>
                    </div>

                    <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-white rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 shadow-sm">
                                    <Upload size={20} />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 text-sm">Identity Documentation</p>
                                    <p className="text-[10px] font-semibold text-slate-400">PDF, PNG or JPG max 5MB</p>
                                </div>
                            </div>
                            <label className="w-full sm:w-auto px-6 py-3 bg-white border border-slate-200 rounded-xl text-[11px] font-black tracking-widest text-slate-600 cursor-pointer hover:border-violet-600 hover:text-violet-600 transition-all text-center">
                                CHOOSE FILE
                                <input type="file" className="hidden" onChange={handleFileChange} />
                            </label>
                        </div>
                        <AnimatePresence>
                            {idProof && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                    className="mt-6 pt-6 border-t border-slate-200/60">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 overflow-hidden flex items-center justify-center">
                                                {filePreview === 'document' ? <FileText size={24} className="text-slate-300" /> : <img src={filePreview} alt="Preview" className="w-full h-full object-cover" />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">{idProof.name}</p>
                                                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">{(idProof.size / (1024 * 1024)).toFixed(2)} MB</p>
                                            </div>
                                        </div>
                                        <button onClick={() => { setIdProof(null); setFilePreview(null); }} className="p-2 text-slate-300 hover:text-rose-500 transition-all">
                                            <X size={18} />
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {error && (
                        <div className="mt-6 p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-500 text-xs font-bold text-center">
                            Registration failed: {typeof error === 'string' ? error : 'Please try again.'}
                        </div>
                    )}

                    <div className="mt-10 pt-8 border-t border-slate-50 flex flex-col sm:flex-row gap-3">
                        <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                            disabled={loading || !formData.name || !formData.contactNumber}
                            onClick={handleOnboarding}
                            className="flex-1 py-4 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-xl shadow-slate-100 hover:bg-slate-800 disabled:opacity-50 transition-all flex items-center justify-center space-x-2">
                            {loading ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} strokeWidth={2.5} />}
                            <span>{loading ? 'Processing...' : 'Confirm Onboarding'}</span>
                        </motion.button>
                        <button onClick={handleClear} className="px-8 py-4 bg-slate-50 text-slate-400 rounded-xl font-bold text-sm hover:text-rose-500 hover:bg-rose-50 transition-all flex items-center justify-center space-x-2">
                            <Eraser size={18} /><span>Clear</span>
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const Team = () => {
    const [activeTab, setActiveTab] = useState('onboarding');

    return (
        <div className="animate-fade-in font-sans space-y-6 pb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900">Resource Planning</h1>
                    <p className="text-sm text-slate-500 font-medium">Configure team authority and access</p>
                </div>
                <div className="flex items-center border-b-2 border-slate-100 gap-1">
                    {['onboarding', 'directory'].map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)}
                            className={`relative px-5 py-2.5 text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'text-violet-600' : 'text-slate-400 hover:text-slate-700'}`}>
                            {tab === 'onboarding' ? '+ Onboarding' : 'Directory'}
                            {activeTab === tab && (
                                <motion.div layoutId="tab-indicator" className="absolute bottom-[-2px] left-0 right-0 h-0.5 bg-violet-600 rounded-full" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'onboarding' ? (
                    <motion.div key="onboarding" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <OnboardingView />
                    </motion.div>
                ) : (
                    <motion.div key="directory" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <DirectoryView />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Team;
