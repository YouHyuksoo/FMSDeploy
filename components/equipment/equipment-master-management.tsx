"use client"

import React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Edit, Trash2, Settings, ListTree, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type {
  EquipmentMaster,
  EquipmentType,
  EquipmentProperty,
  EquipmentCategory,
  EquipmentCodeRule,
  EquipmentCodeSegment,
} from "@/types/equipment-master" // Ensure this path is correct
import { mockEquipmentMasterData } from "@/lib/mock-data/equipment-master" // Ensure this path is correct
import { mockEquipmentTypes, mockEquipmentCategories, mockEquipmentCodeRules } from "@/lib/mock-data/equipment-master"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const initialEquipmentMaster: EquipmentMaster = {
  id: "",
  equipmentId: "",
  equipmentName: "",
  model: "",
  manufacturer: "",
  serialNumber: "",
  installationDate: new Date(),
  status: "active",
  location: "",
  department: "",
  description: "",
  purchaseDate: new Date(),
  purchasePrice: 0,
  warrantyExpiryDate: new Date(),
  lastMaintenanceDate: new Date(),
  nextMaintenanceDate: new Date(),
  customFields: {},
}

// --- 설비 유형 관리 ---
const initialEquipmentType: EquipmentType = {
  id: "",
  code: "",
  name: "",
  description: "",
  icon: "",
  properties: [],
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  createdBy: "system",
  updatedBy: "system",
}

const initialEquipmentProperty: EquipmentProperty = {
  id: "",
  code: "",
  name: "",
  dataType: "string",
  required: false,
  order: 0,
  isActive: true,
}

