"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable, type Column } from "@/components/common/data-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { useTranslation } from "@/lib/language-context"
import { mockEquipment } from "@/lib/mock-data/equipment"
import type { Equipment } from "@/types/equipment"
import {
  Search,
  Download,
  ChevronRight,
  Settings,
  Wrench,
  AlertTriangle,
  CheckCircle,
  Square,
  Clock,
  BarChart4,
  FileText,
  Layers,
  Info,
  Calendar,
  Clipboard,
} from "lucide-react"

export function EquipmentOverview() {
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterLocation, setFilterLocation] = useState<string>("all")
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const { toast } = useToast()
  const { t } = useTranslation("equipment")
  const { t: tCommon } = useTranslation("common")

  // 설비 유형 목록
  const equipmentTypes = [
    { value: "all", label: "전체" },
    { value: "압축기", label: "압축기" },
    { value: "컨베이어", label: "컨베이어" },
    { value: "펌프", label: "펌프" },
    { value: "로봇", label: "로봇" },
    { value: "크레인", label: "크레인" },
  ]

  // 설비 상태 목록
  const equipmentStatuses = [
    { value: "all", label: "전체" },
    { value: "running", label: "가동중" },
    { value: "stopped", label: "정지" },
    { value: "maintenance", label: "정비중" },
    { value: "failure", label: "고장" },
  ]

  // 설비 위치 목록
  const equipmentLocations = [
    { value: "all", label: "전체" },
    { value: "A동 1층", label: "A동 1층" },
    { value: "A동 2층", label: "A동 2층" },
    { value: "B동 1층", label: "B동 1층" },
    { value: "C동 1층", label: "C동 1층" },
  ]

  useEffect(() => {
    loadEquipment()
  }, [])

  const loadEquipment = async () => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setEquipment(mockEquipment)
    } catch (error) {
      toast({
        title: tCommon("error"),
        description: "설비 목록을 불러오는데 실패했습니다.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // 필터링된 설비 목록
  const filteredEquipment = equipment.filter((item) => {
    // 검색어 필터
    if (
      searchTerm &&
      !item.code.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !item.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false
    }

    // 유형 필터
    if (filterType !== "all" && item.type !== filterType) {
      return false
    }

    // 상태 필터
    if (filterStatus !== "all" && item.status !== filterStatus) {
      return false
    }

    // 위치 필터
    if (filterLocation !== "all" && item.location !== filterLocation) {
      return false
    }

    return true
  })

  const handleViewDetail = (equipment: Equipment) => {
    setSelectedEquipment(equipment)
    setDetailDialogOpen(true)
  }

  const handleExportExcel = () => {
    toast({
      title: "엑셀 내보내기",
      description: `${filteredEquipment.length}개 설비 정보를 엑셀로 내보냅니다.`,
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return <CheckCircle className="h-4 w-4" />
      case "stopped":
        return <Square className="h-4 w-4" />
      case "maintenance":
        return <Wrench className="h-4 w-4" />
      case "failure":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "running":
        return "가동중"
      case "stopped":
        return "정지"
      case "maintenance":
        return "정비중"
      case "failure":
        return "고장"
      default:
        return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "stopped":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      case "maintenance":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "failure":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "critical":
        return "중요"
      case "high":
        return "높음"
      case "normal":
        return "보통"
      case "low":
        return "낮음"
      default:
        return priority
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "normal":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "low":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  // 설비 목록 컬럼 정의
  const columns: Column<Equipment>[] = [
    {
      key: "code",
      title: "설비코드",
      width: "w-32",
      sortable: true,
      searchable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <Settings className="h-4 w-4 text-muted-foreground" />
          <span className="font-mono font-medium">{value}</span>
        </div>
      ),
    },
    {
      key: "name",
      title: "설비명",
      sortable: true,
      searchable: true,
      render: (value, record) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-sm text-muted-foreground">{record.model}</div>
        </div>
      ),
    },
    {
      key: "type",
      title: "설비유형",
      width: "w-24",
      sortable: true,
      render: (value) => <Badge variant="outline">{value}</Badge>,
    },
    {
      key: "status",
      title: "상태",
      width: "w-24",
      sortable: true,
      render: (value) => (
        <Badge variant="secondary" className={getStatusColor(value)}>
          <div className="flex items-center gap-1">
            {getStatusIcon(value)}
            {getStatusLabel(value)}
          </div>
        </Badge>
      ),
    },
    {
      key: "priority",
      title: "중요도",
      width: "w-20",
      sortable: true,
      render: (value) => (
        <Badge variant="secondary" className={getPriorityColor(value)}>
          {getPriorityLabel(value)}
        </Badge>
      ),
    },
    {
      key: "location",
      title: "위치",
      searchable: true,
      render: (value, record) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-sm text-muted-foreground">{record.department}</div>
        </div>
      ),
    },
    {
      key: "manufacturer",
      title: "제조사",
      searchable: true,
      render: (value, record) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-sm text-muted-foreground">{record.serialNumber}</div>
        </div>
      ),
    },
    {
      key: "actions",
      title: "",
      width: "w-24",
      render: (_, record) => (
        <Button variant="ghost" size="sm" onClick={() => handleViewDetail(record)}>
          상세보기 <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      ),
    },
  ]

  // 설비 상태 통계
  const statusStats = {
    total: equipment.length,
    running: equipment.filter((e) => e.status === "running").length,
    stopped: equipment.filter((e) => e.status === "stopped").length,
    maintenance: equipment.filter((e) => e.status === "maintenance").length,
    failure: equipment.filter((e) => e.status === "failure").length,
  }

  // 설비 유형 통계
  const typeStats = equipment.reduce(
    (acc, curr) => {
      acc[curr.type] = (acc[curr.type] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">설비통합조회</h2>
          <p className="text-muted-foreground">모든 설비 정보를 한 곳에서 확인하고 관리하세요.</p>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">전체 설비</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusStats.total}대</div>
            <p className="text-xs text-muted-foreground">
              가동률 {((statusStats.running / statusStats.total) * 100).toFixed(1)}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">가동중</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusStats.running}대</div>
            <p className="text-xs text-muted-foreground">
              전체의 {((statusStats.running / statusStats.total) * 100).toFixed(1)}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">정비중</CardTitle>
            <Wrench className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusStats.maintenance}대</div>
            <p className="text-xs text-muted-foreground">
              전체의 {((statusStats.maintenance / statusStats.total) * 100).toFixed(1)}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">고장</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusStats.failure}대</div>
            <p className="text-xs text-muted-foreground">
              전체의 {((statusStats.failure / statusStats.total) * 100).toFixed(1)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 필터 영역 */}
      <Card>
        <CardHeader>
          <CardTitle>설비 필터</CardTitle>
          <CardDescription>원하는 조건으로 설비를 검색하세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-2">
              <label className="text-sm font-medium">검색어</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="설비코드, 설비명 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">설비유형</label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="유형 선택" />
                </SelectTrigger>
                <SelectContent>
                  {equipmentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">상태</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="상태 선택" />
                </SelectTrigger>
                <SelectContent>
                  {equipmentStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">위치</label>
              <Select value={filterLocation} onValueChange={setFilterLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="위치 선택" />
                </SelectTrigger>
                <SelectContent>
                  {equipmentLocations.map((location) => (
                    <SelectItem key={location.value} value={location.value}>
                      {location.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end space-x-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setSearchTerm("")
                  setFilterType("all")
                  setFilterStatus("all")
                  setFilterLocation("all")
                }}
              >
                초기화
              </Button>
              <Button className="flex-1" onClick={handleExportExcel}>
                <Download className="mr-2 h-4 w-4" />
                내보내기
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 설비 목록 탭 */}
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">
            <FileText className="mr-2 h-4 w-4" />
            목록형
          </TabsTrigger>
          <TabsTrigger value="stats">
            <BarChart4 className="mr-2 h-4 w-4" />
            통계형
          </TabsTrigger>
        </TabsList>
        <TabsContent value="list" className="space-y-4">
          <DataTable
            data={filteredEquipment}
            columns={columns}
            loading={loading}
            emptyMessage="조건에 맞는 설비가 없습니다."
            stickyHeader={true}
            maxHeight="calc(100vh - 500px)"
            showSearch={false}
            showFilter={false}
          />
        </TabsContent>
        <TabsContent value="stats" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* 설비 유형별 통계 */}
            <Card>
              <CardHeader>
                <CardTitle>설비 유형별 통계</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(typeStats).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Badge variant="outline" className="mr-2">
                          {type}
                        </Badge>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium">{count}대</span>
                        <span className="ml-2 text-xs text-muted-foreground">
                          ({((count / statusStats.total) * 100).toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 설비 상태별 통계 */}
            <Card>
              <CardHeader>
                <CardTitle>설비 상태별 통계</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                      <span>가동중</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium">{statusStats.running}대</span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({((statusStats.running / statusStats.total) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Square className="mr-2 h-4 w-4 text-gray-500" />
                      <span>정지</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium">{statusStats.stopped}대</span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({((statusStats.stopped / statusStats.total) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Wrench className="mr-2 h-4 w-4 text-blue-500" />
                      <span>정비중</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium">{statusStats.maintenance}대</span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({((statusStats.maintenance / statusStats.total) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <AlertTriangle className="mr-2 h-4 w-4 text-red-500" />
                      <span>고장</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium">{statusStats.failure}대</span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({((statusStats.failure / statusStats.total) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* 설비 상세 정보 다이얼로그 */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>설비 상세 정보</DialogTitle>
          </DialogHeader>
          {selectedEquipment && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">{selectedEquipment.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-mono">{selectedEquipment.code}</span> | {selectedEquipment.model}
                  </p>
                </div>
                <Badge variant="secondary" className={getStatusColor(selectedEquipment.status)}>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(selectedEquipment.status)}
                    {getStatusLabel(selectedEquipment.status)}
                  </div>
                </Badge>
              </div>

              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">
                    <Info className="mr-2 h-4 w-4" />
                    기본 정보
                  </TabsTrigger>
                  <TabsTrigger value="spec">
                    <Clipboard className="mr-2 h-4 w-4" />
                    사양 정보
                  </TabsTrigger>
                  <TabsTrigger value="maintenance">
                    <Wrench className="mr-2 h-4 w-4" />
                    정비 이력
                  </TabsTrigger>
                  <TabsTrigger value="docs">
                    <Layers className="mr-2 h-4 w-4" />
                    문서 자료
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">설비 유형</h4>
                        <p>{selectedEquipment.type}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">제조사</h4>
                        <p>{selectedEquipment.manufacturer}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">모델명</h4>
                        <p>{selectedEquipment.model}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">시리얼 번호</h4>
                        <p>{selectedEquipment.serialNumber}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">위치</h4>
                        <p>{selectedEquipment.location}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">부서</h4>
                        <p>{selectedEquipment.department}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">설치일</h4>
                        <p>{new Date(selectedEquipment.installDate).toLocaleDateString("ko-KR")}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">보증 만료일</h4>
                        <p>
                          {selectedEquipment.warrantyEndDate
                            ? new Date(selectedEquipment.warrantyEndDate).toLocaleDateString("ko-KR")
                            : "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">설명</h4>
                    <p>{selectedEquipment.description || "-"}</p>
                  </div>
                </TabsContent>
                <TabsContent value="spec" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>기술 사양</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {selectedEquipment.specifications ? (
                          Object.entries(selectedEquipment.specifications).map(([key, value]) => (
                            <div key={key}>
                              <h4 className="text-sm font-medium text-muted-foreground">{key}</h4>
                              <p>{value}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-muted-foreground">등록된 사양 정보가 없습니다.</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>커스텀 속성</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {selectedEquipment.customProperties ? (
                          Object.entries(selectedEquipment.customProperties).map(([key, value]) => (
                            <div key={key}>
                              <h4 className="text-sm font-medium text-muted-foreground">{key}</h4>
                              <p>{value}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-muted-foreground">등록된 커스텀 속성이 없습니다.</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="maintenance" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>정비 일정</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium">마지막 정비일</h4>
                          <p>
                            {selectedEquipment.lastMaintenanceDate
                              ? new Date(selectedEquipment.lastMaintenanceDate).toLocaleDateString("ko-KR")
                              : "-"}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">다음 정비 예정일</h4>
                          <p>
                            {selectedEquipment.nextMaintenanceDate
                              ? new Date(selectedEquipment.nextMaintenanceDate).toLocaleDateString("ko-KR")
                              : "-"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>정비 이력</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">정비 이력 데이터는 정비관리 모듈에서 확인할 수 있습니다.</p>
                      <Button variant="outline" className="mt-4">
                        <Calendar className="mr-2 h-4 w-4" />
                        정비 이력 보기
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="docs" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>문서 자료</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-72">
                        <div className="space-y-4">
                          <p className="text-muted-foreground">등록된 문서 자료가 없습니다.</p>
                          <Button variant="outline">
                            <Layers className="mr-2 h-4 w-4" />
                            문서 관리로 이동
                          </Button>
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
