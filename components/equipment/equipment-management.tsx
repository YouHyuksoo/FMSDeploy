"use client"

import { useState, useEffect } from "react"
import { DataTable, type Column, type DataTableAction } from "@/components/common/data-table"
import { EquipmentForm } from "./equipment-form"
import { EquipmentQRCodeDialog } from "./equipment-qr-code-dialog"
import { ImportExportDialog } from "@/components/common/import-export-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import type { Equipment, EquipmentFormData } from "@/types/equipment"
import { mockEquipment } from "@/lib/mock-data/equipment"
import type { ExportColumn, ImportColumn } from "@/lib/utils/export-utils"
import {
  Settings,
  Edit,
  Trash2,
  Eye,
  Wrench,
  Calendar,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Square,
  QrCode,
  Printer,
} from "lucide-react"
import { useTranslation } from "@/lib/language-context"

export function EquipmentManagement() {
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<"create" | "edit" | "view">("create")
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | undefined>()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [equipmentToDelete, setEquipmentToDelete] = useState<Equipment | undefined>()
  const [importExportOpen, setImportExportOpen] = useState(false)
  const [selectedRows, setSelectedRows] = useState<Equipment[]>([])
  const [qrDialogOpen, setQrDialogOpen] = useState(false)
  const [qrEquipment, setQrEquipment] = useState<Equipment | null>(null)
  const { toast } = useToast()
  const { t } = useTranslation("equipment")
  const { t: tCommon } = useTranslation("common")

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

  const handleAdd = () => {
    setSelectedEquipment(undefined)
    setFormMode("create")
    setFormOpen(true)
  }

  const handleEdit = (equipment: Equipment) => {
    setSelectedEquipment(equipment)
    setFormMode("edit")
    setFormOpen(true)
  }

  const handleView = (equipment: Equipment) => {
    setSelectedEquipment(equipment)
    setFormMode("view")
    setFormOpen(true)
  }

  const handleDelete = (equipment: Equipment) => {
    setEquipmentToDelete(equipment)
    setDeleteDialogOpen(true)
  }

  const handleQRCode = (equipment: Equipment) => {
    setQrEquipment(equipment)
    setQrDialogOpen(true)
  }

  const handleBatchQRPrint = () => {
    if (selectedRows.length === 0) {
      toast({
        title: "알림",
        description: "QR 코드를 출력할 설비를 선택해주세요.",
        variant: "destructive",
      })
      return
    }

    // 임시로 토스트 메시지로 대체
    toast({
      title: "QR 일괄출력",
      description: `${selectedRows.length}개 설비의 QR 라벨을 출력합니다.\n선택된 설비: ${selectedRows.map((eq) => eq.name).join(", ")}`,
    })
  }

  const handleMaintenanceHistory = (equipment: Equipment) => {
    toast({
      title: "정비이력",
      description: `${equipment.name}의 정비이력을 조회합니다.`,
    })
  }

  const handleScheduleMaintenance = (equipment: Equipment) => {
    toast({
      title: "정비예약",
      description: `${equipment.name}의 정비를 예약합니다.`,
    })
  }

  const handleUpdateStatus = (equipment: Equipment) => {
    toast({
      title: "상태변경",
      description: `${equipment.name}의 상태를 변경합니다.`,
    })
  }

  const confirmDelete = async () => {
    if (!equipmentToDelete) return

    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setEquipment((prev) => prev.filter((eq) => eq.id !== equipmentToDelete.id))
      toast({
        title: tCommon("success"),
        description: t("equipment_deleted"),
      })
    } catch (error) {
      toast({
        title: tCommon("error"),
        description: "설비 삭제에 실패했습니다.",
        variant: "destructive",
      })
    } finally {
      setDeleteDialogOpen(false)
      setEquipmentToDelete(undefined)
    }
  }

  const handleFormSubmit = async (data: EquipmentFormData) => {
    try {
      if (formMode === "create") {
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const newEquipment: Equipment = {
          id: Date.now().toString(),
          ...data,
          type: getTypeLabel(data.typeCode),
          location: "A동 1층", // 실제로는 locationId로 조회
          department: "생산1팀", // 실제로는 departmentId로 조회
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: "current-user",
          updatedBy: "current-user",
        }

        setEquipment((prev) => [...prev, newEquipment])
        toast({
          title: tCommon("success"),
          description: t("equipment_added"),
        })
      } else if (formMode === "edit") {
        await new Promise((resolve) => setTimeout(resolve, 1000))

        setEquipment((prev) =>
          prev.map((eq) =>
            eq.id === selectedEquipment?.id
              ? {
                  ...eq,
                  ...data,
                  type: getTypeLabel(data.typeCode),
                  updatedAt: new Date().toISOString(),
                  updatedBy: "current-user",
                }
              : eq,
          ),
        )

        toast({
          title: tCommon("success"),
          description: t("equipment_updated"),
        })
      }
    } catch (error) {
      toast({
        title: tCommon("error"),
        description: `설비 ${formMode === "create" ? "추가" : "수정"}에 실패했습니다.`,
        variant: "destructive",
      })
      throw error
    }
  }

  const handleImportComplete = async (importedData: Equipment[]) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setEquipment((prev) => [...prev, ...importedData])
      toast({
        title: tCommon("success"),
        description: `${importedData.length}개의 설비가 가져오기 되었습니다.`,
      })
    } catch (error) {
      toast({
        title: tCommon("error"),
        description: "데이터 가져오기에 실패했습니다.",
        variant: "destructive",
      })
      throw error
    }
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
    return t(`status_${status}`)
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
    return t(`priority_${priority}`)
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

  const getTypeLabel = (typeCode: string) => {
    return t(`type_${typeCode.toLowerCase()}`)
  }

  const columns: Column<Equipment>[] = [
    {
      key: "code",
      title: t("equipment_code"),
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
      title: t("equipment_name"),
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
      title: t("equipment_type"),
      width: "w-24",
      sortable: true,
      filterable: true,
      filterOptions: [
        { label: t("type_compressor"), value: "압축기" },
        { label: t("type_conveyor"), value: "컨베이어" },
        { label: t("type_pump"), value: "펌프" },
        { label: t("type_robot"), value: "로봇" },
        { label: t("type_crane"), value: "크레인" },
      ],
      render: (value) => <Badge variant="outline">{value}</Badge>,
    },
    {
      key: "status",
      title: tCommon("status"),
      width: "w-24",
      sortable: true,
      filterable: true,
      filterOptions: [
        { label: t("status_running"), value: "running" },
        { label: t("status_stopped"), value: "stopped" },
        { label: t("status_maintenance"), value: "maintenance" },
        { label: t("status_failure"), value: "failure" },
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
      title: t("priority"),
      width: "w-20",
      sortable: true,
      filterable: true,
      filterOptions: [
        { label: t("priority_critical"), value: "critical" },
        { label: t("priority_high"), value: "high" },
        { label: t("priority_normal"), value: "normal" },
        { label: t("priority_low"), value: "low" },
      ],
      render: (value) => (
        <Badge variant="secondary" className={getPriorityColor(value)}>
          {getPriorityLabel(value)}
        </Badge>
      ),
    },
    {
      key: "location",
      title: t("location"),
      searchable: true,
      filterable: true,
      render: (value, record) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-sm text-muted-foreground">{record.department}</div>
        </div>
      ),
    },
    {
      key: "manufacturer",
      title: t("manufacturer"),
      searchable: true,
      render: (value, record) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-sm text-muted-foreground">{record.serialNumber}</div>
        </div>
      ),
    },
    {
      key: "nextMaintenanceDate",
      title: t("next_maintenance"),
      width: "w-32",
      sortable: true,
      render: (value) => {
        if (!value) return "-"
        const date = new Date(value)
        const isOverdue = date < new Date()
        return <span className={isOverdue ? "text-red-600 font-medium" : ""}>{date.toLocaleDateString("ko-KR")}</span>
      },
    },
  ]

  const actions: DataTableAction<Equipment>[] = [
    {
      key: "view",
      label: tCommon("view"),
      icon: Eye,
      onClick: handleView,
    },
    {
      key: "edit",
      label: tCommon("edit"),
      icon: Edit,
      onClick: handleEdit,
    },
    {
      key: "qr-code",
      label: "QR 코드",
      icon: QrCode,
      onClick: handleQRCode,
    },
    {
      key: "maintenance-history",
      label: t("maintenance_history"),
      icon: Activity,
      onClick: handleMaintenanceHistory,
    },
    {
      key: "schedule-maintenance",
      label: t("schedule_maintenance"),
      icon: Calendar,
      onClick: handleScheduleMaintenance,
    },
    {
      key: "update-status",
      label: t("update_status"),
      icon: Wrench,
      onClick: handleUpdateStatus,
    },
    {
      key: "delete",
      label: tCommon("delete"),
      icon: Trash2,
      onClick: handleDelete,
      variant: "destructive",
    },
  ]

  // Export/Import 설정
  const exportColumns: ExportColumn[] = [
    { key: "code", title: t("equipment_code"), width: 15 },
    { key: "name", title: t("equipment_name"), width: 25 },
    { key: "type", title: t("equipment_type"), width: 15 },
    { key: "model", title: t("model"), width: 15 },
    { key: "manufacturer", title: t("manufacturer"), width: 20 },
    { key: "serialNumber", title: t("serial_number"), width: 20 },
    { key: "location", title: t("location"), width: 15 },
    { key: "department", title: t("department"), width: 15 },
    { key: "status", title: tCommon("status"), width: 10, format: (value) => getStatusLabel(value) },
    { key: "priority", title: t("priority"), width: 10, format: (value) => getPriorityLabel(value) },
    {
      key: "installDate",
      title: t("install_date"),
      width: 15,
      format: (value) => new Date(value).toLocaleDateString("ko-KR"),
    },
    {
      key: "nextMaintenanceDate",
      title: t("next_maintenance"),
      width: 15,
      format: (value) => (value ? new Date(value).toLocaleDateString("ko-KR") : ""),
    },
  ]

  const importColumns: ImportColumn[] = [
    { key: "code", title: t("equipment_code"), required: true, type: "string" },
    { key: "name", title: t("equipment_name"), required: true, type: "string" },
    { key: "typeCode", title: t("equipment_type"), required: true, type: "string" },
    { key: "model", title: t("model"), required: true, type: "string" },
    { key: "manufacturer", title: t("manufacturer"), required: true, type: "string" },
    { key: "serialNumber", title: t("serial_number"), required: true, type: "string" },
    { key: "locationId", title: t("location"), required: true, type: "string" },
    { key: "departmentId", title: t("department"), required: true, type: "string" },
    { key: "status", title: tCommon("status"), required: true, type: "string" },
    { key: "priority", title: t("priority"), required: true, type: "string" },
    { key: "installDate", title: t("install_date"), required: true, type: "date" },
    { key: "description", title: tCommon("description"), type: "string" },
  ]

  const sampleData = [
    {
      code: "EQ-SAMPLE-001",
      name: "샘플 설비",
      typeCode: "COMPRESSOR",
      model: "SM-100",
      manufacturer: "샘플제조사",
      serialNumber: "SM2024001",
      locationId: "LOC-A1",
      departmentId: "3",
      status: "running",
      priority: "normal",
      installDate: "2024-01-01",
      description: "샘플 설비입니다",
    },
  ]

  return (
    <div className="space-y-6">
      {/* 추가 액션 버튼 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t("title")}</h2>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>
        <div className="flex items-center gap-2">
          {selectedRows.length > 0 && (
            <Button variant="outline" onClick={handleBatchQRPrint}>
              <Printer className="h-4 w-4 mr-2" />
              QR 일괄출력 ({selectedRows.length})
            </Button>
          )}
        </div>
      </div>

      <DataTable
        data={equipment}
        columns={columns}
        actions={actions}
        onAdd={handleAdd}
        loading={loading}
        searchPlaceholder="설비코드, 설비명으로 검색..."
        addButtonText={t("add_equipment")}
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

      <EquipmentForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleFormSubmit}
        initialData={selectedEquipment}
        mode={formMode}
      />

      <EquipmentQRCodeDialog open={qrDialogOpen} onOpenChange={setQrDialogOpen} equipment={qrEquipment} />

      <ImportExportDialog
        open={importExportOpen}
        onOpenChange={setImportExportOpen}
        title={t("title")}
        exportColumns={exportColumns}
        importColumns={importColumns}
        exportData={selectedRows.length > 0 ? selectedRows : equipment}
        onImportComplete={handleImportComplete}
        exportOptions={{ filename: "equipment" }}
        sampleData={sampleData}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {tCommon("delete")} {t("title")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              "{equipmentToDelete?.name}" {t("confirm_delete")}
              <br />이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tCommon("cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              {tCommon("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
