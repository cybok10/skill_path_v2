import React from 'react';
import { View } from '../types';
import { getCurrentUser, logout } from '../services/auth'; 
import { useTheme } from '../App';
import { 
  LayoutDashboard, 
  Map, 
  Terminal, 
  Bot, 
  BarChart2, 
  LogOut,
  Menu,
  User,
  Moon,
  Sun
} from 'lucide-react';

interface LayoutProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ currentView, setCurrentView, children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const user = getCurrentUser();
  const { theme, toggleTheme } = useTheme();

  const NavItem = ({ view, icon: Icon, label }: { view: View; icon: any; label: string }) => (
    <button
      onClick={() => {
        setCurrentView(view);
        setIsMobileMenuOpen(false);
      }}
      className={`flex items-center w-full px-4 py-3 mb-2 rounded-lg transition-all duration-200 ${
        currentView === view 
          ? 'bg-cyber-accent/10 text-cyber-accent border-r-2 border-cyber-accent' 
          : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
      }`}
    >
      <Icon size={20} className="mr-3" />
      <span className="font-medium">{label}</span>
    </button>
  );

  const handleLogout = () => {
    logout();
    window.location.reload(); 
  };

  return (
    <div className="flex h-screen bg-cyber-900 text-slate-900 dark:text-slate-100 overflow-hidden transition-colors duration-300">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-cyber-800 border-r border-cyber-700">
        <div className="p-6 border-b border-cyber-700 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-gradient-to-tr from-cyber-accent to-cyber-secondary flex items-center justify-center font-bold text-white shadow-md">
              SP
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">SkillPath AI</h1>
          </div>
        </div>
        
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="mb-6">
            <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Platform</p>
            <NavItem view={View.DASHBOARD} icon={LayoutDashboard} label="Dashboard" />
            <NavItem view={View.ROADMAP} icon={Map} label="My Roadmap" />
            <NavItem view={View.LABS} icon={Terminal} label="Skill Labs" />
          </div>
          
          <div className="mb-6">
            <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Mentorship</p>
            <NavItem view={View.TUTOR} icon={Bot} label="AI Tutor" />
            <NavItem view={View.ANALYTICS} icon={BarChart2} label="Analytics" />
          </div>
        </nav>

        <div className="p-4 border-t border-cyber-700 space-y-3">
           {/* Theme Toggle */}
           <button 
             onClick={toggleTheme}
             className="w-full flex items-center justify-between px-3 py-2 text-sm text-slate-500 bg-slate-50 dark:bg-slate-800 dark:text-slate-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
           >
             <span className="flex items-center gap-2">
               {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />} 
               {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
             </span>
             <div className={`w-8 h-4 rounded-full relative transition-colors ${theme === 'dark' ? 'bg-cyber-secondary' : 'bg-slate-300'}`}>
                <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all shadow-sm ${theme === 'dark' ? 'left-4.5' : 'left-0.5'}`} style={{ left: theme === 'dark' ? '18px' : '2px' }}></div>
             </div>
           </button>

           {/* Profile / Logout Section */}
          <div className="flex items-center gap-3 p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors group relative">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800">
                 {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0" onClick={() => setCurrentView('PROFILE' as any)}>
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user?.username || 'User'}</p>
              <p className="text-xs text-slate-500 truncate capitalize">{user?.roles?.[0] || 'Member'}</p>
            </div>
            <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors" title="Logout">
                <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-cyber-800 border-b border-cyber-700">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded bg-gradient-to-tr from-cyber-accent to-cyber-secondary flex items-center justify-center font-bold text-white">
              SP
            </div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">SkillPath AI</h1>
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600 dark:text-slate-300">
            <Menu size={24} />
          </button>
        </header>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute inset-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col">
            <div className="flex justify-end mb-4">
               <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-600 dark:text-slate-300">
                 <LogOut size={24} />
               </button>
            </div>
            <nav className="space-y-2 flex-1">
              <NavItem view={View.DASHBOARD} icon={LayoutDashboard} label="Dashboard" />
              <NavItem view={View.ROADMAP} icon={Map} label="My Roadmap" />
              <NavItem view={View.LABS} icon={Terminal} label="Skill Labs" />
              <NavItem view={View.TUTOR} icon={Bot} label="AI Tutor" />
              <NavItem view={View.ANALYTICS} icon={BarChart2} label="Analytics" />
            </nav>
            
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                 <button onClick={toggleTheme} className="flex items-center gap-3 p-2 w-full text-slate-700 dark:text-slate-300 mb-2">
                    {theme === 'dark' ? <Sun size={20}/> : <Moon size={20} />} {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                 </button>
                 <button onClick={() => setCurrentView('PROFILE' as any)} className="flex items-center gap-3 p-2 w-full text-slate-700 dark:text-slate-300">
                    <User size={20} /> Profile
                 </button>
                 <button onClick={handleLogout} className="flex items-center gap-3 p-2 w-full text-red-600 mt-2">
                    <LogOut size={20} /> Logout
                 </button>
            </div>
          </div>
        )}

        <main className="flex-1 overflow-y-auto bg-cyber-900 p-4 md:p-8 relative">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;