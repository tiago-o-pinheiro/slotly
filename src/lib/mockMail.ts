/**
 * Mock email service for demo purposes.
 * Simulates sending verification codes without actual email delivery.
 */

const VERIFICATION_CODE_KEY = 'slotly_verification_code'
const VERIFICATION_TARGET_KEY = 'slotly_verification_target'

/**
 * Generates a random 6-digit verification code.
 */
export const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * Simulates sending a verification code via email or SMS.
 * Stores the code in sessionStorage for verification.
 *
 * @param emailOrPhone - The recipient's email or phone number
 * @param code - The 6-digit verification code
 * @returns Promise that resolves after simulated delay
 */
export const sendVerificationCode = async (
  emailOrPhone: string,
  code: string
): Promise<void> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 700))

  // Store code in sessionStorage (survives page refresh during session)
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(VERIFICATION_CODE_KEY, code)
    sessionStorage.setItem(VERIFICATION_TARGET_KEY, emailOrPhone)
  }

  // In a real app, this would call an API endpoint:
  // await fetch('/api/send-verification', {
  //   method: 'POST',
  //   body: JSON.stringify({ emailOrPhone, code })
  // })

  console.log(`[MOCK EMAIL] Verification code ${code} sent to ${emailOrPhone}`)
}

/**
 * Verifies a code entered by the user.
 *
 * @param code - The code to verify
 * @returns true if code matches, false otherwise
 */
export const verifyCode = (code: string): boolean => {
  if (typeof window === 'undefined') {
    return false
  }

  const storedCode = sessionStorage.getItem(VERIFICATION_CODE_KEY)
  return storedCode === code
}

/**
 * Gets the stored verification target (email/phone) for display purposes.
 */
export const getVerificationTarget = (): string | null => {
  if (typeof window === 'undefined') {
    return null
  }

  return sessionStorage.getItem(VERIFICATION_TARGET_KEY)
}

/**
 * Clears verification data from storage.
 */
export const clearVerificationData = (): void => {
  if (typeof window === 'undefined') {
    return
  }

  sessionStorage.removeItem(VERIFICATION_CODE_KEY)
  sessionStorage.removeItem(VERIFICATION_TARGET_KEY)
}
