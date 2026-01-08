import Link from 'next/link'
import { Home, Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-muted rounded-full mb-6">
          <Search className="w-10 h-10 text-foreground/40" />
        </div>

        <h1 className="text-6xl font-bold text-foreground mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-foreground mb-4">Page Not Found</h2>
        <p className="text-foreground/70 mb-8 leading-relaxed">
          The page you are looking for does not exist or the business you are trying to access is
          not available.
        </p>

        <Link href="/">
          <Button variant="solid" size="lg" className="gap-2">
            <Home className="w-5 h-5" />
            Back to Home
          </Button>
        </Link>

        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-sm text-foreground/50">
            If you believe this is an error, please contact support.
          </p>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
