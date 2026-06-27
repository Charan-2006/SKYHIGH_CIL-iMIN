import { useState } from 'react'
import { motion } from 'framer-motion'
import { Brain, Flame, Droplets, Wind, Sparkles, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { PageShell, ContentGrid } from '@/components/common/PageShell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ConfidenceGauge } from '@/components/charts/ChartComponents'
import { coalSeams, explainabilityFactors } from '@/data/mockData'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'

export default function CoalQualityPredictionPage() {
  const [loading, setLoading] = useState(false)
  const [predicted, setPredicted] = useState(true)
  const [form, setForm] = useState({
    mine: 'SECL',
    seam: 'KSW-A',
    depth: '142',
    overburden: '28.5',
    moisture: '6.8',
    ashFusion: '1280',
  })

  const predictions = {
    gcv: { value: 5380, confidence: 96.2, range: '5320–5440' },
    ash: { value: 17.4, confidence: 93.8, range: '16.8–18.0' },
    moisture: { value: 6.5, confidence: 91.5, range: '6.1–6.9' },
    sulphur: { value: 0.44, confidence: 89.7, range: '0.40–0.48' },
  }

  const handlePredict = () => {
    setLoading(true)
    setPredicted(false)
    setTimeout(() => {
      setLoading(false)
      setPredicted(true)
    }, 2000)
  }

  return (
    <PageShell>
      <PageHeader
        title="Coal Quality Prediction"
        description="AI-powered real-time prediction of GCV, ash content, moisture, and sulphur at extraction point."
      >
        <Button variant="secondary" size="sm">Batch Predict</Button>
        <Button size="sm" onClick={handlePredict} disabled={loading}>
          {loading ? <LoadingSpinner size="sm" /> : 'Run Prediction'}
        </Button>
      </PageHeader>

      <ContentGrid columns={3}>
        <motion.div className="lg:sticky lg:top-20" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Card className="glass-card-hover h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Input Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label>Mine / Subsidiary</Label>
                <Input value={form.mine} onChange={(e) => setForm({ ...form, mine: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Coal Seam</Label>
                <Input value={form.seam} onChange={(e) => setForm({ ...form, seam: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label>Seam Depth (m)</Label>
                  <Input value={form.depth} onChange={(e) => setForm({ ...form, depth: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Overburden Ratio</Label>
                  <Input value={form.overburden} onChange={(e) => setForm({ ...form, overburden: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label>Moisture (%)</Label>
                  <Input value={form.moisture} onChange={(e) => setForm({ ...form, moisture: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Ash Fusion Temp (°C)</Label>
                  <Input value={form.ashFusion} onChange={(e) => setForm({ ...form, ashFusion: e.target.value })} />
                </div>
              </div>

              <div className="pt-2">
                <p className="text-xs text-muted-foreground mb-3">Reference Seams</p>
                <div className="space-y-2">
                  {coalSeams.map((seam) => (
                    <div key={seam.id} className="flex items-center justify-between p-2 rounded-lg bg-card-muted text-xs">
                      <span className="text-foreground-secondary">{seam.name}</span>
                      <span className="text-primary font-medium">{seam.gcv} kcal/kg</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="lg:col-span-2 flex flex-col gap-6">
          {loading && (
            <Card className="glass-card p-12 flex items-center justify-center">
              <LoadingSpinner size="lg" label="Running GCV-XGBoost-v3.2 inference..." />
            </Card>
          )}

          {predicted && !loading && (
            <>
              <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
                {[
                  { label: 'Predicted GCV', value: predictions.gcv.value, unit: 'kcal/kg', icon: Flame, confidence: predictions.gcv.confidence, range: predictions.gcv.range },
                  { label: 'Ash Content', value: predictions.ash.value, unit: '%', icon: Droplets, confidence: predictions.ash.confidence, range: predictions.ash.range },
                  { label: 'Moisture', value: predictions.moisture.value, unit: '%', icon: Wind, confidence: predictions.moisture.confidence, range: predictions.moisture.range },
                  { label: 'Sulphur', value: predictions.sulphur.value, unit: '%', icon: Sparkles, confidence: predictions.sulphur.confidence, range: predictions.sulphur.range },
                ].map((pred, i) => (
                  <motion.div key={pred.label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
                    <Card className="glass-card-hover p-5">
                      <div className="flex items-center justify-between mb-3">
                        <pred.icon className="h-5 w-5 text-primary" />
                        <Badge variant="success">{pred.confidence}% conf.</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{pred.label}</p>
                      <p className="text-2xl font-bold text-foreground mt-1">
                        {pred.value}<span className="text-sm font-normal text-muted-foreground ml-1">{pred.unit}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">Range: {pred.range}</p>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="glass-card-hover">
                  <CardHeader>
                    <CardTitle>Confidence Gauge</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ConfidenceGauge value={94.2} label="Overall Confidence" />
                  </CardContent>
                </Card>

                <Card className="glass-card-hover">
                  <CardHeader>
                    <CardTitle>Explainable AI — SHAP Attribution</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    {explainabilityFactors.map((factor) => (
                      <div key={factor.factor}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm text-foreground-secondary flex items-center gap-1.5">
                            {factor.direction === 'positive'
                              ? <ArrowUpRight className="h-3.5 w-3.5 text-accent" />
                              : <ArrowDownRight className="h-3.5 w-3.5 text-danger" />}
                            {factor.factor}
                          </span>
                          <span className="text-sm font-medium text-primary">{factor.contribution}%</span>
                        </div>
                        <Progress value={factor.contribution} indicatorClassName={factor.direction === 'positive' ? 'bg-accent' : 'bg-danger'} />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <Card className="glass-card-hover">
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-5">
                  {[
                    { title: 'Route to Power Sector Contract', desc: 'GCV 5380 kcal/kg meets NTPC Korba Unit-7 specifications. Estimated premium: ₹142/tonne.', tag: 'Dispatch' },
                    { title: 'Enable Washery Processing', desc: 'Ash at 17.4% is borderline for steel sector. Washery can reduce to 14.2% with 94% recovery.', tag: 'Processing' },
                    { title: 'Adjust Extraction Rate', desc: 'Reduce overburden exposure by 12% to improve GCV consistency in next 48 hours.', tag: 'Operations' },
                    { title: 'Blend with JSW-I Seam', desc: 'Mix 25% Jharia Seam I to achieve 5600+ GCV target for premium coking coal contract.', tag: 'Blend' },
                  ].map((rec) => (
                    <div key={rec.title} className="p-4 rounded-lg bg-card-muted border border-border hover:border-sky-200 transition-colors">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="default">{rec.tag}</Badge>
                      </div>
                      <p className="text-sm font-medium text-foreground">{rec.title}</p>
                      <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{rec.desc}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </>
          )}

          {!predicted && !loading && (
            <Card className="glass-card p-8 text-center min-h-[320px] flex flex-col items-center justify-center">
              <Brain className="h-12 w-12 text-primary mb-4 opacity-60" />
              <p className="text-lg font-medium text-foreground">Configure parameters and run prediction</p>
              <p className="text-sm text-muted-foreground mt-2 max-w-md">AI models will analyze seam characteristics and provide quality forecasts with explainability.</p>
              <Button className="mt-6" onClick={handlePredict}>Run Prediction</Button>
            </Card>
          )}
        </div>
      </ContentGrid>
    </PageShell>
  )
}
