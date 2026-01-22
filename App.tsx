import React, { useState, useEffect, createContext, useContext } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import UserProfile from './components/UserProfile';
import Welcome from './components/Welcome';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import { getCurrentUser, logout } from './services/auth';
import { socketService } from './services/socketService';
import Layout from './components/Layout'; 
import Dashboard from './components/Dashboard';
import RoadmapGenerator from './components/RoadmapGenerator';
import SkillLab from './components/SkillLab';
import AITutor from './components/AITutor';
import Analytics from './components/Analytics';
import { View, UserStats } from './types';

// --- Theme Context ---
export const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {}
});

export const useTheme = () => useContext(ThemeContext);

const App = () => {
  const [user, setUser] = useState(() => getCurrentUser());
  const [appView, setAppView] = useState<'welcome' | 'login' | 'register' | 'forgot-password' | 'reset-password' | 'authenticated'>(() => {
    return getCurrentUser() ? 'authenticated' : 'welcome';
  });
  const [currentAuthView, setCurrentAuthView] = useState<View | 'PROFILE'>(View.DASHBOARD);
  const [resetToken, setResetToken] = useState<string>('');
  
  // Real-time user stats, managed at the top level
  const [userStats, setUserStats] = useState<UserStats>({
    xp: 12450,
    streak: 12,
    level: 5,
    rank: 'Code Ninja',
    skills: [
      { subject: 'React', A: 80, fullMark: 100 },
      { subject: 'Java', A: 65, fullMark: 100 },
      { subject: 'System Design', A: 45, fullMark: 100 },
      { subject: 'DevOps', A: 30, fullMark: 100 },
      { subject: 'Security', A: 90, fullMark: 100 },
    ],
    activityData: [
      { name: 'Mon', xp: 400 },
      { name: 'Tue', xp: 300 },
      { name: 'Wed', xp: 600 },
      { name: 'Thu', xp: 200 },
      { name: 'Fri', xp: 500 },
      { name: 'Sat', xp: 800 },
      { name: 'Sun', xp: 450 },
    ]
  });

  // Theme State
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  const handleUserUpdate = (updatedUserData) => {
    setUser(updatedUserData);
  };

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      if (appView !== 'authenticated') {
         setAppView('authenticated');
      }
      // Connect to WebSocket on authenticated load
      socketService.connect(currentUser.token, (newMetrics) => {
        console.log("Received real-time metrics:", newMetrics);
        setUserStats(prevStats => ({
          ...prevStats,
          xp: newMetrics.xp,
          streak: newMetrics.streak,
        }));
      });
    } else {
      socketService.disconnect();
    }
    
    // Cleanup on component unmount
    return () => {
        socketService.disconnect();
    };
  }, [appView]);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setAppView('authenticated');
    setCurrentAuthView(View.DASHBOARD);
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setAppView('welcome');
    socketService.disconnect();
    window.location.reload(); // Force a clean state
  };

  // --- RENDER LOGIC ---

  const renderView = () => {
    if (appView === 'welcome') {
      return (
        <Welcome 
          onGetStarted={() => setAppView('register')} 
          onLogin={() => setAppView('login')} 
        />
      );
    }

    if (appView === 'login') {
      return (
        <div className="min-h-screen bg-cyber-900 flex flex-col items-center justify-center p-4">
          <Login 
            onLoginSuccess={handleLoginSuccess} 
            onSwitchToRegister={() => setAppView('register')} 
            onSwitchToForgot={() => setAppView('forgot-password')}
          />
          <button onClick={() => setAppView('welcome')} className="mt-8 text-slate-500 hover:text-slate-900 dark:hover:text-slate-300 text-sm">
             Back to Home
          </button>
        </div>
      );
    }

    if (appView === 'register') {
      return (
        <div className="min-h-screen bg-cyber-900 flex flex-col items-center justify-center p-4">
          <Register 
            onRegisterSuccess={() => setAppView('login')} 
            onSwitchToLogin={() => setAppView('login')} 
          />
          <button onClick={() => setAppView('welcome')} className="mt-8 text-slate-500 hover:text-slate-900 dark:hover:text-slate-300 text-sm">
             Back to Home
          </button>
        </div>
      );
    }

    if (appView === 'forgot-password') {
        return (
            <div className="min-h-screen bg-cyber-900 flex flex-col items-center justify-center p-4">
                <ForgotPassword 
                  onBack={() => setAppView('login')}
                  onSimulateLinkClick={(token) => {
                      setResetToken(token);
                      setAppView('reset-password');
                  }}
                />
            </div>
        );
    }

    if (appView === 'reset-password') {
        return (
            <div className="min-h-screen bg-cyber-900 flex flex-col items-center justify-center p-4">
                <ResetPassword 
                  token={resetToken}
                  onSuccess={() => setAppView('login')}
                />
            </div>
        );
    }

    // --- AUTHENTICATED APP ---
    if (appView === 'authenticated' && user) {
      const renderContent = () => {
          switch (currentAuthView) {
              case View.DASHBOARD: return <Dashboard stats={userStats} onChangeView={setCurrentAuthView} />;
              case View.ROADMAP: return <RoadmapGenerator />;
              case View.LABS: return <SkillLab />;
              case View.TUTOR: return <AITutor />;
              case View.ANALYTICS: return <Analytics stats={userStats} />;
              // FIX: Corrected typo from setCurrentAuthVew to setCurrentAuthView.
              default: return <Dashboard stats={userStats} onChangeView={setCurrentAuthView} />;
          }
      };

      if (currentAuthView === 'PROFILE') {
          return (
              <div className="min-h-screen bg-cyber-900 flex items-center justify-center p-4">
                  <UserProfile user={user} onUpdate={handleUserUpdate} onBack={() => setCurrentAuthView(View.DASHBOARD)} />
              </div>
          )
      }

      return (
          <Layout currentView={currentAuthView} setCurrentView={setCurrentAuthView} onLogout={handleLogout}>
               {renderContent()}
          </Layout>
      );
    }

    return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading session...</div>; 
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {renderView()}
    </ThemeContext.Provider>
  );
};

export default App;
