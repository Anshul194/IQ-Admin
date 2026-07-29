import { motion } from 'framer-motion';
import { Check, FileText, Download, Eye } from 'lucide-react';

const CareerReportSection = () => {
    const points = [
        "Top Career Recommendations",
        "Career Interest Profile",
        "Strengths and Natural Abilities",
        "Personality Assessment",
        "Subject-wise Aptitude Analysis",
        "Suitable Streams after Class 10th",
        "Recommended Career Options",
        "Detailed Performance Analysis",
        "Personalized Career Guidance"
    ];

    return (
        <section id="career-report" className="relative py-28 px-6 bg-white overflow-hidden">
            {/* Subtle background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-[#0845A5]/5 rounded-full blur-[100px] -z-0" />
            
            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[#F14E2B] mb-3 block">
                        Detailed Diagnostic Report
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-6">
                        Your Personalized Career
                        <br />
                        <span className="text-[#0845A5]">Aptitude Assessment Report</span>
                    </h2>
                    <p className="text-slate-500 font-medium text-sm md:text-base leading-relaxed">
                        Complete the assessment to receive a professionally designed Career Aptitude Assessment Report featuring your:
                    </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-16 items-center max-w-6xl mx-auto">
                    
                    {/* Left: Certificate/Report Image */}
                    <div className="lg:col-span-6 w-full">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
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
                                            Sample Report
                                        </span>
                                        <h3 className="font-black text-slate-900 text-lg mt-1">Career Aptitude Report</h3>
                                    </div>
                                </div>

                                {/* Image Showcase */}
                                <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm group-hover:shadow-md transition-all duration-500 aspect-[1.414/1]">
                                    <img
                                        src="/certificate-6-12.png"
                                        alt="Sample Career Aptitude Test Assessment & Report"
                                        className="w-full h-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-700"
                                    />
                                    {/* View Overlay */}
                                    <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                                        <a 
                                            href="/certificate-6-12.png" 
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
                                    Official A4 Layout
                                </p>
                                <a 
                                    href="/certificate-6-12.png"
                                    download
                                    className="flex items-center gap-1.5 text-xs font-black text-[#0845A5] hover:text-[#06388a] uppercase tracking-wider transition-colors"
                                >
                                    <Download size={14} /> Download Sample
                                </a>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right: Points Checklist */}
                    <div className="lg:col-span-6 flex flex-col justify-center">
                        <div className="space-y-5">
                            {points.map((point, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: i * 0.05 }}
                                    className="flex items-center gap-4 group"
                                >
                                    <div className="shrink-0 w-8 h-8 rounded-xl bg-[#F14E2B]/10 flex items-center justify-center group-hover:bg-[#F14E2B] transition-colors duration-300">
                                        <Check size={16} className="text-[#F14E2B] group-hover:text-white transition-colors duration-300" />
                                    </div>
                                    <span className="text-slate-800 text-base font-semibold group-hover:text-[#0845A5] transition-colors duration-300">
                                        {point}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default CareerReportSection;
