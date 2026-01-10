import Link from 'next/link'
import { Calendar, Zap, Shield, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Hero */}
        <header className="text-center mb-20">
          <div className="inline-block mb-6 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
            <h1 className="text-5xl md:text-6xl font-bold text-white">
              Slotly
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-2xl mx-auto font-medium">
            The booking platform that gets out of the way. Fast, simple, no drama.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="solid" size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
              <Link href="/claudios-barber" className="gap-2">
                View demo
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </header>

        {/* Features */}
        <section className="grid md:grid-cols-3 gap-8 mb-20">
          <Card hover className="text-center border-2 border-yellow-200 bg-white hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <CardContent className="pt-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-4 shadow-lg">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Lightning fast</h3>
              <p className="text-gray-600 text-sm">
                Book in under a minute. No account required, no friction.
              </p>
            </CardContent>
          </Card>

          <Card hover className="text-center border-2 border-blue-200 bg-white hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <CardContent className="pt-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-4 shadow-lg">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-time availability</h3>
              <p className="text-gray-600 text-sm">
                See what's open right now. No back-and-forth, no waiting.
              </p>
            </CardContent>
          </Card>

          <Card hover className="text-center border-2 border-green-200 bg-white hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <CardContent className="pt-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-4 shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Built for trust</h3>
              <p className="text-gray-600 text-sm">
                Secure, reliable, and respectful of your time and data.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* CTA */}
        <section className="text-center">
          <Card className="bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 border-2 border-purple-300 max-w-2xl mx-auto shadow-xl">
            <CardContent className="pt-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">See it in action</h2>
              <p className="text-gray-700 mb-6 text-lg">
                Check out our demo business to see how Slotly works for customers.
              </p>
              <Button asChild variant="solid" size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                <Link href="/claudios-barber" className="gap-2">
                  View Claudio's Barber
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>

        <footer className="mt-20 pt-8 border-t border-purple-200 text-center text-sm text-gray-600">
          <p>&copy; 2026 Slotly. Built for businesses that value simplicity.</p>
        </footer>
      </div>
    </div>
  )
}

export default HomePage
