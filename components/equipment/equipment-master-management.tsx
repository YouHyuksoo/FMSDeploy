"use client";

import React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PlusCircle,
  Edit,
  Trash2,
  Settings,
  ListTree,
  FileText,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type {
  EquipmentMaster,
  EquipmentType,
  EquipmentProperty,
  EquipmentCategory,
  EquipmentCodeRule,
  EquipmentCodeSegment,
} from "@/types/equipment-master"; // Ensure this path is correct
import { mockEquipmentMasterData } from "@/lib/mock-data/equipment-master"; // Ensure this path is correct
import {
  mockEquipmentTypes,
  mockEquipmentCategories,
  mockEquipmentCodeRules,
} from "@/lib/mock-data/equipment-master";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/common/data-table";
import { useTranslation } from "@/lib/language-context";

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
};

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
};

const initialEquipmentProperty: EquipmentProperty = {
  id: "",
  code: "",
  name: "",
  dataType: "string",
  required: false,
  order: 0,
  isActive: true,
};

function EquipmentTypeManagementTab() {
  const { toast } = useToast();
  const { t } = useTranslation("equipment");
  const [types, setTypes] = useState<EquipmentType[]>([]);
  const [isTypeFormOpen, setIsTypeFormOpen] = useState(false);
  const [currentType, setCurrentType] = useState<EquipmentType | null>(null);
  const [typeFormData, setTypeFormData] =
    useState<EquipmentType>(initialEquipmentType);

  useEffect(() => {
    setTypes(mockEquipmentTypes);
  }, []);

  useEffect(() => {
    if (currentType) {
      setTypeFormData(currentType);
    } else {
      setTypeFormData(initialEquipmentType);
    }
  }, [currentType]);

  const handleTypeInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTypeFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeCheckboxChange = (
    name: keyof EquipmentType,
    checked: boolean
  ) => {
    setTypeFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handlePropertyChange = (
    index: number,
    field: keyof EquipmentProperty,
    value: string | boolean | number
  ) => {
    const newProperties = [...(typeFormData.properties || [])];
    // @ts-ignore
    newProperties[index][field] = value;
    setTypeFormData((prev) => ({ ...prev, properties: newProperties }));
  };

  const addProperty = () => {
    const newProperty: EquipmentProperty = {
      ...initialEquipmentProperty,
      id: `prop-${Date.now()}`,
      order: (typeFormData.properties?.length || 0) + 1,
    };
    setTypeFormData((prev) => ({
      ...prev,
      properties: [...(prev.properties || []), newProperty],
    }));
  };

  const removeProperty = (index: number) => {
    setTypeFormData((prev) => ({
      ...prev,
      properties: (prev.properties || []).filter((_, i) => i !== index),
    }));
  };

  const handleTypeFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentType) {
      setTypes(
        types.map((t) =>
          t.id === currentType.id
            ? {
                ...typeFormData,
                id: currentType.id,
                updatedAt: new Date().toISOString(),
              }
            : t
        )
      );
      toast({ title: "성공", description: "설비 유형이 수정되었습니다." });
    } else {
      const newType = {
        ...typeFormData,
        id: `type-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setTypes([...types, newType]);
      toast({
        title: "성공",
        description: "새로운 설비 유형이 추가되었습니다.",
      });
    }
    setIsTypeFormOpen(false);
    setCurrentType(null);
  };

  const openNewTypeForm = () => {
    setCurrentType(null);
    setTypeFormData(initialEquipmentType);
    setIsTypeFormOpen(true);
  };

  const handleEditType = (type: EquipmentType) => {
    setCurrentType(type);
    setIsTypeFormOpen(true);
  };

  const handleDeleteType = (id: string) => {
    // Add confirmation dialog in real app
    setTypes(types.filter((t) => t.id !== id));
    toast({ title: "성공", description: "설비 유형이 삭제되었습니다." });
  };

  const columns = [
    { key: "code", title: t("type_code"), searchable: true },
    { key: "name", title: t("type_name"), searchable: true },
    {
      key: "properties",
      title: t("type_property_count"),
      render: (properties: EquipmentProperty[]) => properties?.length || 0,
    },
    {
      key: "isActive",
      title: t("active"),
      render: (isActive: boolean) => (isActive ? t("yes") : t("no")),
    },
  ];

  const actions = [
    {
      key: "edit",
      label: t("edit"),
      icon: Edit,
      onClick: (record: EquipmentType) => handleEditType(record),
    },
    {
      key: "delete",
      label: t("delete"),
      icon: Trash2,
      onClick: (record: EquipmentType) => handleDeleteType(record.id),
      variant: "destructive" as const,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">{t("type_list")}</h3>
        <Button onClick={openNewTypeForm}>
          <PlusCircle className="mr-2 h-4 w-4" /> {t("add_type")}
        </Button>
      </div>
      <DataTable
        data={types}
        columns={columns}
        actions={actions}
        title={t("type_title")}
        searchPlaceholder={t("type_search_placeholder")}
        showExport={true}
        showImport={true}
      />

      <Dialog
        open={isTypeFormOpen}
        onOpenChange={(isOpen) => {
          setIsTypeFormOpen(isOpen);
          if (!isOpen) setCurrentType(null);
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {currentType ? t("edit_type") : t("add_type_dialog")}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleTypeFormSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">{t("type_code")}</Label>
                <Input
                  id="code"
                  name="code"
                  value={typeFormData.code}
                  onChange={handleTypeInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">{t("type_name")}</Label>
                <Input
                  id="name"
                  name="name"
                  value={typeFormData.name}
                  onChange={handleTypeInputChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">{t("description")}</Label>
              <Textarea
                id="description"
                name="description"
                value={typeFormData.description}
                onChange={handleTypeInputChange}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                checked={typeFormData.isActive}
                onCheckedChange={(checked) =>
                  handleTypeCheckboxChange("isActive", checked as boolean)
                }
              />
              <Label htmlFor="isActive">{t("active")}</Label>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">{t("type_properties")}</h4>
                <Button type="button" onClick={addProperty} variant="outline">
                  {t("add_property")}
                </Button>
              </div>
              {typeFormData.properties?.map((property, index) => (
                <div
                  key={property.id}
                  className="grid grid-cols-4 gap-4 p-4 border rounded-lg"
                >
                  <div className="space-y-2">
                    <Label>{t("property_code")}</Label>
                    <Input
                      value={property.code}
                      onChange={(e) =>
                        handlePropertyChange(index, "code", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("property_name")}</Label>
                    <Input
                      value={property.name}
                      onChange={(e) =>
                        handlePropertyChange(index, "name", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("property_data_type")}</Label>
                    <Select
                      value={property.dataType}
                      onValueChange={(value) =>
                        handlePropertyChange(index, "dataType", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="string">
                          {t("data_type_string")}
                        </SelectItem>
                        <SelectItem value="number">
                          {t("data_type_number")}
                        </SelectItem>
                        <SelectItem value="boolean">
                          {t("data_type_boolean")}
                        </SelectItem>
                        <SelectItem value="date">
                          {t("data_type_date")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end space-x-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={property.required}
                        onCheckedChange={(checked) =>
                          handlePropertyChange(
                            index,
                            "required",
                            checked as boolean
                          )
                        }
                      />
                      <Label>{t("required")}</Label>
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeProperty(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button type="submit">
                {currentType ? t("edit") : t("add")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// --- 설비 분류 관리 ---
// (간단한 예시로, 실제로는 트리 구조 렌더링 및 편집이 필요)
function EquipmentCategoryManagementTab() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<EquipmentCategory[]>([]);
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [currentCategory, setCurrentCategory] =
    useState<EquipmentCategory | null>(null);
  const [categoryFormData, setCategoryFormData] = useState<EquipmentCategory>({
    id: "",
    code: "",
    name: "",
    description: "",
    level: 1,
    parentId: undefined,
    isActive: true,
    path: "",
  });

  useEffect(() => {
    setCategories(mockEquipmentCategories);
  }, []);

  useEffect(() => {
    if (currentCategory) {
      setCategoryFormData(currentCategory);
    } else {
      setCategoryFormData({
        id: "",
        code: "",
        name: "",
        description: "",
        level: 1,
        parentId: undefined,
        isActive: true,
        path: "",
      });
    }
  }, [currentCategory]);

  const handleCategoryInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCategoryFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryCheckboxChange = (
    name: keyof EquipmentCategory,
    checked: boolean
  ) => {
    setCategoryFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleCategoryFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentCategory) {
      setCategories(
        categories.map((c) =>
          c.id === currentCategory.id
            ? {
                ...categoryFormData,
                id: currentCategory.id,
                updatedAt: new Date().toISOString(),
              }
            : c
        )
      );
      toast({ title: "성공", description: "설비 분류가 수정되었습니다." });
    } else {
      const newCategory = {
        ...categoryFormData,
        id: `category-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setCategories([...categories, newCategory]);
      toast({
        title: "성공",
        description: "새로운 설비 분류가 추가되었습니다.",
      });
    }
    setIsCategoryFormOpen(false);
    setCurrentCategory(null);
  };

  const openNewCategoryForm = () => {
    setCurrentCategory(null);
    setCategoryFormData({
      id: "",
      code: "",
      name: "",
      description: "",
      level: 1,
      parentId: undefined,
      isActive: true,
      path: "",
    });
    setIsCategoryFormOpen(true);
  };

  const handleEditCategory = (category: EquipmentCategory) => {
    setCurrentCategory(category);
    setIsCategoryFormOpen(true);
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter((c) => c.id !== id));
    toast({ title: "성공", description: "설비 분류가 삭제되었습니다." });
  };

  const columns = [
    { key: "code", title: "코드", searchable: true },
    { key: "name", title: "이름", searchable: true },
    { key: "level", title: "레벨" },
    {
      key: "isActive",
      title: "활성",
      render: (isActive: boolean) => (isActive ? "예" : "아니오"),
    },
  ];

  const actions = [
    {
      key: "edit",
      label: "수정",
      icon: Edit,
      onClick: (record: EquipmentCategory) => handleEditCategory(record),
    },
    {
      key: "delete",
      label: "삭제",
      icon: Trash2,
      onClick: (record: EquipmentCategory) => handleDeleteCategory(record.id),
      variant: "destructive" as const,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">설비 분류 목록</h3>
        <Button onClick={openNewCategoryForm}>
          <PlusCircle className="mr-2 h-4 w-4" /> 새 분류 추가
        </Button>
      </div>
      <DataTable
        data={categories}
        columns={columns}
        actions={actions}
        title="설비 분류"
        searchPlaceholder="코드, 이름으로 검색..."
        showExport={true}
        showImport={true}
      />
      <Dialog open={isCategoryFormOpen} onOpenChange={setIsCategoryFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentCategory ? "설비 분류 수정" : "새 설비 분류 추가"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCategoryFormSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">코드</Label>
                <Input
                  id="code"
                  name="code"
                  value={categoryFormData.code}
                  onChange={handleCategoryInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">이름</Label>
                <Input
                  id="name"
                  name="name"
                  value={categoryFormData.name}
                  onChange={handleCategoryInputChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">설명</Label>
              <Textarea
                id="description"
                name="description"
                value={categoryFormData.description}
                onChange={handleCategoryInputChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="level">레벨</Label>
                <Input
                  id="level"
                  name="level"
                  type="number"
                  min={1}
                  value={categoryFormData.level}
                  onChange={handleCategoryInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parentId">상위 분류</Label>
                <Select
                  value={categoryFormData.parentId || ""}
                  onValueChange={(value) =>
                    setCategoryFormData((prev) => ({
                      ...prev,
                      parentId: value || undefined,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="상위 분류 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">없음</SelectItem>
                    {categories
                      .filter((c) => c.id !== currentCategory?.id)
                      .map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                checked={categoryFormData.isActive}
                onCheckedChange={(checked) =>
                  handleCategoryCheckboxChange("isActive", checked as boolean)
                }
              />
              <Label htmlFor="isActive">활성</Label>
            </div>
            <DialogFooter>
              <Button type="submit">{currentCategory ? "수정" : "추가"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
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
};

const initialCodeSegment: EquipmentCodeSegment = {
  id: "",
  type: "fixed",
  length: 0,
};

function EquipmentCodeRuleManagementTab() {
  const { toast } = useToast();
  const [rules, setRules] = useState<EquipmentCodeRule[]>([]);
  const [isRuleFormOpen, setIsRuleFormOpen] = useState(false);
  const [currentRule, setCurrentRule] = useState<EquipmentCodeRule | null>(
    null
  );
  const [ruleFormData, setRuleFormData] = useState<EquipmentCodeRule>({
    id: "",
    name: "",
    prefix: "",
    separator: "-",
    segments: [],
    example: "",
    isActive: true,
    appliedTo: [],
    description: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  useEffect(() => {
    setRules(mockEquipmentCodeRules);
  }, []);

  useEffect(() => {
    if (currentRule) {
      setRuleFormData(currentRule);
    } else {
      setRuleFormData({
        id: "",
        name: "",
        prefix: "",
        separator: "-",
        segments: [],
        example: "",
        isActive: true,
        appliedTo: [],
        description: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  }, [currentRule]);

  const handleRuleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setRuleFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRuleCheckboxChange = (
    name: keyof EquipmentCodeRule,
    checked: boolean
  ) => {
    setRuleFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleRuleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentRule) {
      setRules(
        rules.map((r) =>
          r.id === currentRule.id
            ? {
                ...ruleFormData,
                id: currentRule.id,
                updatedAt: new Date().toISOString(),
              }
            : r
        )
      );
      toast({ title: "성공", description: "코드 규칙이 수정되었습니다." });
    } else {
      const newRule = {
        ...ruleFormData,
        id: `rule-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setRules([...rules, newRule]);
      toast({
        title: "성공",
        description: "새로운 코드 규칙이 추가되었습니다.",
      });
    }
    setIsRuleFormOpen(false);
    setCurrentRule(null);
  };

  const openNewRuleForm = () => {
    setCurrentRule(null);
    setRuleFormData({
      id: "",
      name: "",
      prefix: "",
      separator: "-",
      segments: [],
      example: "",
      isActive: true,
      appliedTo: [],
      description: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setIsRuleFormOpen(true);
  };

  const handleEditRule = (rule: EquipmentCodeRule) => {
    setCurrentRule(rule);
    setIsRuleFormOpen(true);
  };

  const handleDeleteRule = (id: string) => {
    setRules(rules.filter((r) => r.id !== id));
    toast({ title: "성공", description: "코드 규칙이 삭제되었습니다." });
  };

  const columns = [
    { key: "name", title: "이름", searchable: true },
    { key: "description", title: "설명", searchable: true },
    {
      key: "segments",
      title: "세그먼트 수",
      render: (segments: EquipmentCodeSegment[]) => segments?.length || 0,
    },
    {
      key: "isActive",
      title: "활성",
      render: (isActive: boolean) => (isActive ? "예" : "아니오"),
    },
  ];

  const actions = [
    {
      key: "edit",
      label: "수정",
      icon: Edit,
      onClick: (record: EquipmentCodeRule) => handleEditRule(record),
    },
    {
      key: "delete",
      label: "삭제",
      icon: Trash2,
      onClick: (record: EquipmentCodeRule) => handleDeleteRule(record.id),
      variant: "destructive" as const,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">코드 규칙 목록</h3>
        <Button onClick={openNewRuleForm}>
          <PlusCircle className="mr-2 h-4 w-4" /> 새 규칙 추가
        </Button>
      </div>
      <DataTable
        data={rules}
        columns={columns}
        actions={actions}
        title="코드 규칙"
        searchPlaceholder="이름, 설명으로 검색..."
        showExport={true}
        showImport={true}
      />
      <Dialog open={isRuleFormOpen} onOpenChange={setIsRuleFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentRule ? "코드 규칙 수정" : "새 코드 규칙 추가"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleRuleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">이름</Label>
                <Input
                  id="name"
                  name="name"
                  value={ruleFormData.name}
                  onChange={handleRuleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">설명</Label>
                <Input
                  id="description"
                  name="description"
                  value={ruleFormData.description}
                  onChange={handleRuleInputChange}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                checked={ruleFormData.isActive}
                onCheckedChange={(checked) =>
                  handleRuleCheckboxChange("isActive", checked as boolean)
                }
              />
              <Label htmlFor="isActive">활성</Label>
            </div>
            <DialogFooter>
              <Button type="submit">{currentRule ? "수정" : "추가"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function EquipmentMasterManagement() {
  const [equipmentList, setEquipmentList] = useState<EquipmentMaster[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentEquipment, setCurrentEquipment] =
    useState<EquipmentMaster | null>(null);
  const [formData, setFormData] = useState<EquipmentMaster>(
    initialEquipmentMaster
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    setEquipmentList(mockEquipmentMasterData);
  }, []);

  useEffect(() => {
    if (currentEquipment) {
      setFormData(currentEquipment);
    } else {
      setFormData(initialEquipmentMaster);
    }
  }, [currentEquipment]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (
    name: keyof EquipmentMaster,
    date: Date | undefined
  ) => {
    if (date) {
      setFormData((prev) => ({ ...prev, [name]: date }));
    }
  };

  const handleSelectChange = (name: keyof EquipmentMaster, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentEquipment) {
      setEquipmentList(
        equipmentList.map((eq) =>
          eq.id === currentEquipment.id
            ? { ...formData, id: currentEquipment.id }
            : eq
        )
      );
    } else {
      setEquipmentList([
        ...equipmentList,
        {
          ...formData,
          id: `eqm-${Date.now()}`,
          equipmentId: `EQP-${Math.random()
            .toString(36)
            .substr(2, 5)
            .toUpperCase()}`,
        },
      ]);
    }
    setIsFormOpen(false);
    setCurrentEquipment(null);
  };

  const handleEdit = (equipment: EquipmentMaster) => {
    setCurrentEquipment(equipment);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setEquipmentList(equipmentList.filter((eq) => eq.id !== id));
    // In a real app, add confirmation dialog
  };

  const openNewForm = () => {
    setCurrentEquipment(null);
    setFormData(initialEquipmentMaster);
    setIsFormOpen(true);
  };

  const filteredEquipment = equipmentList
    .filter(
      (eq) =>
        eq.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        eq.equipmentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (eq.model &&
          eq.model.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (eq.manufacturer &&
          eq.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .filter((eq) => statusFilter === "all" || eq.status === statusFilter);

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl font-bold tracking-tight mb-1">
        설비 마스터 기준정보 관리
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        시스템에서 사용되는 설비의 유형, 분류 체계, 코드 생성 규칙 등 기준
        정보를 관리합니다.
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
  );
}
