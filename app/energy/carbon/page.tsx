"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

export default function CarbonEmissionsPage() {
  // 샘플 데이터 - 실제 데이터로 대체 필요
  const monthlyEmissions = [
    { name: '1월', 배출량: 125, 목표: 140 },
    { name: '2월', 배출량: 132, 목표: 140 },
    { name: '3월', 배출량: 141, 목표: 140 },
    { name: '4월', 배출량: 138, 목표: 135 },
    { name: '5월', 배출량: 142, 목표: 135 },
    { name: '6월', 배출량: 136, 목표: 135 },
    { name: '7월', 배출량: 130, 목표: 130 },
    { name: '8월', 배출량: 135, 목표: 130 },
    { name: '9월', 배출량: 128, 목표: 130 },
    { name: '10월', 배출량: 125, 목표: 125 },
    { name: '11월', 배출량: 122, 목표: 125 },
    { name: '12월', 배출량: 118, 목표: 125 },
  ];

  const emissionBySource = [
    { name: '전력', value: 65 },
    { name: '가스', value: 25 },
    { name: '수송', value: 7 },
    { name: '폐기물', value: 3 },
  ];

  const reductionInitiatives = [
    {
      id: 1,
      title: '재생에너지 전환',
      description: '태양광 패널 설치 및 재생에너지 구매',
      reductionPotential: 45, // tCO2e/년
      cost: 125000000,
      roi: 5.2,
      status: '계획',
    },
    {
      id: 2,
      title: '에너지 효율 개선',
      description: '고효율 장비로의 교체 및 최적화',
      reductionPotential: 28,
      cost: 75000000,
      roi: 3.8,
      status: '진행 중',
    },
    {
      id: 3,
      title: '탄소 상쇄 프로그램',
      description: '산림 조성 및 보존 프로젝트 지원',
      reductionPotential: 15,
      cost: 30000000,
      roi: 2.5,
      status: '검토 중',
    },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">탄소 배출 추적</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">연간 탄소 배출량</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">🌍</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,548 tCO₂e</div>
            <p className="text-xs text-muted-foreground">전년 대비 -8.2%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">탄소 집약도</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">📊</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0.45 tCO₂/백만원</div>
            <p className="text-xs text-muted-foreground">산업 평균 0.62 대비 -27%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">재생에너지 비율</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">☀️</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.5%</div>
            <p className="text-xs text-muted-foreground">목표 15% 대비 83% 달성</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">탄소 중합 목표</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">🎯</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2030년</div>
            <p className="text-xs text-muted-foreground">2018년 대비 50% 감축</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>월별 탄소 배출 추이</CardTitle>
            <CardDescription>2024년 목표 대비 실제 배출량</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlyEmissions}
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
                  <Line type="monotone" dataKey="배출량" stroke="#8884d8" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="목표" stroke="#82ca9d" strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>배출원별 비중</CardTitle>
            <CardDescription>전체 탄소 배출량 대비 비율</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={emissionBySource}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {emissionBySource.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} tCO₂e`, '배출량']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>탄소 감축 계획</CardTitle>
            <CardDescription>탄소 배출량 감축을 위한 주요 계획 및 진행 상황</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reductionInitiatives.map((initiative) => (
                <div key={initiative.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{initiative.title}</h4>
                      <p className="text-sm text-muted-foreground">{initiative.description}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      initiative.status === '진행 중' ? 'bg-blue-100 text-blue-800' :
                      initiative.status === '계획' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {initiative.status}
                    </span>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-sm text-muted-foreground">감축 잠재량</div>
                      <div className="font-medium">{initiative.reductionPotential} tCO₂e/년</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">예상 비용</div>
                      <div className="font-medium">{(initiative.cost / 10000).toLocaleString()}만원</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">ROI</div>
                      <div className="font-medium">{initiative.roi}년</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>탄소 중립 로드맵</CardTitle>
            <CardDescription>2050년까지의 탄소 중립 달성을 위한 단계별 계획</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="absolute left-4 h-full w-0.5 bg-gray-200"></div>
              <div className="space-y-8">
                {[
                  { 
                    year: '2024-2025', 
                    title: '기반 구축 단계',
                    items: [
                      '에너지 감사 실시',
                      '기준 배출량 설정',
                      '단기 감축 목표 수립'
                    ] 
                  },
                  { 
                    year: '2026-2030', 
                    title: '감축 가속화 단계',
                    items: [
                      '재생에너지 비중 30% 달성',
                      '에너지 효율 20% 개선',
                      '탄소 배출량 30% 감축'
                    ] 
                  },
                  { 
                    year: '2031-2040', 
                    title: '전환 가속 단계',
                    items: [
                      '재생에너지 비중 70% 달성',
                      '탄소 배출량 70% 감축',
                      '탄소 포집 기술 도입'
                    ] 
                  },
                  { 
                    year: '2041-2050', 
                    title: '탄소 중립 달성',
                    items: [
                      '재생에너지 100% 전환',
                      '잔여 배출량 상쇄',
                      '탄소 중립 인증 획득'
                    ] 
                  },
                ].map((item, index) => (
                  <div key={index} className="relative pl-8">
                    <div className="absolute left-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center -ml-4">
                      <span className="text-sm font-medium text-blue-800">{item.year}</span>
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-medium">{item.title}</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {item.items.map((task, i) => (
                          <li key={i} className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>탄소 배출 보고서</CardTitle>
          <CardDescription>탄소 배출량에 대한 상세 보고서 및 인증 정보</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { 
                title: 'GHG 프로토콜 준수', 
                status: '인증 완료', 
                date: '2024-03-15',
                description: '국제 표준 GHG 프로토콜에 따른 배출량 산정'
              },
              { 
                title: 'CDP 등급', 
                status: 'B', 
                date: '2023-12-01',
                description: '기후변화 대응 성과 평가'
              },
              { 
                title: 'RE100 가입', 
                status: '진행 중', 
                date: '2024-01-20',
                description: '재생에너지 100% 사용을 위한 이니셔티브'
              },
              { 
                title: 'SBTi 목표 설정', 
                status: '검증 완료', 
                date: '2023-11-10',
                description: '과학 기반 감축 목표 설정 이니셔티브'
              },
            ].map((item, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">{item.title}</h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    item.status === '인증 완료' || item.status === '검증 완료' ? 'bg-green-100 text-green-800' :
                    item.status === '진행 중' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                <div className="mt-2 text-xs text-gray-500">갱신일: {item.date}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
