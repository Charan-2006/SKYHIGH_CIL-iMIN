import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import DashboardLayout from './layouts/DashboardLayout';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Laboratory from './pages/Laboratory';
import Processing from './pages/Processing';
import Prediction from './pages/Prediction';
import Explainability from './pages/Explainability';
import Confidence from './pages/Confidence';
import Blend from './pages/Blend';
import Analytics from './pages/Analytics';
import MapPage from './pages/MapPage';
import Report from './pages/Report';
import History from './pages/History';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

export const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* Dedicated Landing Page (Outside Dashboard Layout) */}
          <Route path="/" element={<Landing />} />

          {/* Enterprise Application (Inside Dashboard Layout) */}
          <Route element={<DashboardLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="laboratory" element={<Laboratory />} />
            <Route path="processing" element={<Processing />} />
            <Route path="prediction" element={<Prediction />} />
            <Route path="explainability" element={<Explainability />} />
            <Route path="confidence" element={<Confidence />} />
            <Route path="blend" element={<Blend />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="map" element={<MapPage />} />
            <Route path="report" element={<Report />} />
            <Route path="history" element={<History />} />
            <Route path="settings" element={<Settings />} />
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
