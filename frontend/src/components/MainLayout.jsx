import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Compass, LogOut, History, Award, Settings, Search, Bell, Menu, X, User, Users } from 'lucide-react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const MainLayout = ({ user, children, isTesting = false }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const logout = () => {
        navigate('/');
    };

    const navItems = [
        { id: 'dashboard', path: '/dashboard', icon: <Compass size={20} />, label: parseInt(user?.grade) <= 6 ? 'IQ TEST' : 'Career Aptitude Test' },
        { id: 'results', path: '/results', icon: <History size={20} />, label: 'My Results' },
        { id: 'certificates', path: '/certificates', icon: <Award size={20} />, label: 'Certificates' },
        // { id: 'students', path: '/students', icon: <Users size={20} />, label: 'Student Master' },
    ];

    return (
        <div className={`${isTesting ? 'h-screen overflow-hidden' : 'min-h-screen'} bg-white flex flex-col font-sans text-slate-900`}>
            {/* Top Navigation - Udemy Style */}
            <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-4 md:px-8 shrink-0 z-[100] sticky top-0">
                <div className="flex items-center gap-4">
                    {!isTesting && (
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 hover:bg-slate-100 rounded-md">
                            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    )}
                    <Link to="/dashboard" className="flex items-center gap-2">
                        <img src="/logo-1.png" alt="Navodaya Wala" className="h-10 w-auto object-contain" />
                    </Link>
                </div>

                {!isTesting && (
                    <div className="flex-1 max-w-xl px-10 hidden md:block">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search your courses or tests..."
                                className="w-full bg-slate-50 border border-slate-300 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-slate-900 transition-all font-medium"
                            />
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-4">
                    {!isTesting && (
                        <>
                            <button className="hidden sm:flex items-center gap-1 text-sm font-medium hover:text-violet-600 transition-colors">
                                <Bell size={18} />
                            </button>
                            <div className="h-8 w-px bg-slate-200 mx-2" />
                        </>
                    )}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white text-xs font-bold">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Clean Sidebar */}
                <AnimatePresence>
                    {(isSidebarOpen || !isTesting) && (
                        <aside className={`
                            ${isSidebarOpen ? 'flex' : 'hidden'} 
                            lg:flex flex-col w-64 border-r border-slate-200 bg-white shrink-0
                            absolute lg:relative inset-y-0 left-0 z-[90]
                        `}>
                            <nav className="flex-1 p-4 space-y-1">
                                {isTesting ? (
                                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Test Mode</h4>
                                        <p className="text-xs text-slate-600 leading-relaxed font-medium">Standard exam environment active. Please stay on this tab.</p>
                                    </div>
                                ) : (
                                    navItems.map((item) => (
                                        <Link
                                            key={item.id}
                                            to={item.path}
                                            onClick={() => setIsSidebarOpen(false)}
                                            className={`flex items-center gap-3 px-4 py-3 rounded text-sm font-medium transition-all ${location.pathname === item.path
                                                ? 'bg-violet-600 text-white'
                                                : 'text-slate-600 hover:bg-slate-100'
                                                }`}
                                        >
                                            {item.icon}
                                            {item.label}
                                        </Link>
                                    ))
                                )}
                            </nav>

                            <div className="p-4 border-t border-slate-200">
                                <button
                                    onClick={logout}
                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded transition-all"
                                >
                                    <LogOut size={18} />
                                    Sign Out
                                </button>
                            </div>
                        </aside>
                    )}
                </AnimatePresence>

                {/* Overlay for mobile sidebar */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[80] lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* Main View Area */}
                <main className={`flex-1 bg-slate-50 relative ${isTesting ? 'h-full overflow-hidden' : 'overflow-y-auto'}`}>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
