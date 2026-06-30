import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;
const modelConfig = {
  model: "gemini-2.5-flash",
  generationConfig: { responseMimeType: "application/json" }
};

// --- HELPER FOR TIME ---
function getHoursUntil(deadlineStr) {
  if (!deadlineStr) return 999;
  const now = new Date();
  const deadline = new Date(deadlineStr);
  return (deadline - now) / (1000 * 60 * 60);
}

// -------------------------------------------------------------
// UNIFIED EXECUTIVE AI ENGINE
// -------------------------------------------------------------

export async function generateExecutiveState(tasks, availableHoursToday = 4) {
  if (!genAI) return getExecutiveFallback(tasks, availableHoursToday);
  try {
    const model = genAI.getGenerativeModel(modelConfig);
    const now = new Date().toLocaleString();
    
    const prompt = `
      You are an elite, highly experienced Executive Assistant and Chief of Staff.
      You are managing the user's workload. Your tone is professional, sharp, natural, and highly actionable.
      
      Current Date & Time: ${now}
      Today's available productive hours: ${availableHoursToday}
      
      CRITICAL REASONING CONSTRAINTS:
      1. ABSOLUTELY FORBIDDEN PHRASES: Do NOT use "Focusing here means", "Protects the quality", "Creates a clear environment", "Creates a clear distraction-free environment", "This is high priority", "This task is important", "Securing this clears the biggest risk".
      2. NEVER USE GENERIC TEMPLATES. Every explanation must feel handwritten, unique, and strictly tied to the task's specific title, category, deadline, and effort.
      3. For every single task, you MUST explicitly synthesize its specific title, category, effort, deadline, and how it fits into the broader schedule.
      4. PAY ATTENTION to the fact the user ONLY has ${availableHoursToday} hours available today. If they scheduled 10 hours of work, heavily penalize it and force postponements.
      
      SECTION GUIDELINES:
      - Mission: Write this like a crisp morning executive briefing specific to today's exact workload. e.g., "Today's objective is to eliminate tomorrow's deadlines while preserving enough energy for deep work later."
      - Prioritized Tasks: 
        - Reason: Why this specific task is recommended NOW. Refer to the specific deadline, effort, or category.
        - Tradeoffs: What EXACTLY is the opportunity cost? Mention other task names or specific time lost. (e.g., "This delays interview preparation by about an hour, but keeps your application active.")
        - Expected Benefit: What specific advantage is gained today? (e.g., "Avoids financial penalties and removes a fixed obligation.")
      - Timeline (Today's Execution Plan): NEVER use absolute clock times (e.g., 09:00-10:30). ONLY USE DURATION BLOCKS (e.g., "15 min", "90 min"). The sum of durations should roughly match ${availableHoursToday} hours. Insert "Inbox & Planning", "Short Break", "Buffer". Deep work should be 60-120 mins. Quick wins 15-45 mins. 
      - Rescue Plan: Explicitly list the tasks being postponed along with specific reasons (e.g. "No deadline pressure. Can safely move 3 days.")
      - Insights: Behave like an Executive Briefing. Explain why workload is high/low, what causes stress, which task contributes most, and what should change tomorrow. Do NOT just say "High stress" or give basic numbers.
      - Stress Level: MUST BE EXACTLY ONE OF: "Calm", "Manageable", "Busy", "Overloaded", "Critical". Then explain WHY on the same line (e.g. "Overloaded — You have 9.5 hours of remaining work but only 4 focused hours available...").
      - Focus Window: Derive this from the highest effort/priority task. DO NOT use static times. Examples: "First 90 minutes — Use this block for Machine Learning Assignment because it requires uninterrupted concentration." If ${availableHoursToday} <= 2, suggest 30-60 mins. If 3-4, suggest 60-90 mins.
      - Notifications: Make them highly proactive and specific. Include task names. e.g., "Completing 'Submit Resume' now removes tomorrow's application stress in under an hour."
      
      Task Details:
      ${JSON.stringify(tasks, null, 2)}
      
      Respond ONLY with valid JSON exactly matching this schema:
      {
        "mission": {
          "title": "String",
          "objective": "String",
          "reason": "String",
          "confidence": Number (1-100),
          "estimatedCompletion": "String"
        },
        "prioritizedTasks": [
          {
            "id": "String (must match task id)",
            "priority": Number (1 is highest),
            "riskLevel": "Low" | "Medium" | "High" | "Critical",
            "score": Number (1-100),
            "reason": "String (100% unique, specific explanation without forbidden phrases)",
            "nextAction": "String",
            "estimatedRemaining": "String",
            "tradeoffs": "String (100% unique, specific tradeoff mentioning exact cost)",
            "consequences": "String (100% unique, specific consequence)",
            "expectedBenefit": "String (100% unique, specific benefit mentioning exact outcome)",
            "confidence": Number (1-100)
          }
        ],
        "timeline": [
          { "duration": "String (e.g. '45 min', '90 min')", "task": "String (Include breaks and buffers)" }
        ],
        "notifications": [
          { "id": "String", "type": "String", "priority": "Low|Medium|High|Critical", "title": "String (mention task names)", "description": "String", "reason": "String", "confidence": Number }
        ],
        "rescuePlan": {
          "immediateAction": "String",
          "next30MinPlan": "String",
          "next2HoursPlan": "String",
          "tasksToPostpone": [
            { "id": "String", "title": "String", "reason": "String (Why exactly is this safe to drop?)" }
          ],
          "successProbability": Number (1-100),
          "reasoning": "String"
        },
        "insights": {
          "workloadScore": Number (1-100),
          "stressLevel": "String (MUST BE: Calm | Manageable | Busy | Overloaded | Critical — Followed by explanation)",
          "completionForecast": "String (Executive briefing style, explaining causes of pressure and tomorrow's outlook)",
          "suggestedFocusHours": "String (e.g. 'First 90 minutes — Finish Internship Form before context switching')",
          "overallProductivityScore": Number (1-100),
          "reasoning": "String (Explain the feasibility of the schedule specifically)"
        },
        "whatIfGuidance": {
          "defaultScenario": "String",
          "consequences": "String",
          "betterAlternative": "String"
        }
      }
    `;
    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
  } catch (error) {
    console.error("Gemini API Error (generateExecutiveState):", error);
    return getExecutiveFallback(tasks, availableHoursToday);
  }
}

