"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/common/data-table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Package, AlertTriangle, XCircle, TrendingUp } from "lucide-react"
import { mockMaterialStocks } from "@/lib/mock-data/material-stock"
import type { MaterialStock } from "@/types/material-stock"
import type { Column } from "@/components/common/data-table"

export function MaterialStockManagement() {
  const [stocks, setStocks] = useState<MaterialStock[]>(mockMaterialStocks)
  const [isAdjustDialogOpen, setIsAdjustDialogOpen] = useState(false)

  // 통계 계산
  const totalMaterials = stocks.length
  const lowStock = stocks.filter((s) => s.status === "low").length
  const outOfStock = stocks.filter((s) => s.status === "out").length
  const excessStock = stocks.filter((s) => s.status === "excess").length

  // 컬럼 정의
  const columns: Column<MaterialStock>[] = [
    {
      key: "materialCode",
      title: "자재코드",
      width: "120px",
      searchable: true,
    },
    {
      key: "materialName",
      title: "자재명",
      width: "200px",
      searchable: true,
    },
    {
      key: "warehouseName",
      title: "창고",
      width: "100px",
      searchable: true,
    },
    {
      key: "location",
      title: "위치",
      width: "100px",
    },
    {
      key: "currentStock",
      title: "현재재고",
      width: "100px",
      align: "right" as const,
      render: (value: number, record: MaterialStock) => `${value.toLocaleString()} ${record.unit}`,
    },
    {
      key: "safetyStock",
      title: "안전재고",
      width: "100px",
      align: "right" as const,
      render: (value: number, record: MaterialStock) => `${value.toLocaleString()} ${record.unit}`,
    },
    {
      key: "totalValue",
      title: "재고금액",
      width: "120px",
      align: "right" as const,
      render: (value: number) => `₩${value.toLocaleString()}`,
    },
    {
      key: "status",
      title: "상태",
      width: "100px",
      render: (value: string) => {
        const statusConfig = {
          normal: { label: "정상", variant: "default" as const },
          low: { label: "부족", variant: "secondary" as const },
          out: { label: "품절", variant: "destructive" as const },
          excess: { label: "과다", variant: "outline" as const },
        }
        const config = statusConfig[value as keyof typeof statusConfig]
        return <Badge variant={config.variant}>{config.label}</Badge>
      },
      filterable: true,
      filterOptions: [
        { label: "정상", value: "normal" },
        { label: "부족", value: "low" },
        { label: "품절", value: "out" },
        { label: "과다", value: "excess" },
      ],
    },
    {
      key: "lastUpdated",
      title: "최종수정일",
      width: "120px",
      render: (value: string) => new Date(value).toLocaleDateString(),
      sortable: true,
    },
  ]

  const handleAdjustStock = () => {
    setIsAdjustDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 자재</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMaterials}</div>
            <p className="text-xs text-muted-foreground">개</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">재고 부족</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{lowStock}</div>
            <p className="text-xs text-muted-foreground">개</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">품절</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{outOfStock}</div>
            <p className="text-xs text-muted-foreground">개</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">과다 재고</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{excessStock}</div>
            <p className="text-xs text-muted-foreground">개</p>
          </CardContent>
        </Card>
      </div>

      {/* 재고 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>재고 현황</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={stocks}
            columns={columns}
            onAdd={handleAdjustStock}
            addButtonText="재고 조정"
            searchPlaceholder="자재코드, 자재명, 창고로 검색..."
            showExport={true}
            showImport={true}
          />
        </CardContent>
      </Card>

      {/* 재고 조정 다이얼로그 */}
      <Dialog open={isAdjustDialogOpen} onOpenChange={setIsAdjustDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>재고 조정</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <p>재고 조정 폼이 여기에 표시됩니다.</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
