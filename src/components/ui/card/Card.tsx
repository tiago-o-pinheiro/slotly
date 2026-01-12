import { cn } from '@/lib/classNames'

export type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  hover?: boolean
}

export const Card = ({ className, hover = false, ...props }: CardProps) => {
  return (
    <div
      className={cn(
        'bg-(--color-panel-solid) border border-(--gray-6) rounded-(--radius-4) p-4 transition-all duration-200',
        hover && 'hover:shadow-lg hover:-translate-y-1',
        className,
      )}
      {...props}
    />
  )
}

export type CardHeaderProps = React.HTMLAttributes<HTMLDivElement>

export const CardHeader = ({ className, ...props }: CardHeaderProps) => {
  return <div className={cn('flex flex-col gap-1.5 mb-4', className)} {...props} />
}

export type CardTitleProps = React.HTMLAttributes<HTMLHeadingElement>

export const CardTitle = ({ className, ...props }: CardTitleProps) => {
  return <h3 className={cn('text-lg font-semibold text-(--gray-12)', className)} {...props} />
}

export type CardDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>

export const CardDescription = ({ className, ...props }: CardDescriptionProps) => {
  return <p className={cn('text-sm text-(--gray-11)', className)} {...props} />
}

export type CardContentProps = React.HTMLAttributes<HTMLDivElement>

export const CardContent = ({ className, ...props }: CardContentProps) => {
  return <div className={cn('text-(--gray-11)', className)} {...props} />
}

export type CardFooterProps = React.HTMLAttributes<HTMLDivElement>

export const CardFooter = ({ className, ...props }: CardFooterProps) => {
  return <div className={cn('flex items-center gap-2 mt-4 pt-4 border-t border-(--gray-6)', className)} {...props} />
}