export async function simulateScenario(task, scenario, tasks) {
  if (!genAI) return getSimulatorFallback(task, scenario);
  try {
    const model = genAI.getGenerativeModel(modelConfig);
    const prompt = `
      You are an elite Chief of Staff AI.
      The user is considering this scenario: "${scenario}" for the task: "${task.title}" (Due: ${task.deadline}, Est Hours: ${task.estimatedHours}, Category: ${task.category}).
      
      Simulate the cascading consequences on their schedule based on this specific task.
      NEVER use generic templates. Speak naturally like a human advisor.
      You MUST mention:
      1. the exact task name
      2. the exact deadline context
      3. hours lost/gained
      4. the new workload situation
      5. the practical consequence.
      
      For example: "Skipping 'Machine Learning Assignment' today means tomorrow's workload increases from 4 hours to 10 hours, making it unlikely that both the assignment and interview preparation can be completed comfortably."

      Respond ONLY with valid JSON exactly matching this schema:
      {
        "consequences": "String (Unique, highly specific human-readable consequences)",
        "riskIncrease": "String (e.g. '+25%' or 'None')",
        "affectedTasks": ["String (Names of tasks affected)"],
        "newExecutionPlan": "String (Unique alternative approach)",
        "betterAlternative": "String (Unique better action)",
        "confidenceScore": Number,
        "reasoning": "String (Why exactly did you predict this based on the task parameters?)"
      }
    `;
    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
  } catch (error) {
    return getSimulatorFallback(task, scenario);
  }
}

