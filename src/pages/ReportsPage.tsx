import { motion } from 'framer-motion'
import { FileText, Download, Eye, Calendar, HardDrive } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { PageShell, ContentGrid } from '@/components/common/PageShell'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { reports } from '@/data/mockData'

const typeVariant = (type: string) => {
  const map: Record<string, 'default' | 'success' | 'warning' | 'secondary'> = {
    Production: 'default',
    Analytics: 'success',
    'AI/ML': 'warning',
    Quality: 'secondary',
    Financial: 'success',
    Compliance: 'secondary',
  }
  return map[type] ?? 'secondary'
}

export default function ReportsPage() {
  return (
    <PageShell>
      <PageHeader
        title="Reports"
        description="Professional reports for production, quality, financial, and compliance analytics."
      >
        <Button variant="secondary" size="sm">Schedule Report</Button>
        <Button size="sm">Generate Custom Report</Button>
      </PageHeader>

      <ContentGrid columns={3} className="md:grid-cols-2 xl:grid-cols-3">
        {reports.map((report, i) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className="glass-card-hover overflow-hidden group">
              <div className="h-32 bg-gradient-to-br from-primary-light via-white to-accent-light flex items-center justify-center border-b border-border">
                <FileText className="h-12 w-12 text-primary/40 group-hover:text-primary/60 transition-colors" />
              </div>
              <CardContent className="p-6 pt-2">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-mono text-muted-foreground">{report.id}</span>
                  <Badge variant={typeVariant(report.type)}>{report.type}</Badge>
                  <Badge variant="outline">{report.format}</Badge>
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2 leading-snug">{report.title}</h3>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-5">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{report.period}</span>
                  <span className="flex items-center gap-1"><HardDrive className="h-3 w-3" />{report.size}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-5">Generated: {report.generated}</p>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" className="flex-1">
                    <Eye className="h-4 w-4" /> Preview
                  </Button>
                  <Button size="sm" className="flex-1">
                    <Download className="h-4 w-4" /> Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </ContentGrid>
    </PageShell>
  )
}
