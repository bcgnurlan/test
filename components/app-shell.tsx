'use client'

import * as React from 'react'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppSidebar } from '@/components/app-sidebar'
import { TopBar } from '@/components/top-bar'
import { CommandPalette } from '@/components/command-palette'
import { CreateTaskDialog } from '@/components/create-task-dialog'
import { CreateProjectDialog } from '@/components/create-project-dialog'
import { ShortcutsHelp } from '@/components/shortcuts-help'
import { TaskDetailSheet } from '@/components/task-detail-sheet'

interface ShellContextValue {
  openCommand: () => void
  openCreate: () => void
  openCreateProject: () => void
  openHelp: () => void
}

const ShellContext = React.createContext<ShellContextValue | null>(null)

export function useShell() {
  const ctx = React.useContext(ShellContext)
  if (!ctx) throw new Error('useShell must be used within AppShell')
  return ctx
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  return (
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.isContentEditable
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [commandOpen, setCommandOpen] = React.useState(false)
  const [createOpen, setCreateOpen] = React.useState(false)
  const [createProjectOpen, setCreateProjectOpen] = React.useState(false)
  const [helpOpen, setHelpOpen] = React.useState(false)

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setCommandOpen((v) => !v)
        return
      }
      if (isTypingTarget(e.target) || e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key === '/') {
        e.preventDefault()
        setCommandOpen(true)
      } else if (e.key.toLowerCase() === 'c') {
        e.preventDefault()
        setCreateOpen(true)
      } else if (e.key === '?') {
        e.preventDefault()
        setHelpOpen(true)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const value = React.useMemo<ShellContextValue>(
    () => ({
      openCommand: () => setCommandOpen(true),
      openCreate: () => setCreateOpen(true),
      openCreateProject: () => setCreateProjectOpen(true),
      openHelp: () => setHelpOpen(true),
    }),
    []
  )

  return (
    <ShellContext.Provider value={value}>
      <TooltipProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <TopBar />
            <main className="flex-1">{children}</main>
          </SidebarInset>
          <CommandPalette
            open={commandOpen}
            onOpenChange={setCommandOpen}
            onCreateTask={() => {
              setCommandOpen(false)
              setCreateOpen(true)
            }}
            onCreateProject={() => {
              setCommandOpen(false)
              setCreateProjectOpen(true)
            }}
          />
          <CreateTaskDialog open={createOpen} onOpenChange={setCreateOpen} />
          <CreateProjectDialog open={createProjectOpen} onOpenChange={setCreateProjectOpen} />
          <ShortcutsHelp open={helpOpen} onOpenChange={setHelpOpen} />
          <TaskDetailSheet />
        </SidebarProvider>
      </TooltipProvider>
    </ShellContext.Provider>
  )
}
