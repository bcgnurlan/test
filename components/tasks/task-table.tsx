'use client'

import * as React from 'react'
import { ArrowUpDown, MessageSquare, Settings2, Trash2, UserRound } from 'lucide-react'
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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AssigneeAvatar, PriorityLabel, StatusBadge } from '@/components/task-meta'
import {
  formatDate,
  getProject,
  getUser,
  priorityConfig,
  projects,
  statusConfig,
  statusOrder,
  users,
  type Task,
  type TaskPriority,
  type TaskStatus,
} from '@/lib/data'
import { useTaskStore } from '@/lib/store'
import { cn } from '@/lib/utils'

type SortKey = 'key' | 'title' | 'dueDate' | 'progress'
type GroupKey = 'none' | 'status' | 'priority' | 'project'

const columnDefs = [
  { id: 'status', label: 'Status' },
  { id: 'priority', label: 'Prioritet' },
  { id: 'project', label: 'Layihə' },
  { id: 'dueDate', label: 'Tarix' },
  { id: 'progress', label: 'İrəliləyiş' },
  { id: 'assignee', label: 'İcraçı' },
] as const

type ColumnId = (typeof columnDefs)[number]['id']

const groupLabels: Record<GroupKey, string> = {
  none: 'Qruplama yoxdur',
  status: 'Statusa görə',
  priority: 'Prioritetə görə',
  project: 'Layihəyə görə',
}

