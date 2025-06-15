"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import type { InspectionResult, InspectionResultItem } from "@/types/inspection-result"
import { mockInspectionResults } from "@/lib/mock-data/inspection-result"
import { useToast } from "@/hooks/use-toast"
import { PlusCircle, Search, FileText, Edit, CheckCircle, XCircle, AlertTriangle, Eye, Download } from "lucide-react"
import { DataTable } from "@/components/common/data-table"
import Image from "next/image"
import { mockInspectionSchedules } from "@/lib/mock-data/inspection-schedule"
import { mockUsers } from "@/lib/mock-data/users"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export function InspectionResultManagement() {
  const [results, setResults] = useState<InspectionResult[]>([])
  const [selectedResult, setSelectedResult] = useState<InspectionResult | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [previewItem, setPreviewItem] = useState<InspectionResultItem | null>(null)
  const { toast } = useToast()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newResult, setNewResult] = useState({
    scheduleId: "",
    startedAt: "",
    completedAt: "",
    duration: "",
    status: "in-progress",
    notes: "",
    completedById: "",
  })

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingResult, setEditingResult] = useState<InspectionResult | null>(null)
  const [editResult, setEditResult] = useState({
    scheduleId: "",
    startedAt: "",
    completedAt: "",
    duration: "",
    status: "in-progress",
    notes: "",
    completedById: "",
  })

  useEffect(() => {
    // 목업 데이터 로드
    setResults(mockInspectionResults)
  }, [])

  // 상태에 따른 배지 색상
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in-progress":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            진행중
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            완료됨
          </Badge>
        )
      case "incomplete":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            미완료
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // 결과 필터링
  const filteredResults = results.filter((result) => {
    const matchesSearch =
      result.schedule?.standard?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.schedule?.equipment?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.completedBy?.name.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeTab === "all") return matchesSearch
    return matchesSearch && result.status === activeTab
  })

  // 결과 선택 핸들러
  const handleSelectResult = (result: InspectionResult) => {
    setSelectedResult(result)
  }

  // 결과 통계
  const resultStats = {
    total: results.length,
    completed: results.filter((r) => r.status === "completed").length,
    inProgress: results.filter((r) => r.status === "in-progress").length,
    incomplete: results.filter((r) => r.status === "incomplete").length,
    abnormalItems: results.reduce((sum, r) => sum + r.abnormalItemCount, 0),
    averageCompletion: Math.round((results.filter((r) => r.status === "completed").length / results.length) * 100),
  }

  // 결과 컬럼 정의
  const resultColumns = [
    { key: "startedAt", title: "점검일시", render: (value: string) => new Date(value).toLocaleString() },
    { key: "schedule.standard.name", title: "점검 기준서" },
    { key: "schedule.equipment.name", title: "설비명" },
    { key: "completedBy.name", title: "점검자" },
    { key: "status", title: "상태", render: (value: string) => getStatusBadge(value) },
    { key: "duration", title: "소요시간", render: (value: number) => (value ? `${value}분` : "-") },
    {
      key: "abnormalItemCount",
      title: "비정상 항목",
      render: (value: number, row: InspectionResult) => (
        <div className="flex items-center space-x-2">
          <span className={value > 0 ? "text-red-600 font-medium" : "text-green-600"}>
            {value}/{row.totalItemCount}
          </span>
          {value > 0 && <AlertTriangle className="h-4 w-4 text-red-500" />}
        </div>
      ),
    },
    {
      key: "actions",
      title: "작업",
      render: (_: any, row: InspectionResult) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" onClick={() => handleSelectResult(row)}>
            <FileText className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleEditResult(row)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleDownloadResult(row)}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  // 항목 컬럼 정의
  const itemColumns = [
    { key: "standardItem.sequence", title: "순서" },
    { key: "standardItem.masterItem.name", title: "항목명" },
    { key: "value", title: "측정값/결과" },
    { key: "standardItem.masterItem.measurementUnit", title: "단위" },
    {
      key: "isPass",
      title: "합격여부",
      render: (value: boolean) =>
        value ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />,
    },
    {
      key: "isAbnormal",
      title: "이상여부",
      render: (value: boolean) =>
        value ? <AlertTriangle className="h-4 w-4 text-red-500" /> : <CheckCircle className="h-4 w-4 text-green-500" />,
    },
    {
      key: "imageUrl",
      title: "이미지",
      render: (value: string) =>
        value ? (
          <Button variant="ghost" size="sm" onClick={() => handlePreviewImage(value)}>
            <Eye className="h-4 w-4 mr-1" /> 보기
          </Button>
        ) : (
          "없음"
        ),
    },
    { key: "notes", title: "비고" },
    {
      key: "actions",
      title: "작업",
      render: (_: any, row: InspectionResultItem) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" onClick={() => setPreviewItem(row)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleEditItem(row)}>
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  // 이미지 미리보기 핸들러
  const handlePreviewImage = (imageUrl: string) => {
    toast({
      title: "이미지 미리보기",
      description: "이미지를 확대하여 볼 수 있습니다.",
    })
  }

  // 결과 편집 핸들러
  const handleEditResult = (result: InspectionResult) => {
    setEditingResult(result)
    setEditResult({
      scheduleId: result.scheduleId,
      startedAt: result.startedAt,
      completedAt: result.completedAt || "",
      duration: result.duration?.toString() || "",
      status: result.status,
      notes: result.notes || "",
      completedById: result.completedBy?.id || "",
    })
    setIsEditDialogOpen(true)
  }

  // 결과 다운로드 핸들러
  const handleDownloadResult = (result: InspectionResult) => {
    toast({
      title: "다운로드",
      description: "점검 결과를 PDF로 다운로드합니다.",
    })
  }

  // 항목 편집 핸들러
  const handleEditItem = (item: InspectionResultItem) => {
    toast({
      title: "편집 기능",
      description: `${item.standardItem?.masterItem?.name} 항목을 편집합니다.`,
    })
  }

  // 새 결과 추가 핸들러
  const handleAddResult = () => {
    setIsAddDialogOpen(true)
  }

  const handleSubmitResult = () => {
    if (!newResult.scheduleId || !newResult.startedAt || !newResult.completedById) {
      toast({
        title: "입력 오류",
        description: "필수 필드를 모두 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    const resultToAdd: InspectionResult = {
      id: `result-${Date.now()}`,
      scheduleId: newResult.scheduleId,
      schedule: mockInspectionSchedules.find((s) => s.id === newResult.scheduleId) || null,
      startedAt: newResult.startedAt,
      completedAt: newResult.completedAt || undefined,
      duration: newResult.duration ? Number.parseInt(newResult.duration) : undefined,
      status: newResult.status as "in-progress" | "completed" | "incomplete",
      totalItemCount: 5,
      abnormalItemCount: 0,
      items: [],
      notes: newResult.notes || undefined,
      completedBy: mockUsers.find((u) => u.id === newResult.completedById) || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setResults((prev) => [resultToAdd, ...prev])
    setIsAddDialogOpen(false)
    setNewResult({
      scheduleId: "",
      startedAt: "",
      completedAt: "",
      duration: "",
      status: "in-progress",
      notes: "",
      completedById: "",
    })

    toast({
      title: "등록 완료",
      description: "새 점검 결과가 등록되었습니다.",
    })
  }

  const handleSubmitEdit = () => {
    if (!editResult.scheduleId || !editResult.startedAt || !editResult.completedById) {
      toast({
        title: "입력 오류",
        description: "필수 필드를 모두 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    if (!editingResult) return

    const updatedResult: InspectionResult = {
      ...editingResult,
      scheduleId: editResult.scheduleId,
      schedule: mockInspectionSchedules.find((s) => s.id === editResult.scheduleId) || null,
      startedAt: editResult.startedAt,
      completedAt: editResult.completedAt || undefined,
      duration: editResult.duration ? Number.parseInt(editResult.duration) : undefined,
      status: editResult.status as "in-progress" | "completed" | "incomplete",
      notes: editResult.notes || undefined,
      completedBy: mockUsers.find((u) => u.id === editResult.completedById) || null,
      updatedAt: new Date().toISOString(),
    }

    setResults((prev) => prev.map((r) => (r.id === editingResult.id ? updatedResult : r)))
    setIsEditDialogOpen(false)
    setEditingResult(null)
    setEditResult({
      scheduleId: "",
      startedAt: "",
      completedAt: "",
      duration: "",
      status: "in-progress",
      notes: "",
      completedById: "",
    })

    toast({
      title: "수정 완료",
      description: "점검 결과가 수정되었습니다.",
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">점검 결과 관리</h1>
        <Button onClick={handleAddResult}>
          <PlusCircle className="mr-2 h-4 w-4" />새 점검 결과
        </Button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{resultStats.total}</div>
            <p className="text-xs text-muted-foreground">전체 결과</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{resultStats.completed}</div>
            <p className="text-xs text-muted-foreground">완료됨</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{resultStats.inProgress}</div>
            <p className="text-xs text-muted-foreground">진행중</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{resultStats.incomplete}</div>
            <p className="text-xs text-muted-foreground">미완료</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{resultStats.abnormalItems}</div>
            <p className="text-xs text-muted-foreground">비정상 항목</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{resultStats.averageCompletion}%</div>
            <p className="text-xs text-muted-foreground">완료율</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">전체</TabsTrigger>
            <TabsTrigger value="completed">완료됨</TabsTrigger>
            <TabsTrigger value="in-progress">진행중</TabsTrigger>
            <TabsTrigger value="incomplete">미완료</TabsTrigger>
          </TabsList>

          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="검색..."
              className="w-64 pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <TabsContent value={activeTab} className="m-0">
          <Card>
            <CardHeader className="p-4">
              <CardTitle>점검 결과 목록</CardTitle>
              <CardDescription>설비 점검 결과를 관리하고 분석합니다.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <DataTable columns={resultColumns} data={filteredResults} onRowClick={handleSelectResult} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedResult && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-1">
            <CardHeader className="p-4">
              <CardTitle className="flex items-center justify-between">
                점검 결과 정보
                {getStatusBadge(selectedResult.status)}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div>
                <Label className="text-sm font-medium">점검 기준서</Label>
                <p className="text-sm text-muted-foreground">{selectedResult.schedule?.standard?.name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">설비명</Label>
                <p className="text-sm text-muted-foreground">{selectedResult.schedule?.equipment?.name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">점검자</Label>
                <p className="text-sm text-muted-foreground">{selectedResult.completedBy?.name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">점검 시작</Label>
                <p className="text-sm text-muted-foreground">{new Date(selectedResult.startedAt).toLocaleString()}</p>
              </div>
              {selectedResult.completedAt && (
                <div>
                  <Label className="text-sm font-medium">점검 완료</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedResult.completedAt).toLocaleString()}
                  </p>
                </div>
              )}
              {selectedResult.duration && (
                <div>
                  <Label className="text-sm font-medium">소요 시간</Label>
                  <p className="text-sm text-muted-foreground">{selectedResult.duration}분</p>
                </div>
              )}
              <div>
                <Label className="text-sm font-medium">점검 진행률</Label>
                <div className="mt-2">
                  <Progress
                    value={
                      ((selectedResult.totalItemCount - selectedResult.abnormalItemCount) /
                        selectedResult.totalItemCount) *
                      100
                    }
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {selectedResult.totalItemCount - selectedResult.abnormalItemCount}/{selectedResult.totalItemCount}{" "}
                    항목 정상
                  </p>
                </div>
              </div>
              {selectedResult.notes && (
                <div>
                  <Label className="text-sm font-medium">비고</Label>
                  <p className="text-sm text-muted-foreground">{selectedResult.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader className="p-4">
              <CardTitle>점검 항목 결과</CardTitle>
              <CardDescription>각 점검 항목별 상세 결과입니다.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <DataTable columns={itemColumns} data={selectedResult.items} />
            </CardContent>
          </Card>
        </div>
      )}

      {/* 항목 미리보기 다이얼로그 */}
      <Dialog open={!!previewItem} onOpenChange={() => setPreviewItem(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{previewItem?.standardItem?.masterItem?.name}</DialogTitle>
            <DialogDescription>점검 항목 결과 상세 정보</DialogDescription>
          </DialogHeader>
          {previewItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">측정값/결과</Label>
                  <p className="text-sm text-muted-foreground">{previewItem.value}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">합격여부</Label>
                  <div className="flex items-center space-x-2">
                    {previewItem.isPass ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className={previewItem.isPass ? "text-green-600" : "text-red-600"}>
                      {previewItem.isPass ? "합격" : "불합격"}
                    </span>
                  </div>
                </div>
              </div>
              {previewItem.notes && (
                <div>
                  <Label className="text-sm font-medium">비고</Label>
                  <p className="text-sm text-muted-foreground">{previewItem.notes}</p>
                </div>
              )}
              {previewItem.imageUrl && (
                <div>
                  <Label className="text-sm font-medium">첨부 이미지</Label>
                  <div className="mt-2">
                    <Image
                      src={previewItem.imageUrl || "/placeholder.svg"}
                      alt={previewItem.standardItem?.masterItem?.name || "점검 결과"}
                      width={400}
                      height={300}
                      className="rounded border"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 점검결과 등록 다이얼로그 */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>새 점검 결과 등록</DialogTitle>
            <DialogDescription>점검 결과를 등록합니다.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="scheduleId">점검 스케줄 *</Label>
                <Select
                  value={newResult.scheduleId}
                  onValueChange={(value) => setNewResult((prev) => ({ ...prev, scheduleId: value }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="스케줄 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockInspectionSchedules.map((schedule) => (
                      <SelectItem key={schedule.id} value={schedule.id}>
                        {schedule.standard?.name} - {schedule.equipment?.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="completedById">점검자 *</Label>
                <Select
                  value={newResult.completedById}
                  onValueChange={(value) => setNewResult((prev) => ({ ...prev, completedById: value }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="점검자 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name} ({user.department})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startedAt">점검 시작일시 *</Label>
                <Input
                  id="startedAt"
                  type="datetime-local"
                  value={newResult.startedAt}
                  onChange={(e) => setNewResult((prev) => ({ ...prev, startedAt: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="completedAt">점검 완료일시</Label>
                <Input
                  id="completedAt"
                  type="datetime-local"
                  value={newResult.completedAt}
                  onChange={(e) => setNewResult((prev) => ({ ...prev, completedAt: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration">소요시간 (분)</Label>
                <Input
                  id="duration"
                  type="number"
                  placeholder="예: 30"
                  value={newResult.duration}
                  onChange={(e) => setNewResult((prev) => ({ ...prev, duration: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="status">상태</Label>
                <Select
                  value={newResult.status}
                  onValueChange={(value) => setNewResult((prev) => ({ ...prev, status: value }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in-progress">진행중</SelectItem>
                    <SelectItem value="completed">완료됨</SelectItem>
                    <SelectItem value="incomplete">미완료</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="notes">비고</Label>
              <Textarea
                id="notes"
                rows={3}
                placeholder="점검 결과에 대한 추가 설명을 입력하세요"
                value={newResult.notes}
                onChange={(e) => setNewResult((prev) => ({ ...prev, notes: e.target.value }))}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                취소
              </Button>
              <Button onClick={handleSubmitResult}>등록</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 점검결과 편집 다이얼로그 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>점검 결과 수정</DialogTitle>
            <DialogDescription>점검 결과를 수정합니다.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-scheduleId">점검 스케줄 *</Label>
                <Select
                  value={editResult.scheduleId}
                  onValueChange={(value) => setEditResult((prev) => ({ ...prev, scheduleId: value }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="스케줄 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockInspectionSchedules.map((schedule) => (
                      <SelectItem key={schedule.id} value={schedule.id}>
                        {schedule.standard?.name} - {schedule.equipment?.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-completedById">점검자 *</Label>
                <Select
                  value={editResult.completedById}
                  onValueChange={(value) => setEditResult((prev) => ({ ...prev, completedById: value }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="점검자 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name} ({user.department})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-startedAt">점검 시작일시 *</Label>
                <Input
                  id="edit-startedAt"
                  type="datetime-local"
                  value={editResult.startedAt}
                  onChange={(e) => setEditResult((prev) => ({ ...prev, startedAt: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="edit-completedAt">점검 완료일시</Label>
                <Input
                  id="edit-completedAt"
                  type="datetime-local"
                  value={editResult.completedAt}
                  onChange={(e) => setEditResult((prev) => ({ ...prev, completedAt: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-duration">소요시간 (분)</Label>
                <Input
                  id="edit-duration"
                  type="number"
                  placeholder="예: 30"
                  value={editResult.duration}
                  onChange={(e) => setEditResult((prev) => ({ ...prev, duration: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="edit-status">상태</Label>
                <Select
                  value={editResult.status}
                  onValueChange={(value) => setEditResult((prev) => ({ ...prev, status: value }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in-progress">진행중</SelectItem>
                    <SelectItem value="completed">완료됨</SelectItem>
                    <SelectItem value="incomplete">미완료</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="edit-notes">비고</Label>
              <Textarea
                id="edit-notes"
                rows={3}
                placeholder="점검 결과에 대한 추가 설명을 입력하세요"
                value={editResult.notes}
                onChange={(e) => setEditResult((prev) => ({ ...prev, notes: e.target.value }))}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                취소
              </Button>
              <Button onClick={handleSubmitEdit}>수정</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
