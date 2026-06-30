import { generateExecutiveState } from './geminiService';

// Simple in-memory cache to prevent excessive Gemini calls
const cache = {
  executive: { hash: null, data: null }
};

/**
 * Creates a deterministic hash from the critical task fields and global available hours.
 * If this hash doesn't change, we don't need to call the AI again.
 */
function hashTasks(tasks, availableHoursToday) {
  if (!tasks || tasks.length === 0) return 'empty';
  
  const relevantData = tasks.map(t => ({
    id: t.id,
    title: t.title,
    deadline: t.deadline,
    progress: t.progress,
    importance: t.importance,
    estimatedHours: t.estimatedHours
  })).sort((a, b) => a.id.localeCompare(b.id)); // Ensure stable order

  return JSON.stringify({ version: 'v2', availableHoursToday, tasks: relevantData });
}

export async function getExecutiveState(tasks, forceRecalculate = false, availableHoursToday = 4) {
  const currentHash = hashTasks(tasks, availableHoursToday);
  
  if (!forceRecalculate && cache.executive.hash === currentHash && cache.executive.data) {
    return { data: cache.executive.data, cached: true };
  }

  const data = await generateExecutiveState(tasks, availableHoursToday);
  cache.executive = { hash: currentHash, data };
  return { data, cached: false };
}
