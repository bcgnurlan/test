'use client'

import { create } from 'zustand'
import {
  getProject,
  projects,
  tasks as initialTasks,
  type Task,
  type TaskPriority,
  type TaskStatus,
} from '@/lib/data'

export interface ChecklistItem {
  id: string
  text: string
  done: boolean
}

export interface SubTask {
  id: string
  title: string
  done: boolean
  assigneeId: string
}

export interface TaskDependency {
  id: string
  type: 'blocks' | 'blocked-by'
}

export interface TaskComment {
  id: string
  userId: string
  text: string
  time: string
}

export interface TaskAttachment {
  id: string
  name: string
  size: string
  userId: string
  time: string
}

export interface TaskActivity {
  id: string
  userId: string
  text: string
  time: string
}

export interface TaskDetails {
  description: string
  subtasks: SubTask[]
  dependencies: TaskDependency[]
  checklist: ChecklistItem[]
  comments: TaskComment[]
  attachments: TaskAttachment[]
  activity: TaskActivity[]
}

export interface CreateTaskInput {
  title: string
  description: string
  projectId: string
  assigneeId: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: string
}

function emptyDetails(): TaskDetails {
  return {
    description: '',
    subtasks: [],
    dependencies: [],
    checklist: [],
    comments: [],
    attachments: [],
    activity: [],
  }
}

const seededDetails: Record<string, TaskDetails> = {
  t1: {
    description:
      'Qeydiyyat axını çoxaddımlı formaya keçirilməlidir. Email təsdiqi və şifrə gücü göstəricisi əlavə olunacaq.',
    subtasks: [
      { id: 's1', title: 'Email təsdiqi ekranı', done: true, assigneeId: 'u3' },
      { id: 's2', title: 'Şifrə gücü göstəricisi', done: true, assigneeId: 'u2' },
      { id: 's3', title: 'Çoxaddımlı forma naviqasiyası', done: true, assigneeId: 'u2' },
      { id: 's4', title: 'Sosial giriş düymələri', done: false, assigneeId: 'u3' },
      { id: 's5', title: 'Yekun QA testi', done: false, assigneeId: 'u5' },
    ],
    dependencies: [
      { id: 't5', type: 'blocked-by' },
      { id: 't10', type: 'blocks' },
    ],
    checklist: [
      { id: 'c1', text: 'Wireframe hazırla', done: true },
      { id: 'c2', text: 'Yüksək dəqiqlikli dizayn', done: true },
      { id: 'c3', text: 'Prototip testi', done: true },
      { id: 'c4', text: 'Dev handoff sənədi', done: false },
      { id: 'c5', text: 'Yekun nəzərdən keçirmə', done: false },
    ],
    comments: [
      { id: 'cm1', userId: 'u1', text: 'Şifrə gücü göstəricisini mütləq əlavə edək.', time: '2 saat əvvəl' },
      { id: 'cm2', userId: 'u3', text: 'Prototip testinin nəticələrini Figma-da paylaşdım.', time: '1 saat əvvəl' },
    ],
    attachments: [
      { id: 'at1', name: 'qeydiyyat-axini-v2.fig', size: '4.2 MB', userId: 'u3', time: 'dünən' },
      { id: 'at2', name: 'test-neticeleri.pdf', size: '860 KB', userId: 'u3', time: '3 saat əvvəl' },
    ],
    activity: [
      { id: 'ac1', userId: 'u1', text: 'tapşırığı yaratdı', time: '5 gün əvvəl' },
      { id: 'ac2', userId: 'u3', text: 'statusu "İcrada" olaraq dəyişdi', time: '3 gün əvvəl' },
      { id: 'ac3', userId: 'u3', text: 'fayl əlavə etdi', time: 'dünən' },
    ],
  },
  t5: {
    description: 'MongoDB Atlas Search üçün indeksləmə xidmətinin arxitekturası və API inteqrasiyası.',
    subtasks: [
      { id: 's1', title: 'İndeks sxemi dizaynı', done: true, assigneeId: 'u4' },
      { id: 's2', title: 'Sinxronizasiya servisi', done: true, assigneeId: 'u4' },
      { id: 's3', title: 'Yük testləri', done: false, assigneeId: 'u5' },
    ],
    dependencies: [],
    checklist: [
      { id: 'c1', text: 'İndeks sxemi', done: true },
      { id: 'c2', text: 'Sinxronizasiya servisi', done: true },
      { id: 'c3', text: 'API endpoint-lər', done: true },
      { id: 'c4', text: 'Yük testi', done: true },
    ],
    comments: [
      { id: 'cm1', userId: 'u4', text: 'Yük testi nəticələri gözləniləndən yaxşıdır — 40ms p95.', time: '4 saat əvvəl' },
    ],
    attachments: [],
    activity: [
      { id: 'ac1', userId: 'u4', text: 'tapşırığı yaratdı', time: '2 həftə əvvəl' },
      { id: 'ac2', userId: 'u4', text: 'nəzərdən keçirməyə göndərdi', time: '1 saat əvvəl' },
    ],
  },
}