function getSimulatorFallback(task, scenario) {
  const title = task?.title || 'Unknown Task';
  const hoursLeft = getHoursUntil(task?.deadline);
  
  if (hoursLeft > 72) {
    return {
      consequences: `Since '${title}' isn't due for several days, pushing it out won't immediately break your schedule, though it will eat into your future buffer time.`,
      riskIncrease: "+5%",
      affectedTasks: ["Future open blocks"],
      newExecutionPlan: `Reschedule ${title} for a lighter day later this week.`,
      betterAlternative: `Knock out 15 minutes of prep work today so it's easier to start later.`,
      confidenceScore: 95,
      reasoning: `The deadline is far enough away (${Math.ceil(hoursLeft / 24)} days) that a delay is completely manageable without sacrificing other priorities.`
    };
  }

  return {
    consequences: `Delaying '${title}' now means you will have to find ${task.estimatedHours} uninterrupted hours tomorrow, which will almost certainly force you to cancel other plans.`,
    riskIncrease: "+35%",
    affectedTasks: ["All tasks scheduled for tomorrow"],
    newExecutionPlan: `You'll need to wake up early tomorrow and block your calendar entirely until ${title} is done.`,
    betterAlternative: `Do half of it right now. Leaving the entire ${task.estimatedHours} hours for tomorrow is too risky.`,
    confidenceScore: 90,
    reasoning: `Given the looming deadline (${Math.ceil(hoursLeft)} hours away), pushing a task of this size entirely to tomorrow creates a mathematical scheduling bottleneck.`
  };
}

