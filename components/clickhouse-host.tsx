import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

import {
  fetchData,
  getClickHouseHost,
  getClickHouseHosts,
} from '@/lib/clickhouse'
import { getHost } from '@/lib/utils'
import Link from 'next/link'
import { Suspense } from 'react'

const Online = ({ title }: { title: string[] }) => (
  <TooltipProvider delayDuration={0}>
    <Tooltip>
      <TooltipTrigger asChild>
        <span className='relative flex size-2 cursor-pointer'>
          <span className='absolute inline-flex size-full animate-ping rounded-full bg-sky-400 opacity-75'></span>
          <span className='relative inline-flex size-2 rounded-full bg-sky-500'></span>
        </span>
      </TooltipTrigger>
      <TooltipContent side='bottom'>
        {title.map((t, i) => (
          <p key={i}>{t}</p>
        ))}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
)

const Offline = ({ title }: { title: string[] }) => (
  <TooltipProvider delayDuration={0}>
    <Tooltip>
      <TooltipTrigger asChild>
        <span className='relative flex size-2 cursor-pointer'>
          <span className='absolute inline-flex size-full rounded-full bg-red-400'></span>
        </span>
      </TooltipTrigger>
      <TooltipContent side='bottom'>
        {title.map((t, i) => (
          <p key={i}>{t}</p>
        ))}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
)

const HostStatus = async () => {
  let isOnline
  let title = []
  try {
    const { data: detail } = await fetchData<
      { uptime: string; hostName: string; version: string }[]
    >({
      query: `
        SELECT
          formatReadableTimeDelta(uptime()) as uptime,
          hostName() as hostName,
          version() as version
      `,
    })

    isOnline = true
    title = [
      `Host: ${detail[0].hostName}`,
      `Online: ${detail[0].uptime}`,
      `Version: ${detail[0].version}`,
    ]
  } catch (e) {
    isOnline = false
    title = [`Offline: ${e}`]
  }

  return isOnline ? <Online title={title} /> : <Offline title={title} />
}

export async function ClickHouseHost() {
  const hosts = getClickHouseHosts()

  if (!hosts) return null

  if (hosts.length === 1) {
    return (
      <div className='flex flex-row items-center gap-2'>
        {getHost(hosts[0])}
        <Suspense>
          <HostStatus />
        </Suspense>
      </div>
    )
  }

  return (
    <div>
      <Select>
        <SelectTrigger className='border-0 shadow-none'>
          <SelectValue placeholder={getClickHouseHost()} />
        </SelectTrigger>
        <SelectContent>
          {hosts.map((host, id) => (
            <SelectItem key={host} value={host}>
              <Link
                href={`/${id}/overview`}
                className='flex flex-row items-center gap-2'
              >
                {getHost(host)}
                <Suspense>
                  <HostStatus />
                </Suspense>
              </Link>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
