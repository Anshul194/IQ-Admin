import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import ReportCertificateSection from '../components/ReportCertificateSection';
import CareerAptitudeSection from '../components/CareerAptitudeSection';
import CareerReportSection from '../components/CareerReportSection';
import LeadershipSection from '../components/LeadershipSection';
import TestimonialsSection from '../components/TestimonialsSection';
import PartnerCoordinatorSection from '../components/PartnerCoordinatorSection';
import {
    Brain, ArrowRight, Star, Users, Shield, CheckCircle2,
    BarChart3, BookOpen, Clock, Award, GraduationCap,
    Target, TrendingUp, Play, Menu, X, Phone, Mail, MapPin,
    Quote, ChevronDown, Sparkles, Database, FileText,
    Calendar, Trophy, CircleUser, Heart, Briefcase, UserPlus, School,
    ShieldCheck, RotateCcw, Layers, PieChart, Compass,
    FileBarChart
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
                        <img src="/logo-1.png" alt="Navodaya Wala" className="h-12 w-auto object-contain" />
                    </div>

                    <div className="hidden lg:flex items-center gap-10">
                        <a href="#about" className="text-sm font-black uppercase tracking-widest text-slate-500 hover:text-[#0845A5] transition-colors">About</a>
                        <a href="#science" className="text-sm font-black uppercase tracking-widest text-slate-500 hover:text-[#0845A5] transition-colors">Science</a>
                        <a href="#journey" className="text-sm font-black uppercase tracking-widest text-slate-500 hover:text-[#0845A5] transition-colors">Journey</a>
                        <a href="#features" className="text-sm font-black uppercase tracking-widest text-slate-500 hover:text-[#0845A5] transition-colors">Features</a>
                        <a href="#reports" className="text-sm font-black uppercase tracking-widest text-slate-500 hover:text-[#0845A5] transition-colors">Reports</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link to="/login" className="hidden sm:block text-sm font-black uppercase tracking-widest text-slate-600 hover:text-[#0845A5] transition-colors">Login</Link>
                        <Link to="/login" className="px-7 py-3.5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#0845A5] hover:shadow-xl hover:shadow-[#0845A5]/20 transition-all active:scale-95 shadow-lg shadow-slate-100">
                            Register Now
                        </Link>
                        <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 text-slate-500 hover:text-slate-800 transition-colors">
                            <Menu size={24} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Nav */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        {/* Backdrop overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileOpen(false)}
                            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[110] lg:hidden"
                        />
                        {/* Drawer panel */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 bottom-0 w-full max-w-xs bg-white z-[120] shadow-2xl p-6 flex flex-col justify-between border-l border-slate-100 lg:hidden"
                        >
                            <div>
                                {/* Header */}
                                <div className="flex items-center justify-between pb-6 border-b border-slate-100 mb-8">
                                    <img src="/logo-1.png" alt="Navodaya Wala" className="h-10 w-auto object-contain" />
                                    <button
                                        onClick={() => setMobileOpen(false)}
                                        className="p-2 rounded-xl bg-slate-50 text-slate-500 hover:bg-slate-100 active:scale-95 transition-all"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                {/* Navigation Links */}
                                <div className="space-y-2">
                                    {[
                                        { name: 'About', href: '#about', icon: Users },
                                        { name: 'Science', href: '#science', icon: Brain },
                                        { name: 'Journey', href: '#journey', icon: Award },
                                        { name: 'Features', href: '#features', icon: ShieldCheck },
                                        { name: 'Reports', href: '#reports', icon: FileBarChart },
                                    ].map(item => (
                                        <a
                                            key={item.name}
                                            href={item.href}
                                            onClick={() => setMobileOpen(false)}
                                            className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-slate-600 hover:bg-slate-50 hover:text-[#0845A5] transition-all font-bold text-sm"
                                        >
                                            <item.icon size={18} className="text-slate-400" />
                                            <span>{item.name}</span>
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* Footer / Buttons */}
                            <div className="space-y-3 pt-6 border-t border-slate-100">
                                <Link
                                    to="/login"
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center justify-center w-full py-4 rounded-2xl border border-slate-200 text-slate-700 font-black text-xs uppercase tracking-widest hover:bg-slate-50 active:scale-95 transition-all"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/login"
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center justify-center w-full py-4 rounded-2xl bg-[#0845A5] text-white font-black text-xs uppercase tracking-widest hover:bg-[#06388a] active:scale-95 transition-all shadow-lg shadow-[#0845A5]/20"
                                >
                                    Register Now
                                </Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Hero Section */}
            <section className="relative pt-28 pb-16 px-6 overflow-hidden min-h-screen flex flex-col justify-center bg-white">
                {/* Organic blob background shapes */}
                <svg className="absolute -top-20 -left-20 w-[600px] h-[600px] -z-10 opacity-[0.06]" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#0845A5" d="M45.3,-58.5C57.4,-49.8,64.1,-33.1,68.6,-15.5C73.1,2.1,75.4,20.6,68.6,34.8C61.8,49,45.9,58.9,29.1,65.2C12.3,71.5,-5.4,74.2,-22.6,70.5C-39.8,66.8,-56.5,56.7,-65.8,41.8C-75.1,26.9,-77,7.2,-73.4,-10.8C-69.8,-28.8,-60.7,-45.1,-47.2,-53.9C-33.7,-62.7,-16.9,-64,0.5,-64.6C17.8,-65.2,33.2,-67.2,45.3,-58.5Z" transform="translate(100 100)" />
                </svg>
                <svg className="absolute bottom-0 right-0 w-[500px] h-[500px] -z-10 opacity-[0.05]" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#F14E2B" d="M39.5,-51.6C52.5,-42.4,65.3,-31.8,70.8,-17.9C76.3,-4,74.5,13.2,66.8,27.1C59.1,41,45.5,51.6,30.7,58.9C15.9,66.2,-0.1,70.2,-16.4,68.1C-32.7,66,-49.3,57.8,-59.2,44.6C-69.1,31.4,-72.3,13.2,-70.8,-4.2C-69.3,-21.6,-63.1,-38.2,-51.6,-47.7C-40.1,-57.2,-23.3,-59.6,-6.9,-58.1C9.5,-56.6,26.5,-60.8,39.5,-51.6Z" transform="translate(100 100)" />
                </svg>

                <div className="max-w-7xl mx-auto w-full">

                    <div className="grid lg:grid-cols-2 gap-12 items-center">

                        {/* ── LEFT: Left-aligned text column ── */}
                        <div className="flex flex-col items-start text-left">
                            <motion.h1
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-[2.75rem] leading-[1.02] md:text-6xl xl:text-[4.2rem] font-black text-slate-900 tracking-tight"
                            >
                                Choose the Right
                                <br />
                                <span className="text-[#0845A5]">Assessment</span> for
                                <br />
                                <span className="relative inline-block">
                                    Your Child
                                    <span className="absolute left-0 -bottom-1 w-full h-3 bg-[#F14E2B]/25 -z-10 skew-x-3" />
                                </span>
                            </motion.h1>

                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 }}
                                className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6 w-full lg:max-w-md xl:max-w-[760px]"
                            >
                                <div className="group relative flex flex-col gap-4 rounded-2xl border border-slate-200 p-6 hover:border-[#0845A5]/30 hover:bg-[#0845A5]/[0.02] transition-colors">
                                    <div className="shrink-0 w-11 h-11 rounded-xl bg-[#0845A5]/10 flex items-center justify-center">
                                        <Brain size={20} className="text-[#0845A5]" />
                                    </div>
                                    <div className="flex flex-col items-start">
                                        <span className="text-[9px] font-black uppercase tracking-wider text-[#0845A5] bg-[#0845A5]/10 px-2 py-0.5 rounded-full mb-2">
                                            Classes 1–5
                                        </span>
                                        <h3 className="font-black text-slate-900 text-base tracking-tight leading-snug">
                                            Online Intelligence Quotient (IQ) Test
                                        </h3>
                                        <p className="text-sm text-slate-500 leading-relaxed mt-2">
                                            Measure your child's <span className="font-semibold text-slate-700">accurate IQ score</span> with a reliable and scientifically designed assessment.
                                        </p>
                                    </div>
                                </div>

                                <div className="group relative flex flex-col gap-4 rounded-2xl border border-slate-200 p-6 hover:border-[#F14E2B]/30 hover:bg-[#F14E2B]/[0.02] transition-colors">
                                    <div className="shrink-0 w-11 h-11 rounded-xl bg-[#F14E2B]/10 flex items-center justify-center">
                                        <Compass size={20} className="text-[#F14E2B]" />
                                    </div>
                                    <div className="flex flex-col items-start">
                                        <span className="text-[9px] font-black uppercase tracking-wider text-[#F14E2B] bg-[#F14E2B]/10 px-2 py-0.5 rounded-full mb-2">
                                            Classes 6–12
                                        </span>
                                        <h3 className="font-black text-slate-900 text-base tracking-tight leading-snug">
                                            Online Career Aptitude Assessment (CAA) Test
                                        </h3>
                                        <p className="text-sm text-slate-500 leading-relaxed mt-2">
                                            Help your child <span className="font-semibold text-slate-700">discover the most suitable career path</span> through a comprehensive assessment.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="mt-8"
                            >
                                <Link
                                    to="/login"
                                    className="group px-7 py-3.5 bg-[#0845A5] text-white rounded-full font-bold text-sm hover:bg-[#06388a] transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-[#0845A5]/20"
                                >
                                    Try Now
                                    <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                                </Link>
                            </motion.div>
                        </div>

                        {/* ── RIGHT: Image ── */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.94 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="relative rounded-3xl overflow-hidden h-[420px] lg:h-[520px]"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=800"
                                alt="Student taking an assessment"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                            <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-white/95 backdrop-blur rounded-full pl-1.5 pr-4 py-1.5">
                                <div className="w-7 h-7 rounded-full bg-[#0845A5] flex items-center justify-center">
                                    <Sparkles size={12} className="text-white" />
                                </div>
                                <span className="text-[10px] font-black text-slate-800">Live now: 2,412 students testing</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Bottom scrolling trust marquee */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mt-14 pt-6 border-t border-slate-100 overflow-hidden"
                    >
                        <div className="flex gap-16 animate-marquee whitespace-nowrap">
                            {[...Array(2)].map((_, loop) => (
                                <div key={loop} className="flex gap-16 shrink-0">
                                    {['DELHI PUBLIC SCHOOL', 'RYAN INTERNATIONAL', 'ST. XAVIER\'S', 'DAV SCHOOLS', 'KENDRIYA VIDYALAYA', 'AMITY GLOBAL'].map((name, i) => (
                                        <span key={i} className="text-sm font-black text-slate-300 tracking-wide shrink-0">
                                            {name}
                                        </span>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* IQ Scale Distribution */}
            <section id="science" className="relative py-28 px-6 bg-slate-50 overflow-hidden">
                {/* Subtle background accents matching hero */}
                <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-[#0845A5]/5 rounded-full blur-3xl -z-0" />
                <div className="absolute bottom-0 left-0 w-[24rem] h-[24rem] bg-[#F14E2B]/5 rounded-full blur-3xl -z-0" />

                <div className="max-w-7xl mx-auto relative z-10">

                    {/* Header — left aligned, split with a stat callout on the right */}
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
                        <div>
                            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[#F14E2B] mb-3 block">
                                The Science Behind It
                            </span>
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
                                Where do you fall on the
                                <br />
                                <span className="text-[#0845A5]">IQ Scale?</span>
                            </h2>
                            <p className="text-slate-500 font-medium text-sm max-w-md leading-relaxed">
                                IQ scores are classified into standardized ranges based on internationally accepted norms. The chart below provides an overview of each IQ category and its corresponding interpretation.
                            </p>
                        </div>
                        <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-5 py-3 shrink-0">
                            <div className="w-10 h-10 rounded-xl bg-[#0845A5] flex items-center justify-center">
                                <CheckCircle2 size={18} className="text-white" />
                            </div>
                            <div>
                                <div className="text-lg font-black text-slate-900 leading-none">99.9%</div>
                                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Reliability Rate</div>
                            </div>
                        </div>
                    </div>

                    {/* Main card */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">

                        <div className="grid lg:grid-cols-5">

                            {/* Left — Curve visualization, spans 3 */}
                            <div className="lg:col-span-3 p-10 lg:p-14 relative">

                                {/* Genius marker floating above peak */}
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="absolute top-8 left-1/2 -translate-x-1/2 flex flex-col items-center z-10"
                                >
                                    <span className="px-3 py-1.5 bg-[#F14E2B] text-white rounded-full shadow-lg flex items-center gap-1.5">
                                        <Star size={12} className="fill-white" />
                                        <span className="text-[9px] font-black uppercase tracking-wider">Genius Zone</span>
                                    </span>
                                </motion.div>

                                <div className="relative h-64 w-full flex items-end justify-center mt-16 mb-6">
                                    <svg className="w-full h-full" viewBox="0 0 1000 300" fill="none">
                                        <defs>
                                            <linearGradient id="curveGradient" x1="0" y1="0" x2="1" y2="0">
                                                <stop offset="0%" stopColor="#0845A5" />
                                                <stop offset="50%" stopColor="#0845A5" />
                                                <stop offset="100%" stopColor="#F14E2B" />
                                            </linearGradient>
                                            <linearGradient id="fillGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#0845A5" stopOpacity="0.12" />
                                                <stop offset="100%" stopColor="#0845A5" stopOpacity="0" />
                                            </linearGradient>
                                        </defs>
                                        <path
                                            d="M0,280 C300,280 400,20 500,20 C600,20 700,280 1000,280 L1000,300 L0,300 Z"
                                            fill="url(#fillGradient)"
                                        />
                                        <path
                                            d="M0,280 C300,280 400,20 500,20 C600,20 700,280 1000,280"
                                            stroke="url(#curveGradient)"
                                            strokeWidth="7"
                                            strokeLinecap="round"
                                        />
                                        {/* Peak dot */}
                                        <circle cx="500" cy="20" r="8" fill="#F14E2B" />
                                        <circle cx="500" cy="20" r="14" fill="#F14E2B" fillOpacity="0.2" />
                                    </svg>
                                </div>

                                {/* Scale numbers */}
                                <div className="grid grid-cols-7 text-center">
                                    {[70, 85, 100, 115, 130, 145, 160].map((v, i) => (
                                        <div key={v} className="flex flex-col items-center gap-1.5">
                                            <div className={`w-1.5 h-1.5 rounded-full ${i === 3 ? 'bg-[#F14E2B]' : 'bg-slate-300'}`} />
                                            <span className={`text-xs font-black ${i === 3 ? 'text-[#F14E2B]' : 'text-slate-400'}`}>{v}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right — Zone breakdown list, spans 2 */}
                            <div className="lg:col-span-2 bg-slate-50 border-t lg:border-t-0 lg:border-l border-slate-200 divide-y divide-slate-200">
                                {[
                                    { range: '70–84', label: 'Borderline', pct: '~14%', color: '#94a3b8' },
                                    { range: '85–114', label: 'Average', pct: '~68%', color: '#0845A5' },
                                    { range: '115–129', label: 'Above Average', pct: '~14%', color: '#0845A5' },
                                    { range: '130+', label: 'Gifted / Genius', pct: '~2%', color: '#F14E2B' },
                                ].map((zone, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.08 }}
                                        className="flex items-center justify-between px-8 py-5"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: zone.color }} />
                                            <div>
                                                <p className="text-sm font-black text-slate-900">{zone.label}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">IQ {zone.range}</p>
                                            </div>
                                        </div>
                                        <span className="text-sm font-black" style={{ color: zone.color }}>{zone.pct}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Bottom strip */}
                        <div className="border-t border-slate-200 px-10 lg:px-14 py-8 bg-gradient-to-r from-[#0845A5]/[0.03] to-[#F14E2B]/[0.03]">
                            <p className="text-center text-slate-500 font-medium text-sm max-w-2xl mx-auto leading-relaxed">
                                <span className="font-black text-slate-900">IQ (Intelligence Quotient)</span> measures how well you can think, reason, learn, and solve problems. Your IQ score shows how your performance compares with other students in your{' '}
                                <span className="font-black text-slate-900">age group</span>.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Report & Certificate Showcase */}
            <ReportCertificateSection />

            {/* Career Aptitude Test Section */}
            <CareerAptitudeSection />

            {/* Career Aptitude Report Showcase */}
            <CareerReportSection />

            {/* How to Participate */}
            {/* <section id="about" className="relative py-28 px-6 bg-white overflow-hidden">
                <div className="absolute top-0 left-0 w-[28rem] h-[28rem] bg-[#0845A5]/5 rounded-full blur-3xl -z-0" />
                <div className="absolute bottom-0 right-0 w-[24rem] h-[24rem] bg-[#F14E2B]/5 rounded-full blur-3xl -z-0" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
                        <div>
                            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[#F14E2B] mb-3 block">
                                Get Started Today
                            </span>
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                                How to Participate &
                                <br />
                                <span className="text-[#0845A5]">Where to Register</span>
                            </h2>
                        </div>
                        <p className="text-slate-500 font-medium text-sm max-w-sm">
                            Whether your child is in Class 1 or Class 12, there's a diagnostic test built for their exact age group — with results in a downloadable report and certificate.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-6 items-start">
                        <div className="lg:col-span-7 space-y-4">
                            {[
                                {
                                    icon: UserPlus,
                                    title: 'Direct Child Registration',
                                    desc: 'Parents can register their children directly through our secure online portal with verified parent consent — no school involvement needed.',
                                    tag: 'Fastest',
                                },
                                {
                                    icon: School,
                                    title: 'Offline School Registration',
                                    desc: 'Contact your school administration or class teacher to participate in the upcoming campus-wide diagnostic, scheduled with your institution.',
                                    tag: 'Most Common',
                                },
                                {
                                    icon: FileText,
                                    title: 'Registration Through Physical Form',
                                    desc: 'Download the physical form, fill it out, and submit it to the designated coordinator at your institution for manual enrollment.',
                                    tag: 'No Internet Needed',
                                }
                            ].map((s, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    whileHover={{ x: 6 }}
                                    className="group flex gap-5 p-7 rounded-3xl border border-slate-200 bg-white hover:border-[#0845A5]/30 hover:shadow-lg transition-all"
                                >
                                    <div className="shrink-0 w-12 h-12 rounded-2xl bg-[#0845A5] flex items-center justify-center group-hover:bg-[#F14E2B] transition-colors">
                                        <s.icon size={20} className="text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1.5">
                                            <h4 className="font-black text-base text-slate-900">{s.title}</h4>
                                            <span className="text-[9px] font-black uppercase tracking-wider text-[#F14E2B] bg-[#F14E2B]/10 px-2 py-0.5 rounded-full shrink-0">
                                                {s.tag}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
                                    </div>
                                    <ArrowRight size={18} className="text-slate-300 group-hover:text-[#0845A5] group-hover:translate-x-1 transition-all shrink-0 self-center" />
                                </motion.div>
                            ))}

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.35 }}
                                className="flex items-center gap-3 pt-2"
                            >
                                <Link
                                    to="/login"
                                    className="px-6 py-3 bg-[#0845A5] text-white rounded-full font-bold text-xs hover:bg-[#06388a] transition-all active:scale-95 flex items-center gap-2"
                                >
                                    Register Now <ArrowRight size={14} />
                                </Link>
                            </motion.div>
                        </div>

                        <div className="lg:col-span-5 space-y-4">

                            <motion.div
                                initial={{ opacity: 0, scale: 0.94 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="relative rounded-3xl overflow-hidden h-56"
                            >
                                <img
                                    src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80&w=800"
                                    alt="Child cap"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0845A5]/70 via-transparent to-transparent" />
                                <div className="absolute bottom-4 left-4 right-4">
                                    <p className="text-white font-black text-sm">Two Test Tracks, One Platform</p>
                                    <p className="text-white/70 text-[10px] font-bold uppercase tracking-wider mt-0.5">Classes 1–12 Covered</p>
                                </div>
                            </motion.div>
                            <div className="grid grid-cols-2 gap-4">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 }}
                                    className="bg-[#0845A5] rounded-3xl p-5"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-[9px] font-black text-white/60 uppercase tracking-widest">Classes 1–5</span>
                                        <Brain size={14} className="text-white/60" />
                                    </div>
                                    <div className="text-2xl font-black text-white">40</div>
                                    <div className="text-[9px] font-bold text-white/70 mt-0.5">Questions · IQ Test</div>
                                    <div className="h-px bg-white/15 my-3" />
                                    <div className="text-[10px] font-bold text-white/80">60 min · 5 areas</div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-[#F14E2B] rounded-3xl p-5"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-[9px] font-black text-white/70 uppercase tracking-widest">Classes 6–12</span>
                                        <Briefcase size={14} className="text-white/80" />
                                    </div>
                                    <div className="text-2xl font-black text-white">100</div>
                                    <div className="text-[9px] font-bold text-white/80 mt-0.5">Questions · Aptitude</div>
                                    <div className="h-px bg-white/20 my-3" />
                                    <div className="text-[10px] font-bold text-white/90">120 min · 10 careers</div>
                                </motion.div>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 }}
                                className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-3xl p-5"
                            >
                                <div className="w-11 h-11 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
                                    <Award size={18} className="text-[#0845A5]" />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-slate-900">Certificate & Report Included</p>
                                    <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                                        Every qualifying student receives a downloadable PDF report and an official A4 certificate.
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section> */}

            {/* Test Journey */}
            {/* <section id="journey" className="relative py-28 px-6 bg-slate-50 overflow-hidden">

                <div className="absolute top-0 right-0 w-[26rem] h-[26rem] bg-[#0845A5]/5 rounded-full blur-3xl -z-0" />
                <div className="absolute bottom-0 left-0 w-[22rem] h-[22rem] bg-[#F14E2B]/5 rounded-full blur-3xl -z-0" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-20">
                        <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[#F14E2B] mb-3 block">
                            From Test to Certificate
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                            Your Assessment <span className="text-[#0845A5]">Journey</span>
                        </h2>
                    </div>

                    <div className="relative">
                        <div className="hidden md:block absolute top-24 left-[16.66%] right-[16.66%] h-0.5 bg-slate-200" />

                        <div className="grid md:grid-cols-3 gap-10 relative">
                            {[
                                {
                                    step: '01',
                                    title: 'Take the Test',
                                    icon: Brain,
                                    color: '#0845A5',
                                    desc: 'Classes 1–5 attempt the 40-question IQ Test across 5 reasoning areas in 60 minutes. Classes 6–12 attempt the 100-question Career Aptitude Test across 10 disciplines in 120 minutes.',
                                    stat: '40 / 100',
                                    statLabel: 'Total Questions'
                                },
                                {
                                    step: '02',
                                    title: 'Score & Validation',
                                    icon: ShieldCheck,
                                    color: '#F14E2B',
                                    desc: 'Every response is scored automatically. If a student scores below the minimum threshold, a Retest is triggered — no result is generated until the benchmark is met.',
                                    stat: '11+ / 6+',
                                    statLabel: 'Min. Correct to Qualify'
                                },
                                {
                                    step: '03',
                                    title: 'Report & Certificate',
                                    icon: Award,
                                    color: '#0845A5',
                                    desc: 'A detailed area-wise performance report is generated with accuracy percentages, plus an official A4 certificate carrying the student\'s final score.',
                                    stat: '100%',
                                    statLabel: 'Digital & Printable'
                                }
                            ].map((s, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.15 }}
                                    whileHover={{ y: -8 }}
                                    className="bg-white rounded-[2.5rem] p-9 border border-slate-200 shadow-lg shadow-slate-200/40 relative flex flex-col"
                                >
                                    <div
                                        className="hidden md:flex absolute -top-[3.75rem] left-1/2 -translate-x-1/2 w-10 h-10 rounded-full items-center justify-center text-white text-xs font-black border-4 border-slate-50 z-10"
                                        style={{ backgroundColor: s.color }}
                                    >
                                        {s.step}
                                    </div>

                                    <div
                                        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
                                        style={{ backgroundColor: s.color, boxShadow: `0 10px 25px -5px ${s.color}40` }}
                                    >
                                        <s.icon size={28} className="text-white" />
                                    </div>

                                    <span className="md:hidden text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: s.color }}>
                                        Step {s.step}
                                    </span>

                                    <h3 className="text-xl font-black text-slate-900 mb-3">{s.title}</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed mb-8 flex-1">{s.desc}</p>

                                    <div className="flex items-end justify-between pt-6 border-t border-slate-100">
                                        <div>
                                            <div className="text-2xl font-black" style={{ color: s.color }}>{s.stat}</div>
                                            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{s.statLabel}</div>
                                        </div>
                                        <ArrowRight size={18} className="text-slate-300" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mt-14 flex flex-col md:flex-row items-center gap-6 bg-white rounded-3xl border border-slate-200 p-8"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-[#0845A5]/10 flex items-center justify-center shrink-0">
                            <RotateCcw size={22} className="text-[#0845A5]" />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <p className="text-sm font-black text-slate-900">Didn't meet the minimum score?</p>
                            <p className="text-sm text-slate-500 mt-1">
                                No worries — the Retest option activates automatically, and you can attempt again until you cross the qualifying threshold. Reports and certificates are only issued for valid, qualifying attempts.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section> */}

            {/* Results Section */}
            {/* Results Section */}
            {/* <section className="relative py-32 px-6 bg-slate-950 overflow-hidden">

                <div className="absolute inset-0">
                    <div className="absolute top-0 left-1/4 w-[36rem] h-[36rem] bg-[#0845A5]/20 rounded-full blur-[120px]" />
                    <div className="absolute bottom-0 right-1/4 w-[30rem] h-[30rem] bg-[#F14E2B]/20 rounded-full blur-[120px]" />
                    <div className="absolute inset-0 opacity-[0.04]"
                        style={{
                            backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`,
                            backgroundSize: '60px 60px'
                        }}
                    />
                </div>

                <div className="max-w-7xl mx-auto relative z-10">

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-20 text-center"
                    >
                        <span className="text-[11px] font-black uppercase tracking-[0.4em] text-[#F14E2B] mb-4 block">
                            What Your Report Actually Looks Like
                        </span>
                        <h2 className="text-5xl md:text-7xl font-black text-white leading-[0.95] tracking-tight">
                            See Your Score.
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0845A5] to-[#F14E2B]">
                                Own Your Story.
                            </span>
                        </h2>
                    </motion.div>

                    <div className="grid lg:grid-cols-12 gap-8 items-center">

                        <div className="lg:col-span-7 relative h-[560px]">

                            <motion.div
                                initial={{ opacity: 0, rotateY: 20, scale: 0.9 }}
                                whileInView={{ opacity: 1, rotateY: 0, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="absolute inset-0 bg-white rounded-[2rem] p-8 shadow-2xl"
                                style={{ transformStyle: 'preserve-3d' }}
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Career Aptitude Report</p>
                                        <p className="text-lg font-black text-slate-900">Interest & Personality Profile</p>
                                    </div>
                                    <div className="w-11 h-11 rounded-xl bg-[#0845A5] flex items-center justify-center">
                                        <FileBarChart size={20} className="text-white" />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {[
                                        { label: 'Administrative & Civil Services', pct: 17.02, color: '#0845A5' },
                                        { label: 'Medical Science & Healthcare', pct: 12.76, color: '#F14E2B' },
                                        { label: 'Defence, Police, Sports & Yoga', pct: 12.76, color: '#0845A5' },
                                        { label: 'Teaching, Coaching & Education', pct: 10.63, color: '#F14E2B' },
                                        { label: 'STEM', pct: 8.51, color: '#0845A5' },
                                    ].map((row, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.3 + i * 0.1 }}
                                        >
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-[11px] font-bold text-slate-700">{row.label}</span>
                                                <span className="text-[11px] font-black" style={{ color: row.color }}>{row.pct}%</span>
                                            </div>
                                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    whileInView={{ width: `${row.pct * 4.5}%` }}
                                                    viewport={{ once: true }}
                                                    transition={{ duration: 1, delay: 0.4 + i * 0.1, ease: 'easeOut' }}
                                                    className="h-full rounded-full"
                                                    style={{ backgroundColor: row.color }}
                                                />
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Grand Total</p>
                                        <p className="text-2xl font-black text-slate-900">47<span className="text-sm text-slate-400"> pts</span></p>
                                    </div>
                                    <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full">
                                        <CheckCircle2 size={14} />
                                        <span className="text-[10px] font-black uppercase tracking-wider">Qualified</span>
                                    </div>
                                </div>
                            </motion.div>
                            <motion.div
                                animate={{ y: [0, -14, 0] }}
                                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="absolute -top-8 -right-8 bg-[#F14E2B] rounded-3xl px-7 py-5 shadow-2xl z-20"
                            >
                                <p className="text-[9px] font-black text-white/70 uppercase tracking-widest mb-1">IQ Score</p>
                                <p className="text-4xl font-black text-white">125<span className="text-lg">.135</span></p>
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, 14, 0] }}
                                transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 0.5 }}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="absolute -bottom-8 -left-8 bg-white rounded-3xl px-6 py-4 shadow-2xl z-20 flex items-center gap-3"
                            >
                                <div className="w-10 h-10 bg-[#0845A5] rounded-2xl flex items-center justify-center">
                                    <Award size={18} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</p>
                                    <p className="text-sm font-black text-slate-900">Certified</p>
                                </div>
                            </motion.div>
                        </div>

                        <div className="lg:col-span-5 space-y-8">
                            <p className="text-slate-400 text-sm font-medium leading-relaxed">
                                Every attempt is scored, validated, and compiled into a report exactly like this — area-wise percentages, grand totals, and a certificate the moment you qualify.
                            </p>

                            <div className="relative pl-8 space-y-7 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-[#0845A5] before:to-[#F14E2B]">
                                {[
                                    'Ensure a stable internet connection for the test window.',
                                    'Use a modern version of Chrome or Edge browser.',
                                    'Keep your school ID ready for initial verification.',
                                    'Test environment should be quiet and well-lit.',
                                    'Parent consent is mandatory for all primary students.'
                                ].map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className="relative"
                                    >
                                        <div className="absolute -left-8 top-0 w-6 h-6 rounded-full bg-slate-950 border-2 border-[#0845A5] flex items-center justify-center text-[10px] font-black text-white">
                                            {i + 1}
                                        </div>
                                        <p className="text-sm font-semibold text-slate-200 leading-relaxed">{item}</p>
                                    </motion.div>
                                ))}
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                className="group px-8 py-4 bg-white text-slate-900 rounded-full font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-2xl"
                            >
                                Check Results Dashboard
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                        </div>
                    </div>
                </div>
            </section> */}

            {/* Certificate & Report Preview */}
            {/* <section className="relative py-28 px-6 bg-slate-50 overflow-hidden">

    <div className="absolute top-0 left-0 w-[28rem] h-[28rem] bg-[#0845A5]/5 rounded-full blur-3xl -z-0" />
    <div className="absolute bottom-0 right-0 w-[24rem] h-[24rem] bg-[#F14E2B]/5 rounded-full blur-3xl -z-0" />

    <div className="max-w-7xl mx-auto relative z-10">

        <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[#F14E2B] mb-3 block">
                What You Walk Away With
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Your Certificate &
                <br />
                <span className="text-[#0845A5]">Report, After the Test</span>
            </h2>
            <p className="text-slate-500 font-medium text-sm mt-6 leading-relaxed">
                Once you complete the test, you'll instantly receive an official certificate and a detailed
                area-wise report — just like this.
            </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 p-8"
            >
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-11 h-11 rounded-2xl bg-[#0845A5] flex items-center justify-center shrink-0">
                        <Brain size={20} className="text-white" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Classes 1–5</p>
                        <p className="text-base font-black text-slate-900">IQ Test Certificate & Report</p>
                    </div>
                </div>

                <div className="relative h-[420px]">
                    <motion.img
                        initial={{ opacity: 0, rotate: -4, y: 20 }}
                        whileInView={{ opacity: 1, rotate: -4, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        src="/certificate-1-5.png"
                        alt="Sample IQ Test Certificate for Classes 1 to 5"
                        className="absolute top-0 left-0 w-[62%] rounded-2xl shadow-2xl border border-slate-100"
                    />
                    <motion.img
                        initial={{ opacity: 0, rotate: 4, y: 20 }}
                        whileInView={{ opacity: 1, rotate: 4, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.25 }}
                        src="/report-1-5.png"
                        alt="Sample IQ Test Report for Classes 1 to 5"
                        className="absolute bottom-0 right-0 w-[62%] rounded-2xl shadow-2xl border border-slate-100"
                    />
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 }}
                className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 p-8"
            >
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-11 h-11 rounded-2xl bg-[#F14E2B] flex items-center justify-center shrink-0">
                        <Briefcase size={20} className="text-white" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Classes 6–12</p>
                        <p className="text-base font-black text-slate-900">Career Aptitude Test Report</p>
                    </div>
                </div>

                <div className="relative h-[420px] flex items-center justify-center">
                    <motion.img
                        initial={{ opacity: 0, y: 20, scale: 0.96 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        src="/certificate-6-12.png"
                        alt="Sample Career Aptitude Test Report for Classes 6 to 12"
                        className="max-h-full w-auto rounded-2xl shadow-2xl border border-slate-100"
                    />
                </div>
            </motion.div>
        </div>

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 flex flex-col md:flex-row items-center gap-6 bg-white rounded-3xl border border-slate-200 p-8"
        >
            <div className="w-14 h-14 rounded-2xl bg-[#0845A5]/10 flex items-center justify-center shrink-0">
                <Award size={22} className="text-[#0845A5]" />
            </div>
            <div className="flex-1 text-center md:text-left">
                <p className="text-sm font-black text-slate-900">Signed, sealed, and downloadable</p>
                <p className="text-sm text-slate-500 mt-1">
                    Every certificate carries a verified score, director signatures, and an official seal —
                    ready to download as a PDF the moment you qualify.
                </p>
            </div>
        </motion.div>
    </div>
</section> */}

            {/* Leadership Section */}
            <LeadershipSection />

            {/* Testimonials Section */}
            <TestimonialsSection />

            {/* Partner Coordinator CTA Section */}
            <PartnerCoordinatorSection />


            {/* Footer */}
            <footer className="bg-slate-950 py-20 px-6 relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />

                {/* Background accent glow */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -bottom-16 left-1/3 w-[32rem] h-[16rem] bg-[#0845A5]/10 rounded-full blur-[100px]" />
                    <div className="absolute -top-16 right-1/4 w-[24rem] h-[12rem] bg-[#F14E2B]/5 rounded-full blur-[100px]" />
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-slate-900">

                        {/* Left: Brand info & Tagline */}
                        <div className="lg:col-span-6 space-y-6">
                            {/* Logos Row */}
                            <div className="flex flex-wrap items-center gap-6">
                                <img src="/logo.png" alt="INLESYS" className="h-24 w-auto object-contain bg-white rounded-xl px-3.5 py-2 shadow-sm" />
                                {/* <span className="text-3xl font-black text-[#F14E2B]">&</span>
                                <img src="/logo-1.png" alt="Navodaya Wala" className="h-12 w-auto object-contain" /> */}
                            </div>

                            {/* Boxed Description */}
                            <div className="border border-slate-800/80 rounded-2xl p-6 bg-slate-950/40 backdrop-blur-sm max-w-xl">
                                <p className="text-xs text-slate-400 font-medium leading-relaxed">
                                    INIQTEST is a joint venture of INLESYS and NavodayaWala, dedicated to helping students discover their true potential through scientifically designed IQ Tests, comprehensive Career Aptitude Assessments, and personalized career guidance.
                                </p>
                            </div>
                        </div>

                        {/* Mid-Right: Quick Links */}
                        <div className="lg:col-span-3 space-y-5">
                            <h4 className="text-xs font-black text-white uppercase tracking-[0.2em]">Quick Links</h4>
                            <div className="flex flex-col space-y-3">
                                {[
                                    { label: 'Home', href: '#' },
                                    { label: 'IQ Test', href: '#features' },
                                    { label: 'CA Test', href: '#aptitude-details' },
                                    { label: 'About Us', href: '#about' },
                                    { label: 'Contact Us', href: '#contact' },
                                ].map(link => (
                                    <a key={link.label} href={link.href} className="text-sm text-slate-400 hover:text-white transition-colors font-medium">
                                        {link.label}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Right: Important Links */}
                        <div className="lg:col-span-3 space-y-5">
                            <h4 className="text-xs font-black text-white uppercase tracking-[0.2em]">Important Links</h4>
                            <div className="flex flex-col space-y-3">
                                {[
                                    { label: 'Terms & Conditions', href: '/terms' },
                                    { label: 'Privacy Policy', href: '/privacy' },
                                    { label: 'Refund Policy', href: '/refund' },
                                ].map(link => (
                                    <Link key={link.label} to={link.href} className="text-sm text-slate-400 hover:text-[#F14E2B] transition-colors font-medium">
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Bottom strip */}
                    <div className="flex flex-col sm:flex-row items-center justify-between pt-8 gap-6">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            © 2026 Navodaya Wala. All Rights Reserved.
                        </p>

                        {/* Social Icons */}
                        <div className="flex gap-3">
                            {[
                                {
                                    name: 'Facebook',
                                    href: '#',
                                    svg: (
                                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.95z" />
                                        </svg>
                                    )
                                },
                                {
                                    name: 'Twitter',
                                    href: '#',
                                    svg: (
                                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                        </svg>
                                    )
                                },
                                {
                                    name: 'LinkedIn',
                                    href: '#',
                                    svg: (
                                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                        </svg>
                                    )
                                },
                                {
                                    name: 'Instagram',
                                    href: '#',
                                    svg: (
                                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                                        </svg>
                                    )
                                }
                            ].map(item => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    aria-label={item.name}
                                    className="w-8 h-8 border border-slate-900 rounded-lg flex items-center justify-center text-slate-500 hover:border-[#F14E2B] hover:text-[#F14E2B] hover:bg-[#F14E2B]/5 cursor-pointer transition-all"
                                >
                                    {item.svg}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
