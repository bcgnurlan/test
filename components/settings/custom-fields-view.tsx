'use client'

import * as React from 'react'
import { Pencil, Plus, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
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
  customFieldTypes,
  getFieldTypeLabel,
  projects,
  type CustomFieldDef,
  type CustomFieldType,
} from '@/lib/data'
import { useSettingsStore } from '@/lib/settings-store'
import { cn } from '@/lib/utils'

function projectLabel(id: string) {
  if (id === 'all') return 'Bütün layihələr'
  return projects.find((p) => p.id === id)?.name ?? id
}

export function CustomFieldsView() {
  const fields = useSettingsStore((s) => s.fields)
  const addField = useSettingsStore((s) => s.addField)
  const updateField = useSettingsStore((s) => s.updateField)
  const deleteField = useSettingsStore((s) => s.deleteField)

  const [open, setOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<CustomFieldDef | null>(null)

  function openCreate() {
    setEditing(null)
    setOpen(true)
  }

  function openEdit(field: CustomFieldDef) {
    setEditing(field)
    setOpen(true)
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <div>
          <h2 className="text-lg font-semibold">Xüsusi sahələr</h2>
          <p className="text-sm text-muted-foreground">
            Tapşırıqlara əlavə məlumat sahələri təyin edin · {fields.length} sahə
          </p>
        </div>
        <Button size="sm" className="ml-auto" onClick={openCreate}>
          <Plus />
          Yeni sahə
        </Button>
      </div>

      {fields.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>Sahə yoxdur</EmptyTitle>
            <EmptyDescription>İlk xüsusi sahənizi yaradın.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ad</TableHead>
                <TableHead>Tip</TableHead>
                <TableHead>Əhatə</TableHead>
                <TableHead>Seçimlər</TableHead>
                <TableHead className="text-center">Məcburi</TableHead>
                <TableHead className="w-20 text-right">Əməliyyat</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((field) => (
                <TableRow key={field.id}>
                  <TableCell className="font-medium">{field.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-normal">
                      {getFieldTypeLabel(field.type)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {projectLabel(field.projectId)}
                  </TableCell>
                  <TableCell>
                    {field.options.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {field.options.slice(0, 3).map((o) => (
                          <Badge key={o} variant="outline" className="font-normal">
                            {o}
                          </Badge>
                        ))}
                        {field.options.length > 3 && (
                          <span className="text-xs text-muted-foreground">
                            +{field.options.length - 3}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {field.required ? (
                      <Badge className="font-normal">Bəli</Badge>
                    ) : (
                      <span className="text-muted-foreground">Xeyr</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        onClick={() => openEdit(field)}
                        aria-label="Redaktə et"
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-muted-foreground hover:text-destructive"
                        onClick={() => deleteField(field.id)}
                        aria-label="Sil"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <FieldDialog
        open={open}
        onOpenChange={setOpen}
        editing={editing}
        onSave={(data) => {
          if (editing) updateField(editing.id, data)
          else addField(data)
          setOpen(false)
        }}
      />
    </div>
  )
}

interface FieldDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editing: CustomFieldDef | null
  onSave: (data: Omit<CustomFieldDef, 'id'>) => void
}

function FieldDialog({ open, onOpenChange, editing, onSave }: FieldDialogProps) {
  const [name, setName] = React.useState('')
  const [type, setType] = React.useState<CustomFieldType>('text')
  const [projectId, setProjectId] = React.useState<string>('all')
  const [required, setRequired] = React.useState(false)
  const [options, setOptions] = React.useState<string[]>([])
  const [optionDraft, setOptionDraft] = React.useState('')

  React.useEffect(() => {
    if (!open) return
    setName(editing?.name ?? '')
    setType(editing?.type ?? 'text')
    setProjectId(editing?.projectId ?? 'all')
    setRequired(editing?.required ?? false)
    setOptions(editing?.options ?? [])
    setOptionDraft('')
  }, [open, editing])

  const hasOptions = customFieldTypes.find((t) => t.type === type)?.hasOptions ?? false

  function addOption() {
    const v = optionDraft.trim()
    if (!v || options.includes(v)) return
    setOptions((prev) => [...prev, v])
    setOptionDraft('')
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    onSave({
      name: name.trim(),
      type,
      projectId,
      required,
      options: hasOptions ? options : [],
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editing ? 'Sahəni redaktə et' : 'Yeni xüsusi sahə'}</DialogTitle>
          <DialogDescription>Sahə parametrlərini konfiqurasiya edin.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="field-name">Ad</FieldLabel>
              <Input
                id="field-name"
                placeholder="məs. Story Points"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Tip</FieldLabel>
                <Select value={type} onValueChange={(v) => setType(v as CustomFieldType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {customFieldTypes.map((t) => (
                        <SelectItem key={t.type} value={t.type}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel>Əhatə</FieldLabel>
                <Select value={projectId} onValueChange={(v) => setProjectId(v as string)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="all">Bütün layihələr</SelectItem>
                      {projects.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            {hasOptions && (
              <Field>
                <FieldLabel>Seçimlər</FieldLabel>
                <div className="flex flex-wrap gap-1.5">
                  {options.map((o) => (
                    <Badge key={o} variant="secondary" className="gap-1 font-normal">
                      {o}
                      <button
                        type="button"
                        onClick={() => setOptions((prev) => prev.filter((x) => x !== o))}
                        aria-label={`${o} sil`}
                      >
                        <X className="size-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Seçim əlavə et..."
                    value={optionDraft}
                    onChange={(e) => setOptionDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.nativeEvent.isComposing && e.keyCode !== 229) {
                        e.preventDefault()
                        addOption()
                      }
                    }}
                  />
                  <Button type="button" variant="outline" size="icon" onClick={addOption}>
                    <Plus />
                  </Button>
                </div>
              </Field>
            )}

            <Field
              orientation="horizontal"
              className={cn('items-center justify-between rounded-md border p-3')}
            >
              <div className="flex flex-col">
                <FieldLabel htmlFor="field-required">Məcburi sahə</FieldLabel>
                <span className="text-xs text-muted-foreground">
                  Tapşırıq yaradarkən doldurulması vacibdir
                </span>
              </div>
              <Switch id="field-required" checked={required} onCheckedChange={setRequired} />
            </Field>
          </FieldGroup>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Ləğv et
            </Button>
            <Button type="submit">{editing ? 'Yadda saxla' : 'Sahə yarat'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
