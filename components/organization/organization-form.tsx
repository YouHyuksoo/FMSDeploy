"use client";

import type React from "react";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { Organization, OrganizationFormData } from "@/types/organization";
import { AlertCircle } from "lucide-react";
import { useTranslation } from "@/lib/language-context";

interface OrganizationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: OrganizationFormData) => Promise<void>;
  initialData?: Organization;
  parentOptions: Array<{ id: string; name: string; level: number }>;
  mode: "create" | "edit";
}

export function OrganizationForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  parentOptions,
  mode,
}: OrganizationFormProps) {
  const { t } = useTranslation("common");
  const [formData, setFormData] = useState<OrganizationFormData>({
    code: "",
    name: "",
    type: "department",
    parentId: "",
    description: "",
    isActive: true,
    sortOrder: 1,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      });
    } else {
      setFormData({
        code: "",
        name: "",
        type: "department",
        parentId: "",
        description: "",
        isActive: true,
        sortOrder: 1,
      });
    }
    setErrors({});
  }, [initialData, open]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.code.trim()) {
      newErrors.code = t("organization.code_required");
    } else if (!/^[A-Z0-9-_]+$/.test(formData.code)) {
      newErrors.code = t("organization.code_pattern");
    }

    if (!formData.name.trim()) {
      newErrors.name = t("organization.name_required");
    }

    if (formData.type !== "company" && !formData.parentId) {
      newErrors.parentId = t("organization.parent_required");
    }

    if (formData.sortOrder < 1) {
      newErrors.sortOrder = t("organization.sort_order_min");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onOpenChange(false);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof OrganizationFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const formFields: FormField[] = useMemo(
    () => [
      {
        name: "code",
        label: t("organization.code"),
        type: "text",
        required: true,
        placeholder: t("organization.code_placeholder"),
        disabled: mode === "edit",
        description: t("organization.code_description"),
      },
      {
        name: "name",
        label: t("organization.name"),
        type: "text",
        required: true,
        placeholder: t("organization.name_placeholder"),
      },
      {
        name: "type",
        label: t("organization.type"),
        type: "select",
        required: true,
        options: [
          { label: t("organization.type_company"), value: "company" },
          { label: t("organization.type_department"), value: "department" },
          { label: t("organization.type_team"), value: "team" },
        ],
      },
      {
        name: "parentId",
        label: t("organization.parent"),
        type: "select",
        required: true,
        options: parentOptions,
        placeholder: t("organization.parent_placeholder"),
        hidden: formData.type === "company",
      },
      {
        name: "description",
        label: t("organization.description"),
        type: "textarea",
        placeholder: t("organization.description_placeholder"),
      },
      {
        name: "sortOrder",
        label: t("organization.sort_order"),
        type: "number",
        defaultValue: 1,
        validation: { min: 1 },
      },
      {
        name: "isActive",
        label: t("organization.is_active"),
        type: "switch",
        defaultValue: true,
        description: t("organization.is_active_description"),
      },
    ],
    [mode, parentOptions, formData.type, t]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "조직 추가" : "조직 수정"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "새로운 조직을 추가합니다."
              : "조직 정보를 수정합니다."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {formFields.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name}>{field.label} *</Label>
              {field.type === "text" && (
                <Input
                  id={field.name}
                  value={formData[field.name as keyof OrganizationFormData]}
                  onChange={(e) =>
                    handleInputChange(
                      field.name as keyof OrganizationFormData,
                      e.target.value
                    )
                  }
                  placeholder={field.placeholder}
                  className={errors[field.name] ? "border-red-500" : ""}
                  disabled={field.disabled}
                />
              )}
              {field.type === "select" && (
                <Select
                  value={formData[field.name as keyof OrganizationFormData]}
                  onValueChange={(value) =>
                    handleInputChange(
                      field.name as keyof OrganizationFormData,
                      value
                    )
                  }
                >
                  <SelectTrigger
                    className={errors[field.name] ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder={field.placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {field.type === "textarea" && (
                <Textarea
                  id={field.name}
                  value={formData[field.name as keyof OrganizationFormData]}
                  onChange={(e) =>
                    handleInputChange(
                      field.name as keyof OrganizationFormData,
                      e.target.value
                    )
                  }
                  placeholder={field.placeholder}
                  rows={3}
                />
              )}
              {field.type === "number" && (
                <Input
                  id={field.name}
                  type="number"
                  min={field.validation?.min}
                  value={formData[field.name as keyof OrganizationFormData]}
                  onChange={(e) =>
                    handleInputChange(
                      field.name as keyof OrganizationFormData,
                      Number.parseInt(e.target.value) || 1
                    )
                  }
                  className={errors[field.name] ? "border-red-500" : ""}
                />
              )}
              {field.type === "switch" && (
                <div className="flex items-center space-x-2">
                  <Switch
                    id={field.name}
                    checked={formData[field.name as keyof OrganizationFormData]}
                    onCheckedChange={(checked) =>
                      handleInputChange(
                        field.name as keyof OrganizationFormData,
                        checked
                      )
                    }
                  />
                  <Label htmlFor={field.name}>{field.description}</Label>
                </div>
              )}
              {errors[field.name] && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors[field.name]}</AlertDescription>
                </Alert>
              )}
            </div>
          ))}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? t("common.saving")
                : mode === "create"
                ? t("common.add")
                : t("common.edit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
