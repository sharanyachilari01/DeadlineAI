import { Link } from 'react-router-dom';
import { Target, Zap, Brain, ShieldCheck, ArrowRight, Activity, CalendarClock } from 'lucide-react';

export default function Landing() {
  return (
    <div className="bg-slate-900 text-slate-50 min-h-screen">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-1/4 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/80 border border-slate-700 text-blue-400 font-medium text-sm mb-8 backdrop-blur-sm shadow-sm">
            <SparklesIcon className="h-4 w-4" />
            Powered by Google Gemini 1.5 Flash
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
            Stop Managing Tasks. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-emerald-300">
              Start Executing Missions.
            </span>
          </h1>
          
          <p className="mt-6 max-w-2xl mx-auto text-xl text-slate-400 leading-relaxed mb-10">
            DeadlineAI is not a to-do list. It is an <strong className="text-slate-200">AI Decision Engine</strong> that actively analyzes your workload, detects scheduling overloads, and recalculates your priorities in real-time.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login" className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] flex items-center justify-center gap-2 hover:-translate-y-1">
              Sign In <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* The Problem & Solution Section */}
      <div className="py-20 bg-slate-900 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-red-400">The Problem</h2>
              <p className="text-lg text-slate-400 mb-6 leading-relaxed">
                Modern professionals are drowning in tasks. Traditional task managers are passive—they just hold lists of text. When you are overwhelmed, staring at 50 tasks causes decision paralysis, burnout, and missed deadlines.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6 text-emerald-400">The Solution</h2>
              <p className="text-lg text-slate-400 mb-6 leading-relaxed">
                DeadlineAI acts as your executive assistant. It takes your raw tasks and uses Google's Gemini AI to triage them, construct a minute-by-minute timeline, and tell you exactly <strong className="text-slate-200">what to do next and why</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Hackathon Core Features</h2>
          <p className="text-slate-400">Built with React, Firebase, and the Gemini API.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-slate-800/40 p-8 rounded-2xl border border-slate-700 hover:border-blue-500/50 transition-colors">
            <div className="w-14 h-14 bg-blue-900/30 rounded-xl flex items-center justify-center mb-6">
              <Brain className="text-blue-400 h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold mb-3">AI Decision Engine</h3>
            <p className="text-slate-400 leading-relaxed">
              Dynamically evaluates your entire workload on every change, pushing real-time priority updates and overload warnings.
            </p>
          </div>

          <div className="bg-slate-800/40 p-8 rounded-2xl border border-slate-700 hover:border-amber-500/50 transition-colors">
            <div className="w-14 h-14 bg-amber-900/30 rounded-xl flex items-center justify-center mb-6">
              <Zap className="text-amber-400 h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold mb-3">Rescue Protocol</h3>
            <p className="text-slate-400 leading-relaxed">
              Emergency mode activated for tight deadlines. Generates an immediate survival plan and tells you exactly what to postpone.
            </p>
          </div>

          <div className="bg-slate-800/40 p-8 rounded-2xl border border-slate-700 hover:border-emerald-500/50 transition-colors">
            <div className="w-14 h-14 bg-emerald-900/30 rounded-xl flex items-center justify-center mb-6">
              <Activity className="text-emerald-400 h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold mb-3">What-If Simulator</h3>
            <p className="text-slate-400 leading-relaxed">
              Predict the cascading consequences of skipping or delaying a task before you actually make the mistake.
            </p>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="py-8 border-t border-slate-800 text-center text-slate-500 text-sm">
        <p>Built for the Hackathon. Powered by Google AI.</p>
      </footer>
    </div>
  );
}

function SparklesIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    </svg>
  );
}
