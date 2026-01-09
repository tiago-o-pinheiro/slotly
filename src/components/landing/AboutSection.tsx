import type { About, Highlight } from '@/types/domain'

type AboutSectionProps = {
  about?: About
  businessName: string
  highlights?: Highlight[]
}

export const AboutSection = ({ about, businessName, highlights }: AboutSectionProps) => {
  if (!about || (!about.title && !about.description)) {
    return null
  }

  return (
    <section className="px-4 py-6">
      <h3 className="text-foreground text-lg font-bold mb-4">About Us</h3>
      <div className="flex flex-col gap-4 max-w-2xl">
        {about.description && (
          <p className="text-foreground/70 text-sm leading-relaxed">{about.description}</p>
        )}
        {highlights && highlights.length > 0 && (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
            <h4 className="font-bold text-primary mb-3 text-sm uppercase tracking-wide">
              Why people choose us
            </h4>
            <ul className="space-y-3">
              {highlights.slice(0, 3).map((highlight) => (
                <li key={highlight.id} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <span className="text-sm text-foreground/80">{highlight.label}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}
