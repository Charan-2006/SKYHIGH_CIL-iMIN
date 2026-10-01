import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CoalSample } from '../types';
import { authApi, type User } from '../api/auth';
import { predictionApi, type PredictionResult } from '../api/predictions';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  token: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasRole: (roles: string[]) => boolean;
  
  currentSample: CoalSample | null;
  setCurrentSample: (sample: CoalSample | null) => void;
  lastPrediction: PredictionResult | null;
  setLastPrediction: (result: PredictionResult | null) => void;
  history: any[];
  loadHistory: () => Promise<void>;
  clearHistory: () => Promise<void>;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  systemStatus: 'ACTIVE' | 'IDLE' | 'MAINTENANCE';
  setSystemStatus: (status: 'ACTIVE' | 'IDLE' | 'MAINTENANCE') => void;
  settings: any;
  loadSettings: () => Promise<void>;
  saveSettings: (newSettings: any) => Promise<void>;
  
  notifications: Notification[];
  showToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const raw = localStorage.getItem('carbon_cortex_user');
    return raw ? JSON.parse(raw) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('carbon_cortex_token'));
  
  const [currentSample, setCurrentSample] = useState<CoalSample | null>(null);
  const [lastPrediction, setLastPrediction] = useState<PredictionResult | null>(() => {
    const raw = localStorage.getItem('carbon_cortex_last_pred');
    return raw ? JSON.parse(raw) : null;
  });
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [systemStatus, setSystemStatus] = useState<'ACTIVE' | 'IDLE' | 'MAINTENANCE'>('ACTIVE');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<any>({
    modelVersion: 'xgb-v1.0',
    alertThreshold: 85.0,
    autoRefresh: true,
    apiEndpoint: import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
  });

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await authApi.login({ username, password });
      setToken(res.access_token);
      const userObj: User = {
        id: res.user_id,
        username: res.username,
        email: res.email,
        full_name: res.full_name,
        role: res.role
      };
      setCurrentUser(userObj);
      showToast(`Welcome back, ${res.full_name}! Signed in as ${res.role}.`, 'success');
      return true;
    } catch (err: any) {
      console.error('Login error:', err);
      const msg = err.response?.data?.detail || 'Invalid username or password.';
      showToast(msg, 'error');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authApi.logout();
    setToken(null);
    setCurrentUser(null);
    showToast('Logged out of CarbonCortex system.', 'info');
  };

  const hasRole = (roles: string[]): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === 'ADMIN') return true;
    return roles.includes(currentUser.role);
  };

  const loadHistory = async () => {
    try {
      const items = await predictionApi.getHistory();
      setHistory(items);
    } catch (error) {
      console.warn('Backend prediction history load failed:', error);
    }
  };

  const clearHistory = async () => {
    try {
      await predictionApi.clearHistory();
      setHistory([]);
      showToast('Prediction history cleared.', 'info');
    } catch (error) {
      console.error('Failed to clear history:', error);
      showToast('Failed to clear prediction history from server.', 'error');
    }
  };

  const loadSettings = async () => {
    const raw = localStorage.getItem('carbon_cortex_settings');
    if (raw) {
      setSettings(JSON.parse(raw));
    }
  };

  const saveSettings = async (newSettings: any) => {
    setSettings(newSettings);
    localStorage.setItem('carbon_cortex_settings', JSON.stringify(newSettings));
    showToast('System configuration saved.', 'success');
  };

  // Sync lastPrediction with localStorage
  const updateLastPrediction = (pred: PredictionResult | null) => {
    setLastPrediction(pred);
    if (pred) {
      localStorage.setItem('carbon_cortex_last_pred', JSON.stringify(pred));
    } else {
      localStorage.removeItem('carbon_cortex_last_pred');
    }
  };

  useEffect(() => {
    loadHistory();
    loadSettings();
    if (token) {
      authApi.getCurrentUser()
        .then((u) => setCurrentUser(u))
        .catch(() => {
          // Token expired or invalid
          setToken(null);
          setCurrentUser(null);
        });
    }
  }, []);

  return (
    <AppContext.Provider value={{
      currentUser,
      setCurrentUser,
      token,
      login,
      logout,
      hasRole,
      currentSample,
      setCurrentSample,
      lastPrediction,
      setLastPrediction: updateLastPrediction,
      history,
      loadHistory,
      clearHistory,
      isLoading,
      setIsLoading,
      systemStatus,
      setSystemStatus,
      settings,
      loadSettings,
      saveSettings,
      notifications,
      showToast,
      removeToast
    }}>
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`pointer-events-auto px-4 py-3 rounded-xl shadow-premium border text-xs font-semibold flex items-center justify-between gap-3 min-w-[300px] transition-all transform animate-in slide-in-from-bottom-2 ${
              n.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : n.type === 'error'
                ? 'bg-rose-50 text-rose-800 border-rose-300'
                : n.type === 'warning'
                ? 'bg-amber-50 text-amber-800 border-amber-300'
                : 'bg-white text-cortex-dark border-cortex-border'
            }`}
          >
            <span>{n.message}</span>
            <button
              onClick={() => removeToast(n.id)}
              className="text-gray-400 hover:text-gray-700 cursor-pointer ml-2"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
