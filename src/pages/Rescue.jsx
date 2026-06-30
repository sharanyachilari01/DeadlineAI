import { useAI } from '../context/AIContext';
import ExplainPanel from '../components/ExplainPanel';
import { Zap, ShieldAlert, Crosshair, AlertOctagon, Loader2 } from 'lucide-react';

export default function Rescue() {
  const { executiveState, loadingAI } = useAI();
  const plan = executiveState?.rescuePlan;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex justify-center items-center w-20 h-20 bg-amber-900/30 rounded-full mb-6">
          <Zap className="text-amber-400 h-10 w-10 animate-pulse" />
        </div>
        <h1 className="text-4xl font-bold mb-4 text-amber-400">Rescue Mode</h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Emergency protocol active. The AI has calculated the minimum viable path to survival.
        </p>
      </div>

      <div className="bg-slate-800/80 border border-amber-900/50 rounded-2xl p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-600 via-orange-500 to-red-600"></div>
        
        {loadingAI ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-10 w-10 text-amber-500 animate-spin mb-4" />
            <p className="text-amber-200">Calculating survival vectors...</p>
          </div>
        ) : plan ? (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-start justify-between gap-8">
              <div className="flex-1 space-y-6">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2 text-white mb-2">
                    <ShieldAlert className="text-amber-500 h-6 w-6" />
                    Immediate Action
                  </h2>
                  <p className="text-lg text-amber-100 bg-amber-900/20 p-4 rounded-xl border border-amber-800/50">
                    {plan.immediateAction}
                  </p>
                  <ExplainPanel title="Why start here?" reasoning={plan.reasoning} confidence={plan.successProbability} />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700">
                    <h3 className="text-sm font-bold text-slate-400 uppercase mb-2 flex items-center gap-2">
                      <Crosshair className="h-4 w-4" /> Next 30 Minutes
                    </h3>
                    <p className="text-slate-200">{plan.next30MinPlan}</p>
                  </div>
                  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700">
                    <h3 className="text-sm font-bold text-slate-400 uppercase mb-2 flex items-center gap-2">
                      <Crosshair className="h-4 w-4" /> Next 2 Hours
                    </h3>
                    <p className="text-slate-200">{plan.next2HoursPlan}</p>
                  </div>
                </div>

                {Array.isArray(plan.tasksToPostpone) && plan.tasksToPostpone.length > 0 && (
                  <div className="bg-red-900/20 p-4 rounded-xl border border-red-900/50">
                    <h3 className="text-sm font-bold text-red-400 uppercase mb-3 flex items-center gap-2">
                      <AlertOctagon className="h-4 w-4" /> Postpone Today
                    </h3>
                    <ul className="space-y-3">
                      {plan.tasksToPostpone.map((task, i) => (
                        <li key={i} className="border-l-2 border-red-500/50 pl-3">
                          <div className="text-slate-200 font-semibold text-sm flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                            {task.title}
                          </div>
                          <div className="text-slate-400 text-xs mt-1">
                            <span className="font-semibold text-slate-500 mr-1">Reason:</span>
                            {task.reason}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <div className="shrink-0 w-full md:w-64 bg-slate-900/80 p-6 rounded-2xl border border-slate-700 text-center flex flex-col items-center justify-center">
                <p className="text-slate-400 font-bold uppercase text-sm mb-2">Success Probability</p>
                <div className="text-5xl font-black text-emerald-400 mb-2">{plan.successProbability || 0}%</div>
                <p className="text-xs text-slate-500">If strictly followed.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400">Add tasks to generate a rescue plan.</div>
        )}
      </div>
    </div>
  );
}
