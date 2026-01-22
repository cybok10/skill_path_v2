import React, { useState } from 'react';
import { generateLabChallenge } from '../services/geminiService';
import { Terminal, Play, RefreshCw, CheckCircle, Code } from 'lucide-react';

const SkillLab: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [lab, setLab] = useState<{title: string, description: string, starterCode: string} | null>(null);
    const [loading, setLoading] = useState(false);
    const [userCode, setUserCode] = useState('');
    const [output, setOutput] = useState<string | null>(null);

    const handleCreateLab = async () => {
        if(!topic) return;
        setLoading(true);
        setLab(null);
        setOutput(null);
        try {
            const result = await generateLabChallenge(topic);
            setLab(result);
            setUserCode(result.starterCode);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleRun = () => {
        // Mock execution
        setOutput("Running tests...\nTest Case 1: PASSED\nTest Case 2: PASSED\n\nResult: Success! XP Gained +50");
    };

    return (
        <div className="h-full flex flex-col gap-6 animate-fade-in">
            {!lab ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 bg-cyber-800 rounded-xl border border-cyber-700 text-center shadow-sm">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 border-2 border-dashed border-slate-300">
                        <Terminal size={40} className="text-cyber-accent" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Initialize Skill Lab</h2>
                    <p className="text-slate-500 mb-8 max-w-md">
                        Generate a customized coding challenge based on any topic. The AI will create a scenario and starter code for you to solve.
                    </p>
                    <div className="flex gap-2 w-full max-w-md">
                        <input 
                            type="text" 
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="Topic (e.g. React Hooks, Python Lists)"
                            className="flex-1 bg-cyber-900 border border-cyber-700 rounded px-4 py-2 text-slate-900 focus:outline-none focus:border-cyber-accent focus:ring-1 focus:ring-cyber-accent"
                        />
                        <button 
                            onClick={handleCreateLab}
                            disabled={loading || !topic}
                            className="px-6 py-2 bg-cyber-accent text-white font-bold rounded hover:bg-emerald-600 disabled:opacity-50 transition-colors"
                        >
                            {loading ? 'Generating...' : 'Start Lab'}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="h-full flex flex-col md:flex-row gap-6">
                    {/* Instructions Panel */}
                    <div className="w-full md:w-1/3 bg-cyber-800 rounded-xl border border-cyber-700 flex flex-col overflow-hidden shadow-sm">
                        <div className="p-4 border-b border-cyber-700 bg-slate-50">
                            <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                <Code size={18} className="text-cyber-secondary"/> {lab.title}
                            </h3>
                        </div>
                        <div className="p-6 overflow-y-auto flex-1 text-slate-600 leading-relaxed text-sm">
                            <p>{lab.description}</p>
                            <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                                <h4 className="text-emerald-700 font-bold mb-1 text-xs uppercase">Objective</h4>
                                <p className="text-emerald-600 text-xs">Complete the code in the editor to satisfy the requirements.</p>
                            </div>
                        </div>
                        <div className="p-4 border-t border-cyber-700">
                            <button onClick={() => setLab(null)} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 text-sm">
                                <RefreshCw size={14} /> Generate New Lab
                            </button>
                        </div>
                    </div>

                    {/* Editor Panel */}
                    <div className="flex-1 flex flex-col gap-4">
                        <div className="flex-1 bg-[#1e1e1e] rounded-xl border border-cyber-700 overflow-hidden flex flex-col shadow-lg">
                            <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-[#333]">
                                <span className="text-xs text-slate-400 font-mono">main.js</span>
                                <button 
                                    onClick={handleRun}
                                    className="flex items-center gap-2 px-3 py-1 bg-cyber-accent text-white rounded text-xs font-bold hover:bg-emerald-600 transition-colors"
                                >
                                    <Play size={14} /> Run Code
                                </button>
                            </div>
                            <textarea 
                                value={userCode}
                                onChange={(e) => setUserCode(e.target.value)}
                                className="flex-1 bg-transparent text-slate-300 font-mono p-4 resize-none focus:outline-none text-sm leading-6"
                                spellCheck={false}
                            />
                        </div>

                        {/* Console Output */}
                        <div className="h-40 bg-slate-900 rounded-xl border border-cyber-700 p-4 font-mono text-xs overflow-y-auto text-slate-300 shadow-sm">
                            <div className="text-slate-500 mb-2 border-b border-slate-700 pb-1">Console Output</div>
                            {output ? (
                                <pre className="text-emerald-400 whitespace-pre-wrap">{output}</pre>
                            ) : (
                                <span className="text-slate-600 italic">Ready to execute...</span>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SkillLab;