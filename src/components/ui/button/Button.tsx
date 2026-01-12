import { type VariantProps, cva } from 'class-variance-authority'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/classNames'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 cursor-pointer',
  {
    variants: {
      variant: {
        solid:
          'bg-(--accent-9) text-(--accent-contrast) hover:bg-(--accent-10) active:translate-y-px focus-visible:ring-(--accent-8)',
        soft: 'bg-(--accent-a3) text-(--accent-11) hover:bg-(--accent-a4) active:translate-y-px focus-visible:ring-(--accent-8)',
        outline:
          'border-2 border-(--accent-7) text-(--accent-11) bg-transparent hover:bg-(--accent-a3) active:translate-y-px focus-visible:ring-(--accent-8)',
        ghost:
          'text-(--gray-12) hover:bg-(--gray-a3) active:translate-y-px focus-visible:ring-(--gray-8)',
      },
      size: {
        sm: 'px-3 py-1.5 text-sm rounded-(--radius-2)',
        md: 'px-4 py-2 text-base rounded-(--radius-3)',
        lg: 'px-6 py-3 text-lg rounded-(--radius-4)',
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
