const STORAGE_KEY = 'slotly_loyalty'

type LoyaltyRecord = {
  businessId: string
  customerIdentifier: string
  stamps: number
}

const isBrowser = typeof window !== 'undefined'

const getLoyaltyKey = (businessId: string, customerIdentifier: string): string => {
  return `${businessId}:${customerIdentifier}`
}

const getAllLoyaltyRecords = (): Map<string, LoyaltyRecord> => {
  if (!isBrowser) {
    return new Map()
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as Record<string, LoyaltyRecord>
      return new Map(Object.entries(parsed))
    }
  } catch (error) {
    console.error('Failed to load loyalty data from localStorage', error)
  }

  return new Map()
}

const persistLoyaltyRecords = (records: Map<string, LoyaltyRecord>): void => {
  if (!isBrowser) {
    return
  }

  try {
    const obj = Object.fromEntries(records.entries())
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj))
  } catch (error) {
    console.error('Failed to persist loyalty data to localStorage', error)
  }
}

export const getLoyaltyStamps = (businessId: string, customerIdentifier: string): number => {
  const records = getAllLoyaltyRecords()
  const key = getLoyaltyKey(businessId, customerIdentifier)
  const record = records.get(key)
  return record?.stamps ?? 0
}

export const addLoyaltyStamp = (businessId: string, customerIdentifier: string): number => {
  const records = getAllLoyaltyRecords()
  const key = getLoyaltyKey(businessId, customerIdentifier)
  const current = records.get(key)

  const stamps = (current?.stamps ?? 0) + 1

  records.set(key, {
    businessId,
    customerIdentifier,
    stamps,
  })

  persistLoyaltyRecords(records)
  return stamps
}
