export type TaskStatus = 'backlog' | 'todo' | 'in-progress' | 'review' | 'done'
export type TaskPriority = 'urgent' | 'high' | 'medium' | 'low'

export interface User {
  id: string
  name: string
  initials: string
  role: string
}

export interface Project {
  id: string
  name: string
  key: string
  color: string
  taskCount: number
}

export interface Task {
  id: string
  key: string
  title: string
  status: TaskStatus
  priority: TaskPriority
  assigneeId: string
  projectId: string
  dueDate: string
  labels: string[]
  progress: number
  comments: number
  subtasks: { done: number; total: number }
}

export interface ActivityItem {
  id: string
  userId: string
  action: string
  target: string
  time: string
}

export const users: User[] = [
  { id: 'u1', name: 'Aysel Məmmədova', initials: 'AM', role: 'Product Manager' },
  { id: 'u2', name: 'Rəşad Əliyev', initials: 'RƏ', role: 'Frontend Developer' },
  { id: 'u3', name: 'Nigar Həsənova', initials: 'NH', role: 'UI/UX Designer' },
  { id: 'u4', name: 'Elvin Quliyev', initials: 'EQ', role: 'Backend Developer' },
  { id: 'u5', name: 'Leyla Kərimova', initials: 'LK', role: 'QA Engineer' },
]

export const projects: Project[] = [
  { id: 'p1', name: 'Mobil Tətbiq', key: 'MOB', color: 'bg-chart-1', taskCount: 24 },
  { id: 'p2', name: 'Veb Platforma', key: 'VEB', color: 'bg-chart-2', taskCount: 38 },
  { id: 'p3', name: 'Marketinq Saytı', key: 'MRK', color: 'bg-chart-3', taskCount: 12 },
  { id: 'p4', name: 'Daxili Alətlər', key: 'DAX', color: 'bg-chart-4', taskCount: 9 },
]

export const tasks: Task[] = [
  {
    id: 't1',
    key: 'VEB-101',
    title: 'İstifadəçi qeydiyyat axınını yenidən dizayn et',
    status: 'in-progress',
    priority: 'urgent',
    assigneeId: 'u3',
    projectId: 'p2',
    dueDate: '2026-07-16',
    labels: ['Dizayn', 'Auth'],
    progress: 65,
    comments: 8,
    subtasks: { done: 3, total: 5 },
  },
  {
    id: 't2',
    key: 'VEB-102',
    title: 'Cədvəl görünüşünə virtual scroll əlavə et',
    status: 'in-progress',
    priority: 'high',
    assigneeId: 'u2',
    projectId: 'p2',
    dueDate: '2026-07-18',
    labels: ['Performans'],
    progress: 40,
    comments: 3,
    subtasks: { done: 1, total: 4 },
  },
  {
    id: 't3',
    key: 'MOB-45',
    title: 'Push bildirişlərinin inteqrasiyası',
    status: 'todo',
    priority: 'high',
    assigneeId: 'u4',
    projectId: 'p1',
    dueDate: '2026-07-20',
    labels: ['Bildiriş', 'API'],
    progress: 0,
    comments: 2,
    subtasks: { done: 0, total: 3 },
  },
  {
    id: 't4',
    key: 'MOB-46',
    title: 'Offline rejim üçün lokal keş strategiyası',
    status: 'backlog',
    priority: 'medium',
    assigneeId: 'u2',
    projectId: 'p1',
    dueDate: '2026-07-28',
    labels: ['Arxitektura'],
    progress: 0,
    comments: 1,
    subtasks: { done: 0, total: 0 },
  },
  {
    id: 't5',
    key: 'VEB-103',
    title: 'Qlobal axtarış üçün indeksləmə xidməti',
    status: 'review',
    priority: 'high',
    assigneeId: 'u4',
    projectId: 'p2',
    dueDate: '2026-07-15',
    labels: ['Axtarış', 'Backend'],
    progress: 90,
    comments: 12,
    subtasks: { done: 4, total: 4 },
  },
  {
    id: 't6',
    key: 'MRK-12',
    title: 'Qiymətləndirmə səhifəsi üçün A/B test',
    status: 'todo',
    priority: 'medium',
    assigneeId: 'u1',
    projectId: 'p3',
    dueDate: '2026-07-22',
    labels: ['Marketinq'],
    progress: 0,
    comments: 0,
    subtasks: { done: 0, total: 2 },
  },
  {
    id: 't7',
    key: 'VEB-104',
    title: 'Kanban lövhəsində drag-and-drop animasiyaları',
    status: 'done',
    priority: 'medium',
    assigneeId: 'u2',
    projectId: 'p2',
    dueDate: '2026-07-10',
    labels: ['UI'],
    progress: 100,
    comments: 5,
    subtasks: { done: 3, total: 3 },
  },
  {
    id: 't8',
    key: 'DAX-7',
    title: 'Audit loqları üçün admin paneli',
    status: 'in-progress',
    priority: 'low',
    assigneeId: 'u5',
    projectId: 'p4',
    dueDate: '2026-07-25',
    labels: ['Təhlükəsizlik'],
    progress: 30,
    comments: 4,
    subtasks: { done: 1, total: 6 },
  },
  {
    id: 't9',
    key: 'MOB-47',
    title: 'Dərin keçidlərin (deep links) dəstəyi',
    status: 'review',
    priority: 'medium',
    assigneeId: 'u2',
    projectId: 'p1',
    dueDate: '2026-07-17',
    labels: ['Naviqasiya'],
    progress: 85,
    comments: 6,
    subtasks: { done: 2, total: 2 },
  },
  {
    id: 't10',
    key: 'VEB-105',
    title: 'Rol əsaslı icazə sisteminin UI hissəsi',
    status: 'todo',
    priority: 'urgent',
    assigneeId: 'u3',
    projectId: 'p2',
    dueDate: '2026-07-16',
    labels: ['RBAC', 'Dizayn'],
    progress: 0,
    comments: 3,
    subtasks: { done: 0, total: 5 },
  },
  {
    id: 't11',
    key: 'MRK-13',
    title: 'Blog bölməsinin SEO optimallaşdırılması',
    status: 'done',
    priority: 'low',
    assigneeId: 'u1',
    projectId: 'p3',
    dueDate: '2026-07-08',
    labels: ['SEO'],
    progress: 100,
    comments: 2,
    subtasks: { done: 2, total: 2 },
  },
  {
    id: 't12',
    key: 'DAX-8',
    title: 'CI pipeline-da test müddətinin azaldılması',
    status: 'backlog',
    priority: 'medium',
    assigneeId: 'u5',
    projectId: 'p4',
    dueDate: '2026-08-01',
    labels: ['DevOps'],
    progress: 0,
    comments: 1,
    subtasks: { done: 0, total: 0 },
  },
  {
    id: 't13',
    key: 'VEB-106',
    title: 'Bildiriş mərkəzinin realtime yenilənməsi',
    status: 'in-progress',
    priority: 'high',
    assigneeId: 'u4',
    projectId: 'p2',
    dueDate: '2026-07-19',
    labels: ['Realtime'],
    progress: 55,
    comments: 7,
    subtasks: { done: 2, total: 4 },
  },
  {
    id: 't14',
    key: 'MOB-48',
    title: 'Onboarding ekranlarının illüstrasiyaları',
    status: 'done',
    priority: 'medium',
    assigneeId: 'u3',
    projectId: 'p1',
    dueDate: '2026-07-05',
    labels: ['Dizayn'],
    progress: 100,
    comments: 4,
    subtasks: { done: 4, total: 4 },
  },
]

