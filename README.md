# DeadlineAI 🚀

> Your AI Executive Productivity Agent & Decision Engine

DeadlineAI is a next-generation task manager. Instead of passively storing lists of tasks, it actively analyzes your workload, predicts consequences, and acts as a central **AI Decision Engine** to guide your daily execution.

## The Problem
Modern professionals suffer from decision paralysis. When you are overwhelmed with 20+ tasks, traditional to-do lists fail because they expect *you* to figure out the priority, sequence, and risk level.

## The Solution
DeadlineAI utilizes Google's Gemini AI to dynamically triage your tasks. Every time your workload changes, it automatically recalculates your "Mission Control" dashboard, generates a visual timeline, and warns you if your schedule is mathematically overloaded. 

## Core Features 🎯

1. **AI Decision Engine:** Constantly evaluates all tasks against available time and deadlines.
2. **Mission Control:** A dashboard that provides a single "Today's Mission" and the "First Action" you must take, backed by AI reasoning.
3. **Rescue Protocol:** An emergency mode that calculates a minimum-viable survival plan when you are overwhelmed.
4. **What-If Simulator:** Predict the cascading consequences of skipping or delaying tasks.
5. **Dynamic Overload Detection:** Automatically warns you if estimated hours exceed available hours.
6. **AI Explainability:** Every recommendation comes with an expandable "Why?" panel and a Confidence Score.

## Architecture & Data Modeling 🏗️
DeadlineAI separates **Task State** from **User Daily Context**. 
Instead of hardcoding "Available Hours Today" onto every individual task (which causes stale data as your schedule changes), your daily availability is stored in a global `users/{uid}/settings` document. 
The **AIContext** dynamically merges your immutable tasks with your daily availability, and caches the result via a hash in the `decisionEngine`. This ensures that when your schedule opens up, the AI instantly recalculates priorities and insights without forcing you to edit every single task.

## Tech Stack & Google Technologies 🛠️
*   **Frontend:** React, Vite, Tailwind CSS (Glassmorphism & Responsive Design)
*   **Database & Auth:** Firebase (Firestore, Firebase Authentication)
*   **Artificial Intelligence:** `@google/generative-ai` SDK (Google **Gemini 1.5 Flash**)
*   **Icons:** Lucide React

## Local Setup Instructions 💻

1. **Clone & Install**
   ```bash
   git clone <repo-url>
   cd DeadlineAI
   npm install
   ```

2. **Environment Variables**
   Rename `.env.example` to `.env` and fill in your Firebase and Gemini credentials:
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```
   *(Note: The app contains robust mock fallbacks and will continue to work safely even if the Gemini API key is omitted!)*

3. **Run Development Server**
   ```bash
   npm run dev
   ```

## Future Scope 🔮
*   Integrate Google Calendar API for automatic two-way timeline syncing.
*   Implement multi-modal inputs (e.g., voice memos to tasks).
*   Add team collaboration features (Delegation Engine).
