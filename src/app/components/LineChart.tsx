'use client'

import { TrendingUp, TrendingDown } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { getGraphData } from '@/utils'

const chartConfig = {
  desktop: {
    label: 'Distance',
    color: 'hsl(var(--chart-1))',
  },
  time: {
    label: 'Time',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig

export default function Chart() {
  const { data, isSuccess } = useQuery({
    queryKey: ['chartData'],
    queryFn: getGraphData,
  })

  const chartData =
    data?.graphData.map(item => ({
      distance: item.distance,
      time: item.time,
    })) ?? []

  return (
    <Card className="w-3/5 m-auto" onClick={e => e.stopPropagation()}>
      <CardHeader>
        <CardTitle>Distance / Time Graph</CardTitle>
        <CardDescription>
          {data?.from} - {data?.to}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              interval={5}
              tickMargin={8}
              tickFormatter={value => {
                const date = new Date(value)

                const options = {
                  month: 'short', // Abbreviated month
                  day: 'numeric', // Day of the month
                  hour: '2-digit', // Hour
                  minute: '2-digit', // Minute
                } satisfies Intl.DateTimeFormatOptions

                const formattedDate = date.toLocaleString('en-US', options)

                return formattedDate
              }}
            />
            <ChartTooltip
              // cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="distance"
              type="linear"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending {(data?.change || 0) > 0 ? 'up' : 'down'} by{' '}
          {Math.abs(data?.change || 0).toFixed(1)}%{' '}
          {(data?.change || 0) > 0 ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )}
        </div>
        <div className="leading-none text-muted-foreground">
          Showing distance-time graph from the last 1000 data points
        </div>
      </CardFooter>
    </Card>
  )
}
