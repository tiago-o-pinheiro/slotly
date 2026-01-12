import Link from 'next/link'
import { Calendar, Zap, Shield, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-(--gray-2) to-(--gray-3)">
      <div className="container mx-auto px-4 py-20 max-w-6xl">
        {/* Hero */}
        <header className="text-center mb-24">
          <h1 className="text-5xl md:text-7xl font-bold text-(--gray-12) mb-6 tracking-tight">
            Slotly
          </h1>
          <p className="text-lg md:text-xl text-(--gray-12)/60 mb-10 max-w-2xl mx-auto leading-relaxed">
            The booking platform that gets out of the way. Fast, simple, no drama.
          </p>
          <Button asChild variant="solid" size="lg" className="shadow-lg">
            <Link href="/claudios-barber" className="gap-2">
              View demo
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </header>

        {/* Features */}
        <section className="grid md:grid-cols-3 gap-6 mb-24">
          <Card hover className="text-center bg-(--gray-1)/60 backdrop-blur-sm border border-(--gray-6)/50">
            <CardContent className="pt-10 pb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-foreground/5 rounded-(--radius-full) mb-6">
                <Zap className="w-6 h-6 text-(--gray-12)/70" />
              </div>
              <h3 className="text-lg font-semibold text-(--gray-12) mb-3">Lightning fast</h3>
              <p className="text-(--gray-12)/60 text-sm leading-relaxed">
                Book in under a minute. No account required, no friction.
              </p>
            </CardContent>
          </Card>

          <Card hover className="text-center bg-(--gray-1)/60 backdrop-blur-sm border border-(--gray-6)/50">
            <CardContent className="pt-10 pb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-foreground/5 rounded-(--radius-full) mb-6">
                <Calendar className="w-6 h-6 text-(--gray-12)/70" />
              </div>
              <h3 className="text-lg font-semibold text-(--gray-12) mb-3">Real-time availability</h3>
              <p className="text-(--gray-12)/60 text-sm leading-relaxed">
                See what's open right now. No back-and-forth, no waiting.
              </p>
            </CardContent>
          </Card>

          <Card hover className="text-center bg-(--gray-1)/60 backdrop-blur-sm border border-(--gray-6)/50">
            <CardContent className="pt-10 pb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-foreground/5 rounded-(--radius-full) mb-6">
                <Shield className="w-6 h-6 text-(--gray-12)/70" />
              </div>
              <h3 className="text-lg font-semibold text-(--gray-12) mb-3">Built for trust</h3>
              <p className="text-(--gray-12)/60 text-sm leading-relaxed">
                Secure, reliable, and respectful of your time and data.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* CTA */}
        <section className="text-center">
          <Card className="bg-(--gray-1)/70 backdrop-blur-md border border-(--gray-6)/50 max-w-2xl mx-auto shadow-lg">
            <CardContent className="pt-10 pb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-(--gray-12) mb-4">See it in action</h2>
              <p className="text-(--gray-12)/60 mb-8 leading-relaxed">
                Check out our demo business to see how Slotly works for customers.
              </p>
              <Button asChild variant="solid" size="lg" className="shadow-md">
                <Link href="/claudios-barber" className="gap-2">
                  View Claudio's Barber
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>

        <footer className="mt-24 pt-8 border-t border-(--gray-6)/50 text-center text-sm text-(--gray-12)/50">
          <p>&copy; 2026 Slotly. Built for businesses that value simplicity.</p>
        </footer>
      </div>
    </div>
  )
}

export default HomePage
