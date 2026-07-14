import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { activity, getUser } from '@/lib/data'

export function ActivityFeed() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fəaliyyət lenti</CardTitle>
        <CardDescription>Komandanın son hərəkətləri</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-4">
          {activity.map((item) => {
            const user = getUser(item.userId)
            return (
              <li key={item.id} className="flex items-start gap-3">
                <Avatar className="size-7">
                  <AvatarFallback className="text-[10px]">{user.initials}</AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-col gap-0.5">
                  <p className="text-sm leading-relaxed">
                    <span className="font-medium">{user.name}</span>{' '}
                    <span className="text-muted-foreground">{item.action}</span>{' '}
                    <span className="font-mono text-xs">{item.target}</span>
                  </p>
                  <span className="text-xs text-muted-foreground">{item.time}</span>
                </div>
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}
