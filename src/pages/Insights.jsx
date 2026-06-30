import { useAI } from '../context/AIContext';
import ExplainPanel from '../components/ExplainPanel';
import { Brain, TrendingUp, Activity, Target, Loader2, Battery } from 'lucide-react';

export default function Insights() {
  const { executiveState, loadingAI } = useAI();
  const insights = executiveState?.insights;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Brain className="text-purple-500 h-8 w-8" />
            Executive Insights
          </h1>
          <p className="text-slate-400 mt-2">AI-driven analysis of your productivity patterns.</p>
        </div>
      </div>

      {loadingAI ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-10 w-10 text-purple-500 animate-spin" />
        </div>
      ) : insights ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-900/30 rounded-lg">
                <Target className="text-purple-400 h-5 w-5" />
              </div>
              <h3 className="font-semibold text-slate-300">Workload Score</h3>
            </div>
            <div className="text-4xl font-black mb-2 text-white">{insights.workloadScore}</div>
            <p className="text-sm text-slate-400">Out of 100 maximum capacity.</p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-900/30 rounded-lg">
                <Battery className="text-red-400 h-5 w-5" />
              </div>
              <h3 className="font-semibold text-slate-300">Stress Level</h3>
            </div>
            <div className={`text-2xl font-bold mb-2 ${insights.stressLevel?.includes('High') || insights.stressLevel?.includes('Warning') ? 'text-red-400' : 'text-emerald-400'}`}>
              {insights.stressLevel}
            </div>
            <p className="text-sm text-slate-400">Based on task volume & deadlines.</p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-900/30 rounded-lg">
                <Activity className="text-blue-400 h-5 w-5" />
              </div>
              <h3 className="font-semibold text-slate-300">Productivity Score</h3>
            </div>
            <div className="text-4xl font-black mb-2 text-blue-400">{insights.overallProductivityScore}</div>
            <p className="text-sm text-slate-400">Executive efficiency rating.</p>
          </div>
          
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-900/30 rounded-lg">
                <TrendingUp className="text-emerald-400 h-5 w-5" />
              </div>
              <h3 className="font-semibold text-slate-300">Focus Window</h3>
            </div>
            <div className="text-xl font-bold mb-2 text-white">{insights.suggestedFocusHours}</div>
            <p className="text-sm text-slate-400">Optimal deep work period.</p>
          </div>

          <div className="lg:col-span-4 bg-slate-900/60 border border-slate-700 rounded-2xl p-6 md:p-8">
            <h3 className="font-semibold mb-2 text-lg text-white">AI Analysis & Forecast</h3>
            <p className="text-slate-300 mb-4 leading-relaxed">{insights.completionForecast}</p>
            <ExplainPanel title="Read full reasoning" reasoning={insights.reasoning} />
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-slate-400">Add tasks to view insights.</div>
      )}
    </div>
  );
}
