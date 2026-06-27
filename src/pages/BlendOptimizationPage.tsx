import { useState } from 'react'
import { motion } from 'framer-motion'
import { Layers, IndianRupee, TrendingUp, RefreshCw } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { PageShell, MetricGrid, ContentGrid } from '@/components/common/PageShell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { BlendPieChart, RadarQualityChart } from '@/components/charts/ChartComponents'
import { blendComponents, coalSeams } from '@/data/mockData'
import { StatCard } from '@/components/ui/stat-card'

const seamById = Object.fromEntries(coalSeams.map((s) => [s.id, s]))

export default function BlendOptimizationPage() {
  const [blend, setBlend] = useState(blendComponents.map((b) => b.percentage))

  const total = blend.reduce((a, b) => a + b, 0)
  const getSeam = (i: number) => seamById[blendComponents[i].seamId]
  const blendedGcv = Math.round(blend.reduce((sum, pct, i) => sum + (pct / 100) * getSeam(i).gcv, 0))
  const blendedAsh = Math.round(blend.reduce((sum, pct, i) => sum + (pct / 100) * getSeam(i).ash, 0) * 10) / 10
  const blendedCost = Math.round(blend.reduce((sum, pct, i) => sum + (pct / 100) * getSeam(i).cost, 0))
  const estimatedRevenue = Math.round(blendedGcv * 28.5 * 0.85)

  const pieData = blendComponents.map((b, i) => ({
    seam: b.seam,
    percentage: blend[i],
    color: b.color,
  }))

  const qualityComparison = [
    { metric: 'GCV', current: blendedGcv, target: 5500 },
    { metric: 'Ash', current: 100 - blendedAsh, target: 82 },
    { metric: 'Moisture', current: 78, target: 85 },
    { metric: 'Sulphur', current: 88, target: 90 },
    { metric: 'Cost Eff.', current: 72, target: 80 },
  ]

  const updateBlend = (index: number, value: number[]) => {
    const newBlend = [...blend]
    newBlend[index] = value[0]
    setBlend(newBlend)
  }

  return (
    <PageShell>
      <PageHeader
        title="Blend Optimization"
        description="Multi-objective optimization balancing quality specifications, cost, and revenue maximization."
      >
        <Button variant="secondary" size="sm"><RefreshCw className="h-4 w-4" /> Reset</Button>
        <Button size="sm">Apply Optimal Blend</Button>
      </PageHeader>

      <MetricGrid columns={4}>
        <StatCard title="Blended GCV" value={blendedGcv} unit="kcal/kg" icon={<TrendingUp className="h-4 w-4" />} />
        <StatCard title="Blended Ash" value={blendedAsh} unit="%" icon={<Layers className="h-4 w-4" />} />
        <StatCard title="Cost per Tonne" value={`₹${blendedCost}`} icon={<IndianRupee className="h-4 w-4" />} />
        <StatCard title="Est. Revenue" value={`₹${estimatedRevenue}`} unit="/tonne" icon={<TrendingUp className="h-4 w-4" />} />
      </MetricGrid>

      <ContentGrid columns={3}>
        <motion.div className="lg:col-span-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card className="glass-card-hover h-full">
            <CardHeader>
              <CardTitle>Blend Composition</CardTitle>
            </CardHeader>
            <CardContent>
              <BlendPieChart data={pieData} height={200} compact />
              <div
                className={`mt-5 rounded-lg px-4 py-3 text-center text-sm font-medium ${
                  total === 100
                    ? 'bg-accent-light text-accent border border-emerald-200'
                    : 'bg-warning-light text-warning border border-amber-200'
                }`}
              >
                Total: {total}%{total !== 100 && ' — must equal 100%'}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div className="lg:col-span-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <Card className="glass-card-hover h-full">
            <CardHeader>
              <CardTitle>Interactive Blend Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {blendComponents.map((comp, i) => (
                <div
                  key={comp.seam}
                  className="rounded-lg border border-border bg-card-muted/60 px-5 py-4 space-y-3"
                >
                  <div className="flex items-center justify-between gap-4">
                    <Label className="flex items-center gap-2.5 text-sm font-medium text-foreground">
                      <div className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: comp.color }} />
                      <span>{comp.seam} — {getSeam(i).name}</span>
                    </Label>
                    <span className="text-sm font-bold text-primary tabular-nums">{blend[i]}%</span>
                  </div>
                  <Slider value={[blend[i]]} onValueChange={(v) => updateBlend(i, v)} max={100} step={5} />
                  <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 text-xs text-muted-foreground pt-1">
                    <span>GCV: <span className="font-medium text-foreground-secondary">{getSeam(i).gcv}</span></span>
                    <span>Ash: <span className="font-medium text-foreground-secondary">{getSeam(i).ash}%</span></span>
                    <span>Cost: <span className="font-medium text-foreground-secondary">₹{getSeam(i).cost}</span></span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </ContentGrid>

      <ContentGrid columns={2}>
        <Card className="glass-card-hover">
          <CardHeader>
            <CardTitle>Quality Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <RadarQualityChart data={qualityComparison} />
          </CardContent>
        </Card>

        <Card className="glass-card-hover">
          <CardHeader>
            <CardTitle>Cost & Revenue Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Current Blend Cost', value: `₹${blendedCost}/T`, change: 'Baseline' },
                { label: 'Optimal Blend Cost', value: '₹3,180/T', change: '-₹140/T saved' },
                { label: 'Current Revenue/T', value: `₹${estimatedRevenue}`, change: 'At current GCV' },
                { label: 'Optimized Revenue/T', value: `₹${estimatedRevenue + 320}`, change: '+₹320/T gain' },
              ].map((item) => (
                <div key={item.label} className="p-4 rounded-lg bg-card-muted border border-border">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-lg font-bold text-foreground mt-1.5">{item.value}</p>
                  <p className="text-xs text-accent mt-1">{item.change}</p>
                </div>
              ))}
            </div>

            <div className="p-5 rounded-xl bg-primary-light border border-sky-200">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge variant="success">Recommended</Badge>
                <span className="text-sm font-medium text-foreground">Optimal Blend Configuration</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Adjust blend to <strong className="text-foreground">JSW-I 40% · KSW-A 25% · JSW-II 20% · TAL-A 15%</strong> to
                achieve 5,560 kcal/kg GCV at ₹3,180/tonne — projected monthly gain of{' '}
                <span className="text-accent font-medium">₹18.4 Crores</span>.
              </p>
              <Button className="mt-4" size="sm">Apply Recommendation</Button>
            </div>
          </CardContent>
        </Card>
      </ContentGrid>
    </PageShell>
  )
}