interface TaskStore {
  tasks: Task[]
  details: Record<string, TaskDetails>
  selectedTaskId: string | null
  nextKeyCounter: number

  openTask: (id: string) => void
  closeTask: () => void
  addTask: (input: CreateTaskInput) => string
  updateTask: (id: string, patch: Partial<Task>) => void
  deleteTasks: (ids: string[]) => void
  moveTask: (id: string, status: TaskStatus) => void
  bulkUpdate: (ids: string[], patch: Partial<Pick<Task, 'status' | 'priority' | 'assigneeId'>>) => void

  updateDescription: (id: string, description: string) => void
  addSubtask: (taskId: string, title: string, assigneeId: string) => void
  toggleSubtask: (taskId: string, subtaskId: string) => void
  deleteSubtask: (taskId: string, subtaskId: string) => void
  toggleChecklistItem: (taskId: string, itemId: string) => void
  addChecklistItem: (taskId: string, text: string) => void
  addComment: (taskId: string, userId: string, text: string) => void
  addAttachment: (taskId: string, name: string, userId: string) => void
}

function getDetails(details: Record<string, TaskDetails>, id: string): TaskDetails {
  return details[id] ?? emptyDetails()
}

function withActivity(d: TaskDetails, userId: string, text: string): TaskDetails {
  return {
    ...d,
    activity: [
      ...d.activity,
      { id: `ac-${Date.now()}`, userId, text, time: 'indicə' },
    ],
  }
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: initialTasks,
  details: seededDetails,
  selectedTaskId: null,
  nextKeyCounter: 200,

  openTask: (id) => set({ selectedTaskId: id }),
  closeTask: () => set({ selectedTaskId: null }),

  addTask: (input) => {
    const { nextKeyCounter } = get()
    const project = getProject(input.projectId) ?? projects[0]
    const id = `t-${Date.now()}`
    const task: Task = {
      id,
      key: `${project.key}-${nextKeyCounter}`,
      title: input.title,
      status: input.status,
      priority: input.priority,
      assigneeId: input.assigneeId,
      projectId: input.projectId,
      dueDate: input.dueDate,
      labels: [],
      progress: 0,
      comments: 0,
      subtasks: { done: 0, total: 0 },
    }
    set((s) => ({
      tasks: [task, ...s.tasks],
      nextKeyCounter: s.nextKeyCounter + 1,
      details: {
        ...s.details,
        [id]: withActivity(
          { ...emptyDetails(), description: input.description },
          input.assigneeId,
          'tapşırığı yaratdı'
        ),
      },
    }))
    return id
  },

  updateTask: (id, patch) =>
    set((s) => ({
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    })),

  deleteTasks: (ids) =>
    set((s) => ({
      tasks: s.tasks.filter((t) => !ids.includes(t.id)),
      selectedTaskId: s.selectedTaskId && ids.includes(s.selectedTaskId) ? null : s.selectedTaskId,
    })),

  moveTask: (id, status) =>
    set((s) => ({
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, status } : t)),
    })),

  bulkUpdate: (ids, patch) =>
    set((s) => ({
      tasks: s.tasks.map((t) => (ids.includes(t.id) ? { ...t, ...patch } : t)),
    })),

  updateDescription: (id, description) =>
    set((s) => ({
      details: { ...s.details, [id]: { ...getDetails(s.details, id), description } },
    })),

  addSubtask: (taskId, title, assigneeId) =>
    set((s) => {
      const d = getDetails(s.details, taskId)
      const subtasks = [...d.subtasks, { id: `s-${Date.now()}`, title, done: false, assigneeId }]
      const done = subtasks.filter((x) => x.done).length
      return {
        details: { ...s.details, [taskId]: { ...d, subtasks } },
        tasks: s.tasks.map((t) =>
          t.id === taskId ? { ...t, subtasks: { done, total: subtasks.length } } : t
        ),
      }
    }),

  toggleSubtask: (taskId, subtaskId) =>
    set((s) => {
      const d = getDetails(s.details, taskId)
      const subtasks = d.subtasks.map((x) => (x.id === subtaskId ? { ...x, done: !x.done } : x))
      const done = subtasks.filter((x) => x.done).length
      return {
        details: { ...s.details, [taskId]: { ...d, subtasks } },
        tasks: s.tasks.map((t) =>
          t.id === taskId ? { ...t, subtasks: { done, total: subtasks.length } } : t
        ),
      }
    }),

  deleteSubtask: (taskId, subtaskId) =>
    set((s) => {
      const d = getDetails(s.details, taskId)
      const subtasks = d.subtasks.filter((x) => x.id !== subtaskId)
      const done = subtasks.filter((x) => x.done).length
      return {
        details: { ...s.details, [taskId]: { ...d, subtasks } },
        tasks: s.tasks.map((t) =>
          t.id === taskId ? { ...t, subtasks: { done, total: subtasks.length } } : t
        ),
      }
    }),

  toggleChecklistItem: (taskId, itemId) =>
    set((s) => {
      const d = getDetails(s.details, taskId)
      const checklist = d.checklist.map((c) => (c.id === itemId ? { ...c, done: !c.done } : c))
      return {
        details: { ...s.details, [taskId]: { ...d, checklist } },
      }
    }),

  addChecklistItem: (taskId, text) =>
    set((s) => {
      const d = getDetails(s.details, taskId)
      const checklist = [...d.checklist, { id: `c-${Date.now()}`, text, done: false }]
      return {
        details: { ...s.details, [taskId]: { ...d, checklist } },
      }
    }),

  addComment: (taskId, userId, text) =>
    set((s) => {
      const d = getDetails(s.details, taskId)
      const comments = [...d.comments, { id: `cm-${Date.now()}`, userId, text, time: 'indicə' }]
      return {
        details: {
          ...s.details,
          [taskId]: withActivity({ ...d, comments }, userId, 'şərh yazdı'),
        },
        tasks: s.tasks.map((t) => (t.id === taskId ? { ...t, comments: comments.length } : t)),
      }
    }),

  addAttachment: (taskId, name, userId) =>
    set((s) => {
      const d = getDetails(s.details, taskId)
      const attachments = [
        ...d.attachments,
        {
          id: `at-${Date.now()}`,
          name,
          size: `${Math.max(1, Math.round(Math.random() * 40)) / 10} MB`,
          userId,
          time: 'indicə',
        },
      ]
      return {
        details: {
          ...s.details,
          [taskId]: withActivity({ ...d, attachments }, userId, 'fayl əlavə etdi'),
        },
      }
    }),
}))

export function useTaskDetails(taskId: string | null): TaskDetails {
  const details = useTaskStore((s) => (taskId ? s.details[taskId] : undefined))
  return details ?? emptyDetails()
}
