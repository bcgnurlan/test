'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import {
  CalendarDays,
  ChartNoAxesColumn,
  FolderKanban,
  Inbox,
  LayoutDashboard,
  ListTodo,
  Plus,
  SlidersHorizontal,
  User,
  Users,
} from 'lucide-react'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from '@/components/ui/command'
import { projects, tasks, users } from '@/lib/data'

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateTask: () => void
  onCreateProject: () => void
}

export function CommandPalette({
  open,
  onOpenChange,
  onCreateTask,
  onCreateProject,
}: CommandPaletteProps) {
  const router = useRouter()

  const go = React.useCallback(
    (href: string) => {
      onOpenChange(false)
      router.push(href)
    },
    [onOpenChange, router]
  )

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} title="Əmr paneli" description="Əmr və ya axtarış yazın...">
      <CommandInput placeholder="Əmr yazın və ya axtarın..." />
      <CommandList>
        <CommandEmpty>Nəticə tapılmadı.</CommandEmpty>
        <CommandGroup heading="Əməliyyatlar">
          <CommandItem onSelect={onCreateTask}>
            <Plus />
            Yeni tapşırıq yarat
            <CommandShortcut>C</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={onCreateProject}>
            <FolderKanban />
            Yeni layihə yarat
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Naviqasiya">
          <CommandItem onSelect={() => go('/')}>
            <LayoutDashboard />
            İdarə paneli
          </CommandItem>
          <CommandItem onSelect={() => go('/tasks')}>
            <ListTodo />
            Tapşırıqlar
          </CommandItem>
          <CommandItem onSelect={() => go('/projects')}>
            <FolderKanban />
            Layihələr
          </CommandItem>
          <CommandItem onSelect={() => go('/inbox')}>
            <Inbox />
            Gələnlər
          </CommandItem>
          <CommandItem onSelect={() => go('/calendar')}>
            <CalendarDays />
            Təqvim
          </CommandItem>
          <CommandItem onSelect={() => go('/reports')}>
            <ChartNoAxesColumn />
            Hesabatlar
          </CommandItem>
          <CommandItem onSelect={() => go('/fields')}>
            <SlidersHorizontal />
            Xüsusi sahələr
          </CommandItem>
          <CommandItem onSelect={() => go('/members')}>
            <Users />
            Komanda və rollar
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Layihələr">
          {projects.map((project) => (
            <CommandItem key={project.id} onSelect={() => go('/projects')}>
              <FolderKanban />
              {project.name}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Tapşırıqlar">
          {tasks.slice(0, 5).map((task) => (
            <CommandItem key={task.id} onSelect={() => go('/tasks')}>
              <ListTodo />
              <span className="text-muted-foreground">{task.key}</span>
              <span className="truncate">{task.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="İnsanlar">
          {users.map((user) => (
            <CommandItem key={user.id} onSelect={() => go('/members')}>
              <User />
              {user.name}
              <span className="ml-auto text-xs text-muted-foreground">{user.role}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
