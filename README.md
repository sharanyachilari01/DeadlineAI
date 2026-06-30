# DeadlineAI

> An AI-powered executive productivity assistant that transforms tasks into intelligent execution strategies.

DeadlineAI is an AI-powered productivity companion designed to help users make better decisions under time pressure. Instead of functioning as a traditional reminder application, it analyzes the user's complete workload, prioritizes tasks, explains every recommendation, predicts scheduling consequences, and generates realistic execution plans.

## Live Demo

**Application:**  
https://deadlineai-658ba.web.app/

## Problem Statement

Traditional productivity applications mainly act as reminder systems. While they notify users about upcoming deadlines, they leave all planning and prioritization to the user. As workloads grow, users experience decision fatigue, struggle to identify what should be done first, and often miss important deadlines.

DeadlineAI addresses this problem by acting as an AI-powered executive assistant that helps users decide what to do, when to do it, and why.

## Solution

DeadlineAI evaluates the user's complete workload using Google Gemini 2.5 Flash together with a deterministic offline fallback engine. By considering deadlines, estimated effort, importance, progress, categories, and available productive hours, it generates personalized recommendations, recovery strategies, execution plans, and productivity insights.

## Core Features

- **AI Executive Decision Engine** – Analyzes the complete workload to generate intelligent, explainable recommendations.
- **Executive Dashboard** – Displays the daily mission, prioritized tasks, execution plan, notifications, and AI reasoning.
- **Intelligent Task Management** – Create tasks with deadlines, estimated effort, categories, importance levels, and progress tracking.
- **Dynamic Available Hours** – Adapts recommendations based on the user's available productive hours for the day.
- **Rescue Mode** – Detects overloaded schedules and generates recovery strategies with task postponement recommendations.
- **Today's Execution Plan** – Produces flexible duration-based work blocks instead of fixed clock schedules.
- **What-If Simulator** – Predicts the consequences of delaying or skipping tasks and recommends better alternatives.
- **Executive Insights** – Provides workload analysis, stress assessment, focus recommendations, and completion forecasts.
- **Offline AI Fallback** – Maintains intelligent recommendations even when the Gemini API is unavailable.
- **Real-Time Synchronization** – Automatically refreshes AI recommendations whenever tasks or user settings change.

## System Architecture

```
                         User
                           │
                           ▼
              Firebase Authentication
                           │
                           ▼
                  Cloud Firestore
           (Tasks + User Settings)
                           │
                           ▼
          AI Context & Decision Engine
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
      Google Gemini 2.5 Flash     Offline Fallback
              │                         │
              └────────────┬────────────┘
                           ▼
                  Executive State
                           │
      ┌────────────┬─────────────┬─────────────┐
      ▼            ▼             ▼             ▼
 Dashboard     Rescue Mode   What-If      Insights
                               Simulator
```

## Technology Stack

**Frontend**
- React
- Vite
- Tailwind CSS
- React Router

**Backend & Database**
- Firebase Authentication
- Cloud Firestore
- Firebase Hosting

**Artificial Intelligence**
- Google Gemini 2.5 Flash
- Prompt Engineering
- Executive Decision Engine
- Deterministic Offline Fallback

**UI Components**
- Lucide React

## Google Technologies Used

- **Google Gemini 2.5 Flash** for workload analysis, prioritization, execution planning, rescue strategies, notifications, and insights.
- **Firebase Authentication** for secure user authentication.
- **Cloud Firestore** for storing tasks and daily user settings.
- **Firebase Hosting** for deployment and production hosting.

## Local Setup

### Clone the Repository

```bash
git clone https://github.com/sharanyachilari01/DeadlineAI.git
cd DeadlineAI
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file and add the following:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

VITE_GEMINI_API_KEY=
```

### Start Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

## Future Enhancements

- Google Calendar integration
- Email and push notifications
- Voice-based task creation
- Team collaboration and shared workspaces
- AI memory for long-term productivity analysis
- Mobile application for Android and iOS

## Developed For

**Vibe2Ship 2026 – Google AI Hackathon**

DeadlineAI demonstrates how AI can move beyond reminders to become an intelligent executive assistant that helps users prioritize work, reduce cognitive overload, and execute their daily tasks more effectively.
