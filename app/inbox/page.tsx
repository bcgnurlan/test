import { AtSign, MessageSquare, UserPlus } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { getUser } from '@/lib/data'

const notifications = [
  {
    id: 'n1',
    userId: 'u3',
    icon: AtSign,
    text: 'sizi VEB-101 tapşırığında qeyd etdi',
    time: '10 dəq əvvəl',
    unread: true,
  },
  {
    id: 'n2',
    userId: 'u4',
    icon: UserPlus,
    text: 'sizə VEB-103 tapşırığını təyin etdi',
    time: '1 saat əvvəl',
    unread: true,
  },
  {
    id: 'n3',
    userId: 'u2',
    icon: MessageSquare,
    text: 'VEB-104 tapşırığına şərh yazdı',
    time: '3 saat əvvəl',
    unread: true,
  },
  {
    id: 'n4',
    userId: 'u5',
    icon: MessageSquare,
    text: 'DAX-7 tapşırığında sizə cavab verdi',
    time: 'dünən',
    unread: false,
  },
]

export default function InboxPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-semibold">Gələnlər</h2>
        <Badge>3 yeni</Badge>
      </div>
      <Card>
        <CardContent className="p-0">
          <ul className="flex flex-col">
            {notifications.map((n) => {
              const user = getUser(n.userId)
              return (
                <li
                  key={n.id}
                  className="flex items-start gap-3 border-b px-4 py-3 last:border-b-0 hover:bg-accent/50"
                >
                  <Avatar className="size-8">
                    <AvatarFallback className="text-xs">{user.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <p className="text-sm leading-relaxed">
                      <span className="font-medium">{user.name}</span>{' '}
                      <span className="text-muted-foreground">{n.text}</span>
                    </p>
                    <span className="text-xs text-muted-foreground">{n.time}</span>
                  </div>
                  {n.unread && (
                    <span className="mt-2 size-2 shrink-0 rounded-full bg-primary" aria-label="Oxunmayıb" />
                  )}
                </li>
              )
            })}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
