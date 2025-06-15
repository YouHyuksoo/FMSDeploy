"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { UserPlus, Shield, Users, Eye, Settings, Wrench } from "lucide-react"
import { mockRoles } from "@/lib/mock-data/permissions"
import type { User } from "@/types/user"
import type { Role } from "@/types/permission"
import { useToast } from "@/hooks/use-toast"

interface QuickRoleAssignmentProps {
  user: User
  onRoleAssigned: (userId: string, roleId: string) => void
}

export function QuickRoleAssignment({ user, onRoleAssigned }: QuickRoleAssignmentProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleQuickAssign = async (role: Role) => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      onRoleAssigned(user.id, role.id)
      toast({
        title: "성공",
        description: `${user.name}님에게 ${role.displayName} 역할이 할당되었습니다.`,
      })
    } catch (error) {
      toast({
        title: "오류",
        description: "역할 할당에 실패했습니다.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getRoleIcon = (roleName: string) => {
    switch (roleName) {
      case "SYSTEM_ADMIN":
        return <Settings className="h-4 w-4" />
      case "EQUIPMENT_ADMIN":
        return <Wrench className="h-4 w-4" />
      case "MAINTENANCE_ADMIN":
        return <Shield className="h-4 w-4" />
      case "INSPECTOR":
        return <Users className="h-4 w-4" />
      case "OPERATOR":
        return <UserPlus className="h-4 w-4" />
      case "VIEWER":
        return <Eye className="h-4 w-4" />
      default:
        return <Shield className="h-4 w-4" />
    }
  }

  const getRoleColor = (level: number) => {
    switch (level) {
      case 1:
        return "text-red-600"
      case 2:
        return "text-blue-600"
      case 3:
        return "text-green-600"
      case 4:
        return "text-yellow-600"
      case 5:
        return "text-gray-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={loading}>
          <UserPlus className="h-4 w-4 mr-1" />
          빠른 할당
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>역할 선택</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {mockRoles.map((role) => (
          <DropdownMenuItem key={role.id} onClick={() => handleQuickAssign(role)} className="flex items-center gap-2">
            <div className={getRoleColor(role.level)}>{getRoleIcon(role.name)}</div>
            <div className="flex-1">
              <div className="font-medium">{role.displayName}</div>
              <div className="text-xs text-muted-foreground">{role.permissions.length}개 권한</div>
            </div>
            <Badge variant="outline" className="text-xs">
              L{role.level}
            </Badge>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
