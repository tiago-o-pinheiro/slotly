'use client'

import { useRouter } from 'next/navigation'
import type { Service } from '@/types/domain'
import { formatPrice, formatDuration } from '@/lib/format'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

type ServicePickerProps = {
  services: Service[]
  businessSlug: string
}

export const ServicePicker = ({ services, businessSlug }: ServicePickerProps) => {
  const router = useRouter()

  const handleServiceSelect = (serviceId: string) => {
    router.replace(`/${businessSlug}/book?service=${serviceId}`)
  }

  return (
    <div className="space-y-3">
      {services.map((service) => (
        <Card key={service.id} className="cursor-pointer transition-all hover:border-primary/50">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground text-base md:text-lg mb-1">
                  {service.name}
                </h3>
                <p className="text-sm text-foreground/70 mb-3 line-clamp-2">{service.description}</p>
                <div className="flex items-center gap-3 text-sm text-foreground/70">
                  <span>{formatDuration(service.durationMin)}</span>
                  <span className="text-foreground/40">•</span>
                  <span className="font-medium text-primary">{formatPrice(service.priceCents)}</span>
                </div>
              </div>
              <Button
                variant="solid"
                size="sm"
                onClick={() => handleServiceSelect(service.id)}
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
