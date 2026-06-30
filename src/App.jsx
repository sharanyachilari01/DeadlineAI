import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthProvider } from './context/AuthContext';
import { AIProvider } from './context/AIContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { Loader2 } from 'lucide-react';

// Eager load public pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Lazy load heavy protected pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AddTask = lazy(() => import('./pages/AddTask'));
const Rescue = lazy(() => import('./pages/Rescue'));
const Insights = lazy(() => import('./pages/Insights'));
const WhatIf = lazy(() => import('./pages/WhatIf'));

function App() {
  return (
    <Router>
      <AuthProvider>
        <AIProvider>
          <div className="min-h-screen bg-slate-900 text-slate-50 font-sans selection:bg-blue-500/30 flex flex-col">
            <Navbar />
            <Suspense fallback={
              <div className="flex-1 flex justify-center items-center h-64">
                <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
              </div>
            }>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                
                {/* Protected Routes */}
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/add-task" element={<ProtectedRoute><AddTask /></ProtectedRoute>} />
                <Route path="/rescue" element={<ProtectedRoute><Rescue /></ProtectedRoute>} />
                <Route path="/insights" element={<ProtectedRoute><Insights /></ProtectedRoute>} />
                <Route path="/what-if" element={<ProtectedRoute><WhatIf /></ProtectedRoute>} />
              </Routes>
            </Suspense>
          </div>
        </AIProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
