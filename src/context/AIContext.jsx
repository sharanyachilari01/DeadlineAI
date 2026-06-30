import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../firebase';
import { collection, query, onSnapshot, doc } from 'firebase/firestore';
import { getExecutiveState } from '../services/decisionEngine';

const AIContext = createContext();

export function useAI() {
  return useContext(AIContext);
}

export function AIProvider({ children }) {
  const { currentUser } = useAuth();
  
  const [tasks, setTasks] = useState([]);
  const [activeTasks, setActiveTasks] = useState([]);
  const [userSettings, setUserSettings] = useState(null);
  const [executiveState, setExecutiveState] = useState(null);
  const [loadingAI, setLoadingAI] = useState(true);
  const [replanToast, setReplanToast] = useState(false);

  // Subscribe to raw Firestore tasks and user settings
  useEffect(() => {
    if (!currentUser) {
      setTasks([]);
      setActiveTasks([]);
      setUserSettings(null);
      setExecutiveState(null);
      setLoadingAI(false);
      return;
    }

    const qTasks = query(collection(db, 'users', currentUser.uid, 'tasks'));
    const unsubTasks = onSnapshot(qTasks, (querySnapshot) => {
      const tasksData = [];
      querySnapshot.forEach((document) => {
        tasksData.push({ id: document.id, ...document.data() });
      });
      setTasks(tasksData);
      setActiveTasks(tasksData.filter(t => t.progress < 100));
    });

    const docRefSettings = doc(db, 'users', currentUser.uid, 'settings', 'daily');
    const unsubSettings = onSnapshot(docRefSettings, (document) => {
      if (document.exists()) {
        setUserSettings(document.data());
      } else {
        setUserSettings(null);
      }
    });

    return () => {
      unsubTasks();
      unsubSettings();
    };
  }, [currentUser]);

  // Derive effective available hours today (default to 4 if unset/invalid date)
  const todayStr = new Date().toISOString().split('T')[0];
  const isSettingsValidForToday = userSettings?.lastUpdatedDate === todayStr && typeof userSettings?.availableHoursToday === 'number';
  const effectiveHours = isSettingsValidForToday ? userSettings.availableHoursToday : 4;

  // Run Executive Engine whenever active tasks OR available hours change
  useEffect(() => {
    if (!currentUser) return;

    let isMounted = true;
    
    const evaluate = async () => {
      setLoadingAI(true);
      const result = await getExecutiveState(activeTasks, false, effectiveHours);
      
      if (isMounted) {
        setExecutiveState(result.data);
        setLoadingAI(false);
        
        if (!result.cached && activeTasks.length > 0) {
          setReplanToast(true);
          setTimeout(() => setReplanToast(false), 4000);
        }
      }
    };

    evaluate();

    return () => { isMounted = false; };
  }, [activeTasks, currentUser, effectiveHours]);

  const triggerRecalculate = useCallback(async () => {
    if (!currentUser) return;
    setLoadingAI(true);
    const result = await getExecutiveState(activeTasks, true, effectiveHours);
    setExecutiveState(result.data);
    setLoadingAI(false);
    return true;
  }, [activeTasks, currentUser, effectiveHours]);

  const value = {
    tasks,
    activeTasks,
    executiveState,
    loadingAI,
    replanToast,
    userSettings,
    effectiveHours,
    isSettingsValidForToday,
    triggerRecalculate
  };

  return (
    <AIContext.Provider value={value}>
      {children}
    </AIContext.Provider>
  );
}
