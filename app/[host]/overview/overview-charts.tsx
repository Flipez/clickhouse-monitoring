import ChartQueryCount from '@/components/charts/query-count'
import { SingleLineSkeleton } from '@/components/skeleton'
import { Card, CardContent } from '@/components/ui/card'
import { fetchData } from '@/lib/clickhouse'
import { getScopedLink } from '@/lib/scoped-link'
import { cn } from '@/lib/utils'
import { CircleAlert, Database } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'

export async function RunningQueries({ className }: { className?: string }) {
  const query = `SELECT COUNT() as count FROM system.processes`
  const { data } = await fetchData<
    {
      count: number
    }[]
  >({ query })

  if (!data || !data.length) return <div />

  return (
    <Card className={cn('min-w-xs rounded-sm border-0 shadow-none', className)}>
      <CardContent className="relative content-between p-0">
        <div className="absolute left-0 top-0 z-50 flex flex-row items-center gap-1 gap-2 p-4 pb-0">
          <div className="text-2xl font-bold">{data[0].count}</div>
          <Link
            className="text-xs text-muted-foreground"
            href={getScopedLink('/running-queries')}
          >
            running queries →
          </Link>
        </div>

        <ChartQueryCount
          interval="toStartOfDay"
          lastHours={24 * 7}
          className="border-0 p-0 shadow-none"
          chartClassName="min-h-[100px] h-32 shadow-none"
          chartCardContentClassName="p-0"
          showXAxis={false}
          showCartesianGrid={false}
          breakdown={''}
          showLegend={false}
          chartConfig={{
            query_count: {
              color: 'hsl(var(--chart-5))',
            },
          }}
        />
      </CardContent>
    </Card>
  )
}

type LinkCountProps = {
  query: string
  icon: React.ReactNode
  label: string
  href: string
  hideZero?: boolean
  className?: string
}

async function LinkCount({
  query,
  icon,
  label,
  href,
  hideZero = true,
  className,
}: LinkCountProps) {
  const { data } = await fetchData<{ count: number }[]>({ query })

  if (!data || data.length === 0) return null
  if (hideZero && data[0].count == 0) return null

  return (
    <Link
      className={cn(
        'inline-flex items-baseline gap-1 gap-2 p-1 opacity-80 hover:opacity-100',
        className
      )}
      href={href}
    >
      <div className="inline-flex items-baseline gap-2 text-3xl font-bold">
        {icon}
        <span className="p-0">{data[0].count}</span>
      </div>
      <div className="text-xs text-muted-foreground">{label} →</div>
    </Link>
  )
}

export async function DatabaseTableCount({
  className,
}: {
  className?: string
}) {
  return (
    <Card
      className={cn(
        'min-w-xs content-center rounded-sm shadow-none',
        className
      )}
    >
      <CardContent className="flex flex-col content-center p-2 pt-2">
        <Suspense fallback={<SingleLineSkeleton className="w-full" />}>
          <LinkCount
            query="SELECT countDistinct(database) as count FROM system.tables WHERE database != 'system'"
            icon={<Database className="opacity-70 hover:opacity-100" />}
            label="database(s)"
            href={getScopedLink('/database')}
          />
        </Suspense>
        <Suspense fallback={<SingleLineSkeleton className="w-full" />}>
          <LinkCount
            query="SELECT countDistinct(format('{}.{}', database, table)) as count FROM system.tables WHERE database != 'system'"
            icon={<Database className="opacity-70 hover:opacity-100" />}
            label="table(s)"
            href={getScopedLink('/database')}
          />
        </Suspense>
        <Suspense fallback={<SingleLineSkeleton className="w-full" />}>
          <LinkCount
            query="SELECT countDistinct(format('{}.{}', database, table)) as count FROM system.replicas WHERE is_readonly = 1"
            icon={<CircleAlert className="opacity-70 hover:opacity-100" />}
            label="readonly table(s)"
            href={getScopedLink('/readonly-tables')}
            className="text-orange-500"
            hideZero
          />
        </Suspense>
      </CardContent>
    </Card>
  )
}

export async function OverviewCharts({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-4',
        'md:grid-cols-3 lg:grid-cols-4',
        className
      )}
    >
      <RunningQueries />
      <DatabaseTableCount />
      <Card className="min-w-xs rounded-sm border-0 shadow-none" />
      <Card className="min-w-xs rounded-sm border-0 shadow-none" />
    </div>
  )
}
