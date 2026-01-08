import { z } from 'zod'

// HSL triplet format: "188 85% 42%" (space-separated, no 'hsl()' wrapper)
const hslTripletSchema = z
  .string()
  .regex(/^\d+\s+\d+%\s+\d+%$/, 'Must be HSL triplet format: "188 85% 42%"')

export const themeColorsSchema = z.object({
  primary: hslTripletSchema,
  background: hslTripletSchema,
  foreground: hslTripletSchema,
  surface: hslTripletSchema,
  border: hslTripletSchema,
  muted: hslTripletSchema,
})

export const themeSchema = z.object({
  colors: themeColorsSchema,
  radius: z.string().regex(/^\d+px$/, 'Must be in px format: "14px"'),
  fontSansKey: z.enum(['inter', 'manrope', 'plusJakarta', 'system']),
  buttonStyle: z.enum(['soft', 'solid', 'outline']),
})

export type ThemeColors = z.infer<typeof themeColorsSchema>
export type Theme = z.infer<typeof themeSchema>
export type FontSansKey = Theme['fontSansKey']
export type ButtonStyle = Theme['buttonStyle']

// Default theme fallback
export const defaultTheme: Theme = {
  colors: {
    primary: '222 47% 11%',
    background: '0 0% 100%',
    foreground: '222 47% 11%',
    surface: '0 0% 100%',
    border: '214 32% 91%',
    muted: '210 40% 96%',
  },
  radius: '8px',
  fontSansKey: 'system',
  buttonStyle: 'solid',
}
