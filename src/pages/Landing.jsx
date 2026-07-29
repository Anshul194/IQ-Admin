import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen w-full flex bg-[#fdfcff] font-sans overflow-hidden">
            <div className="hidden lg:flex lg:w-1/2 p-16 bg-[#f7f4ff] flex-col justify-between relative">
                <div>
                    <img src="/logo-1.png" alt="Navodaya Wala" className="h-12 w-auto object-contain" />
                </div>
                <div className="max-w-lg w-full space-y-12 relative z-10 my-auto pt-16">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-violet-100/50 rounded-full text-violet-600 text-[10px] font-black uppercase tracking-widest mb-6 border border-violet-200/50">
                            <Sparkles size={12} />
                            <span>v5.0 Enterprise Release</span>
                        </div>
                        <h1 className="text-6xl font-black text-slate-900 leading-[1.05] tracking-tight">
                            Build the <span className="premium-text-gradient">Future</span> of Learning.
                        </h1>
                        <p className="mt-8 text-lg text-slate-500 font-medium leading-relaxed">
                            Empowering educators and students with predictive analytics, seamless management,
                            and a beautiful interface designed for efficiency.
                        </p>
                    </motion.div>
                    <div className="grid grid-cols-2 gap-8 mt-12">
                        <div className="bg-white/60 backdrop-blur-md p-8 rounded-[32px] shadow-sm border border-white">
                            <h3 className="text-4xl font-black text-slate-900 tracking-tighter">12.8k</h3>
                            <p className="text-[10px] text-slate-400 font-black mt-2 uppercase tracking-widest">Active Learners</p>
                        </div>
                        <div className="bg-white/60 backdrop-blur-md p-8 rounded-[32px] shadow-sm border border-white">
                            <h3 className="text-4xl font-black text-slate-900 tracking-tighter">99.99</h3>
                            <p className="text-[10px] text-slate-400 font-black mt-2 uppercase tracking-widest">Uptime SLA</p>
                        </div>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-80 h-80 bg-violet-400/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-fuchsia-400/10 rounded-full blur-[140px]"></div>
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:px-24 md:py-16 bg-white relative">
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
                    className="w-full max-w-md space-y-10">
                    <div className="lg:hidden flex justify-center mb-8">
                        <img src="/logo-1.png" alt="Navodaya Wala" className="h-12 w-auto object-contain" />
                    </div>

                    <div className="text-center space-y-3">
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Welcome to IQ-LMS</h2>
                        <p className="text-slate-400 font-semibold">Choose your login portal to continue.</p>
                    </div>

                    <div className="space-y-5">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate('/student/login')}
                            className="w-full premium-gradient text-white p-6 rounded-[28px] shadow-2xl shadow-violet-200 flex items-center justify-between group hover:opacity-90 transition-all text-left"
                        >
                            <div className="flex items-center gap-5">
                                <div className="p-3 bg-white/20 rounded-xl">
                                    <GraduationCap size={28} strokeWidth={2} />
                                </div>
                                <div>
                                    <p className="font-black text-lg tracking-tight">Student Login</p>
                                    <p className="text-sm text-white/70 font-semibold mt-0.5">Access your learning dashboard</p>
                                </div>
                            </div>
                            <ArrowRight size={24} strokeWidth={2.5} className="opacity-50 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate('/login')}
                            className="w-full bg-slate-900 text-white p-6 rounded-[28px] shadow-2xl shadow-slate-200 flex items-center justify-between group hover:bg-slate-800 transition-all text-left"
                        >
                            <div className="flex items-center gap-5">
                                <div className="p-3 bg-white/10 rounded-xl">
                                    <ShieldCheck size={28} strokeWidth={2} />
                                </div>
                                <div>
                                    <p className="font-black text-lg tracking-tight">Admin Login</p>
                                    <p className="text-sm text-white/60 font-semibold mt-0.5">Manage platform & users</p>
                                </div>
                            </div>
                            <ArrowRight size={24} strokeWidth={2.5} className="opacity-50 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                        </motion.button>
                    </div>

                    <div className="flex flex-col items-center space-y-4 pt-6">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em]">
                            System Security Level: <span className="text-slate-900">Alpha-7</span>
                        </p>
                    </div>
                </motion.div>

                <div className="absolute bottom-10 flex space-x-6 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                    <a href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-slate-900 transition-colors">Service Terms</a>
                </div>
            </div>
        </div>
    );
};

export default Landing;
