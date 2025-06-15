import { Suspense } from "react"
import { EquipmentHealthDashboard } from "@/components/kpi/equipment-health-dashboard"
import { HealthTrendChart } from "@/components/kpi/health-trend-chart"
import { HealthRecommendations } from "@/components/kpi/health-recommendations"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Loading from "./loading"

export default function EquipmentHealthPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">설비 건강지수</h1>
          <p className="text-muted-foreground">설비별 건강상태 모니터링 및 분석</p>
        </div>
      </div>

      <Suspense fallback={<Loading />}>
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard">대시보드</TabsTrigger>
            <TabsTrigger value="trends">추이 분석</TabsTrigger>
            <TabsTrigger value="recommendations">개선 권장사항</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <EquipmentHealthDashboard />
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <HealthTrendChart />
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            <HealthRecommendations />
          </TabsContent>
        </Tabs>
      </Suspense>
    </div>
  )
}
