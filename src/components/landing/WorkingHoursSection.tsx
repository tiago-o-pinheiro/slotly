import type { WorkingHours } from '@/types/domain'
import { formatTime } from '@/lib/format'

type WorkingHoursSectionProps = {
  workingHours: WorkingHours[]
}

const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export const WorkingHoursSection = ({ workingHours }: WorkingHoursSectionProps) => {
  const hoursByDay = workingHours.reduce(
    (acc, hours) => {
      acc[hours.weekday] = hours
      return acc
    },
    {} as Record<number, WorkingHours>,
  )

  return (
    <div className="space-y-2">
      {weekdayNames.map((dayName, index) => {
        const hours = hoursByDay[index]
        const isToday = index === new Date().getDay()

        return (
          <div
            key={index}
            className={`flex justify-between text-sm ${isToday ? 'font-semibold text-foreground' : 'text-foreground/70'}`}
          >
            <span>{dayName}</span>
            <span>{hours ? `${formatTime(hours.start)} - ${formatTime(hours.end)}` : 'Closed'}</span>
          </div>
        )
      })}
    </div>
  )
}
