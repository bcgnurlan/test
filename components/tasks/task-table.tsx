'use client'

import * as React from 'react'
import { ArrowUpDown, MessageSquare } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { AssigneeAvatar, PriorityLabel, StatusBadge } from '@/components/task-meta'
import { formatDate, getProject, type Task } from '@/lib/data'

type SortKey = 'key' | 'title' | 'dueDate' | 'progress'

export function TaskTable({ tasks }: { tasks: Task[] }) {
  const [selected, setSelected] = React.useState<Set<string>>(new Set())
  const [sortKey, setSortKey] = React.useState<SortKey>('key')
  const [sortAsc, setSortAsc] = React.useState(true)

  const sorted = React.useMemo(() => {
    const copy = [...tasks]
    copy.sort((a, b) => {
      const av = a[sortKey]
      const bv = b[sortKey]
      const cmp = typeof av === 'number' && typeof bv === 'number'
        ? av - bv
        : String(av).localeCompare(String(bv))
      return sortAsc ? cmp : -cmp
    })
    return copy
  }, [tasks, sortKey, sortAsc])

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortAsc((v) => !v)
    else {
      setSortKey(key)
      setSortAsc(true)
    }
  }

  function toggleAll(checked: boolean) {
    setSelected(checked ? new Set(tasks.map((t) => t.id)) : new Set())
  }

  function toggleOne(id: string, checked: boolean) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })
  }

  if (tasks.length === 0) {
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
    <div className="flex flex-col gap-2">
      {selected.size > 0 && (
        <div className="flex items-center gap-3 rounded-md border bg-card px-3 py-2">
          <span className="text-sm text-muted-foreground">{selected.size} tapşırıq seçildi</span>
          <Button variant="outline" size="sm">
            Status dəyiş
          </Button>
          <Button variant="outline" size="sm">
            Təyin et
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setSelected(new Set())}>
            Ləğv et
          </Button>
        </div>
      )}
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox
                  checked={selected.size === tasks.length && tasks.length > 0}
                  onCheckedChange={(c) => toggleAll(c === true)}
                  aria-label="Hamısını seç"
                />
              </TableHead>
              <TableHead className="w-24">
                <button
                  type="button"
                  onClick={() => toggleSort('key')}
                  className="flex items-center gap-1 hover:text-foreground"
                >
                  Açar
                  <ArrowUpDown className="size-3" aria-hidden="true" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  type="button"
                  onClick={() => toggleSort('title')}
                  className="flex items-center gap-1 hover:text-foreground"
                >
                  Başlıq
                  <ArrowUpDown className="size-3" aria-hidden="true" />
                </button>
              </TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead className="hidden lg:table-cell">Prioritet</TableHead>
              <TableHead className="hidden lg:table-cell">Layihə</TableHead>
              <TableHead className="hidden sm:table-cell">
                <button
                  type="button"
                  onClick={() => toggleSort('dueDate')}
                  className="flex items-center gap-1 hover:text-foreground"
                >
                  Tarix
                  <ArrowUpDown className="size-3" aria-hidden="true" />
                </button>
              </TableHead>
              <TableHead className="hidden xl:table-cell w-32">
                <button
                  type="button"
                  onClick={() => toggleSort('progress')}
                  className="flex items-center gap-1 hover:text-foreground"
                >
                  İrəliləyiş
                  <ArrowUpDown className="size-3" aria-hidden="true" />
                </button>
              </TableHead>
              <TableHead className="w-12">İcraçı</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((task) => (
              <TableRow key={task.id} data-state={selected.has(task.id) ? 'selected' : undefined}>
                <TableCell>
                  <Checkbox
                    checked={selected.has(task.id)}
                    onCheckedChange={(c) => toggleOne(task.id, c === true)}
                    aria-label={`${task.key} seç`}
                  />
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {task.key}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="max-w-64 truncate font-medium lg:max-w-96">{task.title}</span>
                    {task.comments > 0 && (
                      <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                        <MessageSquare className="size-3" aria-hidden="true" />
                        {task.comments}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <StatusBadge status={task.status} />
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <PriorityLabel priority={task.priority} />
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <Badge variant="secondary" className="font-normal">
                    {getProject(task.projectId).name}
                  </Badge>
                </TableCell>
                <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">
                  {formatDate(task.dueDate)}
                </TableCell>
                <TableCell className="hidden xl:table-cell">
                  <div className="flex items-center gap-2">
                    <Progress value={task.progress} className="h-1.5 w-16" />
                    <span className="text-xs tabular-nums text-muted-foreground">
                      {task.progress}%
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <AssigneeAvatar userId={task.assigneeId} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
