'use client'

import { create } from 'zustand'
import {
  projects as initialProjects,
  type Project,
  type ProjectStatus,
} from '@/lib/data'

const colorPalette = ['bg-chart-1', 'bg-chart-2', 'bg-chart-3', 'bg-chart-4', 'bg-chart-5']

export interface CreateProjectInput {
  name: string
  key: string
  description: string
  status: ProjectStatus
  leadId: string
  dueDate: string
}

interface ProjectStore {
  projects: Project[]
  addProject: (input: CreateProjectInput) => string
}

function today() {
  return new Date().toISOString().slice(0, 10)
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: initialProjects,

  addProject: (input) => {
    const id = `p-${Date.now()}`
    const count = get().projects.length
    const project: Project = {
      id,
      name: input.name,
      key: input.key.toUpperCase(),
      color: colorPalette[count % colorPalette.length],
      taskCount: 0,
      description: input.description,
      status: input.status,
      progress: 0,
      leadId: input.leadId,
      memberIds: [input.leadId],
      startDate: today(),
      dueDate: input.dueDate,
    }
    set((s) => ({ projects: [project, ...s.projects] }))
    return id
  },
}))
