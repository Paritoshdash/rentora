'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  Building2, Users, CreditCard, Bell, BarChart3, Shield,
  CheckCircle2, ArrowRight, Star, Menu, X, Home, Receipt,
  Calendar, Zap, ChevronDown, ChevronUp, Infinity,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const features = [
  { icon: Building2, title: 'Property Management', desc: 'Manage multiple properties, units, and buildings from one dashboard. Track occupancy and rent in real-time.', color: 'text-blue-600', bg: 'bg-blue-50' },
  { icon: Users, title: 'Tenant Management', desc: 'Store tenant profiles, agreements, ID proofs, and communication history all in one place.', color: 'text-purple-600', bg: 'bg-purple-50' },
  { icon: CreditCard, title: 'Rent Tracking', desc: 'Track monthly payments, mark paid/pending/overdue, generate receipts, and add late fees automatically.', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { icon: Bell, title: 'Smart Notifications', desc: 'Automated reminders for rent due dates, overdue payments, and agreement expiry — all in one notification center.', color: 'text-orange-600', bg: 'bg-orange-50' },
  { icon: BarChart3, title: 'Reports & Analytics', desc: 'Generate monthly income reports, expense breakdowns, and occupancy analytics with downloadable PDFs.', color: 'text-blue-600', bg: 'bg-blue-50' },
  { icon: Receipt, title: 'Digital Receipts', desc: 'Generate professional PDF rent receipts instantly with tenant details, payment info, and landlord branding.', color: 'text-teal-600', bg: 'bg-teal-50' },
  { icon: Calendar, title: 'Calendar View', desc: 'Visual calendar showing all rent due dates, payment dates, and agreement expiry dates at a glance.', color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { icon: Shield, title: 'Secure & Private', desc: 'Bank-grade security with Supabase authentication. Your data is encrypted and completely private.', color: 'text-red-600', bg: 'bg-red-50' },
]

const testimonials = [
  { name: 'Suresh Patel', role: 'Landlord, Ahmedabad', avatar: 'S', color: 'bg-blue-500', rating: 5, text: 'Rentora has completely transformed how I manage my 3 apartment buildings. I used to spend hours on spreadsheets — now everything is automated. The rent reminders alone have reduced late payments by 80%!' },
  { name: 'Meena Krishnan', role: 'Property Owner, Chennai', avatar: 'M', color: 'bg-purple-500', rating: 5, text: 'The dashboard is so clean and easy to use. I can see all my properties, tenants, and payments at a glance. The PDF receipt feature is a game-changer for my tenants.' },
  { name: 'Vikram Singh', role: 'Real Estate Investor, Delhi', avatar: 'V', color: 'bg-emerald-500', rating: 5, text: 'I manage 12 properties across Delhi and Gurgaon. Rentora keeps everything organized. The expense tracking and profit reports help me make better investment decisions.' },
]

const faqs = [
  { q: 'Is Rentora completely free?', a: 'Yes — Rentora is 100% free with no hidden charges, no credit card required, and no usage limits. Every feature is available to all users at no cost.' },
  { q: 'How does rent tracking work?', a: 'Each month, Rentora automatically creates payment records for all your tenants. You can mark payments as paid, pending, or overdue, add payment methods, and generate receipts instantly.' },
  { q: 'Can I send reminders to tenants?', a: 'Yes! Rentora has a built-in notification center. WhatsApp and SMS integration is on the roadmap and will be available soon — also free.' },
  { q: 'Is my data secure?', a: 'Absolutely. Rentora uses Supabase with row-level security, meaning your data is completely isolated from other users. All data is encrypted at rest and in transit.' },
  { q: 'Can I manage multiple properties?', a: 'Yes! Rentora is built for landlords with multiple properties. Add unlimited buildings, apartments, villas, and commercial spaces — all for free.' },
  { q: 'Does Rentora work on mobile?', a: 'Rentora is fully mobile-responsive and works perfectly on smartphones and tablets. A dedicated mobile app is coming soon.' },
]

const everythingFree = [
  'Unlimited properties', 'Unlimited tenants', 'Rent tracking & receipts',
  'Expense management', 'Reports & analytics', 'Notification center',
  'Calendar view', 'Activity logs', 'PDF generation', 'Secure cloud storage',
]

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Home className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Rentora</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              {['Features', 'Testimonials', 'FAQ'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                  {item}
                </a>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-3">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm" className="gap-1.5">
                  Get Started — It&apos;s Free
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>

            <button className="md:hidden p-2 rounded-lg hover:bg-gray-100" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
            {['Features', 'Testimonials', 'FAQ'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="block text-sm font-medium text-gray-600 py-2" onClick={() => setMobileMenuOpen(false)}>
                {item}
              </a>
            ))}
            <div className="flex gap-3 pt-2">
              <Link href="/auth/login" className="flex-1"><Button variant="outline" className="w-full">Sign In</Button></Link>
              <Link href="/auth/signup" className="flex-1"><Button className="w-full">Get Started Free</Button></Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white pt-16 pb-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-1.5 mb-6">
            <Infinity className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-700">100% Free — No credit card, no limits, forever</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Manage Your Properties
            <br />
            <span className="text-blue-600">Like a Pro</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Rentora is the all-in-one rental management platform that helps landlords track rent, manage tenants, handle expenses, and grow their portfolio — completely free, forever.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            <Link href="/auth/signup">
              <Button size="xl" className="gap-2 w-full sm:w-auto">
                Start for Free
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="xl" variant="outline" className="gap-2 w-full sm:w-auto">
                Sign In to Dashboard
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
            {['No credit card required', 'All features free', '2-minute setup'].map((item) => (
              <div key={item} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                {item}
              </div>
            ))}
          </div>

          {/* Dashboard Preview */}
          <div className="mt-16">
            <div className="bg-[#0f172a] rounded-2xl shadow-2xl overflow-hidden border border-gray-800 max-w-5xl mx-auto">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-3 text-xs text-gray-400">rentora.in/dashboard</span>
              </div>
              <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Properties', value: '4', color: 'bg-blue-500/20 text-blue-400' },
                  { label: 'Tenants', value: '6', color: 'bg-purple-500/20 text-purple-400' },
                  { label: 'Monthly Income', value: '₹1.4L', color: 'bg-emerald-500/20 text-emerald-400' },
                  { label: 'Occupancy', value: '76%', color: 'bg-orange-500/20 text-orange-400' },
                ].map((stat) => (
                  <div key={stat.label} className={`rounded-xl p-4 ${stat.color.split(' ')[0]}`}>
                    <p className="text-xs text-gray-400 mb-1">{stat.label}</p>
                    <p className={`text-2xl font-bold ${stat.color.split(' ')[1]}`}>{stat.value}</p>
                  </div>
                ))}
              </div>
              <div className="px-6 pb-6">
                <div className="bg-white/5 rounded-xl p-4 h-32 flex items-end gap-2">
                  {[40, 65, 55, 80, 70, 90].map((h, i) => (
                    <div key={i} className="flex-1 bg-blue-500/60 rounded-t-sm" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-blue-600 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center text-white">
            {[
              { value: '5,000+', label: 'Landlords' },
              { value: '25,000+', label: 'Properties Managed' },
              { value: '₹50Cr+', label: 'Rent Tracked' },
              { value: '100%', label: 'Free Forever' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-blue-200 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Everything Free Banner */}
      <section className="py-16 bg-gradient-to-br from-emerald-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-100 rounded-full px-4 py-1.5 mb-5">
            <Infinity className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-700">Everything Included. Always Free.</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">No plans. No tiers. No paywalls.</h2>
          <p className="text-gray-600 mb-8">Every feature is available to every landlord, completely free. We believe good tools should be accessible to all.</p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {everythingFree.map((item) => (
              <div key={item} className="flex items-center gap-2 bg-white rounded-lg px-3 py-2.5 shadow-sm border border-gray-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="text-xs font-medium text-gray-700">{item}</span>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link href="/auth/signup">
              <Button size="lg" className="gap-2">
                Create Free Account
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Everything You Need to Manage Rentals</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">From property listings to rent collection, Rentora covers every aspect of property management in one powerful platform.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div key={feature.title} className="p-6 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-200">
                  <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center mb-4', feature.bg)}>
                    <Icon className={cn('w-5 h-5', feature.color)} />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Loved by Landlords Across India</h2>
            <p className="text-lg text-gray-600">Join thousands of property owners who trust Rentora</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-5">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className={cn('w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold', t.color)}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">Everything you need to know about Rentora</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                <button className="w-full flex items-center justify-between px-5 py-4 text-left" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span className="text-sm font-semibold text-gray-900">{faq.q}</span>
                  {openFaq === i ? <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 border-t border-gray-100">
                    <p className="text-sm text-gray-600 leading-relaxed pt-3">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 mb-5">
            <Infinity className="w-4 h-4 text-white" />
            <span className="text-sm font-semibold text-white">Free forever — no catch</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Simplify Your Property Management?</h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of landlords who use Rentora to save time, reduce late payments, and manage their rental income — all for free.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/auth/signup">
              <Button size="xl" className="bg-white text-blue-600 hover:bg-blue-50 gap-2 w-full sm:w-auto">
                Create Free Account
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="xl" variant="outline" className="border-white/30 text-white hover:bg-white/10 w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0f172a] text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 sm:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Home className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-white font-bold text-lg">Rentora</span>
              </div>
              <p className="text-sm leading-relaxed">Smart rental management for modern Indian landlords. Free forever.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-3">Product</h4>
              <ul className="space-y-2 text-sm">
                {['Features', 'Demo', 'Changelog'].map((item) => (
                  <li key={item}><a href="#" className="hover:text-white transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-3">Company</h4>
              <ul className="space-y-2 text-sm">
                {['About', 'Blog', 'Contact'].map((item) => (
                  <li key={item}><a href="#" className="hover:text-white transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-3">Legal</h4>
              <ul className="space-y-2 text-sm">
                {['Privacy Policy', 'Terms of Service'].map((item) => (
                  <li key={item}><a href="#" className="hover:text-white transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm">© 2025 Rentora. All rights reserved.</p>
            <p className="text-sm">Made with ❤️ for Indian Landlords · Free Forever</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
