"use client"

import { StandardForm, type FormField } from "@/components/common/standard-form"
import type { CodeGroup, CodeGroupFormData } from "@/types/code"
import { useMemo } from "react"

interface CodeGroupFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CodeGroupFormData) => Promise<void>
  initialData?: CodeGroup
  mode: "create" | "edit" | "view"
}

export function CodeGroupForm({ open, onOpenChange, onSubmit, initialData, mode }: CodeGroupFormProps) {
  const validateGroupCode = (value: any) => {
    if (!value) return "그룹코드는 필수입니다."
    if (!/^[A-Z0-9_]+$/.test(value)) {
      return "그룹코드는 영문 대문자, 숫자, _만 사용 가능합니다."
    }
    if (value.length < 2) {
      return "그룹코드는 2자 이상이어야 합니다."
    }
    return null
  }

  const formFields: FormField[] = useMemo(
    () => [
      {
        name: "groupCode",
        label: "그룹코드",
        type: "text",
        required: true,
        placeholder: "USER_LEVEL, EQUIPMENT_TYPE 등",
        disabled: mode === "edit", // 수정 시 코드 변경 불가
        validation: { custom: validateGroupCode },
        description: "영문 대문자, 숫자, _만 사용 가능",
      },
      {
        name: "groupName",
        label: "그룹명",
        type: "text",
        required: true,
        placeholder: "사용자 레벨, 설비 유형 등",
      },
      {
        name: "description",
        label: "설명",
        type: "textarea",
        placeholder: "코드 그룹에 대한 설명을 입력하세요",
      },
      {
        name: "sortOrder",
        label: "정렬순서",
        type: "number",
        defaultValue: 1,
        validation: { min: 1 },
      },
      {
        name: "isActive",
        label: "활성 상태",
        type: "switch",
        defaultValue: true,
        description: "비활성화 시 해당 그룹의 코드들을 사용할 수 없습니다",
      },
    ],
    [mode],
  )

  const getInitialData = () => {
    if (!initialData) return {}

    return {
      groupCode: initialData.groupCode,
      groupName: initialData.groupName,
      description: initialData.description,
      sortOrder: initialData.sortOrder,
      isActive: initialData.isActive,
    }
  }

  return (
    <StandardForm
      fields={formFields}
      initialData={getInitialData()}
      onSubmit={onSubmit}
      onCancel={() => onOpenChange(false)}
      mode={mode}
      title={mode === "create" ? "코드 그룹 추가" : mode === "edit" ? "코드 그룹 수정" : "코드 그룹 정보"}
      description={
        mode === "create"
          ? "새로운 코드 그룹을 추가합니다."
          : mode === "edit"
            ? "코드 그룹 정보를 수정합니다."
            : "코드 그룹 정보를 확인합니다."
      }
      submitText={mode === "create" ? "그룹 추가" : mode === "edit" ? "수정 완료" : "확인"}
      open={open}
      onOpenChange={onOpenChange}
      showInDialog={true}
      maxWidth="600px"
    />
  )
}
