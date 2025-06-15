"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Plus, DollarSign, TrendingUp, AlertCircle } from "lucide-react"

interface BudgetItem {
  id: string
  category: string
  budgetAmount: number
  usedAmount: number
  remainingAmount: number
  usageRate: number
  status: "normal" | "warning" | "critical"
}

const mockBudgetData: BudgetItem[] = [
  {
    id: "1",
    category: "정기교정",
    budgetAmount: 50000000,
    usedAmount: 32000000,
    remainingAmount: 18000000,
    usageRate: 64,
    status: "normal",
  },
  {
    id: "2",
    category: "긴급교정",
    budgetAmount: 15000000,
    usedAmount: 12500000,
    remainingAmount: 2500000,
    usageRate: 83,
    status: "warning",
  },
  {
    id: "3",
    category: "재교정",
    budgetAmount: 8000000,
    usedAmount: 7800000,
    remainingAmount: 200000,
    usageRate: 97.5,
    status: "critical",
  },
  {
    id: "4",
    category: "출장교정",
    budgetAmount: 20000000,
    usedAmount: 8500000,
    remainingAmount: 11500000,
    usageRate: 42.5,
    status: "normal",
  },
]

export function CalibrationBudgetManagement() {
  const [budgetData] = useState<BudgetItem[]>(mockBudgetData)

  const totalBudget = budgetData.reduce((sum, item) => sum + item.budgetAmount, 0)
  const totalUsed = budgetData.reduce((sum, item) => sum + item.usedAmount, 0)
  const totalRemaining = budgetData.reduce((sum, item) => sum + item.remainingAmount, 0)
  const overallUsageRate = (totalUsed / totalBudget) * 100

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "bg-green-500"
      case "warning":
        return "bg-yellow-500"
      case "critical":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "normal":
        return "정상"
      case "warning":
        return "주의"
      case "critical":
        return "위험"
      default:
        return "알 수 없음"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">교정 예산 관리</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          예산 추가
        </Button>
      </div>

      {/* 예산 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 예산</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalBudget)}</div>
            <p className="text-xs text-muted-foreground">2024년 교정 예산</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">사용 금액</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalUsed)}</div>
            <p className="text-xs text-muted-foreground">현재까지 사용</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">잔여 예산</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRemaining)}</div>
            <p className="text-xs text-muted-foreground">사용 가능 금액</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">사용률</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallUsageRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">전체 예산 대비</p>
          </CardContent>
        </Card>
      </div>

      {/* 카테고리별 예산 현황 */}
      <Card>
        <CardHeader>
          <CardTitle>카테고리별 예산 현황</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {budgetData.map((item) => (
              <div key={item.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(item.status)}`} />
                    <h3 className="font-medium">{item.category}</h3>
                    <Badge variant="outline">{getStatusText(item.status)}</Badge>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{item.usageRate.toFixed(1)}% 사용</div>
                    <div className="text-sm text-muted-foreground">
                      {formatCurrency(item.usedAmount)} / {formatCurrency(item.budgetAmount)}
                    </div>
                  </div>
                </div>
                <Progress value={item.usageRate} className="h-2" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>잔여: {formatCurrency(item.remainingAmount)}</span>
                  <span>
                    {item.usageRate > 90 ? "예산 부족 주의" : item.usageRate > 80 ? "예산 관리 필요" : "정상"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
