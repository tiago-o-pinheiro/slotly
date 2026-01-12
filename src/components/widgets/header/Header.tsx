'use client'

import Link from 'next/link'
import { ChevronLeft, Phone, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/classNames'

type HeaderVariant = 'landing' | 'booking' | 'simple'

type BaseHeaderProps = {
  className?: string
}

type LandingHeaderProps = BaseHeaderProps & {
  variant: 'landing'
  businessName: string
  category: string
  phone?: string
  address?: string
}

type BookingHeaderProps = BaseHeaderProps & {
  variant: 'booking'
  backHref: string
  backLabel?: string
  title: string
  subtitle?: string
  currentStep?: number
  totalSteps?: number
}

type SimpleHeaderProps = BaseHeaderProps & {
  variant: 'simple'
  backHref: string
  backLabel?: string
  title: string
}

export type HeaderProps = LandingHeaderProps | BookingHeaderProps | SimpleHeaderProps

const ProgressBar = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => {
  return (
    <div className="flex gap-2 px-4 pb-3">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={index}
          className={cn(
            'h-1 flex-1 rounded-full transition-colors duration-300',
            index < currentStep ? 'bg-(--accent-9)' : 'bg-(--gray-4)'
          )}
        />
      ))}
    </div>
  )
}

export const Header = (props: HeaderProps) => {
  const { className } = props

  if (props.variant === 'landing') {
    const { businessName, category, phone, address } = props

    return (
      <header
        className={cn(
          'sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-(--gray-6)/50 shadow-sm',
          className
        )}
      >
        <div className="mx-auto max-w-[1100px] flex items-center justify-between h-16 px-4">
          <div className="flex flex-col justify-center">
            <h2 className="text-(--gray-12) text-lg font-bold leading-tight">{businessName}</h2>
            <Badge variant="secondary" size="sm" className="w-fit mt-0.5 text-xs">
              {category}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            {phone && (
              <Button asChild variant="ghost" size="sm" className="size-10 rounded-full p-0">
                <a href={`tel:${phone}`} aria-label="Call business">
                  <Phone className="w-5 h-5" />
                </a>
              </Button>
            )}
            {address && (
              <Button asChild variant="ghost" size="sm" className="size-10 rounded-full p-0">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Get directions"
                >
                  <MapPin className="w-5 h-5" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </header>
    )
  }

  if (props.variant === 'booking') {
    const { backHref, backLabel, title, subtitle, currentStep, totalSteps } = props

    return (
      <header
        className={cn(
          'sticky top-0 z-50 bg-(--color-panel-solid) border-b border-(--gray-6)',
          className
        )}
      >
        <div className="relative flex items-center justify-center h-16 px-4">
          {/* Back button - absolute left */}
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="absolute left-2 size-10 rounded-full p-0"
          >
            <Link href={backHref} aria-label={backLabel || 'Go back'}>
              <ChevronLeft className="w-6 h-6" />
            </Link>
          </Button>

          {/* Center content */}
          <div className="flex flex-col items-center justify-center text-center">
            <span className="text-(--gray-12) text-base font-semibold">{title}</span>
            {subtitle && (
              <span className="text-(--gray-11) text-sm">{subtitle}</span>
            )}
          </div>
        </div>

        {/* Progress bar */}
        {currentStep !== undefined && totalSteps !== undefined && (
          <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
        )}
      </header>
    )
  }

  // Simple variant
  const { backHref, backLabel, title } = props

  return (
    <header
      className={cn(
        'sticky top-0 z-50 bg-(--color-panel-solid) border-b border-(--gray-6)',
        className
      )}
    >
      <div className="mx-auto max-w-[1100px] px-4 py-4">
        <Button asChild variant="ghost" size="sm" className="gap-2">
          <Link href={backHref}>
            <ChevronLeft className="w-4 h-4" />
            {backLabel || title}
          </Link>
        </Button>
      </div>
    </header>
  )
}
