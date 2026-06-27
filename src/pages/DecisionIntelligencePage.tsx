import { motion } from 'framer-motion'
import { Lightbulb, TrendingUp, CheckCircle2, ArrowRight } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { PageShell, MetricGrid, Stack } from '@/components/common/PageShell'
import { MetricCard } from '@/components/common/MetricCard'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { aiRecommendations } from '@/data/mockData'

const priorityVariant = (p: string) => {
  if (p === 'Critical') return 'danger' as const
  if (p === 'High') return 'warning' as const
  return 'default' as const
}

const riskVariant = (r: string) => {
  if (r === 'Low') return 'success' as const
  if (r === 'Medium') return 'warning' as const
  return 'danger' as const
}

export default function DecisionIntelligencePage() {
  return (
    <PageShell>
      <PageHeader
        title="Decision Intelligence"
        description="AI-generated recommendations with quantified business impact, risk analysis, and operational guidance."
      >
        <Button variant="secondary" size="sm">Filter</Button>
        <Button size="sm">Generate New Insights</Button>
      </PageHeader>

      <MetricGrid columns={3}>
        <MetricCard label="Active Recommendations" value="24" icon={<Lightbulb className="h-5 w-5" />} />
        <MetricCard label="Potential Monthly Gain" value="₹43.7 Cr" icon={<TrendingUp className="h-5 w-5" />} />
        <MetricCard label="Avg. Confidence" value="91.4%" icon={<CheckCircle2 className="h-5 w-5" />} />
      </MetricGrid>

      <Stack>
        {aiRecommendations.map((rec, i) => (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="glass-card-hover overflow-hidden">
              <div className="flex flex-col lg:flex-row">
                <div className="flex-1 p-6 lg:p-8 space-y-5">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-xs font-mono text-muted-foreground">{rec.id}</span>
                    <Badge variant={priorityVariant(rec.priority)}>{rec.priority}</Badge>
                    <Badge variant={riskVariant(rec.risk)}>Risk: {rec.risk}</Badge>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">{rec.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{rec.description}</p>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-accent-light border border-emerald-200">
                      <p className="text-xs text-muted-foreground">Revenue Impact</p>
                      <p className="text-lg font-bold text-accent mt-1.5">{rec.impact.revenue}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-warning-light border border-amber-200">
                      <p className="text-xs text-muted-foreground">Cost Impact</p>
                      <p className="text-lg font-bold text-warning mt-1.5">{rec.impact.cost}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-primary-light border border-sky-200">
                      <p className="text-xs text-muted-foreground">Net Impact</p>
                      <p className="text-lg font-bold text-primary mt-1.5">{rec.impact.net}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-foreground-secondary mb-3">Operational Actions</p>
                    <div className="flex flex-wrap gap-2">
                      {rec.actions.map((action) => (
                        <Badge key={action} variant="secondary">{action}</Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="lg:w-80 p-6 lg:p-8 bg-card-muted border-t lg:border-t-0 lg:border-l border-border flex flex-col gap-6">
                  <div>
                    <p className="text-sm font-medium text-foreground-secondary mb-4">Confidence Score</p>
                    <div className="text-center mb-4">
                      <span className="text-4xl font-bold text-primary">{rec.confidence}%</span>
                    </div>
                    <Progress value={rec.confidence} indicatorClassName={rec.confidence >= 90 ? 'bg-accent' : 'bg-primary'} />
                  </div>

                  <div className="space-y-3 mt-auto">
                    <Button className="w-full" size="sm">
                      Approve & Implement <ArrowRight className="h-4 w-4" />
                    </Button>
                    <Button variant="secondary" className="w-full" size="sm">Request Review</Button>
                    <Button variant="ghost" className="w-full" size="sm">Dismiss</Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </Stack>
    </PageShell>
  )
}