function EquipmentTypeManagementTab() {
  const { toast } = useToast()
  const [types, setTypes] = useState<EquipmentType[]>([])
  const [isTypeFormOpen, setIsTypeFormOpen] = useState(false)
  const [currentType, setCurrentType] = useState<EquipmentType | null>(null)
  const [typeFormData, setTypeFormData] = useState<EquipmentType>(initialEquipmentType)

  useEffect(() => {
    setTypes(mockEquipmentTypes)
  }, [])

  useEffect(() => {
    if (currentType) {
      setTypeFormData(currentType)
    } else {
      setTypeFormData(initialEquipmentType)
    }
  }, [currentType])

  const handleTypeInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setTypeFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleTypeCheckboxChange = (name: keyof EquipmentType, checked: boolean) => {
    setTypeFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handlePropertyChange = (index: number, field: keyof EquipmentProperty, value: string | boolean | number) => {
    const newProperties = [...(typeFormData.properties || [])]
    // @ts-ignore
    newProperties[index][field] = value
    setTypeFormData((prev) => ({ ...prev, properties: newProperties }))
  }

  const addProperty = () => {
    const newProperty: EquipmentProperty = {
      ...initialEquipmentProperty,
      id: `prop-${Date.now()}`,
      order: (typeFormData.properties?.length || 0) + 1,
    }
    setTypeFormData((prev) => ({ ...prev, properties: [...(prev.properties || []), newProperty] }))
  }

  const removeProperty = (index: number) => {
    setTypeFormData((prev) => ({
      ...prev,
      properties: (prev.properties || []).filter((_, i) => i !== index),
    }))
  }

  const handleTypeFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (currentType) {
      setTypes(
        types.map((t) =>
          t.id === currentType.id ? { ...typeFormData, id: currentType.id, updatedAt: new Date().toISOString() } : t,
        ),
      )
      toast({ title: "성공", description: "설비 유형이 수정되었습니다." })
    } else {
      const newType = {
        ...typeFormData,
        id: `type-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setTypes([...types, newType])
      toast({ title: "성공", description: "새로운 설비 유형이 추가되었습니다." })
    }
    setIsTypeFormOpen(false)
    setCurrentType(null)
  }

  const openNewTypeForm = () => {
    setCurrentType(null)
    setTypeFormData(initialEquipmentType)
    setIsTypeFormOpen(true)
  }

  const handleEditType = (type: EquipmentType) => {
    setCurrentType(type)
    setIsTypeFormOpen(true)
  }

  const handleDeleteType = (id: string) => {
    // Add confirmation dialog in real app
    setTypes(types.filter((t) => t.id !== id))
    toast({ title: "성공", description: "설비 유형이 삭제되었습니다." })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">설비 유형 목록</h3>
        <Button onClick={openNewTypeForm}>
          <PlusCircle className="mr-2 h-4 w-4" /> 새 유형 추가
        </Button>
      </div>
      <ScrollArea className="h-[calc(100vh-350px)]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>코드</TableHead>
              <TableHead>이름</TableHead>
              <TableHead>속성 수</TableHead>
              <TableHead>활성</TableHead>
              <TableHead>작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {types.map((type) => (
              <TableRow key={type.id}>
                <TableCell>{type.code}</TableCell>
                <TableCell>{type.name}</TableCell>
                <TableCell>{type.properties?.length || 0}</TableCell>
                <TableCell>{type.isActive ? "예" : "아니오"}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditType(type)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteType(type.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>

      <Dialog
        open={isTypeFormOpen}
        onOpenChange={(isOpen) => {
          setIsTypeFormOpen(isOpen)
          if (!isOpen) setCurrentType(null)
        }}
      >
        <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
          <ScrollArea className="max-h-[85vh]">
            <DialogHeader className="pr-6">
              <DialogTitle>{currentType ? "설비 유형 수정" : "새 설비 유형 추가"}</DialogTitle>
              <DialogDescription>설비 유형의 정보를 입력하고 관리합니다.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleTypeFormSubmit} className="grid gap-4 py-4 pr-6">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type-code" className="text-right">
                  코드
                </Label>
                <Input
                  id="type-code"
                  name="code"
                  value={typeFormData.code}
                  onChange={handleTypeInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type-name" className="text-right">
                  이름
                </Label>
                <Input
                  id="type-name"
                  name="name"
                  value={typeFormData.name}
                  onChange={handleTypeInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type-description" className="text-right">
                  설명
                </Label>
                <Textarea
                  id="type-description"
                  name="description"
                  value={typeFormData.description || ""}
                  onChange={handleTypeInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type-icon" className="text-right">
                  아이콘
                </Label>
                <Input
                  id="type-icon"
                  name="icon"
                  value={typeFormData.icon || ""}
                  onChange={handleTypeInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type-isActive" className="text-right">
                  활성
                </Label>
                <Checkbox
                  id="type-isActive"
                  name="isActive"
                  checked={typeFormData.isActive}
                  onCheckedChange={(checked) => handleTypeCheckboxChange("isActive", !!checked)}
                  className="col-span-3"
                />
              </div>

              <h4 className="font-medium mt-4 col-span-4">속성 관리</h4>
              {typeFormData.properties?.map((prop, index) => (
                <div
                  key={prop.id || index}
                  className="col-span-4 grid grid-cols-1 md:grid-cols-12 gap-2 border p-2 rounded"
                >
                  <Input
                    placeholder="속성코드"
                    value={prop.code}
                    onChange={(e) => handlePropertyChange(index, "code", e.target.value)}
                    className="md:col-span-2"
                  />
                  <Input
                    placeholder="속성이름"
                    value={prop.name}
                    onChange={(e) => handlePropertyChange(index, "name", e.target.value)}
                    className="md:col-span-3"
                  />
                  <Select
                    value={prop.dataType}
                    onValueChange={(value) => handlePropertyChange(index, "dataType", value)}
                  >
                    <SelectTrigger className="md:col-span-2">
                      <SelectValue placeholder="타입" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="string">문자열</SelectItem>
                      <SelectItem value="number">숫자</SelectItem>
                      <SelectItem value="boolean">부울</SelectItem>
                      <SelectItem value="date">날짜</SelectItem>
                      <SelectItem value="select">선택</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder="순서"
                    value={prop.order}
                    onChange={(e) => handlePropertyChange(index, "order", Number.parseInt(e.target.value))}
                    className="md:col-span-1"
                  />
                  <div className="md:col-span-2 flex items-center gap-2">
                    <Checkbox
                      checked={prop.required}
                      onCheckedChange={(checked) => handlePropertyChange(index, "required", !!checked)}
                    />{" "}
                    <Label>필수</Label>
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeProperty(index)}
                    className="md:col-span-2"
                  >
                    삭제
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addProperty} className="col-span-4">
                <PlusCircle className="mr-2 h-4 w-4" /> 속성 추가
              </Button>
              <DialogFooter className="col-span-4">
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    취소
                  </Button>
                </DialogClose>
                <Button type="submit">저장</Button>
              </DialogFooter>
            </form>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// --- 설비 분류 관리 ---
// (간단한 예시로, 실제로는 트리 구조 렌더링 및 편집이 필요)
function EquipmentCategoryManagementTab() {
  const { toast } = useToast()
  const [categories, setCategories] = useState<EquipmentCategory[]>([])
  // TODO: Implement form state and handlers for categories

  useEffect(() => {
    setCategories(mockEquipmentCategories)
  }, [])

  // Recursive function to render categories
  const renderCategories = (cats: EquipmentCategory[], level = 0) => {
    return cats.map((category) => (
      <React.Fragment key={category.id}>
        <TableRow>
          <TableCell style={{ paddingLeft: `${level * 20}px` }}>{category.code}</TableCell>
          <TableCell>{category.name}</TableCell>
          <TableCell>{category.isActive ? "예" : "아니오"}</TableCell>
          <TableCell>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast({ title: "알림", description: "분류 수정 기능은 준비 중입니다." })}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => toast({ title: "알림", description: "분류 삭제 기능은 준비 중입니다." })}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
        {category.children && category.children.length > 0 && renderCategories(category.children, level + 1)}
      </React.Fragment>
    ))
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">설비 분류 목록</h3>
        <Button onClick={() => toast({ title: "알림", description: "새 분류 추가 기능은 준비 중입니다." })}>
          <PlusCircle className="mr-2 h-4 w-4" /> 새 분류 추가
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        설비 분류는 계층 구조로 관리됩니다. 상세 편집 기능은 현재 준비 중입니다.
      </p>
      <ScrollArea className="h-[calc(100vh-350px)]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>코드</TableHead>
              <TableHead>이름</TableHead>
              <TableHead>활성</TableHead>
              <TableHead>작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>{renderCategories(categories)}</TableBody>
        </Table>
      </ScrollArea>
    </div>
  )
}

// --- 설비 코드 규칙 관리 ---
const initialCodeRule: EquipmentCodeRule = {
  id: "",
  name: "",
  prefix: "",
  separator: "-",
  segments: [],
  example: "",
  isActive: true,
  appliedTo: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

const initialCodeSegment: EquipmentCodeSegment = {
  id: "",
  type: "fixed",
  length: 0,
}

function EquipmentCodeRuleManagementTab() {
  const { toast } = useToast()
  const [rules, setRules] = useState<EquipmentCodeRule[]>([])
  const [isRuleFormOpen, setIsRuleFormOpen] = useState(false)
  const [currentRule, setCurrentRule] = useState<EquipmentCodeRule | null>(null)
  const [ruleFormData, setRuleFormData] = useState<EquipmentCodeRule>(initialCodeRule)

  useEffect(() => {
    setRules(mockEquipmentCodeRules)
  }, [])

  useEffect(() => {
    if (currentRule) {
      setRuleFormData(currentRule)
    } else {
      setRuleFormData(initialCodeRule)
    }
  }, [currentRule])

  const handleRuleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setRuleFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRuleCheckboxChange = (name: keyof EquipmentCodeRule, checked: boolean) => {
    setRuleFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSegmentChange = (index: number, field: keyof EquipmentCodeSegment, value: string | number) => {
    const newSegments = [...(ruleFormData.segments || [])]
    // @ts-ignore
    newSegments[index][field] = value
    setRuleFormData((prev) => ({ ...prev, segments: newSegments }))
  }

  const addSegment = () => {
    const newSegment: EquipmentCodeSegment = {
      ...initialCodeSegment,
      id: `seg-${Date.now()}`,
    }
    setRuleFormData((prev) => ({ ...prev, segments: [...(prev.segments || []), newSegment] }))
  }

  const removeSegment = (index: number) => {
    setRuleFormData((prev) => ({
      ...prev,
      segments: (prev.segments || []).filter((_, i) => i !== index),
    }))
  }

  const handleRuleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Add validation
    if (currentRule) {
      setRules(
        rules.map((r) =>
          r.id === currentRule.id ? { ...ruleFormData, id: currentRule.id, updatedAt: new Date().toISOString() } : r,
        ),
      )
      toast({ title: "성공", description: "설비 코드 규칙이 수정되었습니다." })
    } else {
      const newRule = {
        ...ruleFormData,
        id: `rule-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setRules([...rules, newRule])
      toast({ title: "성공", description: "새로운 설비 코드 규칙이 추가되었습니다." })
    }
    setIsRuleFormOpen(false)
    setCurrentRule(null)
  }

  const openNewRuleForm = () => {
    setCurrentRule(null)
    setRuleFormData(initialCodeRule)
    setIsRuleFormOpen(true)
  }

  const handleEditRule = (rule: EquipmentCodeRule) => {
    setCurrentRule(rule)
    setIsRuleFormOpen(true)
  }

  const handleDeleteRule = (id: string) => {
    setRules(rules.filter((r) => r.id !== id))
    toast({ title: "성공", description: "설비 코드 규칙이 삭제되었습니다." })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">설비 코드 규칙 목록</h3>
        <Button onClick={openNewRuleForm}>
          <PlusCircle className="mr-2 h-4 w-4" /> 새 규칙 추가
        </Button>
      </div>
      <ScrollArea className="h-[calc(100vh-350px)]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>이름</TableHead>
              <TableHead>접두사</TableHead>
              <TableHead>구분자</TableHead>
              <TableHead>예시</TableHead>
              <TableHead>활성</TableHead>
              <TableHead>작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rules.map((rule) => (
              <TableRow key={rule.id}>
                <TableCell>{rule.name}</TableCell>
                <TableCell>{rule.prefix}</TableCell>
                <TableCell>{rule.separator}</TableCell>
                <TableCell>{rule.example}</TableCell>
                <TableCell>{rule.isActive ? "예" : "아니오"}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditRule(rule)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteRule(rule.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
      <Dialog
        open={isRuleFormOpen}
        onOpenChange={(isOpen) => {
          setIsRuleFormOpen(isOpen)
          if (!isOpen) setCurrentRule(null)
        }}
      >
        <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
          <ScrollArea className="max-h-[85vh]">
            <DialogHeader className="pr-6">
              <DialogTitle>{currentRule ? "코드 규칙 수정" : "새 코드 규칙 추가"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleRuleFormSubmit} className="grid gap-4 py-4 pr-6">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="rule-name" className="text-right">
                  규칙 이름
                </Label>
                <Input
                  id="rule-name"
                  name="name"
                  value={ruleFormData.name}
                  onChange={handleRuleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="rule-prefix" className="text-right">
                  접두사
                </Label>
                <Input
                  id="rule-prefix"
                  name="prefix"
                  value={ruleFormData.prefix}
                  onChange={handleRuleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="rule-separator" className="text-right">
                  구분자
                </Label>
                <Input
                  id="rule-separator"
                  name="separator"
                  value={ruleFormData.separator}
                  onChange={handleRuleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="rule-example" className="text-right">
                  예시
                </Label>
                <Input
                  id="rule-example"
                  name="example"
                  value={ruleFormData.example}
                  onChange={handleRuleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="rule-isActive" className="text-right">
                  활성
                </Label>
                <Checkbox
                  id="rule-isActive"
                  name="isActive"
                  checked={ruleFormData.isActive}
                  onCheckedChange={(checked) => handleRuleCheckboxChange("isActive", !!checked)}
                />
              </div>

              <h4 className="font-medium mt-4 col-span-4">세그먼트 관리</h4>
              {ruleFormData.segments?.map((seg, index) => (
                <div
                  key={seg.id || index}
                  className="col-span-4 grid grid-cols-1 md:grid-cols-12 gap-2 border p-2 rounded"
                >
                  <Select value={seg.type} onValueChange={(value) => handleSegmentChange(index, "type", value)}>
                    <SelectTrigger className="md:col-span-3">
                      <SelectValue placeholder="세그먼트 타입" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">고정값</SelectItem>
                      <SelectItem value="category">분류코드</SelectItem>
                      <SelectItem value="sequence">일련번호</SelectItem>
                      <SelectItem value="location">위치코드</SelectItem>
                      <SelectItem value="year">연도</SelectItem>
                      <SelectItem value="month">월</SelectItem>
                      <SelectItem value="custom">사용자정의</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="값 (고정값용)"
                    value={seg.value || ""}
                    onChange={(e) => handleSegmentChange(index, "value", e.target.value)}
                    className="md:col-span-3"
                  />
                  <Input
                    type="number"
                    placeholder="길이"
                    value={seg.length}
                    onChange={(e) => handleSegmentChange(index, "length", Number.parseInt(e.target.value))}
                    className="md:col-span-2"
                  />
                  <Input
                    placeholder="채움문자"
                    value={seg.padChar || ""}
                    onChange={(e) => handleSegmentChange(index, "padChar", e.target.value)}
                    className="md:col-span-2"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeSegment(index)}
                    className="md:col-span-2"
                  >
                    삭제
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addSegment} className="col-span-4">
                <PlusCircle className="mr-2 h-4 w-4" /> 세그먼트 추가
              </Button>

              {/* TODO: Add appliedTo (적용 대상 설비 유형) selection */}

              <DialogFooter className="col-span-4">
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    취소
                  </Button>
                </DialogClose>
                <Button type="submit">저장</Button>
              </DialogFooter>
            </form>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export function EquipmentMasterManagement() {
  const [equipmentList, setEquipmentList] = useState<EquipmentMaster[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [currentEquipment, setCurrentEquipment] = useState<EquipmentMaster | null>(null)
  const [formData, setFormData] = useState<EquipmentMaster>(initialEquipmentMaster)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    setEquipmentList(mockEquipmentMasterData)
  }, [])

  useEffect(() => {
    if (currentEquipment) {
      setFormData(currentEquipment)
    } else {
      setFormData(initialEquipmentMaster)
    }
  }, [currentEquipment])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (name: keyof EquipmentMaster, date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({ ...prev, [name]: date }))
    }
  }

  const handleSelectChange = (name: keyof EquipmentMaster, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (currentEquipment) {
      setEquipmentList(
        equipmentList.map((eq) => (eq.id === currentEquipment.id ? { ...formData, id: currentEquipment.id } : eq)),
      )
    } else {
      setEquipmentList([
        ...equipmentList,
        {
          ...formData,
          id: `eqm-${Date.now()}`,
          equipmentId: `EQP-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
        },
      ])
    }
    setIsFormOpen(false)
    setCurrentEquipment(null)
  }

  const handleEdit = (equipment: EquipmentMaster) => {
    setCurrentEquipment(equipment)
    setIsFormOpen(true)
  }

  const handleDelete = (id: string) => {
    setEquipmentList(equipmentList.filter((eq) => eq.id !== id))
    // In a real app, add confirmation dialog
  }

  const openNewForm = () => {
    setCurrentEquipment(null)
    setFormData(initialEquipmentMaster)
    setIsFormOpen(true)
  }

  const filteredEquipment = equipmentList
    .filter(
      (eq) =>
        eq.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        eq.equipmentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (eq.model && eq.model.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (eq.manufacturer && eq.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())),
    )
    .filter((eq) => statusFilter === "all" || eq.status === statusFilter)

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl font-bold tracking-tight mb-1">설비 마스터 기준정보 관리</h2>
      <p className="text-sm text-muted-foreground mb-6">
        시스템에서 사용되는 설비의 유형, 분류 체계, 코드 생성 규칙 등 기준 정보를 관리합니다.
      </p>
      <Tabs defaultValue="types">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="types">
            <Settings className="mr-2 h-4 w-4 inline-block" />
            설비 유형
          </TabsTrigger>
          <TabsTrigger value="categories">
            <ListTree className="mr-2 h-4 w-4 inline-block" />
            설비 분류
          </TabsTrigger>
          <TabsTrigger value="code-rules">
            <FileText className="mr-2 h-4 w-4 inline-block" />
            코드 규칙
          </TabsTrigger>
        </TabsList>
        <TabsContent value="types">
          <EquipmentTypeManagementTab />
        </TabsContent>
        <TabsContent value="categories">
          <EquipmentCategoryManagementTab />
        </TabsContent>
        <TabsContent value="code-rules">
          <EquipmentCodeRuleManagementTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
