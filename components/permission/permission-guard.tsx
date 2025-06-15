"use client"

import type React from "react"
import { usePermission } from "@/lib/permission-context"
import type { PermissionCheck } from "@/types/permission"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ShieldX } from "lucide-react"

interface PermissionGuardProps {
  children: React.ReactNode
  permission: PermissionCheck
  fallback?: React.ReactNode
  showError?: boolean
}

export function PermissionGuard({ children, permission, fallback, showError = true }: PermissionGuardProps) {
  const { hasPermission, isLoading } = usePermission()

  if (isLoading) {
    return <div className="animate-pulse bg-muted h-8 rounded" />
  }

  if (!hasPermission(permission)) {
    if (fallback) {
      return <>{fallback}</>
    }

    if (showError) {
      return (
        <Alert variant="destructive">
          <ShieldX className="h-4 w-4" />
          <AlertDescription>이 기능에 접근할 권한이 없습니다.</AlertDescription>
        </Alert>
      )
    }

    return null
  }

  return <>{children}</>
}
