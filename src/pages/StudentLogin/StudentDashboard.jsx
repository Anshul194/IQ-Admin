import React from 'react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutStudent } from '../../store/slices/studentAuthSlice';
import { User, GraduationCap, Languages, Calendar, Phone, LogOut, BookOpen, BarChart3, Award, Clock } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${color}`}>
                <Icon size={24} strokeWidth={2.5} />
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
                <p className="text-2xl font-black text-slate-900 mt-1">{value}</p>
            </div>
        </div>
    </div>
);

const StudentDashboard = () => {
    const { user } = useSelector((state) => state.studentAuth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logoutStudent());
        navigate('/student/login');
    };

    if (!user) {
        navigate('/student/login');
        return null;
    }

    return (
        <div className="min-h-screen bg-[#fdfcff] font-sans">
            <header className="bg-white border-b border-slate-100 px-6 md:px-10 py-4">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src="/logo-1.png" alt="Navodaya Wala" className="h-10 w-auto object-contain" />
                        <span className="text-lg font-black text-slate-900 hidden sm:inline">Student Dashboard</span>
                    </div>
                    <button onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 rounded-xl font-bold text-xs hover:bg-rose-100 transition-all">
                        <LogOut size={14} /> Logout
                    </button>
                </div>
            </header>

            <main className="max-w-6xl mx-auto p-6 md:p-10 space-y-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-slate-100 rounded-[32px] p-8 md:p-10 shadow-sm">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-violet-50 rounded-2xl flex items-center justify-center text-violet-600">
                            <User size={40} strokeWidth={1.5} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Welcome, {user.studentName}!</h1>
                            <p className="text-sm font-semibold text-slate-400 mt-1">Grade {user.grade} • Student ID: #{user.studentId?.slice(-8)}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                            <Phone size={16} className="text-slate-400" />
                            <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Mobile</p>
                                <p className="text-sm font-bold text-slate-900">{user.mobileNumber || '—'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                            <GraduationCap size={16} className="text-slate-400" />
                            <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Grade</p>
                                <p className="text-sm font-bold text-slate-900">{user.grade || '—'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                            <Languages size={16} className="text-slate-400" />
                            <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Language</p>
                                <p className="text-sm font-bold text-slate-900">{user.language || '—'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                            <User size={16} className="text-slate-400" />
                            <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Role</p>
                                <p className="text-sm font-bold text-slate-900 capitalize">{user.role || 'Student'}</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard icon={BookOpen} label="Enrolled Courses" value="4" color="bg-violet-50 text-violet-600" />
                    <StatCard icon={BarChart3} label="Completed" value="12" color="bg-emerald-50 text-emerald-600" />
                    <StatCard icon={Award} label="Achievements" value="3" color="bg-amber-50 text-amber-600" />
                </div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-slate-100 rounded-[32px] p-8 md:p-10 shadow-sm">
                    <h2 className="text-xl font-black text-slate-900 tracking-tight mb-6">Recent Activity</h2>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                                <Clock size={16} className="text-slate-400" />
                                <div>
                                    <p className="text-sm font-bold text-slate-900">Sample Activity {i}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">2 days ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default StudentDashboard;