// -------------------------------------------------------------
// EXECUTIVE FALLBACK (mimics API exactly)
// -------------------------------------------------------------
function getExecutiveFallback(tasks, availableHoursToday) {
  const activeTasks = tasks.filter(t => t.progress < 100);
  
  const analyzed = activeTasks.map(task => {
    const estHours = parseFloat(task.estimatedHours || 0);
    const hoursLeft = getHoursUntil(task.deadline);
    let score = 30;
    let riskLevel = "Low";
    let isQuickWin = false;

    if (hoursLeft <= 24) {
      if (estHours <= 1) { score = 100; riskLevel = "Critical"; isQuickWin = true; }
      else if (task.importance === 'High') { score = 90; riskLevel = "Critical"; }
      else { score = 80; riskLevel = "High"; }
    } else if (hoursLeft <= 72) {
      if (task.importance === 'High') { score = 85; riskLevel = "High"; }
      else { score = 60; riskLevel = "Medium"; }
    } else {
      if (task.importance === 'High') { score = 70; riskLevel = "Medium"; }
      else { score = 40; riskLevel = "Low"; }
    }

    const effectiveAvailableTime = availableHoursToday ?? (task.availableTimeToday || 8);

    if (estHours > effectiveAvailableTime && hoursLeft <= 48 && !isQuickWin) {
      score = Math.min(score + 8, 98);
      if (riskLevel === "Medium") riskLevel = "High";
    }

    if (task.progress > 50 && riskLevel !== "Critical") score -= 10;
    if (score < 10) score = 10;

    return { ...task, score, riskLevel, isQuickWin, estHours, hoursLeft };
  });

  analyzed.sort((a, b) => b.score - a.score);

  const topTask = analyzed[0];
  const totalEst = analyzed.reduce((acc, t) => acc + t.estHours, 0);
  const isOverloaded = totalEst > availableHoursToday; 
  
  const prioritizedTasks = analyzed.map((t, idx) => {
    let reason, tradeoffs, consequences, expectedBenefit;

    if (t.isQuickWin) {
      reason = `Completing '${t.title}' requires only ${t.estHours} hours but removes an immediate deadline from today's schedule.`;
      tradeoffs = `You'll spend ${t.estHours * 60} minutes now, but you will free tomorrow for focused ${t.category ? t.category.toLowerCase() : 'other'} work.`;
      consequences = `Leaving '${t.title}' hanging means you will lose valuable deep-work time tomorrow to wrap it up.`;
      expectedBenefit = `Submitting '${t.title}' today removes application stress and clears a fixed obligation.`;
    } else if (t.hoursLeft < 48) {
      reason = `The deadline for '${t.title}' is only ${Math.ceil(t.hoursLeft)} hours away, requiring an immediate uninterrupted block of ${t.estHours} hours.`;
      tradeoffs = `Committing ${t.estHours} hours to '${t.title}' means we postpone smaller errands until tomorrow.`;
      consequences = `Delaying '${t.title}' further guarantees a rushed, low-quality submission and severe academic or professional pressure.`;
      expectedBenefit = `Making progress on '${t.title}' today reduces tomorrow's workload and prevents a last-minute marathon.`;
    } else {
      reason = `'${t.title}' strengthens your long-term goals but has no immediate deadline (${Math.ceil(t.hoursLeft / 24)} days away).`;
      tradeoffs = `Spending ${t.estHours} hours on '${t.title}' today takes energy away from more urgent fires.`;
      consequences = `If we completely ignore '${t.title}' all week, it will eventually become an emergency.`;
      expectedBenefit = `Maintains steady progress on '${t.title}' without causing immediate burnout.`;
    }

    return {
      id: t.id,
      priority: idx + 1,
      riskLevel: t.riskLevel,
      score: t.score,
      reason,
      nextAction: t.isQuickWin ? `Execute '${t.title}' immediately.` : `Block out uninterrupted time for '${t.title}'.`,
      estimatedRemaining: `${t.estHours}h`,
      tradeoffs,
      consequences,
      expectedBenefit,
      confidence: 90 - idx
    };
  });

  const postponeTasks = analyzed.filter(t => t.riskLevel !== 'Critical' && t.riskLevel !== 'High');
  
  const tasksToPostpone = postponeTasks.map(t => ({
    id: t.id,
    title: t.title,
    reason: t.hoursLeft > 72 ? `No deadline pressure. Can safely move ${Math.ceil(t.hoursLeft / 24)} days.` : `Important but not urgent today.`
  }));

  const notifications = [];
  if (isOverloaded) {
    notifications.push({
      id: "burnout-1", type: "Schedule Overload", priority: "Critical",
      title: `You are attempting ${totalEst} hours of work with only ${availableHoursToday} productive hours available.`, 
      description: `If you try to do everything, you will burn out.`,
      reason: `The math simply doesn't work. We need to postpone non-critical items.`, 
      confidence: 95
    });
  }
  const quickWins = analyzed.filter(t => t.isQuickWin);
  if (quickWins.length > 0) {
    notifications.push({
      id: "quick-1", type: "Strategic Suggestion", priority: "High",
      title: `Completing '${quickWins[0].title}' now removes tomorrow's stress in under an hour.`, 
      description: `It takes less than an hour and is due soon.`,
      reason: `Knocking this out clears mental bandwidth.`, 
      confidence: 98
    });
  }

  // Construct realistic timeline based on actual tasks using DURATIONS
  const timeline = [];
  timeline.push({ duration: "15 min", task: "Inbox & Planning" });
  
  if (topTask) {
    const primaryBlockMins = Math.min(topTask.estHours * 60, 120);
    timeline.push({ duration: `${primaryBlockMins} min`, task: `Deep Work: ${topTask.title}` });
    timeline.push({ duration: "15 min", task: "Short Break" });
    
    if (topTask.estHours * 60 > primaryBlockMins) {
      const remainingMins = (topTask.estHours * 60) - primaryBlockMins;
      const secondaryBlockMins = Math.min(remainingMins, 120);
      timeline.push({ duration: `${secondaryBlockMins} min`, task: `Continue: ${topTask.title}` });
      timeline.push({ duration: "20 min", task: "Review & Buffer" });
    }
  }

  const completionForecastStr = activeTasks.length === 0 
    ? "No tasks currently scheduled. Today is completely open." 
    : `Today's workload totals ${totalEst} hours while only ${availableHoursToday} focused hours are available. Most of the pressure comes from '${topTask?.title || 'various small tasks'}'. Completing this early will drastically improve tomorrow's schedule feasibility.`;

  let stressLevel = "Manageable";
  let stressReason = "Workload comfortably fits today.";
  if (totalEst === 0) {
    stressLevel = "Calm";
    stressReason = "Very light workload. Plenty of available time.";
  } else if (totalEst > availableHoursToday + 3) {
    stressLevel = "Critical";
    stressReason = `Immediate intervention required. You have ${totalEst} hours of work but only ${availableHoursToday} hours available.`;
  } else if (totalEst > availableHoursToday) {
    stressLevel = "Overloaded";
    stressReason = `Today's workload exceeds realistic capacity by ${totalEst - availableHoursToday} hours.`;
  } else if (totalEst > availableHoursToday - 1) {
    stressLevel = "Busy";
    stressReason = "Today is full but achievable with strict focus.";
  }

  let focusWindowStr = "Any 60 minutes — Use this time to prepare for tomorrow.";
  if (topTask) {
    if (availableHoursToday <= 2) {
      focusWindowStr = `First 30-45 minutes — Use this block for '${topTask.title}' because your total time is heavily restricted today.`;
    } else if (availableHoursToday <= 4) {
      focusWindowStr = `First 60-90 minutes — Focus intensely on '${topTask.title}' before context switching to smaller tasks.`;
    } else {
      focusWindowStr = `First 90-120 minutes — Capitalize on early energy to make deep progress on '${topTask.title}'.`;
    }
  }

  return {
    mission: {
      title: topTask ? `Today's objective is to eliminate tomorrow's deadlines while preserving enough energy for deep work.` : "Use today to plan ahead.",
      objective: topTask ? `Execute '${topTask.title}' efficiently.` : "Plan your week.",
      reason: topTask ? `Your biggest risk today is workload overload rather than difficult work. Clearing the quick deadlines first creates room for focused execution.` : "No urgent risks.",
      confidence: 92,
      estimatedCompletion: "Late Afternoon"
    },
    prioritizedTasks: prioritizedTasks,
    timeline: timeline,
    notifications: notifications,
    rescuePlan: {
      immediateAction: "Close all communication tabs and silence notifications for the next 90 minutes.",
      next30MinPlan: quickWins.length > 0 ? `Immediately execute '${quickWins[0].title}'.` : `Begin scoping out the hardest part of '${topTask?.title || 'your first task'}'.`,
      next2HoursPlan: `Stay exclusively focused on your top priority. Do not switch contexts.`,
      tasksToPostpone: tasksToPostpone,
      successProbability: Math.max(10, 100 - (totalEst * 5)),
      reasoning: tasksToPostpone.length > 0 ? `Postponing these is necessary because they lack immediate deadlines.` : "Clearing out noise so you can actually execute."
    },
    insights: {
      workloadScore: Math.min(Math.round(totalEst * 8), 100),
      stressLevel: `${stressLevel} — ${stressReason}`,
      completionForecast: completionForecastStr,
      suggestedFocusHours: focusWindowStr,
      overallProductivityScore: Math.min(85, 100),
      reasoning: `Current progress is heavily bottlenecked by the ${topTask?.title || 'volume of work'}.`
    },
    whatIfGuidance: {
      defaultScenario: "Postpone everything until tomorrow",
      consequences: topTask ? `Skipping '${topTask.title}' today means tomorrow's workload increases from ${availableHoursToday} hours to ${availableHoursToday + topTask.estHours} hours, making it unlikely that both the assignment and other work can be completed comfortably.` : "Tomorrow will be slightly busier.",
      betterAlternative: "Execute at least the top priority task today to maintain equilibrium."
    }
  };
}
