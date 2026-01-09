import { cn } from '@/lib/classNames'
import { Separator } from '@/components/ui/Separator'

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

  return (
    <div className="mb-8">
      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">{title}</h1>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {steps.map((step, index) => {
          const isActive = index === currentStepIndex
          const isCompleted = index < currentStepIndex
          const isUpcoming = index > currentStepIndex

          return (
            <div key={step.id} className="flex items-center gap-2 flex-1">
              <div className="flex items-center gap-2 flex-1">
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-colors',
                    isActive && 'bg-primary text-white',
                    isCompleted && 'bg-primary/20 text-primary',
                    isUpcoming && 'bg-muted text-foreground/40',
                  )}
                >
                  {index + 1}
                </div>
                <span
                  className={cn(
                    'text-sm font-medium transition-colors hidden sm:inline',
                    isActive && 'text-foreground',
                    isCompleted && 'text-primary',
                    isUpcoming && 'text-foreground/40',
                  )}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <Separator
                  orientation="horizontal"
                  className={cn(
                    'flex-1 max-w-[40px] transition-colors',
                    isCompleted && 'bg-primary/40',
                  )}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
