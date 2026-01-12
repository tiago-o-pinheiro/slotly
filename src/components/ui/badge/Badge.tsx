import { type VariantProps, cva } from 'class-variance-authority'
import { cn } from '@/lib/classNames'

const badgeVariants = cva(
  'inline-flex items-center gap-1 font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-(--accent-a3) text-(--accent-11)',
        secondary: 'bg-(--gray-a3) text-(--gray-12)',
        outline: 'border border-(--gray-6) text-(--gray-12)',
        success: 'bg-(--green-a3) text-(--green-11)',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs rounded-(--radius-1)',
        md: 'px-2.5 py-1 text-sm rounded-(--radius-2)',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
)

export type BadgeProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof badgeVariants>

export const Badge = ({ className, variant, size, ...props }: BadgeProps) => {
  return <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
}
