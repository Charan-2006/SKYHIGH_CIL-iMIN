import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'

interface MetricCardProps {
  icon: React.ReactNode
  value: string | number
  label: string
  className?: string
}

export function MetricCard({ icon, value, label, className }: MetricCardProps) {
  return (
    <Card className={cn('glass-card-hover p-5 h-full', className)}>
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-2xl font-bold text-foreground leading-tight">{value}</p>
          <p className="text-sm text-muted-foreground mt-1">{label}</p>
        </div>
      </div>
    </Card>
  )
}
