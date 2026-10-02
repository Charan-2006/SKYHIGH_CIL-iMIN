import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { ArrowRight, AlertCircle } from 'lucide-react';
import Button from '../components/Button';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useApp();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const success = await login(username, password);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid credentials. Check username and password or select a demo role below.');
    }
  };

  const handleRolePreset = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setError(null);
  };

  return (
    <div className="min-h-screen w-full bg-cortex-bg-secondary flex flex-col justify-between select-none">
      {/* Top Banner */}
      <header className="px-8 py-5 flex justify-between items-center border-b border-cortex-border bg-white">
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="CarbonCortex Logo" className="w-9 h-9 rounded-lg object-contain shadow-xs shrink-0" />
          <div className="flex flex-col text-left">
            <span className="text-base font-bold text-cortex-dark tracking-tight leading-none">CarbonCortex</span>
            <span className="text-[9px] text-gold-700 font-semibold uppercase tracking-widest mt-0.5">Coal Quality & Decision Intelligence</span>
          </div>
        </Link>

        <div className="flex items-center gap-3 text-xs text-cortex-gray">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-semibold text-[10px]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            FASTAPI GATEWAY ONLINE
          </span>
        </div>
      </header>

      {/* Main Login Card */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white border border-cortex-border rounded-2xl shadow-premium p-8 relative overflow-hidden text-left">
          {/* Subtle gold glow */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-radial-gradient from-gold-500/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

          <div className="mb-6">
            <h1 className="text-xs font-bold uppercase tracking-widest text-gold-700">Security Gateway</h1>
            <h2 className="text-2xl font-bold text-cortex-dark mt-1">Enterprise Access</h2>
            <p className="text-xs text-cortex-gray mt-1 leading-relaxed">
              Sign in with your Coal India credentials or select a verified role.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-cortex-gray block mb-1.5">
                Username or Email
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Enter username..."
                  className="w-full px-4 py-2.5 bg-white border border-cortex-border rounded-xl text-sm text-cortex-dark outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/10 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-cortex-gray block mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 bg-white border border-cortex-border rounded-xl text-sm text-cortex-dark outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/10 transition-all font-mono"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-3 text-sm font-bold"
            >
              {isLoading ? (
                <>
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Platform</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          {/* Demo Credentials Switcher */}
          <div className="mt-8 pt-6 border-t border-cortex-border/70">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cortex-gray block mb-3">
              One-Click Enterprise Role Presets
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleRolePreset('admin', 'admin123')}
                className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                  username === 'admin'
                    ? 'border-gold-500 bg-gold-50/30 text-gold-900 font-bold'
                    : 'border-cortex-border hover:bg-cortex-bg-secondary text-cortex-dark'
                }`}
              >
                <div className="font-bold">ADMIN</div>
                <div className="text-[10px] text-cortex-gray">All Permissions</div>
              </button>

              <button
                type="button"
                onClick={() => handleRolePreset('engineer', 'engineer123')}
                className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                  username === 'engineer'
                    ? 'border-gold-500 bg-gold-50/30 text-gold-900 font-bold'
                    : 'border-cortex-border hover:bg-cortex-bg-secondary text-cortex-dark'
                }`}
              >
                <div className="font-bold">ENGINEER</div>
                <div className="text-[10px] text-cortex-gray">Predict & Blending</div>
              </button>

              <button
                type="button"
                onClick={() => handleRolePreset('labtech', 'lab123')}
                className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                  username === 'labtech'
                    ? 'border-gold-500 bg-gold-50/30 text-gold-900 font-bold'
                    : 'border-cortex-border hover:bg-cortex-bg-secondary text-cortex-dark'
                }`}
              >
                <div className="font-bold">LAB TECH</div>
                <div className="text-[10px] text-cortex-gray">Verify Test Results</div>
              </button>

              <button
                type="button"
                onClick={() => handleRolePreset('viewer', 'viewer123')}
                className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                  username === 'viewer'
                    ? 'border-gold-500 bg-gold-50/30 text-gold-900 font-bold'
                    : 'border-cortex-border hover:bg-cortex-bg-secondary text-cortex-dark'
                }`}
              >
                <div className="font-bold">VIEWER</div>
                <div className="text-[10px] text-cortex-gray">Dashboard & Reports</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Institutional Footer */}
      <footer className="py-4 text-center text-xs text-cortex-gray/70">
        Demo Environment — Synthetic Dataset • CarbonCortex Decision Intelligence
      </footer>
    </div>
  );
};

export default Login;
