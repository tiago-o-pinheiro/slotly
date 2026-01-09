import { type VariantProps, cva } from 'class-variance-authority'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/classNames'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        solid: 'bg-primary text-white hover:bg-primary/90 active:translate-y-px',
        soft: 'bg-primary/10 text-primary hover:bg-primary/20 active:translate-y-px',
        outline:
          'border-2 border-primary text-primary bg-transparent hover:bg-primary/5 active:translate-y-px',
        ghost: 'text-foreground hover:bg-muted active:translate-y-px',
      },
      size: {
        sm: 'px-3 py-1.5 text-sm rounded-[calc(var(--radius)*0.75)]',
        md: 'px-4 py-2 text-base rounded-brand',
        lg: 'px-6 py-3 text-lg rounded-[calc(var(--radius)*1.25)]',
      },
    },
    defaultVariants: {
      variant: 'solid',
      size: 'md',
    },
  },
)

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

export const Button = ({ className, variant, size, asChild = false, ...props }: ButtonProps) => {
  const Comp = asChild ? Slot : 'button'
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />
}
