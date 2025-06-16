"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, BarChart, PieChart } from "@/components/charts";
import {
  CalendarDays,
  Building2,
  Factory,
  TrendingDown,
  Target,
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
} from "lucide-react";

export default function CarbonEmissionPage() {
  const [timeRange, setTimeRange] = useState("month");

  return (
    <div className="space-y-4 p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">탄소배출 현황</h1>
        <div className="flex gap-2">
          <select
            className="border rounded-md px-3 py-2"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="month">월간</option>
            <option value="quarter">분기</option>
            <option value="year">연간</option>
          </select>
        </div>
      </div>

      {/* 주요 지표 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 탄소배출량</CardTitle>
            <Factory className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234 tCO₂</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowDown className="h-4 w-4 text-green-500 mr-1" />
              전년 대비 -12.3%
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">탄소배출 강도</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0.45 tCO₂/백만원</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowDown className="h-4 w-4 text-green-500 mr-1" />
              전년 대비 -8.5%
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">목표 달성률</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
              목표 대비 +5%
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">위험 지표</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3건</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowDown className="h-4 w-4 text-green-500 mr-1" />
              전월 대비 -2건
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 상세 분석 탭 */}
      <Tabs defaultValue="trend" className="space-y-4">
        <TabsList className="grid grid-cols-4 gap-4">
          <TabsTrigger value="trend" className="flex items-center gap-2">
            <LineChartIcon className="h-4 w-4" />
            배출 추이
          </TabsTrigger>
          <TabsTrigger value="department" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            부서별 현황
          </TabsTrigger>
          <TabsTrigger value="facility" className="flex items-center gap-2">
            <PieChartIcon className="h-4 w-4" />
            설비별 현황
          </TabsTrigger>
          <TabsTrigger value="target" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            목표 대비 실적
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trend" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>탄소배출량 추이</CardTitle>
            </CardHeader>
            <CardContent>
              <LineChart
                data={[
                  { date: "2024-01", value: 120 },
                  { date: "2024-02", value: 115 },
                  { date: "2024-03", value: 110 },
                  { date: "2024-04", value: 105 },
                  { date: "2024-05", value: 100 },
                  { date: "2024-06", value: 95 },
                ]}
                xField="date"
                yField="value"
                height={300}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="department" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>부서별 탄소배출 현황</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart
                data={[
                  { department: "생산1팀", value: 450 },
                  { department: "생산2팀", value: 380 },
                  { department: "연구개발팀", value: 220 },
                  { department: "사무행정팀", value: 150 },
                ]}
                xField="department"
                yField="value"
                height={300}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="facility" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>설비별 탄소배출 현황</CardTitle>
            </CardHeader>
            <CardContent>
              <PieChart
                data={[
                  { facility: "보일러", value: 400 },
                  { facility: "냉각장치", value: 300 },
                  { facility: "공조장치", value: 200 },
                  { facility: "기타설비", value: 100 },
                ]}
                angleField="value"
                colorField="facility"
                height={300}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="target" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>목표 대비 실적</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>연간 감축 목표</span>
                  <span className="font-bold">-15%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-green-600 h-2.5 rounded-full"
                    style={{ width: "85%" }}
                  ></div>
                </div>
                <div className="text-sm text-gray-500">
                  현재 달성률: 85% (-12.3% 감축)
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
