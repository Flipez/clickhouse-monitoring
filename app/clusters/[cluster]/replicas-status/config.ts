import { ColumnFormat } from '@/types/column-format'
import { type QueryConfig } from '@/types/query-config'

export type Row = {
  host: string
  readable_total_rows: string
  readable_total_bytes: string
  readable_primary_key_size: string
  readable_marks_bytes: string
  part_count: number
  last_modification_time: string
}

export const config: QueryConfig = {
  name: 'count-across-replicas',
  description: 'Count across replicas for all tables in the cluster',
  sql: `
      SELECT
          hostName() AS host,

          sum(rows) AS total_rows,
          formatReadableQuantity(total_rows) AS readable_total_rows,
          (100 * total_rows / max(total_rows) OVER ()) AS pct_total_rows,

          sum(bytes) AS total_bytes,
          formatReadableSize(sum(bytes)) AS readable_total_bytes,
          (100 * total_bytes / max(total_bytes) OVER ()) AS pct_total_bytes,

          countDistinct(database) AS database_count,
          countDistinct(database || table) AS table_count,

          countIf(active) as active_part_count,
          (100 * active_part_count / max(active_part_count) OVER ()) AS pct_active_part_count,

          count() as all_part_count,
          (100 * all_part_count / max(all_part_count) OVER ()) AS pct_all_part_count,

          sum(primary_key_size) AS primary_key_size,
          formatReadableSize(primary_key_size) AS readable_primary_key_size,
          (100 * primary_key_size / max(primary_key_size) OVER ()) AS pct_primary_key_size,

          sum(marks_bytes) AS marks_bytes,
          formatReadableSize(marks_bytes) AS readable_marks_bytes,
          (100 * marks_bytes / max(marks_bytes) OVER ()) AS pct_marks_bytes,

          max(modification_time) AS last_modification_time

      FROM clusterAllReplicas({cluster: String}, system.parts)
      WHERE active
      GROUP BY host
      ORDER BY
          1 ASC,
          2 DESC
  `,
  columns: [
    'host',
    'readable_total_rows',
    'readable_total_bytes',
    'readable_primary_key_size',
    'readable_marks_bytes',
    'active_part_count',
    'all_part_count',
    'last_modification_time',
    'database_count',
    'table_count',
  ],
  columnFormats: {
    readable_total_rows: ColumnFormat.BackgroundBar,
    readable_total_bytes: ColumnFormat.BackgroundBar,
    readable_primary_key_size: ColumnFormat.BackgroundBar,
    readable_marks_bytes: ColumnFormat.BackgroundBar,
    active_part_count: ColumnFormat.BackgroundBar,
    all_part_count: ColumnFormat.BackgroundBar,
    database_count: ColumnFormat.BackgroundBar,
    table_count: ColumnFormat.BackgroundBar,
  },
}
