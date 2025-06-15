"use client"

import { useState, useEffect, useMemo } from "react"
import { StandardForm, type FormField, type FormGroup } from "@/components/common/standard-form"
import type { Code, CodeFormData, CodeGroup } from "@/types/code"

interface CodeFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CodeFormData) => Promise<void>
  initialData?: Code
  codeGroups: CodeGroup[]
  parentCodes: Code[]
  mode: "create" | "edit" | "view"
  selectedGroupId?: string
}

export function CodeForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  codeGroups,
  parentCodes,
  mode,
  selectedGroupId,
}: CodeFormProps) {
  const [attributes, setAttributes] = useState<Record<string, any>>({})

  useEffect(() => {
    if (initialData?.attributes) {
      setAttributes(initialData.attributes)
    } else {
      setAttributes({})
    }
  }, [initialData, open])

  const validateCode = (value: any) => {
    if (!value) return "코드는 필수입니다."
    if (!/^[A-Z0-9_]+$/.test(value)) {
      return "코드는 영문 대문자, 숫자, _만 사용 가능합니다."
    }
    return null
  }

  const groupOptions = useMemo(
    () =>
      codeGroups
        .filter((group) => group.isActive)
        .map((group) => ({
          label: `${group.groupName} (${group.groupCode})`,
          value: group.id,
        })),
    [codeGroups],
  )

  const parentOptions = useMemo(
    () =>
      parentCodes
        .filter((code) => code.level === 1)
        .map((code) => ({
          label: `${code.name} (${code.code})`,
          value: code.code,
        })),
    [parentCodes],
  )

  const formFields: FormField[] = useMemo(
    () => [
      // 기본 정보
      {
        name: "groupId",
        label: "코드 그룹",
        type: "select",
        required: true,
        options: groupOptions,
        defaultValue: selectedGroupId,
        disabled: mode === "edit" || !!selectedGroupId,
        group: "basic",
      },
      {
        name: "code",
        label: "코드",
        type: "text",
        required: true,
        placeholder: "ADMIN, PRODUCTION 등",
        disabled: mode === "edit",
        validation: { custom: validateCode },
        description: "영문 대문자, 숫자, _만 사용 가능",
        group: "basic",
      },
      {
        name: "name",
        label: "코드명",
        type: "text",
        required: true,
        placeholder: "관리자, 생산설비 등",
        group: "basic",
      },
      {
        name: "description",
        label: "설명",
        type: "textarea",
        placeholder: "코드에 대한 설명을 입력하세요",
        group: "basic",
      },
      {
        name: "value",
        label: "값",
        type: "text",
        placeholder: "admin, production 등 (선택사항)",
        description: "시스템에서 사용할 실제 값",
        group: "basic",
      },

      // 계층 구조
      {
        name: "parentCode",
        label: "상위 코드",
        type: "select",
        options: parentOptions,
        description: "계층 구조가 필요한 경우 상위 코드를 선택하세요",
        group: "hierarchy",
      },
      {
        name: "sortOrder",
        label: "정렬순서",
        type: "number",
        defaultValue: 1,
        validation: { min: 1 },
        group: "hierarchy",
      },

      // 상태 및 속성
      {
        name: "isActive",
        label: "활성 상태",
        type: "switch",
        defaultValue: true,
        description: "비활성화 시 시스템에서 사용할 수 없습니다",
        group: "status",
      },

      // 확장 속성
      {
        name: "color",
        label: "색상",
        type: "text",
        placeholder: "#dc2626",
        description: "UI에서 표시할 색상 (HEX 코드)",
        group: "attributes",
        customRender: (field, value, onChange, error) => (
          <div className="space-y-2">
            <label className="text-sm font-medium">색상</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={value || "#000000"}
                onChange={(e) => onChange(e.target.value)}
                className="w-12 h-10 border rounded"
              />
              <input
                type="text"
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                placeholder="#dc2626"
                className="flex-1 px-3 py-2 border rounded-md"
              />
            </div>
            <p className="text-sm text-muted-foreground">UI에서 표시할 색상 (HEX 코드)</p>
          </div>
        ),
      },
      {
        name: "icon",
        label: "아이콘",
        type: "text",
        placeholder: "crown, shield, users 등",
        description: "Lucide 아이콘 이름",
        group: "attributes",
      },
      {
        name: "bgColor",
        label: "배경색",
        type: "text",
        placeholder: "#fef2f2",
        description: "배경 색상 (HEX 코드)",
        group: "attributes",
      },
    ],
    [groupOptions, parentOptions, selectedGroupId, mode],
  )

  const formGroups: FormGroup[] = [
    {
      name: "basic",
      title: "기본 정보",
      description: "코드의 기본 정보를 입력하세요",
    },
    {
      name: "hierarchy",
      title: "계층 구조",
      description: "코드의 계층 구조와 정렬을 설정하세요",
    },
    {
      name: "status",
      title: "상태 설정",
      description: "코드의 활성 상태를 설정하세요",
    },
    {
      name: "attributes",
      title: "확장 속성",
      description: "UI 표시를 위한 추가 속성을 설정하세요",
      collapsible: true,
      defaultCollapsed: true,
    },
  ]

  const handleSubmit = async (data: Record<string, any>) => {
    // 확장 속성 처리
    const { color, icon, bgColor, ...basicData } = data
    const attributes: Record<string, any> = {}

    if (color) attributes.color = color
    if (icon) attributes.icon = icon
    if (bgColor) attributes.bgColor = bgColor

    const codeFormData: CodeFormData = {
      ...basicData,
      attributes: Object.keys(attributes).length > 0 ? attributes : undefined,
    }

    await onSubmit(codeFormData)
  }

  const getInitialData = () => {
    if (!initialData) return { groupId: selectedGroupId }

    return {
      groupId: initialData.groupId,
      code: initialData.code,
      name: initialData.name,
      description: initialData.description,
      value: initialData.value,
      parentCode: initialData.parentCode,
      sortOrder: initialData.sortOrder,
      isActive: initialData.isActive,
      color: initialData.attributes?.color,
      icon: initialData.attributes?.icon,
      bgColor: initialData.attributes?.bgColor,
    }
  }

  return (
    <StandardForm
      fields={formFields}
      groups={formGroups}
      initialData={getInitialData()}
      onSubmit={handleSubmit}
      onCancel={() => onOpenChange(false)}
      mode={mode}
      title={mode === "create" ? "코드 추가" : mode === "edit" ? "코드 수정" : "코드 정보"}
      description={
        mode === "create"
          ? "새로운 코드를 추가합니다."
          : mode === "edit"
            ? "코드 정보를 수정합니다."
            : "코드 정보를 확인합니다."
      }
      submitText={mode === "create" ? "코드 추가" : mode === "edit" ? "수정 완료" : "확인"}
      open={open}
      onOpenChange={onOpenChange}
      showInDialog={true}
      layout="tabs"
      maxWidth="800px"
    />
  )
}
