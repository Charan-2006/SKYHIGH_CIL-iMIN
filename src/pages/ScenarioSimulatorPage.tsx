import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { FlaskConical, RotateCcw } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { PageShell, MetricGrid, ContentGrid, Stack } from '@/components/common/PageShell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ScenarioChart } from '@/components/charts/ChartComponents'
import { StatCard } from '@/components/ui/stat-card'

export default function ScenarioSimulatorPage() {
  const [production, setProduction] = useState([85])
  const [gcvTarget, setGcvTarget] = useState([4500])
  const [ashLimit, setAshLimit] = useState([20])
  const [pricePremium, setPricePremium] = useState([12])
  const [washeryUtil, setWasheryUtil] = useState([72])

  const baseline = {
    production: 668.7,
    revenue: 142850,
    gcv: 4520,
    ash: 18.4,
    cost: 106200,
  }

  const scenario = useMemo(() => {
    const prodFactor = production[0] / 100
    const gcvFactor = gcvTarget[0] / 4500
    const ashFactor = 1 - (ashLimit[0] - 18) * 0.02
    const priceFactor = 1 + pricePremium[0] / 100
    const washeryFactor = 1 + (washeryUtil[0] - 70) * 0.005

    return {
      production: Math.round(baseline.production * prodFactor * 10) / 10,
      revenue: Math.round(baseline.revenue * prodFactor * gcvFactor * priceFactor * washeryFactor * ashFactor),
      gcv: Math.round(gcvTarget[0] * gcvFactor),
      ash: Math.round(ashLimit[0] * 10) / 10,
      cost: Math.round(baseline.cost * prodFactor * (1 + (washeryUtil[0] - 70) * 0.003)),
    }
  }, [production, gcvTarget, ashLimit, pricePremium, washeryUtil])

  const chartData = [
    { label: 'Production (MT)', baseline: baseline.production, scenario: scenario.production },
    { label: 'Revenue (₹Cr)', baseline: baseline.revenue / 1000, scenario: scenario.revenue / 1000 },
    { label: 'GCV', baseline: baseline.gcv, scenario: scenario.gcv },
    { label: 'Ash (%)', baseline: baseline.ash, scenario: scenario.ash },
    { label: 'Cost (₹Cr)', baseline: baseline.cost / 1000, scenario: scenario.cost / 1000 },
  ]

  const netImpact = scenario.revenue - scenario.cost - (baseline.revenue - baseline.cost)

  const reset = () => {
    setProduction([85])
    setGcvTarget([4500])
    setAshLimit([20])
    setPricePremium([12])
    setWasheryUtil([72])
  }

  return (
    <PageShell>
      <PageHeader
        title="Scenario Simulator"
        description="Interactive what-if analysis for production volumes, quality parameters, and pricing changes."
      >
        <Button variant="secondary" size="sm" onClick={reset}>
          <RotateCcw className="h-4 w-4" /> Reset
        </Button>
        <Button size="sm">Save Scenario</Button>
      </PageHeader>

      <MetricGrid columns={4}>
        <StatCard title="Scenario Production" value={scenario.production} unit="Million T" />
        <StatCard title="Scenario Revenue" value={`₹${(scenario.revenue / 1000).toFixed(1)}K`} unit="Cr" />
        <StatCard title="Scenario GCV" value={scenario.gcv} unit="kcal/kg" />
        <StatCard title="Net Impact" value={netImpact >= 0 ? `+₹${(netImpact / 1000).toFixed(1)}K` : `-₹${(Math.abs(netImpact) / 1000).toFixed(1)}K`} unit="Cr" trend={netImpact >= 0 ? 'up' : 'down'} />
      </MetricGrid>

      <ContentGrid columns={3}>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Card className="glass-card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FlaskConical className="h-5 w-5 text-primary" />
                Simulation Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-7">
              {[
                { label: 'Production Volume', value: production, setter: setProduction, min: 60, max: 110, unit: '% of capacity', display: `${production[0]}%` },
                { label: 'GCV Target', value: gcvTarget, setter: setGcvTarget, min: 4000, max: 5000, unit: 'kcal/kg', display: `${gcvTarget[0]}` },
                { label: 'Ash Limit', value: ashLimit, setter: setAshLimit, min: 14, max: 26, unit: '%', display: `${ashLimit[0]}%` },
                { label: 'Price Premium', value: pricePremium, setter: setPricePremium, min: 0, max: 30, unit: '%', display: `+${pricePremium[0]}%` },
                { label: 'Washery Utilization', value: washeryUtil, setter: setWasheryUtil, min: 40, max: 95, unit: '%', display: `${washeryUtil[0]}%` },
              ].map((param) => (
                <div key={param.label}>
                  <div className="flex items-center justify-between mb-3">
                    <Label>{param.label}</Label>
                    <Badge variant="default">{param.display}</Badge>
                  </div>
                  <Slider
                    value={param.value}
                    onValueChange={param.setter}
                    min={param.min}
                    max={param.max}
                    step={1}
                  />
                  <p className="text-xs text-muted-foreground mt-1">{param.unit}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div className="lg:col-span-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
          <Stack>
            <Card className="glass-card-hover">
              <CardHeader>
                <CardTitle>Baseline vs Scenario Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <ScenarioChart data={chartData} />
              </CardContent>
            </Card>

            <Card className="glass-card-hover">
            <CardHeader>
              <CardTitle>Scenario Analysis Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-5">
                {[
                  { label: 'Production Change', value: `${((scenario.production / baseline.production - 1) * 100).toFixed(1)}%`, desc: 'vs current annual output' },
                  { label: 'Revenue Change', value: `${((scenario.revenue / baseline.revenue - 1) * 100).toFixed(1)}%`, desc: 'projected FY26 impact' },
                  { label: 'Quality Delta', value: `${scenario.gcv - baseline.gcv > 0 ? '+' : ''}${scenario.gcv - baseline.gcv} kcal/kg`, desc: 'GCV improvement' },
                  { label: 'Cost Efficiency', value: `${((1 - scenario.cost / scenario.revenue) * 100).toFixed(1)}%`, desc: 'operating margin' },
                ].map((item) => (
                  <div key={item.label} className="p-4 rounded-lg bg-card-muted border border-border">
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-xl font-bold text-foreground mt-1">{item.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
            </Card>
          </Stack>
        </motion.div>
      </ContentGrid>
    </PageShell>
  )
}
