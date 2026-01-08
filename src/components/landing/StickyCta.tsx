'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-surface border-t border-border shadow-lg px-4 py-3 safe-area-inset-bottom"
        >
          <Button variant="solid" size="lg" onClick={handleClick} className="w-full">
            Book now at {businessName}
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
