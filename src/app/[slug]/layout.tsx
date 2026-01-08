import { notFound } from 'next/navigation'
import { fetchBusinessBySlug } from '@/lib/business'
import { validateTheme, getFontClass } from '@/lib/theme'

type TenantLayoutProps = {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}

const TenantLayout = async ({ children, params }: TenantLayoutProps) => {
  const { slug } = await params
  const business = await fetchBusinessBySlug(slug)

  if (!business) {
    notFound()
  }

  const validatedTheme = validateTheme(business.theme)
  const fontClass = getFontClass(validatedTheme)

  const cssVars = {
    '--primary': validatedTheme.colors.primary,
    '--background': validatedTheme.colors.background,
    '--foreground': validatedTheme.colors.foreground,
    '--surface': validatedTheme.colors.surface,
    '--border': validatedTheme.colors.border,
    '--muted': validatedTheme.colors.muted,
    '--radius': validatedTheme.radius,
  } as React.CSSProperties

  return (
    <div className={fontClass} style={cssVars}>
      {children}
    </div>
  )
}

export default TenantLayout
