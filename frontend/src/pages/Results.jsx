import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyResults } from '../store/slices/assessmentSlice';
import MainLayout from '../components/MainLayout';
import { History, Calendar, CheckCircle, XCircle, Search, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Results = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { results, loading } = useSelector((state) => state.assessment);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(getMyResults());
    }, [dispatch]);

    return (
        <MainLayout user={user}>
            <div className="p-6 md:p-10 lg:p-12 max-w-7xl mx-auto space-y-8">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Assessment History</h1>
                        <p className="text-slate-500 font-medium">Review your performance across all diagnostic sessions.</p>
                    </div>
                </header>

                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-slate-500">
                            <History size={16} />
                            <span className="text-xs font-black uppercase tracking-widest">{results?.length || 0} Total Sessions</span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50 text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 border-b border-slate-100">
                                    <th className="px-8 py-5">Session Date</th>
                                    <th className="px-8 py-5">Diagnostic Program</th>
                                    <th className="px-8 py-5">Performance</th>
                                    <th className="px-8 py-5">Status</th>
                                    <th className="px-8 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading ? (
                                    <tr><td colSpan="5" className="px-8 py-20 text-center text-slate-400 font-bold animate-pulse">Retrieving session logs...</td></tr>
                                ) : results?.length === 0 ? (
                                    <tr><td colSpan="5" className="px-8 py-20 text-center text-slate-300 font-bold uppercase tracking-widest text-xs">No records found in archive.</td></tr>
                                ) : (
                                    results.map((res) => (
                                        <tr key={res._id} className="hover:bg-slate-50 transition-colors group">
                                            <td className="px-8 py-5">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-slate-900">{new Date(res.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                                    <span className="text-[10px] text-slate-400 font-mono">{new Date(res.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded">
                                                        <FileText size={16} />
                                                    </div>
                                                    <span className="text-sm font-bold text-slate-700">
                                                        {res.isAptitude ? 'Career Aptitude Test' : (parseInt(user?.grade) <= 6 ? 'IQ TEST' : 'Career Test')}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden">
                                                            <div className="h-full bg-slate-900" style={{ width: `${res.percentage || 0}%` }} />
                                                        </div>
                                                        <span className="text-xs font-black text-slate-900">{res.percentage}%</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${res.status === 'PASSED' || res.isAptitude
                                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                    : 'bg-rose-50 text-rose-600 border-rose-100'
                                                    }`}>
                                                    {(res.status === 'PASSED' || res.isAptitude) ? <CheckCircle size={12} /> : <XCircle size={12} />}
                                                    {res.isAptitude ? 'COMPLETED' : (res.status === 'PASSED' ? 'PASSED' : res.status)}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <button
                                                    onClick={() => navigate(`/results/${res._id}?type=${res.isAptitude ? 'aptitude' : 'standard'}`)}
                                                    className="px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 rounded transition-all"
                                                >
                                                    Analysis
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Results;
