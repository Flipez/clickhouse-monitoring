import { type ChartProps } from '@/components/charts/chart-props'
import { ChartCard } from '@/components/generic-charts/chart-card'
import { fetchData } from '@/lib/clickhouse'
import { cn } from '@/lib/utils'

import { BarChart } from '../tremor/bar'

export async function ChartQueryDuration({
  title,
  interval = 'toStartOfHour',
  className,
  chartClassName,
  lastHours = 24 * 7,
  ...props
}: ChartProps) {
  const query = `
    SELECT ${interval}(event_time) AS event_time,
           AVG(query_duration_ms) AS query_duration_ms,
           query_duration_ms / 1000 AS query_duration_s
    FROM merge(system, '^query_log')
    WHERE type = 'QueryFinish'
          AND query_kind = 'Select'
          AND event_time >= (now() - INTERVAL ${lastHours} HOUR)
    GROUP BY event_time
    ORDER BY event_time ASC
  `
  const { data } = await fetchData<
    {
      event_time: string
      query_duration_ms: number
      query_duration_s: number
    }[]
  >({ query })

  return (
    <ChartCard title={title} className={className} sql={query}>
      <BarChart
        className={cn('h-52', chartClassName)}
        data={data}
        index="event_time"
        categories={['query_duration_s']}
        colors={['rose-200']}
        stack
        showLegend={false}
        {...props}
      />
    </ChartCard>
  )
}

export default ChartQueryDuration