export function TaskTable({ tasks }: { tasks: Task[] }) {
  const openTask = useTaskStore((s) => s.openTask)
  const updateTask = useTaskStore((s) => s.updateTask)
  const bulkUpdate = useTaskStore((s) => s.bulkUpdate)
  const deleteTasks = useTaskStore((s) => s.deleteTasks)

  const [selected, setSelected] = React.useState<Set<string>>(new Set())
  const [sortKey, setSortKey] = React.useState<SortKey>('key')
  const [sortAsc, setSortAsc] = React.useState(true)
  const [groupBy, setGroupBy] = React.useState<GroupKey>('none')
  const [visible, setVisible] = React.useState<Set<ColumnId>>(
    new Set(columnDefs.map((c) => c.id))
  )

  const sorted = React.useMemo(() => {
    const copy = [...tasks]
    copy.sort((a, b) => {
      const av = a[sortKey]
      const bv = b[sortKey]
      const cmp =
        typeof av === 'number' && typeof bv === 'number'
          ? av - bv
          : String(av).localeCompare(String(bv))
      return sortAsc ? cmp : -cmp
    })
    return copy
  }, [tasks, sortKey, sortAsc])

  const groups = React.useMemo(() => {
    if (groupBy === 'none') return [{ id: 'all', label: null as string | null, items: sorted }]
    if (groupBy === 'status') {
      return statusOrder
        .map((s) => ({
          id: s,
          label: statusConfig[s].label,
          items: sorted.filter((t) => t.status === s),
        }))
        .filter((g) => g.items.length > 0)
    }
    if (groupBy === 'priority') {
      return (Object.keys(priorityConfig) as TaskPriority[])
        .map((p) => ({
          id: p,
          label: priorityConfig[p].label,
          items: sorted.filter((t) => t.priority === p),
        }))
        .filter((g) => g.items.length > 0)
    }
    return projects
      .map((p) => ({
        id: p.id,
        label: p.name,
        items: sorted.filter((t) => t.projectId === p.id),
      }))
      .filter((g) => g.items.length > 0)
  }, [sorted, groupBy])

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

  function toggleColumn(id: ColumnId) {
    setVisible((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectedIds = React.useMemo(() => Array.from(selected), [selected])

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

  const colCount =
    3 + columnDefs.filter((c) => visible.has(c.id)).length /* checkbox + key + title */

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        {selected.size > 0 ? (
          <div className="flex flex-wrap items-center gap-2 rounded-md border bg-card px-3 py-1.5">
            <span className="text-sm text-muted-foreground">{selected.size} seçildi</span>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="outline" size="sm">
                    Status dəyiş
                  </Button>
                }
              />
              <DropdownMenuContent align="start">
                <DropdownMenuGroup>
                  {statusOrder.map((s) => (
                    <DropdownMenuItem
                      key={s}
                      onClick={() => {
                        bulkUpdate(selectedIds, { status: s })
                        setSelected(new Set())
                      }}
                    >
                      {statusConfig[s].label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="outline" size="sm">
                    <UserRound />
                    Təyin et
                  </Button>
                }
              />
              <DropdownMenuContent align="start">
                <DropdownMenuGroup>
                  {users.map((u) => (
                    <DropdownMenuItem
                      key={u.id}
                      onClick={() => {
                        bulkUpdate(selectedIds, { assigneeId: u.id })
                        setSelected(new Set())
                      }}
                    >
                      {u.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                deleteTasks(selectedIds)
                setSelected(new Set())
              }}
            >
              <Trash2 />
              Sil
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setSelected(new Set())}>
              Ləğv et
            </Button>
          </div>
        ) : null}
        <div className="ml-auto flex items-center gap-2">
          <Select value={groupBy} onValueChange={(v) => setGroupBy(v as GroupKey)}>
            <SelectTrigger size="sm" className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {(Object.keys(groupLabels) as GroupKey[]).map((g) => (
                  <SelectItem key={g} value={g}>
                    {groupLabels[g]}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="outline" size="sm">
                  <Settings2 />
                  Sütunlar
                </Button>
              }
            />
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Görünən sütunlar</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {columnDefs.map((c) => (
                <DropdownMenuCheckboxItem
                  key={c.id}
                  checked={visible.has(c.id)}
                  onCheckedChange={() => toggleColumn(c.id)}
                >
                  {c.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

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
              {visible.has('status') && <TableHead className="w-44">Status</TableHead>}
              {visible.has('priority') && <TableHead className="w-36">Prioritet</TableHead>}
              {visible.has('project') && <TableHead className="w-36">Layihə</TableHead>}
              {visible.has('dueDate') && (
                <TableHead className="w-24">
                  <button
                    type="button"
                    onClick={() => toggleSort('dueDate')}
                    className="flex items-center gap-1 hover:text-foreground"
                  >
                    Tarix
                    <ArrowUpDown className="size-3" aria-hidden="true" />
                  </button>
                </TableHead>
              )}
              {visible.has('progress') && (
                <TableHead className="w-32">
                  <button
                    type="button"
                    onClick={() => toggleSort('progress')}
                    className="flex items-center gap-1 hover:text-foreground"
                  >
                    İrəliləyiş
                    <ArrowUpDown className="size-3" aria-hidden="true" />
                  </button>
                </TableHead>
              )}
              {visible.has('assignee') && <TableHead className="w-12">İcraçı</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {groups.map((group) => (
              <React.Fragment key={group.id}>
                {group.label && (
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableCell colSpan={colCount} className="py-1.5">
                      <span className="flex items-center gap-2 text-xs font-medium">
                        {group.label}
                        <Badge variant="secondary" className="tabular-nums">
                          {group.items.length}
                        </Badge>
                      </span>
                    </TableCell>
                  </TableRow>
                )}
                {group.items.map((task) => (
                  <TableRow
                    key={task.id}
                    data-state={selected.has(task.id) ? 'selected' : undefined}
                    className="cursor-pointer"
                    onClick={() => openTask(task.id)}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
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
                        <span className="max-w-64 truncate font-medium lg:max-w-96">
                          {task.title}
                        </span>
                        {task.comments > 0 && (
                          <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                            <MessageSquare className="size-3" aria-hidden="true" />
                            {task.comments}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    {visible.has('status') && (
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Select
                          value={task.status}
                          onValueChange={(v) => updateTask(task.id, { status: v as TaskStatus })}
                        >
                          <SelectTrigger
                            size="sm"
                            className="h-7 w-full border-transparent bg-transparent shadow-none hover:border-border dark:bg-transparent"
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {statusOrder.map((s) => (
                                <SelectItem key={s} value={s}>
                                  <span className="flex items-center gap-2">
                                    <span
                                      className={cn('size-2 rounded-full', statusConfig[s].dot)}
                                      aria-hidden="true"
                                    />
                                    {statusConfig[s].label}
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    )}
                    {visible.has('priority') && (
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Select
                          value={task.priority}
                          onValueChange={(v) =>
                            updateTask(task.id, { priority: v as TaskPriority })
                          }
                        >
                          <SelectTrigger
                            size="sm"
                            className="h-7 w-full border-transparent bg-transparent shadow-none hover:border-border dark:bg-transparent"
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {(Object.keys(priorityConfig) as TaskPriority[]).map((p) => (
                                <SelectItem key={p} value={p}>
                                  {priorityConfig[p].label}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    )}
                    {visible.has('project') && (
                      <TableCell>
                        <Badge variant="secondary" className="font-normal">
                          {getProject(task.projectId).name}
                        </Badge>
                      </TableCell>
                    )}
                    {visible.has('dueDate') && (
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(task.dueDate)}
                      </TableCell>
                    )}
                    {visible.has('progress') && (
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={task.progress} className="h-1.5 w-16" />
                          <span className="text-xs tabular-nums text-muted-foreground">
                            {task.progress}%
                          </span>
                        </div>
                      </TableCell>
                    )}
                    {visible.has('assignee') && (
                      <TableCell>
                        <AssigneeAvatar userId={task.assigneeId} />
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
