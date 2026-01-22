import React from 'react';
import { UserStats } from '../types';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';
import { TrendingUp, Award, Zap } from 'lucide-react';

interface AnalyticsProps {
  stats: UserStats;
}

const Analytics: React.FC<AnalyticsProps> = ({ stats }) => {
  return (
    <div className="space-y-6 animate-fade-in">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Performance Analytics</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Skill Radar */}
            <div className="bg-cyber-800 p-6 rounded-xl border border-cyber-700 min-h-[400px] shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Zap className="text-yellow-500" size={20}/> Skill Matrix
                </h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={stats.skills}>
                            <PolarGrid stroke="#e2e8f0" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                            <Radar
                                name="Current Skill Level"
                                dataKey="A"
                                stroke="#7c3aed"
                                strokeWidth={2}
                                fill="#7c3aed"
                                fillOpacity={0.3}
                            />
                            <Legend />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
                <p className="text-center text-xs text-slate-500 mt-2">Based on quiz results & lab completions</p>
            </div>

            {/* Badges & Readiness */}
            <div className="space-y-6">
                <div className="bg-cyber-800 p-6 rounded-xl border border-cyber-700 shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <TrendingUp className="text-cyber-accent" size={20}/> Job Readiness Score
                    </h3>
                    <div className="flex items-center gap-6">
                        <div className="relative w-32 h-32 flex items-center justify-center">
                            <svg className="transform -rotate-90 w-32 h-32">
                                <circle cx="64" cy="64" r="60" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
                                <circle cx="64" cy="64" r="60" stroke="#059669" strokeWidth="8" fill="transparent" strokeDasharray={377} strokeDashoffset={377 - (377 * 0.72)} className="transition-all duration-1000 ease-out" />
                            </svg>
                            <span className="absolute text-3xl font-bold text-slate-900">72%</span>
                        </div>
                        <div className="flex-1">
                            <p className="text-slate-600 text-sm mb-2">You are <span className="text-emerald-600 font-bold">Job Ready</span> for Junior roles.</p>
                            <p className="text-slate-400 text-xs">Focus on System Design to unlock Senior opportunities.</p>
                        </div>
                    </div>
                </div>

                <div className="bg-cyber-800 p-6 rounded-xl border border-cyber-700 flex-1 shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <Award className="text-orange-500" size={20}/> Recent Achievements
                    </h3>
                    <div className="grid grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="aspect-square bg-slate-50 rounded-lg border border-slate-200 flex flex-col items-center justify-center p-2 hover:border-orange-400 transition-colors cursor-pointer group">
                                <Award size={24} className={i <= 2 ? "text-orange-500" : "text-slate-300 group-hover:text-slate-400"} />
                                <span className="text-[10px] text-slate-500 mt-2 text-center leading-tight">
                                    {i === 1 ? 'Fast Starter' : i === 2 ? 'Bug Hunter' : 'Locked'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Analytics;