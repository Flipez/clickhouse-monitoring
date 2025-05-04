import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { formatQuery } from '@/lib/format-readable'

export interface CodeToggleOptions {
  max_truncate?: number
  hide_query_comment?: boolean
}

interface CodeToggleFormatProps {
  row: any
  value: any
  options?: CodeToggleOptions
}

const CODE_TRUNCATE_LENGTH = 50

export function CodeToggleFormat({
  row,
  value,
  options,
}: CodeToggleFormatProps) {
  const truncate_length = options?.max_truncate || CODE_TRUNCATE_LENGTH

  if (value.length < truncate_length) {
    return <code>{value}</code>
  }

  let code = formatQuery({
    query: value,
    comment_remove: options?.hide_query_comment,
    truncate: truncate_length,
  })

  return (
    <Accordion
      type="single"
      defaultValue={row.getIsExpanded() ? 'code' : undefined}
      collapsible={row.getIsExpanded()}
      onValueChange={(value) => row.toggleExpanded(value === 'code')}
    >
      <AccordionItem value="code" className="border-0">
        <AccordionTrigger className="py-0 hover:no-underline">
          <code className="line-clamp-2 truncate font-normal break-words">
            {code}
          </code>
        </AccordionTrigger>
        <AccordionContent>
          <code className="font-normal whitespace-pre-wrap text-stone-500">
            {value}
          </code>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
