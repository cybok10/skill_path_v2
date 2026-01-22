import React, { useState, useEffect } from 'react';
import { generateCareerRoadmap } from '../services/geminiService';
import { getCurrentUser, saveRoadmap } from '../services/auth';
import { Roadmap } from '../types';
import { Sparkles, CheckCircle, Lock, PlayCircle, Clock, BookOpen, AlertCircle, Loader2, Save, Edit } from 'lucide-react';

const RoadmapGenerator: React.FC = () => {
  const [user, setUser] = useState(getCurrentUser());
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser?.roadmapJson) {
      try {
        const savedRoadmap = JSON.parse(currentUser.roadmapJson);
        setRoadmap(savedRoadmap);
        setIsSaved(true);
      } catch (e) {
        console.error("Failed to parse saved roadmap", e);
        // Clear corrupted roadmap data from local storage
        const updatedUser = { ...currentUser, roadmapJson: null };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
    }
  }, []);

  const handleGenerate = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const result = await generateCareerRoadmap(query);
      setRoadmap(result);
      setIsSaved(false);
    } catch (err) {
      setError("Failed to generate roadmap. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleSave = async () => {
    if (!roadmap || !user) return;
    setSaving(true);
    setError(null);
    try {
      const updatedUser = await saveRoadmap(user.id, roadmap);
      setUser(updatedUser);
      setIsSaved(true);
    } catch (err: any) {
      setError(err.message || "Failed to save roadmap.");
    } finally {
      setSaving(false);
    }
  };

  const showGenerator = () => {
    setRoadmap(null);
    setQuery('');
    setIsSaved(false);
  };

  // ----- Render Methods -----

  const renderGeneratorInput = () => (
    <div className="bg-cyber-800 p-6 rounded-xl border border-cyber-700 mb-6 shadow-sm flex-shrink-0">
      <h2 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2">
        <Sparkles className="text-cyber-secondary" /> AI Career Pathfinder
      </h2>
      <p className="text-slate-500 mb-6">Enter your dream job role (e.g., "DevOps Engineer"), and Gemini will generate a personalized curriculum.</p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          placeholder="e.g. Senior React Native Developer"
          className="flex-1 bg-cyber-900 border border-cyber-700 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyber-accent focus:ring-1 focus:ring-cyber-accent transition-all"
        />
        <button
          onClick={handleGenerate}
          disabled={loading || !query}
          className="px-6 py-3 bg-cyber-secondary hover:bg-violet-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
        >
          {loading ? <Loader2 className="animate-spin" /> : 'Generate Path'}
        </button>
      </div>
    </div>
  );

  const renderRoadmapDisplay = () => (
    <div className="flex-1 overflow-y-auto">
      {roadmap ? (
        <div className="relative pl-8 pb-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900">{roadmap.title}</h3>
              <p className="text-sm text-slate-500">{roadmap.description}</p>
            </div>
            {isSaved ? (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-xs font-medium border border-emerald-200">
                    <CheckCircle size={14} /> Saved
                </div>
            ) : (
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm text-sm"
                >
                    {saving ? <Loader2 className="animate-spin" size={16}/> : <Save size={16} />} Save to My Path
                </button>
            )}
          </div>
          
          <div className="absolute left-8 top-1 bottom-0 w-0.5 bg-slate-200"></div>

          <div className="space-y-8">
            {roadmap.nodes.map((node, index) => (
              <div key={node.id} className="relative pl-8 animate-slide-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div className={`absolute left-[-5px] top-1 w-10 h-10 rounded-full border-4 flex items-center justify-center z-10 bg-cyber-900 transition-colors ${
                  node.status === 'completed' ? 'border-cyber-accent text-cyber-accent' :
                  node.status === 'active' ? 'border-cyber-secondary text-cyber-secondary animate-pulse' :
                  'border-slate-300 text-slate-300'
                }`}>
                  {node.status === 'completed' ? <CheckCircle size={20} /> :
                   node.status === 'active' ? <PlayCircle size={20} /> :
                   <Lock size={18} />}
                </div>

                <div className={`p-5 rounded-xl border transition-all ${
                  node.status === 'active' 
                    ? 'bg-white border-cyber-secondary shadow-[0_4px_20px_rgba(124,58,237,0.15)]' 
                    : 'bg-white border-cyber-700 opacity-90 hover:opacity-100 shadow-sm'
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-bold text-slate-900">{node.title}</h4>
                    <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-500 flex items-center gap-1 border border-slate-200">
                      <Clock size={12} /> {node.estimatedHours}h
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm mb-4">{node.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {node.topics.map(topic => (
                      <span key={topic} className="px-2 py-1 bg-slate-50 rounded text-xs text-cyber-accent border border-cyber-accent/20 font-medium">
                        {topic}
                      </span>
                    ))}
                  </div>
                  
                  {node.status === 'active' && (
                      <div className="mt-4 pt-4 border-t border-slate-100 flex gap-3">
                          <button className="flex-1 py-2 bg-cyber-secondary hover:bg-violet-700 text-white rounded font-medium text-sm transition-colors shadow-sm">Start Module</button>
                          <button className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded text-slate-500 transition-colors"><BookOpen size={18}/></button>
                      </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-50">
          <MapIconPlaceholder />
          <p className="mt-4 text-slate-500">Your personalized roadmap awaits.</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="h-full flex flex-col animate-fade-in">
      {!roadmap ? (
        renderGeneratorInput()
      ) : (
        <div className="bg-cyber-800 p-4 rounded-xl border border-cyber-700 mb-6 shadow-sm flex justify-between items-center flex-shrink-0">
            <h2 className="text-lg font-bold text-slate-900">My Learning Path</h2>
            <button 
                onClick={showGenerator}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-slate-50 hover:text-slate-900 transition-colors"
            >
                <Edit size={14} /> Create New
            </button>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-center gap-2 text-sm flex-shrink-0">
            <AlertCircle size={16} /> {error}
        </div>
      )}
      
      {renderRoadmapDisplay()}
    </div>
  );
};

const MapIconPlaceholder = () => (
    <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
        <path d="M12 2v20" />
    </svg>
);

export default RoadmapGenerator;