'use client'

import { useEffect, useState } from 'react'
import { Gift } from 'lucide-react'
import type { Loyalty } from '@/types/domain'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getLoyaltyStamps } from '@/lib/loyaltyStore'

type LoyaltyCardProps = {
  loyalty: Loyalty
  businessId: string
  customerIdentifier: string
}

export const LoyaltyCard = ({ loyalty, businessId, customerIdentifier }: LoyaltyCardProps) => {
  const [stamps, setStamps] = useState(0)

  useEffect(() => {
    const currentStamps = getLoyaltyStamps(businessId, customerIdentifier)
    setStamps(currentStamps)
  }, [businessId, customerIdentifier])

  const progress = Math.min((stamps / loyalty.target) * 100, 100)
  const isComplete = stamps >= loyalty.target

  return (
    <Card className={isComplete ? 'bg-primary/10 border-primary' : ''}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="w-5 h-5 text-primary" />
          Loyalty rewards
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">
                {stamps} / {loyalty.target} visits
              </span>
              {isComplete && (
                <span className="text-sm font-semibold text-primary">Reward earned!</span>
              )}
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-8 gap-1">
            {Array.from({ length: loyalty.target }).map((_, i) => (
              <div
                key={i}
                className={`h-8 rounded-sm ${
                  i < stamps ? 'bg-primary' : 'bg-muted'
                } transition-colors duration-300`}
              />
            ))}
          </div>

          <p className="text-sm text-foreground/70">
            {isComplete ? (
              <span className="font-medium text-primary">
                You've earned: {loyalty.rewardLabel}
              </span>
            ) : (
              <>
                Complete {loyalty.target - stamps} more {loyalty.target - stamps === 1 ? 'visit' : 'visits'} to earn:{' '}
                <span className="font-medium">{loyalty.rewardLabel}</span>
              </>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
