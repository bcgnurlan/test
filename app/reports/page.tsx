import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { WeeklyChart } from '@/components/dashboard/weekly-chart'
import { projects, statusConfig, statusOrder, tasks } from '@/lib/data'
import { cn } from '@/lib/utils'

export default function ReportsPage() {
  const total = tasks.length

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold">Hesabatlar</h2>
        <p className="text-sm text-muted-foreground">Komanda performansının icmalı.</p>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <WeeklyChart />
        <Card>
          <CardHeader>
            <CardTitle>Status üzrə bölgü</CardTitle>
            <CardDescription>Bütün tapşırıqların statuslara görə paylanması</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-4">
              {statusOrder.map((status) => {
                const count = tasks.filter((t) => t.status === status).length
                const pct = Math.round((count / total) * 100)
                return (
                  <li key={status} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-2 text-sm">
                        <span
                          className={cn('size-2 rounded-full', statusConfig[status].dot)}
                          aria-hidden="true"
                        />
                        {statusConfig[status].label}
                      </span>
                      <span className="text-sm tabular-nums text-muted-foreground">
                        {count} · {pct}%
                      </span>
                    </div>
                    <Progress value={pct} className="h-1.5" />
                  </li>
                )
              })}
            </ul>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Layihələr üzrə yük</CardTitle>
            <CardDescription>Hər layihədəki aktiv tapşırıq sayı</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {projects.map((project) => {
                const count = tasks.filter((t) => t.projectId === project.id).length
                return (
                  <div key={project.id} className="flex flex-col gap-2 rounded-lg border p-4">
                    <div className="flex items-center gap-2">
                      <span className={cn('size-2.5 rounded-sm', project.color)} aria-hidden="true" />
                      <span className="text-sm font-medium">{project.name}</span>
                    </div>
                    <span className="text-2xl font-semibold tabular-nums">{project.taskCount}</span>
                    <span className="text-xs text-muted-foreground">
                      {count} tapşırıq bu siyahıda
                    </span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
