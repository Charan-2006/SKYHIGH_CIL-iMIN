import { motion } from 'framer-motion'
import {
  TrendingUp,
  Flame,
  Droplets,
  IndianRupee,
  Target,
  Layers,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MapPin,
  Zap,
} from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { PageShell, MetricGrid, ContentGrid } from '@/components/common/PageShell'
import { StatCard } from '@/components/ui/stat-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import {
  ChartCard,
  QualityTrendChart,
  MineComparisonChart,
  RevenueChart,
} from '@/components/charts/ChartComponents'
import {
  kpiData,
  qualityTrendData,
  mineComparisonData,
  predictionConfidenceData,
  revenueData,
  recentRecommendations,
  systemHealth,
} from '@/data/mockData'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const statusVariant = (status: string) => {
  if (status === 'Approved' || status === 'healthy') return 'success' as const
  if (status === 'Pending Review' || status === 'warning') return 'warning' as const
  if (status === 'In Progress') return 'default' as const
  return 'secondary' as const
}

const opsHighlights = [
  { label: 'Active Mines', value: '352', icon: MapPin },
  { label: 'Live Sensors', value: '18,420', icon: Zap },
  { label: 'Models Running', value: '5/5', icon: Activity },
  { label: 'Last Sync', value: '2 min ago', icon: Clock },
]

export default function DashboardPage() {
  return (
    <PageShell>
      <PageHeader
        title="Executive Dashboard"
        description="Real-time overview of coal production, quality metrics, and AI-driven insights across all subsidiaries."
      >
        <Button variant="secondary" size="sm">Export Report</Button>
        <Button size="sm">Generate Insights</Button>
      </PageHeader>

      <MetricGrid columns={4}>
        {opsHighlights.map((item) => (
          <div key={item.label} className="flex items-center gap-4 rounded-xl border border-border bg-white px-5 py-4 shadow-sm h-full">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-light">
              <item.icon className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="text-sm font-semibold text-foreground mt-0.5">{item.value}</p>
            </div>
          </div>
        ))}
      </MetricGrid>

      <MetricGrid columns={6}>
        <StatCard title="Total Production" value={kpiData.totalProduction.value} unit="Million Tonnes" change={kpiData.totalProduction.change} trend={kpiData.totalProduction.trend} icon={<TrendingUp className="h-3.5 w-3.5" />} />
        <StatCard title="Average GCV" value={kpiData.avgGcv.value.toLocaleString('en-IN')} unit="kcal/kg" change={kpiData.avgGcv.change} trend={kpiData.avgGcv.trend} icon={<Flame className="h-3.5 w-3.5" />} />
        <StatCard title="Ash Content" value={kpiData.ashContent.value} unit="%" change={kpiData.ashContent.change} trend={kpiData.ashContent.trend} icon={<Droplets className="h-3.5 w-3.5" />} />
        <StatCard title="Revenue (FY26)" value="₹1,42,850" unit="Crores" change={kpiData.revenue.change} trend={kpiData.revenue.trend} icon={<IndianRupee className="h-3.5 w-3.5" />} />
        <StatCard title="Prediction Accuracy" value={`${kpiData.predictionAccuracy.value}%`} change={kpiData.predictionAccuracy.change} trend={kpiData.predictionAccuracy.trend} icon={<Target className="h-3.5 w-3.5" />} />
        <StatCard title="Active Blends" value={kpiData.activeBlends.value} unit="Active Blends" change={kpiData.activeBlends.change} trend={kpiData.activeBlends.trend} icon={<Layers className="h-3.5 w-3.5" />} />
      </MetricGrid>

      <ContentGrid columns={2}>
        <motion.div className="h-full min-h-[360px]" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <ChartCard title="Quality Trends — GCV, Ash & Moisture" className="h-full">
            <QualityTrendChart data={qualityTrendData} />
          </ChartCard>
        </motion.div>
        <motion.div className="h-full min-h-[360px]" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <ChartCard title="Mine Comparison — GCV & Production" className="h-full">
            <MineComparisonChart data={mineComparisonData} />
          </ChartCard>
        </motion.div>
      </ContentGrid>

      <ContentGrid columns={3}>
        <motion.div className="lg:col-span-2 h-full min-h-[360px]" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <ChartCard title="Revenue vs Target & Cost" className="h-full">
            <RevenueChart data={revenueData} />
          </ChartCard>
        </motion.div>
        <motion.div className="h-full" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card className="glass-card-hover h-full flex flex-col">
            <CardHeader>
              <CardTitle>Prediction Confidence</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 space-y-5">
              {predictionConfidenceData.map((model) => (
                <div key={model.model}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-foreground-secondary truncate pr-2">{model.model}</span>
                    <span className="text-sm font-semibold text-primary shrink-0">{model.confidence}%</span>
                  </div>
                  <Progress value={model.confidence} indicatorClassName={model.confidence >= 93 ? 'bg-accent' : 'bg-primary'} />
                  <p className="text-[10px] text-muted-foreground mt-1.5">{model.lastUpdated}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </ContentGrid>

      <ContentGrid columns={2}>
        <motion.div className="h-full" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="glass-card-hover h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Recommendations</CardTitle>
              <Button variant="ghost" size="sm">View All</Button>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              {recentRecommendations.map((rec) => (
                <div key={rec.id} className="flex items-start gap-4 p-4 rounded-lg bg-card-muted border border-border hover:border-sky-200 transition-colors">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-light">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="text-[10px] text-muted-foreground font-mono">{rec.id}</span>
                      <Badge variant={rec.impact === 'High' ? 'warning' : 'secondary'}>{rec.impact}</Badge>
                    </div>
                    <p className="text-sm font-medium text-foreground leading-snug">{rec.title}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="text-xs text-accent font-medium">{rec.estimatedGain}</span>
                      <Badge variant={statusVariant(rec.status)}>{rec.status}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div className="h-full" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <Card className="glass-card-hover h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                System Health
              </CardTitle>
              <Badge variant="success">All Systems Operational</Badge>
            </CardHeader>
            <CardContent className="flex-1 px-0 pb-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Component</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Uptime</TableHead>
                    <TableHead>Latency</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {systemHealth.map((item) => (
                    <TableRow key={item.component}>
                      <TableCell className="font-medium text-sm">{item.component}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariant(item.status)} className="gap-1">
                          {item.status === 'healthy' ? <CheckCircle2 className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.uptime}%</TableCell>
                      <TableCell>{item.latency}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      </ContentGrid>
    </PageShell>
  )
}
