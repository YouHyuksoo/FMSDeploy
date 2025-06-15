"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DataTable } from "@/components/common/data-table"
import { ImportExportDialog } from "@/components/common/import-export-dialog"
import { TPMActivityForm } from "./tpm-activity-form"
import { mockTPMActivities, tpmPillars, mockTPMTeams } from "@/lib/mock-data/tpm"
import { mockEquipment } from "@/lib/mock-data/equipment"
import { useTranslation } from "@/lib/language-context"
import { useToast } from "@/hooks/use-toast"
import { Plus, FileUp, Activity, Target, TrendingUp, Clock } from "lucide-react"
import type { TPMActivity, TPMActivityFormData } from "@/types/tpm"
import type { ColumnDef } from "@tanstack/react-table"

export function TPMActivityManagement() {
  const { t } = useTranslation("tpm")
  const { t: tCommon } = useTranslation("common")
  const { toast } = useToast()
  const [activities, setActivities] = useState<TPMActivity[]>(mockTPMActivities)
  const [selectedActivity, setSelectedActivity] = useState<TPMActivity | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<"create" | "edit" | "view">("create")
  const [importExportOpen, setImportExportOpen] = useState(false)

  const getStatusBadge = (status: string) => {
    const statusMap = {
      planned: { label: "계획됨", variant: "secondary" as const },
      in_progress: { label: "진행중", variant: "default" as const },
      completed: { label: "완료됨", variant: "success" as const },
      cancelled: { label: "취소됨", variant: "destructive" as const },
    }
    return statusMap[status as keyof typeof statusMap] || { label: status, variant: "secondary" as const }
  }

  const getPriorityBadge = (priority: string) => {
    const priorityMap = {
      high: { label: "높음", variant: "destructive" as const },
      normal: { label: "보통", variant: "default" as const },
      low: { label: "낮음", variant: "secondary" as const },
    }
    return priorityMap[priority as keyof typeof priorityMap] || { label: priority, variant: "secondary" as const }
  }

  const columns: ColumnDef<TPMActivity>[] = [
    {
      accessorKey: "activityNo",
      header: "활동 번호",
      cell: ({ row }) => <div className="font-medium">{row.getValue("activityNo")}</div>,
    },
    {
      accessorKey: "title",
      header: "활동 제목",
      cell: ({ row }) => <div className="font-medium">{row.getValue("title")}</div>,
    },
    {
      accessorKey: "teamName",
      header: "담당 분임조",
    },
    {
      accessorKey: "pillar",
      header: "TPM 기둥",
      cell: ({ row }) => {
        const pillar = row.getValue("pillar") as string
        return <Badge variant="outline">{pillar}</Badge>
      },
    },
    {
      accessorKey: "priority",
      header: "우선순위",
      cell: ({ row }) => {
        const priority = row.getValue("priority") as string
        const badge = getPriorityBadge(priority)
        return <Badge variant={badge.variant}>{badge.label}</Badge>
      },
    },
    {
      accessorKey: "status",
      header: "상태",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        const badge = getStatusBadge(status)
        return <Badge variant={badge.variant}>{badge.label}</Badge>
      },
    },
    {
      accessorKey: "completionRate",
      header: "진행률",
      cell: ({ row }) => {
        const rate = row.getValue("completionRate") as number
        return (
          <div className="flex items-center gap-2">
            <Progress value={rate} className="w-[60px]" />
            <span className="text-sm">{rate}%</span>
          </div>
        )
      },
    },
    {
      accessorKey: "startDate",
      header: "시작일",
    },
    {
      accessorKey: "endDate",
      header: "종료일",
    },
  ]

  const handleCreate = () => {
    setSelectedActivity(null)
    setFormMode("create")
    setFormOpen(true)
  }

  const handleEdit = (activity: TPMActivity) => {
    setSelectedActivity(activity)
    setFormMode("edit")
    setFormOpen(true)
  }

  const handleView = (activity: TPMActivity) => {
    setSelectedActivity(activity)
    setFormMode("view")
    setFormOpen(true)
  }

  const handleDelete = async (activity: TPMActivity) => {
    try {
      setActivities(activities.filter((a) => a.id !== activity.id))
      toast({
        title: "TPM 활동 삭제 완료",
        description: `${activity.title}이(가) 삭제되었습니다.`,
      })
    } catch (error) {
      toast({
        title: "삭제 실패",
        description: "TPM 활동 삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (data: TPMActivityFormData) => {
    try {
      if (formMode === "create") {
        const newActivity: TPMActivity = {
          id: `temp-${Date.now()}`,
          activityNo: `TPM-ACT-${new Date().getFullYear()}-${String(activities.length + 1).padStart(3, "0")}`,
          ...data,
          teamName: mockTPMTeams.find((t) => t.id === data.teamId)?.name || "",
          equipmentNames: data.equipmentIds.map((id) => mockEquipment.find((eq) => eq.id === id)?.name || ""),
          status: "planned",
          completionRate: 0,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: "current-user",
          updatedBy: "current-user",
        }
        setActivities([...activities, newActivity])
        toast({
          title: "TPM 활동 등록 완료",
          description: `${data.title}이(가) 등록되었습니다.`,
        })
      } else if (formMode === "edit" && selectedActivity) {
        const updatedActivity: TPMActivity = {
          ...selectedActivity,
          ...data,
          teamName: mockTPMTeams.find((t) => t.id === data.teamId)?.name || selectedActivity.teamName,
          equipmentNames: data.equipmentIds.map((id) => mockEquipment.find((eq) => eq.id === id)?.name || ""),
          updatedAt: new Date().toISOString(),
          updatedBy: "current-user",
        }
        setActivities(activities.map((a) => (a.id === selectedActivity.id ? updatedActivity : a)))
        toast({
          title: "TPM 활동 수정 완료",
          description: `${data.title}이(가) 수정되었습니다.`,
        })
      }
      setFormOpen(false)
    } catch (error) {
      toast({
        title: "저장 실패",
        description: "TPM 활동 정보 저장 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  const handleImportComplete = async (data: TPMActivity[]) => {
    try {
      setActivities([...activities, ...data])
      toast({
        title: "가져오기 완료",
        description: `${data.length}개의 TPM 활동이 가져와졌습니다.`,
      })
    } catch (error) {
      toast({
        title: "가져오기 실패",
        description: "데이터 가져오기 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  // Export/Import 컬럼 정의
  const exportColumns = [
    { key: "activityNo", title: "활동번호", width: 15 },
    { key: "title", title: "활동제목", width: 25 },
    { key: "teamName", title: "담당분임조", width: 15 },
    { key: "pillar", title: "TPM기둥", width: 15 },
    { key: "activityType", title: "활동유형", width: 15 },
    { key: "priority", title: "우선순위", width: 10 },
    { key: "status", title: "상태", width: 10 },
    { key: "completionRate", title: "진행률", width: 10 },
    { key: "startDate", title: "시작일", width: 12 },
    { key: "endDate", title: "종료일", width: 12 },
    { key: "completionDate", title: "완료일", width: 12 },
    { key: "location", title: "활동장소", width: 15 },
  ]

  const importColumns = [
    { key: "activityNo", title: "활동번호", required: true },
    { key: "title", title: "활동제목", required: true },
    { key: "teamName", title: "담당분임조", required: true },
    { key: "pillar", title: "TPM기둥", required: true },
    { key: "activityType", title: "활동유형", required: true },
    { key: "priority", title: "우선순위", required: false },
    { key: "status", title: "상태", required: false },
    { key: "startDate", title: "시작일", required: true },
    { key: "endDate", title: "종료일", required: true },
    { key: "location", title: "활동장소", required: false },
  ]

  // 통계 계산
  const totalActivities = activities.length
  const completedActivities = activities.filter((a) => a.status === "completed").length
  const inProgressActivities = activities.filter((a) => a.status === "in_progress").length
  const averageCompletion = Math.round(activities.reduce((sum, a) => sum + a.completionRate, 0) / activities.length)

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">TPM 활동 관리</h1>
          <p className="text-muted-foreground">TPM 8대 기둥별 활동을 계획하고 관리합니다.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setImportExportOpen(true)}>
            <FileUp className="mr-2 h-4 w-4" />
            가져오기/내보내기
          </Button>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            TPM 활동 등록
          </Button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">전체 활동</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalActivities}</div>
            <p className="text-xs text-muted-foreground">완료: {completedActivities}개</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">진행중 활동</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressActivities}</div>
            <p className="text-xs text-muted-foreground">
              전체의 {Math.round((inProgressActivities / totalActivities) * 100)}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">평균 진행률</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageCompletion}%</div>
            <Progress value={averageCompletion} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">완료율</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round((completedActivities / totalActivities) * 100)}%</div>
            <p className="text-xs text-muted-foreground">
              {completedActivities}/{totalActivities} 활동 완료
            </p>
          </CardContent>
        </Card>
      </div>

      {/* TPM 기둥별 현황 */}
      <Card>
        <CardHeader>
          <CardTitle>TPM 8대 기둥별 활동 현황</CardTitle>
          <CardDescription>각 TPM 기둥별 활동 수와 진행 상황을 확인할 수 있습니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {tpmPillars.map((pillar) => {
              const pillarActivities = activities.filter((a) => a.pillar === pillar.value)
              const completedCount = pillarActivities.filter((a) => a.status === "completed").length
              const completionRate =
                pillarActivities.length > 0 ? Math.round((completedCount / pillarActivities.length) * 100) : 0

              return (
                <div key={pillar.value} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{pillar.label}</span>
                    <span className="text-sm text-muted-foreground">{pillarActivities.length}개</span>
                  </div>
                  <Progress value={completionRate} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    완료율: {completionRate}% ({completedCount}/{pillarActivities.length})
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* 데이터 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle>TPM 활동 목록</CardTitle>
          <CardDescription>등록된 TPM 활동 목록을 확인하고 관리할 수 있습니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={activities}
            searchKey="title"
            searchPlaceholder="활동 제목으로 검색..."
            onEdit={handleEdit}
            onView={handleView}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      {/* TPM 활동 폼 다이얼로그 */}
      <TPMActivityForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmit}
        initialData={selectedActivity || undefined}
        mode={formMode}
      />

      {/* 가져오기/내보내기 다이얼로그 */}
      <ImportExportDialog
        open={importExportOpen}
        onOpenChange={setImportExportOpen}
        title="TPM 활동"
        exportColumns={exportColumns}
        importColumns={importColumns}
        exportData={activities}
        onImportComplete={handleImportComplete}
        exportOptions={{ filename: "TPM_활동_목록" }}
        sampleData={[
          {
            activityNo: "TPM-ACT-2024-001",
            title: "자주보전 활동 예시",
            teamName: "A팀",
            pillar: "자주보전",
            activityType: "일상점검",
            priority: "normal",
            status: "planned",
            startDate: "2024-01-01",
            endDate: "2024-12-31",
            location: "생산라인 1",
          },
        ]}
      />
    </div>
  )
}
