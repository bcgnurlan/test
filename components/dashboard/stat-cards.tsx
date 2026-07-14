import { CircleCheck, CircleDot, Clock, TriangleAlert } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { tasks } from '@/lib/data'

export function StatCards() {
  const inProgress = tasks.filter((t) => t.status === 'in-progress').length
  const done = tasks.filter((t) => t.status === 'done').length
  const review = tasks.filter((t) => t.status === 'review').length
  const urgent = tasks.filter((t) => t.priority === 'urgent' && t.status !== 'done').length

  const stats = [
    { title: 'İcrada olan', value: inProgress, icon: CircleDot, delta: '+2 bu həftə' },
    { title: 'Tamamlanan', value: done, icon: CircleCheck, delta: '+5 bu həftə' },
    { title: 'Nəzərdən keçirilən', value: review, icon: Clock, delta: '2 gözləyir' },
    { title: 'Təcili', value: urgent, icon: TriangleAlert, delta: 'Diqqət tələb edir' },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className="size-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent className="flex items-end justify-between gap-2">
            <span className="text-3xl font-semibold tabular-nums">{stat.value}</span>
            <Badge variant="secondary" className="font-normal">
              {stat.delta}
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
