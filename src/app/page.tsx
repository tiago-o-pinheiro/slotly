import Link from 'next/link'
import { Calendar, Zap, Shield, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Hero */}
        <header className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Slotly
          </h1>
          <p className="text-xl md:text-2xl text-foreground/70 mb-8 max-w-2xl mx-auto">
            The booking platform that gets out of the way. Fast, simple, no drama.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="solid" size="lg">
              <Link href="/claudios-barber" className="gap-2">
                View demo
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </header>

        {/* Features */}
        <section className="grid md:grid-cols-3 gap-8 mb-20">
          <Card hover className="text-center">
            <CardContent className="pt-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Lightning fast</h3>
              <p className="text-foreground/70 text-sm">
                Book in under a minute. No account required, no friction.
              </p>
            </CardContent>
          </Card>

          <Card hover className="text-center">
            <CardContent className="pt-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <Calendar className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Real-time availability</h3>
              <p className="text-foreground/70 text-sm">
                See what's open right now. No back-and-forth, no waiting.
              </p>
            </CardContent>
          </Card>

          <Card hover className="text-center">
            <CardContent className="pt-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Built for trust</h3>
              <p className="text-foreground/70 text-sm">
                Secure, reliable, and respectful of your time and data.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* CTA */}
        <section className="text-center">
          <Card className="bg-primary/5 border-primary/20 max-w-2xl mx-auto">
            <CardContent className="pt-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">See it in action</h2>
              <p className="text-foreground/70 mb-6">
                Check out our demo business to see how Slotly works for customers.
              </p>
              <Button asChild variant="solid" size="lg">
                <Link href="/claudios-barber" className="gap-2">
                  View Claudio's Barber
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>

        <footer className="mt-20 pt-8 border-t border-border text-center text-sm text-foreground/50">
          <p>&copy; 2026 Slotly. Built for businesses that value simplicity.</p>
        </footer>
      </div>
    </div>
  )
}

export default HomePage
