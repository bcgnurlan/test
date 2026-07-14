'use client'

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { weeklyCompletion } from '@/lib/data'

const chartConfig = {
  done: {
    label: 'Tamamlanan',
    color: 'var(--chart-1)',
  },
  created: {
    label: 'Yaradılan',
    color: 'var(--chart-5)',
  },
} satisfies ChartConfig

export function WeeklyChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Həftəlik fəaliyyət</CardTitle>
        <CardDescription>Bu həftə yaradılan və tamamlanan tapşırıqlar</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <BarChart accessibilityLayer data={weeklyCompletion}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="day" tickLine={false} tickMargin={8} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="done" fill="var(--color-done)" radius={4} />
            <Bar dataKey="created" fill="var(--color-created)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
