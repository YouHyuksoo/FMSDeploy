"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

interface User {
  id: string
  username: string
  name: string
  email: string
  level: string
  department: string
  position: string
  company: string
  companyId: string
}

interface AuthContextType {
  user: User | null
  login: (companyId: string, username: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 페이지 로드 시 저장된 사용자 정보 확인
    const savedUser = localStorage.getItem("fms-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (companyId: string, username: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      // 실제로는 API 호출을 해야 하지만, 여기서는 모의 데이터 사용
      const mockUsers = [
        {
          id: "1",
          username: "admin",
          password: "admin123",
          name: "김관리자",
          email: "admin@company.com",
          level: "관리자",
          department: "정보시스템팀",
          position: "팀장",
          company: "ABC 제조",
          companyId: "company1",
        },
        {
          id: "2",
          username: "user1",
          password: "user123",
          name: "이기사",
          email: "user1@company.com",
          level: "사용자",
          department: "생산1팀",
          position: "기사",
          company: "ABC 제조",
          companyId: "company1",
        },
        {
          id: "3",
          username: "manager",
          password: "manager123",
          name: "박매니저",
          email: "manager@company.com",
          level: "매니저",
          department: "설비관리팀",
          position: "과장",
          company: "XYZ 산업",
          companyId: "company2",
        },
      ]

      // 사용자 인증 확인
      const foundUser = mockUsers.find(
        (u) => u.username === username && u.password === password && u.companyId === companyId,
      )

      if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser
        setUser(userWithoutPassword)
        localStorage.setItem("fms-user", JSON.stringify(userWithoutPassword))
        setIsLoading(false)
        return true
      } else {
        setIsLoading(false)
        return false
      }
    } catch (error) {
      setIsLoading(false)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("fms-user")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
