"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Edit, Trash2, Settings, FileText, BarChart3 } from "lucide-react"
import {
  materialCategories,
  materialCodeRules,
  materialAttributeTemplates,
  approvalWorkflows,
} from "@/lib/mock-data/material-master"

export function MaterialMasterManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredCategories = materialCategories.filter((category) => {
    const matchesSearch =
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.code.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel = selectedLevel === "all" || category.level === selectedLevel
    return matchesSearch && matchesLevel
  })

  const getCategoryStats = () => {
    const total = materialCategories.length
    const active = materialCategories.filter((c) => c.isActive).length
    const major = materialCategories.filter((c) => c.level === "major").length
    const middle = materialCategories.filter((c) => c.level === "middle").length
    const minor = materialCategories.filter((c) => c.level === "minor").length

    return { total, active, major, middle, minor }
  }

  const stats = getCategoryStats()

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">자재마스터관리</h1>
          <p className="text-muted-foreground">자재 분류 체계 및 표준화 관리</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Excel 내보내기
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                분류 추가
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>새 분류 추가</DialogTitle>
                <DialogDescription>새로운 자재 분류를 추가합니다.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="code">분류 코드</Label>
                  <Input id="code" placeholder="예: MEC" />
                </div>
                <div>
                  <Label htmlFor="name">분류명</Label>
                  <Input id="name" placeholder="예: 기계부품" />
                </div>
                <div>
                  <Label htmlFor="level">분류 레벨</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="분류 레벨 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="major">대분류</SelectItem>
                      <SelectItem value="middle">중분류</SelectItem>
                      <SelectItem value="minor">소분류</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    취소
                  </Button>
                  <Button onClick={() => setIsDialogOpen(false)}>추가</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">전체 분류</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">활성 분류</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">대분류</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.major}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">중분류</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.middle}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">소분류</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.minor}</div>
          </CardContent>
        </Card>
      </div>

      {/* 탭 메뉴 */}
      <Tabs defaultValue="categories" className="space-y-4">
        <TabsList>
          <TabsTrigger value="categories">분류 체계</TabsTrigger>
          <TabsTrigger value="code-rules">코드 규칙</TabsTrigger>
          <TabsTrigger value="attributes">속성 템플릿</TabsTrigger>
          <TabsTrigger value="workflows">승인 워크플로우</TabsTrigger>
        </TabsList>

        {/* 분류 체계 탭 */}
        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>자재 분류 체계</CardTitle>
              <CardDescription>자재의 계층적 분류 구조를 관리합니다.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* 검색 및 필터 */}
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="분류명 또는 코드 검색..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="분류 레벨" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    <SelectItem value="major">대분류</SelectItem>
                    <SelectItem value="middle">중분류</SelectItem>
                    <SelectItem value="minor">소분류</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 분류 목록 */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>분류 코드</TableHead>
                    <TableHead>분류명</TableHead>
                    <TableHead>레벨</TableHead>
                    <TableHead>상위 분류</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.map((category) => {
                    const parent = materialCategories.find((c) => c.id === category.parentId)
                    return (
                      <TableRow key={category.id}>
                        <TableCell className="font-mono">{category.code}</TableCell>
                        <TableCell>{category.name}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              category.level === "major"
                                ? "default"
                                : category.level === "middle"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {category.level === "major" ? "대분류" : category.level === "middle" ? "중분류" : "소분류"}
                          </Badge>
                        </TableCell>
                        <TableCell>{parent?.name || "-"}</TableCell>
                        <TableCell>
                          <Badge variant={category.isActive ? "default" : "secondary"}>
                            {category.isActive ? "활성" : "비활성"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 코드 규칙 탭 */}
        <TabsContent value="code-rules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>자재 코드 규칙</CardTitle>
              <CardDescription>분류별 자재 코드 생성 규칙을 관리합니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>분류</TableHead>
                    <TableHead>접두사</TableHead>
                    <TableHead>패턴</TableHead>
                    <TableHead>예시</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {materialCodeRules.map((rule) => {
                    const category = materialCategories.find((c) => c.id === rule.categoryId)
                    return (
                      <TableRow key={rule.id}>
                        <TableCell>{category?.name}</TableCell>
                        <TableCell className="font-mono">{rule.prefix}</TableCell>
                        <TableCell className="font-mono text-sm">{rule.pattern}</TableCell>
                        <TableCell className="font-mono text-sm text-blue-600">{rule.example}</TableCell>
                        <TableCell>
                          <Badge variant={rule.isActive ? "default" : "secondary"}>
                            {rule.isActive ? "활성" : "비활성"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 속성 템플릿 탭 */}
        <TabsContent value="attributes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>속성 템플릿</CardTitle>
              <CardDescription>자재 유형별 속성 템플릿을 관리합니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>분류</TableHead>
                    <TableHead>속성명</TableHead>
                    <TableHead>데이터 타입</TableHead>
                    <TableHead>필수 여부</TableHead>
                    <TableHead>설명</TableHead>
                    <TableHead>작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {materialAttributeTemplates.map((attr) => {
                    const category = materialCategories.find((c) => c.id === attr.categoryId)
                    return (
                      <TableRow key={attr.id}>
                        <TableCell>{category?.name}</TableCell>
                        <TableCell>{attr.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {attr.dataType === "text"
                              ? "텍스트"
                              : attr.dataType === "number"
                                ? "숫자"
                                : attr.dataType === "select"
                                  ? "선택"
                                  : attr.dataType === "date"
                                    ? "날짜"
                                    : "불린"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={attr.isRequired ? "destructive" : "secondary"}>
                            {attr.isRequired ? "필수" : "선택"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{attr.description}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 승인 워크플로우 탭 */}
        <TabsContent value="workflows" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>승인 워크플로우</CardTitle>
              <CardDescription>자재 등록 승인 프로세스를 관리합니다.</CardDescription>
            </CardHeader>
            <CardContent>
              {approvalWorkflows.map((workflow) => (
                <div key={workflow.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{workflow.name}</h3>
                      <Badge variant={workflow.isActive ? "default" : "secondary"}>
                        {workflow.isActive ? "활성" : "비활성"}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {workflow.steps.map((step, index) => (
                      <div key={step.id} className="border rounded p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                            {step.stepNumber}
                          </div>
                          <span className="font-medium">{step.name}</span>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div>승인자: {step.approverRole}</div>
                          <div>{step.description}</div>
                          {step.isRequired && (
                            <Badge variant="destructive" className="text-xs">
                              필수
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
