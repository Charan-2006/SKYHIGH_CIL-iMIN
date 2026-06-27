import { motion } from 'framer-motion'
import { TrendingDown, TrendingUp, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'

interface StatCardProps {
  title: string
  value: string | number
  unit?: string
  change?: number
  trend?: 'up' | 'down' | 'neutral'
  icon?: React.ReactNode
  delay?: number
  className?: string
}

export function StatCard({ title, value, unit, change, trend, icon, delay = 0, className }: StatCardProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus
  const trendColor = trend === 'up' ? 'text-accent' : trend === 'down' ? 'text-danger' : 'text-muted-foreground'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="h-full"
    >
      <Card className={cn('glass-card-hover h-full p-5 flex flex-col gap-3', className)}>
        <div className="flex items-start justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground leading-snug">{title}</p>
          {icon && (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
              {icon}
            </div>
          )}
        </div>

        <div>
          <p className="text-xl font-bold text-foreground tracking-tight leading-none sm:text-2xl">{value}</p>
          {unit && <p className="text-xs text-muted-foreground mt-1.5">{unit}</p>}
        </div>

        {change !== undefined && (
          <div className={cn('flex items-center gap-1.5 text-xs font-medium pt-3 mt-auto border-t border-border', trendColor)}>
            <TrendIcon className="h-3.5 w-3.5 shrink-0" />
            <span>{change > 0 ? '+' : ''}{change}%</span>
            <span className="text-muted-foreground font-normal">vs last month</span>
          </div>
        )}
      </Card>
    </motion.div>
  )
}
