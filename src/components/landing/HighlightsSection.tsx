import { Scissors, Sparkles, Clock, Shield, Leaf, Star } from 'lucide-react'
import type { Highlight, HighlightIcon } from '@/types/domain'

type HighlightsSectionProps = {
  highlights?: Highlight[]
}

const iconMap: Record<HighlightIcon, typeof Scissors> = {
  scissors: Scissors,
  sparkles: Sparkles,
  clock: Clock,
  shield: Shield,
  leaf: Leaf,
  star: Star,
}

export const HighlightsSection = ({ highlights }: HighlightsSectionProps) => {
  if (!highlights || highlights.length === 0) {
    return null
  }

  return (
    <section className="px-4 py-2">
      <div className="grid grid-cols-2 gap-3 max-w-2xl">
        {highlights.map((highlight) => {
          const Icon = highlight.icon ? iconMap[highlight.icon] : null

          return (
            <div
              key={highlight.id}
              className="flex items-center gap-2 p-3 bg-muted rounded-lg border border-border"
            >
              {Icon ? (
                <Icon className="w-5 h-5 text-primary shrink-0" />
              ) : (
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                </div>
              )}
              <span className="text-xs font-semibold text-foreground">{highlight.label}</span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
