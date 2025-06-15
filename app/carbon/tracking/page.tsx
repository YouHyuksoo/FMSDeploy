"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// 목업 데이터
const monthlyData = [
  { month: '1월', emission: 400 },
  { month: '2월', emission: 300 },
  { month: '3월', emission: 500 },
  { month: '4월', emission: 450 },
  { month: '5월', emission: 480 },
  { month: '6월', emission: 520 },
];

const scopeData = [
  { name: 'Scope 1', value: 1200, fill: '#8884d8' },
  { name: 'Scope 2', value: 800, fill: '#82ca9d' },
  { name: 'Scope 3', value: 500, fill: '#ffc658' },
];

export default function CarbonTrackingPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">탄소 배출 현황</h2>
          <p className="text-muted-foreground">
            기간별, 범위별 탄소 배출량을 추적하고 분석합니다.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>총 배출량 (이번 달)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">520 tCO₂e</div>
            <p className="text-xs text-muted-foreground">+2.5% 전월 대비</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>주요 배출원</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">생산 라인 #2</div>
            <p className="text-xs text-muted-foreground">전체 배출량의 45% 차지</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>감축 목표 달성률</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">연간 목표 1,000 tCO₂e</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>월별 탄소 배출 추이</CardTitle>
            <CardDescription>지난 6개월간의 배출량 변화</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="emission" name="배출량 (tCO₂e)" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Scope별 배출량</CardTitle>
            <CardDescription>Scope 1, 2, 3 배출량 현황</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scopeData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={80} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="배출량 (tCO₂e)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
