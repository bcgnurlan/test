'use client'

import * as React from 'react'
import Link from 'next/link'
import { CalendarDays, LayoutGrid, ListTodo, Search } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import {
  formatDate,
  getUser,
  projectStatusConfig,
  type ProjectStatus,
} from '@/lib/data'
import { useProjectStore } from '@/lib/project-store'
import { cn } from '@/lib/utils'

const statusFilters: Array<{ value: ProjectStatus | 'all'; label: string }> = [
  { value: 'all', label: 'Bütün statuslar' },
  { value: 'active', label: 'Aktiv' },
  { value: 'planning', label: 'Planlaşdırma' },
  { value: 'on-hold', label: 'Gözləmədə' },
  { value: 'completed', label: 'Tamamlanıb' },
]

export function ProjectsView() {
  const projects = useProjectStore((s) => s.projects)
  const [query, setQuery] = React.useState('')
  const [status, setStatus] = React.useState<ProjectStatus | 'all'>('all')

  const filtered = projects.filter((p) => {
    if (query && !`${p.name} ${p.key}`.toLowerCase().includes(query.toLowerCase())) return false
    if (status !== 'all' && p.status !== status) return false
    return true
  })

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <div>
          <h2 className="text-lg font-semibold">Layihələr</h2>
          <p className="text-sm text-muted-foreground">
            {projects.length} layihə · {projects.reduce((a, p) => a + p.taskCount, 0)} tapşırıq
          </p>
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <InputGroup className="w-full sm:w-56">
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Layihə axtar..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </InputGroup>
          <Select value={status} onValueChange={(v) => setStatus(v as ProjectStatus | 'all')}>
            <SelectTrigger size="sm" className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {statusFilters.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>Layihə tapılmadı</EmptyTitle>
            <EmptyDescription>Axtarış və ya filtri dəyişin.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => {
            const lead = getUser(project.leadId)
            const statusCfg = projectStatusConfig[project.status]
            return (
              <Card key={project.id} className="flex flex-col transition-colors hover:border-primary/40">
                <CardHeader className="gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={cn(
                          'flex size-9 items-center justify-center rounded-md text-xs font-semibold text-background',
                          project.color
                        )}
                        aria-hidden="true"
                      >
                        {project.key}
                      </span>
                      <div className="flex flex-col">
                        <span className="font-medium leading-tight">{project.name}</span>
                        <span className="font-mono text-[10px] text-muted-foreground">
                          {project.key}
                        </span>
                      </div>
                    </div>
                    <Badge variant="outline" className={cn('font-normal', statusCfg.className)}>
                      {statusCfg.label}
                    </Badge>
                  </div>
                  <p className="line-clamp-2 text-sm text-muted-foreground">{project.description}</p>
                </CardHeader>

                <CardContent className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">İrəliləyiş</span>
                      <span className="tabular-nums text-muted-foreground">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-1.5" />
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <ListTodo className="size-3.5" aria-hidden="true" />
                      {project.taskCount} tapşırıq
                    </span>
                    <span className="flex items-center gap-1">
                      <CalendarDays className="size-3.5" aria-hidden="true" />
                      {formatDate(project.dueDate)}
                    </span>
                  </div>
                </CardContent>

                <CardFooter className="mt-auto items-center justify-between border-t pt-4">
                  <div className="flex -space-x-2">
                    {project.memberIds.slice(0, 4).map((id) => {
                      const u = getUser(id)
                      return (
                        <Tooltip key={id}>
                          <TooltipTrigger
                            render={
                              <Avatar className="size-6 border-2 border-card">
                                <AvatarFallback className="text-[10px]">{u.initials}</AvatarFallback>
                              </Avatar>
                            }
                          />
                          <TooltipContent>{u.name}</TooltipContent>
                        </Tooltip>
                      )
                    })}
                    {project.memberIds.length > 4 && (
                      <span className="flex size-6 items-center justify-center rounded-full border-2 border-card bg-muted text-[10px] text-muted-foreground">
                        +{project.memberIds.length - 4}
                      </span>
                    )}
                  </div>
                  <Link
                    href="/tasks"
                    className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                  >
                    <LayoutGrid className="size-3.5" aria-hidden="true" />
                    Tapşırıqlar
                  </Link>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
