import { useState } from 'react';
import { useAI } from '../context/AIContext';
import { simulateScenario } from '../services/geminiService';
import ExplainPanel from '../components/ExplainPanel';
import { Brain, Sparkles, ArrowRight, Activity, Loader2 } from 'lucide-react';

export default function WhatIf() {
  const { activeTasks } = useAI();
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [scenario, setScenario] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSimulate = async () => {
    if (!selectedTaskId || !scenario) return;
    
    setLoading(true);
    setResult(null);
    
    const task = activeTasks.find(t => t.id === selectedTaskId);
    try {
      const data = await simulateScenario(task, scenario, activeTasks);
      setResult(data);
    } catch (error) {
      console.error("Simulation error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Brain className="text-emerald-500 h-8 w-8" />
          What-If Simulator
        </h1>
        <p className="text-slate-400 mt-2">Predict the compounding consequences of your scheduling decisions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Panel */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-6">Scenario Parameters</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Target Task</label>
              <select 
                value={selectedTaskId}
                onChange={(e) => setSelectedTaskId(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-white appearance-none"
              >
                <option value="">Select a task...</option>
                {activeTasks.map(t => (
                  <option key={t.id} value={t.id}>{t.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Scenario Action</label>
              <select 
                value={scenario}
                onChange={(e) => setScenario(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-white appearance-none"
              >
                <option value="">Select an action...</option>
                <option value="Skip entirely today">Skip entirely today</option>
                <option value="Delay by one day">Delay by one day</option>
                <option value="Reduce effort by 50%">Reduce effort by 50% (MVP only)</option>
                <option value="Postpone until weekend">Postpone until weekend</option>
              </select>
            </div>

            <button
              onClick={handleSimulate}
              disabled={!selectedTaskId || !scenario || loading}
              className="w-full flex justify-center items-center gap-2 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(16,185,129,0.2)]"
            >
              {loading ? (
                <><Loader2 className="h-5 w-5 animate-spin" /> Running Simulation...</>
              ) : (
                <><Sparkles className="h-5 w-5" /> Simulate Future</>
              )}
            </button>
          </div>
        </div>

        {/* Output Panel */}
        <div className="bg-slate-900/80 border border-slate-700 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>
          
          {loading ? (
             <div className="h-full flex flex-col items-center justify-center text-emerald-400">
               <Activity className="h-10 w-10 animate-pulse mb-4" />
               <p>Predicting temporal impacts...</p>
             </div>
          ) : result ? (
            <div className="space-y-6 relative z-10 animate-in fade-in zoom-in-95">
              <h2 className="text-xl font-bold flex items-center gap-2 text-white border-b border-slate-700 pb-4">
                Simulation Results
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-900/20 p-4 rounded-xl border border-red-900/50">
                  <p className="text-xs text-red-400 font-bold uppercase tracking-wider mb-1">Risk Increase</p>
                  <p className="text-2xl font-black text-white">{result.riskIncrease}</p>
                </div>
                <div className="bg-emerald-900/20 p-4 rounded-xl border border-emerald-900/50">
                  <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider mb-1">AI Confidence</p>
                  <p className="text-2xl font-black text-white">{result.confidenceScore}%</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Consequences</h3>
                <p className="text-slate-300 leading-relaxed bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                  {result.consequences}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Better Alternative</h3>
                <div className="flex gap-3 bg-blue-900/20 p-4 rounded-xl border border-blue-900/50">
                  <ArrowRight className="text-blue-400 shrink-0 mt-0.5" />
                  <p className="text-blue-100">{result.betterAlternative}</p>
                </div>
              </div>
              
              <ExplainPanel title="View Simulation Logic" reasoning={result.reasoning} />
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-500">
              <Brain className="h-12 w-12 mb-4 opacity-50" />
              <p>Select parameters and run simulation.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
