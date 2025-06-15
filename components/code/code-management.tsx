"use client"

import { useState, useEffect } from "react"
import { DataTable, type Column, type DataTableAction } from "@/components/common/data-table"
import { CodeGroupForm } from "./code-group-form"
import { CodeForm } from "./code-form"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import type { CodeGroup, Code, CodeGroupFormData, CodeFormData } from "@/types/code"
import { mockCodeGroups, mockCodes } from "@/lib/mock-data/codes"
import { Edit, Trash2, Eye, Plus, FolderOpen, Code2, Settings, Hash } from "lucide-react"

export function CodeManagement() {
  const [codeGroups, setCodeGroups] = useState<CodeGroup[]>([])
  const [codes, setCodes] = useState<Code[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("groups")
  const [selectedGroupId, setSelectedGroupId] = useState<string>("")

  // 그룹 관련 상태
  const [groupFormOpen, setGroupFormOpen] = useState(false)
  const [groupFormMode, setGroupFormMode] = useState<"create" | "edit" | "view">("create")
  const [selectedGroup, setSelectedGroup] = useState<CodeGroup | undefined>()
  const [groupDeleteDialogOpen, setGroupDeleteDialogOpen] = useState(false)
  const [groupToDelete, setGroupToDelete] = useState<CodeGroup | undefined>()

  // 코드 관련 상태
  const [codeFormOpen, setCodeFormOpen] = useState(false)
  const [codeFormMode, setCodeFormMode] = useState<"create" | "edit" | "view">("create")
  const [selectedCode, setSelectedCode] = useState<Code | undefined>()
  const [codeDeleteDialogOpen, setCodeDeleteDialogOpen] = useState(false)
  const [codeToDelete, setCodeToDelete] = useState<Code | undefined>()

  // Import/Export 상태
  const [importExportOpen, setImportExportOpen] = useState(false)
  const [importExportType, setImportExportType] = useState<"groups" | "codes">("groups")

  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setCodeGroups(mockCodeGroups)
      setCodes(mockCodes)
    } catch (error) {
      toast({
        title: "오류",
        description: "데이터를 불러오는데 실패했습니다.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // 그룹 관련 핸들러
  const handleGroupAdd = () => {
    setSelectedGroup(undefined)
    setGroupFormMode("create")
    setGroupFormOpen(true)
  }

  const handleGroupEdit = (group: CodeGroup) => {
    setSelectedGroup(group)
    setGroupFormMode("edit")
    setGroupFormOpen(true)
  }

  const handleGroupView = (group: CodeGroup) => {
    setSelectedGroup(group)
    setGroupFormMode("view")
    setGroupFormOpen(true)
  }

  const handleGroupDelete = (group: CodeGroup) => {
    setGroupToDelete(group)
    setGroupDeleteDialogOpen(true)
  }

  const handleGroupManageCodes = (group: CodeGroup) => {
    setSelectedGroupId(group.id)
    setActiveTab("codes")
  }

  const confirmGroupDelete = async () => {
    if (!groupToDelete) return

    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setCodeGroups((prev) => prev.filter((group) => group.id !== groupToDelete.id))
      setCodes((prev) => prev.filter((code) => code.groupId !== groupToDelete.id))
      toast({
        title: "성공",
        description: "코드 그룹이 삭제되었습니다.",
      })
    } catch (error) {
      toast({
        title: "오류",
        description: "코드 그룹 삭제에 실패했습니다.",
        variant: "destructive",
      })
    } finally {
      setGroupDeleteDialogOpen(false)
      setGroupToDelete(undefined)
    }
  }

  const handleGroupFormSubmit = async (data: CodeGroupFormData) => {
    try {
      if (groupFormMode === "create") {
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const newGroup: CodeGroup = {
          id: Date.now().toString(),
          ...data,
          codeCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: "current-user",
          updatedBy: "current-user",
        }

        setCodeGroups((prev) => [...prev, newGroup])
        toast({
          title: "성공",
          description: "코드 그룹이 추가되었습니다.",
        })
      } else if (groupFormMode === "edit") {
        await new Promise((resolve) => setTimeout(resolve, 1000))

        setCodeGroups((prev) =>
          prev.map((group) =>
            group.id === selectedGroup?.id
              ? {
                  ...group,
                  ...data,
                  updatedAt: new Date().toISOString(),
                  updatedBy: "current-user",
                }
              : group,
          ),
        )

        toast({
          title: "성공",
          description: "코드 그룹이 수정되었습니다.",
        })
      }
    } catch (error) {
      toast({
        title: "오류",
        description: `코드 그룹 ${groupFormMode === "create" ? "추가" : "수정"}에 실패했습니다.`,
        variant: "destructive",
      })
      throw error
    }
  }

  // 코드 관련 핸들러
  const handleCodeAdd = () => {
    setSelectedCode(undefined)
    setCodeFormMode("create")
    setCodeFormOpen(true)
  }

  const handleCodeEdit = (code: Code) => {
    setSelectedCode(code)
    setCodeFormMode("edit")
    setCodeFormOpen(true)
  }

  const handleCodeView = (code: Code) => {
    setSelectedCode(code)
    setCodeFormMode("view")
    setCodeFormOpen(true)
  }

  const handleCodeDelete = (code: Code) => {
    setCodeToDelete(code)
    setCodeDeleteDialogOpen(true)
  }

  const confirmCodeDelete = async () => {
    if (!codeToDelete) return

    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setCodes((prev) => prev.filter((code) => code.id !== codeToDelete.id))

      // 그룹의 코드 수 업데이트
      setCodeGroups((prev) =>
        prev.map((group) =>
          group.id === codeToDelete.groupId ? { ...group, codeCount: (group.codeCount || 0) - 1 } : group,
        ),
      )

      toast({
        title: "성공",
        description: "코드가 삭제되었습니다.",
      })
    } catch (error) {
      toast({
        title: "오류",
        description: "코드 삭제에 실패했습니다.",
        variant: "destructive",
      })
    } finally {
      setCodeDeleteDialogOpen(false)
      setCodeToDelete(undefined)
    }
  }

  const handleCodeFormSubmit = async (data: CodeFormData) => {
    try {
      if (codeFormMode === "create") {
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const group = codeGroups.find((g) => g.id === data.groupId)
        const parentCode = codes.find((c) => c.code === data.parentCode)

        const newCode: Code = {
          id: Date.now().toString(),
          ...data,
          groupCode: group?.groupCode || "",
          groupName: group?.groupName || "",
          parentName: parentCode?.name,
          level: parentCode ? parentCode.level + 1 : 1,
          isSystem: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: "current-user",
          updatedBy: "current-user",
        }

        setCodes((prev) => [...prev, newCode])

        // 그룹의 코드 수 업데이트
        setCodeGroups((prev) =>
          prev.map((group) =>
            group.id === data.groupId ? { ...group, codeCount: (group.codeCount || 0) + 1 } : group,
          ),
        )

        toast({
          title: "성공",
          description: "코드가 추가되었습니다.",
        })
      } else if (codeFormMode === "edit") {
        await new Promise((resolve) => setTimeout(resolve, 1000))

        setCodes((prev) =>
          prev.map((code) =>
            code.id === selectedCode?.id
              ? {
                  ...code,
                  ...data,
                  updatedAt: new Date().toISOString(),
                  updatedBy: "current-user",
                }
              : code,
          ),
        )

        toast({
          title: "성공",
          description: "코드가 수정되었습니다.",
        })
      }
    } catch (error) {
      toast({
        title: "오류",
        description: `코드 ${codeFormMode === "create" ? "추가" : "수정"}에 실패했습니다.`,
        variant: "destructive",
      })
      throw error
    }
  }

  // 필터링된 코드 목록
  const filteredCodes = selectedGroupId ? codes.filter((code) => code.groupId === selectedGroupId) : codes

  // 상위 코드 목록 (계층 구조용)
  const parentCodes = selectedGroupId ? codes.filter((code) => code.groupId === selectedGroupId) : codes

  // 그룹 테이블 컬럼
  const groupColumns: Column<CodeGroup>[] = [
    {
      key: "groupCode",
      title: "그룹코드",
      width: "w-32",
      sortable: true,
      searchable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <Hash className="h-4 w-4 text-muted-foreground" />
          <span className="font-mono font-medium">{value}</span>
        </div>
      ),
    },
    {
      key: "groupName",
      title: "그룹명",
      sortable: true,
      searchable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <FolderOpen className="h-4 w-4 text-blue-600" />
          <span className="font-medium">{value}</span>
        </div>
      ),
    },
    {
      key: "description",
      title: "설명",
      render: (value) => value || "-",
    },
    {
      key: "codeCount",
      title: "코드 수",
      width: "w-20",
      sortable: true,
      align: "center",
      render: (value) => (
        <Badge variant="secondary" className="font-mono">
          {value || 0}
        </Badge>
      ),
    },
    {
      key: "sortOrder",
      title: "순서",
      width: "w-16",
      sortable: true,
      align: "center",
    },
    {
      key: "isActive",
      title: "상태",
      width: "w-20",
      sortable: true,
      filterable: true,
      filterOptions: [
        { label: "활성", value: true },
        { label: "비활성", value: false },
      ],
      render: (value) => <Badge variant={value ? "default" : "secondary"}>{value ? "활성" : "비활성"}</Badge>,
    },
  ]

  // 코드 테이블 컬럼
  const codeColumns: Column<Code>[] = [
    {
      key: "code",
      title: "코드",
      width: "w-32",
      sortable: true,
      searchable: true,
      render: (value, record) => (
        <div className="flex items-center gap-2">
          {"  ".repeat(record.level - 1)}
          <Code2 className="h-4 w-4 text-muted-foreground" />
          <span className="font-mono font-medium">{value}</span>
        </div>
      ),
    },
    {
      key: "name",
      title: "코드명",
      sortable: true,
      searchable: true,
      render: (value, record) => (
        <div className="flex items-center gap-2">
          {record.attributes?.color && (
            <div className="w-3 h-3 rounded-full border" style={{ backgroundColor: record.attributes.color }} />
          )}
          <span className="font-medium">{value}</span>
          {record.isSystem && <Badge variant="outline">시스템</Badge>}
        </div>
      ),
    },
    {
      key: "value",
      title: "값",
      render: (value) => (value ? <span className="font-mono text-sm">{value}</span> : "-"),
    },
    {
      key: "parentName",
      title: "상위코드",
      render: (value) => value || "-",
    },
    {
      key: "sortOrder",
      title: "순서",
      width: "w-16",
      sortable: true,
      align: "center",
    },
    {
      key: "isActive",
      title: "상태",
      width: "w-20",
      sortable: true,
      filterable: true,
      filterOptions: [
        { label: "활성", value: true },
        { label: "비활성", value: false },
      ],
      render: (value) => <Badge variant={value ? "default" : "secondary"}>{value ? "활성" : "비활성"}</Badge>,
    },
  ]

  // 그룹 액션
  const groupActions: DataTableAction<CodeGroup>[] = [
    {
      key: "view",
      label: "보기",
      icon: Eye,
      onClick: handleGroupView,
    },
    {
      key: "edit",
      label: "수정",
      icon: Edit,
      onClick: handleGroupEdit,
    },
    {
      key: "manage-codes",
      label: "코드 관리",
      icon: Settings,
      onClick: handleGroupManageCodes,
    },
    {
      key: "delete",
      label: "삭제",
      icon: Trash2,
      onClick: handleGroupDelete,
      variant: "destructive",
      disabled: (group) => (group.codeCount || 0) > 0, // 코드가 있으면 삭제 불가
    },
  ]

  // 코드 액션
  const codeActions: DataTableAction<Code>[] = [
    {
      key: "view",
      label: "보기",
      icon: Eye,
      onClick: handleCodeView,
    },
    {
      key: "edit",
      label: "수정",
      icon: Edit,
      onClick: handleCodeEdit,
    },
    {
      key: "delete",
      label: "삭제",
      icon: Trash2,
      onClick: handleCodeDelete,
      variant: "destructive",
      disabled: (code) => code.isSystem, // 시스템 코드는 삭제 불가
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">기초코드 관리</h2>
        <p className="text-muted-foreground">시스템에서 사용하는 코드를 그룹별로 관리합니다</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="groups">코드 그룹</TabsTrigger>
          <TabsTrigger value="codes">
            코드 목록
            {selectedGroupId && (
              <Badge variant="secondary" className="ml-2">
                {codeGroups.find((g) => g.id === selectedGroupId)?.groupName}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="groups" className="space-y-4">
          <DataTable
            data={codeGroups}
            columns={groupColumns}
            actions={groupActions}
            onAdd={handleGroupAdd}
            loading={loading}
            title="코드 그룹 목록"
            searchPlaceholder="그룹코드, 그룹명으로 검색..."
            addButtonText="그룹 추가"
            showFilter={true}
            showExport={true}
            onExport={() => {
              setImportExportType("groups")
              setImportExportOpen(true)
            }}
          />
        </TabsContent>

        <TabsContent value="codes" className="space-y-4">
          {selectedGroupId && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FolderOpen className="h-5 w-5" />
                  {codeGroups.find((g) => g.id === selectedGroupId)?.groupName}
                </CardTitle>
                <CardDescription>{codeGroups.find((g) => g.id === selectedGroupId)?.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button onClick={() => setSelectedGroupId("")} variant="outline">
                    전체 코드 보기
                  </Button>
                  <Button onClick={handleCodeAdd}>
                    <Plus className="h-4 w-4 mr-2" />
                    코드 추가
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <DataTable
            data={filteredCodes}
            columns={codeColumns}
            actions={codeActions}
            onAdd={selectedGroupId ? handleCodeAdd : undefined}
            loading={loading}
            title={selectedGroupId ? undefined : "전체 코드 목록"}
            searchPlaceholder="코드, 코드명으로 검색..."
            addButtonText="코드 추가"
            showFilter={true}
            showExport={true}
            onExport={() => {
              setImportExportType("codes")
              setImportExportOpen(true)
            }}
          />
        </TabsContent>
      </Tabs>

      {/* 그룹 폼 */}
      <CodeGroupForm
        open={groupFormOpen}
        onOpenChange={setGroupFormOpen}
        onSubmit={handleGroupFormSubmit}
        initialData={selectedGroup}
        mode={groupFormMode}
      />

      {/* 코드 폼 */}
      <CodeForm
        open={codeFormOpen}
        onOpenChange={setCodeFormOpen}
        onSubmit={handleCodeFormSubmit}
        initialData={selectedCode}
        codeGroups={codeGroups}
        parentCodes={parentCodes}
        mode={codeFormMode}
        selectedGroupId={selectedGroupId}
      />

      {/* 그룹 삭제 확인 */}
      <AlertDialog open={groupDeleteDialogOpen} onOpenChange={setGroupDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>코드 그룹 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              "{groupToDelete?.groupName}" 그룹을 삭제하시겠습니까?
              <br />이 작업은 되돌릴 수 없으며, 그룹에 속한 모든 코드가 함께 삭제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={confirmGroupDelete} className="bg-red-600 hover:bg-red-700">
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 코드 삭제 확인 */}
      <AlertDialog open={codeDeleteDialogOpen} onOpenChange={setCodeDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>코드 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              "{codeToDelete?.name}" 코드를 삭제하시겠습니까?
              <br />이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCodeDelete} className="bg-red-600 hover:bg-red-700">
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
