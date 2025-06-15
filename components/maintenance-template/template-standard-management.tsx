"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { InspectionStandard, InspectionStandardItem } from "@/types/inspection-standard"
import { mockInspectionStandards } from "@/lib/mock-data/inspection-standard"
import { mockInspectionMasters } from "@/lib/mock-data/inspection-master" // Now Template Masters
import { useToast } from "@/hooks/use-toast"
import {
  PlusCircle,
  Search,
  FileText,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Download,
  Clock,
  BarChart3,
  TrendingUp,
  AlertTriangle,
} from "lucide-react"
import { DataTable } from "@/components/common/data-table"
import Image from "next/image" // Keep if used, otherwise remove
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"

// Helper function to get today's date in YYYY-MM-DD format
const getTodayIsoDate = () => {
  return new Date().toISOString().split("T")[0]
}

export function TemplateStandardManagement() {
  const [standards, setStandards] = useState<InspectionStandard[]>([])
  const [selectedStandard, setSelectedStandard] = useState<InspectionStandard | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [previewItem, setPreviewItem] = useState<InspectionStandardItem | null>(null)
  const [sortBy, setSortBy] = useState("name")
  const { toast } = useToast()

  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false)
  const [formMode, setFormMode] = useState<"create" | "edit">("create")
  const [formData, setFormData] = useState<Partial<InspectionStandard>>({
    version: "1.0",
    status: "draft",
    items: [],
    effectiveDate: getTodayIsoDate(),
  })
  const [itemFormData, setItemFormData] = useState<Partial<InspectionStandardItem>>({})
  const [isItemFormDialogOpen, setIsItemFormDialogOpen] = useState(false)
  const [itemFormMode, setItemFormMode] = useState<"create" | "edit">("create")
  const [editingItemId, setEditingItemId] = useState<string | null>(null)

  useEffect(() => {
    setStandards(mockInspectionStandards)
  }, [])

  const stats = {
    total: standards.length,
    draft: standards.filter((s) => s.status === "draft").length,
    review: standards.filter((s) => s.status === "review").length,
    approved: standards.filter((s) => s.status === "approved").length,
    published: standards.filter((s) => s.status === "published").length,
    deprecated: standards.filter((s) => s.status === "deprecated").length,
  }

  const getStatusBadge = (status: InspectionStandard["status"]) => {
    const statusMap: Record<InspectionStandard["status"], { label: string; className: string }> = {
      draft: { label: "초안", className: "bg-gray-100 text-gray-700 border-gray-300" },
      review: { label: "검토중", className: "bg-blue-100 text-blue-700 border-blue-300" },
      approved: { label: "승인됨", className: "bg-green-100 text-green-700 border-green-300" },
      published: { label: "발행됨", className: "bg-purple-100 text-purple-700 border-purple-300" },
      deprecated: { label: "폐기됨", className: "bg-red-100 text-red-700 border-red-300" },
    }
    const config = statusMap[status] || { label: String(status), className: "bg-gray-100 text-gray-700" }
    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    )
  }

  const filteredStandards = standards
    .filter((standard) => {
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch =
        standard.name.toLowerCase().includes(searchLower) ||
        standard.code.toLowerCase().includes(searchLower) ||
        (standard.description && standard.description.toLowerCase().includes(searchLower)) ||
        (standard.master?.name && standard.master.name.toLowerCase().includes(searchLower))

      if (activeTab === "all") return matchesSearch
      return matchesSearch && standard.status === activeTab
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name)
      if (sortBy === "code") return a.code.localeCompare(b.code)
      if (sortBy === "effectiveDate") return new Date(a.effectiveDate).getTime() - new Date(b.effectiveDate).getTime()
      if (sortBy === "status") return (a.status || "").localeCompare(b.status || "")
      return 0
    })

  const handleSelectStandard = (standard: InspectionStandard) => {
    setSelectedStandard(standard)
  }

  const handleEditStandard = (standard: InspectionStandard) => {
    setFormMode("edit")
    setFormData({
      ...standard,
      effectiveDate: standard.effectiveDate ? standard.effectiveDate.split("T")[0] : getTodayIsoDate(),
      expiryDate: standard.expiryDate ? standard.expiryDate.split("T")[0] : undefined,
      items: standard.items ? [...standard.items] : [], // Deep copy items
    })
    setIsFormDialogOpen(true)
  }

  const handleDeleteStandard = (id: string) => {
    toast({
      title: "삭제 확인",
      description: "정말 이 템플릿 항목 기준서를 삭제하시겠습니까?",
      action: (
        <Button variant="destructive" onClick={() => confirmDeleteStandard(id)}>
          삭제
        </Button>
      ),
    })
  }
  const confirmDeleteStandard = (id: string) => {
    setStandards((prev) => prev.filter((s) => s.id !== id))
    if (selectedStandard?.id === id) setSelectedStandard(null)
    toast({ title: "삭제 완료", description: "템플릿 항목 기준서가 삭제되었습니다." })
  }

  const standardColumns = [
    { key: "code", title: "코드", sortable: true },
    { key: "name", title: "기준서명", sortable: true },
    { key: "master.name", title: "템플릿 마스터", sortable: true },
    { key: "version", title: "버전", sortable: true },
    { key: "status", title: "상태", render: (value: InspectionStandard["status"]) => getStatusBadge(value) },
    {
      key: "effectiveDate",
      title: "적용일자",
      render: (value: string) => (value ? new Date(value).toLocaleDateString() : ""),
    },
    { key: "items.length", title: "항목수", render: (_: any, row: InspectionStandard) => row.items?.length || 0 },
    {
      key: "actions",
      title: "작업",
      render: (_: any, row: InspectionStandard) => (
        <div className="flex space-x-1">
          <Button variant="ghost" size="icon" onClick={() => handleSelectStandard(row)} title="상세 보기">
            <FileText className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleEditStandard(row)} title="편집">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleDeleteStandard(row.id)} title="삭제">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  const itemDetailColumns = [
    { key: "sequence", title: "순서" },
    { key: "masterItem.name", title: "항목명" },
    { key: "description", title: "설명" },
    { key: "checkMethod", title: "점검방법" },
    { key: "expectedValue", title: "기준값" },
    {
      key: "isRequired",
      title: "필수",
      render: (value: boolean) =>
        value ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-gray-300" />,
    },
    {
      key: "actions",
      title: "작업 (폼 내부)",
      render: (_: any, row: InspectionStandardItem) => (
        <div className="flex space-x-1">
          <Button variant="ghost" size="icon" onClick={() => handleEditItemInForm(row)} title="항목 편집">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleDeleteItemInForm(row.id!)} title="항목 삭제">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  const handleOpenCreateForm = () => {
    setFormMode("create")
    setFormData({
      id: `std_${Date.now()}`,
      code: `STD${String(standards.length + 1).padStart(3, "0")}`,
      version: "1.0",
      status: "draft",
      items: [],
      effectiveDate: getTodayIsoDate(),
    })
    setIsFormDialogOpen(true)
  }

  const handleFormInputChange = (field: keyof InspectionStandard, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleItemFormInputChange = (field: keyof InspectionStandardItem, value: any) => {
    setItemFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddItemToForm = () => {
    setItemFormMode("create")
    setItemFormData({
      id: `s_item_${Date.now()}`,
      sequence: (formData.items?.length || 0) + 1,
      isRequired: true,
    })
    setEditingItemId(null)
    setIsItemFormDialogOpen(true)
  }

  const handleEditItemInForm = (item: InspectionStandardItem) => {
    setItemFormMode("edit")
    setItemFormData({ ...item })
    setEditingItemId(item.id!)
    setIsItemFormDialogOpen(true)
  }

  const handleDeleteItemInForm = (itemId: string) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items?.filter((i) => i.id !== itemId).map((item, index) => ({ ...item, sequence: index + 1 })) || [],
    }))
  }

  const handleSaveItemInForm = () => {
    const currentItems = formData.items || []
    if (itemFormMode === "create") {
      setFormData((prev) => ({
        ...prev,
        items: [...currentItems, itemFormData as InspectionStandardItem].sort(
          (a, b) => (a.sequence || 0) - (b.sequence || 0),
        ),
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        items: currentItems
          .map((i) => (i.id === editingItemId ? (itemFormData as InspectionStandardItem) : i))
          .sort((a, b) => (a.sequence || 0) - (b.sequence || 0)),
      }))
    }
    setIsItemFormDialogOpen(false)
    setItemFormData({})
    setEditingItemId(null)
  }

  const handleSubmitStandard = () => {
    if (!formData.code || !formData.name || !formData.masterId || !formData.effectiveDate) {
      toast({ title: "입력 오류", description: "필수 필드를 모두 입력해주세요.", variant: "destructive" })
      return
    }

    const standardToSave: InspectionStandard = {
      ...formData,
      master: mockInspectionMasters.find((m) => m.id === formData.masterId) || formData.master,
      createdAt: formData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: formData.createdBy || "current-user", // Replace with actual user
    } as InspectionStandard

    if (formMode === "create") {
      setStandards((prev) => [standardToSave, ...prev])
      toast({ title: "등록 완료", description: `${standardToSave.name} 기준서가 성공적으로 등록되었습니다.` })
    } else {
      setStandards((prev) => prev.map((s) => (s.id === standardToSave.id ? standardToSave : s)))
      toast({ title: "수정 완료", description: `${standardToSave.name} 기준서가 성공적으로 수정되었습니다.` })
    }
    setIsFormDialogOpen(false)
    setFormData({})
    if (selectedStandard?.id === standardToSave.id) setSelectedStandard(standardToSave)
  }

  const renderStandardForm = () => (
    <ScrollArea className="h-[70vh] pr-4">
      <div className="space-y-4 p-1">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="std-code">기준서 코드 *</Label>
            <Input
              id="std-code"
              value={formData.code || ""}
              onChange={(e) => handleFormInputChange("code", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="std-version">버전</Label>
            <Input
              id="std-version"
              value={formData.version || ""}
              onChange={(e) => handleFormInputChange("version", e.target.value)}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="std-name">기준서명 *</Label>
          <Input
            id="std-name"
            value={formData.name || ""}
            onChange={(e) => handleFormInputChange("name", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="std-masterId">템플릿 마스터 *</Label>
          <Select
            value={formData.masterId || formData.master?.id}
            onValueChange={(val) => handleFormInputChange("masterId", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="템플릿 마스터 선택" />
            </SelectTrigger>
            <SelectContent>
              {mockInspectionMasters.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.name} ({m.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="std-description">설명</Label>
          <Textarea
            id="std-description"
            value={formData.description || ""}
            onChange={(e) => handleFormInputChange("description", e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="std-effectiveDate">적용일자 *</Label>
            <Input
              id="std-effectiveDate"
              type="date"
              value={formData.effectiveDate || ""}
              onChange={(e) => handleFormInputChange("effectiveDate", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="std-expiryDate">만료일자</Label>
            <Input
              id="std-expiryDate"
              type="date"
              value={formData.expiryDate || ""}
              onChange={(e) => handleFormInputChange("expiryDate", e.target.value)}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="std-status">상태</Label>
          <Select
            value={formData.status}
            onValueChange={(val: InspectionStandard["status"]) => handleFormInputChange("status", val)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">초안</SelectItem>
              <SelectItem value="review">검토중</SelectItem>
              <SelectItem value="approved">승인됨</SelectItem>
              <SelectItem value="published">발행됨</SelectItem>
              <SelectItem value="deprecated">폐기됨</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="std-notes">비고</Label>
          <Textarea
            id="std-notes"
            value={formData.notes || ""}
            onChange={(e) => handleFormInputChange("notes", e.target.value)}
          />
        </div>

        <div className="pt-4">
          <div className="flex justify-between items-center mb-2">
            <Label className="text-lg font-semibold">점검 항목</Label>
            <Button size="sm" variant="outline" onClick={handleAddItemToForm}>
              <PlusCircle className="h-4 w-4 mr-1" />
              항목 추가
            </Button>
          </div>
          <DataTable columns={itemDetailColumns} data={formData.items || []} pageSize={5} />
        </div>
      </div>
    </ScrollArea>
  )

  const renderItemForm = () => (
    <div className="space-y-3">
      <div>
        <Label htmlFor="item-seq">순서 *</Label>
        <Input
          id="item-seq"
          type="number"
          value={itemFormData.sequence || ""}
          onChange={(e) => handleItemFormInputChange("sequence", Number.parseInt(e.target.value))}
        />
      </div>
      <div>
        <Label htmlFor="item-name">항목명(템플릿 항목 ID) *</Label>
        <Select
          value={itemFormData.masterItemId || itemFormData.masterItem?.id}
          onValueChange={(val) => handleItemFormInputChange("masterItemId", val)}
        >
          <SelectTrigger>
            <SelectValue placeholder="템플릿 마스터 항목 선택" />
          </SelectTrigger>
          <SelectContent>
            {formData.masterId &&
              mockInspectionMasters
                .find((m) => m.id === formData.masterId)
                ?.items?.map((mi) => (
                  <SelectItem key={mi.id} value={mi.id}>
                    {mi.name} ({mi.id})
                  </SelectItem>
                ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="item-desc">설명 (기준서별 상세)</Label>
        <Textarea
          id="item-desc"
          value={itemFormData.description || ""}
          onChange={(e) => handleItemFormInputChange("description", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="item-method">점검방법 (기준서별 상세)</Label>
        <Textarea
          id="item-method"
          value={itemFormData.checkMethod || ""}
          onChange={(e) => handleItemFormInputChange("checkMethod", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="item-expected">기준값 (기준서별 상세)</Label>
        <Input
          id="item-expected"
          value={itemFormData.expectedValue || ""}
          onChange={(e) => handleItemFormInputChange("expectedValue", e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="item-unit">단위</Label>
          <Input
            id="item-unit"
            value={itemFormData.unit || ""}
            onChange={(e) => handleItemFormInputChange("unit", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="item-tolerance">허용오차</Label>
          <Input
            id="item-tolerance"
            value={itemFormData.tolerance || ""}
            onChange={(e) => handleItemFormInputChange("tolerance", e.target.value)}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="item-safety">안전참고사항</Label>
        <Textarea
          id="item-safety"
          value={itemFormData.safetyNotes || ""}
          onChange={(e) => handleItemFormInputChange("safetyNotes", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="item-image">참고이미지 URL</Label>
        <Input
          id="item-image"
          value={itemFormData.imageUrl || ""}
          onChange={(e) => handleItemFormInputChange("imageUrl", e.target.value)}
        />
      </div>
      <div className="flex items-center space-x-2 pt-2">
        <Checkbox
          id="item-required"
          checked={itemFormData.isRequired}
          onCheckedChange={(checked) => handleItemFormInputChange("isRequired", checked)}
        />
        <Label htmlFor="item-required">필수 항목</Label>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">템플릿 항목 관리</h1>
          <p className="text-muted-foreground">보전템플릿에 사용될 상세 점검 항목 기준서를 관리합니다.</p>
        </div>
        <Button onClick={handleOpenCreateForm} className="w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" />새 기준서
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">전체</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Edit className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium">초안</p>
                <p className="text-2xl font-bold">{stats.draft}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">검토중</p>
                <p className="text-2xl font-bold">{stats.review}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">승인됨</p>
                <p className="text-2xl font-bold">{stats.approved}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm font-medium">발행됨</p>
                <p className="text-2xl font-bold">{stats.published}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-sm font-medium">폐기됨</p>
                <p className="text-2xl font-bold">{stats.deprecated}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="기준서명, 코드, 템플릿 마스터명으로 검색..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="정렬 기준" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">이름순</SelectItem>
            <SelectItem value="code">코드순</SelectItem>
            <SelectItem value="effectiveDate">적용일자순</SelectItem>
            <SelectItem value="status">상태순</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6">
          <TabsTrigger value="all">전체</TabsTrigger>
          <TabsTrigger value="draft">초안</TabsTrigger>
          <TabsTrigger value="review">검토중</TabsTrigger>
          <TabsTrigger value="approved">승인됨</TabsTrigger>
          <TabsTrigger value="published">발행됨</TabsTrigger>
          <TabsTrigger value="deprecated">폐기됨</TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab} className="mt-6">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>템플릿 항목 기준서 목록</CardTitle>
                  <CardDescription>{filteredStandards.length}개의 기준서가 있습니다</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  내보내기
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <DataTable columns={standardColumns} data={filteredStandards} onRowClick={handleSelectStandard} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedStandard && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <Card className="lg:col-span-1">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between">
                기준서 정보 {getStatusBadge(selectedStandard.status)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-xs text-muted-foreground">기준서명</Label>
                <p>{selectedStandard.name}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">코드</Label>
                <p>{selectedStandard.code}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">버전</Label>
                <p>{selectedStandard.version}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">템플릿 마스터</Label>
                <p>{selectedStandard.master?.name}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">적용일자</Label>
                <p>
                  {selectedStandard.effectiveDate ? new Date(selectedStandard.effectiveDate).toLocaleDateString() : "-"}
                </p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">설명</Label>
                <p className="text-sm text-muted-foreground">{selectedStandard.description || "-"}</p>
              </div>
              {selectedStandard.notes && (
                <div>
                  <Label className="text-xs text-muted-foreground">비고</Label>
                  <p className="text-sm text-muted-foreground">{selectedStandard.notes}</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex gap-2">
              {/* Add actions like approve, publish based on status */}
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                PDF
              </Button>
            </CardFooter>
          </Card>
          <Card className="lg:col-span-2">
            <CardHeader className="pb-4">
              <CardTitle>점검 항목 상세</CardTitle>
              <CardDescription>기준서에 포함된 {selectedStandard.items?.length || 0}개의 점검 항목</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <DataTable
                columns={itemDetailColumns.filter((col) => col.key !== "actions")}
                data={selectedStandard.items || []}
                pageSize={5}
                onRowClick={(item) => setPreviewItem(item)}
              />
            </CardContent>
          </Card>
        </div>
      )}

      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {formMode === "create" ? "새 템플릿 항목 기준서 등록" : "템플릿 항목 기준서 수정"}
            </DialogTitle>
          </DialogHeader>
          {renderStandardForm()}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">취소</Button>
            </DialogClose>
            <Button onClick={handleSubmitStandard}>저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isItemFormDialogOpen} onOpenChange={setIsItemFormDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {itemFormMode === "create" ? "새 점검항목 추가 (기준서 내)" : "점검항목 수정 (기준서 내)"}
            </DialogTitle>
          </DialogHeader>
          {renderItemForm()}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">취소</Button>
            </DialogClose>
            <Button onClick={handleSaveItemInForm}>항목 저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!previewItem} onOpenChange={() => setPreviewItem(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{previewItem?.masterItem?.name || "항목 상세"}</DialogTitle>
          </DialogHeader>
          {previewItem && (
            <div className="space-y-4">
              <div>
                <Label>설명 (기준서별)</Label>
                <p>{previewItem.description}</p>
              </div>
              <div>
                <Label>점검 방법 (기준서별)</Label>
                <pre className="text-sm bg-gray-50 p-2 rounded whitespace-pre-wrap">{previewItem.checkMethod}</pre>
              </div>
              <div>
                <Label>기준값 (기준서별)</Label>
                <p>{previewItem.expectedValue}</p>
              </div>
              {previewItem.safetyNotes && (
                <div>
                  <Label>안전 주의사항</Label>
                  <p className="text-red-600">{previewItem.safetyNotes}</p>
                </div>
              )}
              {previewItem.imageUrl && (
                <div>
                  <Label>참고 이미지</Label>
                  <Image
                    src={previewItem.imageUrl || "/placeholder.svg"}
                    alt={previewItem.masterItem?.name || "점검항목 이미지"}
                    width={300}
                    height={200}
                    className="rounded border"
                  />
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
