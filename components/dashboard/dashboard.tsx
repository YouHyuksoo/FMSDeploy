"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, AlertTriangle, CheckCircle, Clock } from "lucide-react"
import { useTranslation } from "@/lib/language-context"

export function Dashboard() {
  const { t } = useTranslation("dashboard")

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">{t("title")}</h2>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("total_equipment")}</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+2% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("failed_equipment")}</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">23</div>
            <p className="text-xs text-muted-foreground">-5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("inspection_rate")}</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">94.2%</div>
            <p className="text-xs text-muted-foreground">+1.2% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("pending_work")}</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">47</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("recent_failures")}</CardTitle>
            <CardDescription>{t("recent_failures_desc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">압축기 #001</p>
                  <p className="text-sm text-muted-foreground">베어링 이상</p>
                </div>
                <span className="text-sm text-red-600">2시간 전</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">컨베이어 #005</p>
                  <p className="text-sm text-muted-foreground">모터 과열</p>
                </div>
                <span className="text-sm text-red-600">5시간 전</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">펌프 #003</p>
                  <p className="text-sm text-muted-foreground">누수 발생</p>
                </div>
                <span className="text-sm text-red-600">1일 전</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("todays_inspection")}</CardTitle>
            <CardDescription>{t("todays_inspection_desc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">일일점검 - A라인</p>
                  <p className="text-sm text-muted-foreground">담당자: 김기사</p>
                </div>
                <span className="text-sm text-green-600">완료</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">주간점검 - B라인</p>
                  <p className="text-sm text-muted-foreground">담당자: 이기사</p>
                </div>
                <span className="text-sm text-orange-600">진행중</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">월간점검 - C라인</p>
                  <p className="text-sm text-muted-foreground">담당자: 박기사</p>
                </div>
                <span className="text-sm text-muted-foreground">대기</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
