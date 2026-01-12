'use client'

import { useState, useEffect } from 'react'
import { format, parse } from 'date-fns'
import { Button } from '@/components/ui/button/Button'
import { Skeleton } from '@/components/ui/skeleton/Skeleton'
import { computeSlotsForDay, type AvailabilityParams, type Slot } from '@/lib/availability'

type TimeSlotsProps = {
  selectedDate: string // YYYY-MM-DD format
  selectedTime: string | null // HH:mm format
  onTimeSelect: (time: string) => void
  onBackToDate: () => void
  availabilityParams: AvailabilityParams
}

/**
 * TimeSlots component displays available time slots for a selected date.
 * Renders slots in a responsive grid with loading and empty states.
 */
export const TimeSlots = ({
  selectedDate,
  selectedTime,
  onTimeSelect,
  onBackToDate,
  availabilityParams,
}: TimeSlotsProps) => {
  const [slots, setSlots] = useState<Slot[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadSlots = async () => {
      setIsLoading(true)
      // Simulate slight delay for better UX (shows loading state briefly)
      await new Promise((resolve) => setTimeout(resolve, 200))
      const computedSlots = computeSlotsForDay(availabilityParams, selectedDate)
      setSlots(computedSlots)
      setIsLoading(false)
    }

    loadSlots()
  }, [selectedDate, availabilityParams])

  // Format the selected date for display
  const formattedDate = format(
    parse(selectedDate, 'yyyy-MM-dd', new Date()),
    'EEEE, MMMM d, yyyy'
  )

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Available times for {formattedDate}</h3>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (slots.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Available times for {formattedDate}</h3>
        </div>
        <div className="rounded-(--radius-3) border border-dashed p-8 text-center">
          <p className="text-sm text-(--gray-11) mb-4">
            No available time slots for this day.
          </p>
          <Button variant="outline" size="sm" onClick={onBackToDate}>
            Pick another day
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Available times for {formattedDate}</h3>
        <Button variant="ghost" size="sm" onClick={onBackToDate}>
          Change date
        </Button>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
        {slots.map((slot) => {
          const slotTime = format(new Date(slot.startAtIso), 'HH:mm')
          const isSelected = selectedTime === slotTime

          return (
            <Button
              key={slot.startAtIso}
              variant={isSelected ? 'solid' : 'outline'}
              size="sm"
              onClick={() => onTimeSelect(slotTime)}
              className="w-full"
            >
              {slot.label}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
