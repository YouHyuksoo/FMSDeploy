"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/common/data-table"
import { ImportExportDialog } from "@/components/common/import-export-dialog"
import { PreventiveMasterForm } from "./preventive-master-form"
import { useToast } from "@/hooks/use-toast"
import { type PreventiveMaster, PreventivePeriodType, preventivePeriodTypeLabels } from "@/types/preventive"
import { mockPreventiveMasters } from "@/lib/mock-data/preventive"
import { Plus, FileDown } from "lucide-react"

// 1. 필요한 타입 및 목업 데이터 import 추가
import type { Equipment } from "@/types/equipment"
import { mockEquipment } from "@/lib/mock-data/equipment" // 실제 경로와 파일 존재 여부 확인 필요
import type { InspectionMaster } from "@/types/inspection-master"
import { mockInspectionMasters } from "@/lib/mock-data/inspection-master" // 실제 경로와 파일 존재 여부 확인 필요

export function PreventiveMasterManagement() {
  const [masters, setMasters] = useState<PreventiveMaster[]>(mockPreventiveMasters)
  // PreventiveMasterManagement 컴포넌트 내부 상단에 다음 state 추가
  // const [masters, setMasters] = useState<PreventiveMaster[]>(mockPreventiveMasters) 아래에 추가합니다.
  const [equipmentList] = useState<Equipment[]>(mockEquipment) // 실제로는 API 호출 등으로 초기화
  const [templateList] = useState<InspectionMaster[]>(mockInspectionMasters) // 실제로는 API 호출 등으로 초기화
  const [selectedMaster, setSelectedMaster] = useState<PreventiveMaster | null>(null)
  const [formMode, setFormMode] = useState<"create" | "edit">("create") // Add this line
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isImportExportOpen, setIsImportExportOpen] = useState(false)
  const { toast } = useToast()

  const columns = [
    {
      key: "equipmentName",
      title: "설비명",
      searchable: true,
      render: (value: any, master: PreventiveMaster) => master.equipmentName || "-",
    },
    {
      key: "title",
      title: "정비명",
      searchable: true,
      render: (value: any, master: PreventiveMaster) => master.title || "-",
    },
    {
      key: "periodType",
      title: "주기 유형", // Changed title for clarity
      render: (value: any, master: PreventiveMaster) => {
        if (!master.periodType) return "-"
        let detailText = ""
        if (master.periodType === PreventivePeriodType.TIME_BASED) {
          if (master.intervalDays) detailText = `${master.intervalDays}일 마다`
          else if (master.intervalMonths) detailText = `${master.intervalMonths}개월 마다`
          else if (master.intervalYears) detailText = `${master.intervalYears}년 마다`
          else if (master.fixedDateDay && master.fixedDateMonth)
            detailText = `매년 ${master.fixedDateMonth}월 ${master.fixedDateDay}일`
          else if (master.fixedDateDay) detailText = `매월 ${master.fixedDateDay}일`
          else detailText = "시간 기반"
        } else if (master.periodType === PreventivePeriodType.USAGE_BASED) {
          detailText = `사용량 ${master.usageThreshold || ""}${master.usageUnit || ""} 도달 시`
        } else if (master.periodType === PreventivePeriodType.CONDITION_BASED) {
          detailText = `조건 ${master.conditionParameter || ""} ${master.conditionOperator || ""} ${master.conditionValue || ""}`
        }
        return `${preventivePeriodTypeLabels[master.periodType]}${detailText ? ` (${detailText})` : ""}`
      },
    },
    {
      key: "estimatedDuration",
      title: "예상시간",
      render: (value: any, master: PreventiveMaster) =>
        master.estimatedDuration ? `${master.estimatedDuration}분` : "-",
    },
    {
      key: "estimatedCost",
      title: "예상비용",
      render: (value: any, master: PreventiveMaster) =>
        master.estimatedCost ? `₩${master.estimatedCost.toLocaleString()}` : "-",
    },
    {
      key: "isActive",
      title: "상태",
      render: (value: any, master: PreventiveMaster) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            master.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
          }`}
        >
          {master.isActive ? "활성" : "비활성"}
        </span>
      ),
    },
    {
      key: "actions",
      title: "작업",
      render: (value: any, master: PreventiveMaster) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleEdit(master)}>
            수정
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleDelete(master.id)}>
            삭제
          </Button>
        </div>
      ),
    },
  ]

  const exportColumns = [
    { key: "equipmentName", title: "설비명", width: 20 },
    { key: "title", title: "정비명", width: 30 },
    { key: "description", title: "설명", width: 40 },
    { key: "frequency", title: "주기", width: 15 },
    { key: "frequencyValue", title: "주기값", width: 10 },
    { key: "estimatedDuration", title: "예상시간(분)", width: 15 },
    { key: "estimatedCost", title: "예상비용", width: 15 },
    { key: "isActive", title: "활성상태", width: 10 },
  ]

  const importColumns = [
    { key: "equipmentName", title: "설비명", required: true },
    { key: "title", title: "정비명", required: true },
    { key: "description", title: "설명", required: false },
    { key: "frequency", title: "주기", required: true },
    { key: "frequencyValue", title: "주기값", required: true },
    { key: "estimatedDuration", title: "예상시간(분)", required: true },
    { key: "estimatedCost", title: "예상비용", required: true },
    { key: "isActive", title: "활성상태", required: false },
  ]

  const sampleData = [
    {
      equipmentName: "CNC 밀링머신 #1",
      title: "주간 정밀도 점검",
      description: "CNC 밀링머신의 정밀도 및 진동 점검",
      frequency: "weekly",
      frequencyValue: 1,
      estimatedDuration: 120,
      estimatedCost: 50000,
      isActive: true,
    },
  ]

  const handleAdd = () => {
    setSelectedMaster(null)
    setFormMode("create") // Add this line
    setIsFormOpen(true)
  }

  const handleEdit = (master: PreventiveMaster) => {
    setSelectedMaster(master)
    setFormMode("edit") // Add this line
    setIsFormOpen(true)
  }

  const handleDelete = (id: string) => {
    setMasters(masters.filter((master) => master.id !== id))
    toast({
      title: "삭제 완료",
      description: "예방정비마스터가 삭제되었습니다.",
    })
  }

  const handleSave = (data: Partial<PreventiveMaster>) => {
    if (selectedMaster) {
      setMasters(
        masters.map((master) =>
          master.id === selectedMaster.id ? { ...master, ...data, updatedAt: new Date().toISOString() } : master,
        ),
      )
      toast({
        title: "수정 완료",
        description: "예방정비마스터가 수정되었습니다.",
      })
    } else {
      const newMaster: PreventiveMaster = {
        id: `pm-${Date.now()}`,
        ...data,
        createdBy: "admin",
        createdAt: new Date().toISOString(),
        updatedBy: "admin",
        updatedAt: new Date().toISOString(),
      } as PreventiveMaster
      setMasters([...masters, newMaster])
      toast({
        title: "등록 완료",
        description: "예방정비마스터가 등록되었습니다.",
      })
    }
    setIsFormOpen(false)
  }

  const handleImportComplete = async (data: PreventiveMaster[]) => {
    const newMasters = data.map((item, index) => ({
      ...item,
      id: `pm-import-${Date.now()}-${index}`,
      createdBy: "admin",
      createdAt: new Date().toISOString(),
      updatedBy: "admin",
      updatedAt: new Date().toISOString(),
    }))
    setMasters([...masters, ...newMasters])
    toast({
      title: "가져오기 완료",
      description: `${data.length}개의 예방정비마스터를 가져왔습니다.`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">예방정비마스터</h1>
        <div className="flex gap-2">
          <Button onClick={() => setIsImportExportOpen(true)} variant="outline">
            <FileDown className="h-4 w-4 mr-2" />
            가져오기/내보내기
          </Button>
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            등록
          </Button>
        </div>
      </div>

      <DataTable data={masters} columns={columns} searchKey="title" />

      <PreventiveMasterForm
        formMode={formMode} // Add this prop
        initialData={selectedMaster} // Prop name in PreventiveMasterForm is initialData
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSave={handleSave}
        equipmentList={equipmentList}
        templateList={templateList}
      />

      <ImportExportDialog
        open={isImportExportOpen}
        onOpenChange={setIsImportExportOpen}
        title="예방정비마스터 가져오기/내보내기"
        exportColumns={exportColumns}
        importColumns={importColumns}
        exportData={masters}
        onImportComplete={handleImportComplete}
        sampleData={sampleData}
      />
    </div>
  )
}
