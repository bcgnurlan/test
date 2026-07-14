'use client'

import * as React from 'react'
import {
  CalendarDays,
  FileText,
  Flag,
  FolderKanban,
  History,
  ListChecks,
  MessageSquare,
  Paperclip,
  Plus,
  Trash2,
  UserRound,
} from 'lucide-react'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  formatDate,
  getProject,
  getUser,
  priorityConfig,
  projects,
  statusConfig,
  statusOrder,
  users,
  type TaskPriority,
  type TaskStatus,
} from '@/lib/data'
import { useTaskDetails, useTaskStore } from '@/lib/store'

const currentUserId = 'u1'

export function TaskDetailSheet() {
  const selectedTaskId = useTaskStore((s) => s.selectedTaskId)
  const task = useTaskStore((s) => s.tasks.find((t) => t.id === s.selectedTaskId))
  const closeTask = useTaskStore((s) => s.closeTask)
  const updateTask = useTaskStore((s) => s.updateTask)
  const deleteTasks = useTaskStore((s) => s.deleteTasks)
  const updateDescription = useTaskStore((s) => s.updateDescription)
  const toggleChecklistItem = useTaskStore((s) => s.toggleChecklistItem)
  const addChecklistItem = useTaskStore((s) => s.addChecklistItem)
  const addComment = useTaskStore((s) => s.addComment)
  const addAttachment = useTaskStore((s) => s.addAttachment)
  const details = useTaskDetails(selectedTaskId)

  const [newItem, setNewItem] = React.useState('')
  const [newComment, setNewComment] = React.useState('')

  if (!task) return <Sheet open={false} onOpenChange={() => closeTask()} />

  const checklistDone = details.checklist.filter((c) => c.done).length

  function submitChecklistItem() {
    if (!task || !newItem.trim()) return
    addChecklistItem(task.id, newItem.trim())
    setNewItem('')
  }

  function submitComment() {
    if (!task || !newComment.trim()) return
    addComment(task.id, currentUserId, newComment.trim())
    setNewComment('')
  }

  return (
    <Sheet open onOpenChange={(open) => !open && closeTask()}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-xl">
        <SheetHeader className="border-b px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">{task.key}</span>
            <Badge variant="secondary" className="font-normal">
              {getProject(task.projectId).name}
            </Badge>
          </div>
          <SheetTitle className="text-left text-lg leading-snug text-balance">
            {task.title}
          </SheetTitle>
          <SheetDescription className="sr-only">Tapşırıq detalları</SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <div className="flex flex-col gap-5 px-6 py-4">
            {/* Field grid */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <Flag className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <Select
                  value={task.status}
                  onValueChange={(v) => updateTask(task.id, { status: v as TaskStatus })}
                >
                  <SelectTrigger size="sm" className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {statusOrder.map((s) => (
                        <SelectItem key={s} value={s}>
                          {statusConfig[s].label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Flag className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <Select
                  value={task.priority}
                  onValueChange={(v) => updateTask(task.id, { priority: v as TaskPriority })}
                >
                  <SelectTrigger size="sm" className="flex-1">
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
              </div>
              <div className="flex items-center gap-2">
                <UserRound className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <Select
                  value={task.assigneeId}
                  onValueChange={(v) => updateTask(task.id, { assigneeId: v as string })}
                >
                  <SelectTrigger size="sm" className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {users.map((u) => (
                        <SelectItem key={u.id} value={u.id}>
                          {u.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <FolderKanban className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <Select
                  value={task.projectId}
                  onValueChange={(v) => updateTask(task.id, { projectId: v as string })}
                >
                  <SelectTrigger size="sm" className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {projects.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <Input
                  type="date"
                  className="h-7 flex-1 text-[0.8rem]"
                  value={task.dueDate}
                  onChange={(e) => updateTask(task.id, { dueDate: e.target.value })}
                  aria-label="Son tarix"
                />
              </div>
              <div className="flex items-center gap-2">
                <Progress value={task.progress} className="h-1.5 flex-1" />
                <span className="text-xs tabular-nums text-muted-foreground">{task.progress}%</span>
              </div>
            </div>

            <Separator />

            {/* Description */}
            <section aria-label="Təsvir" className="flex flex-col gap-2">
              <h3 className="flex items-center gap-1.5 text-sm font-medium">
                <FileText className="size-4 text-muted-foreground" aria-hidden="true" />
                Təsvir
              </h3>
              <Textarea
                placeholder="Təsvir əlavə edin..."
                rows={3}
                value={details.description}
                onChange={(e) => updateDescription(task.id, e.target.value)}
              />
            </section>

            {/* Checklist */}
            <section aria-label="Yoxlama siyahısı" className="flex flex-col gap-2">
              <h3 className="flex items-center gap-1.5 text-sm font-medium">
                <ListChecks className="size-4 text-muted-foreground" aria-hidden="true" />
                Yoxlama siyahısı
                {details.checklist.length > 0 && (
                  <span className="text-xs font-normal tabular-nums text-muted-foreground">
                    {checklistDone}/{details.checklist.length}
                  </span>
                )}
              </h3>
              <ul className="flex flex-col gap-1">
                {details.checklist.map((item) => (
                  <li key={item.id} className="flex items-center gap-2 rounded-md px-1 py-1 hover:bg-accent/50">
                    <Checkbox
                      id={`chk-${item.id}`}
                      checked={item.done}
                      onCheckedChange={() => toggleChecklistItem(task.id, item.id)}
                    />
                    <label
                      htmlFor={`chk-${item.id}`}
                      className={
                        item.done
                          ? 'text-sm text-muted-foreground line-through'
                          : 'text-sm'
                      }
                    >
                      {item.text}
                    </label>
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Yeni bənd əlavə et..."
                  className="h-8"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.nativeEvent.isComposing && e.keyCode !== 229) {
                      e.preventDefault()
                      submitChecklistItem()
                    }
                  }}
                />
                <Button variant="outline" size="icon" onClick={submitChecklistItem} aria-label="Bənd əlavə et">
                  <Plus />
                </Button>
              </div>
            </section>

            <Separator />

            {/* Tabs: comments / files / activity */}
            <Tabs defaultValue="comments">
              <TabsList>
                <TabsTrigger value="comments">
                  <MessageSquare className="size-3.5" aria-hidden="true" />
                  Şərhlər ({details.comments.length})
                </TabsTrigger>
                <TabsTrigger value="files">
                  <Paperclip className="size-3.5" aria-hidden="true" />
                  Fayllar ({details.attachments.length})
                </TabsTrigger>
                <TabsTrigger value="activity">
                  <History className="size-3.5" aria-hidden="true" />
                  Aktivlik
                </TabsTrigger>
              </TabsList>

              <TabsContent value="comments" className="flex flex-col gap-3 pt-3">
                {details.comments.length === 0 && (
                  <p className="py-4 text-center text-sm text-muted-foreground">Hələ şərh yoxdur.</p>
                )}
                {details.comments.map((c) => {
                  const user = getUser(c.userId)
                  return (
                    <div key={c.id} className="flex items-start gap-2.5">
                      <Avatar className="size-7">
                        <AvatarFallback className="text-[10px]">{user.initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm font-medium">{user.name}</span>
                          <span className="text-xs text-muted-foreground">{c.time}</span>
                        </div>
                        <p className="text-sm leading-relaxed text-muted-foreground">{c.text}</p>
                      </div>
                    </div>
                  )
                })}
                <div className="flex items-start gap-2">
                  <Textarea
                    placeholder="Şərh yazın..."
                    rows={2}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => {
                      if (
                        e.key === 'Enter' &&
                        !e.shiftKey &&
                        !e.nativeEvent.isComposing &&
                        e.keyCode !== 229
                      ) {
                        e.preventDefault()
                        submitComment()
                      }
                    }}
                  />
                  <Button size="sm" onClick={submitComment}>
                    Göndər
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="files" className="flex flex-col gap-2 pt-3">
                {details.attachments.length === 0 && (
                  <p className="py-4 text-center text-sm text-muted-foreground">Fayl əlavə edilməyib.</p>
                )}
                {details.attachments.map((a) => {
                  const user = getUser(a.userId)
                  return (
                    <div
                      key={a.id}
                      className="flex items-center gap-3 rounded-md border px-3 py-2"
                    >
                      <Paperclip className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                      <div className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate text-sm font-medium">{a.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {a.size} · {user.name} · {a.time}
                        </span>
                      </div>
                    </div>
                  )
                })}
                <Button
                  variant="outline"
                  size="sm"
                  className="self-start"
                  onClick={() => addAttachment(task.id, `senəd-${details.attachments.length + 1}.pdf`, currentUserId)}
                >
                  <Plus />
                  Fayl əlavə et
                </Button>
              </TabsContent>

              <TabsContent value="activity" className="flex flex-col gap-3 pt-3">
                {details.activity.length === 0 && (
                  <p className="py-4 text-center text-sm text-muted-foreground">Aktivlik qeydi yoxdur.</p>
                )}
                {[...details.activity].reverse().map((a) => {
                  const user = getUser(a.userId)
                  return (
                    <div key={a.id} className="flex items-start gap-2.5">
                      <Avatar className="size-6">
                        <AvatarFallback className="text-[10px]">{user.initials}</AvatarFallback>
                      </Avatar>
                      <p className="text-sm leading-relaxed">
                        <span className="font-medium">{user.name}</span>{' '}
                        <span className="text-muted-foreground">{a.text}</span>{' '}
                        <span className="text-xs text-muted-foreground">· {a.time}</span>
                      </p>
                    </div>
                  )
                })}
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>

        <div className="flex items-center justify-between border-t px-6 py-3">
          <span className="text-xs text-muted-foreground">
            Son tarix: {formatDate(task.dueDate)}
          </span>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => deleteTasks([task.id])}
          >
            <Trash2 />
            Sil
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
