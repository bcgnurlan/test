'use client'

import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  priorityConfig,
  projects,
  statusConfig,
  statusOrder,
  users,
  type TaskPriority,
  type TaskStatus,
} from '@/lib/data'
import { useTaskStore } from '@/lib/store'

interface CreateTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function defaultDueDate() {
  const d = new Date()
  d.setDate(d.getDate() + 7)
  return d.toISOString().slice(0, 10)
}

export function CreateTaskDialog({ open, onOpenChange }: CreateTaskDialogProps) {
  const addTask = useTaskStore((s) => s.addTask)
  const openTask = useTaskStore((s) => s.openTask)

  const [title, setTitle] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [projectId, setProjectId] = React.useState(projects[0].id)
  const [assigneeId, setAssigneeId] = React.useState(users[0].id)
  const [status, setStatus] = React.useState<TaskStatus>('todo')
  const [priority, setPriority] = React.useState<TaskPriority>('medium')
  const [dueDate, setDueDate] = React.useState(defaultDueDate())

  function reset() {
    setTitle('')
    setDescription('')
    setProjectId(projects[0].id)
    setAssigneeId(users[0].id)
    setStatus('todo')
    setPriority('medium')
    setDueDate(defaultDueDate())
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    const id = addTask({
      title: title.trim(),
      description: description.trim(),
      projectId,
      assigneeId,
      status,
      priority,
      dueDate,
    })
    onOpenChange(false)
    reset()
    openTask(id)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Yeni tapşırıq</DialogTitle>
          <DialogDescription>Tapşırıq məlumatlarını daxil edin.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="task-title">Başlıq</FieldLabel>
              <Input
                id="task-title"
                placeholder="Tapşırıq başlığı"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="task-desc">Təsvir</FieldLabel>
              <Textarea
                id="task-desc"
                placeholder="Qısa təsvir yazın..."
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Layihə</FieldLabel>
                <Select value={projectId} onValueChange={(v) => setProjectId(v as string)}>
                  <SelectTrigger>
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
              </Field>
              <Field>
                <FieldLabel>İcraçı</FieldLabel>
                <Select value={assigneeId} onValueChange={(v) => setAssigneeId(v as string)}>
                  <SelectTrigger>
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
              </Field>
              <Field>
                <FieldLabel>Status</FieldLabel>
                <Select value={status} onValueChange={(v) => setStatus(v as TaskStatus)}>
                  <SelectTrigger>
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
              </Field>
              <Field>
                <FieldLabel>Prioritet</FieldLabel>
                <Select value={priority} onValueChange={(v) => setPriority(v as TaskPriority)}>
                  <SelectTrigger>
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
              </Field>
              <Field className="col-span-2">
                <FieldLabel htmlFor="task-due">Son tarix</FieldLabel>
                <Input
                  id="task-due"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </Field>
            </div>
          </FieldGroup>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Ləğv et
            </Button>
            <Button type="submit">Tapşırıq yarat</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
