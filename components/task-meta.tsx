import { Flag } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  getUser,
  priorityConfig,
  statusConfig,
  type TaskPriority,
  type TaskStatus,
} from '@/lib/data'
import { cn } from '@/lib/utils'

export function StatusBadge({ status }: { status: TaskStatus }) {
  const config = statusConfig[status]
  return (
    <Badge variant="outline" className="gap-1.5 font-normal">
      <span className={cn('size-1.5 rounded-full', config.dot)} aria-hidden="true" />
      {config.label}
    </Badge>
  )
}

export function PriorityLabel({ priority }: { priority: TaskPriority }) {
  const config = priorityConfig[priority]
  return (
    <span className={cn('flex items-center gap-1.5 text-xs font-medium', config.className)}>
      <Flag className="size-3.5" aria-hidden="true" />
      {config.label}
    </span>
  )
}

export function AssigneeAvatar({ userId, className }: { userId: string; className?: string }) {
  const user = getUser(userId)
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Avatar className={cn('size-6', className)}>
            <AvatarFallback className="text-[10px]">{user.initials}</AvatarFallback>
          </Avatar>
        }
      />
      <TooltipContent>{user.name}</TooltipContent>
    </Tooltip>
  )
}
