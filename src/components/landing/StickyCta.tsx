'use client'

import { useEffect, useState } from 'react'
import { Calendar } from 'lucide-react'
import { Button } from '@/components/ui/Button'

type StickyCtaProps = {
  businessSlug: string
  businessName: string
}

export const StickyCta = ({ businessSlug, businessName }: StickyCtaProps) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const heroHeight = window.innerHeight * 0.6
      setIsVisible(scrollPosition > heroHeight)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleClick = () => {
    window.location.href = `/${businessSlug}/book`
  }

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 p-4 bg-white/80 backdrop-blur-lg border-t border-border shadow-lg transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
      }`}
    >
      <div className="max-w-[480px] mx-auto">
        <Button
          variant="solid"
          size="lg"
          onClick={handleClick}
          className="w-full h-12 rounded-xl shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
        >
          <Calendar className="w-5 h-5" />
          Book Appointment
        </Button>
      </div>
    </div>
  )
}
