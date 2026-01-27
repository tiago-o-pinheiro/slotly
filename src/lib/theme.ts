import { type Theme, themeSchema, defaultTheme } from '@/types/theme'

export type FontKey = 'inter' | 'manrope' | 'plusJakarta' | 'system'

// Map font keys to CSS class names that will be applied to the tenant layout
export const fontClassMap: Record<FontKey, string> = {
  inter: 'font-inter',
  manrope: 'font-manrope',
  plusJakarta: 'font-plus-jakarta',
  system: 'font-system',
}

// Parse HSL triplet string like "188 85% 42%" into components
const parseHsl = (hsl: string): { h: number; s: number; l: number } | null => {
  const match = hsl.match(/^(\d+)\s+(\d+)%\s+(\d+)%$/)
  if (!match) return null
  return { h: Number(match[1]), s: Number(match[2]), l: Number(match[3]) }
}

const hsl = (h: number, s: number, l: number) =>
  `hsl(${h}, ${Math.round(s)}%, ${Math.round(l)}%)`

// Generate a 12-step accent color scale from a primary HSL value.
// Approximates the Radix Themes accent scale structure.
export const generateAccentScale = (primary: string): Record<string, string> => {
  const parsed = parseHsl(primary)
  if (!parsed) return {}

  const { h, s, l } = parsed

  return {
    '--accent-1': hsl(h, Math.max(s * 0.15, 5), 99),
    '--accent-2': hsl(h, Math.max(s * 0.25, 8), 97.5),
    '--accent-3': hsl(h, Math.max(s * 0.35, 12), 94),
    '--accent-4': hsl(h, s * 0.45, 91),
    '--accent-5': hsl(h, s * 0.55, 86),
    '--accent-6': hsl(h, s * 0.65, 78),
    '--accent-7': hsl(h, s * 0.75, 68),
    '--accent-8': hsl(h, s * 0.85, 56),
    '--accent-9': hsl(h, s, l),
    '--accent-10': hsl(h, s, Math.max(l - 5, 10)),
    '--accent-11': hsl(h, Math.min(s * 0.85, 90), Math.max(l * 0.55, 20)),
    '--accent-12': hsl(h, Math.min(s * 0.65, 80), Math.max(l * 0.35, 13)),
  }
}

// Build the full CSS variable map for a validated theme
export const themeToStyleVars = (theme: Theme): React.CSSProperties => {
  const accentOverrides = generateAccentScale(theme.colors.primary)

  return {
    ...accentOverrides,
    '--primary': theme.colors.primary,
    '--background': theme.colors.background,
    '--foreground': theme.colors.foreground,
    '--surface': theme.colors.surface,
    '--border': theme.colors.border,
    '--muted': theme.colors.muted,
    '--radius': theme.radius,
  } as React.CSSProperties
}

// Validate and parse theme, returning default if invalid
export const validateTheme = (themeData: Partial<Theme>): Theme => {
  const result = themeSchema.safeParse(themeData)

  if (!result.success) {
    console.warn('Invalid theme data, falling back to default:', result.error)
    return defaultTheme
  }

  return result.data
}

// Get the font class for a given theme
export const getFontClass = (theme: Theme): string => {
  return fontClassMap[theme.fontSansKey]
}
