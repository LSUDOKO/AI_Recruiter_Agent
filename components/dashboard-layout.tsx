"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Brain, LayoutDashboard, Plus, Users, BarChart3, LogOut, Menu } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { useOptionalAuth } from "@/lib/auth-context"
import { ThemeToggle } from "@/components/theme-toggle"
import { useTheme } from "@/lib/theme-context"
import Image from "next/image"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Create Job", href: "/create-job", icon: Plus },
  { name: "Applications", href: "/applications", icon: Users },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, userProfile, signOut } = useOptionalAuth()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const { actualTheme } = useTheme()

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      await signOut()
    } catch (error) {
      console.error("Error signing out:", error)
    } finally {
      setIsSigningOut(false)
    }
  }

  const isDark = actualTheme === "dark"

  // Default user profile for demo purposes when not authenticated
  const displayProfile = userProfile || {
    full_name: "Demo User",
    company: "Demo Company",
    email: "demo@example.com",
  }

  return (
    <div className={`min-h-screen ${isDark ? "page-bg" : "bg-gray-50"} relative`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/images/dashboard-analytics.png')] bg-cover bg-center opacity-5"></div>
      <div
        className={`absolute inset-0 ${isDark ? "bg-gradient-to-br from-purple-900/95 via-purple-800/95 to-indigo-900/95" : "bg-gray-50/95"}`}
      ></div>

      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? "block" : "hidden"}`}>
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        <div
          className={`relative flex w-full max-w-xs flex-1 flex-col ${isDark ? "bg-white/10 backdrop-blur-xl border-r border-white/20" : "bg-white border-r border-gray-200"} shadow-2xl`}
        >
          <div
            className={`flex h-16 items-center justify-between px-4 ${isDark ? "border-b border-white/20" : "border-b border-gray-200"}`}
          >
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <span
                className={`ml-3 text-xl font-bold ${isDark ? "bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent" : "text-gray-900"}`}
              >
                RecruitAI
              </span>
            </div>
          </div>

          {/* User info in mobile sidebar */}
          <div
            className={`px-4 py-4 ${isDark ? "border-b border-white/20" : "border-b border-gray-200"} bg-gradient-to-r from-purple-500/10 to-pink-500/10`}
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Image
                  src="/images/professional-avatar.png"
                  alt="User Avatar"
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-purple-500/30"
                />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <p className={`text-sm font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                  {displayProfile.full_name}
                </p>
                <p className={`text-xs ${isDark ? "text-purple-200" : "text-gray-500"}`}>{displayProfile.company}</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-2 px-4 py-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-105"
                      : isDark
                        ? "text-purple-200 hover:bg-white/10 hover:text-white hover:transform hover:scale-105"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 hover:transform hover:scale-105"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
          <div className={`${isDark ? "border-t border-white/20" : "border-t border-gray-200"} p-4`}>
            <Button
              onClick={handleSignOut}
              disabled={isSigningOut}
              variant="ghost"
              className={`w-full justify-start ${isDark ? "text-purple-200 hover:text-white hover:bg-white/10" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`}
            >
              {isSigningOut ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-3"></div>
                  Signing Out...
                </>
              ) : (
                <>
                  <LogOut className="mr-3 h-5 w-5" />
                  Logout
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col z-30">
        <div
          className={`flex flex-col flex-grow ${isDark ? "bg-white/10 backdrop-blur-xl border-r border-white/20" : "bg-white border-r border-gray-200"} shadow-2xl`}
        >
          <div
            className={`flex h-16 items-center px-4 ${isDark ? "border-b border-white/20" : "border-b border-gray-200"}`}
          >
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <span
              className={`ml-3 text-xl font-bold ${isDark ? "bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent" : "text-gray-900"}`}
            >
              RecruitAI
            </span>
          </div>

          {/* User info in desktop sidebar */}
          <div
            className={`px-4 py-4 ${isDark ? "border-b border-white/20" : "border-b border-gray-200"} bg-gradient-to-r from-purple-500/10 to-pink-500/10`}
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Image
                  src="/images/professional-avatar.png"
                  alt="User Avatar"
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-purple-500/30"
                />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <p className={`text-sm font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                  {displayProfile.full_name}
                </p>
                <p className={`text-xs ${isDark ? "text-purple-200" : "text-gray-500"}`}>{displayProfile.company}</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-2 px-4 py-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-105"
                      : isDark
                        ? "text-purple-200 hover:bg-white/10 hover:text-white hover:transform hover:scale-105"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 hover:transform hover:scale-105"
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
          <div className={`${isDark ? "border-t border-white/20" : "border-t border-gray-200"} p-4`}>
            <Button
              onClick={handleSignOut}
              disabled={isSigningOut}
              variant="ghost"
              className={`w-full justify-start ${isDark ? "text-purple-200 hover:text-white hover:bg-white/10" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`}
            >
              {isSigningOut ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-3"></div>
                  Signing Out...
                </>
              ) : (
                <>
                  <LogOut className="mr-3 h-5 w-5" />
                  Logout
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 relative z-10">
        <div
          className={`flex h-16 items-center gap-x-4 ${isDark ? "border-b border-white/20 bg-white/5 backdrop-blur-sm" : "border-b border-gray-200 bg-white/80 backdrop-blur-sm"} px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8`}
        >
          <Button
            variant="ghost"
            size="sm"
            className={`lg:hidden ${isDark ? "text-white hover:bg-white/10" : "text-gray-600 hover:bg-gray-100"}`}
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>

          {/* Header content */}
          <div className="flex flex-1 justify-end items-center space-x-4">
            <ThemeToggle />
            <div
              className={`hidden lg:flex items-center space-x-2 text-sm ${isDark ? "text-purple-200" : "text-gray-600"}`}
            >
              <span>Welcome back, {displayProfile.full_name.split(" ")[0]}!</span>
            </div>
          </div>
        </div>
        <main className="py-8">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
