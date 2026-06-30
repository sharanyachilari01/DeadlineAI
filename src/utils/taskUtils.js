/**
 * Returns a human-readable string for the time left until a deadline.
 * @param {string} deadline - The ISO date string of the deadline.
 */
export function calculateTimeLeft(deadline) {
  if (!deadline) return "No deadline";
  
  const now = new Date();
  const target = new Date(deadline);
  const diffMs = target - now;
  
  if (diffMs < 0) return "Overdue";
  
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
  const diffMinutes = Math.floor((diffMs / 1000 / 60) % 60);

  if (diffDays > 0) {
    return `${diffDays}d ${diffHours}h left`;
  }
  if (diffHours > 0) {
    return `${diffHours}h ${diffMinutes}m left`;
  }
  return `${diffMinutes}m left`;
}

/**
 * Returns tailwind color classes based on the risk level.
 * @param {string} riskLevel 
 */
export function getRiskColor(riskLevel) {
  switch (riskLevel?.toLowerCase()) {
    case 'critical':
      return 'bg-red-900/40 text-red-400 border border-red-800';
    case 'high':
      return 'bg-orange-900/40 text-orange-400 border border-orange-800';
    case 'medium':
      return 'bg-yellow-900/40 text-yellow-400 border border-yellow-800';
    case 'low':
      return 'bg-green-900/40 text-green-400 border border-green-800';
    default:
      return 'bg-slate-800 text-slate-300 border border-slate-700';
  }
}

/**
 * Sorts tasks first by Risk Level (Critical > High > Medium > Low),
 * then by AI Priority Score (Descending).
 * @param {Array} tasks 
 */
export function sortTasksByPriority(tasks) {
  const riskWeights = {
    'critical': 4,
    'high': 3,
    'medium': 2,
    'low': 1
  };

  return [...tasks].sort((a, b) => {
    const riskA = riskWeights[a.riskLevel?.toLowerCase()] || 0;
    const riskB = riskWeights[b.riskLevel?.toLowerCase()] || 0;

    if (riskA !== riskB) {
      return riskB - riskA; // Higher risk first
    }
    
    // If risk is the same, sort by AI Priority score
    const scoreA = a.aiPriorityScore || 0;
    const scoreB = b.aiPriorityScore || 0;
    return scoreB - scoreA;
  });
}
