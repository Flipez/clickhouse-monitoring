export const listDatabases = `
  WITH tables_from_tables AS (
    SELECT
        database,
        name AS table,
        engine
    FROM system.tables
  )
  SELECT d.name as name,
         countDistinct(t.table) as count
  FROM system.databases AS d
  JOIN tables_from_tables AS t USING database
  WHERE d.engine != 'Memory'
  GROUP BY d.name
`

export const listTables = `
  WITH tables_from_parts AS (
    SELECT
        database,
        table,
        engine,
        sum(data_compressed_bytes) as compressed,
        sum(data_uncompressed_bytes) AS uncompressed,
        formatReadableSize(compressed) AS readable_compressed,
        formatReadableSize(uncompressed) AS readable_uncompressed,
        round(uncompressed / compressed, 2) AS compr_rate,
        sum(rows) AS total_rows,
        formatReadableQuantity(sum(rows)) AS readable_total_rows,
        count() AS parts_count,
        compressed / parts_count AS avg_part_size,
        formatReadableSize(avg_part_size) AS readable_avg_part_size,
        round(100 * avg_part_size / MAX(avg_part_size) OVER (), 2) AS pct_avg_part_size
    FROM system.parts
    WHERE active = 1 AND database = {database: String}
    GROUP BY database,
             table,
             engine
  ),

  detached_parts AS (
    SELECT
        database,
        table,
        count() AS detached_parts_count,
        sum(bytes_on_disk) AS detached_bytes_on_disk,
        formatReadableSize(detached_bytes_on_disk) AS readable_detached_bytes_on_disk
    FROM system.detached_parts
    GROUP BY database, table
  ),

  tables_from_tables AS (
    SELECT database,
           name AS table,
           engine,
           comment
    FROM system.tables
    WHERE database = {database: String}
  ),

  summary AS (
    SELECT tables_from_tables.*,
           tables_from_parts.*
    FROM tables_from_tables
    LEFT JOIN tables_from_parts USING database, table
  ),

  with_detached_parts AS (
    SELECT summary.*,
           detached_parts.*
    FROM summary
    LEFT JOIN detached_parts USING database, table
  )

  SELECT *,
    round(100 * compressed / max(compressed) OVER ()) AS pct_compressed,
    round(100 * uncompressed / max(uncompressed) OVER ()) AS pct_uncompressed,
    round(100 * total_rows / max(total_rows) OVER ()) AS pct_total_rows,
    round(100 * parts_count / max(parts_count) OVER ()) AS pct_parts_count,
    round(100 * compr_rate / max(compr_rate) OVER ()) AS pct_compr_rate,
    database || '.' || table as action
  FROM with_detached_parts
  ORDER BY database, compressed DESC
`
