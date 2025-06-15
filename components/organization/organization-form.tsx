"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Organization, OrganizationFormData } from "@/types/organization"
import { AlertCircle } from "lucide-react"

interface OrganizationFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: OrganizationFormData) => Promise<void>
  initialData?: Organization
  parentOptions: Array<{ id: string; name: string; level: number }>
  mode: "create" | "edit"
}

export function OrganizationForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  parentOptions,
  mode,
}: OrganizationFormProps) {
  const [formData, setFormData] = useState<OrganizationFormData>({
    code: "",
    name: "",
    type: "department",
    parentId: "",
    description: "",
    isActive: true,
    sortOrder: 1,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (initialData) {
      setFormData({
        code: initialData.code,
        name: initialData.name,
        type: initialData.type,
        parentId: initialData.parentId || "",
        description: initialData.description || "",
        isActive: initialData.isActive,
        sortOrder: initialData.sortOrder,
      })
    } else {
      setFormData({
        code: "",
        name: "",
        type: "department",
        parentId: "",
        description: "",
        isActive: true,
        sortOrder: 1,
      })
    }
    setErrors({})
  }, [initialData, open])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.code.trim()) {
      newErrors.code = "조직코드는 필수입니다."
    } else if (!/^[A-Z0-9-_]+$/.test(formData.code)) {
      newErrors.code = "조직코드는 영문 대문자, 숫자, -, _만 사용 가능합니다."
    }

    if (!formData.name.trim()) {
      newErrors.name = "조직명은 필수입니다."
    }

    if (formData.type !== "company" && !formData.parentId) {
      newErrors.parentId = "상위조직을 선택해주세요."
    }

    if (formData.sortOrder < 1) {
      newErrors.sortOrder = "정렬순서는 1 이상이어야 합니다."
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
      onOpenChange(false)
    } catch (error) {
      console.error("Form submission error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof OrganizationFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "조직 추가" : "조직 수정"}</DialogTitle>
          <DialogDescription>
            {mode === "create" ? "새로운 조직을 추가합니다." : "조직 정보를 수정합니다."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">조직코드 *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => handleInputChange("code", e.target.value.toUpperCase())}
                placeholder="ABC-DEPT"
                className={errors.code ? "border-red-500" : ""}
              />
              {errors.code && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.code}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">조직유형 *</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="company">회사</SelectItem>
                  <SelectItem value="department">부서</SelectItem>
                  <SelectItem value="team">팀</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">조직명 *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="조직명을 입력하세요"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.name}</AlertDescription>
              </Alert>
            )}
          </div>

          {formData.type !== "company" && (
            <div className="space-y-2">
              <Label htmlFor="parentId">상위조직 *</Label>
              <Select value={formData.parentId} onValueChange={(value) => handleInputChange("parentId", value)}>
                <SelectTrigger className={errors.parentId ? "border-red-500" : ""}>
                  <SelectValue placeholder="상위조직을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {parentOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {"  ".repeat(option.level - 1)}
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.parentId && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.parentId}</AlertDescription>
                </Alert>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="sortOrder">정렬순서</Label>
            <Input
              id="sortOrder"
              type="number"
              min="1"
              value={formData.sortOrder}
              onChange={(e) => handleInputChange("sortOrder", Number.parseInt(e.target.value) || 1)}
              className={errors.sortOrder ? "border-red-500" : ""}
            />
            {errors.sortOrder && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.sortOrder}</AlertDescription>
              </Alert>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">설명</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="조직에 대한 설명을 입력하세요"
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => handleInputChange("isActive", checked)}
            />
            <Label htmlFor="isActive">활성화</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              취소
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "저장 중..." : mode === "create" ? "추가" : "수정"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
