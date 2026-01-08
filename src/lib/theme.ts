import { type Theme, themeSchema, defaultTheme } from '@/types/theme'

export type FontKey = 'inter' | 'manrope' | 'plusJakarta' | 'system'

// Map font keys to CSS class names that will be applied to the tenant layout
export const fontClassMap: Record<FontKey, string> = {
  inter: 'font-inter',
  manrope: 'font-manrope',
  plusJakarta: 'font-plus-jakarta',
  system: 'font-system',
}

// Convert theme object to CSS variable string for inline styles
export const themeToCssVars = (theme: Theme): string => {
  const vars = [
    `--primary: ${theme.colors.primary}`,
    `--background: ${theme.colors.background}`,
    `--foreground: ${theme.colors.foreground}`,
    `--surface: ${theme.colors.surface}`,
    `--border: ${theme.colors.border}`,
    `--muted: ${theme.colors.muted}`,
    `--radius: ${theme.radius}`,
  ]

  return vars.join('; ')
}

// Validate and parse theme, returning default if invalid
export const validateTheme = (themeData: unknown): Theme => {
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
