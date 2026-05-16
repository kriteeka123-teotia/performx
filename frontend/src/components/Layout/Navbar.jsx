import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import { LogOut, User as UserIcon, Activity, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass-panel sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800/50 bg-white/80 dark:bg-[#020617]/80 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-indigo-500 dark:to-purple-600 p-2 rounded-xl shadow-md dark:shadow-[0_0_15px_rgba(99,102,241,0.5)] text-white transition-all">
              <Activity size={24} />
            </div>
            <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-indigo-400 dark:to-purple-400 tracking-tight transition-all">
              PerformX
            </span>
          </div>
          <div className="flex items-center space-x-6">
            <button
              onClick={toggleTheme}
              className="p-2.5 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all hover-lift"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
            </button>
            
            {user && (
              <>
                <div className="flex items-center gap-4 bg-white/50 dark:bg-slate-900/60 px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all">
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-bold text-slate-800 dark:text-white leading-tight transition-colors">{user.name}</span>
                    <span className="text-xs text-blue-600 dark:text-indigo-400 font-semibold transition-colors">{user.role} • {user.department}</span>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-indigo-950 flex items-center justify-center text-blue-600 dark:text-indigo-400 border border-blue-100 dark:border-indigo-900/50 shadow-inner transition-colors">
                    <UserIcon size={20} />
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2.5 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all hover-lift"
                  title="Logout"
                >
                  <LogOut size={22} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
