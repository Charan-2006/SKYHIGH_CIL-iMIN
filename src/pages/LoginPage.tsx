import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mountain, Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle2, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { setAuthUser, defaultAuthUser, isAuthenticated } from '@/lib/auth'

const trustPoints = [
  'SOC 2 Type II compliant infrastructure',
  'Role-based access across 7 subsidiaries',
  'Real-time SCADA & SAP ERP integration',
  'SHAP explainability on every prediction',
]

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

export default function LoginPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [email, setEmail] = useState('charan.annamalai@coalindia.in')
  const [password, setPassword] = useState('')

  const isBusy = loading || googleLoading

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard', { replace: true })
    }
  }, [navigate])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setAuthUser({
        ...defaultAuthUser,
        email: email.trim() || defaultAuthUser.email,
      })
      navigate('/dashboard', { replace: true })
    }, 1500)
  }

  const handleGoogleLogin = () => {
    setGoogleLoading(true)
    setTimeout(() => {
      setGoogleLoading(false)
      setAuthUser({
        ...defaultAuthUser,
        email: 'charan.annamalai@coalindia.in',
      })
      navigate('/dashboard', { replace: true })
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-background flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden hero-gradient grid-pattern">
        <div className="relative z-10 flex flex-col justify-between min-h-screen w-full px-14 py-12">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-light">
                <Mountain className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Carbon<span className="text-primary font-light">Cortex</span></h1>
                <p className="text-xs text-muted-foreground">Enterprise Coal Intelligence</p>
              </div>
            </div>
          </div>

          <div className="max-w-md">
            <h2 className="text-3xl xl:text-4xl font-bold text-foreground leading-tight mb-4">
              Intelligent decisions for{' '}
              <span className="gradient-text">India's coal future</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Access real-time quality predictions, blend optimization, and AI-driven recommendations
              across 352 active mines and 7 subsidiary operations.
            </p>
            <ul className="mt-8 space-y-3">
              {trustPoints.map((point) => (
                <li key={point} className="flex items-start gap-2.5 text-sm text-foreground-secondary">
                  <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-3 max-w-sm">
            {[
              { label: 'Mines Monitored', value: '352' },
              { label: 'Prediction Accuracy', value: '94.2%' },
              { label: 'Daily Predictions', value: '12K+' },
              { label: 'Revenue Impact', value: '₹142Cr' },
            ].map((stat) => (
              <div key={stat.label} className="glass-card rounded-lg p-3.5">
                <p className="text-lg font-bold text-foreground">{stat.value}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center p-6 bg-white">
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-3 mb-6 justify-center">
            <Mountain className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">CarbonCortex</span>
          </div>

          <Card className="glass-card p-7 shadow-md">
            <div className="flex items-center gap-2 mb-6 rounded-lg bg-primary-light border border-sky-200 px-3 py-2">
              <Shield className="h-4 w-4 text-primary shrink-0" />
              <p className="text-xs text-primary">Secure enterprise authentication</p>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
              <p className="text-sm text-muted-foreground mt-1">Sign in to your CarbonCortex account</p>
            </div>

            <Button
              type="button"
              variant="secondary"
              size="lg"
              className="w-full bg-white hover:bg-card-muted"
              onClick={handleGoogleLogin}
              disabled={isBusy}
            >
              {googleLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <GoogleIcon className="h-5 w-5" />
                  Continue with Google
                </>
              )}
            </Button>
            <p className="mt-2 text-center text-[11px] text-muted-foreground">
              Google Workspace SSO · mock sign-in for demo
            </p>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-muted-foreground tracking-wide">or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" placeholder="name@coalindia.in" required />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <button type="button" className="text-xs text-primary hover:underline">Forgot password?</button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-10" placeholder="Enter your password" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isBusy}>
                {loading ? <LoadingSpinner size="sm" /> : <>Sign In <ArrowRight className="h-4 w-4" /></>}
              </Button>
            </form>

            <div className="mt-5 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have access?{' '}
                <button className="text-primary hover:underline">Contact IT Administrator</button>
              </p>
            </div>
          </Card>

          <p className="text-center text-xs text-muted-foreground mt-5">
            <Link to="/" className="hover:text-primary transition-colors">← Back to homepage</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
