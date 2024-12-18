import { DataTable } from '@/components/data-table/data-table'
import { fetchData } from '@/lib/clickhouse'
import { ColumnFormat } from '@/types/column-format'
import { type QueryConfig } from '@/types/query-config'

interface PageProps {
  params: Promise<{
    cluster: string
  }>
}

export default async function Page({ params }: PageProps) {
  const { cluster } = await params
  const { data: replicas } = await fetchData<{ replica: string }[]>({
    query: `SELECT hostName() as replica FROM clusterAllReplicas({cluster: String}) ORDER BY 1`,
    query_params: { cluster },
  })
  console.log('Replicas', replicas)

  if (replicas.length === 0) {
    return <div>No replicas found in cluster: {cluster}</div>
  }

  const query = `
    SELECT
      format('{}.{}', database, table) as table,
      ${replicas.map(({ replica }) => `countIf(active AND hostName() = '${replica}') as \`${replica}\``).join(', ')},
      ${replicas.map(({ replica }) => `formatReadableQuantity(\`${replica}\`) as \`readable_${replica}\``).join(', ')},
      ${replicas.map(({ replica }) => `(100 * \`${replica}\` / max(\`${replica}\`) OVER ()) as \`pct_${replica}\``).join(', ')}
    FROM clusterAllReplicas({cluster: String}, system.parts)
    WHERE database NOT IN ('system')
    GROUP BY 1
    ORDER BY 2 DESC
  `

  const queryConfig: QueryConfig = {
    name: 'count-across-replicas',
    description: 'Part count across replicas',
    sql: query,
    columns: ['table', ...replicas.map(({ replica }) => `readable_${replica}`)],
    columnFormats: {
      ...replicas
        .map(({ replica }) => ({
          [`readable_${replica}`]: ColumnFormat.BackgroundBar,
        }))
        .reduce((acc, val) => ({ ...acc, ...val }), {}),
    },
  }

  const { data } = await fetchData<
    {
      table: string
      [replica: string]: string | number
    }[]
  >({
    query: queryConfig.sql,
    query_params: { cluster },
  })

  return (
    <DataTable
      title={`Count of active parts across replicas in the '${cluster}' cluster`}
      queryConfig={queryConfig}
      data={data}
      context={{}}
    />
  )
}
