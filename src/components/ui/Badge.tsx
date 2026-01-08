import { type VariantProps, cva } from 'class-variance-authority'
import { cn } from '@/lib/classNames'

const badgeVariants = cva(
  'inline-flex items-center gap-1 font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary/10 text-primary',
        secondary: 'bg-muted text-foreground',
        outline: 'border border-border text-foreground',
        success: 'bg-green-100 text-green-700',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs rounded-[calc(var(--radius)*0.5)]',
        md: 'px-2.5 py-1 text-sm rounded-[calc(var(--radius)*0.75)]',
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
