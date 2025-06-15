"use client"

import type React from "react"

import { useState, useMemo, useCallback, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  Copy,
  ChevronRight,
  ChevronDown,
  Package,
  AlertCircle,
  CheckCircle,
  FileText,
  TreePine,
  Save,
} from "lucide-react"
import { mockEquipmentBOMs, mockBOMTemplates } from "@/lib/mock-data/equipment-bom"
import type { EquipmentBOM, BOMItem, BOMTemplate, BOMSearchFilters } from "@/types/equipment-bom"
import { cn } from "@/lib/utils"

const partTypeLabels: Record<BOMItem["partType"], { label: string; color: string }> = {
  consumable: { label: "소모품", color: "bg-orange-100 text-orange-800" },
  replacement: { label: "교체품", color: "bg-blue-100 text-blue-800" },
  spare: { label: "예비품", color: "bg-green-100 text-green-800" },
  standard: { label: "표준품", color: "bg-gray-100 text-gray-800" },
}

const bomStatusLabels: Record<EquipmentBOM["bomStatus"], { label: string; color: string; icon: React.ElementType }> = {
  draft: { label: "초안", color: "bg-gray-100 text-gray-800", icon: FileText },
  approved: { label: "승인", color: "bg-blue-100 text-blue-800", icon: CheckCircle },
  active: { label: "활성", color: "bg-green-100 text-green-800", icon: CheckCircle },
  obsolete: { label: "폐기", color: "bg-red-100 text-red-800", icon: AlertCircle },
}

// --- Helper Functions ---
const generateNewBOMItemId = () => `bom-item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`

const calculateBOMItemTotalPrice = (item: Partial<BOMItem>): number => {
  return (item.quantity || 0) * (item.unitPrice || 0)
}

const calculateBOMTotalCost = (items: BOMItem[]): number => {
  let total = 0
  const calculate = (currentItems: BOMItem[]) => {
    for (const item of currentItems) {
      total += item.totalPrice
      if (item.children && item.children.length > 0) {
        calculate(item.children)
      }
    }
  }
  calculate(items)
  return total
}

// Recursive function to find and update/delete/add an item
const updateBOMItemsRecursive = (
  items: BOMItem[],
  targetId: string | null, // null for adding top-level
  action: "add" | "edit" | "delete" | "toggleExpand",
  payload?: Partial<BOMItem> | string, // payload is BOMItem for add/edit, parentId for add, itemId for delete/toggle
  parentIdForItemAdd?: string,
): BOMItem[] => {
  return items
    .map((item) => {
      if (item.id === targetId && (action === "edit" || action === "delete" || action === "toggleExpand")) {
        if (action === "edit" && payload && typeof payload === "object") {
          return { ...item, ...payload, totalPrice: calculateBOMItemTotalPrice({ ...item, ...payload }) }
        }
        if (action === "delete") {
          return null // Mark for deletion
        }
        if (action === "toggleExpand") {
          return { ...item, isExpanded: !item.isExpanded }
        }
      }

      if (item.id === parentIdForItemAdd && action === "add" && payload && typeof payload === "object") {
        const newItem: BOMItem = {
          id: generateNewBOMItemId(),
          partCode: "",
          partName: "",
          specification: "",
          unit: "EA",
          quantity: 1,
          unitPrice: 0,
          manufacturer: "",
          model: "",
          partType: "standard",
          level: item.level + 1,
          parentId: item.id,
          leadTime: 0,
          minStock: 0,
          currentStock: 0,
          supplier: "",
          remarks: "",
          createdAt: new Date().toISOString().split("T")[0],
          updatedAt: new Date().toISOString().split("T")[0],
          isExpanded: false,
          children: [],
          ...payload, // Apply payload, which might override defaults
          totalPrice: calculateBOMItemTotalPrice(payload),
        }
        return { ...item, children: [...(item.children || []), newItem] }
      }

      if (item.children && item.children.length > 0) {
        return {
          ...item,
          children: updateBOMItemsRecursive(item.children, targetId, action, payload, parentIdForItemAdd),
        }
      }
      return item
    })
    .filter((item) => item !== null) as BOMItem[]
}

