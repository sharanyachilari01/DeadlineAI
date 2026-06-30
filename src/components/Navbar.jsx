import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Target, LogOut, LayoutDashboard, Zap, Brain, Plus } from 'lucide-react';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  }

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <Target className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300">
                DeadlineAI
              </span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <>
                <Link to="/dashboard" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </Link>
                <Link to="/add-task" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
                  <Plus className="h-4 w-4" /> Add Task
                </Link>
                <Link to="/rescue" className="text-amber-400 hover:text-amber-300 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
                  <Zap className="h-4 w-4" /> Rescue Mode
                </Link>
                <Link to="/what-if" className="text-emerald-400 hover:text-emerald-300 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
                  <Brain className="h-4 w-4" /> What If
                </Link>
                <Link to="/insights" className="text-purple-400 hover:text-purple-300 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
                  <Brain className="h-4 w-4" /> Insights
                </Link>
                <button
                  onClick={handleLogout}
                  className="ml-4 text-slate-400 hover:text-red-400 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Log in
                </Link>
                <Link to="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-500/30">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
