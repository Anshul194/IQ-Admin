import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutGrid,
    Users2,
    UserCircle,
    BookMarked,
    BarChart4,
    Settings,
    Power,
    ChevronLeft,
    ChevronRight,
    ShieldCheck,
    Menu,
    X,
    FileQuestion
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, Link } from 'react-router-dom';
import { setSidebarOpen } from '../../store/slices/uiSlice';
import { logout } from '../../store/slices/authSlice';

const SidebarItem = ({ icon: Icon, label, active, path, collapsed, onClick }) => (
    <Link to={path} onClick={onClick}>
        <motion.div
            whileTap={{ scale: 0.98 }}
            className={`flex items-center space-x-3 p-3.5 rounded-xl cursor-pointer transition-all duration-200 relative group mb-1 ${active
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'
                }`}
        >
            <div className="flex-shrink-0">
                <Icon size={20} strokeWidth={2.5} />
            </div>
            {!collapsed && (
                <span className="font-bold text-xs tracking-tight uppercase tracking-[0.05em]">{label}</span>
            )}
            {active && !collapsed && (
                <div className="absolute right-3 w-1 h-4 bg-violet-500 rounded-full" />
            )}
        </motion.div>
    </Link>
);

const Sidebar = () => {
    const { sidebarOpen } = useSelector((state) => state.ui);
    const dispatch = useDispatch();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const menuItems = [
        { icon: LayoutGrid, label: 'Overview', path: '/dashboard' },
        { icon: Users2, label: 'Team', path: '/team' },
        { icon: UserCircle, label: 'Student DB', path: '/students' },
        { icon: BarChart4, label: 'Results', path: '/results' },
        { icon: FileQuestion, label: 'Quiz-set', path: '/quiz-set' },

    ];

    return (
        <>
            {/* Mobile Menu Toggle */}
            <div className="lg:hidden fixed top-6 left-6 z-[60]">
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="p-3 bg-white border border-slate-100 rounded-xl shadow-lg text-slate-900"
                >
                    {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Sidebar Overlay for Mobile */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setMobileOpen(false)}
                        className="lg:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
                    />
                )}
            </AnimatePresence>

            <motion.div
                initial={false}
                animate={{
                    width: sidebarOpen ? 240 : 88,
                    x: mobileOpen ? 0 : (window.innerWidth < 1024 ? -260 : 0)
                }}
                className={`fixed lg:sticky top-0 h-screen bg-white border-r border-slate-100 flex flex-col z-50 transition-all duration-300 transform`}
            >
                <div className="p-7 flex items-center mb-6">
                    <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-100">
                        <ShieldCheck className="text-white w-6 h-6" />
                    </div>
                    {sidebarOpen && (
                        <div className="ml-3 flex flex-col">
                            <span className="text-sm font-black text-slate-900 leading-none tracking-tight">IQ ADMIN</span>
                            <span className="text-[10px] font-bold text-slate-400 tracking-widest mt-1 uppercase">Cloud LMS</span>
                        </div>
                    )}
                </div>

                <div className="flex-1 px-4 overflow-y-auto custom-scrollbar">
                    {menuItems.map((item) => (
                        <SidebarItem
                            key={item.label}
                            {...item}
                            active={location.pathname === item.path}
                            collapsed={!sidebarOpen}
                            onClick={() => setMobileOpen(false)}
                        />
                    ))}
                </div>

                <div className="p-4 mt-auto border-t border-slate-50">
                    <button
                        onClick={() => dispatch(logout())}
                        className={`w-full flex items-center space-x-3 p-3.5 rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all duration-200 group`}
                    >
                        <Power size={20} />
                        {sidebarOpen && <span className="font-bold text-xs uppercase tracking-wider">Log Out</span>}
                    </button>

                    <button
                        onClick={() => dispatch(setSidebarOpen(!sidebarOpen))}
                        className="hidden lg:flex absolute -right-4 top-20 bg-white border border-slate-100 rounded-full p-2 shadow-sm hover:scale-110 transition-all text-slate-300 hover:text-violet-600"
                    >
                        {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                    </button>
                </div>
            </motion.div>
        </>
    );
};

export default Sidebar;
