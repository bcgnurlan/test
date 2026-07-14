'use client'

import * as React from 'react'
import { Check, Plus, Shield, Trash2, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
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
  memberStatusConfig,
  permissions,
  roleConfig,
  roles,
  type RoleId,
} from '@/lib/data'
import { useSettingsStore } from '@/lib/settings-store'
import { cn } from '@/lib/utils'

const permissionCategories = Array.from(new Set(permissions.map((p) => p.category)))

export function MembersView() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div>
        <h2 className="text-lg font-semibold">Komanda və rollar</h2>
        <p className="text-sm text-muted-foreground">
          Üzvləri idarə edin və rol əsaslı icazələri konfiqurasiya edin
        </p>
      </div>

      <Tabs defaultValue="members">
        <TabsList>
          <TabsTrigger value="members">Üzvlər</TabsTrigger>
          <TabsTrigger value="roles">Rollar və icazələr</TabsTrigger>
        </TabsList>
        <TabsContent value="members" className="mt-4">
          <MembersTab />
        </TabsContent>
        <TabsContent value="roles" className="mt-4">
          <RolesTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function MembersTab() {
  const members = useSettingsStore((s) => s.members)
  const updateMemberRole = useSettingsStore((s) => s.updateMemberRole)
  const removeMember = useSettingsStore((s) => s.removeMember)
  const [inviteOpen, setInviteOpen] = React.useState(false)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{members.length} üzv</p>
        <Button size="sm" onClick={() => setInviteOpen(true)}>
          <UserPlus />
          Üzv dəvət et
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Üzv</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Son aktivlik</TableHead>
              <TableHead className="w-44">Rol</TableHead>
              <TableHead className="w-16 text-right">Sil</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((m) => {
              const status = memberStatusConfig[m.status]
              return (
                <TableRow key={m.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarFallback className="text-xs">{m.initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium leading-tight">{m.name}</span>
                        <span className="text-xs text-muted-foreground">{m.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="flex items-center gap-1.5 text-sm">
                      <span className={cn('size-2 rounded-full', status.dot)} aria-hidden="true" />
                      {status.label}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{m.lastActive}</TableCell>
                  <TableCell>
                    {m.roleId === 'owner' ? (
                      <Badge variant="outline" className={cn('font-normal', roleConfig.owner.className)}>
                        {roleConfig.owner.label}
                      </Badge>
                    ) : (
                      <Select
                        value={m.roleId}
                        onValueChange={(v) => updateMemberRole(m.id, v as RoleId)}
                      >
                        <SelectTrigger size="sm" className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {roles
                              .filter((r) => r.id !== 'owner')
                              .map((r) => (
                                <SelectItem key={r.id} value={r.id}>
                                  {r.name}
                                </SelectItem>
                              ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-muted-foreground hover:text-destructive"
                      disabled={m.roleId === 'owner'}
                      onClick={() => removeMember(m.id)}
                      aria-label="Üzvü sil"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <InviteDialog open={inviteOpen} onOpenChange={setInviteOpen} />
    </div>
  )
}

function InviteDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const addMember = useSettingsStore((s) => s.addMember)
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [roleId, setRoleId] = React.useState<RoleId>('member')

  React.useEffect(() => {
    if (open) {
      setName('')
      setEmail('')
      setRoleId('member')
    }
  }, [open])

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return
    addMember({ name: name.trim(), email: email.trim(), roleId })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Üzv dəvət et</DialogTitle>
          <DialogDescription>Yeni komanda üzvünə dəvət göndərin.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="invite-name">Ad Soyad</FieldLabel>
              <Input
                id="invite-name"
                placeholder="Ad Soyad"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="invite-email">Email</FieldLabel>
              <Input
                id="invite-email"
                type="email"
                placeholder="ad@sirket.az"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel>Rol</FieldLabel>
              <Select value={roleId} onValueChange={(v) => setRoleId(v as RoleId)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {roles
                      .filter((r) => r.id !== 'owner')
                      .map((r) => (
                        <SelectItem key={r.id} value={r.id}>
                          {r.name}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Ləğv et
            </Button>
            <Button type="submit">
              <Plus />
              Dəvət göndər
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function RolesTab() {
  const rolePermissions = useSettingsStore((s) => s.rolePermissions)
  const togglePermission = useSettingsStore((s) => s.togglePermission)
  const [activeRole, setActiveRole] = React.useState<RoleId>('admin')

  const activePerms = rolePermissions[activeRole] ?? []
  const isOwner = activeRole === 'owner'

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[240px_1fr]">
      <div className="flex flex-col gap-1">
        {roles.map((role) => {
          const count = rolePermissions[role.id]?.length ?? 0
          return (
            <button
              key={role.id}
              type="button"
              onClick={() => setActiveRole(role.id)}
              className={cn(
                'flex items-start gap-2.5 rounded-lg border p-3 text-left transition-colors',
                activeRole === role.id
                  ? 'border-primary/50 bg-accent'
                  : 'hover:bg-accent/50'
              )}
            >
              <span className={cn('mt-0.5 size-2.5 shrink-0 rounded-sm', role.color)} aria-hidden="true" />
              <div className="flex min-w-0 flex-col">
                <span className="flex items-center gap-1.5 text-sm font-medium">
                  {role.name}
                  {role.id === 'owner' && <Shield className="size-3 text-muted-foreground" />}
                </span>
                <span className="line-clamp-1 text-xs text-muted-foreground">
                  {role.description}
                </span>
                <span className="mt-0.5 text-[11px] text-muted-foreground">
                  {count}/{permissions.length} icazə
                </span>
              </div>
            </button>
          )
        })}
      </div>

      <div className="rounded-lg border">
        <div className="flex items-center justify-between border-b p-4">
          <div>
            <h3 className="font-medium">{roles.find((r) => r.id === activeRole)?.name} icazələri</h3>
            <p className="text-xs text-muted-foreground">
              {isOwner
                ? 'Sahib bütün icazələrə malikdir və dəyişdirilə bilməz'
                : 'İcazələri açıb-bağlamaq üçün seçin'}
            </p>
          </div>
          {isOwner && (
            <Badge variant="outline" className={roleConfig.owner.className}>
              <Check className="size-3" />
              Tam giriş
            </Badge>
          )}
        </div>
        <div className="flex flex-col divide-y">
          {permissionCategories.map((cat) => (
            <div key={cat} className="p-4">
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {cat}
              </h4>
              <div className="flex flex-col gap-2">
                {permissions
                  .filter((p) => p.category === cat)
                  .map((perm) => {
                    const checked = isOwner || activePerms.includes(perm.key)
                    return (
                      <label
                        key={perm.key}
                        className={cn(
                          'flex items-center gap-2.5 rounded-md px-1 py-1',
                          !isOwner && 'cursor-pointer hover:bg-accent/50'
                        )}
                      >
                        <Checkbox
                          checked={checked}
                          disabled={isOwner}
                          onCheckedChange={() => !isOwner && togglePermission(activeRole, perm.key)}
                        />
                        <span className="text-sm">{perm.label}</span>
                        <code className="ml-auto text-[10px] text-muted-foreground">{perm.key}</code>
                      </label>
                    )
                  })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