// --- BOMTreeItem Component ---
interface BOMTreeItemProps {
  item: BOMItem
  onEdit: (item: BOMItem) => void
  onDelete: (id: string) => void
  onAddChild: (parentId: string) => void
  onToggleExpand: (id: string) => void
}

function BOMTreeItem({ item, onEdit, onDelete, onAddChild, onToggleExpand }: BOMTreeItemProps) {
  const hasChildren = item.children && item.children.length > 0
  const partTypeInfo = partTypeLabels[item.partType]

  return (
    <div className={cn("border rounded-lg p-3 mb-2", `ml-${(item.level - 1) * 4}`)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1 md:space-x-3 flex-1 min-w-0">
          {item.level > 1 && <div className="w-1 md:w-3" />} {/* Indentation spacer */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleExpand(item.id)}
            className="p-1 h-6 w-6"
            disabled={!hasChildren}
          >
            {hasChildren ? (
              item.isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )
            ) : (
              <span className="w-4" />
            )}
          </Button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <span className="font-medium truncate" title={item.partCode}>
                {item.partCode}
              </span>
              <Badge className={cn(partTypeInfo.color, "whitespace-nowrap")}>{partTypeInfo.label}</Badge>
              {item.currentStock < item.minStock && (
                <Badge variant="destructive" className="whitespace-nowrap">
                  재고부족
                </Badge>
              )}
            </div>
            <div className="text-sm text-muted-foreground truncate" title={item.partName + " | " + item.specification}>
              {item.partName} | {item.specification}
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mt-1">
              <span>
                수량: {item.quantity}
                {item.unit}
              </span>
              <span>단가: ₩{item.unitPrice.toLocaleString()}</span>
              <span>총액: ₩{item.totalPrice.toLocaleString()}</span>
              <span>
                재고: {item.currentStock}/{item.minStock}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="sm" onClick={() => onAddChild(item.id)} title="하위 부품 추가">
            <Plus className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onEdit(item)} title="부품 편집">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(item.id)} title="부품 삭제">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {hasChildren && item.isExpanded && (
        <div className="mt-3 space-y-2">
          {item.children?.map((child) => (
            <BOMTreeItem
              key={child.id}
              item={child}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddChild={onAddChild}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// --- Main BOM Management Component ---
export function EquipmentBOMManagement() {
  const [boms, setBOMs] = useState<EquipmentBOM[]>(mockEquipmentBOMs)
  const [templates, setTemplates] = useState<BOMTemplate[]>(mockBOMTemplates)
  const [selectedBOMId, setSelectedBOMId] = useState<string | null>(
    mockEquipmentBOMs.length > 0 ? mockEquipmentBOMs[0].id : null,
  )
  const [searchFilters, setSearchFilters] = useState<BOMSearchFilters>({})

  const [isCreateBOMDialogOpen, setIsCreateBOMDialogOpen] = useState(false)
  const [isEditItemDialogOpen, setIsEditItemDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<(Partial<BOMItem> & { parentId?: string; isNew?: boolean }) | null>(
    null,
  )

  const selectedBOM = useMemo(() => {
    return boms.find((bom) => bom.id === selectedBOMId) || null
  }, [boms, selectedBOMId])

  const updateSelectedBOM = useCallback(
    (updatedItems: BOMItem[]) => {
      if (!selectedBOMId) return
      const newTotalCost = calculateBOMTotalCost(updatedItems)
      setBOMs((prevBOMs) =>
        prevBOMs.map((b) => (b.id === selectedBOMId ? { ...b, items: updatedItems, totalCost: newTotalCost } : b)),
      )
    },
    [selectedBOMId],
  )

  const handleToggleExpandItem = (itemId: string) => {
    if (!selectedBOM) return
    const updatedItems = updateBOMItemsRecursive(selectedBOM.items, itemId, "toggleExpand")
    updateSelectedBOM(updatedItems)
  }

  const handleEditBOMItem = (item: BOMItem) => {
    setEditingItem({ ...item, isNew: false })
    setIsEditItemDialogOpen(true)
  }

  const handleDeleteBOMItem = (itemId: string) => {
    if (!selectedBOM) return
    // Confirmation dialog would be good here
    const updatedItems = updateBOMItemsRecursive(selectedBOM.items, itemId, "delete")
    updateSelectedBOM(updatedItems)
  }

  const handleAddTopLevelBOMItem = () => {
    if (!selectedBOM) return
    setEditingItem({
      partCode: "",
      partName: "",
      quantity: 1,
      unitPrice: 0,
      level: 1,
      isNew: true,
      partType: "standard",
      unit: "EA",
    })
    setIsEditItemDialogOpen(true)
  }

  const handleAddChildBOMItem = (parentId: string) => {
    if (!selectedBOM) return
    const parentItem = findItemRecursive(selectedBOM.items, parentId)
    if (!parentItem) return

    setEditingItem({
      partCode: "",
      partName: "",
      quantity: 1,
      unitPrice: 0,
      level: parentItem.level + 1,
      parentId: parentId,
      isNew: true,
      partType: "standard",
      unit: "EA",
    })
    setIsEditItemDialogOpen(true)
  }

  const findItemRecursive = (items: BOMItem[], itemId: string): BOMItem | null => {
    for (const item of items) {
      if (item.id === itemId) return item
      if (item.children) {
        const found = findItemRecursive(item.children, itemId)
        if (found) return found
      }
    }
    return null
  }

  const handleSaveBOMItem = (itemData: Partial<BOMItem>) => {
    if (!selectedBOM || !editingItem) return

    let updatedItems
    if (editingItem.isNew) {
      // Adding new item
      if (editingItem.parentId) {
        // Adding child item
        updatedItems = updateBOMItemsRecursive(selectedBOM.items, null, "add", itemData, editingItem.parentId)
      } else {
        // Adding top-level item
        const newItem: BOMItem = {
          id: generateNewBOMItemId(),
          partCode: "",
          partName: "",
          specification: "",
          unit: "EA",
          quantity: 1,
          unitPrice: 0,
          manufacturer: "",
          model: "",
          partType: "standard",
          level: 1, // Top level
          leadTime: 0,
          minStock: 0,
          currentStock: 0,
          supplier: "",
          remarks: "",
          createdAt: new Date().toISOString().split("T")[0],
          updatedAt: new Date().toISOString().split("T")[0],
          isExpanded: false,
          children: [],
          ...itemData,
          totalPrice: calculateBOMItemTotalPrice(itemData),
        }
        updatedItems = [...selectedBOM.items, newItem]
      }
    } else {
      // Editing existing item
      updatedItems = updateBOMItemsRecursive(selectedBOM.items, editingItem.id!, "edit", itemData)
    }
    updateSelectedBOM(updatedItems)
    setIsEditItemDialogOpen(false)
    setEditingItem(null)
  }

  const filteredBOMs = useMemo(() => {
    return boms.filter((bom) => {
      return (
        (!searchFilters.equipmentCode ||
          bom.equipmentCode.toLowerCase().includes(searchFilters.equipmentCode.toLowerCase())) &&
        (!searchFilters.equipmentName ||
          bom.equipmentName.toLowerCase().includes(searchFilters.equipmentName.toLowerCase())) &&
        (!searchFilters.bomStatus || searchFilters.bomStatus === "all" || bom.bomStatus === searchFilters.bomStatus)
      )
    })
  }, [boms, searchFilters])

  const handleCreateBOM = () => {
    // Placeholder for BOM creation logic
    // For now, let's just create a new BOM with a unique ID and add it to the list
    const newBOMId = `eq-bom-${Date.now()}`
    const newBOM: EquipmentBOM = {
      id: newBOMId,
      equipmentId: `eq-${Date.now()}`, // Needs to be selectable or generated
      equipmentCode: `NEW-EQ-${Date.now() % 1000}`,
      equipmentName: "새 설비 (BOM 생성)",
      bomVersion: "v1.0",
      bomStatus: "draft",
      items: [],
      totalCost: 0,
      createdBy: "현재사용자", // Placeholder
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    }
    setBOMs((prev) => [...prev, newBOM])
    setSelectedBOMId(newBOMId) // Select the newly created BOM
    setIsCreateBOMDialogOpen(false) // Close dialog if it was open
  }

  // Effect to select the first BOM if none is selected and BOMs exist
  useEffect(() => {
    if (!selectedBOMId && boms.length > 0) {
      setSelectedBOMId(boms[0].id)
    }
  }, [boms, selectedBOMId])

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">설비 BOM 관리</h1>
          <p className="text-muted-foreground">설비 부품 구성(BOM) 정보를 생성하고 관리합니다.</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => setIsCreateBOMDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            BOM 생성
          </Button>
          <Button variant="outline" disabled>
            <Upload className="h-4 w-4 mr-2" />
            가져오기
          </Button>
        </div>
      </div>

      {/* Stats Cards - Can be simplified or removed if not primary focus */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* ... Stats cards ... (kept for brevity, can be same as before) */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TreePine className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">총 BOM</p>
                <p className="text-2xl font-bold">{boms.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">활성 BOM</p>
                <p className="text-2xl font-bold">{boms.filter((b) => b.bomStatus === "active").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">총 부품수 (선택 BOM)</p>
                <p className="text-2xl font-bold">
                  {selectedBOM?.items.reduce((acc, item) => acc + 1 + (item.children?.length || 0), 0) || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">BOM 템플릿</p>
                <p className="text-2xl font-bold">{templates.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="bom-list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="bom-list">BOM 목록</TabsTrigger>
          <TabsTrigger value="bom-detail">BOM 상세</TabsTrigger>
          <TabsTrigger value="templates">BOM 템플릿</TabsTrigger>
        </TabsList>

        <TabsContent value="bom-list" className="space-y-4">
          {/* Search Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* ... Search filter inputs ... (kept for brevity) */}
                <div>
                  <Label>설비코드</Label>
                  <Input
                    placeholder="설비코드 검색"
                    value={searchFilters.equipmentCode || ""}
                    onChange={(e) => setSearchFilters((prev) => ({ ...prev, equipmentCode: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>설비명</Label>
                  <Input
                    placeholder="설비명 검색"
                    value={searchFilters.equipmentName || ""}
                    onChange={(e) => setSearchFilters((prev) => ({ ...prev, equipmentName: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>BOM 상태</Label>
                  <Select
                    value={searchFilters.bomStatus || "all"}
                    onValueChange={(value) => setSearchFilters((prev) => ({ ...prev, bomStatus: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="상태 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="draft">초안</SelectItem>
                      <SelectItem value="approved">승인</SelectItem>
                      <SelectItem value="active">활성</SelectItem>
                      <SelectItem value="obsolete">폐기</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button variant="outline" onClick={() => setSearchFilters({})} className="w-full">
                    초기화
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* BOM List */}
          <div className="grid grid-cols-1 gap-4">
            {filteredBOMs.map((bom) => {
              const statusInfo = bomStatusLabels[bom.bomStatus]
              const StatusIcon = statusInfo.icon
              return (
                <Card
                  key={bom.id}
                  className={cn(
                    "cursor-pointer hover:shadow-md transition-shadow",
                    selectedBOMId === bom.id && "ring-2 ring-primary shadow-lg",
                  )}
                  onClick={() => setSelectedBOMId(bom.id)}
                >
                  <CardContent className="p-4">
                    {/* ... BOM list item content ... (kept for brevity) */}
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-lg">{bom.equipmentCode}</h3>
                          <Badge className={statusInfo.color}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusInfo.label}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-2">{bom.equipmentName}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">버전: </span>
                            <span className="font-medium">{bom.bomVersion}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">부품수: </span>
                            <span className="font-medium">{bom.items.length}개</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">총 비용: </span>
                            <span className="font-medium">₩{bom.totalCost.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">승인자: </span>
                            <span className="font-medium">{bom.approvedBy || "-"}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedBOMId(bom.id) /* Switch to detail tab? */
                          }}
                        >
                          상세보기
                        </Button>
                        <Button variant="outline" size="sm" disabled>
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" disabled>
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
            {filteredBOMs.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">조건에 맞는 BOM이 없습니다.</CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="bom-detail" className="space-y-4">
          {selectedBOM ? (
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
                  <div>
                    <CardTitle>{selectedBOM.equipmentCode} - BOM 상세</CardTitle>
                    <p className="text-muted-foreground">
                      {selectedBOM.equipmentName} (버전: {selectedBOM.bomVersion})
                    </p>
                    <p className="text-muted-foreground">총 비용: ₩{selectedBOM.totalCost.toLocaleString()}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleAddTopLevelBOMItem}>
                      <Plus className="h-4 w-4 mr-2" /> 최상위 부품 추가
                    </Button>
                    <Button variant="outline" size="sm" disabled>
                      <Edit className="h-4 w-4 mr-2" />
                      BOM 정보 편집
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-3">
                  {" "}
                  {/* Added pr-3 for scrollbar space */}
                  {selectedBOM.items.length > 0 ? (
                    selectedBOM.items.map((item) => (
                      <BOMTreeItem
                        key={item.id}
                        item={item}
                        onEdit={handleEditBOMItem}
                        onDelete={handleDeleteBOMItem}
                        onAddChild={handleAddChildBOMItem}
                        onToggleExpand={handleToggleExpandItem}
                      />
                    ))
                  ) : (
                    <div className="text-center py-10 text-muted-foreground">
                      <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />이 BOM에 등록된 부품이 없습니다. <br />{" "}
                      버튼을 클릭하여 새 부품을 추가하세요.
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <TreePine className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">BOM 목록에서 BOM을 선택하여 상세 정보를 확인하고 편집하세요.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          {/* ... BOM Templates content (can be similar to before, or simplified) ... */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((template) => (
              <Card key={template.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{template.templateName}</CardTitle>
                      <p className="text-sm text-muted-foreground">{template.equipmentType}</p>
                    </div>
                    <Badge variant={template.isActive ? "default" : "secondary"}>
                      {template.isActive ? "활성" : "비활성"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
                  <div className="flex justify-between items-center text-sm">
                    <span>부품수: {template.items.length}개</span>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" disabled>
                        편집
                      </Button>
                      <Button variant="outline" size="sm" disabled>
                        복사하여 사용
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {templates.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  등록된 BOM 템플릿이 없습니다.
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* BOM 생성 다이얼로그 */}
      <Dialog open={isCreateBOMDialogOpen} onOpenChange={setIsCreateBOMDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>새 BOM 생성</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Simplified for now, needs proper form fields */}
            <p className="text-sm text-muted-foreground">
              새로운 설비 BOM을 생성합니다. 설비 정보, 버전 등을 입력하고, 필요시 템플릿을 선택할 수 있습니다. (세부
              구현 필요)
            </p>
            <div>
              <Label>설비 코드</Label>
              <Input defaultValue={`NEW-EQ-${Date.now() % 1000}`} />
            </div>
            <div>
              <Label>설비 명</Label>
              <Input defaultValue="새 설비 (BOM 생성)" />
            </div>
            <div>
              <Label>BOM 버전</Label>
              <Input defaultValue="v1.0" />
            </div>
            <div>
              <Label>템플릿 사용 (선택)</Label>
              <Select disabled>
                <SelectTrigger>
                  <SelectValue placeholder="템플릿 선택" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.templateName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">취소</Button>
            </DialogClose>
            <Button onClick={handleCreateBOM}>생성</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 부품 편집/추가 다이얼로그 */}
      <Dialog
        open={isEditItemDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setEditingItem(null) // Reset editing item when dialog closes
          }
          setIsEditItemDialogOpen(open)
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingItem?.isNew ? "새 부품 추가" : "부품 정보 편집"}</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                const data: Partial<BOMItem> = {
                  partCode: formData.get("partCode") as string,
                  partName: formData.get("partName") as string,
                  specification: formData.get("specification") as string,
                  quantity: Number(formData.get("quantity")),
                  unit: formData.get("unit") as string,
                  unitPrice: Number(formData.get("unitPrice")),
                  manufacturer: formData.get("manufacturer") as string,
                  model: formData.get("model") as string,
                  partType: formData.get("partType") as BOMItem["partType"],
                  leadTime: Number(formData.get("leadTime")),
                  minStock: Number(formData.get("minStock")),
                  currentStock: Number(formData.get("currentStock")),
                  supplier: formData.get("supplier") as string,
                  remarks: formData.get("remarks") as string,
                }
                handleSaveBOMItem(data)
              }}
            >
              <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="partCode">부품코드</Label>
                    <Input id="partCode" name="partCode" defaultValue={editingItem.partCode} required />
                  </div>
                  <div>
                    <Label htmlFor="partName">부품명</Label>
                    <Input id="partName" name="partName" defaultValue={editingItem.partName} required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="specification">사양</Label>
                  <Input id="specification" name="specification" defaultValue={editingItem.specification} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="quantity">수량</Label>
                    <Input
                      id="quantity"
                      name="quantity"
                      type="number"
                      defaultValue={editingItem.quantity}
                      min="0"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="unit">단위</Label>
                    <Input id="unit" name="unit" defaultValue={editingItem.unit} required />
                  </div>
                  <div>
                    <Label htmlFor="unitPrice">단가</Label>
                    <Input
                      id="unitPrice"
                      name="unitPrice"
                      type="number"
                      defaultValue={editingItem.unitPrice}
                      min="0"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="partType">부품 유형</Label>
                    <Select name="partType" defaultValue={editingItem.partType || "standard"}>
                      <SelectTrigger id="partType">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(partTypeLabels).map(([value, { label }]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="manufacturer">제조사</Label>
                    <Input id="manufacturer" name="manufacturer" defaultValue={editingItem.manufacturer} />
                  </div>
                  <div>
                    <Label htmlFor="model">모델</Label>
                    <Input id="model" name="model" defaultValue={editingItem.model} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="leadTime">리드타임(일)</Label>
                    <Input
                      id="leadTime"
                      name="leadTime"
                      type="number"
                      defaultValue={editingItem.leadTime || 0}
                      min="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="minStock">최소재고</Label>
                    <Input
                      id="minStock"
                      name="minStock"
                      type="number"
                      defaultValue={editingItem.minStock || 0}
                      min="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="currentStock">현재재고</Label>
                    <Input
                      id="currentStock"
                      name="currentStock"
                      type="number"
                      defaultValue={editingItem.currentStock || 0}
                      min="0"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="supplier">공급처</Label>
                  <Input id="supplier" name="supplier" defaultValue={editingItem.supplier} />
                </div>
                <div>
                  <Label htmlFor="remarks">비고</Label>
                  <Textarea id="remarks" name="remarks" defaultValue={editingItem.remarks} />
                </div>
              </div>
              <DialogFooter className="mt-4">
                <Button type="button" variant="outline" onClick={() => setIsEditItemDialogOpen(false)}>
                  취소
                </Button>
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" /> 저장
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
