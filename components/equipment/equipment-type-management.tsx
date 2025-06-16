"use client";

import { useState, useEffect } from "react";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/common/data-table";
import { EquipmentType, EquipmentProperty } from "@/types/equipment";

const initialEquipmentType: EquipmentType = {
  id: "",
  code: "",
  name: "",
  description: "",
  properties: [],
  isActive: true,
  createdAt: "",
  updatedAt: "",
};

const initialEquipmentProperty: EquipmentProperty = {
  id: "",
  code: "",
  name: "",
  dataType: "string",
  required: false,
  order: 0,
};

const mockEquipmentTypes: EquipmentType[] = [
  {
    id: "type-1",
    code: "MACHINE",
    name: "기계장비",
    description: "일반적인 기계장비",
    properties: [
      {
        id: "prop-1",
        code: "MODEL",
        name: "모델명",
        dataType: "string",
        required: true,
        order: 1,
      },
      {
        id: "prop-2",
        code: "SERIAL",
        name: "시리얼번호",
        dataType: "string",
        required: true,
        order: 2,
      },
    ],
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
];

export function EquipmentTypeManagement() {
  const { toast } = useToast();
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
    setTypes(types.filter((t) => t.id !== id));
    toast({ title: "성공", description: "설비 유형이 삭제되었습니다." });
  };

  const columns = [
    { key: "code", title: "코드", searchable: true },
    { key: "name", title: "이름", searchable: true },
    {
      key: "properties",
      title: "속성 수",
      render: (properties: EquipmentProperty[]) => properties?.length || 0,
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
      onClick: (record: EquipmentType) => handleEditType(record),
    },
    {
      key: "delete",
      label: "삭제",
      icon: Trash2,
      onClick: (record: EquipmentType) => handleDeleteType(record.id),
      variant: "destructive" as const,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">설비 유형 목록</h3>
        <Button onClick={openNewTypeForm}>
          <PlusCircle className="mr-2 h-4 w-4" /> 새 유형 추가
        </Button>
      </div>
      <DataTable
        data={types}
        columns={columns}
        actions={actions}
        title="설비 유형"
        searchPlaceholder="코드, 이름으로 검색..."
        showExport={true}
        showImport={true}
      />
      <Dialog open={isTypeFormOpen} onOpenChange={setIsTypeFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {currentType ? "설비 유형 수정" : "새 설비 유형 추가"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleTypeFormSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">코드</Label>
                <Input
                  id="code"
                  name="code"
                  value={typeFormData.code}
                  onChange={handleTypeInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">이름</Label>
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
              <Label htmlFor="description">설명</Label>
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
              <Label htmlFor="isActive">활성</Label>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">속성</h4>
                <Button type="button" onClick={addProperty} variant="outline">
                  속성 추가
                </Button>
              </div>
              {typeFormData.properties?.map((property, index) => (
                <div
                  key={property.id}
                  className="grid grid-cols-4 gap-4 p-4 border rounded-lg"
                >
                  <div className="space-y-2">
                    <Label>코드</Label>
                    <Input
                      value={property.code}
                      onChange={(e) =>
                        handlePropertyChange(index, "code", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>이름</Label>
                    <Input
                      value={property.name}
                      onChange={(e) =>
                        handlePropertyChange(index, "name", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>데이터 타입</Label>
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
                        <SelectItem value="string">문자열</SelectItem>
                        <SelectItem value="number">숫자</SelectItem>
                        <SelectItem value="boolean">불리언</SelectItem>
                        <SelectItem value="date">날짜</SelectItem>
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
                      <Label>필수</Label>
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
              <Button type="submit">{currentType ? "수정" : "추가"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
