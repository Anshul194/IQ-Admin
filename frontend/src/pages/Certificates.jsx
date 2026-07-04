import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyCertificates, getMyResults } from '../store/slices/assessmentSlice';
import { downloadCertificate, downloadReport } from '../utils/api';
import MainLayout from '../components/MainLayout';
import { Award, Download, ShieldCheck, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Certificates = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { certificates, results, loading } = useSelector((state) => state.assessment);
    const { user } = useSelector((state) => state.auth);
    const [downloading, setDownloading] = useState({});
    const [downloadingReport, setDownloadingReport] = useState({});
    const [activeTab, setActiveTab] = useState('certificates'); // 'certificates' or 'reports'

    useEffect(() => {
        dispatch(getMyCertificates());
        dispatch(getMyResults());
    }, [dispatch]);

    return (
        <MainLayout user={user}>
            <div className="p-6 md:p-10 lg:p-12 max-w-7xl mx-auto space-y-8">
                <header>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Credentials</h1>
                    <p className="text-slate-500 font-medium">Manage and download your officially verified achievement certificates and assessment report cards.</p>
                </header>

                {/* Tab Navigation */}
                <div className="flex border-b border-slate-100 pb-px">
                    <button
                        onClick={() => setActiveTab('certificates')}
                        className={`pb-4 px-6 font-bold text-sm tracking-tight transition-all relative ${
                            activeTab === 'certificates' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
                        }`}
                    >
                        Certificates
                        {activeTab === 'certificates' && (
                            <motion.div
                                layoutId="activeTabIndicator"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full"
                            />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('reports')}
                        className={`pb-4 px-6 font-bold text-sm tracking-tight transition-all relative ${
                            activeTab === 'reports' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
                        }`}
                    >
                        Reports
                        {activeTab === 'reports' && (
                            <motion.div
                                layoutId="activeTabIndicator"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full"
                            />
                        )}
                    </button>
                </div>

                {loading ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : activeTab === 'certificates' ? (
                    certificates?.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-32 bg-white border border-dashed border-slate-200 rounded-[32px] text-center space-y-4">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                                <Award size={40} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">No Certificates Earned</h3>
                                <p className="text-slate-500 text-sm max-w-xs mx-auto">Complete assessments with a 'Passed' status to earn your official merit certificates.</p>
                            </div>
                            <button onClick={() => navigate('/dashboard')} className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-indigo-100">Try Assessment</button>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {certificates.map((cert, i) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    key={cert._id}
                                    className="group bg-white border border-slate-200 rounded-[32px] p-8 space-y-6 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all border-b-4 hover:border-indigo-600 cursor-default"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                                            <Award size={28} strokeWidth={2.5} />
                                        </div>
                                        <ShieldCheck className="text-emerald-500" size={24} />
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="text-lg font-black text-slate-900 leading-tight">
                                            {cert.isAptitude ? 'Career Aptitude Test' : (parseInt(user?.grade) <= 6 ? 'IQ TEST' : 'Career Test')}
                                        </h4>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-relaxed">Issued on {new Date(cert.createdAt).toLocaleDateString()}</p>
                                    </div>

                                    <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                                        <div className="flex-1">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Verify ID</p>
                                            <p className="text-xs font-mono font-bold text-slate-600 uppercase">
                                                {cert.isAptitude ? 'CAREER-' : 'IQ-'}{cert._id.slice(-8).toUpperCase()}
                                            </p>
                                        </div>
                                        <button
                                            onClick={async () => {
                                                setDownloading(prev => ({ ...prev, [cert._id]: true }));
                                                try {
                                                    await downloadCertificate(cert._id, cert.isAptitude);
                                                } catch (error) {
                                                    console.error('Download failed:', error);
                                                } finally {
                                                    setDownloading(prev => ({ ...prev, [cert._id]: false }));
                                                }
                                            }}
                                            disabled={!!downloading[cert._id]}
                                            className="p-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {downloading[cert._id] ? (
                                                <div className="w-[18px] h-[18px] border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <Download size={18} />
                                            )}
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )
                ) : (
                    results?.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-32 bg-white border border-dashed border-slate-200 rounded-[32px] text-center space-y-4">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                                <FileText size={40} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">No Assessment Reports</h3>
                                <p className="text-slate-500 text-sm max-w-xs mx-auto">Complete assessments to view and download your full diagnostic report cards.</p>
                            </div>
                            <button onClick={() => navigate('/dashboard')} className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-indigo-100">Try Assessment</button>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {results.map((report, i) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    key={report._id}
                                    className="group bg-white border border-slate-200 rounded-[32px] p-8 space-y-6 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all border-b-4 hover:border-indigo-600 cursor-default"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                                            <FileText size={28} strokeWidth={2.5} />
                                        </div>
                                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                                            report.status === 'PASSED' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                                        }`}>
                                            {report.status}
                                        </span>
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="text-lg font-black text-slate-900 leading-tight">
                                            {report.isAptitude ? 'Career Aptitude Report' : 'IQ Test Report'}
                                        </h4>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-relaxed">Completed on {new Date(report.createdAt).toLocaleDateString()}</p>
                                    </div>

                                    <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                                        <div className="flex-1">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                                                {report.isAptitude ? 'Grand Total' : 'IQ Score'}
                                            </p>
                                            <p className="text-xs font-mono font-bold text-slate-600 uppercase">
                                                {report.isAptitude ? `${report.academicGrandTotal || 0} Marks` : (report.iqScore ? report.iqScore.toFixed(3) : 'N/A')}
                                            </p>
                                        </div>
                                        <button
                                            onClick={async () => {
                                                setDownloadingReport(prev => ({ ...prev, [report._id]: true }));
                                                try {
                                                    await downloadReport(report._id, report.isAptitude);
                                                } catch (error) {
                                                    console.error('Download failed:', error);
                                                } finally {
                                                    setDownloadingReport(prev => ({ ...prev, [report._id]: false }));
                                                }
                                            }}
                                            disabled={!!downloadingReport[report._id]}
                                            className="p-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {downloadingReport[report._id] ? (
                                                <div className="w-[18px] h-[18px] border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <Download size={18} />
                                            )}
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )
                )}
            </div>
        </MainLayout>
    );
};

export default Certificates;
