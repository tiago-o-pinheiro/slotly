'use client'

import { DayPicker } from 'react-day-picker'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { format, parse, addDays, startOfDay } from 'date-fns'
import { dayPickerClassNames } from './dayPickerStyles'
import type { AvailabilityParams } from '@/lib/availability'
import { computeAvailableDays } from '@/lib/availability'

type DatePickerProps = {
  selectedDate: string | null // YYYY-MM-DD format
  onDateSelect: (dateIso: string) => void
  availabilityParams: AvailabilityParams
  disabled?: boolean
  helperText?: string
}

/**
 * DatePicker component using react-day-picker.
 * Displays a calendar with available days highlighted and unavailable days disabled.
 */
export const DatePicker = ({
  selectedDate,
  onDateSelect,
  availabilityParams,
  disabled = false,
  helperText,
}: DatePickerProps) => {
  const availableDays = computeAvailableDays(availabilityParams, 30)

  // Convert available days to Date objects for DayPicker
  const availableDates = availableDays.map((dateIso) =>
    parse(dateIso, 'yyyy-MM-dd', new Date())
  )

  // Convert selected date to Date object
  const selectedDateObj = selectedDate
    ? parse(selectedDate, 'yyyy-MM-dd', new Date())
    : undefined

  const today = startOfDay(new Date())
  const maxDate = addDays(today, 30)

  const handleDayClick = (day: Date | undefined) => {
    if (!day || disabled) return
    const dateIso = format(day, 'yyyy-MM-dd')
    onDateSelect(dateIso)
  }

  // Determine which days should be disabled
  const isDateDisabled = (date: Date): boolean => {
    const dateIso = format(date, 'yyyy-MM-dd')
    return !availableDays.includes(dateIso)
  }

  return (
    <div className="space-y-4">
      {helperText && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}
      <div className="inline-block rounded-lg border bg-card p-4">
        <DayPicker
          mode="single"
          selected={selectedDateObj}
          onSelect={handleDayClick}
          disabled={[
            { before: today },
            { after: maxDate },
            isDateDisabled,
          ]}
          modifiers={{
            available: availableDates,
          }}
          classNames={dayPickerClassNames}
          components={{
            Chevron: ({ orientation }) =>
              orientation === 'left' ? (
                <ChevronLeft className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              ),
          }}
          showOutsideDays={false}
          fixedWeeks
        />
      </div>
      {availableDays.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No available dates in the next 30 days. Please try again later.
        </p>
      )}
    </div>
  )
}
