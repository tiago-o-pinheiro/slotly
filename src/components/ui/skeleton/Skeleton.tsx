import { cn } from '@/lib/classNames'

type SkeletonProps = React.HTMLAttributes<HTMLDivElement>

export const Skeleton = ({ className, ...props }: SkeletonProps) => {
  return (
    <div
      className={cn('animate-pulse rounded-(--radius-3) bg-(--gray-a3)', className)}
      {...props}
    />
  )
}
