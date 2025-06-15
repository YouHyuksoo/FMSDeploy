"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/common/data-table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ArrowUpCircle, Clock, CheckCircle } from "lucide-react"
import { mockMaterialInboundTransactions } from "@/lib/mock-data/material-inbound"
import type { MaterialTransaction } from "@/types/material-transaction"
import type { Column } from "@/components/common/data-table"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import MaterialForm from "./material-form" // Assuming this form can be adapted for inbound

export function MaterialInboundManagement() {
  const [transactions, setTransactions] = useState<MaterialTransaction[]>(mockMaterialInboundTransactions)
  const [selectedTab, setSelectedTab] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const { toast } = useToast()

  // 통계 계산
  const totalIn = transactions.length
  const pending = transactions.filter((t) => t.status === "pending").length
  const completed = transactions.filter((t) => t.status === "completed").length

  // 탭별 데이터 필터링 (여기서는 입고만 다루므로 'all'과 'in'이 동일)
  const filteredTransactions = transactions.filter((transaction) => {
    if (selectedTab === "all" || selectedTab === "in") return transaction.transactionType === "in"
    return false // Should not happen if tabs are only 'all' and 'in'
  })

  // 컬럼 정의
  const columns: Column<MaterialTransaction>[] = [
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
      key: "quantity",
      title: "수량",
      width: "80px",
      align: "right" as const,
      render: (value: number, record: MaterialTransaction) => `${value.toLocaleString()} ${record.unit}`,
    },
    {
      key: "totalAmount",
      title: "금액",
      width: "120px",
      align: "right" as const,
      render: (value: number) => `₩${value.toLocaleString()}`,
    },
    {
      key: "requestedBy",
      title: "요청자",
      width: "100px",
    },
    {
      key: "requestedAt",
      title: "요청일시",
      width: "150px",
      render: (value: string) => new Date(value).toLocaleString(),
      sortable: true,
    },
    {
      key: "status",
      title: "상태",
      width: "100px",
      render: (value: string) => {
        const statusConfig = {
          pending: { label: "대기", variant: "outline" as const },
          approved: { label: "승인", variant: "secondary" as const },
          completed: { label: "완료", variant: "default" as const },
          cancelled: { label: "취소", variant: "destructive" as const },
        }
        const config = statusConfig[value as keyof typeof statusConfig]
        return <Badge variant={config.variant}>{config.label}</Badge>
      },
      filterable: true,
      filterOptions: [
        { label: "대기", value: "pending" },
        { label: "승인", value: "approved" },
        { label: "완료", value: "completed" },
        { label: "취소", value: "cancelled" },
      ],
    },
    {
      key: "referenceNo",
      title: "참조번호",
      width: "120px",
      searchable: true,
    },
  ]

  const handleAddInbound = (data: any) => {
    // In a real app, you'd generate a unique ID and handle actual data persistence
    const newTransaction: MaterialTransaction = {
      id: `IN${String(transactions.length + 1).padStart(3, "0")}`,
      transactionType: "in",
      requestedAt: new Date().toISOString(),
      status: "completed", // Assuming direct inbound is completed upon entry
      ...data,
    }
    setTransactions((prev) => [...prev, newTransaction])
    setIsAddDialogOpen(false)
    toast({
      title: "입고 등록 완료",
      description: `${data.materialName} ${data.quantity}${data.unit} 입고가 등록되었습니다.`,
    })
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">자재 입고 관리</h1>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() =>
              toast({ title: "엑셀 내보내기", description: "입고 목록이 엑셀 파일로 내보내기 되었습니다." })
            }
          >
            엑셀 내보내기
          </Button>
          <Button
            variant="outline"
            onClick={() => toast({ title: "엑셀 가져오기", description: "입고 목록을 엑셀 파일에서 가져왔습니다." })}
          >
            엑셀 가져오기
          </Button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 입고 건수</CardTitle>
            <ArrowUpCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalIn}</div>
            <p className="text-xs text-muted-foreground">건</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">미처리 입고</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pending}</div>
            <p className="text-xs text-muted-foreground">건</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">완료된 입고</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completed}</div>
            <p className="text-xs text-muted-foreground">건</p>
          </CardContent>
        </Card>
      </div>

      {/* 입고 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>자재 입고 내역</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList>
              <TabsTrigger value="all">전체 입고</TabsTrigger>
              <TabsTrigger value="in">입고</TabsTrigger>
            </TabsList>
            <TabsContent value={selectedTab} className="mt-4">
              <DataTable
                data={filteredTransactions}
                columns={columns}
                onAdd={() => setIsAddDialogOpen(true)}
                addButtonText="새 입고 등록"
                searchPlaceholder="자재코드, 자재명, 참조번호로 검색..."
                showExport={true}
                showImport={true}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* 입고 등록 다이얼로그 */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>자재 입고 등록</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            {/* Assuming MaterialForm can be reused for inbound, or create a specific one */}
            <MaterialForm
              onSubmit={(data) => handleAddInbound({ ...data, transactionType: "in" })}
              onCancel={() => setIsAddDialogOpen(false)}
              initialData={{ transactionType: "in" }} // Pass initial data to hint form for inbound
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
