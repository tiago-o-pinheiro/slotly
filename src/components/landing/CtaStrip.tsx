import Link from 'next/link'
import { Button } from '@/components/ui/Button'

type CtaStripProps = {
  businessSlug: string
}

export const CtaStrip = ({ businessSlug }: CtaStripProps) => {
  return (
    <div className="px-4 py-4">
      <div className="bg-muted rounded-xl p-6 flex flex-col items-center text-center gap-4 border border-border max-w-2xl mx-auto">
        <h3 className="text-lg font-bold text-foreground">Book in under a minute</h3>
        <Button asChild variant="solid" size="md" className="w-full shadow-md max-w-xs">
          <Link href={`/${businessSlug}/book`}>Book now</Link>
        </Button>
      </div>
    </div>
  )
}
