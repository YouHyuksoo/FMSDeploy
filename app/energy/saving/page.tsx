"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

export default function EnergySavingsPage() {
  // 샘플 데이터 - 실제 데이터로 대체 필요
  const savingsData = [
    { name: '1월', 절감량: 120, 목표: 150, 비용절감: 1200000 },
    { name: '2월', 절감량: 180, 목표: 150, 비용절감: 1500000 },
    { name: '3월', 절감량: 200, 목표: 200, 비용절감: 1800000 },
    { name: '4월', 절감량: 220, 목표: 200, 비용절감: 2000000 },
    { name: '5월', 절감량: 250, 목표: 250, 비용절감: 2300000 },
    { name: '6월', 절감량: 280, 목표: 250, 비용절감: 2500000 },
  ];

  const areaData = [
    { name: '생산라인 A', 절감량: 120, 목표: 150, 달성률: 80 },
    { name: '생산라인 B', 절감량: 90, 목표: 120, 달성률: 75 },
    { name: '사무실', 절감량: 70, 목표: 50, 달성률: 140 },
    { name: '조명', 절감량: 60, 목표: 80, 달성률: 75 },
    { name: '냉난방', 절감량: 110, 목표: 100, 달성률: 110 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">에너지 절감 현황</h2>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">개요</TabsTrigger>
          <TabsTrigger value="target">목표 대비 실적</TabsTrigger>
          <TabsTrigger value="analysis">에너지 절감 분석</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">연간 목표 달성률</CardTitle>
                <div className="h-4 w-4 text-muted-foreground">🎯</div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">85%</div>
                <p className="text-xs text-muted-foreground">목표 대비 +5% 초과</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">누적 절감 비용</CardTitle>
                <div className="h-4 w-4 text-muted-foreground">💰</div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,130만원</div>
                <p className="text-xs text-muted-foreground">전년 동기 대비 +15%</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">탄소 배출 감소</CardTitle>
                <div className="h-4 w-4 text-muted-foreground">🌱</div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">245 tCO2</div>
                <p className="text-xs text-muted-foreground">전년 대비 12% 감소</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>월별 에너지 절감 추이</CardTitle>
                <CardDescription>월별 에너지 절감량과 목표 대비 실적을 확인하세요.</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={savingsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => 
                        name === '비용절감' ? 
                        [`${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원`, name] : 
                        [`${value} kWh`, name]
                      }
                    />
                    <Legend />
                    <Bar dataKey="절감량" fill="#8884d8" name="절감량 (kWh)" />
                    <Bar dataKey="목표" fill="#82ca9d" name="목표 (kWh)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>에너지 절감 비용</CardTitle>
                <CardDescription>에너지 절감으로 인한 비용 절감 현황입니다.</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={savingsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis 
                      yAxisId="left"
                      label={{ value: 'kWh', angle: -90, position: 'insideLeft' }}
                    />
                    <YAxis 
                      yAxisId="right" 
                      orientation="right"
                      label={{ value: '원', angle: 90, position: 'insideRight' }}
                      tickFormatter={(value) => `${(value / 10000).toFixed(0)}만`}
                    />
                    <Tooltip 
                      formatter={(value, name) => 
                        name === '비용절감' ? 
                        [`${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원`, name] : 
                        [`${value} kWh`, name]
                      }
                    />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="절감량" stroke="#8884d8" name="절감량 (kWh)" />
                    <Line yAxisId="right" type="monotone" dataKey="비용절감" stroke="#82ca9d" name="비용절감 (원)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="target" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>부서별 목표 대비 실적</CardTitle>
              <CardDescription>각 부서별 에너지 절감 목표 대비 실적을 확인하세요.</CardDescription>
            </CardHeader>
            <CardContent className="h-[500px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={areaData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip 
                    formatter={(value, name) => 
                      name === '달성률' ? 
                      [`${value}%`, name] : 
                      [`${value} kWh`, name]
                    }
                  />
                  <Legend />
                  <Bar dataKey="절감량" fill="#8884d8" name="절감량 (kWh)" />
                  <Bar dataKey="목표" fill="#82ca9d" name="목표 (kWh)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>에너지원별 절감 비중</CardTitle>
                <CardDescription>에너지원별 절감 비중을 확인하세요.</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: '전력', value: 45 },
                        { name: '가스', value: 25 },
                        { name: '수도', value: 15 },
                        { name: '증기', value: 10 },
                        { name: '기타', value: 5 },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {areaData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>절감 조치 효과 분석</CardTitle>
                <CardDescription>수행한 절감 조치별 효과를 분석합니다.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: '고효율 모터 교체', effect: 35, cost: 12000000, savings: 4500000 },
                    { name: 'LED 조명 교체', effect: 25, cost: 8000000, savings: 3200000 },
                    { name: '공조 시스템 최적화', effect: 20, cost: 5000000, savings: 2800000 },
                    { name: '설비 에너지 모니터링 시스템', effect: 15, cost: 10000000, savings: 3800000 },
                    { name: '절수 설비 개선', effect: 5, cost: 3000000, savings: 800000 },
                  ].map((item, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.name}</span>
                        <span className="text-sm text-muted-foreground">{item.effect}%</span>
                      </div>
                      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full" 
                          style={{ width: `${item.effect}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>투자비: {item.cost.toLocaleString()}원</span>
                        <span>연간 절감액: {item.savings.toLocaleString()}원</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
