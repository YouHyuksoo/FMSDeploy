"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search, Plus, Target, CheckCircle, AlertCircle, Clock, BarChart3 } from "lucide-react"
import { Progress } from "@/components/ui/progress"

type TargetStatus = 'on_track' | 'at_risk' | 'achieved' | 'not_started'

type CarbonTarget = {
  id: string
  name: string
  description: string
  baselineYear: number
  targetYear: number
  baselineEmission: number
  targetEmission: number
  currentEmission: number
  status: TargetStatus
  progress: number
}

export default function CarbonTargetsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  
  const [targets, setTargets] = useState<CarbonTarget[]>([
    {
      id: "1",
      name: "2030년 탄소중립 목표",
      description: "2030년까지 탄소배출량 40% 감축 (대비 2018년)",
      baselineYear: 2018,
      targetYear: 2030,
      baselineEmission: 100000,
      targetEmission: 60000,
      currentEmission: 85000,
      status: "on_track",
      progress: 42.8
    },
    {
      id: "2",
      name: "재생에너지 전환 가속화",
      description: "2025년까지 재생에너지 비중 30% 달성",
      baselineYear: 2020,
      targetYear: 2025,
      baselineEmission: 80000,
      targetEmission: 56000,
      currentEmission: 72000,
      status: "at_risk",
      progress: 33.3
    },
    {
      id: "3",
      name: "사업장 에너지 효율 개선",
      description: "2024년까지 에너지 소비 효율 15% 개선",
      baselineYear: 2021,
      targetYear: 2024,
      baselineEmission: 50000,
      targetEmission: 42500,
      currentEmission: 40000,
      status: "achieved",
      progress: 133.3
    },
    {
      id: "4",
      name: "전기차 전환 계획",
      description: "2026년까지 회사 차량 100% 전기차 전환",
      baselineYear: 2023,
      targetYear: 2026,
      baselineEmission: 15000,
      targetEmission: 0,
      currentEmission: 12000,
      status: "on_track",
      progress: 20.0
    },
    {
      id: "5",
      name: "제조 공정 개선",
      description: "2025년까지 제조 공정에서의 탄소배출 25% 감축",
      baselineYear: 2022,
      targetYear: 2025,
      baselineEmission: 45000,
      targetEmission: 33750,
      currentEmission: 44000,
      status: "not_started",
      progress: 8.9
    }
  ])

  const filteredTargets = targets.filter(target => {
    const matchesSearch = target.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        target.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (activeTab === "all") return matchesSearch
    return target.status === activeTab && matchesSearch
  })

  const getStatusBadge = (status: TargetStatus) => {
    switch (status) {
      case 'on_track':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
            정상 진행 중
          </span>
        )
      case 'at_risk':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <span className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></span>
            위험
          </span>
        )
      case 'achieved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            달성 완료
          </span>
        )
      case 'not_started':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <Clock className="w-3 h-3 mr-1" />
            시작 전
          </span>
        )
      default:
        return null
    }
  }

  const getStatusCount = (status: TargetStatus) => {
    return targets.filter(target => target.status === status).length
  }

  const totalReduction = targets.reduce((sum, target) => {
    return sum + (target.baselineEmission - target.currentEmission)
  }, 0)

  const totalTargetReduction = targets.reduce((sum, target) => {
    return sum + (target.baselineEmission - target.targetEmission)
  }, 0)

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">탄소 배출 감축 목표</h2>
          <p className="text-muted-foreground">
            기업의 탄소 중립을 위한 감축 목표를 설정하고 관리하세요.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            새 목표 추가
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">전체 목표</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{targets.length}</div>
            <p className="text-xs text-muted-foreground">설정된 감축 목표 수</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">달성 예상 감축량</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(totalTargetReduction / 1000)}k tCO₂e
            </div>
            <p className="text-xs text-muted-foreground">목표 감축량 대비</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">현재 감축 실적</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(totalReduction / 1000)}k tCO₂e
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round((totalReduction / totalTargetReduction) * 100)}% 달성
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">달성률</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((getStatusCount('achieved') / targets.length) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {getStatusCount('achieved')} / {targets.length} 목표 달성
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <CardTitle>탄소 감축 목표</CardTitle>
              <CardDescription>
                설정된 탄소 감축 목표를 확인하고 관리할 수 있습니다.
              </CardDescription>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="검색..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="mt-4"
          >
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">전체</TabsTrigger>
              <TabsTrigger value="on_track">정상 진행</TabsTrigger>
              <TabsTrigger value="at_risk">위험</TabsTrigger>
              <TabsTrigger value="achieved">달성 완료</TabsTrigger>
              <TabsTrigger value="not_started">시작 전</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTargets.length > 0 ? (
              filteredTargets.map((target) => (
                <div key={target.id} className="border rounded-lg p-4">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">{target.name}</h3>
                        {getStatusBadge(target.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">{target.description}</p>
                      
                      <div className="pt-2">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>기준 연도 ({target.baselineYear}): {target.baselineEmission.toLocaleString()} tCO₂e</span>
                          <span>목표 연도 ({target.targetYear}): {target.targetEmission.toLocaleString()} tCO₂e</span>
                        </div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-muted-foreground">
                            {target.status === 'achieved' ? '달성' : '현재'}: {target.currentEmission.toLocaleString()} tCO₂e
                          </span>
                          <span className="font-medium">
                            {Math.round(((target.baselineEmission - target.currentEmission) / (target.baselineEmission - target.targetEmission)) * 100)}% 달성
                          </span>
                        </div>
                        <Progress value={target.progress > 100 ? 100 : target.progress} className="h-2" />
                      </div>
                    </div>
                    <div className="flex flex-shrink-0 space-x-2">
                      <Button variant="outline" size="sm">상세 보기</Button>
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Target className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">대상이 없습니다</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {searchTerm ? '검색 결과가 없습니다.' : '새로운 탄소 감축 목표를 추가해보세요.'}
                </p>
                {!searchTerm && (
                  <Button className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    새 목표 추가
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>감축 목표 달성 현황</CardTitle>
            <CardDescription>
              설정된 감축 목표별 달성 현황을 확인하세요.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              감축 목표 달성 현황 차트가 여기에 표시됩니다.
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>연간 감축 실적</CardTitle>
            <CardDescription>
              연도별 탄소 감축 실적을 확인하세요.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              연간 감축 실적 차트가 여기에 표시됩니다.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
