"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UsageTrendChart } from "./usage-trend-chart"
import { MeterTypeComparisonChart } from "./meter-type-comparison-chart"
import { CostAnalysisChart } from "./cost-analysis-chart"
import { EquipmentUsageChart } from "./equipment-usage-chart"
import { mockMeterReadings } from "@/lib/mock-data/metering"
import { meterTypeLabels } from "@/types/metering"

export function MeterReadingCharts() {
  const [timeRange, setTimeRange] = useState<string>("30")
  const [meterType, setMeterType] = useState<string>("all")

  // 시간 범위에 따라 데이터 필터링
  const filterDataByTimeRange = () => {
    const today = new Date()
    const startDate = new Date(today)

    switch (timeRange) {
      case "7":
        startDate.setDate(today.getDate() - 7)
        break
      case "30":
        startDate.setDate(today.getDate() - 30)
        break
      case "90":
        startDate.setDate(today.getDate() - 90)
        break
      case "180":
        startDate.setDate(today.getDate() - 180)
        break
      case "365":
        startDate.setDate(today.getDate() - 365)
        break
      default:
        startDate.setDate(today.getDate() - 30)
    }

    return mockMeterReadings.filter((reading) => {
      const readingDate = new Date(reading.readingDate)
      return readingDate >= startDate && readingDate <= today
    })
  }

  // 계측기 유형에 따라 데이터 필터링
  const filterDataByMeterType = (data: typeof mockMeterReadings) => {
    if (meterType === "all") {
      return data
    }
    return data.filter((reading) => reading.meterType === meterType)
  }

  // 필터링된 데이터
  const filteredData = filterDataByMeterType(filterDataByTimeRange())

  // 통계 계산
  const totalConsumption = filteredData.reduce((sum, reading) => sum + reading.consumption, 0)
  const totalCost = filteredData.reduce((sum, reading) => sum + reading.cost, 0)
  const readingCount = filteredData.length
  const uniqueEquipments = new Set(filteredData.map((reading) => reading.equipmentId)).size
  const confirmedReadings = filteredData.filter((reading) => reading.status === "confirmed").length

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">검침 데이터 분석</h2>
          <p className="text-muted-foreground">검침 데이터를 다양한 차트로 시각화하여 분석합니다.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-[180px]">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger>
                <SelectValue placeholder="기간 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">최근 7일</SelectItem>
                <SelectItem value="30">최근 30일</SelectItem>
                <SelectItem value="90">최근 90일</SelectItem>
                <SelectItem value="180">최근 180일</SelectItem>
                <SelectItem value="365">최근 1년</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:w-[180px]">
            <Select value={meterType} onValueChange={setMeterType}>
              <SelectTrigger>
                <SelectValue placeholder="계측기 유형" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                {Object.entries(meterTypeLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 사용량</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalConsumption.toLocaleString()} 단위</div>
            <p className="text-xs text-muted-foreground">{readingCount}회 검침 기준</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 비용</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₩{totalCost.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              평균 ₩{readingCount > 0 ? Math.round(totalCost / readingCount).toLocaleString() : 0}/회
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">검침 횟수</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{readingCount.toLocaleString()}회</div>
            <p className="text-xs text-muted-foreground">확인됨: {confirmedReadings}회</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">활성 설비</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueEquipments}대</div>
            <p className="text-xs text-muted-foreground">
              설비당 평균 {uniqueEquipments > 0 ? Math.round(readingCount / uniqueEquipments) : 0}회 검침
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">평균 사용량</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {readingCount > 0 ? Math.round(totalConsumption / readingCount).toLocaleString() : 0} 단위
            </div>
            <p className="text-xs text-muted-foreground">검침당 평균</p>
          </CardContent>
        </Card>
      </div>

      {/* 차트 탭 */}
      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trends">사용량 트렌드</TabsTrigger>
          <TabsTrigger value="comparison">유형별 비교</TabsTrigger>
          <TabsTrigger value="cost">비용 분석</TabsTrigger>
          <TabsTrigger value="equipment">설비별 분석</TabsTrigger>
        </TabsList>
        <TabsContent value="trends" className="space-y-4">
          <UsageTrendChart data={filteredData} />
        </TabsContent>
        <TabsContent value="comparison" className="space-y-4">
          <MeterTypeComparisonChart data={filteredData} />
        </TabsContent>
        <TabsContent value="cost" className="space-y-4">
          <CostAnalysisChart data={filteredData} />
        </TabsContent>
        <TabsContent value="equipment" className="space-y-4">
          <EquipmentUsageChart data={filteredData} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
