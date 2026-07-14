'use client'

import { create } from 'zustand'
import {
  customFields as initialFields,
  users as initialUsers,
  rolePermissions as initialRolePermissions,
  type CustomFieldDef,
  type CustomFieldType,
  type User,
  type RoleId,
} from '@/lib/data'

interface SettingsState {
  fields: CustomFieldDef[]
  members: User[]
  rolePermissions: Record<RoleId, string[]>

  addField: (input: Omit<CustomFieldDef, 'id'>) => void
  updateField: (id: string, patch: Partial<CustomFieldDef>) => void
  deleteField: (id: string) => void

  addMember: (input: { name: string; email: string; roleId: RoleId }) => void
  updateMemberRole: (id: string, roleId: RoleId) => void
  removeMember: (id: string) => void

  togglePermission: (roleId: RoleId, key: string) => void
}

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('')
}

export const useSettingsStore = create<SettingsState>((set) => ({
  fields: initialFields,
  members: initialUsers,
  rolePermissions: { ...initialRolePermissions },

  addField: (input) =>
    set((s) => ({
      fields: [...s.fields, { ...input, id: `f-${Date.now()}` }],
    })),

  updateField: (id, patch) =>
    set((s) => ({
      fields: s.fields.map((f) => (f.id === id ? { ...f, ...patch } : f)),
    })),

  deleteField: (id) =>
    set((s) => ({ fields: s.fields.filter((f) => f.id !== id) })),

  addMember: (input) =>
    set((s) => ({
      members: [
        ...s.members,
        {
          id: `u-${Date.now()}`,
          name: input.name,
          initials: initials(input.name),
          role: 'Komanda üzvü',
          email: input.email,
          roleId: input.roleId,
          status: 'invited',
          lastActive: 'heç vaxt',
        },
      ],
    })),

  updateMemberRole: (id, roleId) =>
    set((s) => ({
      members: s.members.map((m) => (m.id === id ? { ...m, roleId } : m)),
    })),

  removeMember: (id) =>
    set((s) => ({ members: s.members.filter((m) => m.id !== id) })),

  togglePermission: (roleId, key) =>
    set((s) => {
      const current = s.rolePermissions[roleId] ?? []
      const next = current.includes(key)
        ? current.filter((k) => k !== key)
        : [...current, key]
      return { rolePermissions: { ...s.rolePermissions, [roleId]: next } }
    }),
}))

export type { CustomFieldType }
