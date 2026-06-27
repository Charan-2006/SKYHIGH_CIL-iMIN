import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary-light text-primary border border-sky-200',
        success: 'bg-accent-light text-accent border border-emerald-200',
        warning: 'bg-warning-light text-warning border border-amber-200',
        danger: 'bg-danger-light text-danger border border-red-200',
        secondary: 'bg-card-muted text-foreground-secondary border border-border',
        outline: 'border border-border text-muted-foreground bg-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
