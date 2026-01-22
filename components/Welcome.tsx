import React from 'react';
import { ArrowRight, Terminal, Map, Zap, Shield, ChevronRight, Cpu } from 'lucide-react';

interface WelcomeProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onGetStarted, onLogin }) => {
  return (
    <div className="min-h-screen bg-cyber-900 flex flex-col font-sans">
       {/* Navbar */}
       <nav className="max-w-7xl mx-auto w-full px-6 py-6 flex justify-between items-center z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-500/20">SP</div>
            <span className="font-bold text-slate-900 text-xl tracking-tight">SkillPath AI</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
                onClick={onLogin} 
                className="text-slate-600 hover:text-slate-900 font-semibold text-sm transition-colors"
            >
                Log In
            </button>
            <button 
                onClick={onGetStarted}
                className="hidden sm:flex px-4 py-2 bg-slate-900 text-white rounded-lg font-medium text-sm hover:bg-slate-800 transition-all shadow-md"
            >
                Get Started
            </button>
          </div>
       </nav>

       {/* Hero Section */}
       <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-12 relative overflow-hidden">
          
          {/* Background Decorative Elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-emerald-200/30 to-violet-200/30 rounded-full blur-3xl -z-0 pointer-events-none"></div>

          <div className="max-w-4xl space-y-8 animate-fade-in relative z-10">
             <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/50 backdrop-blur-sm border border-slate-200 text-slate-600 text-xs font-semibold shadow-sm mb-4">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                v2.0 Now Available with Gemini 3 Flash
             </div>
             
             <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                Accelerate Your Tech Career with <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 bg-300% animate-gradient">
                    Intelligent Mentorship
                </span>
             </h1>
             
             <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
                Stop guessing what to learn next. SkillPath AI generates personalized roadmaps, provides instant coding feedback, and tracks your job readiness using advanced AI.
             </p>

             <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                <button 
                   onClick={onGetStarted}
                   className="group px-8 py-4 bg-slate-900 text-white rounded-xl font-bold text-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-200 hover:shadow-2xl hover:-translate-y-1"
                >
                   Start Learning Now 
                   <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                   onClick={onLogin}
                   className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all shadow-sm hover:shadow-md"
                >
                   Existing User
                </button>
             </div>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-24 w-full px-4 relative z-10">
             <FeatureCard 
                icon={<Map className="text-violet-600" size={24} />}
                title="Dynamic Roadmaps"
                desc="Tell the AI your dream role. It builds a bespoke, step-by-step curriculum adapting to your pace."
                delay="0ms"
             />
             <FeatureCard 
                icon={<Terminal className="text-emerald-600" size={24} />}
                title="Interactive Labs"
                desc="Generate isolated coding environments and get real-time feedback on your syntax and logic."
                delay="100ms"
             />
             <FeatureCard 
                icon={<Shield className="text-orange-500" size={24} />}
                title="Career Analytics"
                desc="Visualizes your skill growth and calculates a 'Job Readiness Score' for your target position."
                delay="200ms"
             />
          </div>
       </main>

       {/* Simple Footer */}
       <footer className="py-8 border-t border-slate-200 bg-white/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
            <p>© 2025 SkillPath AI. All rights reserved.</p>
            <div className="flex items-center gap-6">
                <span className="flex items-center gap-2"><Cpu size={14}/> Powered by Gemini</span>
                <span>Privacy</span>
                <span>Terms</span>
            </div>
          </div>
       </footer>
    </div>
  );
}

const FeatureCard = ({ icon, title, desc, delay }) => (
   <div 
     className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-500/30 transition-all duration-300 text-left group animate-slide-in-up"
     style={{ animationDelay: delay }}
   >
      <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-6 border border-slate-100 group-hover:scale-110 transition-transform duration-300">
         {icon}
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center justify-between">
        {title} 
        <ChevronRight size={16} className="text-slate-300 group-hover:text-emerald-500 transition-colors opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all" />
      </h3>
      <p className="text-slate-500 leading-relaxed">{desc}</p>
   </div>
);

export default Welcome;