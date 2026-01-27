'use client'

import { format, parse } from 'date-fns'
import { Button } from '@/components/ui/button/Button'
import { Skeleton } from '@/components/ui/skeleton/Skeleton'
import type { TimeSlot } from '@/lib/api/types'

type TimeSlotsProps = {
  selectedDate: string // YYYY-MM-DD
  selectedTime: string | null // HH:mm
  onTimeSelect: (time: string) => void
  onBackToDate: () => void
  slots: TimeSlot[]
  isLoading?: boolean
}

/** Format "14:30" → "2:30 PM" */
const formatSlotLabel = (time: string): string => {
  const [h, m] = time.split(':').map(Number)
  const d = new Date(2000, 0, 1, h, m)
  return format(d, 'h:mm a')
}

export const TimeSlots = ({
  selectedDate,
  selectedTime,
  onTimeSelect,
  onBackToDate,
  slots,
  isLoading = false,
}: TimeSlotsProps) => {
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
          const isSelected = selectedTime === slot.startTime

          return (
            <Button
              key={slot.startTime}
              variant={isSelected ? 'solid' : 'outline'}
              size="sm"
              onClick={() => onTimeSelect(slot.startTime)}
              className="w-full"
            >
              {formatSlotLabel(slot.startTime)}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
