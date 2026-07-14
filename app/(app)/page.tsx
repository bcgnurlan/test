import { StatCards } from '@/components/dashboard/stat-cards'
import { WeeklyChart } from '@/components/dashboard/weekly-chart'
import { RecentTasks } from '@/components/dashboard/recent-tasks'
import { ActivityFeed } from '@/components/dashboard/activity-feed'

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold text-balance">Xoş gəlmisiniz, Aysel</h2>
        <p className="text-sm text-muted-foreground">
          Komandanızın bu həftəki işlərinin icmalı.
        </p>
      </div>
      <StatCards />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <WeeklyChart />
          <RecentTasks />
        </div>
        <ActivityFeed />
      </div>
    </div>
  )
}
