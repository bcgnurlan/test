'use client'

import * as React from 'react'
import { GanttChartSquare, Kanban, List, Search, Table2 } from 'lucide-react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import {
  priorityConfig,
  projects,
  statusConfig,
  statusOrder,
} from '@/lib/data'
import { useTaskStore } from '@/lib/store'
import { TaskTable } from '@/components/tasks/task-table'
import { KanbanBoard } from '@/components/tasks/kanban-board'
import { TaskList } from '@/components/tasks/task-list'
import { TimelineView } from '@/components/tasks/timeline-view'

type ViewMode = 'table' | 'board' | 'list' | 'timeline'

export function TasksView() {
  const [view, setView] = React.useState<ViewMode>('table')
  const tasks = useTaskStore((s) => s.tasks)
  const moveTask = useTaskStore((s) => s.moveTask)
  const [query, setQuery] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState('all')
  const [priorityFilter, setPriorityFilter] = React.useState('all')
  const [projectFilter, setProjectFilter] = React.useState('all')

  const filtered = React.useMemo(() => {
    return tasks.filter((t) => {
      if (query && !`${t.key} ${t.title}`.toLowerCase().includes(query.toLowerCase())) return false
      if (statusFilter !== 'all' && t.status !== statusFilter) return false
      if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false
      if (projectFilter !== 'all' && t.projectId !== projectFilter) return false
      return true
    })
  }, [tasks, query, statusFilter, priorityFilter, projectFilter])

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <InputGroup className="w-full sm:w-64">
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Tapşırıq axtar..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </InputGroup>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as string)}>
          <SelectTrigger className="w-36" size="sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">Bütün statuslar</SelectItem>
              {statusOrder.map((s) => (
                <SelectItem key={s} value={s}>
                  {statusConfig[s].label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v as string)}>
          <SelectTrigger className="w-36" size="sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">Bütün prioritetlər</SelectItem>
              {(Object.keys(priorityConfig) as Array<keyof typeof priorityConfig>).map((p) => (
                <SelectItem key={p} value={p}>
                  {priorityConfig[p].label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select value={projectFilter} onValueChange={(v) => setProjectFilter(v as string)}>
          <SelectTrigger className="w-40" size="sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">Bütün layihələr</SelectItem>
              {projects.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <div className="ml-auto">
          <ToggleGroup
            variant="outline"
            value={[view]}
            onValueChange={(v) => {
              const next = v[0] as ViewMode | undefined
              if (next) setView(next)
            }}
          >
            <ToggleGroupItem value="table" aria-label="Cədvəl görünüşü">
              <Table2 />
            </ToggleGroupItem>
            <ToggleGroupItem value="board" aria-label="Lövhə görünüşü">
              <Kanban />
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="Siyahı görünüşü">
              <List />
            </ToggleGroupItem>
            <ToggleGroupItem value="timeline" aria-label="Timeline (Gantt) görünüşü">
              <GanttChartSquare />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      {view === 'table' && <TaskTable tasks={filtered} />}
      {view === 'board' && <KanbanBoard tasks={filtered} onMoveTask={moveTask} />}
      {view === 'list' && <TaskList tasks={filtered} />}
      {view === 'timeline' && <TimelineView tasks={filtered} />}
    </div>
  )
}
