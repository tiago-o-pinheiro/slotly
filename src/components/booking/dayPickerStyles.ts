import type { ClassNames } from 'react-day-picker'

/**
 * Tailwind CSS class names for react-day-picker.
 * Styled to match the Slotly design system with rounded corners,
 * muted backgrounds, and primary color accents.
 */
export const dayPickerClassNames: Partial<ClassNames> = {
  root: 'rdp',
  months: 'flex flex-col sm:flex-row gap-4',
  month: 'space-y-4',
  month_caption: 'flex justify-center pt-1 relative items-center',
  caption_label: 'text-sm font-medium',
  nav: 'flex items-center gap-1',
  button_previous: 'absolute left-1 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  button_next: 'absolute right-1 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  month_grid: 'w-full border-collapse space-y-1',
  weekdays: 'flex',
  weekday: 'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
  week: 'flex w-full mt-2',
  day: 'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
  day_button: 'h-9 w-9 p-0 font-normal aria-selected:opacity-100 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground',
  range_end: 'day-range-end',
  selected: 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
  today: 'bg-accent text-accent-foreground',
  outside: 'day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
  disabled: 'text-muted-foreground opacity-50',
  range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground',
  hidden: 'invisible',
}
