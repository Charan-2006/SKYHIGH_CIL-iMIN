import { cn } from '@/lib/utils'

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {}

export function Table({ className, ...props }: TableProps) {
  return (
    <div className="relative w-full overflow-auto">
      <table className={cn('w-full caption-bottom text-sm', className)} {...props} />
    </div>
  )
}

export function TableHeader({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn('[&_tr]:border-b border-border bg-card-muted/60', className)} {...props} />
}

export function TableBody({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn('[&_tr:last-child]:border-0', className)} {...props} />
}

export function TableRow({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn(
        'border-b border-border transition-colors hover:bg-card-muted/50',
        className
      )}
      {...props}
    />
  )
}

export function TableHead({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        'h-12 px-4 text-left align-middle text-xs font-semibold uppercase tracking-wider text-muted-foreground',
        className
      )}
      {...props}
    />
  )
}

export function TableCell({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn('px-4 py-4 align-middle text-foreground-secondary', className)} {...props} />
}
