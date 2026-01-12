import { Scissors, Sparkles, Clock, Shield, Leaf, Star, LucideIcon } from 'lucide-react'
import type { Highlight, HighlightIcon } from '@/types/domain'

type HighlightsSectionProps = {
  highlights?: Highlight[]
}

const iconMap: Record<HighlightIcon, LucideIcon> = {
  scissors: Scissors,
  sparkles: Sparkles,
  clock: Clock,
  shield: Shield,
  leaf: Leaf,
  star: Star,
}

const HighlightIcon = ({ iconName }: { iconName?: HighlightIcon }) => {
  const Icon = iconName ? iconMap[iconName] : null

  if (Icon) {
    return <Icon className="w-5 h-5 text-(--accent-11) shrink-0" />
  }

  return (
    <div className="w-5 h-5 rounded-(--radius-full) bg-(--accent-4) flex items-center justify-center shrink-0">
      <div className="w-2.5 h-2.5 rounded-(--radius-full) bg-(--accent-9)" />
    </div>
  )
}

export const HighlightsSection = ({ highlights }: HighlightsSectionProps) => {
  if (!highlights || highlights.length === 0) {
    return null
  }

  return (
    <section className="px-4 py-2">
      <div className="grid grid-cols-2 gap-3 max-w-2xl">
        {highlights.map((highlight) => (
          <div
            key={highlight.id}
            className="flex items-center gap-2 p-3 bg-(--gray-3) rounded-(--radius-3) border border-(--gray-6)"
          >
            <HighlightIcon iconName={highlight.icon} />
            <span className="text-xs font-semibold text-(--gray-12)">{highlight.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
