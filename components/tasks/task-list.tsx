'use client'

import { Badge } from '@/components/ui/badge'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { AssigneeAvatar, PriorityLabel } from '@/components/task-meta'
import {
  formatDate,
  getProject,
  statusConfig,
  statusOrder,
  type Task,
} from '@/lib/data'
import { cn } from '@/lib/utils'

export function TaskList({ tasks }: { tasks: Task[] }) {
  const groups = statusOrder
    .map((status) => ({ status, items: tasks.filter((t) => t.status === status) }))
    .filter((g) => g.items.length > 0)

  if (groups.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>Tapşırıq tapılmadı</EmptyTitle>
          <EmptyDescription>Filtrləri dəyişərək yenidən cəhd edin.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {groups.map((group) => (
        <section key={group.status} aria-label={statusConfig[group.status].label}>
          <header className="flex items-center gap-2 pb-2">
            <span
              className={cn('size-2 rounded-full', statusConfig[group.status].dot)}
              aria-hidden="true"
            />
            <h3 className="text-sm font-medium">{statusConfig[group.status].label}</h3>
            <Badge variant="secondary" className="tabular-nums">
              {group.items.length}
            </Badge>
          </header>
          <ul className="overflow-hidden rounded-lg border">
            {group.items.map((task) => (
              <li
                key={task.id}
                className="flex items-center gap-3 border-b bg-card px-4 py-2.5 last:border-b-0 hover:bg-accent/50"
              >
                <span className="w-16 shrink-0 font-mono text-xs text-muted-foreground">
                  {task.key}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm font-medium">{task.title}</span>
                <div className="hidden shrink-0 lg:block">
                  <PriorityLabel priority={task.priority} />
                </div>
                <Badge variant="secondary" className="hidden shrink-0 font-normal md:inline-flex">
                  {getProject(task.projectId).name}
                </Badge>
                <span className="hidden shrink-0 text-xs text-muted-foreground sm:inline">
                  {formatDate(task.dueDate)}
                </span>
                <AssigneeAvatar userId={task.assigneeId} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
