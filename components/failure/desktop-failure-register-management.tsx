"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/common/data-table"
import { ImportExportDialog } from "@/components/common/import-export-dialog"
import { useToast } from "@/hooks/use-toast"
import { Plus, Brain, Edit, Trash2, Paperclip } from "lucide-react"
import { type Failure, FailureStatus, FailureType, FailurePriority } from "@/types/failure"
import { mockFailures } from "@/lib/mock-data/failure"
import { mockEquipment } from "@/lib/mock-data/equipment"
import { FailureForm } from "./failure-form"

export function FailureRegisterManagement() {
  const [failures, setFailures] = useState<Failure[]>(
    mockFailures.map((f) => ({ ...f, attachments: f.attachments || [] })),
  )
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFailure, setSelectedFailure] = useState<Failure | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isImportExportOpen, setIsImportExportOpen] = useState(false)
  const { toast } = useToast()

  const filteredFailures = failures.filter(
    (failure) =>
      failure.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      failure.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      failure.reporterName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCreate = () => {
    setSelectedFailure(null)
    setIsFormOpen(true)
  }

  const handleEdit = (failure: Failure) => {
    setSelectedFailure(failure)
    setIsFormOpen(true)
  }

  const handleDelete = (id: string) => {
    // In a real app, also delete associated attachments from storage
    setFailures((prev) => prev.filter((failure) => failure.id !== id))
    toast({
      title: "삭제 완료",
      description: "고장 정보가 삭제되었습니다.",
    })
  }

  const handleSave = (failureData: Partial<Failure>) => {
    if (selectedFailure) {
      setFailures((prev) =>
        prev.map((failure) =>
          failure.id === selectedFailure.id
            ? {
                ...failure,
                ...failureData,
                attachments: failureData.attachments || [], // Ensure attachments are updated
                updatedAt: new Date().toISOString(),
              }
            : failure,
        ),
      )
      toast({
        title: "수정 완료",
        description: "고장 정보가 수정되었습니다.",
      })
    } else {
      const newFailure: Failure = {
        id: `failure-${Date.now()}`,
        equipmentId: failureData.equipmentId || "",
        equipmentName: failureData.equipmentName || "",
        title: failureData.title || "",
        description: failureData.description || "",
        type: failureData.type || FailureType.MECHANICAL,
        priority: failureData.priority || FailurePriority.MEDIUM,
        status: FailureStatus.REPORTED,
        reportedAt: new Date().toISOString(),
        reporterName: failureData.reporterName || "",
        reporterContact: failureData.reporterContact || "",
        symptom: failureData.symptom || "",
        possibleCauses: failureData.possibleCauses || "",
        recommendedActions: failureData.recommendedActions || "",
        preventionMethods: failureData.preventionMethods || "",
        attachments: failureData.attachments || [], // Ensure attachments are saved
        estimatedCost: failureData.estimatedCost || 0,
        actualCost: 0,
        downtimeHours: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setFailures((prev) => [newFailure, ...prev])
      toast({
        title: "등록 완료",
        description: "고장이 등록되었습니다.",
      })
    }
    setIsFormOpen(false)
  }

  const generateCopilotDescription = async (failure: Failure) => {
    const description = `[AI 분석 결과]
설비: ${failure.equipmentName}
고장유형: ${failure.type}
증상: ${failure.symptom}

가능한 원인:
1. 부품 마모로 인한 성능 저하
2. 윤활유 부족 또는 오염
3. 과부하 운전으로 인한 손상

권장 조치:
1. 해당 부품 점검 및 교체
2. 윤활유 교체 및 보충
3. 운전 조건 재검토

예방 방법:
1. 정기적인 예방정비 실시
2. 운전 조건 모니터링 강화
3. 부품 교체 주기 단축`

    const updatedFailure = {
      ...failure,
      possibleCauses: "부품 마모, 윤활유 부족, 과부하 운전",
      recommendedActions: "부품 교체, 윤활유 교체, 운전조건 재검토",
      preventionMethods: "정기 예방정비, 조건 모니터링, 교체주기 단축",
      copilotDescription: description,
      updatedAt: new Date().toISOString(),
    }
    setFailures((prev) => prev.map((f) => (f.id === failure.id ? updatedFailure : f)))
    toast({
      title: "AI 분석 완료",
      description: "Copilot이 고장 원인과 조치방안을 분석했습니다.",
    })
  }

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
    { key: "title", title: "고장 제목", searchable: true },
    { key: "equipmentName", title: "설비명", searchable: true },
    { key: "type", title: "고장 유형", filterable: true },
    {
      key: "priority",
      title: "우선순위",
      render: (value: FailurePriority) => getPriorityBadge(value),
      filterable: true,
    },
    { key: "status", title: "상태", render: (value: FailureStatus) => getStatusBadge(value), filterable: true },
    { key: "reporterName", title: "신고자", searchable: true },
    { key: "reportedAt", title: "신고일시", render: (value: string) => new Date(value).toLocaleString() },
    {
      key: "attachments",
      title: "첨부",
      render: (attachments: string[]) =>
        attachments && attachments.length > 0 ? <Paperclip className="h-4 w-4" /> : "-",
    },
  ]

  const actions = [
    {
      key: "ai-analysis",
      label: "AI 분석",
      icon: Brain,
      onClick: (record: Failure) => generateCopilotDescription(record),
    },
    { key: "edit", label: "수정", icon: Edit, onClick: handleEdit },
    {
      key: "delete",
      label: "삭제",
      icon: Trash2,
      onClick: (record: Failure) => handleDelete(record.id),
      variant: "destructive" as const,
    },
  ]

  const exportColumns = [
    { key: "title", title: "고장 제목", width: 20 },
    { key: "equipmentName", title: "설비명", width: 15 },
    // ... other export columns
    {
      key: "attachments",
      title: "첨부파일 수",
      width: 10,
      render: (attachments: string[]) => attachments?.length || 0,
    },
  ]

  const importColumns = [
    { key: "title", title: "고장 제목", required: true },
    // ... other import columns
    // Note: Importing attachments directly via CSV is complex and not handled here.
  ]

  const handleImportComplete = async (data: Partial<Failure>[]) => {
    const newFailures = data.map((item) => ({
      id: `failure-${Date.now()}-${Math.random()}`,
      equipmentId: "",
      equipmentName: item.equipmentName || "",
      title: item.title || "",
      description: item.description || "",
      type: (item.type as FailureType) || FailureType.MECHANICAL,
      priority: (item.priority as FailurePriority) || FailurePriority.MEDIUM,
      status: FailureStatus.REPORTED,
      reportedAt: new Date().toISOString(),
      reporterName: item.reporterName || "",
      reporterContact: "",
      symptom: "",
      possibleCauses: "",
      recommendedActions: "",
      preventionMethods: "",
      attachments: [], // Attachments are not imported via this simple CSV method
      estimatedCost: 0,
      actualCost: 0,
      downtimeHours: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }))

    setFailures((prev) => [...newFailures, ...prev])
    toast({
      title: "가져오기 완료",
      description: `${newFailures.length}개의 고장 정보를 가져왔습니다.`,
    })
  }

  const sampleData = [
    {
      title: "컨베이어 벨트 이상",
      equipmentName: "컨베이어 #1",
      type: "기계적",
      priority: "높음",
      reporterName: "김작업자",
      description: "벨트가 미끄러짐",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">고장 등록</h1>
        <div className="flex items-center gap-2">
          <Button onClick={() => setIsImportExportOpen(true)} variant="outline">
            가져오기/내보내기
          </Button>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            고장 등록
          </Button>
        </div>
      </div>

      <DataTable
        data={filteredFailures}
        columns={columns}
        actions={actions}
        showAddButton={false}
        title="고장 현황"
        searchPlaceholder="고장 제목, 설비명, 신고자로 검색..."
        showExport={true}
        showImport={true}
        onExport={() => setIsImportExportOpen(true)}
        onImport={() => setIsImportExportOpen(true)}
      />

      <FailureForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        failure={selectedFailure}
        onSave={handleSave}
        equipmentOptions={mockEquipment}
      />

      <ImportExportDialog
        open={isImportExportOpen}
        onOpenChange={setIsImportExportOpen}
        title="고장 정보"
        exportColumns={exportColumns}
        importColumns={importColumns}
        exportData={failures}
        onImportComplete={handleImportComplete}
        sampleData={sampleData}
      />
    </div>
  )
}
