import React, { useState, useEffect } from 'react';
import { generateCareerRoadmap } from '../services/geminiService';
import { getCurrentUser, saveRoadmap, completeRoadmapNode } from '../services/auth';
import { Roadmap, RoadmapNode } from '../types';
import { Sparkles, CheckCircle, Lock, PlayCircle, Clock, BookOpen, AlertCircle, Loader2, Save, Edit, X, Plus, Trash2 } from 'lucide-react';

const RoadmapGenerator: React.FC = () => {
  const [user, setUser] = useState(getCurrentUser());
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editableRoadmap, setEditableRoadmap] = useState<Roadmap | null>(null);
  const [completingNodeId, setCompletingNodeId] = useState<string | null>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser?.roadmapJson) {
      try {
        const savedRoadmap = JSON.parse(currentUser.roadmapJson);
        setRoadmap(savedRoadmap);
        setIsSaved(true);
      } catch (e) {
        console.error("Failed to parse saved roadmap", e);
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
    const roadmapToSave = isEditing ? editableRoadmap : roadmap;
    if (!roadmapToSave || !user) return;
    setSaving(true);
    setError(null);
    try {
      const updatedUser = await saveRoadmap(user.id, roadmapToSave);
      setUser(updatedUser);
      setRoadmap(roadmapToSave);
      setIsSaved(true);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || "Failed to save roadmap.");
    } finally {
      setSaving(false);
    }
  };

  const handleCompleteNode = async (nodeId: string) => {
    setCompletingNodeId(nodeId);
    setError(null);
    try {
      const updatedRoadmap = await completeRoadmapNode(nodeId);
      setRoadmap(updatedRoadmap);
    } catch (err) {
      setError("Failed to update progress. Please try again.");
    } finally {
      setCompletingNodeId(null);
    }
  };

  const handleStartEditing = () => {
    setEditableRoadmap(JSON.parse(JSON.stringify(roadmap))); // Deep copy
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
    setEditableRoadmap(null);
  };
  
  const handleRoadmapChange = (field: keyof Roadmap, value: string) => {
    if (editableRoadmap) {
      setEditableRoadmap({ ...editableRoadmap, [field]: value });
    }
  };

  const handleNodeChange = (index: number, field: keyof RoadmapNode, value: string | number) => {
    if (editableRoadmap) {
      const newNodes = [...editableRoadmap.nodes];
      (newNodes[index] as any)[field] = value;
      setEditableRoadmap({ ...editableRoadmap, nodes: newNodes });
    }
  };
  
  const handleTopicChange = (nodeIndex: number, topicIndex: number, value: string) => {
      if (editableRoadmap) {
          const newNodes = [...editableRoadmap.nodes];
          newNodes[nodeIndex].topics[topicIndex] = value;
          setEditableRoadmap({ ...editableRoadmap, nodes: newNodes });
      }
  };

  const handleAddTopic = (nodeIndex: number) => {
      if (editableRoadmap) {
          const newNodes = [...editableRoadmap.nodes];
          newNodes[nodeIndex].topics.push("New Topic");
          setEditableRoadmap({ ...editableRoadmap, nodes: newNodes });
      }
  };
  
  const handleRemoveTopic = (nodeIndex: number, topicIndex: number) => {
      if (editableRoadmap) {
          const newNodes = [...editableRoadmap.nodes];
          newNodes[nodeIndex].topics.splice(topicIndex, 1);
          setEditableRoadmap({ ...editableRoadmap, nodes: newNodes });
      }
  };

  const showGenerator = () => {
    setRoadmap(null);
    setQuery('');
    setIsSaved(false);
    setIsEditing(false);
  };

  // ----- Render Methods -----

  const renderRoadmapDisplay = () => (
    <div className="flex-1 overflow-y-auto pr-4">
      {(roadmap || editableRoadmap) ? (
        <div className="relative pl-8 pb-10">
          <RoadmapHeader />
          <div className="absolute left-8 top-1 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700"></div>
          <div className="space-y-8">
            {(isEditing ? editableRoadmap!.nodes : roadmap!.nodes).map((node, index) => (
              <RoadmapNodeItem key={node.id} node={node} index={index} />
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
  
  const RoadmapHeader = () => {
      const currentRoadmap = isEditing ? editableRoadmap : roadmap;
      if (!currentRoadmap) return null;

      return (
          <div className="mb-6">
              {isEditing ? (
                  <div className="space-y-2">
                      <input 
                          type="text"
                          value={currentRoadmap.title}
                          onChange={(e) => handleRoadmapChange('title', e.target.value)}
                          className="text-xl font-bold text-slate-900 bg-slate-100 p-2 rounded w-full border border-slate-300"
                      />
                      <textarea 
                          value={currentRoadmap.description}
                          onChange={(e) => handleRoadmapChange('description', e.target.value)}
                          className="text-sm text-slate-500 bg-slate-100 p-2 rounded w-full border border-slate-300"
                          rows={2}
                      />
                  </div>
              ) : (
                  <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">{currentRoadmap.title}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{currentRoadmap.description}</p>
                  </div>
              )}
          </div>
      );
  };

  const RoadmapNodeItem = ({ node, index }: { node: RoadmapNode, index: number }) => (
    <div className="relative pl-8 animate-slide-in" style={{ animationDelay: `${index * 100}ms` }}>
      <div className={`absolute left-[-5px] top-1 w-10 h-10 rounded-full border-4 flex items-center justify-center z-10 bg-cyber-900 transition-colors ${
        node.status === 'completed' ? 'border-cyber-accent text-cyber-accent' :
        node.status === 'active' ? 'border-cyber-secondary text-cyber-secondary animate-pulse' :
        'border-slate-300 dark:border-slate-600 text-slate-300 dark:text-slate-600'
      }`}>
        {node.status === 'completed' ? <CheckCircle size={20} /> :
         node.status === 'active' ? <PlayCircle size={20} /> :
         <Lock size={18} />}
      </div>

      <div className={`p-5 rounded-xl border transition-all ${
        !isEditing && node.status === 'active' 
          ? 'bg-white dark:bg-cyber-800 border-cyber-secondary shadow-[0_4px_20px_rgba(124,58,237,0.15)]' 
          : 'bg-white dark:bg-cyber-800 border-cyber-700 opacity-90 hover:opacity-100 shadow-sm'
      }`}>
        {isEditing ? 
            <EditableNodeContent node={node} index={index} /> : 
            <StaticNodeContent node={node} />
        }
      </div>
    </div>
  );

  const StaticNodeContent = ({ node }: { node: RoadmapNode }) => (
    <>
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-lg font-bold text-slate-900 dark:text-white">{node.title}</h4>
        <span className="text-xs font-mono bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-slate-500 dark:text-slate-300 flex items-center gap-1 border border-slate-200 dark:border-slate-600">
          <Clock size={12} /> {node.estimatedHours}h
        </span>
      </div>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">{node.description}</p>
      
      <div className="flex flex-wrap gap-2">
        {node.topics.map(topic => (
          <span key={topic} className="px-2 py-1 bg-slate-50 dark:bg-slate-700/50 rounded text-xs text-cyber-accent border border-cyber-accent/20 font-medium">
            {topic}
          </span>
        ))}
      </div>
      
      {node.status === 'active' && (
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex gap-3">
              <button 
                onClick={() => handleCompleteNode(node.id)}
                disabled={completingNodeId === node.id}
                className="flex-1 py-2 bg-cyber-secondary hover:bg-violet-700 text-white rounded font-medium text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                  {completingNodeId === node.id ? <Loader2 className="animate-spin" size={16}/> : <CheckCircle size={16}/>}
                  Mark as Complete
              </button>
              <button className="px-4 py-2 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 rounded text-slate-500 transition-colors"><BookOpen size={18}/></button>
          </div>
      )}
    </>
  );
  
  const EditableNodeContent = ({ node, index }: { node: RoadmapNode, index: number }) => (
      <div className="space-y-3">
          <input 
              type="text"
              value={node.title}
              onChange={(e) => handleNodeChange(index, 'title', e.target.value)}
              className="text-lg font-bold text-slate-900 bg-slate-100 p-2 rounded w-full border border-slate-300"
          />
           <textarea 
              value={node.description}
              onChange={(e) => handleNodeChange(index, 'description', e.target.value)}
              className="text-sm text-slate-600 bg-slate-100 p-2 rounded w-full border border-slate-300"
              rows={3}
          />
          <div>
              <label className="text-xs font-medium text-slate-500 mb-2 block">Topics</label>
              <div className="space-y-2">
                  {node.topics.map((topic, topicIndex) => (
                      <div key={topicIndex} className="flex items-center gap-2">
                          <input 
                              type="text"
                              value={topic}
                              onChange={(e) => handleTopicChange(index, topicIndex, e.target.value)}
                              className="flex-1 bg-slate-50 p-1.5 rounded text-xs border border-slate-200"
                          />
                          <button onClick={() => handleRemoveTopic(index, topicIndex)} className="text-red-500 hover:text-red-700"><Trash2 size={14}/></button>
                      </div>
                  ))}
              </div>
              <button onClick={() => handleAddTopic(index)} className="mt-2 flex items-center gap-1 text-xs text-emerald-600 font-semibold hover:text-emerald-800">
                  <Plus size={14}/> Add Topic
              </button>
          </div>
      </div>
  );

  return (
    <div className="h-full flex flex-col animate-fade-in">
      {!roadmap ? (
        <div className="bg-cyber-800 p-6 rounded-xl border border-cyber-700 mb-6 shadow-sm flex-shrink-0">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2"><Sparkles className="text-cyber-secondary" /> AI Career Pathfinder</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">Enter your dream job role (e.g., "DevOps Engineer"), and Gemini will generate a personalized curriculum.</p>
            <div className="flex flex-col sm:flex-row gap-4">
                <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleGenerate()} placeholder="e.g. Senior React Native Developer" className="flex-1 bg-cyber-900 border border-cyber-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyber-accent focus:ring-1 focus:ring-cyber-accent transition-all" />
                <button onClick={handleGenerate} disabled={loading || !query} className="px-6 py-3 bg-cyber-secondary hover:bg-violet-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm">
                    {loading ? <Loader2 className="animate-spin" /> : 'Generate Path'}
                </button>
            </div>
        </div>
      ) : (
        <div className="bg-cyber-800 p-4 rounded-xl border border-cyber-700 mb-6 shadow-sm flex justify-between items-center flex-shrink-0">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">My Learning Path</h2>
            <div className="flex items-center gap-2">
                {isEditing ? (
                    <>
                        <button onClick={handleCancelEditing} className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"><X size={14}/> Cancel</button>
                        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-emerald-600 border border-emerald-700 rounded-md hover:bg-emerald-700 transition-colors">{saving ? <Loader2 size={14} className="animate-spin"/> : <Save size={14}/>} Save Changes</button>
                    </>
                ) : (
                    <>
                        <button onClick={handleStartEditing} className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"><Edit size={14}/> Edit Path</button>
                        <button onClick={showGenerator} className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"><Sparkles size={14}/> Create New</button>
                    </>
                )}
            </div>
        </div>
      )}

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-center gap-2 text-sm flex-shrink-0"><AlertCircle size={16} /> {error}</div>}
      
      {renderRoadmapDisplay()}
    </div>
  );
};

const MapIconPlaceholder = () => (<svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300 dark:text-slate-600"><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></svg>);

export default RoadmapGenerator;