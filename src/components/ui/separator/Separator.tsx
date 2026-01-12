import * as SeparatorPrimitive from '@radix-ui/react-separator'
import { cn } from '@/lib/classNames'

export type SeparatorProps = React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>

export const Separator = ({ className, orientation = 'horizontal', decorative = true, ...props }: SeparatorProps) => (
  <SeparatorPrimitive.Root
    decorative={decorative}
    orientation={orientation}
    className={cn(
      'shrink-0 bg-(--gray-6)',
      orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
      className,
    )}
    {...props}
  />
)
