import { type ChartProps } from '@/components/charts/chart-props'
import { AreaChart } from '@/components/tremor/area'
import { fetchData } from '@/lib/clickhouse'

import { ChartCard } from '../generic-charts/chart-card'

export async function ChartCPUUsage({
  title,
  interval = 'toStartOfTenMinutes',
  lastHours = 24,
  className,
}: ChartProps) {
  const query = `
    SELECT ${interval}(event_time) AS event_time,
           avg(ProfileEvent_OSCPUVirtualTimeMicroseconds) / 1000000 as avg_cpu
    FROM merge(system, '^metric_log')
    WHERE event_time >= (now() - INTERVAL ${lastHours} HOUR)
    GROUP BY 1
    ORDER BY 1`
  const { data } = await fetchData<{ event_time: string; avg_cpu: number }[]>({
    query,
  })

  return (
    <ChartCard title={title} className={className} sql={query}>
      <AreaChart
        data={data}
        index="event_time"
        categories={['avg_cpu']}
        className={className}
      />
    </ChartCard>
  )
}

export default ChartCPUUsage
