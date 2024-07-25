import dayjs from '@/lib/dayjs'

interface DurationFormatProps {
  value: any
}

export function DurationFormat({ value }: DurationFormatProps) {
  let humanized = value
  const seconds = parseFloat(value as string)

  if (!Number.isNaN(seconds)) {
    humanized = dayjs
      .duration({ seconds: parseFloat(value as string) })
      .humanize(seconds < 0 ? true : false) // 2 minutes "ago" for negative values
  }

  return <span title={value as string}>{humanized}</span>
}
