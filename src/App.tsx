import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import LandingPage from '@/pages/LandingPage'
import LoginPage from '@/pages/LoginPage'
import DashboardPage from '@/pages/DashboardPage'
import CoalQualityPredictionPage from '@/pages/CoalQualityPredictionPage'
import BlendOptimizationPage from '@/pages/BlendOptimizationPage'
import DecisionIntelligencePage from '@/pages/DecisionIntelligencePage'
import ScenarioSimulatorPage from '@/pages/ScenarioSimulatorPage'
import ReportsPage from '@/pages/ReportsPage'
import SettingsPage from '@/pages/SettingsPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/prediction" element={<CoalQualityPredictionPage />} />
          <Route path="/blend" element={<BlendOptimizationPage />} />
          <Route path="/decisions" element={<DecisionIntelligencePage />} />
          <Route path="/simulator" element={<ScenarioSimulatorPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
