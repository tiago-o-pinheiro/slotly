import Link from 'next/link'
import { Button } from '@/components/ui/button'

type CtaStripProps = {
  businessSlug: string
}

export const CtaStrip = ({ businessSlug }: CtaStripProps) => {
  return (
    <div className="px-4 py-4">
      <div className="bg-(--gray-3) rounded-(--radius-4) p-6 flex flex-col items-center text-center gap-4 border border-(--gray-6) max-w-2xl mx-auto">
        <h3 className="text-lg font-bold text-(--gray-12)">Ready to book?</h3>
        <Button asChild variant="solid" size="md" className="w-full shadow-md max-w-xs">
          <Link href={`/${businessSlug}/book`}>Choose a service</Link>
        </Button>
      </div>
    </div>
  )
}
