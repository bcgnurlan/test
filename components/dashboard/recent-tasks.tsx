import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AssigneeAvatar, StatusBadge } from '@/components/task-meta'
import { formatDate, tasks } from '@/lib/data'

export function RecentTasks() {
  const recent = tasks.filter((t) => t.status !== 'done').slice(0, 6)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex flex-col gap-1">
          <CardTitle>Aktiv tapşırıqlar</CardTitle>
          <CardDescription>Davam edən işlərin icmalı</CardDescription>
        </div>
        <Button variant="ghost" size="sm" render={<Link href="/tasks" />}>
          Hamısı
          <ArrowRight data-icon="inline-end" />
        </Button>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col">
          {recent.map((task) => (
            <li
              key={task.id}
              className="flex items-center gap-3 border-b py-3 last:border-b-0 last:pb-0 first:pt-0"
            >
              <span className="w-16 shrink-0 font-mono text-xs text-muted-foreground">
                {task.key}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm">{task.title}</span>
              <span className="hidden shrink-0 text-xs text-muted-foreground sm:inline">
                {formatDate(task.dueDate)}
              </span>
              <div className="hidden shrink-0 md:block">
                <StatusBadge status={task.status} />
              </div>
              <AssigneeAvatar userId={task.assigneeId} />
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
