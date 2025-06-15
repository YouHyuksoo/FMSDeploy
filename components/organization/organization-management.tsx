"use client"

import { useState, useEffect } from "react"
import { DataTable, type Column, type DataTableAction } from "@/components/common/data-table"
import { OrganizationForm } from "./organization-form"
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
import type { Organization, OrganizationFormData } from "@/types/organization"
import { mockOrganizations } from "@/lib/mock-data/organizations"
import type { ExportColumn, ImportColumn } from "@/lib/utils/export-utils"
import { Building2, Users, UserCheck, Edit, Trash2, Eye } from "lucide-react"
import { useTranslation } from "@/lib/language-context"

export function OrganizationManagement() {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<"create" | "edit">("create")
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | undefined>()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [organizationToDelete, setOrganizationToDelete] = useState<Organization | undefined>()
  const [importExportOpen, setImportExportOpen] = useState(false)
  const [selectedRows, setSelectedRows] = useState<Organization[]>([])
  const { toast } = useToast()
  const { t } = useTranslation("organization")
  const { t: tCommon } = useTranslation("common")

  useEffect(() => {
    loadOrganizations()
  }, [])

  const loadOrganizations = async () => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setOrganizations(mockOrganizations)
    } catch (error) {
      toast({
        title: "오류",
        description: "조직 목록을 불러오는데 실패했습니다.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getParentOptions = () => {
    return organizations
      .filter((org) => org.type !== "team")
      .map((org) => ({
        id: org.id,
        name: org.name,
        level: org.level,
      }))
      .sort((a, b) => a.level - b.level)
  }

  const handleAdd = () => {
    setSelectedOrganization(undefined)
    setFormMode("create")
    setFormOpen(true)
  }

  const handleEdit = (organization: Organization) => {
    setSelectedOrganization(organization)
    setFormMode("edit")
    setFormOpen(true)
  }

  const handleView = (organization: Organization) => {
    setSelectedOrganization(organization)
    setFormMode("view")
    setFormOpen(true)
  }

  const handleDelete = (organization: Organization) => {
    setOrganizationToDelete(organization)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!organizationToDelete) return

    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setOrganizations((prev) => prev.filter((org) => org.id !== organizationToDelete.id))
      toast({
        title: "성공",
        description: "조직이 삭제되었습니다.",
      })
    } catch (error) {
      toast({
        title: "오류",
        description: "조직 삭제에 실패했습니다.",
        variant: "destructive",
      })
    } finally {
      setDeleteDialogOpen(false)
      setOrganizationToDelete(undefined)
    }
  }

  const handleFormSubmit = async (data: OrganizationFormData) => {
    try {
      if (formMode === "create") {
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const newOrganization: Organization = {
          id: Date.now().toString(),
          ...data,
          parentName: data.parentId ? organizations.find((org) => org.id === data.parentId)?.name : undefined,
          level: data.parentId ? (organizations.find((org) => org.id === data.parentId)?.level || 0) + 1 : 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: "current-user",
          updatedBy: "current-user",
        }

        setOrganizations((prev) => [...prev, newOrganization])
        toast({
          title: "성공",
          description: "조직이 추가되었습니다.",
        })
      } else if (formMode === "edit") {
        await new Promise((resolve) => setTimeout(resolve, 1000))

        setOrganizations((prev) =>
          prev.map((org) =>
            org.id === selectedOrganization?.id
              ? {
                  ...org,
                  ...data,
                  parentName: data.parentId ? organizations.find((o) => o.id === data.parentId)?.name : undefined,
                  level: data.parentId ? (organizations.find((o) => o.id === data.parentId)?.level || 0) + 1 : 1,
                  updatedAt: new Date().toISOString(),
                  updatedBy: "current-user",
                }
              : org,
          ),
        )

        toast({
          title: "성공",
          description: "조직이 수정되었습니다.",
        })
      }
    } catch (error) {
      toast({
        title: "오류",
        description: `조직 ${formMode === "create" ? "추가" : "수정"}에 실패했습니다.`,
        variant: "destructive",
      })
      throw error
    }
  }

  const handleImportComplete = async (importedData: Organization[]) => {
    try {
      // 실제로는 API 호출
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setOrganizations((prev) => [...prev, ...importedData])
      toast({
        title: "성공",
        description: `${importedData.length}개의 조직이 가져오기 되었습니다.`,
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "company":
        return <Building2 className="h-4 w-4" />
      case "department":
        return <Users className="h-4 w-4" />
      case "team":
        return <UserCheck className="h-4 w-4" />
      default:
        return null
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "company":
        return "회사"
      case "department":
        return "부서"
      case "team":
        return "팀"
      default:
        return type
    }
  }

  const columns: Column<Organization>[] = [
    {
      key: "code",
      title: t("code"),
      width: "w-32",
      sortable: true,
      searchable: true,
      filterable: true,
    },
    {
      key: "name",
      title: t("name"),
      sortable: true,
      searchable: true,
      filterable: true,
      render: (value, record) => (
        <div className="flex items-center gap-2">
          {"  ".repeat(record.level - 1)}
          {getTypeIcon(record.type)}
          <span className="font-medium">{value}</span>
        </div>
      ),
    },
    {
      key: "type",
      title: t("type"),
      width: "w-20",
      sortable: true,
      filterable: true,
      filterOptions: [
        { label: "회사", value: "company" },
        { label: "부서", value: "department" },
        { label: "팀", value: "team" },
      ],
      render: (value) => <Badge variant="outline">{getTypeLabel(value)}</Badge>,
    },
    {
      key: "parentName",
      title: t("parent_name"),
      searchable: true,
      filterable: true,
      render: (value) => value || "-",
    },
    {
      key: "sortOrder",
      title: t("sort_order"),
      width: "w-16",
      sortable: true,
      align: "center",
    },
    {
      key: "isActive",
      title: t("is_active"),
      width: "w-20",
      sortable: true,
      filterable: true,
      filterOptions: [
        { label: "활성", value: true },
        { label: "비활성", value: false },
      ],
      render: (value) => <Badge variant={value ? "default" : "secondary"}>{value ? "활성" : "비활성"}</Badge>,
    },
    {
      key: "updatedAt",
      title: t("updated_at"),
      width: "w-40",
      sortable: true,
      render: (value) => new Date(value).toLocaleString("ko-KR"),
    },
  ]

  const actions: DataTableAction<Organization>[] = [
    {
      key: "view",
      label: "보기",
      icon: Eye,
      onClick: handleView,
    },
    {
      key: "edit",
      label: "수정",
      icon: Edit,
      onClick: handleEdit,
    },
    {
      key: "delete",
      label: "삭제",
      icon: Trash2,
      onClick: handleDelete,
      variant: "destructive",
    },
  ]

  // Export/Import 설정
  const exportColumns: ExportColumn[] = [
    { key: "code", title: "조직코드", width: 15 },
    { key: "name", title: "조직명", width: 25 },
    { key: "type", title: "유형", width: 10, format: (value) => getTypeLabel(value) },
    { key: "parentName", title: "상위조직", width: 25 },
    { key: "description", title: "설명", width: 30 },
    { key: "sortOrder", title: "정렬순서", width: 10 },
    { key: "isActive", title: "활성상태", width: 10, format: (value) => (value ? "Y" : "N") },
    { key: "createdAt", title: "생성일시", width: 20, format: (value) => new Date(value).toLocaleString("ko-KR") },
  ]

  const importColumns: ImportColumn[] = [
    { key: "code", title: "조직코드", required: true, type: "string" },
    { key: "name", title: "조직명", required: true, type: "string" },
    {
      key: "type",
      title: "유형",
      required: true,
      type: "string",
      validate: (value) =>
        !["company", "department", "team"].includes(value)
          ? "유형은 company, department, team 중 하나여야 합니다."
          : null,
    },
    { key: "parentName", title: "상위조직", type: "string" },
    { key: "description", title: "설명", type: "string" },
    { key: "sortOrder", title: "정렬순서", type: "number" },
    { key: "isActive", title: "활성상태", type: "boolean" },
  ]

  const sampleData = [
    {
      code: "ABC-SAMPLE",
      name: "샘플부서",
      type: "department",
      parentName: "ABC 제조",
      description: "샘플 부서입니다",
      sortOrder: 1,
      isActive: true,
    },
  ]

  return (
    <div className="space-y-6">
      <DataTable
        data={organizations}
        columns={columns}
        actions={actions}
        onAdd={handleAdd}
        loading={loading}
        title={t("title")}
        subtitle={t("subtitle")}
        searchPlaceholder="조직코드, 조직명으로 검색..."
        addButtonText={t("add_organization")}
        selectable={true}
        selectedRows={selectedRows}
        onSelectedRowsChange={setSelectedRows}
        showFilter={true}
        showExport={true}
        showImport={true}
        onExport={() => setImportExportOpen(true)}
        onImport={() => setImportExportOpen(true)}
        stickyHeader={true}
      />

      <OrganizationForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleFormSubmit}
        initialData={selectedOrganization}
        parentOptions={getParentOptions()}
        mode={formMode}
      />

      <ImportExportDialog
        open={importExportOpen}
        onOpenChange={setImportExportOpen}
        title="조직"
        exportColumns={exportColumns}
        importColumns={importColumns}
        exportData={selectedRows.length > 0 ? selectedRows : organizations}
        onImportComplete={handleImportComplete}
        exportOptions={{ filename: "organizations" }}
        sampleData={sampleData}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>조직 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              "{organizationToDelete?.name}" 조직을 삭제하시겠습니까?
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
