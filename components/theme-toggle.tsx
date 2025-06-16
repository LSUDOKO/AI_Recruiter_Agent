"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "@/lib/theme-context"

export function ThemeToggle() {
  const { theme, setTheme, actualTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 px-0 dark:text-purple-200 dark:hover:text-white dark:hover:bg-white/10 light:text-gray-600 light:hover:text-gray-900 light:hover:bg-gray-100"
        >
          {actualTheme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-gray-200 dark:border-white/20"
      >
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="cursor-pointer dark:hover:bg-white/10 light:hover:bg-gray-100 dark:text-white light:text-gray-700"
        >
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
          {theme === "light" && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="cursor-pointer dark:hover:bg-white/10 light:hover:bg-gray-100 dark:text-white light:text-gray-700"
        >
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
          {theme === "dark" && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="cursor-pointer dark:hover:bg-white/10 light:hover:bg-gray-100 dark:text-white light:text-gray-700"
        >
          <Monitor className="mr-2 h-4 w-4" />
          <span>System</span>
          {theme === "system" && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
