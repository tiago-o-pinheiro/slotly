import { cn } from '@/lib/classNames'
import { Separator } from '@/components/ui/separator'

type Step = 'service' | 'date' | 'time' | 'confirm'

type StepHeaderProps = {
  title: string
  currentStep: Step
}

const steps: { id: Step; label: string }[] = [
  { id: 'service', label: 'Service' },
  { id: 'date', label: 'Date' },
  { id: 'time', label: 'Time' },
  { id: 'confirm', label: 'Confirm' },
]

export const StepHeader = ({ title, currentStep }: StepHeaderProps) => {
  const currentStepIndex = steps.findIndex((step) => step.id === currentStep)

  const getStepStatus = (index: number) => {
    if (index === currentStepIndex) return 'active'
    if (index < currentStepIndex) return 'completed'
    return 'upcoming'
  }

  const stepStyles = {
    active: 'bg-(--accent-9) text-(--accent-contrast)',
    completed: 'bg-(--accent-a3) text-(--accent-11)',
    upcoming: 'bg-(--gray-4) text-(--gray-9)',
  }

  const labelStyles = {
    active: 'text-(--gray-12)',
    completed: 'text-(--accent-11)',
    upcoming: 'text-(--gray-9)',
  }

  return (
    <div className="mb-8">
      <h1 className="text-2xl md:text-3xl font-bold text-(--gray-12) mb-6">{title}</h1>

      <div className="flex items-center gap-2">
        {steps.map((step, index) => {
          const status = getStepStatus(index)

          return (
            <div key={step.id} className="flex items-center gap-2 flex-1">
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-colors',
                  stepStyles[status]
                )}
              >
                {index + 1}
              </div>
              <span className={cn('text-sm font-medium transition-colors hidden sm:inline', labelStyles[status])}>
                {step.label}
              </span>
              {index < steps.length - 1 && (
                <Separator
                  orientation="horizontal"
                  className={cn('flex-1 max-w-[40px] transition-colors', status === 'completed' && 'bg-(--accent-6)')}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
