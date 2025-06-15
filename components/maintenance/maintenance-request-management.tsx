"use client"

import { useState, useEffect } from "react"
import { DataTable, type Column, type DataTableAction } from "@/components/common/data-table"
import { MaintenanceForm } from "./maintenance-form"
import { MaintenancePlanForm } from "./maintenance-plan-form"
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
import type { MaintenanceRequest, MaintenanceFormData, MaintenancePlanFormData } from "@/types/maintenance"
import { mockMaintenanceRequests } from "@/lib/mock-data/maintenance"
import type { ExportColumn, ImportColumn } from "@/lib/utils/export-utils"
import { Edit, Trash2, Eye, CheckCircle, XCircle, Clock, Settings, Calendar, User } from "lucide-react"

export function MaintenanceRequestManagement() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<"create" | "edit" | "view">("create")
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | undefined>()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [requestToDelete, setRequestToDelete] = useState<MaintenanceRequest | undefined>()
  const [importExportOpen, setImportExportOpen] = useState(false)
  const [selectedRows, setSelectedRows] = useState<MaintenanceRequest[]>([])
  const { toast } = useToast()

  const [planFormOpen, setPlanFormOpen] = useState(false)
  const [requestToPlan, setRequestToPlan] = useState<MaintenanceRequest | undefined>()

  useEffect(() => {
    loadRequests()
  }, [])

  const loadRequests = async () => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setRequests(mockMaintenanceRequests)
    } catch (error) {
      toast({
        title: "오류",
        description: "작업 요청 목록을 불러오는데 실패했습니다.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setSelectedRequest(undefined)
    setFormMode("create")
    setFormOpen(true)
  }

  const handleEdit = (request: MaintenanceRequest) => {
    setSelectedRequest(request)
    setFormMode("edit")
    setFormOpen(true)
  }

  const handleView = (request: MaintenanceRequest) => {
    setSelectedRequest(request)
    setFormMode("view")
    setFormOpen(true)
  }

  const handleDelete = (request: MaintenanceRequest) => {
    setRequestToDelete(request)
    setDeleteDialogOpen(true)
  }

  const handleApprove = (request: MaintenanceRequest) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === request.id
          ? {
              ...req,
              status: "approved",
              approvedBy: "current-user",
              approvedByName: "현재사용자",
              approvalDate: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          : req,
      ),
    )
    toast({
      title: "승인 완료",
      description: `"${request.title}" 요청이 승인되었습니다.`,
    })
  }

  const handleReject = (request: MaintenanceRequest) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === request.id
          ? {
              ...req,
              status: "rejected",
              updatedAt: new Date().toISOString(),
            }
          : req,
      ),
    )
    toast({
      title: "반려 완료",
      description: `"${request.title}" 요청이 반려되었습니다.`,
    })
  }

  const handleCreatePlan = (request: MaintenanceRequest) => {
    setRequestToPlan(request)
    setPlanFormOpen(true)
  }

  const handlePlanFormSubmit = async (data: MaintenancePlanFormData) => {
    if (!requestToPlan) return

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newPlan = {
        ...data,
        id: `MPLAN-${Date.now()}`,
        planNo: `P${Date.now().toString().slice(-6)}`,
        requestId: requestToPlan.id,
        equipmentCode: requestToPlan.equipmentCode,
        equipmentName: requestToPlan.equipmentName,
        status: "planned",
        planDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: "current-user",
      }

      console.log("신규 작업 계획 생성 (요청 기반):", newPlan)

      setRequests((prev) =>
        prev.map((req) =>
          req.id === requestToPlan.id
            ? {
                ...req,
                status: "planned",
                updatedAt: new Date().toISOString(),
              }
            : req,
        ),
      )

      toast({
        title: "계획 수립 완료",
        description: `"${data.title}" 작업 계획이 생성되었습니다. '작업계획 배정' 메뉴에서 확인하세요.`,
        duration: 5000,
      })
    } catch (error) {
      toast({
        title: "오류",
        description: "작업 계획 수립에 실패했습니다.",
        variant: "destructive",
      })
      throw error
    }
  }

  const confirmDelete = async () => {
    if (!requestToDelete) return

    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setRequests((prev) => prev.filter((req) => req.id !== requestToDelete.id))
      toast({
        title: "삭제 완료",
        description: "작업 요청이 삭제되었습니다.",
      })
    } catch (error) {
      toast({
        title: "오류",
        description: "작업 요청 삭제에 실패했습니다.",
        variant: "destructive",
      })
    } finally {
      setDeleteDialogOpen(false)
      setRequestToDelete(undefined)
    }
  }

  const handleFormSubmit = async (data: MaintenanceFormData) => {
    try {
      if (formMode === "create") {
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const newRequest: MaintenanceRequest = {
          id: Date.now().toString(),
          requestNo: `REQ-${new Date().getFullYear()}-${String(requests.length + 1).padStart(3, "0")}`,
          ...data,
          equipmentCode: "EQ-SAMPLE-001",
          equipmentName: "샘플 설비",
          status: "requested",
          requestedBy: "current-user",
          requestedByName: "현재사용자",
          requestDate: new Date().toISOString(),
          location: "A동 1층",
          department: "생산1팀",
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: "current-user",
          updatedBy: "current-user",
        }

        setRequests((prev) => [...prev, newRequest])
        toast({
          title: "등록 완료",
          description: "보전작업 요청이 등록되었습니다.",
        })
      } else if (formMode === "edit") {
        await new Promise((resolve) => setTimeout(resolve, 1000))

        setRequests((prev) =>
          prev.map((req) =>
            req.id === selectedRequest?.id
              ? {
                  ...req,
                  ...data,
                  updatedAt: new Date().toISOString(),
                  updatedBy: "current-user",
                }
              : req,
          ),
        )

        toast({
          title: "수정 완료",
          description: "작업 요청이 수정되었습니다.",
        })
      }
    } catch (error) {
      toast({
        title: "오류",
        description: `작업 요청 ${formMode === "create" ? "등록" : "수정"}에 실패했습니다.`,
        variant: "destructive",
      })
      throw error
    }
  }

  const handleImportComplete = async (importedData: MaintenanceRequest[]) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setRequests((prev) => [...prev, ...importedData])
      toast({
        title: "가져오기 완료",
        description: `${importedData.length}개의 작업 요청이 가져오기 되었습니다.`,
      })
    } catch (error) {
      toast({
        title: "오류",
        description: "데이터 가져오기에 실패했습니다.",
        variant: "destructive",
      })
      throw error
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "requested":
        return <Clock className="h-4 w-4" />
      case "approved":
        return <CheckCircle className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
      case "planned":
        return <Calendar className="h-4 w-4" />
      case "in_progress":
        return <Settings className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      requested: "요청됨",
      approved: "승인됨",
      rejected: "반려됨",
      planned: "계획됨",
      assigned: "배정됨",
      in_progress: "진행중",
      completed: "완료됨",
      cancelled: "취소됨",
    }
    return labels[status] || status
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "requested":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "planned":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "in_progress":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
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

  const getRequestTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      breakdown: "고장수리",
      preventive: "예방정비",
      improvement: "개선작업",
      emergency: "비상수리",
    }
    return labels[type] || type
  }

  const columns: Column<MaintenanceRequest>[] = [
    {
      key: "requestNo",
      title: "요청번호",
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
      key: "requestType",
      title: "요청 유형",
      width: "w-24",
      sortable: true,
      filterable: true,
      filterOptions: [
        { label: "고장수리", value: "breakdown" },
        { label: "예방정비", value: "preventive" },
        { label: "개선작업", value: "improvement" },
        { label: "비상수리", value: "emergency" },
      ],
      render: (value) => <Badge variant="outline">{getRequestTypeLabel(value)}</Badge>,
    },
    {
      key: "status",
      title: "상태",
      width: "w-24",
      sortable: true,
      filterable: true,
      filterOptions: [
        { label: "요청됨", value: "requested" },
        { label: "승인됨", value: "approved" },
        { label: "반려됨", value: "rejected" },
        { label: "계획됨", value: "planned" },
        { label: "진행중", value: "in_progress" },
        { label: "완료됨", value: "completed" },
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
      key: "requestedByName",
      title: "요청자",
      searchable: true,
      render: (value, record) => (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <div>
            <div className="font-medium">{value}</div>
            <div className="text-sm text-muted-foreground">
              {new Date(record.requestDate).toLocaleDateString("ko-KR")}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "estimatedCost",
      title: "예상비용",
      width: "w-24",
      sortable: true,
      align: "right",
      render: (value) => (value ? `${Number(value).toLocaleString()}원` : "-"),
    },
    {
      key: "estimatedDuration",
      title: "예상시간",
      width: "w-20",
      sortable: true,
      align: "center",
      render: (value) => (value ? `${value}시간` : "-"),
    },
  ]

  const actions: DataTableAction<MaintenanceRequest>[] = [
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
      hidden: (record) => !["requested", "rejected"].includes(record.status),
    },
    {
      key: "approve",
      label: "승인",
      icon: CheckCircle,
      onClick: handleApprove,
      hidden: (record) => record.status !== "requested",
    },
    {
      key: "reject",
      label: "반려",
      icon: XCircle,
      onClick: handleReject,
      variant: "destructive",
      hidden: (record) => record.status !== "requested",
    },
    {
      key: "createPlan",
      label: "계획 수립",
      icon: Calendar,
      onClick: handleCreatePlan,
      hidden: (record) => record.status !== "approved",
    },
    {
      key: "delete",
      label: "삭제",
      icon: Trash2,
      onClick: handleDelete,
      variant: "destructive",
      hidden: (record) => !["requested", "rejected"].includes(record.status),
    },
  ]

  const exportColumns: ExportColumn[] = [
    { key: "requestNo", title: "요청번호", width: 15 },
    { key: "title", title: "작업 제목", width: 30 },
    { key: "equipmentName", title: "설비명", width: 20 },
    { key: "requestType", title: "요청 유형", width: 15, format: (value) => getRequestTypeLabel(value) },
    { key: "status", title: "상태", width: 15, format: (value) => getStatusLabel(value) },
    { key: "priority", title: "우선순위", width: 10, format: (value) => getPriorityLabel(value) },
    { key: "requestedByName", title: "요청자", width: 15 },
    {
      key: "requestDate",
      title: "요청일",
      width: 15,
      format: (value) => new Date(value).toLocaleDateString("ko-KR"),
    },
    {
      key: "estimatedCost",
      title: "예상비용",
      width: 15,
      format: (value) => (value ? `${Number(value).toLocaleString()}원` : ""),
    },
    { key: "description", title: "설명", width: 40 },
  ]

  const importColumns: ImportColumn[] = [
    { key: "title", title: "작업 제목", required: true, type: "string" },
    { key: "description", title: "작업 내용", required: true, type: "string" },
    { key: "equipmentId", title: "설비 ID", required: true, type: "string" },
    { key: "requestType", title: "요청 유형", required: true, type: "string" },
    { key: "priority", title: "우선순위", required: true, type: "string" },
    { key: "estimatedDuration", title: "예상 시간", type: "number" },
    { key: "estimatedCost", title: "예상 비용", type: "number" },
  ]

  const sampleData = [
    {
      title: "샘플 보전작업",
      description: "샘플 작업 내용",
      equipmentId: "1",
      requestType: "breakdown",
      priority: "normal",
      estimatedDuration: 2,
      estimatedCost: 100000,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">보전작업 요청</h2>
          <p className="text-muted-foreground">
            보전작업 요청을 등록하고, 승인된 요청을 바탕으로 작업 계획을 수립합니다.
          </p>
        </div>
      </div>

      <DataTable
        data={requests}
        columns={columns}
        actions={actions}
        onAdd={handleAdd}
        loading={loading}
        searchPlaceholder="요청번호, 제목, 설비명으로 검색..."
        addButtonText="작업 요청"
        selectable={true}
        selectedRows={selectedRows}
        onSelectedRowsChange={setSelectedRows}
        showFilter={true}
        showExport={true}
        showImport={true}
        onExport={() => setImportExportOpen(true)}
        onImport={() => setImportExportOpen(true)}
        stickyHeader={true}
        maxHeight="calc(100vh - 250px)"
      />

      <MaintenanceForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleFormSubmit}
        initialData={selectedRequest}
        mode={formMode}
      />

      <ImportExportDialog
        open={importExportOpen}
        onOpenChange={setImportExportOpen}
        title="보전작업 요청"
        exportColumns={exportColumns}
        importColumns={importColumns}
        exportData={selectedRows.length > 0 ? selectedRows : requests}
        onImportComplete={handleImportComplete}
        exportOptions={{ filename: "maintenance-requests" }}
        sampleData={sampleData}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>작업 요청 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              "{requestToDelete?.title}" 요청을 삭제하시겠습니까?
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

      {/* This form is now controlled by state and opens when '계획 수립' is clicked */}
      <MaintenancePlanForm
        open={planFormOpen}
        onOpenChange={setPlanFormOpen}
        onSubmit={handlePlanFormSubmit}
        initialData={requestToPlan}
        mode="create"
        onCancel={() => setPlanFormOpen(false)}
      />
    </div>
  )
}
