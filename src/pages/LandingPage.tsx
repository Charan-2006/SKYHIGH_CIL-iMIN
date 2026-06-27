import { Link } from 'react-router-dom'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useEffect, useRef } from 'react'
import {
  Brain,
  Layers,
  Lightbulb,
  FlaskConical,
  Network,
  Eye,
  ArrowRight,
  Mountain,
  Shield,
  BarChart3,
  ChevronRight,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { landingStats, landingFeatures } from '@/data/mockData'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Brain, Layers, Lightbulb, FlaskConical, Network, Eye,
}

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(0)
  const rounded = useTransform(motionValue, (v) => {
    if (suffix === '%') return v.toFixed(1)
    if (suffix === '₹Cr') return Math.round(v).toString()
    return v.toFixed(1)
  })

  useEffect(() => {
    const controls = animate(motionValue, value, { duration: 2, ease: 'easeOut' })
    return controls.stop
  }, [value, motionValue])

  useEffect(() => {
    const unsub = rounded.on('change', (v) => {
      if (ref.current) ref.current.textContent = v + suffix
    })
    return unsub
  }, [rounded, suffix])

  return <span ref={ref}>0{suffix}</span>
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 z-50 w-full border-b border-border bg-white/95 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-light">
              <Mountain className="h-5 w-5 text-primary" />
            </div>
            <span className="text-lg font-bold text-foreground">Carbon<span className="text-primary font-light">Cortex</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#architecture" className="hover:text-foreground transition-colors">Architecture</a>
            <a href="#stats" className="hover:text-foreground transition-colors">Impact</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login"><Button variant="ghost" size="sm">Sign In</Button></Link>
            <Link to="/login"><Button size="sm">Get Started <ArrowRight className="h-4 w-4" /></Button></Link>
          </div>
        </div>
      </nav>

      <section className="relative pt-28 pb-16 hero-gradient grid-pattern overflow-hidden">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-primary-light px-4 py-1.5 text-sm text-primary mb-6">
                <Shield className="h-4 w-4" />
                Enterprise Coal Intelligence Platform
              </div>
              <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold tracking-tight text-foreground leading-tight">
                Transform Coal Operations with{' '}
                <span className="gradient-text">AI-Powered Intelligence</span>
              </h1>
              <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
                CarbonCortex delivers real-time quality prediction, intelligent blend optimization,
                and decision intelligence for India's largest coal mining operations.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link to="/dashboard">
                  <Button size="lg" className="w-full sm:w-auto min-w-[180px]">Launch Dashboard <ArrowRight className="h-5 w-5" /></Button>
                </Link>
                <Link to="/login">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto min-w-[180px]">Request Demo</Button>
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-4 text-sm text-muted-foreground">
                {['352 Mines', '94.2% Accuracy', 'SAP Integrated'].map((t) => (
                  <span key={t} className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-accent" />{t}</span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="hidden lg:block"
            >
              <Card className="glass-card p-5 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-semibold text-foreground">Operations Overview</p>
                  <Badge variant="success">Live</Badge>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[
                    { label: 'Production', value: '668.7 MT', change: '+4.2%' },
                    { label: 'Avg GCV', value: '4,520', change: '+1.8%' },
                    { label: 'Revenue', value: '₹142K Cr', change: '+6.7%' },
                    { label: 'Accuracy', value: '94.2%', change: '+1.3%' },
                  ].map((m) => (
                    <div key={m.label} className="rounded-lg bg-card-muted p-3 border border-border">
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{m.label}</p>
                      <p className="text-lg font-bold text-foreground mt-1">{m.value}</p>
                      <p className="text-xs text-accent mt-0.5">{m.change}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-lg bg-primary-light border border-sky-200 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <p className="text-sm font-medium text-foreground">AI Recommendation</p>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Increase SECL-MCL blend ratio to 65:35 — projected gain of ₹18.4 Cr/month with 94.2% confidence.
                  </p>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="stats" className="py-20 border-y border-border bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {landingStats.map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <Card className="glass-card-hover p-6 text-center h-full">
                  <p className="text-2xl md:text-3xl font-bold text-foreground">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="mt-1.5 text-sm text-muted-foreground">{stat.label}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground">Enterprise Capabilities</h2>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              Purpose-built for coal mining operations at scale — from pithead quality control to boardroom decision support.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {landingFeatures.map((feature, i) => {
              const Icon = iconMap[feature.icon] ?? Brain
              return (
                <motion.div key={feature.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                  <Card className="glass-card-hover p-6 h-full">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-light text-primary mb-4">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-base font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <section id="architecture" className="py-20 section-muted">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground">Platform Architecture</h2>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              Cloud-native, edge-enabled architecture designed for mission-critical mining operations.
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-6">
            {[
              { layer: 'Edge Layer', items: ['IoT Sensor Network', 'Edge ML Inference', 'SCADA Integration', 'Real-time Quality Gates'] },
              { layer: 'Intelligence Layer', items: ['ML Model Registry', 'Blend Optimizer Engine', 'Decision Intelligence', 'Scenario Simulator'] },
              { layer: 'Enterprise Layer', items: ['SAP ERP Connector', 'Executive Dashboards', 'Audit & Compliance', 'Role-based Access Control'] },
            ].map((arch, i) => (
              <motion.div key={arch.layer} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Card className="glass-card-hover p-6 h-full">
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    <h3 className="text-base font-semibold text-foreground">{arch.layer}</h3>
                  </div>
                  <ul className="space-y-2">
                    {arch.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <ChevronRight className="h-3.5 w-3.5 text-primary shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <Card className="glass-card p-10 md:p-12 hero-gradient">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Ready to optimize your coal operations?</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Join Coal India Limited subsidiaries leveraging AI for quality prediction and revenue optimization.
            </p>
            <Link to="/dashboard">
              <Button size="lg">Access CarbonCortex <ArrowRight className="h-5 w-5" /></Button>
            </Link>
          </Card>
        </div>
      </section>

      <footer className="border-t border-border py-8 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Mountain className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">CarbonCortex</span>
              <span className="text-muted-foreground text-sm">© 2026 Coal India Limited</span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Documentation</span>
              <span>Support</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
