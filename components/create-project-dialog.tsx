'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
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
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  projectStatusConfig,
  users,
  type ProjectStatus,
} from '@/lib/data'
import { useProjectStore } from '@/lib/project-store'

interface CreateProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const statusOrder: ProjectStatus[] = ['planning', 'active', 'on-hold', 'completed']

function defaultDueDate() {
  const d = new Date()
  d.setMonth(d.getMonth() + 1)
  return d.toISOString().slice(0, 10)
}

function suggestKey(name: string) {
  return name
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .trim()
    .slice(0, 4)
    .toUpperCase()
}

export function CreateProjectDialog({ open, onOpenChange }: CreateProjectDialogProps) {
  const router = useRouter()
  const addProject = useProjectStore((s) => s.addProject)

  const [name, setName] = React.useState('')
  const [key, setKey] = React.useState('')
  const [keyTouched, setKeyTouched] = React.useState(false)
  const [description, setDescription] = React.useState('')
  const [status, setStatus] = React.useState<ProjectStatus>('planning')
  const [leadId, setLeadId] = React.useState(users[0].id)
  const [dueDate, setDueDate] = React.useState(defaultDueDate())

  React.useEffect(() => {
    if (open) {
      setName('')
      setKey('')
      setKeyTouched(false)
      setDescription('')
      setStatus('planning')
      setLeadId(users[0].id)
      setDueDate(defaultDueDate())
    }
  }, [open])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    addProject({
      name: name.trim(),
      key: (key || suggestKey(name)).trim(),
      description: description.trim(),
      status,
      leadId,
      dueDate,
    })
    onOpenChange(false)
    router.push('/projects')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Yeni layihə</DialogTitle>
          <DialogDescription>Layihə məlumatlarını daxil edin.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <div className="grid grid-cols-[1fr_120px] gap-4">
              <Field>
                <FieldLabel htmlFor="project-name">Ad</FieldLabel>
                <Input
                  id="project-name"
                  placeholder="Layihə adı"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    if (!keyTouched) setKey(suggestKey(e.target.value))
                  }}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="project-key">Açar</FieldLabel>
                <Input
                  id="project-key"
                  placeholder="VEB"
                  maxLength={5}
                  value={key}
                  onChange={(e) => {
                    setKeyTouched(true)
                    setKey(e.target.value.toUpperCase())
                  }}
                />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="project-desc">Təsvir</FieldLabel>
              <Textarea
                id="project-desc"
                placeholder="Qısa təsvir yazın..."
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Status</FieldLabel>
                <Select value={status} onValueChange={(v) => setStatus(v as ProjectStatus)}>
                  <SelectTrigger>
                    <SelectValue>
                      {(value: ProjectStatus) => projectStatusConfig[value].label}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {statusOrder.map((s) => (
                        <SelectItem key={s} value={s}>
                          {projectStatusConfig[s].label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel>Layihə rəhbəri</FieldLabel>
                <Select value={leadId} onValueChange={(v) => setLeadId(v as string)}>
                  <SelectTrigger>
                    <SelectValue>
                      {(value: string) => users.find((u) => u.id === value)?.name}
                    </SelectValue>
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
              <Field className="col-span-2">
                <FieldLabel htmlFor="project-due">Son tarix</FieldLabel>
                <Input
                  id="project-due"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
                <FieldDescription>Layihənin planlaşdırılan bitmə tarixi.</FieldDescription>
              </Field>
            </div>
          </FieldGroup>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Ləğv et
            </Button>
            <Button type="submit">Layihə yarat</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
