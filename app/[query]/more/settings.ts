import { ColumnFormat } from '@/types/column-format'
import { type QueryConfig } from '@/types/query-config'

export const settingsConfig: QueryConfig = {
  name: 'settings',
  sql: `
      SELECT *
      FROM system.settings
      ORDER BY name
  `,
  columns: ['name', 'value', 'changed', 'description', 'default'],
  columnFormats: {
    name: ColumnFormat.Code,
    changed: ColumnFormat.Boolean,
    value: ColumnFormat.Code,
    default: ColumnFormat.Code,
  },
  defaultParams: {
    changed: '0',
  },
  filterParamPresets: [
    {
      name: 'Changed only',
      key: 'changed',
      sql: 'changed = 1',
    },
  ],
}
