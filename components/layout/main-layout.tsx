"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { cn } from "@/lib/utils"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  // Load sidebar state from localStorage on mount
  useEffect(() => {
    setIsMounted(true)
    const savedSidebarState = localStorage.getItem('sidebarOpen')
    if (savedSidebarState !== null) {
      setSidebarOpen(JSON.parse(savedSidebarState))
    }
    // Set a small timeout to ensure the initial render is complete
    const timer = setTimeout(() => {
      document.body.classList.add('sidebar-initialized')
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  // Save sidebar state to localStorage when it changes
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('sidebarOpen', JSON.stringify(sidebarOpen))
      // Update body class for CSS transitions
      if (sidebarOpen) {
        document.body.classList.add('sidebar-open')
        document.body.classList.remove('sidebar-closed')
      } else {
        document.body.classList.add('sidebar-closed')
        document.body.classList.remove('sidebar-open')
      }
    }
  }, [sidebarOpen, isMounted])

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(prev => !prev)} />
      <div className={cn("flex-1 flex flex-col transition-all duration-300", sidebarOpen ? "ml-64" : "ml-16")}>
        <Header onMenuToggle={() => setSidebarOpen(prev => !prev)} />
        <main className="flex-1 overflow-auto p-6 bg-background">{children}</main>
      </div>
    </div>
  )
}
