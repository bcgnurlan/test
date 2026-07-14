'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  CalendarDays,
  ChartNoAxesColumn,
  ChevronsUpDown,
  FolderKanban,
  Inbox,
  Layers,
  LayoutDashboard,
  ListTodo,
  Plus,
  Search,
  Settings,
  SlidersHorizontal,
  Users,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Kbd } from '@/components/ui/kbd'
import { projects, users } from '@/lib/data'
import { useShell } from '@/components/app-shell'
import { cn } from '@/lib/utils'

const navItems = [
  { title: 'İdarə paneli', href: '/', icon: LayoutDashboard },
  { title: 'Tapşırıqlar', href: '/tasks', icon: ListTodo, badge: '14' },
  { title: 'Layihələr', href: '/projects', icon: FolderKanban },
  { title: 'Gələnlər', href: '/inbox', icon: Inbox, badge: '3' },
  { title: 'Təqvim', href: '/calendar', icon: CalendarDays },
  { title: 'Hesabatlar', href: '/reports', icon: ChartNoAxesColumn },
]

const workspaceItems = [
  { title: 'Xüsusi sahələr', href: '/fields', icon: SlidersHorizontal },
  { title: 'Komanda və rollar', href: '/members', icon: Users },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { openCommand, openCreate } = useShell()
  const currentUser = users[0]

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton size="lg" className="data-[popup-open]:bg-sidebar-accent">
                    <div className="flex size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                      <Layers className="size-4" />
                    </div>
                    <div className="flex flex-col gap-0.5 leading-none">
                      <span className="font-semibold">Taskora</span>
                      <span className="text-xs text-muted-foreground">Acme Komandası</span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
                  </SidebarMenuButton>
                }
              />
              <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuLabel>İş sahələri</DropdownMenuLabel>
                <DropdownMenuGroup>
                  <DropdownMenuItem>Acme Komandası</DropdownMenuItem>
                  <DropdownMenuItem>Şəxsi İş Sahəsi</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Plus />
                    Yeni iş sahəsi
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={openCommand} className="justify-between">
              <span className="flex items-center gap-2">
                <Search className="size-4" />
                Axtarış
              </span>
              <Kbd>⌘K</Kbd>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Naviqasiya</SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  render={
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  }
                />
                {item.badge ? <SidebarMenuBadge>{item.badge}</SidebarMenuBadge> : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Layihələr</SidebarGroupLabel>
          <SidebarGroupAction title="Yeni layihə" onClick={openCreate}>
            <Plus />
            <span className="sr-only">Yeni layihə</span>
          </SidebarGroupAction>
          <SidebarMenu>
            {projects.map((project) => (
              <SidebarMenuItem key={project.id}>
                <SidebarMenuButton
                  render={
                    <Link href="/projects">
                      <span className={cn('size-2 rounded-sm', project.color)} aria-hidden="true" />
                      <span>{project.name}</span>
                    </Link>
                  }
                />
                <SidebarMenuBadge>{project.taskCount}</SidebarMenuBadge>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>İş sahəsi</SidebarGroupLabel>
          <SidebarMenu>
            {workspaceItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  render={
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  }
                />
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton size="lg">
                    <Avatar className="size-8">
                      <AvatarFallback className="text-xs">{currentUser.initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-0.5 leading-none">
                      <span className="text-sm font-medium">{currentUser.name}</span>
                      <span className="text-xs text-muted-foreground">{currentUser.role}</span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
                  </SidebarMenuButton>
                }
              />
              <DropdownMenuContent className="w-56" align="start" side="top">
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Settings />
                    Parametrlər
                  </DropdownMenuItem>
                  <DropdownMenuItem>Profil</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem variant="destructive">Çıxış</DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
