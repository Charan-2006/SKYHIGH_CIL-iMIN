import { cn } from '@/lib/utils'

interface PageShellProps {
  children: React.ReactNode
  className?: string
}

/** Consistent vertical rhythm between page header, metric rows, and content blocks */
export function PageShell({ children, className }: PageShellProps) {
  return (
    <div className={cn('flex w-full flex-col gap-7', className)}>
      {children}
    </div>
  )
}

interface MetricGridProps {
  children: React.ReactNode
  columns?: 2 | 3 | 4 | 6
  className?: string
}

const columnClasses = {
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
  4: 'sm:grid-cols-2 xl:grid-cols-4',
  6: 'grid-cols-2 md:grid-cols-3 xl:grid-cols-6',
}

export function MetricGrid({ children, columns = 4, className }: MetricGridProps) {
  return (
    <div className={cn('grid gap-5 items-stretch', columnClasses[columns], className)}>
      {children}
    </div>
  )
}

interface ContentGridProps {
  children: React.ReactNode
  columns?: 1 | 2 | 3
  className?: string
}

const contentColumnClasses = {
  1: 'grid-cols-1',
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
}

export function ContentGrid({ children, columns = 2, className }: ContentGridProps) {
  return (
    <div className={cn('grid gap-6 items-start', contentColumnClasses[columns], className)}>
      {children}
    </div>
  )
}

interface StackProps {
  children: React.ReactNode
  className?: string
}

export function Stack({ children, className }: StackProps) {
  return <div className={cn('flex flex-col gap-5', className)}>{children}</div>
}
