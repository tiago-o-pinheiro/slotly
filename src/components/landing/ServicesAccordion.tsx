'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import type { Service } from '@/types/domain'
import { formatPrice, formatDuration } from '@/lib/format'
import { Button } from '@/components/ui/Button'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/Accordion'

type ServicesAccordionProps = {
  services: Service[]
  businessSlug: string
}

export const ServicesAccordion = ({ services, businessSlug }: ServicesAccordionProps) => {
  const searchParams = useSearchParams()
  const serviceParam = searchParams.get('service')
  const [openValue, setOpenValue] = useState<string | undefined>(serviceParam ?? undefined)

  // Handle deep-linking: open accordion item and scroll into view
  useEffect(() => {
    if (serviceParam) {
      setOpenValue(serviceParam)

      // Small delay to ensure DOM is ready
      setTimeout(() => {
        const element = document.getElementById(`service-${serviceParam}`)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 100)
    }
  }, [serviceParam])

  return (
    <Accordion type="single" collapsible value={openValue} onValueChange={setOpenValue}>
      {services.map((service) => (
        <AccordionItem key={service.id} value={service.id} id={`service-${service.id}`}>
          <AccordionTrigger className="px-4">
            <div className="flex flex-1 items-start justify-between gap-4 text-left">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground text-base md:text-lg">{service.name}</h3>
                <div className="flex items-center gap-3 mt-1 text-sm text-foreground/70">
                  <span>{formatDuration(service.durationMin)}</span>
                  <span className="text-foreground/40">•</span>
                  <span className="font-medium text-primary">{formatPrice(service.priceCents)}</span>
                </div>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4">
            <p className="text-foreground/80 text-sm md:text-base mb-3">{service.description}</p>
            {service.notes && (
              <p className="text-foreground/60 text-sm italic mb-4">{service.notes}</p>
            )}
            <Button asChild variant="solid" size="md">
              <Link href={`/${businessSlug}/book?service=${service.id}`}>
                Book this
              </Link>
            </Button>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
