import { LinkProps } from 'next/link'

import { type Action } from '@/components/data-table/cells/actions/types'
import { type BackgroundBarOptions } from '@/components/data-table/cells/background-bar-format'
import { type CodeDialogOptions } from '@/components/data-table/cells/code-dialog-format'
import { type CodeToggleOptions } from '@/components/data-table/cells/code-toggle-format'
import { type ColoredBadgeOptions } from '@/components/data-table/cells/colored-badge-format'
import { type HoverCardOptions } from '@/components/data-table/cells/hover-card-format'
import { MarkdownFormatOptions } from '@/components/data-table/cells/markdown-format'
import { type TextFormatOptions } from '@/components/data-table/cells/text-format'

export enum ColumnFormat {
  BackgroundBar = 'background-bar',
  ColoredBadge = 'colored-badge',
  RelatedTime = 'related-time',
  NumberShort = 'number-short',
  CodeToggle = 'code-toggle',
  CodeDialog = 'code-dialog',
  HoverCard = 'hover-card',
  Duration = 'duration',
  Markdown = 'markdown',
  Boolean = 'boolean',
  Action = 'action',
  Number = 'number',
  Badge = 'badge',
  Code = 'code',
  Link = 'link',
  Text = 'text',
  None = 'none',
}

export type ColumnFormatWithArgs =
  | [ColumnFormat.Action, Action[]]
  | [ColumnFormat.Link, LinkProps & { className?: string }]
  | [ColumnFormat.Text, TextFormatOptions]
  | [ColumnFormat.Markdown, MarkdownFormatOptions]
  | [ColumnFormat.ColoredBadge, ColoredBadgeOptions]
  | [ColumnFormat.HoverCard, HoverCardOptions]
  | [ColumnFormat.CodeDialog, CodeDialogOptions]
  | [ColumnFormat.CodeToggle, CodeToggleOptions]
  | [ColumnFormat.BackgroundBar, BackgroundBarOptions]

// Union of all possible format options
export type ColumnFormatOptions = ColumnFormatWithArgs[1]
