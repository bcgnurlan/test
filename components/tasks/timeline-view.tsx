'use client'

import * as React from 'react'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { AssigneeAvatar } from '@/components/task-meta'
import { getProject, statusConfig, type Task } from '@/lib/data'
import { useTaskStore } from '@/lib/store'
import { cn } from '@/lib/utils'

const DAY_MS = 86400000
const DAY_WIDTH = 36

const barColors: Record<Task['status'], string> = {
  backlog: 'bg-muted-foreground/40',
  todo: 'bg-chart-5',
  'in-progress': 'bg-chart-1',
  review: 'bg-chart-3',
  done: 'bg-chart-2',
}

function startOfDay(d: Date) {
  const c = new Date(d)
  c.setHours(0, 0, 0, 0)
  return c
}

/** Deterministically derive a start date a few days before the due date. */
function taskStart(task: Task): Date {
  const due = startOfDay(new Date(task.dueDate))
  let hash = 0
  for (const ch of task.id) hash = (hash * 31 + ch.charCodeAt(0)) % 997
  const span = 3 + (hash % 6)
  return new Date(due.getTime() - span * DAY_MS)
}

export function TimelineView({ tasks }: { tasks: Task[] }) {
  const openTask = useTaskStore((s) => s.openTask)

  const range = React.useMemo(() => {
    if (tasks.length === 0) return null
    let min = Number.POSITIVE_INFINITY
    let max = Number.NEGATIVE_INFINITY
    for (const t of tasks) {
      min = Math.min(min, taskStart(t).getTime())
      max = Math.max(max, startOfDay(new Date(t.dueDate)).getTime())
    }
    const start = new Date(min - 2 * DAY_MS)
    const end = new Date(max + 3 * DAY_MS)
    const days: Date[] = []
    for (let d = start.getTime(); d <= end.getTime(); d += DAY_MS) {
      days.push(new Date(d))
    }
    return { start, days }
  }, [tasks])

  if (!range) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>Tapşırıq tapılmadı</EmptyTitle>
          <EmptyDescription>Filtrləri dəyişərək yenidən cəhd edin.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  const today = startOfDay(new Date()).getTime()
  const todayIndex = range.days.findIndex((d) => d.getTime() === today)
  const gridWidth = range.days.length * DAY_WIDTH

  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="flex">
        {/* Left column: task labels */}
        <div className="w-56 shrink-0 border-r md:w-72">
          <div className="flex h-10 items-center border-b bg-muted/50 px-3 text-xs font-medium">
            Tapşırıq
          </div>
          {tasks.map((task) => (
            <button
              key={task.id}
              type="button"
              onClick={() => openTask(task.id)}
              className="flex h-11 w-full items-center gap-2 border-b px-3 text-left last:border-b-0 hover:bg-accent/50"
            >
              <span className="hidden shrink-0 font-mono text-[10px] text-muted-foreground md:inline">
                {task.key}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm">{task.title}</span>
              <AssigneeAvatar userId={task.assigneeId} className="size-5 shrink-0" />
            </button>
          ))}
        </div>

        {/* Right: scrollable timeline */}
        <div className="min-w-0 flex-1 overflow-x-auto">
          <div style={{ width: gridWidth }} className="relative">
            {/* Date header */}
            <div className="flex h-10 border-b bg-muted/50">
              {range.days.map((d, i) => {
                const isWeekend = d.getDay() === 0 || d.getDay() === 6
                return (
                  <div
                    key={i}
                    style={{ width: DAY_WIDTH }}
                    className={cn(
                      'flex shrink-0 flex-col items-center justify-center border-r text-[10px] leading-tight',
                      isWeekend && 'bg-muted',
                      i === todayIndex && 'bg-primary/10 font-semibold text-primary'
                    )}
                  >
                    <span>{d.toLocaleDateString('az-AZ', { day: 'numeric' })}</span>
                    <span className="text-muted-foreground">
                      {d.toLocaleDateString('az-AZ', { month: 'short' })}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Today marker */}
            {todayIndex >= 0 && (
              <div
                aria-hidden="true"
                className="absolute bottom-0 top-10 z-10 w-px bg-primary"
                style={{ left: todayIndex * DAY_WIDTH + DAY_WIDTH / 2 }}
              />
            )}

            {/* Rows */}
            {tasks.map((task) => {
              const start = taskStart(task)
              const due = startOfDay(new Date(task.dueDate))
              const offsetDays = Math.round((start.getTime() - range.start.getTime()) / DAY_MS)
              const spanDays = Math.max(1, Math.round((due.getTime() - start.getTime()) / DAY_MS) + 1)
              return (
                <div key={task.id} className="relative h-11 border-b last:border-b-0">
                  <button
                    type="button"
                    onClick={() => openTask(task.id)}
                    title={`${task.key}: ${task.title} — ${statusConfig[task.status].label}`}
                    className={cn(
                      'absolute top-1/2 h-6 -translate-y-1/2 cursor-pointer rounded-md px-2 transition-opacity hover:opacity-80',
                      barColors[task.status]
                    )}
                    style={{ left: offsetDays * DAY_WIDTH + 2, width: spanDays * DAY_WIDTH - 4 }}
                  >
                    <span className="block truncate text-left text-[10px] font-medium leading-6 text-background">
                      {getProject(task.projectId).key}-{task.title.slice(0, 24)}
                    </span>
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
