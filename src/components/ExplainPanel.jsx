import { useState } from 'react';
import { ChevronDown, ChevronUp, BrainCircuit } from 'lucide-react';

export default function ExplainPanel({ title = "Why?", reasoning, confidence, className = "" }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!reasoning) return null;

  return (
    <div className={`mt-3 ${className}`}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-blue-400 transition-colors"
      >
        <BrainCircuit className="h-3 w-3" />
        {title}
        {isOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
      </button>
      
      {isOpen && (
        <div className="mt-2 p-3 bg-slate-900/50 rounded-lg border border-slate-700/50 animate-in fade-in slide-in-from-top-2 duration-200">
          <p className="text-sm text-slate-300 leading-relaxed">{reasoning}</p>
          {confidence && (
            <div className="mt-2 pt-2 border-t border-slate-700/50 flex items-center justify-between text-xs">
              <span className="text-slate-500">AI Confidence Score</span>
              <span className={`font-bold ${confidence > 85 ? 'text-emerald-400' : confidence > 60 ? 'text-amber-400' : 'text-red-400'}`}>
                {confidence}%
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
