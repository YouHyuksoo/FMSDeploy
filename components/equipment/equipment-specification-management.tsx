"use client"

import type React from "react"
import { AlertTitle } from "@/components/ui/alert"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { DatePicker } from "@/components/ui/date-picker" // DatePicker 추가
import {
  PlusCircle,
  Edit,
  Trash2,
  Save,
  ChevronsUpDown,
  FilePlus,
  ListChecks,
  ShieldCheck,
  BadgeCheck,
  AlertTriangle,
  Activity,
  Settings2,
} from "lucide-react"
import type {
  EquipmentSpecification,
  SpecificationGroup,
  SpecificationItem,
  PerformanceIndicator,
  OperatingCondition,
  SafetyStandard,
  Certification,
} from "@/types/equipment-specification"
import type { Equipment } from "@/types/equipment"
import { mockEquipment } from "@/lib/mock-data/equipment"
import { mockEquipmentSpecifications, mockSpecificationTemplates } from "@/lib/mock-data/equipment-specification"
import { useToast } from "@/hooks/use-toast"

const generateId = (prefix = "id") => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

export function EquipmentSpecificationManagement() {
  const { toast } = useToast()
  const [equipmentList] = useState<Equipment[]>(mockEquipment)
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | undefined>(undefined)
  const [allSpecifications, setAllSpecifications] = useState<EquipmentSpecification[]>(mockEquipmentSpecifications)

  const currentSpecification = useMemo(() => {
    if (!selectedEquipmentId) return undefined
    return allSpecifications.find((spec) => spec.equipmentId === selectedEquipmentId && spec.status === "active")
  }, [selectedEquipmentId, allSpecifications])

  const [activeTab, setActiveTab] = useState<string>("general")

  // --- General Specifications State & Handlers (from previous implementation) ---
  const [isSpecGroupDialogOpen, setIsSpecGroupDialogOpen] = useState(false)
  const [editingSpecGroup, setEditingSpecGroup] = useState<SpecificationGroup | null>(null)
  const [specGroupForm, setSpecGroupForm] = useState<{
    id?: string
    name: string
    category: SpecificationGroup["category"]
    order: number
  }>({ name: "", category: "technical", order: 0 })

  const [isSpecItemDialogOpen, setIsSpecItemDialogOpen] = useState(false)
  const [editingSpecItem, setEditingSpecItem] = useState<SpecificationItem | null>(null)
  const [currentSpecGroupId, setCurrentSpecGroupId] = useState<string | null>(null)
  const [specItemForm, setSpecItemForm] = useState<Partial<SpecificationItem>>({
    name: "",
    value: "",
    unit: "",
    dataType: "string",
    required: false,
    order: 0,
  })

  // --- Performance Indicator State & Handlers ---
  const [isPerfIndicatorDialogOpen, setIsPerfIndicatorDialogOpen] = useState(false)
  const [editingPerfIndicator, setEditingPerfIndicator] = useState<PerformanceIndicator | null>(null)
  const [perfIndicatorForm, setPerfIndicatorForm] = useState<Partial<PerformanceIndicator>>({
    name: "",
    targetValue: "",
    actualValue: "",
    unit: "",
    tolerance: "",
  })

  // --- Operating Condition State & Handlers ---
  const [isOpConditionDialogOpen, setIsOpConditionDialogOpen] = useState(false)
  const [editingOpCondition, setEditingOpCondition] = useState<OperatingCondition | null>(null)
  const [opConditionForm, setOpConditionForm] = useState<Partial<OperatingCondition>>({
    parameter: "",
    minValue: "",
    maxValue: "",
    optimalValue: "",
    unit: "",
  })

  // --- Safety Standard State & Handlers ---
  const [isSafetyStandardDialogOpen, setIsSafetyStandardDialogOpen] = useState(false)
  const [editingSafetyStandard, setEditingSafetyStandard] = useState<SafetyStandard | null>(null)
  const [safetyStandardForm, setSafetyStandardForm] = useState<Partial<SafetyStandard>>({
    standardName: "",
    description: "",
    compliant: false,
  })

  // --- Certification State & Handlers ---
  const [isCertificationDialogOpen, setIsCertificationDialogOpen] = useState(false)
  const [editingCertification, setEditingCertification] = useState<Certification | null>(null)
  const [certificationForm, setCertificationForm] = useState<Partial<Certification>>({
    certificationName: "",
    issuingBody: "",
    certificateNumber: "",
    validFrom: undefined,
    validTo: undefined,
  })

  useEffect(() => {
    if (selectedEquipmentId && !currentSpecification) {
      // Offer to create a new specification or load from template
    }
  }, [selectedEquipmentId, currentSpecification])

  const handleCreateNewSpecification = () => {
    if (!selectedEquipmentId) {
      toast({ title: "오류", description: "먼저 설비를 선택해주세요.", variant: "destructive" })
      return
    }
    const equipment = equipmentList.find((e) => e.id === selectedEquipmentId)
    if (!equipment) return
    const template = mockSpecificationTemplates.find((t) => t.equipmentType === equipment.type && t.isActive)
    const newSpec: EquipmentSpecification = {
      id: generateId("SPEC-" + equipment.code),
      equipmentId: equipment.id,
      equipmentCode: equipment.code,
      equipmentName: equipment.name,
      equipmentType: equipment.type,
      version: "1.0",
      status: "active",
      specifications: template ? JSON.parse(JSON.stringify(template.specificationGroups)) : [],
      performanceIndicators: template ? JSON.parse(JSON.stringify(template.performanceIndicators)) : [],
      operatingConditions: template ? JSON.parse(JSON.stringify(template.operatingConditions)) : [],
      safetyStandards: [],
      certifications: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: "current_user",
      updatedBy: "current_user",
    }
    setAllSpecifications((prev) => [...prev, newSpec])
    toast({
      title: "사양 생성됨",
      description: `${equipment.name}의 새 사양 버전 ${newSpec.version}이(가) 생성되었습니다.`,
    })
  }

  // General Spec Group Handlers (from previous)
  const handleOpenSpecGroupDialog = (group?: SpecificationGroup) => {
    if (group) {
      setEditingSpecGroup(group)
      setSpecGroupForm({ id: group.id, name: group.name, category: group.category, order: group.order })
    } else {
      setEditingSpecGroup(null)
      setSpecGroupForm({
        name: "",
        category: "technical",
        order: (currentSpecification?.specifications.length || 0) + 1,
      })
    }
    setIsSpecGroupDialogOpen(true)
  }

  const handleSaveSpecGroup = () => {
    if (!currentSpecification) return
    const updatedGroups = [...currentSpecification.specifications]
    if (editingSpecGroup) {
      const index = updatedGroups.findIndex((g) => g.id === editingSpecGroup.id)
      if (index > -1) {
        updatedGroups[index] = { ...editingSpecGroup, ...specGroupForm, items: updatedGroups[index].items }
      }
    } else {
      updatedGroups.push({ ...specGroupForm, id: generateId("sg"), items: [] })
    }
    setAllSpecifications((prev) =>
      prev.map((spec) =>
        spec.id === currentSpecification.id
          ? {
              ...spec,
              specifications: updatedGroups.sort((a, b) => a.order - b.order),
              updatedAt: new Date().toISOString(),
            }
          : spec,
      ),
    )
    setIsSpecGroupDialogOpen(false)
    toast({ title: "저장 완료", description: "사양 그룹이 저장되었습니다." })
  }

  const handleDeleteSpecGroup = (groupId: string) => {
    if (!currentSpecification) return
    const updatedGroups = currentSpecification.specifications.filter((g) => g.id !== groupId)
    setAllSpecifications((prev) =>
      prev.map((spec) =>
        spec.id === currentSpecification.id
          ? { ...spec, specifications: updatedGroups, updatedAt: new Date().toISOString() }
          : spec,
      ),
    )
    toast({ title: "삭제 완료", description: "사양 그룹이 삭제되었습니다." })
  }

  // General Spec Item Handlers (from previous)
  const handleOpenSpecItemDialog = (groupId: string, item?: SpecificationItem) => {
    setCurrentSpecGroupId(groupId)
    if (item) {
      setEditingSpecItem(item)
      setSpecItemForm({ ...item })
    } else {
      setEditingSpecItem(null)
      const group = currentSpecification?.specifications.find((g) => g.id === groupId)
      setSpecItemForm({
        name: "",
        value: "",
        unit: "",
        dataType: "string",
        required: false,
        order: (group?.items.length || 0) + 1,
      })
    }
    setIsSpecItemDialogOpen(true)
  }

  const handleSaveSpecItem = () => {
    if (!currentSpecification || !currentSpecGroupId) return
    const groupIndex = currentSpecification.specifications.findIndex((g) => g.id === currentSpecGroupId)
    if (groupIndex === -1) return
    const updatedGroups = [...currentSpecification.specifications]
    const targetGroup = { ...updatedGroups[groupIndex] }
    const updatedItems = [...targetGroup.items]
    if (editingSpecItem) {
      const itemIndex = updatedItems.findIndex((i) => i.id === editingSpecItem.id)
      if (itemIndex > -1) {
        updatedItems[itemIndex] = { ...editingSpecItem, ...specItemForm }
      }
    } else {
      updatedItems.push({ ...specItemForm, id: generateId("si") } as SpecificationItem)
    }
    targetGroup.items = updatedItems.sort((a, b) => a.order - b.order)
    updatedGroups[groupIndex] = targetGroup
    setAllSpecifications((prev) =>
      prev.map((spec) =>
        spec.id === currentSpecification.id
          ? { ...spec, specifications: updatedGroups, updatedAt: new Date().toISOString() }
          : spec,
      ),
    )
    setIsSpecItemDialogOpen(false)
    toast({ title: "저장 완료", description: "사양 항목이 저장되었습니다." })
  }

  const handleDeleteSpecItem = (groupId: string, itemId: string) => {
    if (!currentSpecification) return
    const groupIndex = currentSpecification.specifications.findIndex((g) => g.id === groupId)
    if (groupIndex === -1) return
    const updatedGroups = [...currentSpecification.specifications]
    const targetGroup = { ...updatedGroups[groupIndex] }
    targetGroup.items = targetGroup.items.filter((i) => i.id !== itemId)
    updatedGroups[groupIndex] = targetGroup
    setAllSpecifications((prev) =>
      prev.map((spec) =>
        spec.id === currentSpecification.id
          ? { ...spec, specifications: updatedGroups, updatedAt: new Date().toISOString() }
          : spec,
      ),
    )
    toast({ title: "삭제 완료", description: "사양 항목이 삭제되었습니다." })
  }

  // Generic CRUD Handlers for other tabs
  const createGenericHandler = <T extends { id: string }>(
    listName: keyof EquipmentSpecification,
    dialogSetter: React.Dispatch<React.SetStateAction<boolean>>,
    formSetter: React.Dispatch<React.SetStateAction<Partial<T>>>,
    editingSetter: React.Dispatch<React.SetStateAction<T | null>>,
    defaultFormValues: Partial<T>,
    toastTitle: string,
  ) => {
    const handleOpenDialog = (item?: T) => {
      if (item) {
        editingSetter(item)
        formSetter({ ...item })
      } else {
        editingSetter(null)
        formSetter({ ...defaultFormValues })
      }
      dialogSetter(true)
    }

    const handleSaveItem = (formValues: Partial<T>) => {
      if (!currentSpecification) return
      const currentList = (currentSpecification[listName] as T[] | undefined) || []
      let updatedList: T[]
      const editingItem = (formValues as T & { id?: string }).id // Check if it's an edit
        ? currentList.find((i) => i.id === (formValues as T & { id?: string }).id)
        : null

      if (editingItem) {
        updatedList = currentList.map((item) => (item.id === editingItem.id ? { ...item, ...formValues } : item))
      } else {
        updatedList = [...currentList, { ...formValues, id: generateId(listName.toString().substring(0, 3)) } as T]
      }

      setAllSpecifications((prev) =>
        prev.map((spec) =>
          spec.id === currentSpecification.id
            ? { ...spec, [listName]: updatedList, updatedAt: new Date().toISOString() }
            : spec,
        ),
      )
      dialogSetter(false)
      toast({ title: "저장 완료", description: `${toastTitle}이(가) 저장되었습니다.` })
    }

    const handleDeleteItem = (itemId: string) => {
      if (!currentSpecification) return
      const currentList = (currentSpecification[listName] as T[] | undefined) || []
      const updatedList = currentList.filter((item) => item.id !== itemId)
      setAllSpecifications((prev) =>
        prev.map((spec) =>
          spec.id === currentSpecification.id
            ? { ...spec, [listName]: updatedList, updatedAt: new Date().toISOString() }
            : spec,
        ),
      )
      toast({ title: "삭제 완료", description: `${toastTitle}이(가) 삭제되었습니다.` })
    }
    return { handleOpenDialog, handleSaveItem, handleDeleteItem }
  }

  const perfIndicatorHandlers = createGenericHandler<PerformanceIndicator>(
    "performanceIndicators",
    setIsPerfIndicatorDialogOpen,
    setPerfIndicatorForm,
    setEditingPerfIndicator,
    { name: "", targetValue: "", actualValue: "", unit: "", tolerance: "" },
    "성능 지표",
  )

  const opConditionHandlers = createGenericHandler<OperatingCondition>(
    "operatingConditions",
    setIsOpConditionDialogOpen,
    setOpConditionForm,
    setEditingOpCondition,
    { parameter: "", minValue: "", maxValue: "", optimalValue: "", unit: "" },
    "운전 조건",
  )

  const safetyStandardHandlers = createGenericHandler<SafetyStandard>(
    "safetyStandards",
    setIsSafetyStandardDialogOpen,
    setSafetyStandardForm,
    setEditingSafetyStandard,
    { standardName: "", description: "", compliant: false },
    "안전 기준",
  )

  const certificationHandlers = createGenericHandler<Certification>(
    "certifications",
    setIsCertificationDialogOpen,
    setCertificationForm,
    setEditingCertification,
    { certificationName: "", issuingBody: "", certificateNumber: "", validFrom: undefined, validTo: undefined },
    "인증 정보",
  )

  const dataTypeOptions: { value: SpecificationItem["dataType"]; label: string }[] = [
    { value: "string", label: "문자열" },
    { value: "number", label: "숫자" },
    { value: "boolean", label: "부울 (True/False)" },
    { value: "range", label: "범위 (예: 10-20)" },
  ]

  const specGroupCategoryOptions: { value: SpecificationGroup["category"]; label: string }[] = [
    { value: "technical", label: "기술 사양" },
    { value: "performance", label: "성능 사양" },
    { value: "physical", label: "물리적 사양" },
    { value: "electrical", label: "전기 사양" },
    { value: "mechanical", label: "기계 사양" },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>설비 사양 관리</CardTitle>
          <CardDescription>설비의 상세 사양, 성능 지표, 운전 조건 등을 관리합니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Label htmlFor="equipment-select" className="whitespace-nowrap">
              설비 선택:
            </Label>
            <Select value={selectedEquipmentId} onValueChange={setSelectedEquipmentId}>
              <SelectTrigger id="equipment-select" className="w-[300px]">
                <SelectValue placeholder="설비를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {equipmentList.map((eq) => (
                  <SelectItem key={eq.id} value={eq.id}>
                    {eq.name} ({eq.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedEquipmentId && !currentSpecification && (
              <Button onClick={handleCreateNewSpecification} variant="outline">
                <FilePlus className="mr-2 h-4 w-4" /> 이 설비의 새 사양 만들기
              </Button>
            )}
            {selectedEquipmentId && currentSpecification && (
              <span className="text-sm text-muted-foreground">
                현재 버전: {currentSpecification.version} (최종 수정:{" "}
                {new Date(currentSpecification.updatedAt).toLocaleString()})
              </span>
            )}
          </div>

          {!selectedEquipmentId ? (
            <Alert>
              <ChevronsUpDown className="h-4 w-4" />
              <AlertTitle>설비 미선택</AlertTitle>
              <AlertDescription>사양을 관리할 설비를 먼저 선택해주세요.</AlertDescription>
            </Alert>
          ) : !currentSpecification ? (
            <Alert variant="warning">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>사양 정보 없음</AlertTitle>
              <AlertDescription>
                선택된 설비에 대한 활성 사양 정보가 없습니다. "새 사양 만들기" 버튼을 클릭하여 생성할 수 있습니다.
              </AlertDescription>
            </Alert>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList>
                <TabsTrigger value="general">
                  <ListChecks className="mr-2 h-4 w-4" /> 일반 제원
                </TabsTrigger>
                <TabsTrigger value="performance">
                  <Activity className="mr-2 h-4 w-4" /> 성능 지표
                </TabsTrigger>
                <TabsTrigger value="operating">
                  <Settings2 className="mr-2 h-4 w-4" /> 운전 조건
                </TabsTrigger>
                <TabsTrigger value="safety">
                  <ShieldCheck className="mr-2 h-4 w-4" /> 안전 기준
                </TabsTrigger>
                <TabsTrigger value="certs">
                  <BadgeCheck className="mr-2 h-4 w-4" /> 인증 정보
                </TabsTrigger>
              </TabsList>

              {/* General Specifications Tab Content (from previous) */}
              <TabsContent value="general" className="mt-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold">사양 그룹 관리</h3>
                    <Button onClick={() => handleOpenSpecGroupDialog()}>
                      <PlusCircle className="mr-2 h-4 w-4" /> 새 그룹 추가
                    </Button>
                  </div>
                  {currentSpecification.specifications.length === 0 && (
                    <p className="text-muted-foreground">
                      등록된 사양 그룹이 없습니다. "새 그룹 추가" 버튼으로 시작하세요.
                    </p>
                  )}
                  {currentSpecification.specifications.map((group) => (
                    <Card key={group.id}>
                      <CardHeader className="flex flex-row items-center justify-between py-3 px-4 bg-muted/50">
                        <CardTitle className="text-lg">
                          {group.name}{" "}
                          <span className="text-sm font-normal text-muted-foreground">
                            (
                            {specGroupCategoryOptions.find((opt) => opt.value === group.category)?.label ||
                              group.category}
                            , 순서: {group.order})
                          </span>
                        </CardTitle>
                        <div className="space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleOpenSpecGroupDialog(group)}>
                            <Edit className="h-3 w-3 mr-1" /> 그룹 수정
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteSpecGroup(group.id)}>
                            <Trash2 className="h-3 w-3 mr-1" /> 그룹 삭제
                          </Button>
                          <Button size="sm" onClick={() => handleOpenSpecItemDialog(group.id)}>
                            <PlusCircle className="h-3 w-3 mr-1" /> 항목 추가
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4">
                        {group.items.length === 0 ? (
                          <p className="text-sm text-muted-foreground py-2">
                            이 그룹에 등록된 사양 항목이 없습니다. "항목 추가" 버튼으로 추가하세요.
                          </p>
                        ) : (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>항목명</TableHead>
                                <TableHead>값</TableHead>
                                <TableHead>단위</TableHead>
                                <TableHead>데이터 타입</TableHead>
                                <TableHead>필수</TableHead>
                                <TableHead>순서</TableHead>
                                <TableHead>설명</TableHead>
                                <TableHead className="text-right">작업</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {group.items.map((item) => (
                                <TableRow key={item.id}>
                                  <TableCell>{item.name}</TableCell>
                                  <TableCell>{String(item.value)}</TableCell>
                                  <TableCell>{item.unit}</TableCell>
                                  <TableCell>
                                    {dataTypeOptions.find((opt) => opt.value === item.dataType)?.label || item.dataType}
                                  </TableCell>
                                  <TableCell>{item.required ? "예" : "아니오"}</TableCell>
                                  <TableCell>{item.order}</TableCell>
                                  <TableCell className="max-w-xs truncate" title={item.description}>
                                    {item.description}
                                  </TableCell>
                                  <TableCell className="text-right space-x-1">
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="h-7 w-7"
                                      onClick={() => handleOpenSpecItemDialog(group.id, item)}
                                    >
                                      <Edit className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="h-7 w-7"
                                      onClick={() => handleDeleteSpecItem(group.id, item.id)}
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Performance Indicators Tab */}
              <TabsContent value="performance" className="mt-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">성능 지표 관리</h3>
                  <Button onClick={() => perfIndicatorHandlers.handleOpenDialog()}>
                    <PlusCircle className="mr-2 h-4 w-4" /> 새 지표 추가
                  </Button>
                </div>
                {currentSpecification.performanceIndicators.length === 0 ? (
                  <p className="text-muted-foreground">등록된 성능 지표가 없습니다.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>지표명</TableHead>
                        <TableHead>목표값</TableHead>
                        <TableHead>실제값</TableHead>
                        <TableHead>단위</TableHead>
                        <TableHead>허용오차</TableHead>
                        <TableHead className="text-right">작업</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentSpecification.performanceIndicators.map((pi) => (
                        <TableRow key={pi.id}>
                          <TableCell>{pi.name}</TableCell>
                          <TableCell>{pi.targetValue}</TableCell>
                          <TableCell>{pi.actualValue}</TableCell>
                          <TableCell>{pi.unit}</TableCell>
                          <TableCell>{pi.tolerance}</TableCell>
                          <TableCell className="text-right space-x-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => perfIndicatorHandlers.handleOpenDialog(pi)}
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => perfIndicatorHandlers.handleDeleteItem(pi.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </TabsContent>

              {/* Operating Conditions Tab */}
              <TabsContent value="operating" className="mt-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">운전 조건 관리</h3>
                  <Button onClick={() => opConditionHandlers.handleOpenDialog()}>
                    <PlusCircle className="mr-2 h-4 w-4" /> 새 조건 추가
                  </Button>
                </div>
                {currentSpecification.operatingConditions.length === 0 ? (
                  <p className="text-muted-foreground">등록된 운전 조건이 없습니다.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>파라미터</TableHead>
                        <TableHead>최소값</TableHead>
                        <TableHead>최대값</TableHead>
                        <TableHead>최적값</TableHead>
                        <TableHead>단위</TableHead>
                        <TableHead className="text-right">작업</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentSpecification.operatingConditions.map((oc) => (
                        <TableRow key={oc.id}>
                          <TableCell>{oc.parameter}</TableCell>
                          <TableCell>{oc.minValue}</TableCell>
                          <TableCell>{oc.maxValue}</TableCell>
                          <TableCell>{oc.optimalValue}</TableCell>
                          <TableCell>{oc.unit}</TableCell>
                          <TableCell className="text-right space-x-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => opConditionHandlers.handleOpenDialog(oc)}
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => opConditionHandlers.handleDeleteItem(oc.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </TabsContent>

              {/* Safety Standards Tab */}
              <TabsContent value="safety" className="mt-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">안전 기준 관리</h3>
                  <Button onClick={() => safetyStandardHandlers.handleOpenDialog()}>
                    <PlusCircle className="mr-2 h-4 w-4" /> 새 기준 추가
                  </Button>
                </div>
                {currentSpecification.safetyStandards.length === 0 ? (
                  <p className="text-muted-foreground">등록된 안전 기준이 없습니다.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>기준명</TableHead>
                        <TableHead>설명</TableHead>
                        <TableHead>준수 여부</TableHead>
                        <TableHead className="text-right">작업</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentSpecification.safetyStandards.map((ss) => (
                        <TableRow key={ss.id}>
                          <TableCell>{ss.standardName}</TableCell>
                          <TableCell className="max-w-md truncate" title={ss.description}>
                            {ss.description}
                          </TableCell>
                          <TableCell>{ss.compliant ? "준수" : "미준수"}</TableCell>
                          <TableCell className="text-right space-x-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => safetyStandardHandlers.handleOpenDialog(ss)}
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => safetyStandardHandlers.handleDeleteItem(ss.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </TabsContent>

              {/* Certifications Tab */}
              <TabsContent value="certs" className="mt-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">인증 정보 관리</h3>
                  <Button onClick={() => certificationHandlers.handleOpenDialog()}>
                    <PlusCircle className="mr-2 h-4 w-4" /> 새 인증 추가
                  </Button>
                </div>
                {currentSpecification.certifications.length === 0 ? (
                  <p className="text-muted-foreground">등록된 인증 정보가 없습니다.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>인증명</TableHead>
                        <TableHead>발급 기관</TableHead>
                        <TableHead>인증 번호</TableHead>
                        <TableHead>유효 시작일</TableHead>
                        <TableHead>유효 종료일</TableHead>
                        <TableHead className="text-right">작업</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentSpecification.certifications.map((cert) => (
                        <TableRow key={cert.id}>
                          <TableCell>{cert.certificationName}</TableCell>
                          <TableCell>{cert.issuingBody}</TableCell>
                          <TableCell>{cert.certificateNumber}</TableCell>
                          <TableCell>{cert.validFrom ? new Date(cert.validFrom).toLocaleDateString() : "-"}</TableCell>
                          <TableCell>{cert.validTo ? new Date(cert.validTo).toLocaleDateString() : "-"}</TableCell>
                          <TableCell className="text-right space-x-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => certificationHandlers.handleOpenDialog(cert)}
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => certificationHandlers.handleDeleteItem(cert.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>

      {/* Specification Group Dialog (from previous) */}
      <Dialog open={isSpecGroupDialogOpen} onOpenChange={setIsSpecGroupDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSpecGroup ? "사양 그룹 수정" : "새 사양 그룹 추가"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="group-name" className="text-right">
                그룹명
              </Label>
              <Input
                id="group-name"
                value={specGroupForm.name}
                onChange={(e) => setSpecGroupForm({ ...specGroupForm, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="group-category" className="text-right">
                카테고리
              </Label>
              <Select
                value={specGroupForm.category}
                onValueChange={(value: SpecificationGroup["category"]) =>
                  setSpecGroupForm({ ...specGroupForm, category: value })
                }
              >
                <SelectTrigger id="group-category" className="col-span-3">
                  <SelectValue placeholder="카테고리 선택" />
                </SelectTrigger>
                <SelectContent>
                  {specGroupCategoryOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="group-order" className="text-right">
                순서
              </Label>
              <Input
                id="group-order"
                type="number"
                value={specGroupForm.order}
                onChange={(e) => setSpecGroupForm({ ...specGroupForm, order: Number.parseInt(e.target.value) || 0 })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">취소</Button>
            </DialogClose>
            <Button onClick={handleSaveSpecGroup}>
              <Save className="mr-2 h-4 w-4" /> 저장
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Specification Item Dialog (from previous) */}
      <Dialog open={isSpecItemDialogOpen} onOpenChange={setIsSpecItemDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingSpecItem ? "사양 항목 수정" : "새 사양 항목 추가"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="item-name" className="text-right">
                항목명
              </Label>
              <Input
                id="item-name"
                value={specItemForm.name || ""}
                onChange={(e) => setSpecItemForm({ ...specItemForm, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="item-value" className="text-right">
                값
              </Label>
              <Input
                id="item-value"
                value={(specItemForm.value as string) || ""}
                onChange={(e) => setSpecItemForm({ ...specItemForm, value: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="item-unit" className="text-right">
                단위
              </Label>
              <Input
                id="item-unit"
                value={specItemForm.unit || ""}
                onChange={(e) => setSpecItemForm({ ...specItemForm, unit: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="item-dataType" className="text-right">
                데이터 타입
              </Label>
              <Select
                value={specItemForm.dataType}
                onValueChange={(value: SpecificationItem["dataType"]) =>
                  setSpecItemForm({ ...specItemForm, dataType: value })
                }
              >
                <SelectTrigger id="item-dataType" className="col-span-3">
                  <SelectValue placeholder="데이터 타입 선택" />
                </SelectTrigger>
                <SelectContent>
                  {dataTypeOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="item-required" className="text-right">
                필수 여부
              </Label>
              <div className="col-span-3 flex items-center">
                <input
                  type="checkbox"
                  id="item-required"
                  checked={specItemForm.required || false}
                  onChange={(e) => setSpecItemForm({ ...specItemForm, required: e.target.checked })}
                  className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="item-order" className="text-right">
                순서
              </Label>
              <Input
                id="item-order"
                type="number"
                value={specItemForm.order || 0}
                onChange={(e) => setSpecItemForm({ ...specItemForm, order: Number.parseInt(e.target.value) || 0 })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="item-description" className="text-right">
                설명
              </Label>
              <Textarea
                id="item-description"
                value={specItemForm.description || ""}
                onChange={(e) => setSpecItemForm({ ...specItemForm, description: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">취소</Button>
            </DialogClose>
            <Button onClick={handleSaveSpecItem}>
              <Save className="mr-2 h-4 w-4" /> 저장
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Performance Indicator Dialog */}
      <Dialog open={isPerfIndicatorDialogOpen} onOpenChange={setIsPerfIndicatorDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingPerfIndicator ? "성능 지표 수정" : "새 성능 지표 추가"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="pi-name" className="text-right">
                지표명
              </Label>
              <Input
                id="pi-name"
                value={perfIndicatorForm.name || ""}
                onChange={(e) => setPerfIndicatorForm({ ...perfIndicatorForm, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="pi-targetValue" className="text-right">
                목표값
              </Label>
              <Input
                id="pi-targetValue"
                value={perfIndicatorForm.targetValue || ""}
                onChange={(e) => setPerfIndicatorForm({ ...perfIndicatorForm, targetValue: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="pi-actualValue" className="text-right">
                실제값
              </Label>
              <Input
                id="pi-actualValue"
                value={perfIndicatorForm.actualValue || ""}
                onChange={(e) => setPerfIndicatorForm({ ...perfIndicatorForm, actualValue: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="pi-unit" className="text-right">
                단위
              </Label>
              <Input
                id="pi-unit"
                value={perfIndicatorForm.unit || ""}
                onChange={(e) => setPerfIndicatorForm({ ...perfIndicatorForm, unit: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="pi-tolerance" className="text-right">
                허용오차
              </Label>
              <Input
                id="pi-tolerance"
                value={perfIndicatorForm.tolerance || ""}
                onChange={(e) => setPerfIndicatorForm({ ...perfIndicatorForm, tolerance: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">취소</Button>
            </DialogClose>
            <Button onClick={() => perfIndicatorHandlers.handleSaveItem(perfIndicatorForm)}>
              <Save className="mr-2 h-4 w-4" /> 저장
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Operating Condition Dialog */}
      <Dialog open={isOpConditionDialogOpen} onOpenChange={setIsOpConditionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingOpCondition ? "운전 조건 수정" : "새 운전 조건 추가"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="oc-parameter" className="text-right">
                파라미터
              </Label>
              <Input
                id="oc-parameter"
                value={opConditionForm.parameter || ""}
                onChange={(e) => setOpConditionForm({ ...opConditionForm, parameter: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="oc-minValue" className="text-right">
                최소값
              </Label>
              <Input
                id="oc-minValue"
                value={opConditionForm.minValue || ""}
                onChange={(e) => setOpConditionForm({ ...opConditionForm, minValue: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="oc-maxValue" className="text-right">
                최대값
              </Label>
              <Input
                id="oc-maxValue"
                value={opConditionForm.maxValue || ""}
                onChange={(e) => setOpConditionForm({ ...opConditionForm, maxValue: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="oc-optimalValue" className="text-right">
                최적값
              </Label>
              <Input
                id="oc-optimalValue"
                value={opConditionForm.optimalValue || ""}
                onChange={(e) => setOpConditionForm({ ...opConditionForm, optimalValue: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="oc-unit" className="text-right">
                단위
              </Label>
              <Input
                id="oc-unit"
                value={opConditionForm.unit || ""}
                onChange={(e) => setOpConditionForm({ ...opConditionForm, unit: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">취소</Button>
            </DialogClose>
            <Button onClick={() => opConditionHandlers.handleSaveItem(opConditionForm)}>
              <Save className="mr-2 h-4 w-4" /> 저장
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Safety Standard Dialog */}
      <Dialog open={isSafetyStandardDialogOpen} onOpenChange={setIsSafetyStandardDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSafetyStandard ? "안전 기준 수정" : "새 안전 기준 추가"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ss-standardName" className="text-right">
                기준명
              </Label>
              <Input
                id="ss-standardName"
                value={safetyStandardForm.standardName || ""}
                onChange={(e) => setSafetyStandardForm({ ...safetyStandardForm, standardName: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ss-description" className="text-right">
                설명
              </Label>
              <Textarea
                id="ss-description"
                value={safetyStandardForm.description || ""}
                onChange={(e) => setSafetyStandardForm({ ...safetyStandardForm, description: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ss-compliant" className="text-right">
                준수 여부
              </Label>
              <div className="col-span-3 flex items-center">
                <input
                  type="checkbox"
                  id="ss-compliant"
                  checked={safetyStandardForm.compliant || false}
                  onChange={(e) => setSafetyStandardForm({ ...safetyStandardForm, compliant: e.target.checked })}
                  className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">취소</Button>
            </DialogClose>
            <Button onClick={() => safetyStandardHandlers.handleSaveItem(safetyStandardForm)}>
              <Save className="mr-2 h-4 w-4" /> 저장
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Certification Dialog */}
      <Dialog open={isCertificationDialogOpen} onOpenChange={setIsCertificationDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCertification ? "인증 정보 수정" : "새 인증 정보 추가"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cert-name" className="text-right">
                인증명
              </Label>
              <Input
                id="cert-name"
                value={certificationForm.certificationName || ""}
                onChange={(e) => setCertificationForm({ ...certificationForm, certificationName: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cert-issuingBody" className="text-right">
                발급 기관
              </Label>
              <Input
                id="cert-issuingBody"
                value={certificationForm.issuingBody || ""}
                onChange={(e) => setCertificationForm({ ...certificationForm, issuingBody: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cert-number" className="text-right">
                인증 번호
              </Label>
              <Input
                id="cert-number"
                value={certificationForm.certificateNumber || ""}
                onChange={(e) => setCertificationForm({ ...certificationForm, certificateNumber: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cert-validFrom" className="text-right">
                유효 시작일
              </Label>
              <DatePicker
                date={certificationForm.validFrom ? new Date(certificationForm.validFrom) : undefined}
                setDate={(date) =>
                  setCertificationForm({ ...certificationForm, validFrom: date ? date.toISOString() : undefined })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cert-validTo" className="text-right">
                유효 종료일
              </Label>
              <DatePicker
                date={certificationForm.validTo ? new Date(certificationForm.validTo) : undefined}
                setDate={(date) =>
                  setCertificationForm({ ...certificationForm, validTo: date ? date.toISOString() : undefined })
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">취소</Button>
            </DialogClose>
            <Button onClick={() => certificationHandlers.handleSaveItem(certificationForm)}>
              <Save className="mr-2 h-4 w-4" /> 저장
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
