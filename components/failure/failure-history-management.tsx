"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { DataTable } from "@/components/common/data-table"
import { ImportExportDialog } from "@/components/common/import-export-dialog"
import { useToast } from "@/hooks/use-toast"
import { TrendingUp, Clock, DollarSign } from "lucide-react"
import { type Failure, FailureStatus, FailurePriority } from "@/types/failure"
import { mockFailures } from "@/lib/mock-data/failure"

export function FailureHistoryManagement() {
  const [failures, setFailures] = useState<Failure[]>(mockFailures)
  const [isImportExportOpen, setIsImportExportOpen] = useState(false)
  const { toast } = useToast()

  const getStatusBadge = (status: FailureStatus) => {
    const statusConfig = {
      [FailureStatus.REPORTED]: { label: "접수됨", variant: "secondary" as const },
      [FailureStatus.DIAGNOSED]: { label: "진단중", variant: "default" as const },
      [FailureStatus.IN_REPAIR]: { label: "수리중", variant: "destructive" as const },
      [FailureStatus.COMPLETED]: { label: "완료됨", variant: "default" as const },
    }
    const config = statusConfig[status]
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getPriorityBadge = (priority: FailurePriority) => {
    const priorityConfig = {
      [FailurePriority.EMERGENCY]: { label: "긴급", variant: "destructive" as const },
      [FailurePriority.HIGH]: { label: "높음", variant: "destructive" as const },
      [FailurePriority.MEDIUM]: { label: "보통", variant: "secondary" as const },
      [FailurePriority.LOW]: { label: "낮음", variant: "outline" as const },
    }
    const config = priorityConfig[priority]
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const columns = [
    {
      key: "title",
      title: "고장 제목",
      searchable: true,
    },
    {
      key: "equipmentName",
      title: "설비명",
      searchable: true,
    },
    {
      key: "type",
      title: "고장 유형",
    },
    {
      key: "priority",
      title: "우선순위",
      render: (value: FailurePriority) => getPriorityBadge(value),
    },
    {
      key: "status",
      title: "상태",
      render: (value: FailureStatus) => getStatusBadge(value),
    },
    {
      key: "downtimeHours",
      title: "정지시간",
      render: (value: number) => `${value}h`,
    },
    {
      key: "actualCost",
      title: "수리비용",
      render: (value: number) => `₩${value?.toLocaleString() || 0}`,
    },
    {
      key: "reportedAt",
      title: "신고일시",
      render: (value: string) => new Date(value).toLocaleString(),
    },
    {
      key: "completedAt",
      title: "완료일시",
      render: (value: string) => (value ? new Date(value).toLocaleString() : "-"),
    },
  ]

  const exportColumns = [
    { key: "title", title: "고장 제목", width: 20 },
    { key: "equipmentName", title: "설비명", width: 15 },
    { key: "type", title: "고장 유형", width: 12 },
    { key: "priority", title: "우선순위", width: 10 },
    { key: "status", title: "상태", width: 10 },
    { key: "downtimeHours", title: "정지시간", width: 10 },
    { key: "actualCost", title: "수리비용", width: 12 },
    { key: "reportedAt", title: "신고일시", width: 15 },
    { key: "completedAt", title: "완료일시", width: 15 },
  ]

  const importColumns = [
    { key: "title", title: "고장 제목", required: true },
    { key: "equipmentName", title: "설비명", required: true },
    { key: "type", title: "고장 유형", required: true },
    { key: "priority", title: "우선순위", required: true },
    { key: "downtimeHours", title: "정지시간", required: false },
    { key: "actualCost", title: "수리비용", required: false },
  ]

  const handleImportComplete = async (data: Partial<Failure>[]) => {
    toast({
      title: "가져오기 완료",
      description: `${data.length}개의 고장 이력을 가져왔습니다.`,
    })
  }

  const sampleData = [
    {
      title: "펌프 고장",
      equipmentName: "펌프 #1",
      type: "기계적",
      priority: "높음",
      downtimeHours: 4,
      actualCost: 500000,
    },
  ]

  // 통계 계산
  const totalFailures = failures.length
  const totalDowntime = failures.reduce((sum, f) => sum + (f.downtimeHours || 0), 0)
  const totalCost = failures.reduce((sum, f) => sum + (f.actualCost || 0), 0)
  const avgRepairTime = totalFailures > 0 ? (totalDowntime / totalFailures).toFixed(1) : "0"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">고장 이력 조회</h1>
        <div className="flex items-center gap-2">
          <Button onClick={() => setIsImportExportOpen(true)} variant="outline">
            가져오기/내보내기
          </Button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">총 고장 건수</p>
                <p className="text-2xl font-bold">{totalFailures}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">총 정지시간</p>
                <p className="text-2xl font-bold">{totalDowntime}h</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">총 수리비용</p>
                <p className="text-2xl font-bold">₩{totalCost.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">평균 수리시간</p>
                <p className="text-2xl font-bold">{avgRepairTime}h</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <DataTable
        data={failures}
        columns={columns}
        title="고장 이력"
        searchPlaceholder="고장 제목, 설비명으로 검색..."
        showExport={true}
        showImport={true}
        onExport={() => setIsImportExportOpen(true)}
        onImport={() => setIsImportExportOpen(true)}
      />

      <ImportExportDialog
        open={isImportExportOpen}
        onOpenChange={setIsImportExportOpen}
        title="고장 이력"
        exportColumns={exportColumns}
        importColumns={importColumns}
        exportData={failures}
        onImportComplete={handleImportComplete}
        sampleData={sampleData}
      />
    </div>
  )
}
