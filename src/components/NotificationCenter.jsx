import { useMemo } from 'react';
import { useAI } from '../context/AIContext';
import { Bell, AlertTriangle, ShieldAlert, Sparkles, CheckCircle, BrainCircuit } from 'lucide-react';
import ExplainPanel from './ExplainPanel';

export default function NotificationCenter() {
  const { executiveState, tasks } = useAI();

  const notifications = useMemo(() => {
    if (!Array.isArray(executiveState?.notifications)) return [];
    
    // Sort by priority Critical -> High -> Medium -> Low
    const priorityWeights = { Critical: 4, High: 3, Medium: 2, Low: 1 };
    
    return [...executiveState.notifications].sort((a, b) => priorityWeights[b.priority] - priorityWeights[a.priority]);
  }, [executiveState]);

  const getStyleForPriority = (priority, type) => {
    if (type.toLowerCase().includes('burnout') || priority === 'Critical') {
      return { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-900/40', border: 'border-red-500/50' };
    }
    if (type.toLowerCase().includes('risk') || priority === 'High') {
      return { icon: ShieldAlert, color: 'text-orange-400', bg: 'bg-orange-900/40', border: 'border-orange-500/50' };
    }
    if (type.toLowerCase().includes('opportunity') || type.toLowerCase().includes('win')) {
      return { icon: Sparkles, color: 'text-amber-400', bg: 'bg-amber-900/40', border: 'border-amber-500/50' };
    }
    return { icon: BrainCircuit, color: 'text-blue-400', bg: 'bg-blue-900/40', border: 'border-blue-500/50' };
  };

  return (
    <div className="mb-12">
      <div className="mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
          <Bell className="text-blue-500 h-6 w-6" />
          Executive Notices
        </h2>
        <p className="text-slate-400 mt-1">Your Executive AI continuously monitors and challenges your workload.</p>
      </div>

      {notifications.length === 0 ? (
        <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-8 text-center backdrop-blur-sm">
          <div className="text-4xl mb-3">🎉</div>
          <h3 className="text-lg font-bold text-white mb-1">Everything looks under control.</h3>
          <p className="text-slate-400">Executive AI has no critical recommendations right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {notifications.map((notif, idx) => {
            const style = getStyleForPriority(notif.priority, notif.type);
            const Icon = style.icon;
            return (
              <div 
                key={notif.id || idx} 
                className={`relative overflow-hidden rounded-2xl border ${style.border} bg-slate-800/60 backdrop-blur-md p-6 hover:-translate-y-1 transition-transform shadow-lg group`}
              >
                <div className={`absolute top-0 left-0 w-1.5 h-full ${style.bg} shadow-[0_0_10px_currentColor] ${style.color}`}></div>
                
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${style.bg} ${style.border} border shrink-0`}>
                    <Icon className={`h-6 w-6 ${style.color}`} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <span className={`text-xs font-bold uppercase tracking-wider ${style.color}`}>
                        {notif.type}
                      </span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-slate-900 border border-slate-700 ${style.color}`}>
                        {notif.priority}
                      </span>
                    </div>
                    
                    <h3 className="text-white font-bold mb-1">{notif.title}</h3>
                    <p className="text-slate-300 text-sm mb-4 leading-relaxed">{notif.description}</p>
                    
                    <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                      <ExplainPanel 
                        title="Executive Reasoning" 
                        reasoning={notif.reason} 
                        confidence={notif.confidence}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
