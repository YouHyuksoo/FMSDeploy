"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/common/data-table"
import { ImportExportDialog } from "@/components/common/import-export-dialog"
import { TPMTeamForm } from "./tpm-team-form"
import { mockTPMTeams } from "@/lib/mock-data/tpm"
import { useTranslation } from "@/lib/language-context"
import { useToast } from "@/hooks/use-toast"
import { Plus, FileUp, Users, Target, Calendar, MapPin } from "lucide-react"
import type { TPMTeam, TPMTeamFormData } from "@/types/tpm"
import type { ColumnDef } from "@tanstack/react-table"

export function TPMTeamManagement() {
  const { t } = useTranslation("tpm")
  const { t: tCommon } = useTranslation("common")
  const { toast } = useToast()
  const [teams, setTeams] = useState<TPMTeam[]>(mockTPMTeams)
  const [selectedTeam, setSelectedTeam] = useState<TPMTeam | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<"create" | "edit" | "view">("create")
  const [importExportOpen, setImportExportOpen] = useState(false)

  const columns: ColumnDef<TPMTeam>[] = [
    {
      accessorKey: "code",
      header: "분임조 코드",
      cell: ({ row }) => <div className="font-medium">{row.getValue("code")}</div>,
    },
    {
      accessorKey: "name",
      header: "분임조명",
      cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "department",
      header: "소속 부서",
    },
    {
      accessorKey: "leaderName",
      header: "분임조장",
    },
    {
      accessorKey: "members",
      header: "구성원 수",
      cell: ({ row }) => {
        const members = row.getValue("members") as TPMTeam["members"]
        return (
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {members.length}명
          </div>
        )
      },
    },
    {
      accessorKey: "equipmentArea",
      header: "담당 구역",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          {row.getValue("equipmentArea")}
        </div>
      ),
    },
    {
      accessorKey: "meetingDay",
      header: "정기 모임",
      cell: ({ row }) => {
        const team = row.original
        return (
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {team.meetingDay} {team.meetingTime}
          </div>
        )
      },
    },
    {
      accessorKey: "status",
      header: "상태",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return (
          <Badge variant={status === "active" ? "default" : "secondary"}>
            {status === "active" ? "활성" : "비활성"}
          </Badge>
        )
      },
    },
    {
      accessorKey: "establishedDate",
      header: "설립일",
    },
  ]

  const handleCreate = () => {
    setSelectedTeam(null)
    setFormMode("create")
    setFormOpen(true)
  }

  const handleEdit = (team: TPMTeam) => {
    setSelectedTeam(team)
    setFormMode("edit")
    setFormOpen(true)
  }

  const handleView = (team: TPMTeam) => {
    setSelectedTeam(team)
    setFormMode("view")
    setFormOpen(true)
  }

  const handleDelete = async (team: TPMTeam) => {
    try {
      setTeams(teams.filter((t) => t.id !== team.id))
      toast({
        title: "분임조 삭제 완료",
        description: `${team.name}이(가) 삭제되었습니다.`,
      })
    } catch (error) {
      toast({
        title: "삭제 실패",
        description: "분임조 삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (data: TPMTeamFormData) => {
    try {
      if (formMode === "create") {
        const newTeam: TPMTeam = {
          id: `temp-${Date.now()}`,
          ...data,
          status: "active",
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: "current-user",
          updatedBy: "current-user",
        }
        setTeams([...teams, newTeam])
        toast({
          title: "분임조 등록 완료",
          description: `${data.name}이(가) 등록되었습니다.`,
        })
      } else if (formMode === "edit" && selectedTeam) {
        const updatedTeam: TPMTeam = {
          ...selectedTeam,
          ...data,
          updatedAt: new Date().toISOString(),
          updatedBy: "current-user",
        }
        setTeams(teams.map((t) => (t.id === selectedTeam.id ? updatedTeam : t)))
        toast({
          title: "분임조 수정 완료",
          description: `${data.name}이(가) 수정되었습니다.`,
        })
      }
      setFormOpen(false)
    } catch (error) {
      toast({
        title: "저장 실패",
        description: "분임조 정보 저장 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  const handleImportComplete = async (data: TPMTeam[]) => {
    try {
      setTeams([...teams, ...data])
      toast({
        title: "가져오기 완료",
        description: `${data.length}개의 TPM 분임조가 가져와졌습니다.`,
      })
    } catch (error) {
      toast({
        title: "가져오기 실패",
        description: "데이터 가져오기 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  // Export/Import 컬럼 정의
  const exportColumns = [
    { key: "code", title: "분임조코드", width: 15 },
    { key: "name", title: "분임조명", width: 20 },
    { key: "department", title: "소속부서", width: 15 },
    { key: "leaderName", title: "분임조장", width: 15 },
    { key: "facilitatorName", title: "촉진자", width: 15 },
    { key: "secretaryName", title: "간사", width: 15 },
    { key: "equipmentArea", title: "담당구역", width: 20 },
    { key: "meetingDay", title: "정기모임요일", width: 12 },
    { key: "meetingTime", title: "정기모임시간", width: 12 },
    { key: "meetingLocation", title: "모임장소", width: 15 },
    { key: "status", title: "상태", width: 10 },
    { key: "establishedDate", title: "설립일", width: 12 },
  ]

  const importColumns = [
    { key: "code", title: "분임조코드", required: true },
    { key: "name", title: "분임조명", required: true },
    { key: "department", title: "소속부서", required: true },
    { key: "leaderName", title: "분임조장", required: true },
    { key: "facilitatorName", title: "촉진자", required: false },
    { key: "secretaryName", title: "간사", required: false },
    { key: "equipmentArea", title: "담당구역", required: true },
    { key: "meetingDay", title: "정기모임요일", required: true },
    { key: "meetingTime", title: "정기모임시간", required: true },
    { key: "meetingLocation", title: "모임장소", required: false },
    { key: "establishedDate", title: "설립일", required: true },
  ]

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">TPM 분임조 관리</h1>
          <p className="text-muted-foreground">TPM 활동을 수행하는 분임조를 관리합니다.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setImportExportOpen(true)}>
            <FileUp className="mr-2 h-4 w-4" />
            가져오기/내보내기
          </Button>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            분임조 등록
          </Button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">전체 분임조</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teams.length}</div>
            <p className="text-xs text-muted-foreground">활성: {teams.filter((t) => t.status === "active").length}개</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 구성원</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teams.reduce((sum, team) => sum + team.members.length, 0)}</div>
            <p className="text-xs text-muted-foreground">
              평균 {Math.round(teams.reduce((sum, team) => sum + team.members.length, 0) / teams.length)}명/분임조
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">담당 설비</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {teams.reduce((sum, team) => sum + team.targetEquipments.length, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              평균 {Math.round(teams.reduce((sum, team) => sum + team.targetEquipments.length, 0) / teams.length)}
              대/분임조
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">이번 달 모임</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teams.filter((t) => t.status === "active").length * 4}</div>
            <p className="text-xs text-muted-foreground">주 1회 정기 모임</p>
          </CardContent>
        </Card>
      </div>

      {/* 데이터 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle>분임조 목록</CardTitle>
          <CardDescription>등록된 TPM 분임조 목록을 확인하고 관리할 수 있습니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={teams}
            searchKey="name"
            searchPlaceholder="분임조명으로 검색..."
            onEdit={handleEdit}
            onView={handleView}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      {/* 분임조 폼 다이얼로그 */}
      <TPMTeamForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmit}
        initialData={selectedTeam || undefined}
        mode={formMode}
      />

      {/* 가져오기/내보내기 다이얼로그 */}
      <ImportExportDialog
        open={importExportOpen}
        onOpenChange={setImportExportOpen}
        title="TPM 분임조"
        exportColumns={exportColumns}
        importColumns={importColumns}
        exportData={teams}
        onImportComplete={handleImportComplete}
        exportOptions={{ filename: "TPM_분임조_목록" }}
        sampleData={[
          {
            code: "TPM-TEAM-001",
            name: "A팀",
            department: "생산부",
            leaderName: "김팀장",
            facilitatorName: "이촉진자",
            secretaryName: "박간사",
            equipmentArea: "생산라인 1",
            meetingDay: "화요일",
            meetingTime: "17:00",
            meetingLocation: "회의실 A",
            establishedDate: "2024-01-01",
          },
        ]}
      />
    </div>
  )
}
