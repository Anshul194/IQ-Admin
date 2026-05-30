import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Calendar, X, Loader2, FileSpreadsheet } from 'lucide-react';
import api from '../../utils/api';

const ExportMenu = ({ exportType, label = "Export Data" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(false);

    const handleExport = async () => {
        setLoading(true);
        try {
            const separator = exportType.includes('?') ? '&' : '?';
            let url = `/export/${exportType}${separator}`;
            if (startDate) url += `startDate=${startDate}&`;
            if (endDate) url += `endDate=${endDate}&`;

            const response = await api.get(url, { responseType: 'blob' });

            // Check if response is actually a blob
            const blobData = response instanceof Blob ? response : new Blob([response]);

            const downloadUrl = window.URL.createObjectURL(blobData);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute('download', `${exportType}_export_${new Date().toISOString().split('T')[0]}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(downloadUrl);

            setIsOpen(false);
        } catch (error) {
            console.error('Export failed:', error);
            alert('Export failed. Please check if the filter dates are correct.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative inline-block text-left z-[50]">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 text-xs font-bold hover:bg-slate-50 transition-all shadow-sm hover:border-slate-300 relative z-10"
            >
                <Download size={16} className="text-violet-500" />
                <span>{label}</span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 z-40"
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 top-full mt-3 w-80 bg-white rounded-3xl shadow-2xl border border-slate-100 z-[100] p-6 space-y-5"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-violet-50 text-violet-600 rounded-lg flex items-center justify-center">
                                        <FileSpreadsheet size={16} />
                                    </div>
                                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Generator</h3>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1.5 hover:bg-slate-50 text-slate-400 rounded-lg transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            </div>

                            <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50 space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">From Date</label>
                                    <div className="relative group">
                                        <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-violet-500 transition-colors" />
                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-4 focus:ring-violet-500/5 focus:border-violet-500/40 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">To Date</label>
                                    <div className="relative group">
                                        <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-violet-500 transition-colors" />
                                        <input
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-4 focus:ring-violet-500/5 focus:border-violet-500/40 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleExport}
                                disabled={loading}
                                className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-200 disabled:opacity-50"
                            >
                                {loading ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    <Download size={16} />
                                )}
                                {loading ? 'Fetching...' : 'Process Export'}
                            </button>

                            <p className="text-[9px] text-center text-slate-400 font-bold uppercase tracking-tight">Format: Microsoft Excel (.xlsx)</p>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ExportMenu;
