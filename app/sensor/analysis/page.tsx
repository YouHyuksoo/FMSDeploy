"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { subDays, format } from "date-fns";
import { ko } from "date-fns/locale";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import * as XLSX from "xlsx";

// 임시 목업: 지난 7일간 시간별 값 생성
const generateMockSeries = () => {
  const data: { ts: Date; value: number }[] = [];
  const now = new Date();
  for (let i = 0; i < 24 * 7; i++) {
    const ts = subDays(now, 7 - Math.floor(i / 24));
    ts.setHours(i % 24, 0, 0, 0);
    data.push({ ts: new Date(ts), value: Math.random() * 100 });
  }
  return data;
};

export default function SensorAnalysisPage() {
  // mock sensor list with group & description
  const sensors = [
    { id: "SNS-001", group: "온도(1공장)", desc: "1공장 A라인 온도" },
    { id: "SNS-002", group: "진동(1공장)", desc: "1공장 B라인 진동" },
    { id: "SNS-003", group: "전력(1공장)", desc: "전기실 전력" },
    { id: "SNS-004", group: "온습도(본관)", desc: "본관 2층 온습도" },
    { id: "SNS-005", group: "온도(창고)", desc: "2공장 창고 온도" },
  ];
  const [selectedSensor, setSelectedSensor] = useState<string>(sensors[0].id);

  const [series, setSeries] = useState<{ ts: Date; value: number }[]>([]);

  // generate data only on client to avoid SSR hydration mismatch
  useEffect(() => {
    setSeries(generateMockSeries());
  }, [selectedSensor]);

  const [from, setFrom] = useState<Date | undefined>(subDays(new Date(), 7));
  const [to, setTo] = useState<Date | undefined>(new Date());

  const filtered = useMemo(() => {
    if (!from || !to) return series;
    return series.filter((d) => d.ts >= from && d.ts <= to);
  }, [from, to, series]);

  const stats = useMemo(() => {
    if (filtered.length === 0) return null;
    const values = filtered.map((d) => d.value);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);
    return { avg, max, min };
  }, [filtered]);

  const selectedSensorObj = sensors.find((s) => s.id === selectedSensor);

  const exportExcel = () => {
    const wsData = filtered.map((d) => ({
      센서: `${selectedSensorObj?.group ?? ""} - ${selectedSensorObj?.desc ?? ""}`,
      시간: format(d.ts, "yyyy-MM-dd HH:mm:ss"),
      값: d.value.toFixed(2),
    }));
    const ws = XLSX.utils.json_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Logs");
    XLSX.writeFile(wb, `sensor-${selectedSensor}-logs.xlsx`);
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <div className="flex items-center justify-between space-y-2 flex-wrap gap-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">센서 데이터 분석</h2>
          <p className="text-muted-foreground">기간별 센서 측정값을 시각화하고 통계를 확인하세요.</p>
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          {/* 센서 선택 */}
          <Select value={selectedSensor} onValueChange={setSelectedSensor}>
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="센서 선택" />
            </SelectTrigger>
            <SelectContent>
              {sensors.map((s) => (
                <SelectItem key={s.id} value={s.id}>{`${s.group} – ${s.desc}`}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DatePicker value={from} onChange={setFrom} placeholder="시작일" />
          <DatePicker value={to} onChange={setTo} placeholder="종료일" />
          <Button variant="outline" onClick={() => { setFrom(subDays(new Date(), 7)); setTo(new Date()); }}>최근 7일</Button>
          <Button onClick={exportExcel}>엑셀 다운로드</Button>
        </div>
      </div>

      {/* 통계 카드 */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>평균값</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold">{stats.avg.toFixed(2)}</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>최대값</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold">{stats.max.toFixed(2)}</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>최소값</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold">{stats.min.toFixed(2)}</span>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 차트 */}
      <Card>
        <CardHeader>
          <CardTitle>시간별 추이</CardTitle>
          <CardDescription>선 그래프로 센서 값을 확인하세요.</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filtered.map((d) => ({
              ts: format(d.ts, "MM-dd HH시", { locale: ko }),
              value: d.value,
            }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ts" minTickGap={20} />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#3b82f6" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 로그 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle>센서 로그</CardTitle>
          <CardDescription>{`${selectedSensorObj?.group ?? ""} – ${selectedSensorObj?.desc ?? ""}`}</CardDescription>
           <CardDescription>{`${format(from ?? new Date(), "yyyy-MM-dd")} ~ ${format(to ?? new Date(), "yyyy-MM-dd")}`}</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px] whitespace-nowrap">시간</TableHead>
                <TableHead>값</TableHead>
                <TableHead>상태</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.slice().reverse().map((d, idx) => {
                const status = d.value > 90 ? "error" : d.value > 80 ? "warning" : "normal";
                return (
                  <TableRow key={idx}>
                    <TableCell className="whitespace-nowrap">{format(d.ts, "yyyy-MM-dd HH:mm:ss")}</TableCell>
                    <TableCell>{d.value.toFixed(2)}</TableCell>
                    <TableCell>
                      {status === "normal" && <span className="text-green-600">정상</span>}
                      {status === "warning" && <span className="text-yellow-600">경고</span>}
                      {status === "error" && <span className="text-red-600">오류</span>}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
