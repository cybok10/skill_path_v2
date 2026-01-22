import React, { useState, useRef, useEffect } from 'react';
import { chatWithTutor } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Send, Bot, User, RefreshCw } from 'lucide-react';

const AITutor: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: "Hello! I'm your SkillPath mentor. I can help you understand complex topics, debug code, or prepare for interviews. What are we working on today?",
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // Format history for Gemini API
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const responseText = await chatWithTutor(history, userMsg.text);

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "I'm having trouble connecting to the neural network. Please try again.",
        timestamp: Date.now()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-cyber-800 rounded-xl border border-cyber-700 overflow-hidden animate-fade-in shadow-sm">
      <div className="p-4 border-b border-cyber-700 bg-white flex justify-between items-center shadow-sm z-10">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-100 rounded-full text-cyber-secondary">
                <Bot size={20} />
            </div>
            <div>
                <h3 className="font-bold text-slate-900">AI Mentor</h3>
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs text-slate-500">Online • Gemini 3 Flash</span>
                </div>
            </div>
        </div>
        <button 
            onClick={() => setMessages([messages[0]])}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900 transition-colors" title="Reset Chat">
            <RefreshCw size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-cyber-900">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[80%] gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-sm ${
                msg.role === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-cyber-secondary text-white'
              }`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              
              <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-cyber-accent text-white rounded-tr-none font-medium' 
                  : 'bg-white text-slate-700 rounded-tl-none border border-slate-200'
              }`}>
                {msg.text.split('\n').map((line, i) => (
                    <p key={i} className={i > 0 ? 'mt-2' : ''}>{line}</p>
                ))}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start w-full">
             <div className="flex max-w-[80%] gap-3">
                <div className="w-8 h-8 rounded-full bg-cyber-secondary text-white flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot size={16} />
                </div>
                <div className="p-4 rounded-2xl bg-white rounded-tl-none border border-slate-200 flex items-center gap-2 shadow-sm">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
                </div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-cyber-700">
        <div className="flex gap-3 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !isTyping && handleSend()}
            placeholder="Ask about your roadmap, coding concepts, or career advice..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-lg pl-4 pr-12 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyber-accent focus:ring-1 focus:ring-cyber-accent transition-all"
            disabled={isTyping}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="absolute right-2 top-2 p-1.5 bg-cyber-accent text-white rounded-md hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AITutor;