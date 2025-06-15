"use client"

import { useState, useEffect } from "react"
import { DataTable, type Column, type DataTableAction } from "@/components/common/data-table"
import { ImportExportDialog } from "@/components/common/import-export-dialog"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import type { MaintenanceWork } from "@/types/maintenance"
import { mockMaintenanceWorks } from "@/lib/mock-data/maintenance"
import type { ExportColumn } from "@/lib/utils/export-utils"
import { Edit, Trash2, Eye, CheckCircle, Play, Clock, Settings, Users, Camera, FileText, Hourglass } from "lucide-react"

export function MaintenanceCompleteManagement() {
  const [works, setWorks] = useState<MaintenanceWork[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [workToDelete, setWorkToDelete] = useState<MaintenanceWork | undefined>()
  const [importExportOpen, setImportExportOpen] = useState(false)
  const [selectedRows, setSelectedRows] = useState<MaintenanceWork[]>([])
  const { toast } = useToast()

  useEffect(() => {
    loadWorks()
  }, [])

  const loadWorks = async () => {
    setLoading(true)
    try {
      // In a real app, you would fetch MaintenanceWork records,
      // especially those with status 'pending', 'in_progress', etc.
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setWorks(mockMaintenanceWorks) // mockMaintenanceWorks should contain some 'pending' items
    } catch (error) {
      toast({
        title: "오류",
        description: "작업 목록을 불러오는데 실패했습니다.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleView = (work: MaintenanceWork) => {
    toast({
      title: "작업 상세",
      description: `${work.title}의 상세 정보를 조회합니다. (구현 필요)`,
    })
  }

  const handleEdit = (work: MaintenanceWork) => {
    toast({
      title: "작업 수정",
      description: `${work.title}을 수정합니다. (구현 필요)`,
    })
  }

  const handleStart = (work: MaintenanceWork) => {
    setWorks((prev) =>
      prev.map((w) =>
        w.id === work.id
          ? {
              ...w,
              status: "in_progress",
              startDate: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          : w,
      ),
    )
    toast({
      title: "작업 시작",
      description: `"${work.title}" 작업을 시작했습니다.`,
    })
  }

  const handleComplete = (work: MaintenanceWork) => {
    setWorks((prev) =>
      prev.map((w) =>
        w.id === work.id
          ? {
              ...w,
              status: "completed",
              endDate: new Date().toISOString(),
              actualDuration: w.actualDuration || 4, // Mock actual duration
              actualCost: w.actualCost || w.estimatedCost || 0, // Mock actual cost
              updatedAt: new Date().toISOString(),
            }
          : w,
      ),
    )
    toast({
      title: "작업 완료",
      description: `"${work.title}" 작업이 완료되었습니다.`,
    })
  }

  const handlePhotos = (work: MaintenanceWork) => {
    toast({
      title: "작업 사진",
      description: `${work.title}의 작업 사진을 관리합니다. (구현 필요)`,
    })
  }

  const handleReport = (work: MaintenanceWork) => {
    toast({
      title: "작업 보고서",
      description: `${work.title}의 작업 보고서를 생성합니다. (구현 필요)`,
    })
  }

  const handleDelete = (work: MaintenanceWork) => {
    setWorkToDelete(work)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!workToDelete) return

    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setWorks((prev) => prev.filter((work) => work.id !== workToDelete.id))
      toast({
        title: "삭제 완료",
        description: "작업이 삭제되었습니다.",
      })
    } catch (error) {
      toast({
        title: "오류",
        description: "작업 삭제에 실패했습니다.",
        variant: "destructive",
      })
    } finally {
      setDeleteDialogOpen(false)
      setWorkToDelete(undefined)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Hourglass className="h-4 w-4" />
      case "assigned": // Should not really be 'assigned' here, but keeping for safety
        return <Users className="h-4 w-4" />
      case "in_progress":
        return <Settings className="h-4 w-4 animate-spin-slow" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "on_hold":
        return <Clock className="h-4 w-4" />
      default: // cancelled or unknown
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: "대기중",
      assigned: "배정됨", // Should ideally not appear here for MaintenanceWork
      in_progress: "진행중",
      completed: "완료됨",
      on_hold: "보류중",
      cancelled: "취소됨",
    }
    return labels[status] || status
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "assigned":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "in_progress":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "on_hold":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
      default: // cancelled or unknown
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getPriorityLabel = (priority: string) => {
    const labels: Record<string, string> = {
      critical: "긴급",
      high: "높음",
      normal: "보통",
      low: "낮음",
    }
    return labels[priority] || priority
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

  const getWorkTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      repair: "수리",
      replace: "교체",
      inspect: "점검",
      calibrate: "교정",
      upgrade: "개선",
      general: "일반",
    }
    return labels[type] || type
  }

  const columns: Column<MaintenanceWork>[] = [
    {
      key: "workNo",
      title: "작업번호",
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
      key: "title",
      title: "작업 제목",
      sortable: true,
      searchable: true,
      render: (value, record) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-sm text-muted-foreground">{record.equipmentName}</div>
        </div>
      ),
    },
    {
      key: "workType",
      title: "작업 유형",
      width: "w-24",
      sortable: true,
      filterable: true,
      filterOptions: [
        { label: "수리", value: "repair" },
        { label: "교체", value: "replace" },
        { label: "점검", value: "inspect" },
        { label: "교정", value: "calibrate" },
        { label: "개선", value: "upgrade" },
        { label: "일반", value: "general" },
      ],
      render: (value) => <Badge variant="outline">{getWorkTypeLabel(value)}</Badge>,
    },
    {
      key: "status",
      title: "상태",
      width: "w-24",
      sortable: true,
      filterable: true,
      filterOptions: [
        { label: "대기중", value: "pending" },
        { label: "진행중", value: "in_progress" },
        { label: "완료됨", value: "completed" },
        { label: "보류중", value: "on_hold" },
        { label: "취소됨", value: "cancelled" },
      ],
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
      title: "우선순위",
      width: "w-20",
      sortable: true,
      filterable: true,
      filterOptions: [
        { label: "긴급", value: "critical" },
        { label: "높음", value: "high" },
        { label: "보통", value: "normal" },
        { label: "낮음", value: "low" },
      ],
      render: (value) => (
        <Badge variant="secondary" className={getPriorityColor(value)}>
          {getPriorityLabel(value)}
        </Badge>
      ),
    },
    {
      key: "assignedToName",
      title: "담당자",
      searchable: true,
      render: (value, record) => (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <div>
            <div className="font-medium">{value}</div>
            <div className="text-sm text-muted-foreground">{record.assignedTeamName}</div>
          </div>
        </div>
      ),
    },
    {
      key: "startDate",
      title: "시작일",
      width: "w-32",
      sortable: true,
      render: (value) => (value ? new Date(value).toLocaleDateString("ko-KR") : "-"),
    },
    {
      key: "actualDuration",
      title: "실제시간",
      width: "w-20",
      sortable: true,
      align: "center",
      render: (value) => (value ? `${value}시간` : "-"),
    },
    {
      key: "actualCost",
      title: "실제비용",
      width: "w-24",
      sortable: true,
      align: "right",
      render: (value) => (value ? `${Number(value).toLocaleString()}원` : "-"),
    },
  ]

  const actions: DataTableAction<MaintenanceWork>[] = [
    {
      key: "view",
      label: "상세보기",
      icon: Eye,
      onClick: handleView,
    },
    {
      key: "edit",
      label: "수정",
      icon: Edit,
      onClick: handleEdit,
      hidden: (record) => ["completed", "cancelled"].includes(record.status),
    },
    {
      key: "start",
      label: "작업 시작",
      icon: Play,
      onClick: handleStart,
      // Work can only be started if it's 'pending'
      hidden: (record) => record.status !== "pending",
    },
    {
      key: "complete",
      label: "작업 완료",
      icon: CheckCircle,
      onClick: handleComplete,
      // Work can only be completed if it's 'in_progress'
      hidden: (record) => record.status !== "in_progress",
    },
    {
      key: "photos",
      label: "작업 사진",
      icon: Camera,
      onClick: handlePhotos,
      // Photos can be added once work started or completed
      hidden: (record) => ["pending", "cancelled"].includes(record.status),
    },
    {
      key: "report",
      label: "작업 보고서",
      icon: FileText,
      onClick: handleReport,
      hidden: (record) => record.status !== "completed",
    },
    {
      key: "delete",
      label: "삭제",
      icon: Trash2,
      onClick: handleDelete,
      variant: "destructive",
      // Allow deletion only if work is 'pending' or 'cancelled'
      hidden: (record) => !["pending", "cancelled"].includes(record.status),
    },
  ]

  const exportColumns: ExportColumn[] = [
    { key: "workNo", title: "작업번호", width: 15 },
    { key: "title", title: "작업 제목", width: 30 },
    { key: "equipmentName", title: "설비명", width: 20 },
    { key: "workType", title: "작업 유형", width: 15, format: (value) => getWorkTypeLabel(value as string) },
    { key: "status", title: "상태", width: 15, format: (value) => getStatusLabel(value as string) },
    { key: "priority", title: "우선순위", width: 10, format: (value) => getPriorityLabel(value as string) },
    { key: "assignedToName", title: "담당자", width: 15 },
    { key: "assignedTeamName", title: "담당팀", width: 15 },
    {
      key: "startDate",
      title: "시작일",
      width: 15,
      format: (value) => (value ? new Date(value as string).toLocaleDateString("ko-KR") : ""),
    },
    {
      key: "endDate",
      title: "완료일",
      width: 15,
      format: (value) => (value ? new Date(value as string).toLocaleDateString("ko-KR") : ""),
    },
    { key: "actualDuration", title: "실제시간", width: 10, format: (value) => (value ? `${value}시간` : "") },
    {
      key: "actualCost",
      title: "실제비용",
      width: 15,
      format: (value) => (value ? `${Number(value).toLocaleString()}원` : ""),
    },
    { key: "completionNotes", title: "완료 메모", width: 40 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">작업완료 처리</h2>
          <p className="text-muted-foreground">배정된 작업을 수행하고 완료 처리합니다</p>
        </div>
      </div>

      <DataTable
        data={works}
        columns={columns}
        actions={actions}
        loading={loading}
        searchPlaceholder="작업번호, 제목, 설비명으로 검색..."
        selectable={true}
        selectedRows={selectedRows}
        onSelectedRowsChange={setSelectedRows}
        showFilter={true}
        showExport={true}
        onExport={() => setImportExportOpen(true)}
        stickyHeader={true}
        maxHeight="calc(100vh - 250px)"
      />

      <ImportExportDialog
        open={importExportOpen}
        onOpenChange={setImportExportOpen}
        title="작업완료 처리"
        exportColumns={exportColumns}
        importColumns={[]} // Import functionality not implemented for this component
        exportData={selectedRows.length > 0 ? selectedRows : works}
        onImportComplete={async () => {
          /* Placeholder */
        }}
        exportOptions={{ filename: "maintenance-works" }}
        sampleData={[]} // No sample data for import
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>작업 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              "{workToDelete?.title}" 작업을 삭제하시겠습니까?
              <br />이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
