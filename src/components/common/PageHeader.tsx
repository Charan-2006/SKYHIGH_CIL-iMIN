import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  description?: string
  children?: React.ReactNode
  className?: string
}

export function PageHeader({ title, description, children, className }: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex flex-col gap-5 rounded-xl border border-border bg-white px-6 py-6 shadow-sm sm:flex-row sm:items-center sm:justify-between',
        className
      )}
    >
      <div className="min-w-0 flex-1">
        <h1 className="text-xl font-bold text-foreground tracking-tight sm:text-2xl">{title}</h1>
        {description && (
          <p className="mt-2.5 text-sm text-muted-foreground leading-relaxed max-w-3xl">{description}</p>
        )}
      </div>
      {children && (
        <div className="flex flex-wrap items-center gap-3 shrink-0">{children}</div>
      )}
    </motion.div>
  )
}
