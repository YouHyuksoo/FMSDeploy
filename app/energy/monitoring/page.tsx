"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts'

export default function EnergyMonitoringPage() {
  // 샘플 데이터 - 실제 데이터로 대체 필요
  const energyData = [
    { name: '00:00', 전력: 120, 가스: 80, 물: 50 },
    { name: '04:00', 전력: 180, 가스: 90, 물: 60 },
    { name: '08:00', 전력: 350, 가스: 120, 물: 80 },
    { name: '12:00', 전력: 420, 가스: 150, 물: 100 },
    { name: '16:00', 전력: 380, 가스: 130, 물: 90 },
    { name: '20:00', 전력: 280, 가스: 110, 물: 70 },
  ];

  const equipmentData = [
    { name: '프레스 #1', 전력: 400, 효율: 82 },
    { name: '용접기 #2', 전력: 350, 효율: 78 },
    { name: '컨베이어 #3', 전력: 280, 효율: 85 },
    { name: '크레인 #1', 전력: 320, 효율: 80 },
    { name: '냉각기 #2', 전력: 380, 효율: 75 },
  ];

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">에너지 모니터링</h2>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">개요</TabsTrigger>
          <TabsTrigger value="realtime">실시간 모니터링</TabsTrigger>
          <TabsTrigger value="alerts">경고 및 알림</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">전체 전력 사용량</CardTitle>
                <div className="h-4 w-4 text-muted-foreground">⚡</div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,245 kWh</div>
                <p className="text-xs text-muted-foreground">전일 대비 +12.3%</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">가스 사용량</CardTitle>
                <div className="h-4 w-4 text-muted-foreground">🔥</div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">845 m³</div>
                <p className="text-xs text-muted-foreground">전일 대비 -3.2%</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">물 사용량</CardTitle>
                <div className="h-4 w-4 text-muted-foreground">💧</div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">324 m³</div>
                <p className="text-xs text-muted-foreground">전일 대비 +2.1%</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">탄소 배출량</CardTitle>
                <div className="h-4 w-4 text-muted-foreground">🌱</div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1.2 tCO₂e</div>
                <p className="text-xs text-muted-foreground">전일 대비 -1.5%</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>시간별 에너지 사용 추이</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={energyData}
                      margin={{
                        top: 5,
                        right: 10,
                        left: 0,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="전력" stroke="#8884d8" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="가스" stroke="#82ca9d" />
                      <Line type="monotone" dataKey="물" stroke="#ffc658" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>설비별 전력 사용량</CardTitle>
                <CardDescription>상위 5개 설비 기준</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={equipmentData}
                      layout="vertical"
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={80} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="전력" fill="#8884d8" name="전력 사용량 (kWh)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="realtime" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>실시간 에너지 모니터링</CardTitle>
              <CardDescription>실시간 에너지 사용 현황을 모니터링합니다.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="h-[500px] bg-muted/40 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">실시간 모니터링 차트가 여기에 표시됩니다.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>에너지 이상 징후 알림</CardTitle>
              <CardDescription>에너지 사용 패턴에서 감지된 이상 징후를 확인하세요.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border p-4 bg-red-50 dark:bg-red-900/20">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-red-500"></div>
                  <div className="text-sm font-medium">프레스 #1에서 비정상적인 전력 소비 감지</div>
                  <div className="text-xs text-muted-foreground ml-auto">10분 전</div>
                </div>
                <p className="text-sm text-muted-foreground mt-1">평균 대비 45% 초과한 전력이 소모되고 있습니다.</p>
              </div>
              <div className="rounded-md border p-4 bg-yellow-50 dark:bg-yellow-900/20">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                  <div className="text-sm font-medium">냉각기 #2 냉각수 누수 가능성</div>
                  <div className="text-xs text-muted-foreground ml-auto">1시간 전</div>
                </div>
                <p className="text-sm text-muted-foreground mt-1">물 사용량이 갑자기 증가했습니다. 점검이 필요할 수 있습니다.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
