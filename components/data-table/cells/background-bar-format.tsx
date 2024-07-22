import { formatReadableQuantity } from '@/lib/format-readable'

export interface BackgroundBarOptions {
  numberFormat?: boolean
}

interface BackgroundBarFormatProps {
  table: any
  row: any
  columnName: string
  value: any
  options?: BackgroundBarOptions
}

export function BackgroundBarFormat({
  table,
  row,
  columnName,
  value,
  options,
}: BackgroundBarFormatProps) {
  // Disable if row count <= 1
  if (table.getCoreRowModel()?.rows?.length <= 1) return value

  // Looking at pct_{columnName} for the value
  const colName = columnName.replace('readable_', '')
  const pctColName = `pct_${colName}`
  const pct = row.original[pctColName]
  const orgValue = row.original[colName]

  if (pct === undefined) {
    console.warn(
      `${pctColName} is not defined, you should configure it in the query`
    )
    return value
  }

  const bgColor = '#F8F4F0'

  return (
    <div
      className="w-full rounded p-1"
      style={{
        background: `linear-gradient(to right,
                ${bgColor} 0%, ${bgColor} ${pct}%,
                transparent ${pct}%, transparent 100%)`,
      }}
      title={`${orgValue} (${pct}%)`}
      aria-label={`${orgValue} (${pct}%)`}
      aria-roledescription="background-bar"
    >
      {options?.numberFormat ? formatReadableQuantity(value, 'long') : value}
    </div>
  )
}
