"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { InspectionSchedule } from "@/types/inspection-schedule"
import { mockInspectionSchedules } from "@/lib/mock-data/inspection-schedule"
import { useToast } from "@/hooks/use-toast"
import { PlusCircle, Search, CalendarIcon, Edit, Trash2, Clock, RotateCcw } from "lucide-react"
import { DataTable } from "@/components/common/data-table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { mockInspectionStandards } from "@/lib/mock-data/inspection-standard"
import { mockEquipments } from "@/lib/mock-data/equipment"
import { mockUsers } from "@/lib/mock-data/users"

export function InspectionScheduleManagement() {
  const [schedules, setSchedules] = useState<InspectionSchedule[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [showCalendar, setShowCalendar] = useState(false)
  const { toast } = useToast()
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [formData, setFormData] = useState({
    standardId: "",
    equipmentId: "",
    assignedToId: "",
    scheduledDate: "",
    scheduledTime: "",
    priority: "medium",
    estimatedDuration: 30,
    isRecurring: false,
    notes: "",
  })

  useEffect(() => {
    // 목업 데이터 로드
    setSchedules(mockInspectionSchedules)
  }, [])

  // 날짜 포맷팅 함수
  const formatDate = (date: Date | string, format: "date" | "datetime" | "display" = "date"): string => {
    const d = typeof date === "string" ? new Date(date) : date

    if (format === "date") {
      return d.toISOString().split("T")[0] // YYYY-MM-DD
    } else if (format === "datetime") {
      return d.toLocaleDateString("ko-KR")
    } else if (format === "display") {
      return d.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
      })
    }
    return d.toLocaleDateString()
  }

  // 오늘 날짜 문자열
  const todayString = formatDate(new Date(), "date")

  // 상태에 따른 배지 색상
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            예정됨
          </Badge>
        )
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
      case "missed":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            누락됨
          </Badge>
        )
      case "rescheduled":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            일정변경
          </Badge>
        )
      case "canceled":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            취소됨
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // 우선순위에 따른 배지 색상
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "low":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            낮음
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            보통
          </Badge>
        )
      case "high":
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            높음
          </Badge>
        )
      case "critical":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            긴급
          </Badge>
        )
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  // 스케줄 필터링
  const filteredSchedules = schedules.filter((schedule) => {
    const matchesSearch =
      (schedule.standard?.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (schedule.equipment?.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (schedule.assignedTo?.name?.toLowerCase() || "").includes(searchTerm.toLowerCase())

    const matchesDate = selectedDate ? schedule.scheduledDate === formatDate(selectedDate, "date") : true

    if (activeTab === "all") return matchesSearch && matchesDate
    return matchesSearch && matchesDate && schedule.status === activeTab
  })

  // 스케줄 통계
  const scheduleStats = {
    total: schedules.length,
    scheduled: schedules.filter((s) => s.status === "scheduled").length,
    inProgress: schedules.filter((s) => s.status === "in-progress").length,
    completed: schedules.filter((s) => s.status === "completed").length,
    missed: schedules.filter((s) => s.status === "missed").length,
    today: schedules.filter((s) => s.scheduledDate === todayString).length,
  }

  // 스케줄 컬럼 정의
  const scheduleColumns = [
    {
      key: "scheduledDate",
      title: "예정일자",
      render: (value: string) => (value ? formatDate(value, "datetime") : "-"),
    },
    { key: "scheduledTime", title: "예정시간" },
    {
      key: "standard.name",
      title: "점검 기준서",
      render: (_: any, row: InspectionSchedule) => row.standard?.name || "-",
    },
    {
      key: "equipment.name",
      title: "설비명",
      render: (_: any, row: InspectionSchedule) => row.equipment?.name || "-",
    },
    {
      key: "equipment.location",
      title: "위치",
      render: (_: any, row: InspectionSchedule) => row.equipment?.location || "-",
    },
    {
      key: "assignedTo.name",
      title: "담당자",
      render: (_: any, row: InspectionSchedule) => row.assignedTo?.name || "-",
    },
    {
      key: "status",
      title: "상태",
      render: (value: string) => getStatusBadge(value),
    },
    {
      key: "priority",
      title: "우선순위",
      render: (value: string) => getPriorityBadge(value),
    },
    {
      key: "estimatedDuration",
      title: "예상시간",
      render: (value: number) => `${value}분`,
    },
    {
      key: "actions",
      title: "작업",
      render: (_: any, row: InspectionSchedule) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" onClick={() => handleStartInspection(row)}>
            <Clock className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleEditSchedule(row)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleReschedule(row)}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleDeleteSchedule(row.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  // 점검 시작 핸들러
  const handleStartInspection = (schedule: InspectionSchedule) => {
    toast({
      title: "점검 시작",
      description: `${schedule.standard?.name || "점검"} 점검을 시작합니다.`,
    })
  }

  // 스케줄 편집 핸들러
  const handleEditSchedule = (schedule: InspectionSchedule) => {
    toast({
      title: "편집 기능",
      description: `${schedule.standard?.name || "점검"} 스케줄을 편집합니다.`,
    })
  }

  // 일정 변경 핸들러
  const handleReschedule = (schedule: InspectionSchedule) => {
    toast({
      title: "일정 변경",
      description: `${schedule.standard?.name || "점검"} 일정을 변경합니다.`,
    })
  }

  // 스케줄 삭제 핸들러
  const handleDeleteSchedule = (id: string) => {
    toast({
      title: "삭제 확인",
      description: "정말 이 점검 스케줄을 삭제하시겠습니까?",
    })
  }

  // 새 스케줄 추가 핸들러
  const handleAddSchedule = () => {
    setShowAddDialog(true)
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // 유효성 검사
    if (
      !formData.standardId ||
      !formData.equipmentId ||
      !formData.assignedToId ||
      !formData.scheduledDate ||
      !formData.scheduledTime
    ) {
      toast({
        title: "입력 오류",
        description: "필수 항목을 모두 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    // 선택된 데이터 찾기
    const selectedStandard = mockInspectionStandards.find((s) => s.id === formData.standardId)
    const selectedEquipment = mockEquipments.find((e) => e.id === formData.equipmentId)
    const selectedUser = mockUsers.find((u) => u.id === formData.assignedToId)

    // 새 스케줄 생성
    const newSchedule: InspectionSchedule = {
      id: `schedule_${Date.now()}`,
      standard: selectedStandard,
      equipment: selectedEquipment,
      assignedTo: selectedUser,
      scheduledDate: formData.scheduledDate,
      scheduledTime: formData.scheduledTime,
      status: "scheduled",
      priority: formData.priority as "low" | "medium" | "high" | "critical",
      estimatedDuration: formData.estimatedDuration,
      isRecurring: formData.isRecurring,
      notes: formData.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // 스케줄 목록에 추가
    setSchedules((prev) => [newSchedule, ...prev])

    // 폼 초기화 및 다이얼로그 닫기
    setFormData({
      standardId: "",
      equipmentId: "",
      assignedToId: "",
      scheduledDate: "",
      scheduledTime: "",
      priority: "medium",
      estimatedDuration: 30,
      isRecurring: false,
      notes: "",
    })
    setShowAddDialog(false)

    toast({
      title: "등록 완료",
      description: "새 점검 스케줄이 등록되었습니다.",
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">점검 스케줄 관리</h1>
        <Button onClick={handleAddSchedule}>
          <PlusCircle className="mr-2 h-4 w-4" />새 점검 스케줄
        </Button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{scheduleStats.total}</div>
            <p className="text-xs text-muted-foreground">전체 스케줄</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{scheduleStats.scheduled}</div>
            <p className="text-xs text-muted-foreground">예정됨</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{scheduleStats.inProgress}</div>
            <p className="text-xs text-muted-foreground">진행중</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{scheduleStats.completed}</div>
            <p className="text-xs text-muted-foreground">완료됨</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{scheduleStats.missed}</div>
            <p className="text-xs text-muted-foreground">누락됨</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{scheduleStats.today}</div>
            <p className="text-xs text-muted-foreground">오늘 예정</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">전체</TabsTrigger>
            <TabsTrigger value="scheduled">예정됨</TabsTrigger>
            <TabsTrigger value="in-progress">진행중</TabsTrigger>
            <TabsTrigger value="completed">완료됨</TabsTrigger>
            <TabsTrigger value="missed">누락됨</TabsTrigger>
          </TabsList>

          <div className="flex space-x-2">
            <Popover open={showCalendar} onOpenChange={setShowCalendar}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? formatDate(selectedDate, "display") : "날짜 선택"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date)
                    setShowCalendar(false)
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

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
        </div>

        <TabsContent value={activeTab} className="m-0">
          <Card>
            <CardHeader className="p-4">
              <CardTitle>점검 스케줄 목록</CardTitle>
              <CardDescription>설비 점검 스케줄을 관리하고 모니터링합니다.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <DataTable columns={scheduleColumns} data={filteredSchedules} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      {/* 점검 스케줄 등록 다이얼로그 */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>새 점검 스케줄 등록</DialogTitle>
            <DialogDescription>새로운 점검 스케줄을 등록합니다.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 점검 기준서 선택 */}
              <div className="space-y-2">
                <Label htmlFor="standardId">점검 기준서 *</Label>
                <Select
                  value={formData.standardId}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, standardId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="점검 기준서를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockInspectionStandards.map((standard) => (
                      <SelectItem key={standard.id} value={standard.id}>
                        {standard.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 설비 선택 */}
              <div className="space-y-2">
                <Label htmlFor="equipmentId">설비 *</Label>
                <Select
                  value={formData.equipmentId}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, equipmentId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="설비를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockEquipments.map((equipment) => (
                      <SelectItem key={equipment.id} value={equipment.id}>
                        {equipment.name} ({equipment.location})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 담당자 선택 */}
              <div className="space-y-2">
                <Label htmlFor="assignedToId">담당자 *</Label>
                <Select
                  value={formData.assignedToId}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, assignedToId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="담당자를 선택하세요" />
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

              {/* 우선순위 */}
              <div className="space-y-2">
                <Label htmlFor="priority">우선순위</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, priority: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">낮음</SelectItem>
                    <SelectItem value="medium">보통</SelectItem>
                    <SelectItem value="high">높음</SelectItem>
                    <SelectItem value="critical">긴급</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 예정일자 */}
              <div className="space-y-2">
                <Label htmlFor="scheduledDate">예정일자 *</Label>
                <Input
                  id="scheduledDate"
                  type="date"
                  value={formData.scheduledDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, scheduledDate: e.target.value }))}
                  required
                />
              </div>

              {/* 예정시간 */}
              <div className="space-y-2">
                <Label htmlFor="scheduledTime">예정시간 *</Label>
                <Input
                  id="scheduledTime"
                  type="time"
                  value={formData.scheduledTime}
                  onChange={(e) => setFormData((prev) => ({ ...prev, scheduledTime: e.target.value }))}
                  required
                />
              </div>

              {/* 예상시간 */}
              <div className="space-y-2">
                <Label htmlFor="estimatedDuration">예상시간 (분)</Label>
                <Input
                  id="estimatedDuration"
                  type="number"
                  min="1"
                  value={formData.estimatedDuration}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, estimatedDuration: Number.parseInt(e.target.value) || 30 }))
                  }
                />
              </div>
            </div>

            {/* 비고 */}
            <div className="space-y-2">
              <Label htmlFor="notes">비고</Label>
              <Textarea
                id="notes"
                placeholder="추가 설명이나 특이사항을 입력하세요"
                value={formData.notes}
                onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
                취소
              </Button>
              <Button type="submit">등록</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
