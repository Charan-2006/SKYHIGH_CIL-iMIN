import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import DashboardLayout from './layouts/DashboardLayout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CoalQualityEvaluation from './pages/CoalQualityEvaluation';
import LabTesting from './pages/LabTesting';
import Explainability from './pages/Explainability';
import Confidence from './pages/Confidence';
import Blend from './pages/Blend';
import Analytics from './pages/Analytics';
import MapPage from './pages/MapPage';
import Report from './pages/Report';
import History from './pages/History';
import Settings from './pages/Settings';
import ModelPerformance from './pages/ModelPerformance';
import ScenarioSimulator from './pages/ScenarioSimulator';
import DispatchPlanning from './pages/DispatchPlanning';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

export const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* Public Landing & Authentication */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />

          {/* Enterprise Application (Inside Dashboard Layout) */}
          <Route element={<DashboardLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="evaluation" element={<CoalQualityEvaluation />} />
            <Route path="prediction" element={<Navigate to="/evaluation" replace />} />
            <Route path="laboratory" element={<LabTesting />} />
            <Route path="explainability" element={<Explainability />} />
            <Route path="confidence" element={<Confidence />} />
            <Route path="blend" element={<Blend />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="scenarios" element={<ScenarioSimulator />} />
            <Route path="dispatch" element={<DispatchPlanning />} />
            <Route path="models" element={<ModelPerformance />} />
            <Route path="map" element={<MapPage />} />
            <Route path="report" element={<Report />} />
            <Route path="history" element={<History />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<Profile />} />
            <Route path="not-found" element={<NotFound />} />
            {/* Fallback inside dashboard */}
            <Route path="*" element={<Navigate to="/not-found" replace />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
};

export default App;

