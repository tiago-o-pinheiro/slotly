import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/classNames'

export const Accordion = AccordionPrimitive.Root

export const AccordionItem = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>) => (
  <AccordionPrimitive.Item className={cn('border-b border-(--gray-6) ', className)} {...props} />
)

export const AccordionTrigger = ({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      className={cn(
        'flex flex-1 items-center justify-between py-4 text-left font-medium transition-all duration-300 ease-[cubic-bezier(0.87,0,0.13,1)] hover:bg-(--gray-a3) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--accent-8) focus-visible:ring-offset-2 [&[data-state=open]>svg]:rotate-180',
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 text-(--gray-11) transition-transform duration-300 ease-[cubic-bezier(0.87,0,0.13,1)]" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
)

export const AccordionContent = ({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>) => (
  <AccordionPrimitive.Content
    className={cn(
      'overflow-hidden text-sm',
      'data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up'
    )}
    {...props}
  >
    <div className={cn('pb-4 pt-0', className)}>{children}</div>
  </AccordionPrimitive.Content>
)
