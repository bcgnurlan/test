'use client'

import * as React from 'react'
import { MessageSquare, SquareCheck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { AssigneeAvatar, PriorityLabel } from '@/components/task-meta'
import {
  formatDate,
  statusConfig,
  statusOrder,
  type Task,
  type TaskStatus,
} from '@/lib/data'
import { cn } from '@/lib/utils'

interface KanbanBoardProps {
  tasks: Task[]
  onMoveTask: (taskId: string, status: TaskStatus) => void
}

export function KanbanBoard({ tasks, onMoveTask }: KanbanBoardProps) {
  const [dragOver, setDragOver] = React.useState<TaskStatus | null>(null)

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {statusOrder.map((status) => {
        const columnTasks = tasks.filter((t) => t.status === status)
        return (
          <section
            key={status}
            aria-label={statusConfig[status].label}
            className={cn(
              'flex w-72 shrink-0 flex-col gap-2 rounded-lg border bg-muted/40 p-2 transition-colors',
              dragOver === status && 'border-primary/50 bg-accent'
            )}
            onDragOver={(e) => {
              e.preventDefault()
              setDragOver(status)
            }}
            onDragLeave={() => setDragOver(null)}
            onDrop={(e) => {
              e.preventDefault()
              setDragOver(null)
              const taskId = e.dataTransfer.getData('text/plain')
              if (taskId) onMoveTask(taskId, status)
            }}
          >
            <header className="flex items-center gap-2 px-2 py-1">
              <span
                className={cn('size-2 rounded-full', statusConfig[status].dot)}
                aria-hidden="true"
              />
              <h3 className="text-sm font-medium">{statusConfig[status].label}</h3>
              <Badge variant="secondary" className="ml-auto tabular-nums">
                {columnTasks.length}
              </Badge>
            </header>
            <div className="flex flex-col gap-2">
              {columnTasks.map((task) => (
                <Card
                  key={task.id}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('text/plain', task.id)}
                  className="cursor-grab gap-2 p-3 transition-shadow hover:shadow-md active:cursor-grabbing"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs text-muted-foreground">{task.key}</span>
                    <AssigneeAvatar userId={task.assigneeId} className="size-5" />
                  </div>
                  <p className="text-sm font-medium leading-snug text-pretty">{task.title}</p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <PriorityLabel priority={task.priority} />
                    <span className="text-xs text-muted-foreground">{formatDate(task.dueDate)}</span>
                    {task.comments > 0 && (
                      <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                        <MessageSquare className="size-3" aria-hidden="true" />
                        {task.comments}
                      </span>
                    )}
                    {task.subtasks.total > 0 && (
                      <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                        <SquareCheck className="size-3" aria-hidden="true" />
                        {task.subtasks.done}/{task.subtasks.total}
                      </span>
                    )}
                  </div>
                </Card>
              ))}
              {columnTasks.length === 0 && (
                <p className="rounded-md border border-dashed px-3 py-6 text-center text-xs text-muted-foreground">
                  Tapşırıq yoxdur
                </p>
              )}
            </div>
          </section>
        )
      })}
    </div>
  )
}
