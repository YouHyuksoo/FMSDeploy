"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, BarChart3, LineChart, Download, Calendar as CalendarIcon, Zap, Trash2, Plus, Pencil } from "lucide-react"
import { DatePicker } from "@/components/ui/date-picker"
import { Badge } from "@/components/ui/badge"

type PredictionScenario = {
  id: string
  name: string
  description: string
  lastRun: string
  status: "success" | "warning" | "error"
}

type PredictionModel = {
  id: string
  name: string
  accuracy: number
  lastTrained: string
  status: "active" | "training" | "error"
}

export default function AIPredictionPage() {
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setMonth(new Date().getMonth() - 12)),
    to: new Date()
  })
  const [selectedModel, setSelectedModel] = useState("model1")
  const [activeTab, setActiveTab] = useState("overview")
  
  const scenarios: PredictionScenario[] = [
    {
      id: "1",
      name: "2025년 연간 탄소배출 예측",
      description: "과거 데이터를 기반으로 한 2025년도 탄소배출량 예측",
      lastRun: "2024-06-10 14:30:45",
      status: "success"
    },
    {
      id: "2",
      name: "에너지 효율화 사후 분석",
      description: "에너지 효율화 조치 전후 탄소배출량 비교 분석",
      lastRun: "2024-05-28 09:15:22",
      status: "success"
    },
    {
      id: "3",
      name: "탄소중립 달성 시나리오",
      description: "2050년까지의 탄소중립 달성을 위한 다양한 시나리오 분석",
      lastRun: "2024-06-15 16:45:10",
      status: "warning"
    }
  ]

  const models: PredictionModel[] = [
    {
      id: "model1",
      name: "시계열 ARIMA 모델",
      accuracy: 0.92,
      lastTrained: "2024-06-01",
      status: "active"
    },
    {
      id: "model2",
      name:"LSTM 신경망",
      accuracy: 0.87,
      lastTrained: "2024-05-15",
      status: "active"
    },
    {
      id: "model3",
      name: "Prophet 예측 모델",
      accuracy: 0.89,
      lastTrained: "2024-05-20",
      status: "training"
    }
  ]

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">AI 예측 분석</h2>
          <p className="text-muted-foreground">
            AI를 활용한 탄소 배출량 예측 및 분석을 수행하세요.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Download className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              결과 내보내기
            </span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">개요</TabsTrigger>
          <TabsTrigger value="scenarios">시나리오 관리</TabsTrigger>
          <TabsTrigger value="models">모델 관리</TabsTrigger>
          <TabsTrigger value="history">실행 이력</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">예측 정확도</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">92.3%</div>
                <p className="text-xs text-muted-foreground">지난 30일 평균</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">활성 모델</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3개</div>
                <p className="text-xs text-muted-foreground">2개 모델 학습 완료</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">저장된 시나리오</CardTitle>
                <LineChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5개</div>
                <p className="text-xs text-muted-foreground">3개 시나리오 실행 중</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>탄소 배출량 예측</CardTitle>
                <CardDescription>선택한 기간에 대한 탄소 배출량 예측 결과입니다.</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <div className="flex flex-col space-y-4 h-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">예측 모델:</span>
                      <Select value={selectedModel} onValueChange={setSelectedModel}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="모델 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          {models.map((model) => (
                            <SelectItem key={model.id} value={model.id}>
                              {model.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DatePicker
                        mode="range"
                        selected={dateRange}
                        onSelect={setDateRange}
                        className="w-[260px]"
                        fromDate={new Date(2020, 0, 1)}
                        toDate={new Date(2030, 11, 31)}
                        placeholderText="날짜 범위 선택"
                      />
                    </div>
                  </div>
                  <div className="flex-1 flex items-center justify-center border rounded-md bg-muted/50">
                    <p className="text-muted-foreground">
                      탄소 배출량 예측 차트가 여기에 표시됩니다.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>예측 시나리오</CardTitle>
                <CardDescription>저장된 예측 시나리오 목록입니다.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {scenarios.map((scenario) => (
                    <div key={scenario.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{scenario.name}</h3>
                          <p className="text-sm text-muted-foreground">{scenario.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            마지막 실행: {scenario.lastRun}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">실행</Button>
                          <Button variant="ghost" size="icon">
                            <CalendarIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {scenario.status === "warning" && (
                        <div className="mt-2 text-xs text-amber-600 flex items-center">
                          <span className="w-2 h-2 rounded-full bg-amber-500 mr-1"></span>
                          데이터 부족으로 정확도가 낮을 수 있습니다.
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>예측 시나리오 관리</CardTitle>
                  <CardDescription>
                    저장된 예측 시나리오를 관리하고 새 시나리오를 생성할 수 있습니다.
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  새 시나리오
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scenarios.map((scenario) => (
                  <div key={scenario.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{scenario.name}</h3>
                        <p className="text-sm text-muted-foreground">{scenario.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          마지막 실행: {scenario.lastRun}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">실행</Button>
                        <Button variant="outline" size="sm">수정</Button>
                        <Button variant="ghost" size="icon" className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="models" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>예측 모델 관리</CardTitle>
                  <CardDescription>
                    예측에 사용되는 AI 모델을 관리하고 학습시킬 수 있습니다.
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  새 모델
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {models.map((model) => (
                  <div key={model.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{model.name}</h3>
                        <div className="flex items-center space-x-4 mt-1">
                          <div className="text-sm text-muted-foreground">
                            정확도: <span className="font-mono">{(model.accuracy * 100).toFixed(1)}%</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            마지막 학습: {model.lastTrained}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={model.status === 'active' ? 'default' : model.status === 'training' ? 'secondary' : 'destructive'}>
                          {model.status === 'active' ? '사용 가능' : model.status === 'training' ? '학습 중' : '오류'}
                        </Badge>
                        <Button variant="outline" size="sm">학습</Button>
                        <Button variant="ghost" size="icon" className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {model.status === 'training' && (
                      <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ width: '65%' }}
                          ></div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">학습 진행 중 (65%)</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>실행 이력</CardTitle>
              <CardDescription>
                과거에 실행된 예측 작업의 이력을 확인할 수 있습니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h3 className="font-medium">2025년 연간 탄소배출 예측</h3>
                    <p className="text-sm text-muted-foreground">2024-06-10 14:30:45</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="default">완료</Badge>
                    <Button variant="ghost" size="sm">결과 보기</Button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h3 className="font-medium">에너지 효율화 사후 분석</h3>
                    <p className="text-sm text-muted-foreground">2024-05-28 09:15:22</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="default">완료</Badge>
                    <Button variant="ghost" size="sm">결과 보기</Button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h3 className="font-medium">탄소중립 달성 시나리오</h3>
                    <p className="text-sm text-muted-foreground">2024-06-15 16:45:10</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">실행 중</Badge>
                    <Button variant="ghost" size="sm">상세 보기</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
