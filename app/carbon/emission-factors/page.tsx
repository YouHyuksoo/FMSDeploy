"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Download, Upload, Trash2, Edit } from "lucide-react"
import { Badge } from "@/components/ui/badge"

type EmissionFactor = {
  id: string
  name: string
  category: string
  value: number
  unit: string
  source: string
  lastUpdated: string
}

export default function EmissionFactorsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [factors, setFactors] = useState<EmissionFactor[]>([
    {
      id: "1",
      name: "한국전력공사 전기",
      category: "전기",
      value: 0.4153,
      unit: "kgCO2e/kWh",
      source: "온실가스종합정보센터",
      lastUpdated: "2024-01-01"
    },
    {
      id: "2",
      name: "도시가스 (LNG)",
      category: "가스",
      value: 2.16,
      unit: "kgCO2e/m³",
      source: "환경부",
      lastUpdated: "2024-01-01"
    },
    {
      id: "3",
      name: "경유",
      category: "석유류",
      value: 2.64,
      unit: "kgCO2e/L",
      source: "에너지경제연구원",
      lastUpdated: "2024-01-01"
    },
    {
      id: "4",
      name: "상수도",
      category: "수도",
      value: 0.0003,
      unit: "kgCO2e/L",
      source: "환경부",
      lastUpdated: "2024-01-01"
    },
    {
      id: "5",
      name: "하수도",
      category: "폐기물",
      value: 0.0005,
      unit: "kgCO2e/L",
      source: "환경부",
      lastUpdated: "2024-01-01"
    }
  ])

  const filteredFactors = factors.filter(factor => 
    factor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    factor.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">배출계수 관리</h2>
          <p className="text-muted-foreground">
            탄소 배출량 계산을 위한 배출계수를 관리하세요.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Upload className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              가져오기
            </span>
          </Button>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Download className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              내보내기
            </span>
          </Button>
          <Button size="sm" className="h-8 gap-1">
            <Plus className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              배출계수 추가
            </span>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <CardTitle>배출계수 목록</CardTitle>
              <CardDescription>
                등록된 배출계수를 확인하고 관리할 수 있습니다.
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
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>이름</TableHead>
                  <TableHead>카테고리</TableHead>
                  <TableHead>배출계수</TableHead>
                  <TableHead>출처</TableHead>
                  <TableHead>최종 업데이트</TableHead>
                  <TableHead className="text-right">액션</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFactors.length > 0 ? (
                  filteredFactors.map((factor) => (
                    <TableRow key={factor.id}>
                      <TableCell className="font-medium">{factor.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{factor.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono">{factor.value}</span> {factor.unit}
                      </TableCell>
                      <TableCell>{factor.source}</TableCell>
                      <TableCell>{factor.lastUpdated}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">수정</span>
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">삭제</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      검색 결과가 없습니다.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
              페이지 <span className="font-medium">1</span> / <span className="font-medium">1</span>
            </div>
            <Button variant="outline" size="sm" disabled>
              이전
            </Button>
            <Button variant="outline" size="sm" disabled>
              다음
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>배출계수 가이드라인</CardTitle>
            <CardDescription>
              배출계수 사용 시 참고할 가이드라인입니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">배출계수란?</h4>
              <p className="text-sm text-muted-foreground">
                배출계수는 단위 에너지 또는 물질 사용 시 발생하는 온실가스 배출량을 나타내는 계수입니다.
                예를 들어, 1kWh의 전기를 사용할 때 0.4153kg의 이산화탄소가 배출됩니다.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">업데이트 주기</h4>
              <p className="text-sm text-muted-foreground">
                배출계수는 매년 1월에 최신 자료를 반영하여 업데이트됩니다.
                최신 자료는 관련 기관의 공식 발표를 참고해 주세요.
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>주요 참고 자료</CardTitle>
            <CardDescription>
              배출계수 산정을 위한 참고 자료들입니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">공식 자료</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>환경부 - 국가 온실가스 인벤토리 보고서</li>
                <li>한국에너지공단 - 온실가스 종합정보센터</li>
                <li>기상청 - 국가 온실가스종합정보센터</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">국제 기준</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>IPCC (기후변화에 관한 정부간 협의체)</li>
                <li>GHG Protocol (온실가스 프로토콜)</li>
                <li>ISO 14064 (온실가스 인벤토리 표준)</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
