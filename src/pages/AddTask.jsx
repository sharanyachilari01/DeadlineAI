import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { PlusCircle, Calendar, Flag, Clock, Brain, Loader2, Tag, Percent } from 'lucide-react';

export default function AddTask() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    estimatedHours: '',
    importance: 'Medium',
    progress: '0',
    category: 'Work'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    
    setLoading(true);
    try {
      // Save complete raw task to Firestore
      // AI Context will automatically pick it up and re-evaluate the executive state
      const taskData = {
        ...formData,
        estimatedHours: parseFloat(formData.estimatedHours || 0),
        progress: parseInt(formData.progress || 0),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const tasksRef = collection(db, 'users', currentUser.uid, 'tasks');
      await addDoc(tasksRef, taskData);

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error("Error creating task:", error);
      alert("Failed to add task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
          <PlusCircle className="text-blue-500 h-8 w-8" />
          Add New Task
        </h1>
        <p className="text-slate-400">Provide details so the AI can triage your workload effectively.</p>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">Task Title</label>
              <input
                required
                name="title"
                value={formData.title}
                onChange={handleChange}
                type="text"
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-white"
                placeholder="e.g., Finalize Q3 Marketing Budget"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">Description / Context</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-white resize-none"
                placeholder="Provide context so the AI can properly prioritize..."
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Hard Deadline
              </label>
              <input
                required
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                type="datetime-local"
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-white [color-scheme:dark]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                <Flag className="h-4 w-4" /> Importance
              </label>
              <select 
                name="importance"
                value={formData.importance}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-white appearance-none"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4" /> Estimated Hours
              </label>
              <input
                required
                name="estimatedHours"
                value={formData.estimatedHours}
                onChange={handleChange}
                type="number"
                step="0.5"
                min="0"
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-white"
                placeholder="e.g., 2.5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                <Percent className="h-4 w-4" /> Progress (%)
              </label>
              <input
                name="progress"
                value={formData.progress}
                onChange={handleChange}
                type="number"
                min="0"
                max="100"
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-white"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                <Tag className="h-4 w-4" /> Category
              </label>
              <select 
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-white appearance-none"
              >
                <option value="Academics">Academics</option>
                <option value="Career">Career</option>
                <option value="Personal">Personal</option>
                <option value="Work">Work</option>
                <option value="Learning">Learning</option>
                <option value="Finance">Finance</option>
                <option value="Health">Health</option>
                <option value="Urgent Issue">Urgent Issue</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="pt-6">
            <button
              disabled={loading}
              type="submit"
              className="w-full flex justify-center items-center gap-2 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  AI is Analyzing...
                </>
              ) : (
                <>
                  <Brain className="h-5 w-5" />
                  Analyze & Add Task
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
