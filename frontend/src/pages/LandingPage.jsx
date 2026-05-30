import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Brain, ArrowRight, Star, Users, Shield, CheckCircle2,
    BarChart3, BookOpen, Clock, Award, GraduationCap,
    Target, TrendingUp, Play, Menu, X, Phone, Mail, MapPin,
    Quote, ChevronDown, Sparkles, Database, FileText,
    Calendar, Trophy, CircleUser, Heart, Briefcase
} from 'lucide-react';

const LandingPage = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [openFaq, setOpenFaq] = useState(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 30);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-white text-[#1e293b] font-sans selection:bg-violet-100 selection:text-violet-900">
            {/* Header / Navbar */}
            <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled ? 'bg-white/90 backdrop-blur-xl shadow-lg border-b border-slate-100 py-3' : 'bg-transparent py-6'}`}>
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-200">
                            <Brain size={22} className="text-white" />
                        </div>
                        <div className="flex flex-col -space-y-1">
                            <span className="text-xl font-black tracking-tight text-slate-900">IQ<span className="text-violet-600">Admin</span></span>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Diagnostic 2026</span>
                        </div>
                    </div>

                    <div className="hidden lg:flex items-center gap-10">
                        <a href="#about" className="text-sm font-black uppercase tracking-widest text-slate-500 hover:text-violet-600 transition-colors">About</a>
                        <a href="#schedule" className="text-sm font-black uppercase tracking-widest text-slate-500 hover:text-violet-600 transition-colors">Schedule</a>
                        <a href="#mentors" className="text-sm font-black uppercase tracking-widest text-slate-500 hover:text-violet-600 transition-colors">Mentors</a>
                        <a href="#fees" className="text-sm font-black uppercase tracking-widest text-slate-500 hover:text-violet-600 transition-colors">Fees</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link to="/login" className="hidden sm:block text-sm font-black uppercase tracking-widest text-slate-600 hover:text-violet-600 transition-colors">Login</Link>
                        <Link to="/login" className="px-7 py-3.5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-violet-600 hover:shadow-xl hover:shadow-violet-200 transition-all active:scale-95 shadow-lg shadow-slate-100">
                            Register Now
                        </Link>
                        <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 text-slate-400">
                            <Menu />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Nav */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div initial={{ opacity: 0, x: '100%' }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: '100%' }}
                        className="fixed inset-0 z-[110] bg-white p-6 flex flex-col pt-24">
                        <button onClick={() => setMobileOpen(false)} className="absolute top-6 right-6 p-2"><X /></button>
                        <div className="space-y-6 flex flex-col items-center">
                            {['About', 'Schedule', 'Mentors', 'Fees'].map(l => (
                                <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMobileOpen(false)} className="text-2xl font-black text-slate-900">{l}</a>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hero Section */}
            <section className="relative pt-40 pb-20 px-6 overflow-hidden min-h-screen flex items-center">
                <div className="absolute top-0 right-0 w-[50%] h-full bg-violet-50/50 rounded-l-[120px] -z-10" />
                <div className="absolute top-20 right-20 w-40 h-40 bg-orange-400 rounded-full blur-3xl opacity-20 -z-10" />
                <div className="absolute bottom-20 right-1/4 w-60 h-60 bg-violet-400 rounded-full blur-3xl opacity-10 -z-10" />

                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 items-center gap-20">
                    <div className="space-y-10 relative">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-3 px-5 py-2 bg-violet-50 text-violet-600 rounded-full">
                            <Sparkles size={14} />
                            <span className="text-[10px] font-black uppercase tracking-widest">India's Choice for Diagnostic Testing</span>
                        </motion.div>

                        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                            className="text-6xl md:text-8xl font-black text-slate-900 leading-[1.05] tracking-tight">
                            Know Your Accurate <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">IQ Score</span>
                        </motion.h1>

                        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                            className="text-lg text-slate-500 max-w-xl leading-relaxed">
                            Discover hidden talents and cognitive strengths with our psychometrically validated diagnostic assessment for students. Trusted by 2,000+ schools.
                        </motion.p>

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                            className="flex flex-col sm:flex-row gap-5">
                            <Link to="/login" className="px-10 py-5 bg-violet-600 text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-violet-200 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3">
                                Participate Now <ArrowRight size={18} />
                            </Link>
                            <button className="px-10 py-5 bg-slate-900 text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-slate-200 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3">
                                Sample Report <FileText size={18} />
                            </button>
                        </motion.div>

                        <div className="flex items-center gap-10 pt-10">
                            {[
                                { name: 'Dr. S. K. Gupta', role: 'Psychologist' },
                                { name: 'Dr. Anita Desai', role: 'Educator' },
                                { name: 'Mr. Rajiv Mehta', role: 'Career Expert' }
                            ].map((m, i) => (
                                <div key={i} className="flex items-center gap-3 group cursor-pointer">
                                    <div className="w-12 h-12 bg-slate-100 rounded-2xl overflow-hidden grayscale group-hover:grayscale-0 transition-all border border-slate-200 shadow-sm shadow-slate-100">
                                        <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">
                                            <CircleUser size={24} />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{m.name}</p>
                                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{m.role}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}
                            className="relative z-10 rounded-[60px] overflow-hidden shadow-2xl border-8 border-white">
                            <img src="https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=800" alt="Student" className="w-full h-full object-cover" />
                            <div className="absolute bottom-10 left-10 right-10 p-10 bg-white/10 backdrop-blur-md rounded-[40px] border border-white/20">
                                <div className="text-4xl font-black text-white">MY IQ IS 138</div>
                                <div className="text-xs font-black text-white/70 uppercase tracking-widest mt-2">World Percentile: 98th</div>
                            </div>
                        </motion.div>
                        {/* Decorative circles */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-400 rounded-full -z-0 animate-pulse opacity-20" />
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-violet-600 rounded-full -z-0 animate-bounce opacity-20" />
                    </div>
                </div>
            </section>

            {/* IQ Scale Distribution */}
            <section className="py-28 px-6 bg-[#2dd4bf]/10">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center space-y-6 mb-20 text-[#134e4a]">
                        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight">IQ Scale Distribution</h2>
                        <div className="w-20 h-2 bg-[#134e4a] mx-auto rounded-full" />
                    </div>

                    <div className="relative max-w-4xl mx-auto bg-white/50 backdrop-blur-xl p-12 rounded-[60px] border border-white/40 shadow-xl shadow-[#2dd4bf]/20">
                        {/* Bell Curve Illustration */}
                        <div className="relative h-64 w-full flex items-end justify-center mb-10 overflow-hidden">
                            <svg className="w-full h-full text-[#0d9488]" viewBox="0 0 1000 300" fill="none">
                                <path d="M0,280 C300,280 400,20 500,20 C600,20 700,280 1000,280" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
                                <path d="M0,280 C300,280 400,20 500,20 C600,20 700,280 1000,280 L1000,300 L0,300 Z" fill="currentColor" fillOpacity="0.05" />
                                {/* Grid lines */}
                                {[0, 1, 2, 3, 4, 5, 6].map(i => (
                                    <line key={i} x1={50 + i * 150} y1="280" x2={50 + i * 150} y2="290" stroke="currentColor" strokeWidth="2" />
                                ))}
                            </svg>
                            {/* People Icons along the curve */}
                            <div className="absolute left-1/2 -top-4 -translate-x-1/2 flex flex-col items-center">
                                <span className="p-2 bg-[#0d9488] text-white rounded-lg mb-2 shadow-lg"><Star size={16} /></span>
                                <span className="text-[10px] font-black text-[#0d9488] uppercase">Genius</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-7 text-center">
                            {[70, 85, 100, 115, 130, 145, 160].map(v => (
                                <div key={v} className="flex flex-col items-center space-y-2">
                                    <div className="w-1 h-2 bg-[#0d9488] rounded-full" />
                                    <span className="text-xs font-black text-[#134e4a]">{v}</span>
                                </div>
                            ))}
                        </div>

                        <p className="mt-14 text-center text-[#134e4a] font-bold text-sm max-w-2xl mx-auto leading-relaxed">
                            Our diagnostic platform is designed by clinical psychologists and psychometricians to accurately place your child within the global IQ spectrum with 99.9% reliability.
                        </p>
                    </div>
                </div>
            </section>

            {/* How to Participate */}
            <section id="about" className="py-28 px-6 bg-white overflow-hidden relative">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center">
                    <div className="relative">
                        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                            className="rounded-[80px] overflow-hidden border-8 border-slate-50 shadow-2xl relative z-10 aspect-square">
                            <img src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80&w=800" alt="Child cap" className="w-full h-full object-cover" />
                        </motion.div>
                        {/* Decorative background */}
                        <div className="absolute -top-10 -right-10 w-full h-full bg-slate-50 rounded-[80px] -z-0" />
                        <div className="absolute top-20 -left-10 w-24 h-24 bg-orange-400 rounded-full blur-2xl opacity-10" />
                    </div>

                    <div className="space-y-12">
                        <div className="space-y-4">
                            <h2 className="text-5xl font-black text-slate-900 leading-tight">How to Participate and<br />Where to Register</h2>
                            <p className="text-slate-500 font-bold uppercase text-xs tracking-[0.2em]">Three easy ways to start your journey</p>
                        </div>

                        <div className="space-y-6">
                            {[
                                { icon: Shield, title: 'Direct Child Registration', desc: 'Parents can register their children directly through our secure online portal with verified parent consent.', color: 'border-violet-100 bg-violet-50 text-violet-600' },
                                { icon: Database, title: 'Offline School Registration', desc: 'Contact your school administration or class teacher to participate in the upcoming campus-wide diagnostic.', color: 'border-indigo-100 bg-indigo-50 text-indigo-600' },
                                { icon: GraduationCap, title: 'Registration Through School', desc: 'Download the physical form, fill it out, and submit it to the designated coordinator at your institution.', color: 'border-emerald-100 bg-emerald-50 text-emerald-600' }
                            ].map((s, i) => (
                                <motion.div key={i} whileHover={{ x: 10 }} className={`flex gap-6 p-8 rounded-3xl border transition-all hover:shadow-lg ${s.color}`}>
                                    <div className="shrink-0 w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                                        <s.icon size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-lg text-slate-900 mb-1">{s.title}</h4>
                                        <p className="text-sm text-slate-500 leading-relaxed font-medium">{s.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Avenues/Schedule Cards */}
            <section id="schedule" className="py-28 px-6 bg-slate-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center space-y-6 mb-20 text-slate-900">
                        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight">Annual Schedule</h2>
                        <div className="w-20 h-2 bg-violet-600 mx-auto rounded-full" />
                    </div>

                    <div className="grid md:grid-cols-3 gap-10">
                        {[
                            { month: 'September', title: 'Registration Begins', desc: 'School onboarding and student enrollment phase across all zones.', icon: Calendar, color: 'bg-violet-600 shadow-violet-200' },
                            { month: 'November', title: 'Test Window 01', desc: 'Primary assessment window for schools and individual participants.', icon: Clock, color: 'bg-orange-500 shadow-orange-200' },
                            { month: 'January', title: 'Result & Reports', desc: 'Comprehensive result publication and parent counseling sessions.', icon: BarChart3, color: 'bg-emerald-500 shadow-emerald-200' }
                        ].map((s, i) => (
                            <motion.div key={i} whileHover={{ y: -10 }} className="bg-white rounded-[50px] p-10 flex flex-col items-center text-center shadow-xl shadow-slate-200/50 border border-slate-100 relative group overflow-hidden">
                                <div className={`absolute top-0 inset-x-0 h-2 ${s.color}`} />
                                <div className={`w-20 h-20 rounded-3xl ${s.color} text-white flex items-center justify-center mb-8 shadow-2xl transition-transform group-hover:scale-110`}>
                                    <s.icon size={32} />
                                </div>
                                <h4 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] mb-2">{s.month}</h4>
                                <h3 className="text-2xl font-black text-slate-900 mb-6">{s.title}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed font-medium mb-10 max-w-[200px]">{s.desc}</p>
                                <button className="text-[10px] font-black uppercase tracking-widest py-3 px-6 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white transition-all">View Details</button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features of the Test */}
            <section className="py-28 px-6 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
                    <div className="space-y-12">
                        <div className="space-y-4">
                            <h2 className="text-5xl font-black text-slate-900 leading-tight">Features Of The Test</h2>
                            <div className="w-20 h-2 bg-violet-600 rounded-full" />
                        </div>

                        <div className="space-y-5">
                            {[
                                { icon: Clock, title: 'Total Duration- (45) Minutes', desc: '40 Questions across 4 modules.', color: 'text-violet-600 bg-violet-50' },
                                { icon: Briefcase, title: 'Bilingual Assessment Interface', desc: 'Questions in Hindi and English simultaneously.', color: 'text-indigo-600 bg-indigo-50' },
                                { icon: Shield, title: 'AI-Proctored Security Mode', desc: 'Ensures 100% integrity across all exam windows.', color: 'text-emerald-600 bg-emerald-50' },
                                { icon: Target, title: 'Grade-Specific Calibration', desc: 'Tailored for classes 1st up to 12th.', color: 'text-orange-600 bg-orange-50' }
                            ].map((f, i) => (
                                <motion.div key={i} whileHover={{ x: 10 }} className="flex items-center gap-6 p-6 rounded-[30px] border border-slate-100 hover:border-violet-100 transition-all">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${f.color}`}>
                                        <f.icon size={22} />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-slate-900 text-sm">{f.title}</h4>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">{f.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <div className="rounded-[80px] bg-emerald-500 overflow-hidden aspect-[4/5] relative">
                            <img src="https://images.unsplash.com/photo-1491013516836-7dbf3d9d3f1a?auto=format&fit=crop&q=80&w=800" alt="Features" className="w-full h-full object-cover" />
                            <div className="absolute inset-x-0 bottom-0 p-12 bg-gradient-to-t from-emerald-900/60 to-transparent">
                                <div className="p-8 bg-white/10 backdrop-blur-xl rounded-[40px] border border-white/20">
                                    <p className="text-xs font-black text-white uppercase tracking-widest mb-2">Did You Know?</p>
                                    <h4 className="text-2xl font-black text-white leading-tight">IQ tests are 90% accurate predictors of future career success.</h4>
                                </div>
                            </div>
                        </div>
                        {/* Blob */}
                        <div className="absolute -top-20 -right-20 w-80 h-80 bg-violet-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 -z-10" />
                    </div>
                </div>
            </section>

            {/* Awards & Rewards */}
            <section className="py-28 px-6 bg-slate-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center space-y-6 mb-24">
                        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight">Awards & Rewards</h2>
                        <div className="w-20 h-2 bg-orange-500 mx-auto rounded-full" />
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { pos: '1st Rank', cat: 'State Level', gift: 'Tablets + Trophy + Certificate', icon: Trophy, color: 'text-amber-500 bg-amber-50 border-amber-100' },
                            { pos: '2nd Rank', cat: 'State Level', gift: 'Laptops + Trophy + Certificate', icon: Award, color: 'text-slate-400 bg-slate-50 border-slate-100' },
                            { pos: '3rd Rank', cat: 'State Level', gift: 'Smart Watches + Trophy + Certificate', icon: Award, color: 'text-orange-400 bg-orange-50 border-orange-100' }
                        ].map((a, i) => (
                            <motion.div key={i} whileHover={{ y: -10 }} className={`p-10 rounded-[50px] border-4 text-center space-y-6 bg-white transition-all hover:shadow-2xl ${a.color}`}>
                                <div className="inline-flex p-6 bg-white rounded-[32px] shadow-lg text-inherit">
                                    <a.icon size={48} />
                                </div>
                                <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight">{a.pos}</h3>
                                <div className="space-y-1">
                                    <p className="text-sm font-black text-inherit uppercase tracking-widest">{a.cat}</p>
                                    <p className="text-xs font-bold text-slate-400 leading-relaxed">{a.gift}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="grid md:grid-cols-4 gap-6 mt-16">
                        {[
                            { name: 'ZONE TOPPER', color: 'bg-violet-600' },
                            { name: 'CITY TOPPER', color: 'bg-indigo-600' },
                            { name: 'SCHOOL TOPPER', color: 'bg-emerald-600' },
                            { name: 'CLASS TOPPER', color: 'bg-orange-600' }
                        ].map((badge, i) => (
                            <div key={i} className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 flex items-center gap-4 group">
                                <div className={`w-12 h-12 ${badge.color} rounded-2xl flex items-center justify-center text-white shadow-lg shadow-inherit transition-transform group-hover:rotate-12`}>
                                    <Trophy size={20} />
                                </div>
                                <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{badge.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Results Section */}
            <section className="py-28 px-6 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center">
                    <div className="relative">
                        <div className="rounded-[80px] overflow-hidden aspect-square relative z-10 border-8 border-white shadow-2xl">
                            <img src="https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=800" alt="Results" className="w-full h-full object-cover" />
                        </div>
                        {/* Floating elements */}
                        <motion.div animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 3 }}
                            className="absolute -top-10 -right-10 px-8 py-5 bg-white rounded-3xl shadow-xl border border-slate-100 flex items-center gap-4 z-20">
                            <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center"><CheckCircle2 /></div>
                            <div><div className="text-[10px] font-black text-slate-400">STATUS</div><div className="text-sm font-black text-emerald-600">CERTIFIED</div></div>
                        </motion.div>
                        <div className="absolute top-20 -left-10 w-60 h-60 bg-orange-400 rounded-full blur-[100px] opacity-20 -z-10" />
                    </div>

                    <div className="space-y-12">
                        <div className="space-y-4">
                            <h2 className="text-5xl font-black text-slate-900 leading-tight">For Better Results and<br />Assessment Score</h2>
                            <p className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Guidelines for our scholars</p>
                        </div>

                        <div className="space-y-4">
                            {[
                                'Ensure a stable internet connection for the test window.',
                                'Use a modern version of Chrome or Edge browser.',
                                'Keep your school ID ready for initial verification.',
                                'Test environment should be quiet and well-lit.',
                                'Parent consent is mandatory for all primary students.'
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white hover:border-violet-200 transition-all">
                                    <div className="w-6 h-6 shrink-0 bg-violet-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-lg shadow-violet-100 group-hover:scale-110 transition-transform">
                                        {i + 1}
                                    </div>
                                    <p className="text-[13px] font-bold text-slate-600 leading-relaxed">{item}</p>
                                </div>
                            ))}
                        </div>

                        <button className="px-12 py-5 bg-orange-600 text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-orange-200 hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-3 w-fit">
                            Check Results Dashboard <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </section>

            {/* Mentors Section */}
            <section id="mentors" className="py-28 px-6 bg-slate-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center space-y-6 mb-20 text-slate-900">
                        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight">Our Mentors</h2>
                        <div className="w-20 h-2 bg-violet-600 mx-auto rounded-full" />
                    </div>

                    <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
                        {[
                            { name: 'Dr. G. S. Kushwaha', role: 'Psychometrician', bio: 'Expert in clinical psychology with 25+ years of experience in student assessments.', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400' },
                            { name: 'Dr. Vidit Bansal', role: 'Chief Educator', bio: 'Leading educationist focused on innovative diagnostic-led pedagogy.', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400' }
                        ].map((m, i) => (
                            <div key={i} className="bg-white rounded-[60px] p-10 flex flex-col items-center text-center shadow-xl shadow-slate-200/40 relative group">
                                <div className="w-40 h-40 rounded-[50px] overflow-hidden mb-8 border-4 border-slate-50 shadow-lg grayscale group-hover:grayscale-0 transition-all">
                                    <img src={m.img} alt={m.name} className="w-full h-full object-cover" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 mb-1">{m.name}</h3>
                                <p className="text-[10px] font-black text-violet-600 uppercase tracking-widest mb-6">{m.role}</p>
                                <p className="text-[13px] font-bold text-slate-400 leading-relaxed max-w-xs">{m.bio}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-28">
                        <div className="text-center space-y-4 mb-20">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Scientific Experts Panel</h3>
                            <h2 className="text-3xl font-black text-slate-900">Research & Design Team</h2>
                        </div>
                        <div className="grid md:grid-cols-4 gap-8">
                            {[
                                { name: 'Prof. R. Deshmukh', role: 'Lead Data Analyst' },
                                { name: 'Ms. Priya Verma', role: 'Child Counselor' },
                                { name: 'Mr. J. P. Singh', role: 'Educationalist' },
                                { name: 'Dr. Rahul Tiwari', role: 'IT Director' }
                            ].map((e, i) => (
                                <div key={i} className="bg-white p-8 rounded-[40px] text-center border border-slate-100 shadow-lg shadow-slate-200/50 group">
                                    <div className="w-20 h-20 bg-slate-50 rounded-3xl mx-auto mb-6 flex items-center justify-center text-slate-300 transition-colors group-hover:bg-violet-600 group-hover:text-white">
                                        <CircleUser size={32} />
                                    </div>
                                    <h4 className="font-black text-slate-900 text-sm mb-1">{e.name}</h4>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{e.role}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Quote */}
            <section className="py-28 px-6 bg-white relative overflow-hidden">
                <div className="max-w-4xl mx-auto relative">
                    <div className="absolute -top-10 -left-10 text-slate-100 -z-0"><Quote size={160} /></div>
                    <div className="relative z-10 space-y-10 text-center">
                        <p className="text-3xl md:text-4xl font-black text-slate-900 leading-tight italic">
                            "The diagnostic evaluation provided such clarity for my son's career path. The 15-page report was a revelation."
                        </p>
                        <div className="flex items-center justify-center gap-4">
                            <div className="w-16 h-16 bg-slate-900 rounded-3xl overflow-hidden shadow-lg border-2 border-white">
                                <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200" alt="Rishabh" className="w-full h-full object-cover" />
                            </div>
                            <div className="text-left">
                                <h5 className="font-black text-slate-900">Rishabh Mehra</h5>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Parent, Delhi Public School</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Fees Section */}
            <section id="fees" className="py-28 px-6 bg-slate-50 relative overflow-hidden">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="space-y-6 mb-20 text-slate-900">
                        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight">FEE STRUCTURE</h2>
                        <div className="w-20 h-2 bg-orange-600 mx-auto rounded-full" />
                        <p className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] font-sans">Applicable for 2026-2027 Academic Year</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-10">
                        {/* Individual Card */}
                        <div className="bg-white rounded-[60px] overflow-hidden shadow-2xl border border-slate-100 relative group">
                            <div className="bg-slate-900 p-10 text-white text-center space-y-2">
                                <h3 className="text-3xl font-black uppercase tracking-tight">Individual Participation</h3>
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">For home students</p>
                            </div>
                            <div className="p-10 space-y-8">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-5 bg-slate-50 rounded-3xl">
                                        <span className="text-xs font-black text-slate-900 uppercase">Classes 1st - 5th</span>
                                        <span className="text-lg font-black text-violet-600">₹ 499 /-</span>
                                    </div>
                                    <div className="flex items-center justify-between p-5 bg-slate-50 rounded-3xl">
                                        <span className="text-xs font-black text-slate-900 uppercase">Classes 6th - 10th</span>
                                        <span className="text-lg font-black text-indigo-600">₹ 699 /-</span>
                                    </div>
                                    <div className="flex items-center justify-between p-5 bg-slate-50 rounded-3xl">
                                        <span className="text-xs font-black text-slate-900 uppercase">Classes 11th - 12th</span>
                                        <span className="text-lg font-black text-emerald-600">₹ 899 /-</span>
                                    </div>
                                </div>
                                <div className="w-full h-px bg-slate-100" />
                                <div className="text-left space-y-3">
                                    {[
                                        'Digital Report Included',
                                        'Career Guide PDF Included',
                                        'Certificate of Merit',
                                        'Slot Choice Flexibility'
                                    ].map(f => (
                                        <div key={f} className="flex items-center gap-3 text-[11px] font-bold text-slate-400">
                                            <CheckCircle2 size={12} className="text-violet-600" /> {f}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* School Card */}
                        <div className="bg-white rounded-[60px] overflow-hidden shadow-2xl border border-slate-100 relative group scale-105 z-10 border-violet-200">
                            <div className="bg-violet-600 p-10 text-white text-center space-y-2">
                                <h3 className="text-3xl font-black uppercase tracking-tight">Participate Through School</h3>
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-violet-300">Special Institutional Price</p>
                            </div>
                            <div className="p-10 space-y-8">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-5 bg-violet-50 rounded-3xl">
                                        <span className="text-xs font-black text-slate-900 uppercase">Classes 1st - 5th</span>
                                        <span className="text-lg font-black text-violet-600">₹ 199 /-</span>
                                    </div>
                                    <div className="flex items-center justify-between p-5 bg-violet-50 rounded-3xl">
                                        <span className="text-xs font-black text-slate-900 uppercase">Classes 6th - 10th</span>
                                        <span className="text-lg font-black text-indigo-600">₹ 299 /-</span>
                                    </div>
                                    <div className="flex items-center justify-between p-5 bg-violet-50 rounded-3xl">
                                        <span className="text-xs font-black text-slate-900 uppercase">Classes 11th - 12th</span>
                                        <span className="text-lg font-black text-emerald-600">₹ 399 /-</span>
                                    </div>
                                </div>
                                <div className="w-full h-px bg-violet-100" />
                                <div className="text-left space-y-3">
                                    {[
                                        'Printed Report Included',
                                        'Classroom Proctoring',
                                        'Institutional Analysis',
                                        'Topper Medals & Trophy'
                                    ].map(f => (
                                        <div key={f} className="flex items-center gap-3 text-[11px] font-bold text-slate-400">
                                            <CheckCircle2 size={12} className="text-violet-600" /> {f}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Coordinator Section / Banner */}
            <section className="py-28 px-6 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        className="bg-indigo-600 rounded-[60px] p-16 text-center space-y-10 relative overflow-hidden shadow-2xl">
                        {/* Decorative background overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 to-transparent" />
                        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-[100px]" />

                        <div className="relative z-10 space-y-6">
                            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">Become a Coordinator and<br />Start Working With Us</h2>
                            <p className="text-indigo-100 font-bold max-w-2xl mx-auto leading-relaxed">
                                Join our network of education professionals across India. Manage assessments for your region and empower students in your city.
                            </p>
                        </div>

                        <div className="relative z-10 flex flex-col sm:flex-row gap-5 justify-center">
                            <button className="px-14 py-6 bg-white text-indigo-600 rounded-[30px] font-black text-[13px] uppercase tracking-widest shadow-xl hover:bg-slate-100 transition-all active:scale-95">
                                Become Coordinator
                            </button>
                            <button className="px-14 py-6 bg-indigo-900/40 text-white border border-white/20 rounded-[30px] font-black text-[13px] uppercase tracking-widest backdrop-blur-md hover:bg-white/10 transition-all active:scale-95">
                                Learn More
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 pt-32 pb-16 px-6 relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-violet-600 via-indigo-600 to-emerald-600" />
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-16 mb-24">
                        <div className="space-y-10 col-span-1 md:col-span-2">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center">
                                    <Brain size={24} className="text-violet-600" />
                                </div>
                                <div className="flex flex-col -space-y-1">
                                    <span className="text-2xl font-black tracking-tight text-white">IQ<span className="text-violet-500">Admin</span></span>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Diagnostic Division</span>
                                </div>
                            </div>
                            <p className="max-w-md text-slate-500 font-bold leading-relaxed">
                                Empowing the next generation of Indian scholars through data-driven cognitive diagnostics and expert psychometric insights.
                            </p>
                            <div className="flex gap-4">
                                {['FB', 'TW', 'LN', 'IG'].map(s => (
                                    <div key={s} className="w-10 h-10 border border-slate-800 rounded-xl flex items-center justify-center text-slate-600 font-black text-[10px] hover:border-violet-500 hover:text-white cursor-pointer transition-all">
                                        {s}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-10">
                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Platform</h4>
                            <ul className="space-y-4">
                                {['IQ Diagnostic', 'Career Aptitude', 'Subject Eval', 'Reports Hub', 'Parent Portal'].map(l => (
                                    <li key={l}><a href="#" className="text-[13px] font-black text-slate-700 hover:text-violet-500 transition-colors uppercase tracking-widest">{l}</a></li>
                                ))}
                            </ul>
                        </div>

                        <div className="space-y-10">
                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Quick Links</h4>
                            <ul className="space-y-4">
                                {['About Us', 'Contact', 'Terms', 'Privacy', 'School Login'].map(l => (
                                    <li key={l}><a href="#" className="text-[13px] font-black text-slate-700 hover:text-violet-500 transition-colors uppercase tracking-widest">{l}</a></li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between pt-16 border-t border-slate-800/50 gap-6">
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">© 2026 iq-admin diagnostic. All Rights Reserved.</p>
                        <div className="flex items-center gap-8">
                            <a href="#" className="text-[10px] font-black text-slate-600 uppercase tracking-widest hover:text-white transition-colors">Safety Center</a>
                            <a href="#" className="text-[10px] font-black text-slate-600 uppercase tracking-widest hover:text-white transition-colors">Press Release</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
