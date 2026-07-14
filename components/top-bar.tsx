'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'
import { Moon, Plus, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { useShell } from '@/components/app-shell'

const pageTitles: Record<string, string> = {
  '/': 'İdarə paneli',
  '/tasks': 'Tapşırıqlar',
  '/projects': 'Layihələr',
  '/fields': 'Xüsusi sahələr',
  '/members': 'Komanda və rollar',
  '/inbox': 'Gələnlər',
  '/calendar': 'Təqvim',
  '/reports': 'Hesabatlar',
}

export function TopBar() {
  const pathname = usePathname()
  const { openCreate } = useShell()
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => setMounted(true), [])

  const title = pageTitles[pathname] ?? 'Taskora'

  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4!" />
      <h1 className="text-sm font-medium">{title}</h1>
      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
          aria-label="Mövzunu dəyiş"
        >
          {mounted && resolvedTheme === 'dark' ? <Sun /> : <Moon />}
        </Button>
        <Button size="sm" onClick={openCreate}>
          <Plus data-icon="inline-start" />
          Yeni tapşırıq
        </Button>
      </div>
    </header>
  )
}
