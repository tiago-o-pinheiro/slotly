import type { About, Highlight } from '@/types/domain'

type AboutSectionProps = {
  about?: About
  businessName: string
  highlights?: Highlight[]
}

const BulletPoint = () => (
  <div className="w-5 h-5 rounded-(--radius-full) bg-(--accent-a3) flex items-center justify-center shrink-0 mt-0.5">
    <div className="w-2 h-2 rounded-(--radius-full) bg-(--accent-9)" />
  </div>
)

export const AboutSection = ({ about, highlights }: AboutSectionProps) => {
  if (!about || (!about.title && !about.description)) {
    return null
  }

  const displayHighlights = highlights?.slice(0, 3) || []

  return (
    <section className="px-4 py-6">
      <h3 className="text-(--gray-12) text-lg font-bold mb-4">About Us</h3>
      <div className="flex flex-col gap-4 max-w-2xl">
        {about.description && (
          <p className="text-(--gray-11) text-sm leading-relaxed">{about.description}</p>
        )}
        {displayHighlights.length > 0 && (
          <div className="bg-(--accent-a2) border border-(--accent-6) rounded-(--radius-4) p-5">
            <h4 className="font-bold text-(--accent-11) mb-3 text-sm uppercase tracking-wide">
              Why people choose us
            </h4>
            <ul className="space-y-3">
              {displayHighlights.map((highlight) => (
                <li key={highlight.id} className="flex items-start gap-3">
                  <BulletPoint />
                  <span className="text-sm text-(--gray-11)">{highlight.label}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}
