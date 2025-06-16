import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Brain,
  FileSearch,
  Target,
  Users,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Star,
  TrendingUp,
  Shield,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import Image from "next/image"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 dark:from-purple-900 dark:via-purple-800 dark:to-indigo-900 light:from-blue-50 light:via-indigo-50 light:to-purple-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/images/hero-bg.png')] bg-cover bg-center opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-purple-800/80 to-indigo-900/80 dark:from-purple-900/80 dark:via-purple-800/80 dark:to-indigo-900/80 light:from-blue-50/90 light:via-indigo-50/90 light:to-purple-50/90"></div>

      {/* Navbar */}
      <nav className="glass-effect border-b border-white/10 dark:border-white/10 light:border-gray-200 relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold bg-gradient-to-r from-white to-purple-200 dark:from-white dark:to-purple-200 light:from-gray-900 light:to-purple-600 bg-clip-text text-transparent">
                RecruitAI
              </span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a
                  href="#about"
                  className="text-purple-200 hover:text-white dark:text-purple-200 dark:hover:text-white light:text-gray-600 light:hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  About
                </a>
                <a
                  href="#features"
                  className="text-purple-200 hover:text-white dark:text-purple-200 dark:hover:text-white light:text-gray-600 light:hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Features
                </a>
                <Link
                  href="/login"
                  className="text-purple-200 hover:text-white dark:text-purple-200 dark:hover:text-white light:text-gray-600 light:hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <ThemeToggle />
                <Link href="/signup">
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg">
                    Sign Up
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="animate-fade-in">
              <div className="inline-flex items-center px-4 py-2 bg-white/10 dark:bg-white/10 light:bg-white/80 backdrop-blur-sm rounded-full text-purple-200 dark:text-purple-200 light:text-purple-600 text-sm font-medium mb-8 border border-white/20 dark:border-white/20 light:border-purple-200">
                <Sparkles className="h-4 w-4 mr-2" />
                AI-Powered Recruitment Platform
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 dark:from-white dark:via-purple-200 dark:to-pink-200 light:from-gray-900 light:via-purple-600 light:to-pink-600 bg-clip-text text-transparent leading-tight">
                Automate Your Hiring with{" "}
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">AI</span>
              </h1>
              <p className="text-xl text-purple-200 dark:text-purple-200 light:text-gray-600 mb-8 max-w-2xl leading-relaxed">
                Transform your recruitment process with intelligent resume screening, automated candidate scoring, and
                AI-powered shortlisting. Hire the best talent 10x faster.
              </p>

              {/* Trust Indicators */}
              <div className="flex items-center space-x-6 mb-8">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                  <span className="text-purple-200 text-sm ml-2">4.9/5 rating</span>
                </div>
                <div className="flex items-center space-x-2 text-purple-200 text-sm">
                  <Shield className="h-4 w-4" />
                  <span>SOC 2 Compliant</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-lg px-8 py-4 shadow-2xl border-0 transform hover:scale-105 transition-all duration-200"
                  >
                    Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-white border-white/30 hover:bg-white/10 dark:text-white dark:border-white/30 dark:hover:bg-white/10 light:text-gray-700 light:border-gray-300 light:hover:bg-gray-50 text-lg px-8 py-4"
                >
                  Watch Demo
                </Button>
              </div>
            </div>

            {/* Right Column - Hero Image */}
            <div className="relative">
              <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-2xl">
                <Image
                  src="/images/dashboard-analytics.png"
                  alt="RecruitAI Dashboard"
                  width={600}
                  height={400}
                  className="rounded-xl shadow-lg"
                  priority
                />
                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                  <TrendingUp className="h-4 w-4 inline mr-1" />
                  95% Accuracy
                </div>
                <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                  <Zap className="h-4 w-4 inline mr-1" />
                  10x Faster
                </div>
              </div>
              {/* Background Decoration */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl transform rotate-3 scale-105 -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20 dark:bg-black/20 light:bg-white/50 backdrop-blur-sm relative z-10"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-purple-200 dark:from-white dark:to-purple-200 light:from-gray-900 light:to-purple-600 bg-clip-text text-transparent">
              Powerful Features for Modern Recruiters
            </h2>
            <p className="text-xl text-purple-200 dark:text-purple-200 light:text-gray-600 max-w-3xl mx-auto">
              Everything you need to streamline your hiring process with cutting-edge AI technology
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white/5 dark:bg-white/5 light:bg-white/90 backdrop-blur-sm border-white/10 dark:border-white/10 light:border-gray-200 hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-white transition-all duration-300 hover:scale-105 hover:shadow-2xl group">
              <CardHeader className="text-center">
                <div className="relative mb-6">
                  <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl w-fit mx-auto shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300">
                    <FileSearch className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl transform rotate-6 scale-110 -z-10"></div>
                </div>
                <CardTitle className="text-white dark:text-white light:text-gray-900 text-xl mb-4">
                  Smart Resume Screening
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative mb-4">
                  <Image
                    src="/images/resume-screening.png"
                    alt="Resume Screening"
                    width={300}
                    height={200}
                    className="rounded-lg mx-auto opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
                <CardDescription className="text-purple-200 dark:text-purple-200 light:text-gray-600 text-base leading-relaxed">
                  AI-powered resume analysis that identifies the best candidates based on job requirements and
                  experience with 95% accuracy.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-white/5 dark:bg-white/5 light:bg-white/90 backdrop-blur-sm border-white/10 dark:border-white/10 light:border-gray-200 hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-white transition-all duration-300 hover:scale-105 hover:shadow-2xl group">
              <CardHeader className="text-center">
                <div className="relative mb-6">
                  <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl w-fit mx-auto shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl transform rotate-6 scale-110 -z-10"></div>
                </div>
                <CardTitle className="text-white dark:text-white light:text-gray-900 text-xl mb-4">
                  Instant ATS Scoring
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative mb-4">
                  <Image
                    src="/images/ai-brain.png"
                    alt="AI Scoring"
                    width={300}
                    height={200}
                    className="rounded-lg mx-auto opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
                <CardDescription className="text-purple-200 dark:text-purple-200 light:text-gray-600 text-base leading-relaxed">
                  Get instant compatibility scores for every application with detailed breakdown and personalized
                  recommendations.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-white/5 dark:bg-white/5 light:bg-white/90 backdrop-blur-sm border-white/10 dark:border-white/10 light:border-gray-200 hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-white transition-all duration-300 hover:scale-105 hover:shadow-2xl group">
              <CardHeader className="text-center">
                <div className="relative mb-6">
                  <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl w-fit mx-auto shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl transform rotate-6 scale-110 -z-10"></div>
                </div>
                <CardTitle className="text-white dark:text-white light:text-gray-900 text-xl mb-4">
                  Automated Shortlisting
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative mb-4">
                  <Image
                    src="/images/team-collaboration.png"
                    alt="Team Collaboration"
                    width={300}
                    height={200}
                    className="rounded-lg mx-auto opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
                <CardDescription className="text-purple-200 dark:text-purple-200 light:text-gray-600 text-base leading-relaxed">
                  Let AI automatically shortlist the top candidates and send personalized responses to applicants
                  instantly.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-white dark:text-white light:text-gray-900 mb-4">
              Trusted by Leading Companies
            </h3>
            <p className="text-purple-200 dark:text-purple-200 light:text-gray-600">
              Join thousands of recruiters who have transformed their hiring process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-4 p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              <div className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                10x
              </div>
              <div className="text-purple-200 dark:text-purple-200 light:text-gray-600 text-lg font-medium">
                Faster Hiring
              </div>
              <div className="text-sm text-purple-300 dark:text-purple-300 light:text-gray-500">
                Reduce time-to-hire from weeks to days
              </div>
            </div>
            <div className="space-y-4 p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              <div className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                95%
              </div>
              <div className="text-purple-200 dark:text-purple-200 light:text-gray-600 text-lg font-medium">
                Accuracy Rate
              </div>
              <div className="text-sm text-purple-300 dark:text-purple-300 light:text-gray-500">
                AI-powered candidate matching
              </div>
            </div>
            <div className="space-y-4 p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              <div className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                50K+
              </div>
              <div className="text-purple-200 dark:text-purple-200 light:text-gray-600 text-lg font-medium">
                Resumes Processed
              </div>
              <div className="text-sm text-purple-300 dark:text-purple-300 light:text-gray-500">
                Across 500+ companies worldwide
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-600/20 to-pink-600/20 dark:from-purple-600/20 dark:to-pink-600/20 light:from-purple-100/80 light:to-pink-100/80 backdrop-blur-sm relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <Image
              src="/images/professional-avatar.png"
              alt="Customer Testimonial"
              width={80}
              height={80}
              className="rounded-full mx-auto mb-4 border-4 border-white/20"
            />
            <blockquote className="text-xl md:text-2xl text-white dark:text-white light:text-gray-900 font-medium mb-4 leading-relaxed">
              "RecruitAI has completely transformed our hiring process. We've reduced our time-to-hire by 70% and the
              quality of candidates has never been better."
            </blockquote>
            <cite className="text-purple-200 dark:text-purple-200 light:text-gray-600">
              Sarah Johnson, Head of Talent at TechCorp
            </cite>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 dark:from-white dark:to-purple-200 light:from-gray-900 light:to-purple-600 bg-clip-text text-transparent">
            Ready to Transform Your Hiring?
          </h2>
          <p className="text-xl text-purple-200 dark:text-purple-200 light:text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
            Join thousands of recruiters who have streamlined their hiring process with RecruitAI. Start your free trial
            today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-lg px-8 py-4 shadow-2xl border-0 transform hover:scale-105 transition-all duration-200"
              >
                Start Free Trial <CheckCircle className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white/30 hover:bg-white/10 dark:text-white dark:border-white/30 dark:hover:bg-white/10 light:text-gray-700 light:border-gray-300 light:hover:bg-gray-50 text-lg px-8 py-4"
            >
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 dark:bg-black/40 light:bg-gray-100 backdrop-blur-sm text-white dark:text-white light:text-gray-900 py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10 dark:border-white/10 light:border-gray-200 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <span className="ml-3 text-xl font-bold bg-gradient-to-r from-white to-purple-200 dark:from-white dark:to-purple-200 light:from-gray-900 light:to-purple-600 bg-clip-text text-transparent">
                  RecruitAI
                </span>
              </div>
              <p className="text-purple-200 dark:text-purple-200 light:text-gray-600 mb-4 max-w-md">
                The future of recruitment is here. Automate your hiring process with AI-powered screening and find the
                best talent faster than ever.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white dark:text-white light:text-gray-900">Product</h4>
              <ul className="space-y-2 text-purple-200 dark:text-purple-200 light:text-gray-600">
                <li>
                  <a
                    href="#"
                    className="hover:text-white dark:hover:text-white light:hover:text-gray-900 transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white dark:hover:text-white light:hover:text-gray-900 transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white dark:hover:text-white light:hover:text-gray-900 transition-colors"
                  >
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white dark:text-white light:text-gray-900">Company</h4>
              <ul className="space-y-2 text-purple-200 dark:text-purple-200 light:text-gray-600">
                <li>
                  <a
                    href="#"
                    className="hover:text-white dark:hover:text-white light:hover:text-gray-900 transition-colors"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white dark:hover:text-white light:hover:text-gray-900 transition-colors"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white dark:hover:text-white light:hover:text-gray-900 transition-colors"
                  >
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 dark:border-white/10 light:border-gray-200 mt-8 pt-8 text-center">
            <p className="text-purple-200 dark:text-purple-200 light:text-gray-600">
              © 2024 RecruitAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
