"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Search, Folder, MoreVertical } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function SensorGroupsPage() {
  // 예시 데이터
  const groups = [
    { id: 1, name: "1공장", description: "1공장 생산라인", sensorCount: 24 },
    { id: 2, name: "2공장", description: "2공장 생산라인", sensorCount: 18 },
    { id: 3, name: "창고", description: "창고 환경 모니터링", sensorCount: 8 },
    { id: 4, name: "사무실", description: "사무실 환경 모니터링", sensorCount: 5 },
  ];

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">센서 그룹 관리</h2>
          <p className="text-muted-foreground">센서 그룹을 관리하고 그룹별 센서를 확인하세요.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          그룹 추가
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">전체 그룹</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">📁</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">총 그룹 수</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">전체 센서</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">📊</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">55</div>
            <p className="text-xs text-muted-foreground">총 센서 수</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">평균 센서/그룹</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">📈</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">13.8</div>
            <p className="text-xs text-muted-foreground">그룹당 평균 센서 수</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">최근 업데이트</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">🔄</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5분 전</div>
            <p className="text-xs text-muted-foreground">마지막 동기화</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>그룹 목록</CardTitle>
              <CardDescription>등록된 센서 그룹 목록입니다.</CardDescription>
            </div>
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input type="text" placeholder="그룹 검색..." />
              <Button type="submit" size="icon" variant="outline">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>그룹명</TableHead>
                <TableHead>설명</TableHead>
                <TableHead className="text-right">센서 수</TableHead>
                <TableHead className="w-[100px]">액션</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groups.map((group) => (
                <TableRow key={group.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <Folder className="h-5 w-5 text-blue-500" />
                      <span>{group.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{group.description}</TableCell>
                  <TableCell className="text-right">{group.sensorCount}개</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>수정</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">삭제</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
