import React from 'react';
import { Search, Bell, Moon, Sun, User, Command } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../store/slices/uiSlice';

const Header = () => {
    const { theme } = useSelector((state) => state.ui);
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    return (
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-6 md:px-10 sticky top-0 z-30 font-sans">
            <div className="flex items-center flex-1 max-w-xl">
                <div className="relative w-full group hidden sm:block">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors">
                        <Search size={16} strokeWidth={2.5} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search platform..."
                        className="w-full pl-11 pr-12 py-2.5 bg-slate-50 border border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-slate-200 transition-all font-medium text-sm"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-1 bg-white border border-slate-200 rounded-lg shadow-sm">
                        <Command size={10} className="text-slate-400" />
                        <span className="text-[10px] font-bold text-slate-400">K</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center space-x-3 md:space-x-5 ml-4">
                <div className="flex items-center bg-slate-50 p-1 rounded-xl">
                    <button
                        onClick={() => dispatch(toggleTheme())}
                        className={`p-2 rounded-lg transition-all ${theme === 'light' ? 'bg-white shadow text-slate-900' : 'text-slate-400 opacity-50'}`}
                    >
                        <Sun size={16} strokeWidth={2.5} />
                    </button>
                    <button
                        onClick={() => dispatch(toggleTheme())}
                        className={`p-2 rounded-lg transition-all ${theme === 'dark' ? 'bg-white shadow text-violet-600' : 'text-slate-400 opacity-50'}`}
                    >
                        <Moon size={16} strokeWidth={2.5} />
                    </button>
                </div>

                <button className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-slate-900 relative transition-all">
                    <Bell size={18} strokeWidth={2.5} />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="h-8 w-[1px] bg-slate-100 mx-1"></div>

                <div className="flex items-center cursor-pointer group">
                    <div className="text-right mr-3 hidden md:block">
                        <p className="text-sm font-bold text-slate-900 leading-none">{user?.name || 'Administrator'}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">{user?.role || 'Super Admin'}</p>
                    </div>
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center p-0.5 border border-slate-100 transition-all group-hover:border-indigo-200">
                        <div className="w-full h-full bg-violet-50 rounded-lg flex items-center justify-center text-violet-600">
                            <User size={20} strokeWidth={2.5} />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
