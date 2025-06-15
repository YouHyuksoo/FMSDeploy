"use client"

import { useState } from "react"
import { Plus, Search, Edit, Trash2, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/common/data-table"
import { useTranslation } from "@/lib/language-context"
import { mockTranslationKeys, mockTranslations } from "@/lib/mock-data/translations"
import type { TranslationKey } from "@/types/language"

export function TranslationKeyManagement() {
  const { t } = useTranslation("language")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedNamespace, setSelectedNamespace] = useState<string>("all")

  // 네임스페이스 목록
  const namespaces = ["all", ...new Set(mockTranslationKeys.map((k) => k.namespace))]

  // 필터링된 번역 키
  const filteredKeys = mockTranslationKeys.filter((key) => {
    const matchesSearch =
      key.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      key.namespace.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (key.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
    const matchesNamespace = selectedNamespace === "all" || key.namespace === selectedNamespace
    return matchesSearch && matchesNamespace
  })

  // 번역 키별 번역 완성도 계산
  const getKeyCompleteness = (keyId: string) => {
    const translations = mockTranslations.filter((t) => t.keyId === keyId)
    const approvedTranslations = translations.filter((t) => t.isApproved)
    return {
      total: 4, // 지원 언어 수
      completed: approvedTranslations.length,
      pending: translations.length - approvedTranslations.length,
    }
  }

  const columns = [
    {
      accessorKey: "namespace",
      header: t("namespace", "language", "네임스페이스"),
      cell: ({ row }: { row: { original: TranslationKey } }) => (
        <Badge variant="outline">{row.original.namespace}</Badge>
      ),
    },
    {
      accessorKey: "key",
      header: t("translation_key", "language", "번역 키"),
      cell: ({ row }: { row: { original: TranslationKey } }) => (
        <code className="text-sm bg-muted px-2 py-1 rounded">{row.original.key}</code>
      ),
    },
    {
      accessorKey: "description",
      header: t("description", "common", "설명"),
    },
    {
      accessorKey: "completeness",
      header: t("translation_status", "language", "번역 상태"),
      cell: ({ row }: { row: { original: TranslationKey } }) => {
        const completeness = getKeyCompleteness(row.original.id)
        const percentage = Math.round((completeness.completed / completeness.total) * 100)

        return (
          <div className="flex items-center gap-2">
            <div className="w-16 bg-muted rounded-full h-2">
              <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${percentage}%` }} />
            </div>
            <span className="text-sm text-muted-foreground">
              {completeness.completed}/{completeness.total}
            </span>
            {completeness.pending > 0 && (
              <Badge variant="secondary" className="text-xs">
                {completeness.pending} 대기
              </Badge>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "actions",
      header: t("actions", "common", "작업"),
      cell: ({ row }: { row: { original: TranslationKey } }) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <FileText className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{t("translation_key_management", "language", "번역 키 관리")}</h2>
          <p className="text-muted-foreground">
            {t("translation_key_management_desc", "language", "시스템에서 사용하는 번역 키를 관리합니다")}
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          {t("add_translation_key", "language", "번역 키 추가")}
        </Button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t("total_keys", "language", "총 키 수")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockTranslationKeys.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t("namespaces", "language", "네임스페이스")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{namespaces.length - 1}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {t("completed_translations", "language", "완료된 번역")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {mockTranslations.filter((t) => t.isApproved).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {t("pending_translations", "language", "대기 중인 번역")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {mockTranslations.filter((t) => !t.isApproved).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 필터 및 검색 */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder={t("search_keys", "language", "번역 키 검색...")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={selectedNamespace}
          onChange={(e) => setSelectedNamespace(e.target.value)}
          className="px-3 py-2 border border-input bg-background rounded-md"
        >
          {namespaces.map((namespace) => (
            <option key={namespace} value={namespace}>
              {namespace === "all" ? t("all_namespaces", "language", "모든 네임스페이스") : namespace}
            </option>
          ))}
        </select>
      </div>

      {/* 데이터 테이블 */}
      <Card>
        <CardContent className="p-0">
          <DataTable columns={columns} data={filteredKeys} searchKey="key" />
        </CardContent>
      </Card>
    </div>
  )
}
