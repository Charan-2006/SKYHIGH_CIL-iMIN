import { motion } from 'framer-motion'
import { Users, Shield, Brain, Bell, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { PageShell } from '@/components/common/PageShell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { users, roles, aiModels } from '@/data/mockData'

export default function SettingsPage() {
  return (
    <PageShell>
      <PageHeader
        title="Settings"
        description="Manage users, roles, AI configuration, and notification preferences."
      />

      <Tabs defaultValue="users" className="flex flex-col gap-6">
        <TabsList>
          <TabsTrigger value="users" className="gap-2"><Users className="h-4 w-4" /> Users</TabsTrigger>
          <TabsTrigger value="roles" className="gap-2"><Shield className="h-4 w-4" /> Roles</TabsTrigger>
          <TabsTrigger value="ai" className="gap-2"><Brain className="h-4 w-4" /> AI Configuration</TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2"><Bell className="h-4 w-4" /> Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="glass-card-hover">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>User Management</CardTitle>
                <Button size="sm">Add User</Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Mine</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Login</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell><Badge variant="default">{user.role}</Badge></TableCell>
                        <TableCell>{user.mine}</TableCell>
                        <TableCell>
                          <Badge variant={user.status === 'Active' ? 'success' : 'secondary'}>{user.status}</Badge>
                        </TableCell>
                        <TableCell className="text-xs">{user.lastLogin}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="roles">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {roles.map((role) => (
                <Card key={role.name} className="glass-card-hover p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-foreground">{role.name}</h3>
                    <Badge variant="secondary">{role.users} users</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{role.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{role.permissions} permissions</span>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="ai">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <Card className="glass-card-hover">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Model Status</CardTitle>
                <Button variant="secondary" size="sm"><RefreshCw className="h-4 w-4" /> Retrain All</Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Model</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Accuracy</TableHead>
                      <TableHead>Last Trained</TableHead>
                      <TableHead>Data Points</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {aiModels.map((model) => (
                      <TableRow key={model.name}>
                        <TableCell className="font-medium font-mono text-sm">{model.name}</TableCell>
                        <TableCell>{model.type}</TableCell>
                        <TableCell>
                          <Badge variant={model.status === 'Active' ? 'success' : 'warning'} className="gap-1">
                            {model.status === 'Active' ? <CheckCircle2 className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                            {model.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={model.accuracy} className="w-16" />
                            <span className="text-sm">{model.accuracy}%</span>
                          </div>
                        </TableCell>
                        <TableCell>{model.lastTrained}</TableCell>
                        <TableCell>{model.dataPoints}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">Retrain</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="glass-card-hover">
              <CardHeader>
                <CardTitle>Retraining Schedule</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {[
                  { model: 'GCV-XGBoost-v3.2', schedule: 'Weekly — Sundays 02:00 IST', next: '2026-06-29 02:00 IST' },
                  { model: 'Blend-DQN-v1.4', schedule: 'Bi-weekly — 1st & 15th', next: '2026-07-01 02:00 IST' },
                  { model: 'Revenue-LSTM-v2.0', schedule: 'Monthly — 1st of month', next: '2026-07-01 03:00 IST' },
                ].map((item) => (
                  <div key={item.model} className="flex items-center justify-between p-4 rounded-lg bg-card-muted border border-border">
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.model}</p>
                      <p className="text-xs text-muted-foreground mt-1">{item.schedule}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Next run</p>
                      <p className="text-sm text-primary">{item.next}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="notifications">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="glass-card-hover">
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { label: 'Quality Alert Threshold Breach', desc: 'Notify when GCV or ash exceeds configured limits', default: true },
                  { label: 'AI Recommendation Generated', desc: 'New decision intelligence recommendations', default: true },
                  { label: 'Model Retraining Complete', desc: 'Notification when scheduled retraining finishes', default: true },
                  { label: 'System Health Degradation', desc: 'Alert when component uptime drops below 99%', default: true },
                  { label: 'Daily Executive Summary', desc: 'Email digest of key KPIs and recommendations', default: false },
                  { label: 'Blend Optimization Results', desc: 'Notify when optimal blend configuration changes', default: true },
                ].map((notif) => (
                  <div key={notif.label} className="flex items-center justify-between p-4 rounded-lg bg-card-muted border border-border">
                    <div>
                      <Label className="text-sm font-medium text-foreground">{notif.label}</Label>
                      <p className="text-xs text-muted-foreground mt-1">{notif.desc}</p>
                    </div>
                    <Switch defaultChecked={notif.default} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </PageShell>
  )
}
