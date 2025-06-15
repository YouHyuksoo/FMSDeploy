"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/common/data-table"
import {
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Edit,
  Trash2,
  Eye,
  ListChecks,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react"
import { type InspectionMaster, type InspectionMasterItem, PeriodType } from "@/types/inspection-master" // Ensure PeriodType is exported
import {
  mockInspectionMasters,
  mockEquipmentTypes,
  mockInspectionTypes,
  mockDepartments,
  mockUsers,
} from "@/lib/mock-data/inspection-master"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"

// Helper function to get today's date in YYYY-MM-DD format
const getTodayIsoDate = () => {
  return new Date().toISOString().split("T")[0]
}

export function TemplateMasterManagement() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [data, setData] = useState<InspectionMaster[]>(mockInspectionMasters)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false)

  const [currentMaster, setCurrentMaster] = useState<InspectionMaster | null>(null)
  const [currentItem, setCurrentItem] = useState<InspectionMasterItem | null>(null)
  const [itemFormMode, setItemFormMode] = useState<"create" | "edit">("create")

  const [masterFormData, setMasterFormData] = useState<Partial<InspectionMaster>>({})
  const [itemFormData, setItemFormData] = useState<Partial<InspectionMasterItem>>({})

  useEffect(() => {
    setData(mockInspectionMasters)
  }, [])

  const columns = [
    { key: "code", title: "템플릿코드", sortable: true, searchable: true, width: "120px" },
    { key: "name", title: "템플릿명", sortable: true, searchable: true, width: "200px" },
    { key: "equipmentType.name", title: "설비유형", sortable: true, width: "120px" },
    { key: "inspectionType.name", title: "점검유형", sortable: true, width: "120px" },
    {
      key: "periodType",
      title: "주기",
      sortable: true,
      width: "100px",
      render: (value: PeriodType, row: InspectionMaster) => {
        const periodTypeMap: Record<PeriodType, string> = {
          DAILY: "매일",
          WEEKLY: "매주",
          MONTHLY: "매월",
          QUARTERLY: "분기",
          SEMI_ANNUALLY: "반기",
          ANNUALLY: "매년",
          ON_DEMAND: "필요시",
          CUSTOM_DAYS: "일 지정",
          CUSTOM_WEEKS: "주 지정",
          CUSTOM_MONTHS: "월 지정",
          CUSTOM_YEARS: "년 지정",
        }
        return `${periodTypeMap[value] || value} (${row.periodValue || 1})`
      },
    },
    { key: "estimatedTime", title: "예상시간(분)", sortable: true, width: "120px", align: "right" as const },
    {
      key: "itemCount",
      title: "항목수",
      sortable: true,
      width: "80px",
      align: "right" as const,
      render: (value: number, row: InspectionMaster) => row.items?.length || 0,
    },
    {
      key: "isActive",
      title: "상태",
      sortable: true,
      width: "100px",
      render: (value: boolean) => <Badge variant={value ? "default" : "secondary"}>{value ? "활성" : "비활성"}</Badge>,
    },
    {
      key: "createdAt",
      title: "등록일",
      sortable: true,
      width: "120px",
      render: (value: string) => (value ? new Date(value).toLocaleDateString() : ""),
    },
  ]

  const handleEdit = (record: InspectionMaster) => {
    setCurrentMaster(record)
    setMasterFormData({
      ...record,
      effectiveDate: record.effectiveDate ? record.effectiveDate.split("T")[0] : getTodayIsoDate(),
      expiryDate: record.expiryDate ? record.expiryDate.split("T")[0] : undefined,
    })
    setIsEditDialogOpen(true)
  }

  const handleDelete = (record: InspectionMaster) => {
    toast({
      title: "삭제 확인",
      description: `${record.name} 템플릿을 삭제하시겠습니까?`,
      action: (
        <Button variant="destructive" onClick={() => confirmDelete(record.id)}>
          삭제
        </Button>
      ),
    })
  }

  const confirmDelete = (id: string) => {
    setData((prev) => prev.filter((item) => item.id !== id))
    toast({ title: "삭제 완료", description: "템플릿이 삭제되었습니다." })
  }

  const handleViewDetails = (record: InspectionMaster) => {
    setCurrentMaster(record)
    setIsDetailDialogOpen(true)
  }

  const actions = [
    { key: "view", label: "상세", icon: Eye, onClick: handleViewDetails },
    { key: "edit", label: "편집", icon: Edit, onClick: handleEdit },
    { key: "delete", label: "삭제", icon: Trash2, onClick: handleDelete, variant: "destructive" as const },
  ]

  const handleCreateNew = () => {
    setCurrentMaster(null)
    setMasterFormData({
      code: `TPL${String(data.length + 1).padStart(3, "0")}`,
      version: "1.0",
      isActive: true,
      effectiveDate: getTodayIsoDate(),
      items: [],
    })
    setIsCreateDialogOpen(true)
  }

  const handleSaveMaster = () => {
    const masterToSave = { ...masterFormData } as InspectionMaster

    // Convert related objects if only IDs are stored
    masterToSave.equipmentType =
      mockEquipmentTypes.find((et) => et.id === masterFormData.equipmentTypeId) || masterFormData.equipmentType
    masterToSave.inspectionType =
      mockInspectionTypes.find((it) => it.id === masterFormData.inspectionTypeId) || masterFormData.inspectionType
    masterToSave.department =
      mockDepartments.find((d) => d.id === masterFormData.departmentId) || masterFormData.department
    masterToSave.responsibleUser =
      mockUsers.find((u) => u.id === masterFormData.responsibleUserId) || masterFormData.responsibleUser
    masterToSave.createdBy = masterToSave.createdBy || mockUsers[0] // Default user
    masterToSave.updatedBy = mockUsers[0] // Default user
    masterToSave.createdAt = masterToSave.createdAt || new Date().toISOString()
    masterToSave.updatedAt = new Date().toISOString()
    masterToSave.items = masterToSave.items || []

    if (currentMaster && isEditDialogOpen) {
      // Editing existing
      masterToSave.id = currentMaster.id
      masterToSave.createdAt = currentMaster.createdAt // Preserve original creation date
      masterToSave.createdBy = currentMaster.createdBy // Preserve original creator
      setData((prev) => prev.map((item) => (item.id === masterToSave.id ? masterToSave : item)))
      toast({ title: "업데이트 완료", description: `${masterToSave.name} 템플릿이 업데이트되었습니다.` })
      setIsEditDialogOpen(false)
    } else {
      // Creating new
      masterToSave.id = masterToSave.id || `tpl_${Date.now()}`
      setData((prev) => [masterToSave, ...prev])
      toast({ title: "등록 완료", description: `${masterToSave.name} 템플릿이 등록되었습니다.` })
      setIsCreateDialogOpen(false)
    }
    setCurrentMaster(null)
    setMasterFormData({})
  }

  const handleMasterFormChange = (field: keyof InspectionMaster, value: any) => {
    setMasterFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Item Management
  const handleAddItem = () => {
    if (!currentMaster && !isCreateDialogOpen && !isEditDialogOpen) return // Should not happen if detail/edit dialog is open

    const targetMaster = isCreateDialogOpen || isEditDialogOpen ? masterFormData : currentMaster
    if (!targetMaster) return

    setCurrentItem(null)
    setItemFormData({
      id: `item_${Date.now()}`,
      sequence: (targetMaster.items?.length || 0) + 1,
      isRequired: true,
      dataType: "TEXT",
    })
    setItemFormMode("create")
    setIsItemDialogOpen(true)
  }

  const handleEditItem = (item: InspectionMasterItem) => {
    setCurrentItem(item)
    setItemFormData({ ...item })
    setItemFormMode("edit")
    setIsItemDialogOpen(true)
  }

  const handleDeleteItem = (itemId: string) => {
    const updater = (prevData: Partial<InspectionMaster>) => ({
      ...prevData,
      items:
        prevData.items?.filter((i) => i.id !== itemId).map((item, index) => ({ ...item, sequence: index + 1 })) || [],
    })

    if (isCreateDialogOpen || isEditDialogOpen) {
      setMasterFormData(updater)
    } else if (currentMaster) {
      const updatedMaster = updater(currentMaster) as InspectionMaster
      setCurrentMaster(updatedMaster) // For detail view
      setData((prev) => prev.map((m) => (m.id === updatedMaster.id ? updatedMaster : m))) // Update main list
    }
    toast({ title: "항목 삭제됨", description: "점검 항목이 삭제되었습니다." })
  }

  const handleSaveItem = () => {
    const itemToSave = { ...itemFormData } as InspectionMasterItem

    const updater = (prevData: Partial<InspectionMaster>) => {
      const items = prevData.items || []
      if (itemFormMode === "create") {
        return { ...prevData, items: [...items, itemToSave].sort((a, b) => (a.sequence || 0) - (b.sequence || 0)) }
      } else {
        return {
          ...prevData,
          items: items
            .map((i) => (i.id === itemToSave.id ? itemToSave : i))
            .sort((a, b) => (a.sequence || 0) - (b.sequence || 0)),
        }
      }
    }

    if (isCreateDialogOpen || isEditDialogOpen) {
      setMasterFormData(updater)
    } else if (currentMaster) {
      const updatedMaster = updater(currentMaster) as InspectionMaster
      setCurrentMaster(updatedMaster) // For detail view
      setData((prev) => prev.map((m) => (m.id === updatedMaster.id ? updatedMaster : m))) // Update main list
    }

    toast({
      title: `항목 ${itemFormMode === "create" ? "추가됨" : "수정됨"}`,
      description: "점검 항목이 저장되었습니다.",
    })
    setIsItemDialogOpen(false)
    setCurrentItem(null)
    setItemFormData({})
  }

  const handleItemFormChange = (field: keyof InspectionMasterItem, value: any) => {
    setItemFormData((prev) => ({ ...prev, [field]: value }))
  }

  const itemColumns = [
    { key: "sequence", title: "순서", width: "60px" },
    { key: "name", title: "항목명" },
    { key: "checkMethod", title: "점검방법", width: "200px" },
    { key: "expectedValue", title: "기준값" },
    { key: "dataType", title: "데이터타입" },
    {
      key: "isRequired",
      title: "필수",
      render: (val: boolean) =>
        val ? <CheckCircle className="text-green-500" /> : <XCircle className="text-gray-400" />,
    },
    {
      key: "actions",
      title: "작업",
      render: (_: any, row: InspectionMasterItem) => (
        <div className="flex space-x-1">
          <Button variant="ghost" size="icon" onClick={() => handleEditItem(row)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleDeleteItem(row.id)}>
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ]

  const filteredData = data.filter((item) => {
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch =
      !searchTerm ||
      item.name.toLowerCase().includes(searchLower) ||
      item.code.toLowerCase().includes(searchLower) ||
      (item.description && item.description.toLowerCase().includes(searchLower)) ||
      (item.equipmentType?.name && item.equipmentType.name.toLowerCase().includes(searchLower)) ||
      (item.inspectionType?.name && item.inspectionType.name.toLowerCase().includes(searchLower))

    if (activeTab === "all") return matchesSearch
    if (activeTab === "active") return matchesSearch && item.isActive
    if (activeTab === "inactive") return matchesSearch && !item.isActive
    return matchesSearch
  })

  const stats = {
    total: data.length,
    active: data.filter((item) => item.isActive).length,
    inactive: data.filter((item) => !item.isActive).length,
    daily: data.filter((item) => item.periodType === PeriodType.DAILY).length,
  }

  const renderMasterFormFields = (
    targetFormData: Partial<InspectionMaster>,
    onChangeHandler: (field: keyof InspectionMaster, value: any) => void,
  ) => (
    <ScrollArea className="h-[60vh] pr-4">
      <div className="space-y-4 p-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="code">템플릿 코드 *</Label>
            <Input
              id="code"
              value={targetFormData.code || ""}
              onChange={(e) => onChangeHandler("code", e.target.value)}
              placeholder="TPL001"
            />
          </div>
          <div>
            <Label htmlFor="version">버전</Label>
            <Input
              id="version"
              value={targetFormData.version || ""}
              onChange={(e) => onChangeHandler("version", e.target.value)}
              placeholder="1.0"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="name">템플릿명 *</Label>
          <Input
            id="name"
            value={targetFormData.name || ""}
            onChange={(e) => onChangeHandler("name", e.target.value)}
            placeholder="예: 일일 설비 점검 템플릿"
          />
        </div>
        <div>
          <Label htmlFor="description">설명</Label>
          <Textarea
            id="description"
            value={targetFormData.description || ""}
            onChange={(e) => onChangeHandler("description", e.target.value)}
            placeholder="템플릿에 대한 상세 설명을 입력하세요"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="equipmentTypeId">설비유형 *</Label>
            <Select
              value={targetFormData.equipmentTypeId || targetFormData.equipmentType?.id}
              onValueChange={(val) => onChangeHandler("equipmentTypeId", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="설비유형 선택" />
              </SelectTrigger>
              <SelectContent>
                {mockEquipmentTypes.map((et) => (
                  <SelectItem key={et.id} value={et.id}>
                    {et.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="inspectionTypeId">점검유형 *</Label>
            <Select
              value={targetFormData.inspectionTypeId || targetFormData.inspectionType?.id}
              onValueChange={(val) => onChangeHandler("inspectionTypeId", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="점검유형 선택" />
              </SelectTrigger>
              <SelectContent>
                {mockInspectionTypes.map((it) => (
                  <SelectItem key={it.id} value={it.id}>
                    {it.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="periodType">점검주기 유형 *</Label>
            <Select
              value={targetFormData.periodType}
              onValueChange={(val: PeriodType) => onChangeHandler("periodType", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="주기 유형 선택" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(PeriodType).map((pt) => (
                  <SelectItem key={pt} value={pt}>
                    {{
                      DAILY: "매일",
                      WEEKLY: "매주",
                      MONTHLY: "매월",
                      QUARTERLY: "분기",
                      SEMI_ANNUALLY: "반기",
                      ANNUALLY: "매년",
                      ON_DEMAND: "필요시",
                      CUSTOM_DAYS: "일 지정",
                      CUSTOM_WEEKS: "주 지정",
                      CUSTOM_MONTHS: "월 지정",
                      CUSTOM_YEARS: "년 지정",
                    }[pt] || pt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="periodValue">주기 값 *</Label>
            <Input
              id="periodValue"
              type="number"
              min="1"
              value={targetFormData.periodValue || 1}
              onChange={(e) => onChangeHandler("periodValue", Number.parseInt(e.target.value))}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="estimatedTime">예상시간(분)</Label>
          <Input
            id="estimatedTime"
            type="number"
            min="0"
            value={targetFormData.estimatedTime || ""}
            onChange={(e) =>
              onChangeHandler("estimatedTime", e.target.value ? Number.parseInt(e.target.value) : undefined)
            }
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="departmentId">담당부서</Label>
            <Select
              value={targetFormData.departmentId || targetFormData.department?.id}
              onValueChange={(val) => onChangeHandler("departmentId", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="담당부서 선택" />
              </SelectTrigger>
              <SelectContent>
                {mockDepartments.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="responsibleUserId">담당자</Label>
            <Select
              value={targetFormData.responsibleUserId || targetFormData.responsibleUser?.id}
              onValueChange={(val) => onChangeHandler("responsibleUserId", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="담당자 선택" />
              </SelectTrigger>
              <SelectContent>
                {mockUsers.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="effectiveDate">시작일</Label>
            <Input
              id="effectiveDate"
              type="date"
              value={targetFormData.effectiveDate || ""}
              onChange={(e) => onChangeHandler("effectiveDate", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="expiryDate">종료일</Label>
            <Input
              id="expiryDate"
              type="date"
              value={targetFormData.expiryDate || ""}
              onChange={(e) => onChangeHandler("expiryDate", e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <Checkbox
            id="isActive"
            checked={targetFormData.isActive}
            onCheckedChange={(checked) => onChangeHandler("isActive", checked)}
          />
          <Label htmlFor="isActive">활성 상태</Label>
        </div>
        <div className="pt-4">
          <Label>점검 항목</Label>
          {(isCreateDialogOpen || isEditDialogOpen) && (
            <Button size="sm" variant="outline" onClick={handleAddItem} className="ml-2">
              <Plus className="h-4 w-4 mr-1" />
              항목 추가
            </Button>
          )}
          <DataTable columns={itemColumns} data={targetFormData.items || []} pageSize={5} />
        </div>
      </div>
    </ScrollArea>
  )

  const renderItemFormFields = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="itemSequence">순서 *</Label>
        <Input
          id="itemSequence"
          type="number"
          min="1"
          value={itemFormData.sequence || ""}
          onChange={(e) => handleItemFormChange("sequence", Number.parseInt(e.target.value))}
        />
      </div>
      <div>
        <Label htmlFor="itemName">항목명 *</Label>
        <Input
          id="itemName"
          value={itemFormData.name || ""}
          onChange={(e) => handleItemFormChange("name", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="itemDescription">설명</Label>
        <Textarea
          id="itemDescription"
          value={itemFormData.description || ""}
          onChange={(e) => handleItemFormChange("description", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="itemCheckMethod">점검방법</Label>
        <Textarea
          id="itemCheckMethod"
          value={itemFormData.checkMethod || ""}
          onChange={(e) => handleItemFormChange("checkMethod", e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="itemDataType">데이터 타입</Label>
          <Select value={itemFormData.dataType} onValueChange={(val) => handleItemFormChange("dataType", val)}>
            <SelectTrigger>
              <SelectValue placeholder="데이터 타입 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TEXT">텍스트</SelectItem>
              <SelectItem value="NUMBER">숫자</SelectItem>
              <SelectItem value="BOOLEAN">예/아니오</SelectItem>
              <SelectItem value="SELECT">선택</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="itemExpectedValue">기준값/선택옵션</Label>
          <Input
            id="itemExpectedValue"
            value={itemFormData.expectedValue || ""}
            onChange={(e) => handleItemFormChange("expectedValue", e.target.value)}
            placeholder="숫자, Y/N, 또는 콤마로 구분된 옵션"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="itemUnit">단위</Label>
          <Input
            id="itemUnit"
            value={itemFormData.unit || ""}
            onChange={(e) => handleItemFormChange("unit", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="itemTolerance">허용오차</Label>
          <Input
            id="itemTolerance"
            value={itemFormData.tolerance || ""}
            onChange={(e) => handleItemFormChange("tolerance", e.target.value)}
          />
        </div>
      </div>
      <div className="flex items-center space-x-2 pt-2">
        <Checkbox
          id="itemIsRequired"
          checked={itemFormData.isRequired}
          onCheckedChange={(checked) => handleItemFormChange("isRequired", checked)}
        />
        <Label htmlFor="itemIsRequired">필수 항목</Label>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">전체 템플릿</CardTitle>
            <ListChecks className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">활성 템플릿</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">비활성 템플릿</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.inactive}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">일일점검 유형</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.daily}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>보전템플릿 마스터 관리</CardTitle>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                가져오기
              </Button>
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                내보내기
              </Button>
              <Button size="sm" onClick={handleCreateNew}>
                <Plus className="h-4 w-4 mr-2" />
                템플릿 등록
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="템플릿명, 코드, 설비유형 등으로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                필터
              </Button>
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">전체 ({stats.total})</TabsTrigger>
                <TabsTrigger value="active">활성 ({stats.active})</TabsTrigger>
                <TabsTrigger value="inactive">비활성 ({stats.inactive})</TabsTrigger>
              </TabsList>
              <TabsContent value={activeTab} className="mt-4">
                <DataTable data={filteredData} columns={columns} actions={actions} />
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Master Dialog */}
      <Dialog
        open={isCreateDialogOpen || isEditDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            isCreateDialogOpen && setIsCreateDialogOpen(false)
            isEditDialogOpen && setIsEditDialogOpen(false)
            setCurrentMaster(null)
            setMasterFormData({})
          }
        }}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{isCreateDialogOpen ? "새 보전템플릿 등록" : "보전템플릿 수정"}</DialogTitle>
            <DialogDescription>
              {isCreateDialogOpen ? "새로운 보전템플릿을 등록합니다." : "기존 보전템플릿 정보를 수정합니다."}
            </DialogDescription>
          </DialogHeader>
          {renderMasterFormFields(masterFormData, handleMasterFormChange)}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">취소</Button>
            </DialogClose>
            <Button onClick={handleSaveMaster}>저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail View Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{currentMaster?.name} - 상세 정보</DialogTitle>
            <DialogDescription>
              코드: {currentMaster?.code} | 버전: {currentMaster?.version}
            </DialogDescription>
          </DialogHeader>
          {currentMaster && renderMasterFormFields(currentMaster, () => {})}
          <div className="pt-4">
            <Label className="text-lg font-semibold">점검 항목</Label>
            <Button size="sm" variant="outline" onClick={handleAddItem} className="ml-2 mb-2">
              <Plus className="h-4 w-4 mr-1" />
              항목 추가 (상세화면에서)
            </Button>
            <DataTable columns={itemColumns} data={currentMaster?.items || []} pageSize={5} />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">닫기</Button>
            </DialogClose>
            <Button
              onClick={() => {
                handleEdit(currentMaster!)
                setIsDetailDialogOpen(false)
              }}
            >
              편집
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Item Dialog */}
      <Dialog
        open={isItemDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsItemDialogOpen(false)
            setCurrentItem(null)
            setItemFormData({})
          }
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{itemFormMode === "create" ? "새 점검항목 추가" : "점검항목 수정"}</DialogTitle>
          </DialogHeader>
          {renderItemFormFields()}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">취소</Button>
            </DialogClose>
            <Button onClick={handleSaveItem}>항목 저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
