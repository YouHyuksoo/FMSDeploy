"use client"

import { useState, useEffect, useMemo } from "react"
import { StandardForm, type FormField, type FormGroup } from "@/components/common/standard-form"
import type { User, UserFormData } from "@/types/user"
import { mockOrganizations } from "@/lib/mock-data/organizations"

interface UserFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: UserFormData) => Promise<void>
  initialData?: User
  mode: "create" | "edit" | "view"
}

const levelOptions = [
  { label: "관리자", value: "admin" },
  { label: "매니저", value: "manager" },
  { label: "사용자", value: "user" },
  { label: "조회자", value: "viewer" },
]

const permissionOptions = [
  { label: "설비 조회", value: "equipment.read" },
  { label: "설비 관리", value: "equipment.all" },
  { label: "보전 조회", value: "maintenance.read" },
  { label: "보전 관리", value: "maintenance.all" },
  { label: "점검 조회", value: "inspection.read" },
  { label: "점검 관리", value: "inspection.all" },
  { label: "시스템 관리", value: "system.all" },
  { label: "전체 권한", value: "all" },
]

export function UserForm({ open, onOpenChange, onSubmit, initialData, mode }: UserFormProps) {
  const [companyOptions, setCompanyOptions] = useState<Array<{ label: string; value: string }>>([])
  const [departmentOptions, setDepartmentOptions] = useState<Array<{ label: string; value: string }>>([])

  useEffect(() => {
    // 회사 옵션 설정
    const companies = mockOrganizations
      .filter((org) => org.type === "company")
      .map((org) => ({ label: org.name, value: org.id }))
    setCompanyOptions(companies)

    // 부서 옵션 설정
    const departments = mockOrganizations
      .filter((org) => org.type === "department" || org.type === "team")
      .map((org) => ({ label: org.name, value: org.id }))
    setDepartmentOptions(departments)
  }, [])

  const validatePassword = (value: any, formData: Record<string, any>) => {
    if (mode === "create" && !value) {
      return "비밀번호는 필수입니다."
    }
    if (value && value.length < 6) {
      return "비밀번호는 6자 이상이어야 합니다."
    }
    return null
  }

  const validateConfirmPassword = (value: any, formData: Record<string, any>) => {
    if (formData.password && value !== formData.password) {
      return "비밀번호가 일치하지 않습니다."
    }
    return null
  }

  const validateUsername = (value: any) => {
    if (!value) return "사용자 ID는 필수입니다."
    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      return "사용자 ID는 영문, 숫자, _만 사용 가능합니다."
    }
    if (value.length < 3) {
      return "사용자 ID는 3자 이상이어야 합니다."
    }
    return null
  }

  const formFields: FormField[] = useMemo(
    () => [
      // 기본 정보 그룹
      {
        name: "username",
        label: "사용자 ID",
        type: "text",
        required: true,
        placeholder: "영문, 숫자, _ 사용 가능",
        disabled: mode === "edit", // 수정 시 ID 변경 불가
        validation: { custom: validateUsername },
        group: "basic",
        gridColumn: "md:col-span-1",
      },
      {
        name: "name",
        label: "이름",
        type: "text",
        required: true,
        placeholder: "사용자 이름을 입력하세요",
        group: "basic",
        gridColumn: "md:col-span-1",
      },
      {
        name: "email",
        label: "이메일",
        type: "email",
        required: true,
        placeholder: "user@example.com",
        group: "basic",
        gridColumn: "md:col-span-1",
      },
      {
        name: "phone",
        label: "전화번호",
        type: "text",
        placeholder: "010-1234-5678",
        group: "basic",
        gridColumn: "md:col-span-1",
      },

      // 조직 정보 그룹
      {
        name: "companyId",
        label: "회사",
        type: "select",
        required: true,
        options: companyOptions,
        group: "organization",
        gridColumn: "md:col-span-1",
      },
      {
        name: "departmentId",
        label: "부서",
        type: "select",
        required: true,
        options: departmentOptions,
        group: "organization",
        gridColumn: "md:col-span-1",
      },
      {
        name: "position",
        label: "직책",
        type: "text",
        required: true,
        placeholder: "팀장, 과장, 기사 등",
        group: "organization",
        gridColumn: "md:col-span-1",
      },
      {
        name: "level",
        label: "사용자 레벨",
        type: "select",
        required: true,
        options: levelOptions,
        group: "organization",
        gridColumn: "md:col-span-1",
      },

      // 보안 정보 그룹 (생성 시에만 표시)
      {
        name: "password",
        label: "비밀번호",
        type: "password",
        required: mode === "create",
        placeholder: "6자 이상 입력하세요",
        validation: { custom: validatePassword },
        group: "security",
        gridColumn: "md:col-span-1",
        hidden: mode === "view",
      },
      {
        name: "confirmPassword",
        label: "비밀번호 확인",
        type: "password",
        required: mode === "create",
        placeholder: "비밀번호를 다시 입력하세요",
        validation: { custom: validateConfirmPassword },
        dependsOn: "password",
        group: "security",
        gridColumn: "md:col-span-1",
        hidden: mode === "view",
      },

      // 권한 정보 그룹
      {
        name: "permissions",
        label: "권한",
        type: "multiselect",
        options: permissionOptions,
        description: "사용자가 접근할 수 있는 기능을 선택하세요",
        group: "permissions",
        gridColumn: "md:col-span-2",
      },

      // 상태 정보 그룹
      {
        name: "isActive",
        label: "활성 상태",
        type: "switch",
        defaultValue: true,
        description: "비활성화 시 로그인할 수 없습니다",
        group: "status",
        gridColumn: "md:col-span-2",
      },
    ],
    [companyOptions, departmentOptions, mode],
  )

  const formGroups: FormGroup[] = [
    {
      name: "basic",
      title: "기본 정보",
      description: "사용자의 기본 정보를 입력하세요",
    },
    {
      name: "organization",
      title: "조직 정보",
      description: "사용자가 속한 조직과 역할을 설정하세요",
    },
    {
      name: "security",
      title: "보안 정보",
      description: "로그인에 필요한 보안 정보를 설정하세요",
    },
    {
      name: "permissions",
      title: "권한 설정",
      description: "사용자가 사용할 수 있는 기능을 설정하세요",
    },
    {
      name: "status",
      title: "상태 설정",
      description: "사용자 계정의 상태를 설정하세요",
    },
  ]

  const handleSubmit = async (data: Record<string, any>) => {
    // confirmPassword 제거
    const { confirmPassword, ...submitData } = data

    // 조직 정보 매핑
    const company = mockOrganizations.find((org) => org.id === data.companyId)
    const department = mockOrganizations.find((org) => org.id === data.departmentId)

    const userFormData: UserFormData = {
      ...submitData,
      company: company?.name || "",
      department: department?.name || "",
    }

    await onSubmit(userFormData)
  }

  const getInitialData = () => {
    if (!initialData) return {}

    return {
      username: initialData.username,
      name: initialData.name,
      email: initialData.email,
      phone: initialData.phone,
      companyId: initialData.companyId,
      departmentId: initialData.departmentId,
      position: initialData.position,
      level: initialData.level,
      permissions: initialData.permissions || [],
      isActive: initialData.isActive,
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
      title={mode === "create" ? "사용자 추가" : mode === "edit" ? "사용자 수정" : "사용자 정보"}
      description={
        mode === "create"
          ? "새로운 사용자를 추가합니다."
          : mode === "edit"
            ? "사용자 정보를 수정합니다."
            : "사용자 정보를 확인합니다."
      }
      submitText={mode === "create" ? "사용자 추가" : mode === "edit" ? "수정 완료" : "확인"}
      open={open}
      onOpenChange={onOpenChange}
      showInDialog={true}
      layout="tabs"
      maxWidth="900px"
      showValidationSummary={true}
    />
  )
}
