
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, BrainCircuit, User, Sparkles, Image as ImageIcon, Zap, Sun, Palette, Search, ArrowRight } from 'lucide-react';
import { ChatMessage } from '../types';

interface Props {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onSelectSuggestion: (suggestion: string) => void;
  isLoading: boolean;
  referenceImage: string | null;
}

const AIAgent: React.FC<Props> = ({ messages, onSendMessage, onSelectSuggestion, isLoading, referenceImage }) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  const parseSuggestions = (text: string) => {
    const regex = /\[Suggestion: (.*?)\]/g;
    const suggestions: string[] = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      suggestions.push(match[1]);
    }
    // Return clean text and suggestions
    const cleanText = text.replace(/\[Suggestion: (.*?)\]/g, '').trim();
    return { cleanText, suggestions };
  };

  const starterPrompts = [
    "AZ dust-resistant colors?",
    "Suggest a racing theme",
    "Heat-resistant 3M finishes",
  ];

  return (
    <div className="flex flex-col h-[600px] bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
      <div className="p-4 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-md flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-zinc-900 rounded-full animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-orbitron font-black text-white tracking-tight italic">AGENT <span className="text-orange-500">ZERO</span></h3>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-none">STRATEGY MODE</p>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-zinc-950">
        {messages.length === 0 && (
          <div className="space-y-6 py-2">
            <div className="text-center space-y-2">
              <h2 className="text-xl font-orbitron font-bold text-white uppercase italic">Design Advisor</h2>
              <p className="text-xs text-zinc-500 max-w-[250px] mx-auto leading-relaxed">
                Brief, tactical wrap strategy focused on Arizona performance.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {starterPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => onSendMessage(prompt)}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 text-[10px] font-bold text-zinc-400 hover:text-white hover:border-orange-500/50 transition-all"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {messages.map((msg, idx) => {
          const { cleanText, suggestions } = parseSuggestions(msg.text);
          return (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl p-3.5 space-y-3 ${
                msg.role === 'user' 
                ? 'bg-orange-600 text-white font-medium shadow-lg' 
                : 'bg-zinc-800/90 text-zinc-200 border border-zinc-700 shadow-inner'
              }`}>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[9px] font-black uppercase tracking-widest opacity-50">
                    {msg.role === 'user' ? 'CLIENT' : 'AGENT ZERO'}
                  </span>
                </div>
                <p className="text-xs leading-relaxed whitespace-pre-wrap">{msg.role === 'model' ? cleanText : msg.text}</p>
                
                {msg.role === 'model' && suggestions.length > 0 && (
                  <div className="flex flex-col gap-2 pt-2 border-t border-zinc-700/50">
                    <p className="text-[8px] font-black text-orange-500 uppercase tracking-widest">Recommendations:</p>
                    {suggestions.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => onSelectSuggestion(s)}
                        className="flex items-center justify-between gap-3 px-3 py-2 bg-zinc-950/50 hover:bg-orange-500 text-white hover:text-white rounded-xl border border-zinc-700 hover:border-orange-400 transition-all group/chip"
                      >
                        <span className="text-[10px] font-bold text-left leading-tight">{s}</span>
                        <ArrowRight className="w-3 h-3 opacity-0 group-hover/chip:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-3 flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
              <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Thinking Strategically...</span>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 bg-zinc-900 border-t border-zinc-800">
        <div className="relative flex items-center gap-2">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask for strategy advice..."
            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-4 pr-12 text-xs text-white focus:ring-1 focus:ring-orange-500/50 outline-none transition-all placeholder:text-zinc-700"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1.5 p-1.5 text-orange-500 disabled:text-zinc-800"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default AIAgent;
