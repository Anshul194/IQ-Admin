import React from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    School,
    ArrowUpRight,
    MoreHorizontal,
    Search,
    Filter,
    Trash2,
    Calendar,
    Layers,
    ArrowDownRight
} from 'lucide-react';

const StatCard = ({ title, value, percentage, icon: Icon, color, trend, trendUp }) => (
    <motion.div
        whileHover={{ y: -4 }}
        className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between h-full group transition-all"
    >
        <div className="flex items-start justify-between">
            <div className={`p-3 rounded-xl`} style={{ backgroundColor: `${color}10`, color }}>
                <Icon size={22} />
            </div>
            <div className={`flex items-center space-x-1 font-bold text-xs ${trendUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                <span>{trend}%</span>
                {trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            </div>
        </div>

        <div className="mt-6">
            <h3 className="text-slate-400 font-bold text-[11px] uppercase tracking-wider">{title}</h3>
            <div className="flex items-end justify-between mt-1">
                <span className="text-2xl font-bold text-slate-800 tracking-tight">{value}</span>
                <div className="w-11 h-11 relative flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle cx="22" cy="22" r="18" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-50" />
                        <circle cx="22" cy="22" r="18" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray={113} strokeDashoffset={113 - (113 * percentage) / 100} className="transition-all duration-1000 ease-out" style={{ color }} />
                    </svg>
                    <span className="absolute text-[9px] font-black" style={{ color }}>{percentage}%</span>
                </div>
            </div>
        </div>
    </motion.div>
);

const Dashboard = () => {
    const stats = [
        { title: 'Total Registered Students', value: '8,937', percentage: 75, icon: Users, color: '#6366f1', trend: '12.5', trendUp: true },
        { title: 'Registered Schools', value: '1,664', percentage: 62, icon: School, color: '#06b6d4', trend: '8.7', trendUp: true },
        { title: 'Teaching Teams Created', value: '50', percentage: 45, icon: Layers, color: '#f59e0b', trend: '2.1', trendUp: false },
    ];

    const recentAdmissions = [
        { id: '9162', name: 'Anshul', contact: '7014628523', address: 'Delhi', coordinator: 'Shriisagar Mali', school: 'Dynamic English Medium' },
        { id: '9109', name: 'Anjali Shinde', contact: '9405266005', address: 'MiraJ', coordinator: 'Aniruddha Mane', school: 'Ideal English School' },
        { id: '9108', name: 'Aniruddha A.', contact: '8080772202', address: 'MiraJ', coordinator: 'Aniruddha Mane', school: 'Ideal English School' },
        { id: '9067', name: 'Arav Jay Gavall', contact: '9028287977', address: 'MiraJ', coordinator: 'Aniruddha Mane', school: 'M. E. S. English School' },
    ];

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            {/* Top Welcome Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-800 tracking-tight">Academic Dashboard <span className="text-slate-400 font-medium ml-1">2024-25</span></h1>
                    <p className="text-sm text-slate-500 font-medium">Monitoring platform-wide educational activity</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <button className="flex items-center space-x-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 text-xs font-bold hover:bg-slate-50 transition-all">
                        <Calendar size={16} />
                        <span>Past 30 Days</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-lg shadow-slate-100 hover:bg-slate-800 transition-all">
                        <Filter size={16} />
                        <span>Advanced Filters</span>
                    </button>
                </div>
            </div>

            {/* Stats Summary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((stat, idx) => (
                    <StatCard key={idx} {...stat} />
                ))}
            </div>

            {/* Data Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-50">
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-violet-50 text-violet-600 rounded-xl flex items-center justify-center">
                            <Users size={20} />
                        </div>
                        <h2 className="text-lg font-bold text-slate-800">Recent Applications</h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative flex-1 sm:flex-none">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-xs font-semibold w-full sm:w-48 focus:ring-2 focus:ring-violet-500/10"
                            />
                        </div>
                        <button className="text-xs font-bold text-violet-600 px-3 py-2 bg-violet-50 rounded-xl hover:bg-indigo-100 transition-colors">Export CSV</button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">ID</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Candidate Profile</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contact</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Coordinator</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Institution</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {recentAdmissions.map((row) => (
                                <tr key={row.id} className="hover:bg-slate-50/30 transition-colors group">
                                    <td className="px-6 py-5 text-center text-xs font-bold text-slate-400">#{row.id}</td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 font-bold text-[10px]">
                                                {row.name.substring(0, 1)}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-700">{row.name}</span>
                                                <span className="text-[10px] font-semibold text-slate-400">{row.address}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-xs font-semibold text-slate-500">{row.contact}</td>
                                    <td className="px-6 py-5">
                                        <span className="text-[10px] font-bold bg-violet-50 text-violet-600 px-2.5 py-1 rounded-full uppercase tracking-tighter">
                                            {row.coordinator}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-xs font-semibold text-slate-500">{row.school}</td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all">
                                                <Trash2 size={16} />
                                            </button>
                                            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                                                <MoreHorizontal size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 bg-slate-50/30 flex justify-center border-t border-slate-50">
                    <button className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] hover:text-violet-600 transition-colors">Load More Records</button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
