"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Calendar, Zap, TrendingUp, AlertTriangle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type TimeRange = 'week' | 'month' | 'quarter' | 'year';

// 목업 데이터 생성 함수
const generateMockData = (days: number) => {
  const data = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // 실제 데이터가 있다면 여기서 API 호출
    const actual = 1000 + Math.random() * 500;
    // 예측값 (실제값에 약간의 변동을 주어 생성)
    const predicted = actual * (0.95 + Math.random() * 0.1);
    
    data.push({
      date: date.toISOString().split('T')[0],
      actual: Math.round(actual),
      predicted: Math.round(predicted),
      upper: Math.round(predicted * 1.1), // 상한선
      lower: Math.round(predicted * 0.9)  // 하한선
    });
  }
  
  return data;
};

// AI 인사이트 목업 데이터
const mockInsights = [
  {
    id: 1,
    title: "에너지 사용량 증가 경고",
    description: "다음 주 수요일 오후 2시 경에 에너지 사용량이 15% 증가할 것으로 예상됩니다.",
    severity: "high",
    date: "2024-06-15",
    suggestedAction: "피크 시간대 생산 일정 조정을 고려해보세요.",
    icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />
  },
  {
    id: 2,
    title: "에너지 효율 개선 기회",
    description: "B동 공조 시스템이 비효율적으로 작동하고 있습니다. 점검을 권장합니다.",
    severity: "medium",
    date: "2024-06-14",
    suggestedAction: "유지보수 팀에 점검을 요청하세요.",
    icon: <Zap className="h-5 w-5 text-blue-500" />
  },
  {
    id: 3,
    title: "탄소 배출 감소 추세",
    description: "지난달 대비 8%의 탄소 배출 감소가 있었습니다. 좋은 성과입니다!",
    severity: "low",
    date: "2024-06-10",
    suggestedAction: "지속 가능한 관행을 유지해주세요.",
    icon: <TrendingUp className="h-5 w-5 text-green-500" />
  }
];

export default function CarbonPredictionPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('month');
  const [refreshKey, setRefreshKey] = useState(0);
  const [chartData, setChartData] = useState<any[]>([]);
  const [predictionAccuracy, setPredictionAccuracy] = useState<string | null>(null);

  const getDaysFromRange = (range: TimeRange) => {
    switch (range) {
      case 'week': return 7;
      case 'month': return 30;
      case 'quarter': return 90;
      case 'year': return 365;
      default: return 30;
    }
  };

  useEffect(() => {
    const days = getDaysFromRange(timeRange);
    const data = generateMockData(days);
    setChartData(data);

    const calculateAccuracy = () => {
      if (data.length === 0) return 0;
      let totalDiff = 0;
      const count = Math.min(30, data.length);
      
      for (let i = 0; i < count; i++) {
        const diff = Math.abs(data[i].actual - data[i].predicted);
        totalDiff += diff / data[i].actual;
      }
      
      const avgError = totalDiff / count;
      return Math.max(0, 100 - (avgError * 100));
    };
    
    setPredictionAccuracy(calculateAccuracy().toFixed(1));
  }, [timeRange, refreshKey]);

  if (chartData.length === 0 || !predictionAccuracy) {
    return (
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-center h-full">
          <p>예측 데이터를 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">AI 탄소 배출 예측</h2>
          <p className="text-muted-foreground">
            AI가 예측한 미래의 탄소 배출량을 확인하고 전략을 수립하세요.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={(v) => setTimeRange(v as TimeRange)}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="기간 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">최근 1주일</SelectItem>
              <SelectItem value="month">최근 1개월</SelectItem>
              <SelectItem value="quarter">최근 분기</SelectItem>
              <SelectItem value="year">최근 1년</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setRefreshKey(k => k + 1)}>
            예측 갱신
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">예측 정확도</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{predictionAccuracy}%</div>
            <p className="text-xs text-muted-foreground">
              지난 30일 평균 예측 정확도
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">예상 탄소 배출량</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(chartData[chartData.length - 1].predicted).toLocaleString()} kgCO₂e
            </div>
            <p className="text-xs text-muted-foreground">
              다음 주요 예측일: {new Date(new Date().setDate(new Date().getDate() + 7)).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">AI 추천 조치</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3개</div>
            <p className="text-xs text-muted-foreground">
              최적화 기회가 발견되었습니다
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>탄소 배출 예측 추이</CardTitle>
            <CardDescription>
              실시간 데이터와 AI 예측값을 비교해보세요. 회색 영역은 예측 구간을 나타냅니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    if (timeRange === 'year') return date.toLocaleDateString('ko-KR', { month: 'short' });
                    if (timeRange === 'quarter') return `${date.getMonth() + 1}/${date.getDate()}`;
                    return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
                  }}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString('ko-KR', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    weekday: 'short'
                  })}
                  formatter={(value, name) => [`${value} kgCO₂e`, name === 'actual' ? '실제값' : '예측값']}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="predicted" 
                  name="예측값"
                  stroke="#8884d8" 
                  fill="#8884d8"
                  fillOpacity={0.1}
                />
                <Area 
                  type="monotone" 
                  dataKey="upper" 
                  name="예측 상한"
                  stroke="#82ca9d" 
                  fill="#82ca9d"
                  fillOpacity={0.1}
                />
                <Area 
                  type="monotone" 
                  dataKey="lower" 
                  name="예측 하한"
                  stroke="#82ca9d" 
                  fill="#ffffff"
                  fillOpacity={0.1}
                />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  name="실제값"
                  stroke="#ff7300" 
                  strokeWidth={2}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>AI 인사이트</CardTitle>
            <CardDescription>
              AI가 분석한 주요 인사이트와 권장 조치를 확인하세요.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockInsights.map((insight) => (
                <div key={insight.id} className="border rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full ${
                      insight.severity === 'high' ? 'bg-red-100 dark:bg-red-900/30' :
                      insight.severity === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                      'bg-green-100 dark:bg-green-900/30'
                    }`}>
                      {insight.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">{insight.title}</h4>
                        <span className="text-xs text-muted-foreground">
                          {insight.date}
                        </span>
                      </div>
                      <p className="text-sm mt-1">{insight.description}</p>
                      <div className="mt-2 p-2 bg-muted/50 rounded text-xs">
                        <p className="font-medium">권장 조치:</p>
                        <p>{insight.suggestedAction}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>에너지 소스별 기여도</CardTitle>
            <CardDescription>
              탄소 배출에 가장 큰 영향을 미치는 에너지원을 확인하세요.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <p>에너지 소스별 기여도 차트가 여기에 표시됩니다.</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>예측 정확도 분석</CardTitle>
            <CardDescription>
              과거 예측 대비 실제 데이터의 정확도를 확인하세요.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <p>예측 정확도 분석 차트가 여기에 표시됩니다.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
