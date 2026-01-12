'use client'

import { useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import type { Service } from '@/types/domain'
import { formatPrice, formatDuration } from '@/lib/format'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'

type ServicesAccordionProps = {
  services: Service[]
  businessSlug: string
}

export const ServicesAccordion = ({ services, businessSlug }: ServicesAccordionProps) => {
  const searchParams = useSearchParams()
  const serviceParam = searchParams.get('service')
  const [openValue, setOpenValue] = useState<string | undefined>(serviceParam ?? undefined)
  const hasScrolled = useRef(false)

  useEffect(() => {
    if (serviceParam && !hasScrolled.current) {
      setOpenValue(serviceParam)

      const element = document.getElementById(`service-${serviceParam}`)
      if (element) {
        requestAnimationFrame(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' })
          hasScrolled.current = true
        })
      }
    }
  }, [serviceParam])

  return (
    <Accordion type="single" collapsible value={openValue} onValueChange={setOpenValue} className="space-y-3">
      {services.map((service) => (
        <AccordionItem
          key={service.id}
          value={service.id}
          id={`service-${service.id}`}
          className="border-0 bg-(--gray-1) rounded-(--radius-3) overflow-hidden shadow-sm"
        >
          <AccordionTrigger className="px-6 hover:bg-(--gray-1)">
            <div className="flex flex-1 items-start justify-between gap-4 text-left">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-(--gray-12) text-base md:text-lg">{service.name}</h3>
                <div className="flex items-center gap-2 mt-1 text-sm text-(--gray-11)">
                  <span>{formatDuration(service.durationMin)}</span>
                  <span>•</span>
                  <span>{formatPrice(service.priceCents)}</span>
                </div>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6">
            <p className="text-(--gray-12)/80 text-sm md:text-base mb-3">{service.description}</p>
            {service.notes && (
              <p className="text-(--gray-12)/60 text-sm italic mb-4">{service.notes}</p>
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
