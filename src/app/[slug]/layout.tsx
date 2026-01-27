import { notFound } from 'next/navigation'
import { fetchBusinessBySlug } from '@/lib/business'
import { validateTheme, getFontClass, themeToStyleVars } from '@/lib/theme'

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
  const styleVars = themeToStyleVars(validatedTheme)

  return (
    <div className={fontClass} style={styleVars}>
      {children}
    </div>
  )
}

export default TenantLayout
