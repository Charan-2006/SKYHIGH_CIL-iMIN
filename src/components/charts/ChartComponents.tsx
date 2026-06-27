import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const CHART_COLORS = {
  primary: '#0369A1',
  accent: '#059669',
  warning: '#D97706',
  danger: '#DC2626',
  muted: '#94A3B8',
  purple: '#4F46E5',
}

interface ChartCardProps {
  title: string
  children: React.ReactNode
  className?: string
  action?: React.ReactNode
}

export function ChartCard({ title, children, className, action }: ChartCardProps) {
  return (
    <Card className={cn('glass-card-hover h-full flex flex-col', className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
        <CardTitle>{title}</CardTitle>
        {action}
      </CardHeader>
      <CardContent className="flex-1 min-h-[260px]">{children}</CardContent>
    </Card>
  )
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
  if (!active || !payload) return null
  return (
    <div className="bg-white border border-border rounded-lg px-4 py-3 shadow-lg text-sm">
      <p className="font-medium text-foreground mb-2">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-muted-foreground">
          <span style={{ color: entry.color }}>{entry.name}: </span>
          <span className="text-foreground font-medium">{entry.value}</span>
        </p>
      ))}
    </div>
  )
}

interface QualityTrendChartProps {
  data: Array<{ month: string; gcv: number; ash: number; moisture: number }>
}

export function QualityTrendChart({ data }: QualityTrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="gcvGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.3} />
            <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Area type="monotone" dataKey="gcv" name="GCV (kcal/kg)" stroke={CHART_COLORS.primary} fill="url(#gcvGradient)" strokeWidth={2} />
        <Line type="monotone" dataKey="ash" name="Ash (%)" stroke={CHART_COLORS.warning} strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="moisture" name="Moisture (%)" stroke={CHART_COLORS.accent} strokeWidth={2} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

interface MineComparisonChartProps {
  data: Array<{ name: string; gcv: number; ash: number; production: number }>
}

export function MineComparisonChart({ data }: MineComparisonChartProps) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} barGap={4}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar dataKey="gcv" name="GCV (kcal/kg)" fill={CHART_COLORS.primary} radius={[4, 4, 0, 0]} />
        <Bar dataKey="production" name="Production (MT)" fill={CHART_COLORS.accent} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

interface RevenueChartProps {
  data: Array<{ month: string; revenue: number; target: number; cost: number }>
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line type="monotone" dataKey="revenue" name="Revenue (₹ Cr)" stroke={CHART_COLORS.accent} strokeWidth={2.5} dot={{ r: 3 }} />
        <Line type="monotone" dataKey="target" name="Target (₹ Cr)" stroke={CHART_COLORS.primary} strokeWidth={2} strokeDasharray="5 5" dot={false} />
        <Line type="monotone" dataKey="cost" name="Cost (₹ Cr)" stroke={CHART_COLORS.warning} strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}

interface BlendPieChartProps {
  data: Array<{ seam: string; percentage: number; color: string }>
  height?: number
  compact?: boolean
}

export function BlendPieChart({ data, height = 280, compact = false }: BlendPieChartProps) {
  return (
    <div>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={compact ? 50 : 60}
            outerRadius={compact ? 82 : 100}
            paddingAngle={3}
            dataKey="percentage"
            nameKey="seam"
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          {!compact && <Legend />}
        </PieChart>
      </ResponsiveContainer>
      {compact && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          {data.map((entry) => (
            <div key={entry.seam} className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
              <span className="truncate">{entry.seam}</span>
              <span className="ml-auto font-medium text-foreground">{entry.percentage}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

interface ConfidenceGaugeProps {
  value: number
  label?: string
}

export function ConfidenceGauge({ value, label = 'Confidence' }: ConfidenceGaugeProps) {
  const color = value >= 90 ? CHART_COLORS.accent : value >= 75 ? CHART_COLORS.warning : CHART_COLORS.danger
  const data = [{ name: label, value, fill: color }, { name: 'remaining', value: 100 - value, fill: '#E2E8F0' }]

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="85%"
            startAngle={180}
            endAngle={0}
            innerRadius={70}
            outerRadius={95}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.fill} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
        <span className="text-3xl font-bold text-foreground">{value}%</span>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
    </div>
  )
}

interface ScenarioChartProps {
  data: Array<{ label: string; baseline: number; scenario: number }>
}

export function ScenarioChart({ data }: ScenarioChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar dataKey="baseline" name="Baseline" fill={CHART_COLORS.muted} radius={[4, 4, 0, 0]} />
        <Bar dataKey="scenario" name="Scenario" fill={CHART_COLORS.primary} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

interface RadarQualityChartProps {
  data: Array<{ metric: string; current: number; target: number }>
}

export function RadarQualityChart({ data }: RadarQualityChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart data={data}>
        <PolarGrid stroke="#E2E8F0" />
        <PolarAngleAxis dataKey="metric" tick={{ fill: '#64748B', fontSize: 11 }} />
        <Radar name="Current" dataKey="current" stroke={CHART_COLORS.primary} fill={CHART_COLORS.primary} fillOpacity={0.2} strokeWidth={2} />
        <Radar name="Target" dataKey="target" stroke={CHART_COLORS.accent} fill={CHART_COLORS.accent} fillOpacity={0.1} strokeWidth={2} />
        <Legend />
      </RadarChart>
    </ResponsiveContainer>
  )
}

export { CHART_COLORS }
