import { motion } from 'framer-motion';
import { FileText, Award, Download, Eye } from 'lucide-react';

const ReportCertificateSection = () => {
    return (
        <section id="reports" className="relative py-28 px-6 bg-white overflow-hidden">
            {/* Subtle background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-[#0845A5]/5 rounded-full blur-[100px] -z-0" />
            
            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[#F14E2B] mb-3 block">
                        Official Credentials
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-6">
                        Your Personalized IQ Assessment
                        <br />
                        <span className="text-[#0845A5]">Report & Certificate</span>
                    </h2>
                    <p className="text-slate-500 font-medium text-sm md:text-base leading-relaxed">
                        Complete the assessment to receive a professionally designed IQ Test Report with your detailed performance insights and a personalized certificate.
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                    {/* Report Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="group relative bg-slate-50 rounded-[2.5rem] border border-slate-200/80 p-8 hover:border-[#0845A5]/30 hover:bg-white hover:shadow-2xl hover:shadow-slate-200/80 transition-all duration-500 flex flex-col justify-between"
                    >
                        <div>
                            {/* Card Header */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-[#0845A5]/10 flex items-center justify-center">
                                    <FileText size={20} className="text-[#0845A5]" />
                                </div>
                                <div>
                                    <span className="text-[9px] font-black uppercase tracking-wider text-[#0845A5] bg-[#0845A5]/10 px-2.5 py-1 rounded-full">
                                        Diagnostic
                                    </span>
                                    <h3 className="font-black text-slate-900 text-lg mt-1">Sample IQ Test Report</h3>
                                </div>
                            </div>

                            {/* Image Showcase */}
                            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm group-hover:shadow-md transition-all duration-500 aspect-[3/4]">
                                <img
                                    src="/report-1-5.png"
                                    alt="Sample IQ Test Report"
                                    className="w-full h-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-700"
                                />
                                {/* View Overlay */}
                                <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                                    <a 
                                        href="/report-1-5.png" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="p-4 bg-white text-slate-900 rounded-full shadow-xl hover:bg-[#0845A5] hover:text-white transition-all duration-300 transform scale-90 group-hover:scale-100"
                                    >
                                        <Eye size={22} />
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Footer details */}
                        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                                4 Pages • Detailed Analytics
                            </p>
                            <a 
                                href="/report-1-5.png"
                                download
                                className="flex items-center gap-1.5 text-xs font-black text-[#0845A5] hover:text-[#06388a] uppercase tracking-wider transition-colors"
                            >
                                <Download size={14} /> Download Sample
                            </a>
                        </div>
                    </motion.div>

                    {/* Certificate Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="group relative bg-slate-50 rounded-[2.5rem] border border-slate-200/80 p-8 hover:border-[#F14E2B]/30 hover:bg-white hover:shadow-2xl hover:shadow-slate-200/80 transition-all duration-500 flex flex-col justify-between"
                    >
                        <div>
                            {/* Card Header */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-[#F14E2B]/10 flex items-center justify-center">
                                    <Award size={20} className="text-[#F14E2B]" />
                                </div>
                                <div>
                                    <span className="text-[9px] font-black uppercase tracking-wider text-[#F14E2B] bg-[#F14E2B]/10 px-2.5 py-1 rounded-full">
                                        Official Credential
                                    </span>
                                    <h3 className="font-black text-slate-900 text-lg mt-1">Sample IQ Test Certificate</h3>
                                </div>
                            </div>

                            {/* Image Showcase */}
                            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm group-hover:shadow-md transition-all duration-500 aspect-[3/4]">
                                <img
                                    src="/certificate-1-5.png"
                                    alt="Sample IQ Test Certificate"
                                    className="w-full h-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-700"
                                />
                                {/* View Overlay */}
                                <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                                    <a 
                                        href="/certificate-1-5.png" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="p-4 bg-white text-slate-900 rounded-full shadow-xl hover:bg-[#F14E2B] hover:text-white transition-all duration-300 transform scale-90 group-hover:scale-100"
                                    >
                                        <Eye size={22} />
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Footer details */}
                        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                                Verified • Shareable Credential
                            </p>
                            <a 
                                href="/certificate-1-5.png"
                                download
                                className="flex items-center gap-1.5 text-xs font-black text-[#F14E2B] hover:text-[#d33a1a] uppercase tracking-wider transition-colors"
                            >
                                <Download size={14} /> Download Sample
                            </a>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default ReportCertificateSection;
