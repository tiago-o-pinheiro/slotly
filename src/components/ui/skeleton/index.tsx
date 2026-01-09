import { cn } from '@/lib/classNames'

type SkeletonProps = React.HTMLAttributes<HTMLDivElement>

export const Skeleton = ({ className, ...props }: SkeletonProps) => {
  return (
    <div
      className={cn('animate-pulse rounded-brand bg-muted', className)}
      {...props}
    />
  )
}
