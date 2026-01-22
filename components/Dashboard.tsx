import React from 'react';
import { UserStats, View } from '../types';
import { Flame, Trophy, Target, ArrowRight, Activity, Zap } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Cell } from 'recharts';
import { completeActivity } from '../services/auth';

interface DashboardProps {
  stats: UserStats;
  onChangeView: (view: View) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ stats, onChangeView }) => {

  const handleCompleteActivity = async () => {
    try {
      await completeActivity();
      // The UI will update via WebSocket, so no local state change is needed here.
    } catch (error) {
      console.error("Could not complete activity", error);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Welcome back! 🚀</h1>
        <p className="text-slate-500 dark:text-slate-400">You're on a great streak. Keep pushing towards your goals.</p>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-cyber-800 p-6 rounded-xl border border-cyber-700 flex items-center gap-4 hover:border-cyber-accent/50 transition-colors shadow-sm">
          <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-orange-500">
            <Flame size={28} />
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Daily Streak</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.streak} Days</p>
          </div>
        </div>

        <div className="bg-cyber-800 p-6 rounded-xl border border-cyber-700 flex items-center gap-4 hover:border-cyber-accent/50 transition-colors shadow-sm">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-cyber-accent">
            <Target size={28} />
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Total XP</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.xp.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-cyber-800 p-6 rounded-xl border border-cyber-700 flex items-center gap-4 hover:border-cyber-accent/50 transition-colors shadow-sm">
          <div className="p-3 bg-violet-100 dark:bg-violet-900/30 rounded-lg text-cyber-secondary">
            <Trophy size={28} />
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Current Rank</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.rank}</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Activity Chart */}
        <div className="lg:col-span-2 bg-cyber-800 p-6 rounded-xl border border-cyber-700 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity size={18} className="text-cyber-accent"/> Activity Log
            </h3>
            <select className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-200 text-sm rounded px-2 py-1 outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.activityData}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--cyber-800)', borderColor: 'var(--cyber-700)', color: 'var(--text-primary)', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                  itemStyle={{ color: '#059669' }}
                  cursor={{fill: 'rgba(0,0,0,0.03)'}}
                />
                <Bar dataKey="xp" radius={[4, 4, 0, 0]}>
                  {stats.activityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === stats.activityData.length - 1 ? '#059669' : '#cbd5e1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions / Active Path */}
        <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 p-6 rounded-xl border border-cyber-700 flex flex-col justify-between relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Continue Learning</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">You're 60% through "Advanced Spring Boot Security". Complete the next lab to earn a badge!</p>
            
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full mb-2">
              <div className="bg-cyber-accent h-2 rounded-full" style={{ width: '60%' }}></div>
            </div>
            <p className="text-xs text-right text-cyber-accent font-medium mb-6">60% Completed</p>
          </div>

          <div className="space-y-2">
            <button 
                onClick={() => onChangeView(View.ROADMAP)}
                className="w-full py-3 bg-cyber-accent hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
                Resume Path <ArrowRight size={18} />
            </button>
            <button 
                onClick={handleCompleteActivity}
                className="w-full py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 text-sm font-bold rounded-lg hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2"
            >
                <Zap size={16}/> Complete a Lab (+50 XP)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;