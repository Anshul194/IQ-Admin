import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Lock, Eye, EyeOff, ArrowRight, Sparkles, ChevronLeft } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../store/slices/authSlice';

const Login = () => {
    const [contactNumber, setContactNumber] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { loading, error } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        dispatch(loginUser({ contactNumber, password }));
    };

    const handleBackToHome = () => {
        navigate('/');
    };

    return (
        <div className="min-h-screen w-full flex bg-[#fdfcff] font-sans overflow-hidden">
            {/* Left Side: Branding/Visual */}
            <div className="hidden lg:flex lg:w-1/2 p-16 bg-[#f7f4ff] flex-col justify-between relative">
                <div>
                    <img src="/logo-1.png" alt="Navodaya Wala" className="h-12 w-auto object-contain" />
                </div>

                <div className="max-w-lg w-full space-y-12 relative z-10 my-auto pt-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-violet-100/50 rounded-full text-violet-600 text-[10px] font-black uppercase tracking-widest mb-6 border border-violet-200/50">
                            <Sparkles size={12} />
                            <span>v5.0 Enterprise Release</span>
                        </div>
                        <h1 className="text-6xl font-black text-slate-900 leading-[1.05] tracking-tight">
                            Build the <span className="premium-text-gradient">Future</span> of Learning.
                        </h1>
                        <p className="mt-8 text-lg text-slate-500 font-medium leading-relaxed">
                            Empowering educators with predictive analytics, seamless team management,
                            and a beautiful administrative interface designed for efficiency.
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

                    <div className="pt-10 flex items-center space-x-6">
                        <div className="flex -space-x-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-12 h-12 rounded-2xl border-4 border-[#f7f4ff] bg-violet-200 overflow-hidden shadow-sm">
                                    <div className="w-full h-full bg-violet-100 flex items-center justify-center text-[10px] font-black text-violet-600">USR</div>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-loose">Trusted by leading <br /> institutions globally</p>
                    </div>
                </div>

                {/* Royal Lavender Accents */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-violet-400/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-fuchsia-400/10 rounded-full blur-[140px]"></div>
            </div>

            {/* Right Side: Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:px-24 md:py-16 bg-white relative">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-md space-y-12"
                >
                    <button onClick={handleBackToHome}
                        className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors mb-6">
                        <ChevronLeft size={14} /> Back to Home
                    </button>

                    <div className="lg:hidden flex justify-center mb-8">
                        <img src="/logo-1.png" alt="Navodaya Wala" className="h-12 w-auto object-contain" />
                    </div>

                    <div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Welcome Back</h2>
                        <p className="mt-3 text-slate-400 font-semibold">Sign in to your administrative workspace.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Secure Contact ID</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-300 group-focus-within:text-violet-600 transition-colors">
                                    <Phone size={18} strokeWidth={2.5} />
                                </div>
                                <input
                                    type="tel"
                                    placeholder="8888 888 888"
                                    className="w-full pl-14 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-8 focus:ring-violet-500/5 focus:border-violet-500/30 focus:bg-white transition-all font-bold text-slate-700 placeholder:text-slate-300"
                                    value={contactNumber}
                                    onChange={(e) => setContactNumber(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Access Credentials</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-300 group-focus-within:text-violet-600 transition-colors">
                                    <Lock size={18} strokeWidth={2.5} />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    className="w-full pl-14 pr-14 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-8 focus:ring-violet-500/5 focus:border-violet-500/30 focus:bg-white transition-all font-bold text-slate-700 placeholder:text-slate-300"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-5 flex items-center text-slate-300 hover:text-violet-600 transition-colors"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider px-1 text-slate-400">
                            <label className="flex items-center space-x-2 cursor-pointer group">
                                <input type="checkbox" className="w-4 h-4 rounded-md border-slate-200 text-violet-600 focus:ring-violet-500 cursor-pointer" />
                                <span className="group-hover:text-slate-900 transition-all">Keep Connected</span>
                            </label>
                            <a href="#" className="text-violet-600 hover:text-violet-700 transition-colors">Reset Access</a>
                        </div>

                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-rose-50 border border-rose-100 text-rose-500 p-4 rounded-xl text-[10px] font-black text-center uppercase tracking-widest"
                                >
                                    Error: {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button
                            disabled={loading}
                            type="submit"
                            className="w-full premium-gradient text-white py-5 rounded-[24px] font-black text-lg shadow-2xl shadow-violet-200 flex items-center justify-center space-x-3 hover:opacity-90 disabled:opacity-70 transition-all active:scale-95"
                        >
                            <span className="tracking-widest uppercase text-sm">{loading ? 'Verifying...' : 'Authenticate'}</span>
                            {!loading && <ArrowRight size={20} strokeWidth={3} />}
                        </button>
                    </form>

                        <div className="pt-4 flex flex-col items-center space-y-4">
                            <div className="flex space-x-8">
                                <div className="w-1.5 h-1.5 bg-slate-200 rounded-full"></div>
                                <div className="w-1.5 h-1.5 bg-slate-200 rounded-full"></div>
                                <div className="w-1.5 h-1.5 bg-slate-200 rounded-full"></div>
                            </div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em]">
                                System Security Level: <span className="text-slate-900">Alpha-7</span>
                            </p>
                        </div>
                </motion.div>

                {/* Legal / Help link absolute */}
                <div className="absolute bottom-10 flex space-x-6 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                    <a href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-slate-900 transition-colors">Service Terms</a>
                </div>
            </div>
        </div>
    );
};

export default Login;
