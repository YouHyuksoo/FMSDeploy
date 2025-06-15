"use client"
import { useState, useEffect, useMemo, useCallback } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { PreventiveMaster, PreventivePeriodType } from "@/types/preventive" // Added PreventivePeriodType
import type { Equipment } from "@/types/equipment"
import type { InspectionMaster } from "@/types/inspection-master"
import { periodTypeLabels } from "@/types/inspection-master"
import { StandardForm, type FormField, type FormGroup } from "@/components/common/standard-form"
import { calculateNextScheduleDate, getTodayIsoDate } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { isEqual } from "lodash" // For deep comparison

interface PreventiveMasterFormProps {
  formMode: "create" | "edit"
  initialData: Partial<PreventiveMaster> | null
  equipmentList?: Equipment[]
  templateList?: InspectionMaster[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: PreventiveMaster) => void
}

export function PreventiveMasterForm({
  formMode,
  initialData,
  equipmentList = [],
  templateList = [],
  open,
  onOpenChange,
  onSave,
}: PreventiveMasterFormProps) {
  const { toast } = useToast()
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string>(initialData?.equipmentId || "")
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(initialData?.templateId || "")
  const [formInitialData, setFormInitialData] = useState<Record<string, any>>({})

  const selectedEquipment = useMemo(() => {
    return equipmentList.find((eq) => eq.id === selectedEquipmentId)
  }, [selectedEquipmentId, equipmentList])

  const selectedTemplate = useMemo(() => {
    return templateList.find((tpl) => tpl.id === selectedTemplateId)
  }, [selectedTemplateId, templateList])

  const filteredTemplateList = useMemo(() => {
    if (!selectedEquipment) return templateList
    return templateList.filter((tpl) => tpl.equipmentType === selectedEquipment.typeId || !tpl.equipmentType)
  }, [selectedEquipment, templateList])

  const generateFormValues = useCallback(
    (
      currentEquipmentId: string,
      currentTemplateId: string,
      currentInitialData: Partial<PreventiveMaster> | null,
    ): Partial<PreventiveMaster> => {
      const eq = equipmentList.find((e) => e.id === currentEquipmentId)
      const tpl = templateList.find((t) => t.id === currentTemplateId)

      if (formMode === "edit" && currentInitialData) {
        return {
          ...currentInitialData,
          nextScheduleDate: currentInitialData.nextScheduleDate
            ? new Date(currentInitialData.nextScheduleDate).toISOString().split("T")[0]
            : getTodayIsoDate(),
        }
      }

      let suggestedNextDate = getTodayIsoDate()
      let taskDesc = ""
      let estDuration = 60
      const estCost = 0

      if (tpl) {
        taskDesc = `${eq?.name || "선택된 설비"} - ${tpl.name}`
        estDuration = tpl.estimatedTime || 60

        const baseDateForCalc = eq?.installDate || getTodayIsoDate()
        if (tpl.periodType && tpl.periodValue > 0) {
          suggestedNextDate = calculateNextScheduleDate(baseDateForCalc, tpl.periodType, tpl.periodValue)
        }
      }

      return {
        equipmentId: currentEquipmentId,
        templateId: currentTemplateId,
        taskDescription: taskDesc,
        estimatedDuration: estDuration,
        estimatedCost: estCost,
        isActive: true,
        nextScheduleDate: suggestedNextDate,
      }
    },
    [equipmentList, templateList, formMode],
  )

  useEffect(() => {
    const newInitialValues = generateFormValues(
      initialData?.equipmentId || "",
      initialData?.templateId || "",
      initialData,
    )
    if (!isEqual(formInitialData, newInitialValues)) {
      setFormInitialData(newInitialValues)
    }
    if (initialData?.equipmentId && selectedEquipmentId !== initialData.equipmentId) {
      setSelectedEquipmentId(initialData.equipmentId)
    }
    if (initialData?.templateId && selectedTemplateId !== initialData.templateId) {
      setSelectedTemplateId(initialData.templateId)
    }
  }, [initialData, generateFormValues, formInitialData, selectedEquipmentId, selectedTemplateId])

  useEffect(() => {
    // This effect reacts to internal selections of equipment or template
    const newValuesBasedOnSelection = generateFormValues(selectedEquipmentId, selectedTemplateId, initialData)

    setFormInitialData((prev) => {
      const updatedValues = {
        ...prev,
        equipmentId: selectedEquipmentId,
        templateId: selectedTemplateId,
        taskDescription: newValuesBasedOnSelection.taskDescription || prev.taskDescription,
        estimatedDuration: newValuesBasedOnSelection.estimatedDuration || prev.estimatedDuration,
        estimatedCost: newValuesBasedOnSelection.estimatedCost || prev.estimatedCost,
        nextScheduleDate:
          (formMode === "create" || prev.templateId !== selectedTemplateId) &&
          newValuesBasedOnSelection.nextScheduleDate
            ? newValuesBasedOnSelection.nextScheduleDate
            : prev.nextScheduleDate,
      }
      if (!isEqual(prev, updatedValues)) {
        return updatedValues
      }
      return prev
    })
  }, [selectedEquipmentId, selectedTemplateId, generateFormValues, formMode, initialData])

  const formFields: FormField[] = [
    {
      name: "equipmentId",
      label: "설비 *",
      type: "select",
      required: true,
      options: equipmentList.map((eq) => ({ label: eq.name, value: eq.id })),
      onChange: (value) => setSelectedEquipmentId(value as string),
      gridColumn: "md:col-span-1",
      disabled: formMode === "edit",
    },
    {
      name: "templateId",
      label: "적용 템플릿 *",
      type: "select",
      required: true,
      options: filteredTemplateList.map((tpl) => ({ label: tpl.name, value: tpl.id })),
      description: selectedEquipment ? "선택한 설비 유형에 맞는 점검 템플릿 목록입니다." : "설비를 먼저 선택하세요.",
      onChange: (value) => setSelectedTemplateId(value as string),
      gridColumn: "md:col-span-1",
    },
    {
      name: "taskDescription",
      label: "작업 설명 *",
      type: "textarea",
      required: true,
      placeholder: "예: 압축기 #1 - 일일 누유 점검",
      gridColumn: "md:col-span-2",
      description: "템플릿 선택 시 자동으로 생성되며, 직접 수정 가능합니다.",
    },
    {
      name: "selectedTemplatePeriod",
      label: "템플릿 주기",
      type: "text",
      value: selectedTemplate
        ? `${periodTypeLabels[selectedTemplate.periodType]} (값: ${selectedTemplate.periodValue})`
        : "템플릿을 선택하세요.",
      disabled: true,
      gridColumn: "md:col-span-1",
    },
    {
      name: "nextScheduleDate",
      label: "다음 점검 예정일 *",
      type: "date",
      required: true,
      gridColumn: "md:col-span-1",
      description: "템플릿 선택 시 자동 제안됩니다.",
    },
    {
      name: "estimatedDuration",
      label: "예상 소요시간 (분)",
      type: "number",
      min: 0,
      gridColumn: "md:col-span-1",
    },
    {
      name: "estimatedCost",
      label: "예상 비용 (원)",
      type: "number",
      min: 0,
      gridColumn: "md:col-span-1",
    },
    {
      name: "isActive",
      label: "이 설비에 템플릿 적용 활성화",
      type: "switch",
      defaultValue: true,
      gridColumn: "md:col-span-2",
    },
  ]

  const formGroups: FormGroup[] = [{ name: "main", title: "예방 정비 계획 정보", fields: formFields }]

  const handleSubmit = (data: Record<string, any>) => {
    const currentEquipment = equipmentList.find((eq) => eq.id === data.equipmentId)
    const currentTemplate = templateList.find((tpl) => tpl.id === data.templateId)

    const saveData: PreventiveMaster = {
      id: initialData?.id || `pm-master-${Date.now()}`,
      code: initialData?.code || `PM-${Date.now().toString().slice(-4)}`,
      name: data.taskDescription?.substring(0, 50) || currentTemplate?.name || "N/A",
      equipmentId: data.equipmentId,
      equipmentName: currentEquipment?.name || "N/A",
      templateId: data.templateId,
      taskDescription: data.taskDescription,
      periodType: currentTemplate?.periodType || initialData?.periodType || ("TIME_BASED" as PreventivePeriodType),
      intervalDays:
        currentTemplate?.periodType === "TIME_BASED" ? currentTemplate.periodValue : initialData?.intervalDays,
      // Add other interval types (months, years, fixed dates) or usage-based fields as needed
      usageThreshold:
        currentTemplate?.periodType === "USAGE_BASED" ? currentTemplate.periodValue : initialData?.usageThreshold,
      usageUnit: currentTemplate?.periodType === "USAGE_BASED" ? currentTemplate.unitOfMeasure : initialData?.usageUnit, // Assuming unitOfMeasure in InspectionMaster
      conditionParameter:
        currentTemplate?.periodType === "CONDITION_BASED"
          ? currentTemplate.checkPoint
          : initialData?.conditionParameter, // Assuming checkPoint in InspectionMaster
      estimatedDuration: Number(data.estimatedDuration) || 0,
      estimatedCost: Number(data.estimatedCost) || 0,
      isActive: data.isActive === undefined ? true : data.isActive,
      nextScheduleDate: data.nextScheduleDate ? new Date(data.nextScheduleDate).toISOString() : getTodayIsoDate(),
      lastExecutedDate: initialData?.lastExecutedDate,
      effectiveDate: initialData?.effectiveDate || getTodayIsoDate(),
      createdBy: initialData?.createdBy || "user-mock",
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedBy: "user-mock",
      updatedAt: new Date().toISOString(),
      title: data.taskDescription?.substring(0, 50) || currentTemplate?.name || "N/A",
    }
    onSave(saveData)
    onOpenChange(false)
  }

  // Prepare data for StandardForm, ensuring values are not undefined
  const standardFormInitialData = useMemo(() => {
    const data: Record<string, any> = {}
    formFields.forEach((field) => {
      data[field.name] = formInitialData[field.name] ?? field.defaultValue ?? ""
      if (field.type === "switch" && formInitialData[field.name] === undefined) {
        data[field.name] = field.defaultValue === undefined ? false : field.defaultValue
      }
      if (field.type === "date" && !data[field.name]) {
        // Ensure date fields have a valid default if empty, e.g., for nextScheduleDate
        if (field.name === "nextScheduleDate") data[field.name] = getTodayIsoDate()
      }
    })
    return data
  }, [formInitialData, formFields])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{formMode === "create" ? "새 예방 정비 계획 연결" : "예방 정비 계획 수정"}</DialogTitle>
          <DialogDescription>설비에 점검 템플릿을 연결하고 다음 점검 일정을 설정합니다.</DialogDescription>
        </DialogHeader>
        <StandardForm
          fields={useMemo(() => formFields, [])} // Pass fields directly
          groups={formGroups}
          initialData={standardFormInitialData} // Pass memoized and prepared initialData
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          mode={formMode}
          submitText={formMode === "create" ? "연결 생성" : "수정 완료"}
          showInDialog={false}
        />
      </DialogContent>
    </Dialog>
  )
}