export const activity: ActivityItem[] = [
  { id: 'a1', userId: 'u2', action: 'tapşırığı tamamladı', target: 'VEB-104', time: '12 dəq əvvəl' },
  { id: 'a2', userId: 'u3', action: 'şərh yazdı', target: 'VEB-101', time: '34 dəq əvvəl' },
  { id: 'a3', userId: 'u4', action: 'nəzərdən keçirməyə göndərdi', target: 'VEB-103', time: '1 saat əvvəl' },
  { id: 'a4', userId: 'u1', action: 'yeni tapşırıq yaratdı', target: 'MRK-12', time: '2 saat əvvəl' },
  { id: 'a5', userId: 'u5', action: 'prioriteti dəyişdi', target: 'DAX-7', time: '3 saat əvvəl' },
  { id: 'a6', userId: 'u3', action: 'fayl əlavə etdi', target: 'MOB-48', time: '5 saat əvvəl' },
]

export const weeklyCompletion = [
  { day: 'B.e', done: 6, created: 8 },
  { day: 'Ç.a', done: 9, created: 5 },
  { day: 'Ç', done: 7, created: 10 },
  { day: 'C.a', done: 11, created: 6 },
  { day: 'C', done: 8, created: 7 },
  { day: 'Ş', done: 4, created: 2 },
  { day: 'B', done: 2, created: 1 },
]

export const statusConfig: Record<TaskStatus, { label: string; dot: string }> = {
  backlog: { label: 'Backlog', dot: 'bg-muted-foreground/50' },
  todo: { label: 'Görüləcək', dot: 'bg-chart-5' },
  'in-progress': { label: 'İcrada', dot: 'bg-chart-1' },
  review: { label: 'Nəzərdən keçirilir', dot: 'bg-chart-3' },
  done: { label: 'Tamamlanıb', dot: 'bg-chart-2' },
}

export const priorityConfig: Record<TaskPriority, { label: string; className: string }> = {
  urgent: { label: 'Təcili', className: 'text-destructive' },
  high: { label: 'Yüksək', className: 'text-chart-3' },
  medium: { label: 'Orta', className: 'text-chart-1' },
  low: { label: 'Aşağı', className: 'text-muted-foreground' },
}

export const statusOrder: TaskStatus[] = ['backlog', 'todo', 'in-progress', 'review', 'done']

export function getUser(id: string): User {
  return users.find((u) => u.id === id) ?? users[0]
}

export function getProject(id: string): Project {
  return projects.find((p) => p.id === id) ?? projects[0]
}

export function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('az-AZ', { day: 'numeric', month: 'short' })
}
