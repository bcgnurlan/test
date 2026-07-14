import { Badge } from '@/components/ui/badge'
import { statusConfig, tasks } from '@/lib/data'
import { cn } from '@/lib/utils'

const weekDays = ['B.e', 'Ç.a', 'Ç', 'C.a', 'C', 'Ş', 'B']

export default function CalendarPage() {
  const year = 2026
  const month = 6 // Iyul (0-indexed)
  const firstDay = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  // Monday-first offset
  const offset = (firstDay.getDay() + 6) % 7
  const cells: Array<number | null> = [
    ...Array.from({ length: offset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  const tasksByDay = new Map<number, typeof tasks>()
  for (const task of tasks) {
    const d = new Date(task.dueDate)
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate()
      tasksByDay.set(day, [...(tasksByDay.get(day) ?? []), task])
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold">İyul 2026</h2>
        <Badge variant="secondary">{tasks.length} tapşırıq</Badge>
      </div>
      <div className="overflow-hidden rounded-lg border">
        <div className="grid grid-cols-7 border-b bg-muted/50">
          {weekDays.map((d) => (
            <div key={d} className="px-2 py-2 text-center text-xs font-medium text-muted-foreground">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {cells.map((day, i) => {
            const dayTasks = day ? (tasksByDay.get(day) ?? []) : []
            const isToday = day === 14
            return (
              <div
                key={i}
                className={cn(
                  'flex min-h-24 flex-col gap-1 border-b border-r p-1.5 [&:nth-child(7n)]:border-r-0',
                  day === null && 'bg-muted/30'
                )}
              >
                {day !== null && (
                  <>
                    <span
                      className={cn(
                        'flex size-6 items-center justify-center rounded-full text-xs tabular-nums',
                        isToday
                          ? 'bg-primary font-semibold text-primary-foreground'
                          : 'text-muted-foreground'
                      )}
                    >
                      {day}
                    </span>
                    {dayTasks.slice(0, 2).map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center gap-1 truncate rounded bg-accent px-1.5 py-0.5 text-xs text-accent-foreground"
                        title={task.title}
                      >
                        <span
                          className={cn('size-1.5 shrink-0 rounded-full', statusConfig[task.status].dot)}
                          aria-hidden="true"
                        />
                        <span className="truncate">{task.key}</span>
                      </div>
                    ))}
                    {dayTasks.length > 2 && (
                      <span className="px-1.5 text-xs text-muted-foreground">
                        +{dayTasks.length - 2} daha
                      </span>
                    )}
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
