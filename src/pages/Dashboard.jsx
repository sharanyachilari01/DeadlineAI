import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAI } from '../context/AIContext';
import { db } from '../firebase';
import { doc, deleteDoc, updateDoc, setDoc } from 'firebase/firestore';
import { calculateTimeLeft, getRiskColor } from '../utils/taskUtils';
import ExplainPanel from '../components/ExplainPanel';
import NotificationCenter from '../components/NotificationCenter';
import { 
  CheckCircle2, Clock, Trash2, ShieldAlert, Sparkles, 
  Target, Play, RefreshCcw, CalendarClock, X, Save
} from 'lucide-react';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const { tasks, activeTasks, executiveState, loadingAI, replanToast, triggerRecalculate, isSettingsValidForToday, effectiveHours, userSettings } = useAI();
  
  const [missionStarted, setMissionStarted] = useState(false);
  const [startToast, setStartToast] = useState(null);
  const [recalcLoading, setRecalcLoading] = useState(false);
  const [highlightTaskId, setHighlightTaskId] = useState(null);
  
  // Settings Modal State
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [tempHours, setTempHours] = useState('');
  const [hasDismissedModal, setHasDismissedModal] = useState(false);

  // Auto-show modal if settings are invalid and haven't been dismissed today
  useEffect(() => {
    if (loadingAI) return; // Wait for initial load
    if (!isSettingsValidForToday && !hasDismissedModal) {
      setShowSettingsModal(true);
    }
  }, [isSettingsValidForToday, hasDismissedModal, loadingAI]);

  // Set initial temp hours if available
  useEffect(() => {
    if (showSettingsModal && typeof userSettings?.availableHoursToday === 'number') {
      setTempHours(userSettings.availableHoursToday.toString());
    } else if (showSettingsModal) {
      setTempHours('4');
    }
  }, [showSettingsModal, userSettings]);

  const handleSaveHours = async () => {
    if (!currentUser) return;
    const hours = parseFloat(tempHours);
    if (isNaN(hours) || hours < 0) return;

    try {
      const todayStr = new Date().toISOString().split('T')[0];
      await setDoc(doc(db, 'users', currentUser.uid, 'settings', 'daily'), {
        availableHoursToday: hours,
        lastUpdatedDate: todayStr
      }, { merge: true });
      
      setShowSettingsModal(false);
      setHasDismissedModal(false); // Reset dismissal since they saved
      
      // We don't explicitly need to call triggerRecalculate here because the AIContext 
      // effect will see effectiveHours change and auto-recalculate!
    } catch (error) {
      console.error("Error saving hours:", error);
    }
  };

  const handleDelete = async (taskId) => {
    if (!confirm("Delete this task?")) return;
    try { await deleteDoc(doc(db, 'users', currentUser.uid, 'tasks', taskId)); } 
    catch (error) { console.error("Error deleting task", error); }
  };

  const handleMarkComplete = async (taskId) => {
    try {
      await updateDoc(doc(db, 'users', currentUser.uid, 'tasks', taskId), {
        progress: 100
      });
    } catch (error) { console.error("Error completing task", error); }
  };

  const handleRecalculate = async () => {
    if (recalcLoading) return;
    setRecalcLoading(true);
    try {
      await triggerRecalculate();
      setStartToast("Priorities recalculated successfully.");
      setTimeout(() => setStartToast(null), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setRecalcLoading(false);
    }
  };

  const completedCount = (tasks || []).filter(t => t.progress === 100).length;
  const progressPercent = (tasks && tasks.length > 0) ? Math.round((completedCount / tasks.length) * 100) : 0;

  // Combine raw Firestore activeTasks with AI-generated prioritizedTasks
  const aiPrioritized = Array.isArray(executiveState?.prioritizedTasks) ? executiveState.prioritizedTasks : [];
  
  const displayTasks = (activeTasks || []).map(rawTask => {
    const aiData = aiPrioritized.find(t => t.id === rawTask.id);
    if (aiData) {
      return { ...rawTask, ...aiData };
    }
    
    const postponeData = Array.isArray(executiveState?.rescuePlan?.tasksToPostpone) 
      ? executiveState.rescuePlan.tasksToPostpone.find(t => t.id === rawTask.id) 
      : null;
      
    if (postponeData) {
      return { 
        ...rawTask, 
        priority: 99, 
        riskLevel: 'Low', 
        score: 0, 
        reason: postponeData.reason || 'Postponed to protect focus for more critical tasks.',
        nextAction: 'Postponed'
      };
    }
    
    return { ...rawTask, priority: 99, riskLevel: 'Low', score: 0, reason: 'Pending AI prioritization.' };
  }).sort((a, b) => (a.priority || 99) - (b.priority || 99));

  const handleStartMission = () => {
    if (!displayTasks.length) return;
    const targetTask = displayTasks[0];
    
    setMissionStarted(true);
    setHighlightTaskId(targetTask.id);
    
    const el = document.getElementById(`task-${targetTask.id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    setStartToast(`Mission Started: Focus on ${targetTask.title}. First action: ${targetTask.nextAction || 'Standby'}`);
    
    setTimeout(() => {
      setHighlightTaskId(null);
      setStartToast(null);
    }, 5000);
  };

  const firstTask = displayTasks.length > 0 ? displayTasks[0] : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      
      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
            <button 
              onClick={() => {
                setShowSettingsModal(false);
                setHasDismissedModal(true);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">👋</span>
              <h2 className="text-2xl font-bold text-white">Hi</h2>
            </div>
            <p className="text-slate-300 mb-6">How many focused hours do you expect to have today?</p>
            
            <div className="mb-6">
              <input
                type="number"
                step="0.5"
                min="0"
                value={tempHours}
                onChange={(e) => setTempHours(e.target.value)}
                className="w-full px-4 py-4 text-center text-3xl font-bold bg-slate-800 border border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-white transition-all"
                placeholder="4"
                autoFocus
              />
              <p className="text-slate-400 text-sm mt-3 text-center">This helps DeadlineAI build a realistic plan for today's workload.</p>
            </div>
            
            <button
              onClick={handleSaveHours}
              className="w-full flex justify-center items-center gap-2 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]"
            >
              <Save className="h-5 w-5" />
              Save & Optimize Schedule
            </button>
          </div>
        </div>
      )}

      {/* Warning Banner if dismissed */}
      {!isSettingsValidForToday && hasDismissedModal && (
        <div className="mb-6 bg-amber-900/30 border border-amber-700/50 rounded-xl p-4 flex items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldAlert className="text-amber-500 h-5 w-5 shrink-0" />
            <p className="text-amber-200 text-sm">
              Using default <strong>4 productive hours</strong> until you update today's availability.
            </p>
          </div>
          <button 
            onClick={() => setShowSettingsModal(true)}
            className="text-amber-400 hover:text-amber-300 text-sm font-semibold whitespace-nowrap"
          >
            Update Now
          </button>
        </div>
      )}

      {/* Replanning Toast */}
      {replanToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-5 duration-300">
          <div className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg shadow-blue-500/30 flex items-center gap-3">
            <RefreshCcw className="h-5 w-5 animate-spin-slow" />
            <span className="font-medium">DeadlineAI has recalculated today's priorities.</span>
          </div>
        </div>
      )}

      {/* Start Mission Toast */}
      {startToast && (
        <div className="fixed top-36 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-5 duration-300">
          <div className="bg-emerald-600 text-white px-6 py-3 rounded-full shadow-lg shadow-emerald-500/30 flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5" />
            <span className="font-medium">{startToast}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Target className="text-blue-500 h-8 w-8" />
            Mission Control
          </h1>
          <p className="text-slate-400 mt-2">Executive AI is actively monitoring and optimizing your workload.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => setShowSettingsModal(true)}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg text-sm font-medium border border-slate-700 transition-colors flex items-center gap-2"
          >
            <Clock className="h-4 w-4 text-emerald-400" />
            <span>{effectiveHours} Hours Today</span>
          </button>
          <button 
            onClick={handleRecalculate}
            disabled={recalcLoading}
            className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 px-4 py-2 rounded-lg text-sm font-medium border border-blue-500/30 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCcw className={`h-4 w-4 ${recalcLoading ? 'animate-spin' : ''}`} />
            {recalcLoading ? 'Recalculating...' : 'Recalculate Priorities'}
          </button>
        </div>
      </div>

      {/* Mission Control Hero */}
      <div className="mb-10 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
          <Target className="h-48 w-48 text-blue-400" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-500/20 p-2 rounded-xl border border-blue-500/30">
              <Sparkles className="h-6 w-6 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-blue-400 tracking-wide uppercase">Today's Mission</h2>
          </div>
          
          {loadingAI ? (
            <div className="animate-pulse space-y-4 max-w-2xl">
              <div className="h-10 bg-slate-700/50 rounded-lg w-3/4"></div>
              <div className="h-6 bg-slate-700/50 rounded-lg w-1/2"></div>
            </div>
          ) : (
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                {executiveState?.mission?.title || "Add tasks to generate an executive mission."}
              </h1>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-slate-900/50 rounded-2xl p-5 border border-slate-700/50 backdrop-blur-sm">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Executive Reasoning</h3>
                  <p className="text-slate-300">{executiveState?.mission?.reason || "No reasoning available."}</p>
                </div>
                <div className="bg-blue-900/20 rounded-2xl p-5 border border-blue-800/50 backdrop-blur-sm">
                  <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-2">First Action</h3>
                  <p className="text-blue-100 font-medium text-lg">{firstTask?.nextAction || "Standby."}</p>
                  <ExplainPanel 
                    title="Why start here?" 
                    reasoning={firstTask?.reason} 
                    confidence={firstTask?.confidence}
                  />
                </div>
              </div>

              <button 
                onClick={handleStartMission}
                className={`flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-lg transition-all ${
                  missionStarted 
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] hover:-translate-y-1'
                }`}
              >
                {missionStarted ? (
                  <><CheckCircle2 className="h-5 w-5" /> MISSION ACTIVE</>
                ) : (
                  <><Play className="h-5 w-5 fill-current" /> START MISSION</>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      <NotificationCenter />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column - Tasks */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2 mb-6">
            <ShieldAlert className="text-slate-400 h-5 w-5" />
            <h2 className="text-xl font-semibold">Executive Prioritization</h2>
            <span className="text-xs font-medium bg-slate-800 text-slate-400 px-2 py-1 rounded-full ml-2">
              Gemini Optimized
            </span>
          </div>
            
          {displayTasks.length === 0 ? (
            <div className="text-center py-16 bg-slate-800/30 border-2 border-dashed border-slate-700 rounded-2xl">
              <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-slate-600" />
              <p className="text-lg text-slate-400">Deck is clear.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {displayTasks.map((task, index) => (
                <div 
                  key={task.id} 
                  id={`task-${task.id}`}
                  className={`p-6 rounded-2xl border relative overflow-hidden transition-all duration-500 bg-slate-800/40 backdrop-blur-md 
                    ${task.riskLevel === 'Critical' ? 'border-red-900/50' : 'border-slate-700'}
                    ${highlightTaskId === task.id ? 'ring-4 ring-blue-500 shadow-[0_0_30px_rgba(37,99,235,0.4)] scale-[1.02]' : 'hover:shadow-xl'}
                  `}
                >
                  {task.riskLevel === 'Critical' && (
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500 shadow-[0_0_15px_rgba(239,68,68,1)]"></div>
                  )}
                  
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="text-xs font-bold bg-slate-900 text-slate-500 px-2 py-1 rounded">
                          #{task.priority || index + 1}
                        </span>
                        <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wider ${getRiskColor(task.riskLevel)}`}>
                          {task.riskLevel} Risk
                        </span>
                        <span className="text-xs bg-blue-900/30 text-blue-400 border border-blue-900/50 px-2 py-1 rounded flex items-center gap-1">
                          <Sparkles className="h-3 w-3" /> Score {task.score || 0}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-white mb-2">{task.title}</h3>
                      <p className="text-sm text-slate-400 mb-4">{task.description}</p>
                      
                      <div className="flex flex-wrap items-center gap-5 text-sm text-slate-400 mb-4 bg-slate-900/40 p-3 rounded-lg w-max">
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4" /> 
                          <span className={new Date(task.deadline) < new Date() ? 'text-red-400 font-bold' : 'text-slate-300'}>
                            {calculateTimeLeft(task.deadline)}
                          </span>
                        </span>
                        <span className="flex items-center gap-1.5 border-l border-slate-700 pl-4">
                          Est: <strong className="text-slate-300">{task.estimatedHours}h</strong>
                        </span>
                        <span className="flex items-center gap-1.5 border-l border-slate-700 pl-4">
                          Progress: <strong className="text-slate-300">{task.progress}%</strong>
                        </span>
                      </div>
                      
                      {task.reason && (
                        <ExplainPanel 
                          title="View Executive Reasoning" 
                          reasoning={task.reason}
                          confidence={task.confidence}
                        />
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-2 shrink-0">
                      <button 
                        onClick={() => handleMarkComplete(task.id)}
                        className="p-3 bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-400 rounded-xl border border-slate-700 transition-all shadow-sm"
                        title="Mark Complete"
                      >
                        <CheckCircle2 className="h-6 w-6" />
                      </button>
                      <button 
                        onClick={() => handleDelete(task.id)}
                        className="p-3 bg-slate-800 hover:bg-red-600 hover:text-white text-slate-400 rounded-xl border border-slate-700 transition-all shadow-sm"
                        title="Delete Task"
                      >
                        <Trash2 className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Tradeoffs and Benefit display */}
                  {task.tradeoffs && task.expectedBenefit && (
                    <div className="mt-4 pt-4 border-t border-slate-700/50 flex flex-col md:flex-row gap-4">
                       <div className="flex-1 bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
                         <h4 className="text-xs font-bold text-slate-400 uppercase mb-1">Tradeoffs & Consequences</h4>
                         <p className="text-sm text-slate-300">{task.tradeoffs} {task.consequences}</p>
                       </div>
                       <div className="flex-1 bg-emerald-900/20 rounded-lg p-3 border border-emerald-800/30">
                         <h4 className="text-xs font-bold text-emerald-500 uppercase mb-1">Expected Benefit</h4>
                         <p className="text-sm text-emerald-200">{task.expectedBenefit}</p>
                       </div>
                    </div>
                  )}
                  
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Timeline */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <CalendarClock className="text-blue-400 h-5 w-5" />
              Today's Execution Plan
            </h2>
            
            {loadingAI ? (
              <div className="animate-pulse space-y-4">
                <div className="h-12 bg-slate-700/50 rounded-lg"></div>
                <div className="h-12 bg-slate-700/50 rounded-lg"></div>
              </div>
            ) : (Array.isArray(executiveState?.timeline) && executiveState.timeline.length > 0) ? (
              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-700 before:to-transparent">
                {executiveState.timeline.map((block, idx) => (
                  <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-5 h-5 rounded-full border-4 border-slate-900 bg-blue-500 text-slate-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"></div>
                    <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.25rem)] bg-slate-900/80 p-4 rounded-xl border border-slate-700 shadow-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-blue-400 text-sm">
                          {block.duration ? block.duration : `${block.start} - ${block.end}`}
                        </span>
                      </div>
                      <div className="text-slate-200 font-medium">{block.task}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-sm text-center">Add tasks to generate a timeline.</p>
            )}
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <CheckCircle2 className="text-emerald-400 h-5 w-5" />
              Daily Progress
            </h2>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-emerald-400 bg-emerald-900/30">
                    Completion
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-emerald-400">
                    {progressPercent}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-slate-700">
                <div style={{ width: `${progressPercent}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500 transition-all duration-500"></div>
              </div>
            </div>
            <p className="text-sm text-slate-400 mt-4 text-center">
              {completedCount} of {tasks.length} tasks completed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
