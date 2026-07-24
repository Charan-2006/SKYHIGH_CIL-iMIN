import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CoalSample, PredictionResult } from '../types';
import { apiService } from '../services/api';

interface AppContextType {
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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSample, setCurrentSample] = useState<CoalSample | null>(null);
  const [lastPrediction, setLastPrediction] = useState<PredictionResult | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [systemStatus, setSystemStatus] = useState<'ACTIVE' | 'IDLE' | 'MAINTENANCE'>('ACTIVE');
  const [settings, setSettings] = useState<any>({
    modelVersion: 'Cortex-v4.2-Prod',
    alertThreshold: 90.0,
    autoRefresh: true,
    apiEndpoint: 'https://api.carboncortex.cil/v1'
  });

  const loadHistory = async () => {
    try {
      const items = await apiService.getPredictionHistory();
      setHistory(items);
    } catch (error) {
      console.error('Failed to load prediction history:', error);
    }
  };

  const clearHistory = async () => {
    try {
      await apiService.clearHistory();
      setHistory([]);
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  };

  const loadSettings = async () => {
    try {
      const s = await apiService.getSystemSettings();
      setSettings(s);
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const saveSettings = async (newSettings: any) => {
    try {
      const s = await apiService.updateSystemSettings(newSettings);
      setSettings(s);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  // On mount, load initial data
  useEffect(() => {
    loadHistory();
    loadSettings();
    // Load last prediction if it exists
    apiService.getLastPrediction().then(pred => {
      if (pred) setLastPrediction(pred);
    });
  }, []);

  return (
    <AppContext.Provider value={{
      currentSample,
      setCurrentSample,
      lastPrediction,
      setLastPrediction,
      history,
      loadHistory,
      clearHistory,
      isLoading,
      setIsLoading,
      systemStatus,
      setSystemStatus,
      settings,
      loadSettings,
      saveSettings
    }}>
      {children}
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
