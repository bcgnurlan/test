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
import { priorityConfig, projects, statusConfig, statusOrder, users } from '@/lib/data'

interface CreateTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateTaskDialog({ open, onOpenChange }: CreateTaskDialogProps) {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Yeni tapşırıq</DialogTitle>
          <DialogDescription>
            Tapşırıq məlumatlarını daxil edin. Bu, frontend demo rejimidir.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="task-title">Başlıq</FieldLabel>
              <Input id="task-title" placeholder="Tapşırıq başlığı" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="task-desc">Təsvir</FieldLabel>
              <Textarea id="task-desc" placeholder="Qısa təsvir yazın..." rows={3} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Layihə</FieldLabel>
                <Select defaultValue={projects[0].id}>
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
                <Select defaultValue={users[0].id}>
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
                <Select defaultValue="todo">
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
                <Select defaultValue="medium">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {(Object.keys(priorityConfig) as Array<keyof typeof priorityConfig>).map(
                        (p) => (
                          <SelectItem key={p} value={p}>
                            {priorityConfig[p].label}
                          </SelectItem>
                        )
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
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
