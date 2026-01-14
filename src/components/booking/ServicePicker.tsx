'use client'

import { useRouter } from 'next/navigation'
import type { Service } from '@/types/domain'
import { formatPrice, formatDuration } from '@/lib/format'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

type ServicePickerProps = {
  services: Service[]
  businessSlug: string
  onServiceSelect?: (service: Service) => void
}

export const ServicePicker = ({ services, businessSlug, onServiceSelect }: ServicePickerProps) => {
  const router = useRouter()

  const handleServiceSelect = (service: Service) => {
    if (onServiceSelect) {
      onServiceSelect(service)
    } else {
      router.replace(`/${businessSlug}/book?service=${service.id}`)
    }
  }

  return (
    <div className="space-y-3">
      {services.map((service) => (
        <Card key={service.id} className="cursor-pointer transition-all hover:border-(--accent-6)">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-(--gray-12) text-base md:text-lg mb-1">
                  {service.name}
                </h3>
                <p className="text-sm text-(--gray-11) mb-3 line-clamp-2">{service.description}</p>
                <div className="flex items-center gap-3 text-sm text-(--gray-11)">
                  <span>{formatDuration(service.durationMin)}</span>
                  <span className="text-(--gray-8)">•</span>
                  <span className="font-medium text-(--accent-11)">{formatPrice(service.priceCents)}</span>
                </div>
              </div>
              <Button
                variant="solid"
                size="sm"
                onClick={() => handleServiceSelect(service)}
                className="shrink-0"
              >
                Select
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
