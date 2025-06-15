"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

export default function EnergyAnalysisPage() {
  // 샘플 데이터 - 실제 데이터로 대체 필요
  const dailyData = [
    { name: '월', 전력: 3200, 가스: 1800, 물: 1200 },
    { name: '화', 전력: 3100, 가스: 1750, 물: 1180 },
    { name: '수', 전력: 3350, 가스: 1850, 물: 1250 },
    { name: '목', 전력: 3500, 가스: 1900, 물: 1300 },
    { name: '금', 전력: 3600, 가스: 2000, 물: 1350 },
    { name: '토', 전력: 2800, 가스: 1500, 물: 1000 },
    { name: '일', 전력: 2500, 가스: 1400, 물: 900 },
  ];

  const monthlyData = [
    { name: '1월', 전력: 95000, 가스: 55000, 물: 35000 },
    { name: '2월', 전력: 92000, 가스: 53000, 물: 34000 },
    { name: '3월', 전력: 98000, 가스: 56000, 물: 36000 },
    { name: '4월', 전력: 95000, 가스: 54000, 물: 35000 },
    { name: '5월', 전력: 100000, 가스: 58000, 물: 38000 },
    { name: '6월', 전력: 105000, 가스: 60000, 물: 40000 },
  ];

  const energyByType = [
    { name: '전력', value: 65 },
    { name: '가스', value: 25 },
    { name: '물', value: 10 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">에너지 사용 분석</h2>
      </div>

      <Tabs defaultValue="daily" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="daily">일별 분석</TabsTrigger>
            <TabsTrigger value="weekly">주간 분석</TabsTrigger>
            <TabsTrigger value="monthly">월별 분석</TabsTrigger>
          </TabsList>
          <div className="flex space-x-2">
            <select className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option>전체 에너지 유형</option>
              <option>전력</option>
              <option>가스</option>
              <option>물</option>
            </select>
            <select className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option>전체 라인</option>
              <option>1라인</option>
              <option>2라인</option>
              <option>3라인</option>
            </select>
          </div>
        </div>

        <TabsContent value="daily" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>일별 에너지 사용 추이</CardTitle>
                <CardDescription>최근 7일간의 에너지 사용량 추이</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={dailyData}
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
                <CardTitle>에너지 유형별 비율</CardTitle>
                <CardDescription>전체 에너지 사용 대비 비율</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={energyByType}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {energyByType.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>에너지 사용 패턴</CardTitle>
                <CardDescription>시간대별 평균 사용량</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: '00-04', 전력: 120 },
                        { name: '04-08', 전력: 350 },
                        { name: '08-12', 전력: 420 },
                        { name: '12-16', 전력: 380 },
                        { name: '16-20', 전력: 320 },
                        { name: '20-24', 전력: 280 },
                      ]}
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
                      <Bar dataKey="전력" fill="#8884d8" name="전력 사용량 (kWh)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>에너지 효율 지표</CardTitle>
                <CardDescription>주요 KPI</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">에너지 집약도</div>
                  <div className="text-2xl font-bold">0.85 kWh/개</div>
                  <div className="text-sm text-green-600">전월 대비 5% 개선</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">에너지 절감량</div>
                  <div className="text-2xl font-bold">1,250 kWh</div>
                  <div className="text-sm text-green-600">목표 대비 78% 달성</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">재생에너지 비율</div>
                  <div className="text-2xl font-bold">12.5%</div>
                  <div className="text-sm text-green-600">전년 동기 대비 +3.2%p</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>에너지 경보 현황</CardTitle>
                <CardDescription>이번 달 발생한 경보</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">과부하 경고</span>
                    <span className="text-sm text-red-500">12건</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full">
                    <div className="h-full bg-red-500 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">이상 징후</span>
                    <span className="text-sm text-yellow-500">8건</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full">
                    <div className="h-full bg-yellow-500 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">유지보수 필요</span>
                    <span className="text-sm text-blue-500">5건</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="weekly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>주간 에너지 분석</CardTitle>
              <CardDescription>주간별 에너지 사용 추이를 분석합니다.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="h-[500px] bg-muted/40 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">주간 분석 차트가 여기에 표시됩니다.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>월별 에너지 사용 추이</CardTitle>
                <CardDescription>2024년 월별 에너지 사용량 추이</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={monthlyData}
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
                      <Bar dataKey="전력" fill="#8884d8" name="전력 (kWh)" />
                      <Bar dataKey="가스" fill="#82ca9d" name="가스 (m³)" />
                      <Bar dataKey="물" fill="#ffc658" name="물 (m³)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>에너지 비용 분석</CardTitle>
                <CardDescription>월별 에너지 비용 현황</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: '전기 요금', amount: 12500000, change: 5.2, trend: 'up' },
                    { name: '가스 요금', amount: 8500000, change: -2.1, trend: 'down' },
                    { name: '수도 요금', amount: 3200000, change: 1.5, trend: 'up' },
                    { name: '기타 에너지', amount: 1800000, change: 0, trend: 'same' },
                  ].map((item, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{item.name}</span>
                        <div className="flex items-center">
                          <span className="font-mono">{item.amount.toLocaleString()}원</span>
                          {item.trend === 'up' && (
                            <span className="ml-2 text-xs text-red-500">+{item.change}%</span>
                          )}
                          {item.trend === 'down' && (
                            <span className="ml-2 text-xs text-green-500">{item.change}%</span>
                          )}
                          {item.trend === 'same' && (
                            <span className="ml-2 text-xs text-gray-500">변동 없음</span>
                          )}
                        </div>
                      </div>
                      <div className="h-2 w-full bg-gray-200 rounded-full">
                        <div 
                          className={`h-full rounded-full ${
                            item.trend === 'up' ? 'bg-red-500' : 
                            item.trend === 'down' ? 'bg-green-500' : 'bg-gray-500'
                          }`} 
                          style={{ width: `${Math.min(100, item.amount / 15000000 * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>에너지 사용 예측</CardTitle>
              <CardDescription>향후 6개월간의 에너지 사용량 예측</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] bg-muted/40 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">에너지 사용 예측 차트가 여기에 표시됩니다.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
