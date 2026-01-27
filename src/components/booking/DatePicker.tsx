'use client'

import { DayPicker } from 'react-day-picker'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { format, parse, addDays, startOfDay } from 'date-fns'
import { Skeleton } from '@/components/ui/skeleton/Skeleton'

type DatePickerProps = {
  selectedDate: string | null
  onDateSelect: (dateIso: string) => void
  availableDays: string[]
  isLoading?: boolean
  disabled?: boolean
  timezone?: string
}

const dayPickerClassNames = {
  root: 'w-full',
  months: 'flex flex-col w-full',
  month: 'space-y-4 w-full',
  month_caption: 'flex justify-center relative items-center h-10',
  caption_label: 'text-base font-semibold text-(--gray-12)',
  nav: 'flex items-center justify-between absolute inset-x-0',
  button_previous: 'p-2 hover:bg-(--gray-a3) rounded-(--radius-full) transition-colors',
  button_next: 'p-2 hover:bg-(--gray-a3) rounded-(--radius-full) transition-colors',
  month_grid: 'w-full table-fixed',
  weekdays: 'grid grid-cols-7',
  weekday: 'text-(--gray-10) text-sm font-medium h-10 flex items-center justify-center',
  week: 'grid grid-cols-7',
  day: 'relative h-10 flex items-center justify-center',
  day_button: 'w-10 h-10 flex items-center justify-center rounded-(--radius-full) text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-(--accent-8) focus:ring-offset-2',
  selected: 'bg-(--accent-9) text-(--accent-contrast) hover:bg-(--accent-10)',
  today: 'after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-(--accent-9) after:rounded-(--radius-full)',
  outside: 'text-(--gray-8)',
  disabled: 'text-(--gray-8) cursor-not-allowed hover:bg-transparent',
  hidden: 'invisible',
}

export const DatePicker = ({
  selectedDate,
  onDateSelect,
  availableDays,
  isLoading = false,
  disabled = false,
  timezone = 'GMT+1',
}: DatePickerProps) => {
  const availableDates = availableDays.map((dateIso) =>
    parse(dateIso, 'yyyy-MM-dd', new Date())
  )

  const selectedDateObj = selectedDate
    ? parse(selectedDate, 'yyyy-MM-dd', new Date())
    : undefined

  const today = startOfDay(new Date())
  const maxDate = addDays(today, 60)

  const handleDayClick = (day: Date | undefined) => {
    if (!day || disabled) return
    const dateIso = format(day, 'yyyy-MM-dd')
    onDateSelect(dateIso)
  }

  const isDateDisabled = (date: Date): boolean => {
    const dateIso = format(date, 'yyyy-MM-dd')
    return !availableDays.includes(dateIso)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-(--gray-12)">Select a date</h2>
        <div className="space-y-3">
          <Skeleton className="h-10 w-48 mx-auto" />
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 35 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-10 rounded-full mx-auto" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-(--gray-12)">Select a date</h2>

      <DayPicker
        mode="single"
        selected={selectedDateObj}
        onSelect={handleDayClick}
        disabled={[{ before: today }, { after: maxDate }, isDateDisabled]}
        modifiers={{
          available: availableDates,
          today: [today],
        }}
        modifiersClassNames={{
          available: 'text-(--accent-11) hover:bg-(--accent-a3)',
          today: dayPickerClassNames.today,
        }}
        classNames={dayPickerClassNames}
        formatters={{
          formatWeekdayName: (date) => format(date, 'EEEEE'),
        }}
        components={{
          Chevron: ({ orientation }) =>
            orientation === 'left' ? (
              <ChevronLeft className="h-5 w-5 text-(--gray-11)" />
            ) : (
              <ChevronRight className="h-5 w-5 text-(--gray-11)" />
            ),
        }}
        showOutsideDays={false}
        fixedWeeks
      />

      <p className="text-sm text-(--gray-10) flex items-center justify-center gap-2">
        <span className="inline-block w-4 h-4">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
        </span>
        Times shown in {timezone}
      </p>

      {availableDays.length === 0 && (
        <p className="text-sm text-(--gray-11) text-center">
          No available dates in the next 30 days. Please try again later.
        </p>
      )}
    </div>
  )
}
