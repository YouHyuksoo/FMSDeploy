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
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import * as XLSX from "xlsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Calendar as CalendarIcon,
  Search,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
// @ts-ignore
import { jsPDF } from "jspdf";

// 임시 목업: 지난 7일간 시간별 값 생성
const generateMockSeries = (sensorId = "SNS-001") => {
  const data: { ts: Date; value: number; sensorId: string }[] = [];
  const now = new Date();
  for (let i = 0; i < 24 * 7; i++) {
    const ts = subDays(now, 7 - Math.floor(i / 24));
    ts.setHours(i % 24, 0, 0, 0);
    data.push({ ts: new Date(ts), value: Math.random() * 100, sensorId });
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

  const [series, setSeries] = useState<
    { ts: Date; value: number; sensorId: string }[]
  >([]);

  // generate data only on client to avoid SSR hydration mismatch
  useEffect(() => {
    setSeries(generateMockSeries(selectedSensor));
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
      센서: `${selectedSensorObj?.group ?? ""} - ${
        selectedSensorObj?.desc ?? ""
      }`,
      시간: format(d.ts, "yyyy-MM-dd HH:mm:ss"),
      값: d.value.toFixed(2),
    }));
    const ws = XLSX.utils.json_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Logs");
    XLSX.writeFile(wb, `sensor-${selectedSensor}-logs.xlsx`);
  };

  // 상단 조건 영역 제거, DataTable 상단에 조건 배치
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // 페이지네이션 상태
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // 조회 함수
  const handleSearch = () => {
    setIsLoading(true);
    // 실제 API 호출 시 여기에 구현
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  // 초기화 함수
  const handleReset = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setSelectedSensor("");
    setSearchQuery("");
  };

  // 페이지네이션 데이터 슬라이싱
  const totalRows = filtered.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const pagedData = filtered.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  // 페이지 변경 함수
  const goToPage = (p: number) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
  };

  // rowsPerPage 변경 시 1페이지로 이동
  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  };

  // 분석 탭용 상태
  const [analysisSensor, setAnalysisSensor] = useState<string>("");
  const [analysisStart, setAnalysisStart] = useState<Date>();
  const [analysisEnd, setAnalysisEnd] = useState<Date>();

  // 보고서 이력 목업
  const reportHistory = [
    {
      id: 1,
      title: "2024년 5월 센서 리포트",
      created: "2024-06-01",
      author: "홍길동",
    },
    {
      id: 2,
      title: "2024년 4월 센서 리포트",
      created: "2024-05-01",
      author: "홍길동",
    },
  ];

  // 분석용 데이터 필터링 (예시)
  const analysisData = filtered.filter(
    (d) =>
      (!analysisSensor || d.sensorId === analysisSensor) &&
      (!analysisStart || d.ts >= analysisStart) &&
      (!analysisEnd || d.ts <= analysisEnd)
  );

  // 통계 계산
  const values = analysisData.map((d) => d.value);
  const avg = values.length
    ? values.reduce((a, b) => a + b, 0) / values.length
    : 0;
  const max = values.length ? Math.max(...values) : 0;
  const min = values.length ? Math.min(...values) : 0;
  const std = values.length
    ? Math.sqrt(
        values.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / values.length
      )
    : 0;

  // 이상치(임계값 초과) 리스트
  const threshold = 90;
  const outliers = analysisData.filter((d) => d.value > threshold);

  // PDF 다운로드 (목업)
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("센서 데이터 분석 리포트", 10, 10);
    doc.text(
      `평균: ${avg.toFixed(2)}  최대: ${max.toFixed(2)}  최소: ${min.toFixed(
        2
      )}  표준편차: ${std.toFixed(2)}`,
      10,
      20
    );
    doc.save("sensor_report.pdf");
  };

  // Excel 다운로드 (목업)
  const handleDownloadExcel = () => {
    // 실제 구현 시 SheetJS 등 사용
    alert("엑셀 다운로드는 추후 구현 예정");
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">센서 데이터 분석</h2>
      </div>

      <Tabs defaultValue="logs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="logs">로그 데이터 조회</TabsTrigger>
          <TabsTrigger value="analysis">데이터 분석</TabsTrigger>
          <TabsTrigger value="reports">보고서</TabsTrigger>
        </TabsList>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>로그 데이터 조회</CardTitle>
            </CardHeader>
            <CardContent>
              {/* DataTable 상단에 조건 배치 */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <div className="min-w-[180px]">
                  <Select
                    value={selectedSensor}
                    onValueChange={setSelectedSensor}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="센서 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {sensors.map((sensor) => (
                        <SelectItem key={sensor.id} value={sensor.id}>
                          {sensor.group} - {sensor.desc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[140px] justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "yyyy-MM-dd") : "시작일"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <span className="mx-1">~</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[140px] justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "yyyy-MM-dd") : "종료일"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <div className="min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="검색어 입력..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <Button onClick={handleSearch} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      조회 중...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      조회
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={handleReset}>
                  초기화
                </Button>
                <Button>
                  <Download className="mr-2 h-4 w-4" />
                  엑셀 다운로드
                </Button>
              </div>

              {/* DataTable */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>시간</TableHead>
                      <TableHead>센서 ID</TableHead>
                      <TableHead>센서명</TableHead>
                      <TableHead>측정값</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead>비고</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pagedData.map((log) => {
                      const status =
                        log.value > 90
                          ? "error"
                          : log.value > 80
                          ? "warning"
                          : "normal";
                      return (
                        <TableRow key={log.ts.toString()}>
                          <TableCell>
                            {format(log.ts, "yyyy-MM-dd HH:mm:ss")}
                          </TableCell>
                          <TableCell>{selectedSensor}</TableCell>
                          <TableCell>
                            {selectedSensorObj?.group} -{" "}
                            {selectedSensorObj?.desc}
                          </TableCell>
                          <TableCell>{log.value.toFixed(2)}</TableCell>
                          <TableCell>
                            {status === "normal" && (
                              <span className="text-green-600">정상</span>
                            )}
                            {status === "warning" && (
                              <span className="text-yellow-600">경고</span>
                            )}
                            {status === "error" && (
                              <span className="text-red-600">오류</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {status === "error" ? "오류 발생" : ""}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* 페이지네이션 UI */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => goToPage(page - 1)}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span>
                    {page} / {totalPages || 1}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => goToPage(page + 1)}
                    disabled={page === totalPages || totalPages === 0}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <span>Rows</span>
                  <select
                    className="border rounded px-2 py-1"
                    value={rowsPerPage}
                    onChange={handleRowsPerPageChange}
                  >
                    {[10, 20, 50, 100].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                  <span className="text-muted-foreground text-sm">
                    총 {totalRows}건
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>데이터 분석</CardTitle>
            </CardHeader>
            <CardContent>
              {/* 조건 */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <div className="min-w-[180px]">
                  <Select
                    value={analysisSensor}
                    onValueChange={setAnalysisSensor}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="센서 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {sensors.map((sensor) => (
                        <SelectItem key={sensor.id} value={sensor.id}>
                          {sensor.group} - {sensor.desc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[140px] justify-start text-left font-normal",
                        !analysisStart && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {analysisStart
                        ? format(analysisStart, "yyyy-MM-dd")
                        : "시작일"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={analysisStart}
                      onSelect={setAnalysisStart}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <span className="mx-1">~</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[140px] justify-start text-left font-normal",
                        !analysisEnd && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {analysisEnd
                        ? format(analysisEnd, "yyyy-MM-dd")
                        : "종료일"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={analysisEnd}
                      onSelect={setAnalysisEnd}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              {/* 통계 카드 */}
              <div className="grid gap-4 md:grid-cols-4 mb-4">
                <Card>
                  <CardHeader>
                    <CardTitle>평균</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <span className="text-2xl font-bold">{avg.toFixed(2)}</span>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>최대</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <span className="text-2xl font-bold">{max.toFixed(2)}</span>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>최소</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <span className="text-2xl font-bold">{min.toFixed(2)}</span>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>표준편차</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <span className="text-2xl font-bold">{std.toFixed(2)}</span>
                  </CardContent>
                </Card>
              </div>
              {/* 시계열 차트 */}
              <div className="h-[300px] w-full mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={analysisData.map((d) => ({
                      ts: format(d.ts, "MM-dd HH:mm"),
                      value: d.value,
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="ts" minTickGap={20} />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#3b82f6"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              {/* 이상치 리스트 */}
              <div>
                <h4 className="font-bold mb-2">
                  이상치(임계값 {threshold} 초과)
                </h4>
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>시간</TableHead>
                        <TableHead>센서 ID</TableHead>
                        <TableHead>측정값</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {outliers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center">
                            이상치 없음
                          </TableCell>
                        </TableRow>
                      ) : (
                        outliers.map((d) => (
                          <TableRow key={d.ts.toString()}>
                            <TableCell>
                              {format(d.ts, "yyyy-MM-dd HH:mm:ss")}
                            </TableCell>
                            <TableCell>{d.sensorId}</TableCell>
                            <TableCell className="text-red-600 font-bold">
                              {d.value.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>분석 리포트</CardTitle>
            </CardHeader>
            <CardContent>
              {/* 요약 카드 */}
              <div className="grid gap-4 md:grid-cols-4 mb-4">
                <Card>
                  <CardHeader>
                    <CardTitle>평균</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <span className="text-2xl font-bold">{avg.toFixed(2)}</span>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>최대</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <span className="text-2xl font-bold">{max.toFixed(2)}</span>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>최소</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <span className="text-2xl font-bold">{min.toFixed(2)}</span>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>표준편차</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <span className="text-2xl font-bold">{std.toFixed(2)}</span>
                  </CardContent>
                </Card>
              </div>
              {/* 다운로드 버튼 */}
              <div className="flex gap-2 mb-4">
                <Button onClick={handleDownloadPDF}>
                  <Download className="mr-2 h-4 w-4" />
                  PDF 다운로드
                </Button>
                <Button variant="outline" onClick={handleDownloadExcel}>
                  <Download className="mr-2 h-4 w-4" />
                  엑셀 다운로드
                </Button>
              </div>
              {/* 리포트 이력 테이블 */}
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>제목</TableHead>
                      <TableHead>생성일</TableHead>
                      <TableHead>작성자</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reportHistory.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell>{r.title}</TableCell>
                        <TableCell>{r.created}</TableCell>
                        <TableCell>{r.author}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
