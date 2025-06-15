"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/common/data-table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ArrowDownCircle, Clock, CheckCircle, PackageCheck, Download, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import MaterialOutboundForm from "./material-outbound-form"
import { mockMaterialOutboundTransactions } from "@/lib/mock-data/material-outbound"
import { mockMaterialIssuanceRequests } from "@/lib/mock-data/material-issuance"
import type { MaterialTransaction } from "@/types/material-transaction"
import type { MaterialIssuanceRequest } from "@/types/material-issuance"
import type { Column } from "@/components/common/data-table"
import { Checkbox } from "@/components/ui/checkbox"
import { PageHeader, PageActions } from "@/components/layout/page-header"

export function MaterialOutboundManagement() {
  const [outboundTransactions, setOutboundTransactions] = useState<MaterialTransaction[]>(
    mockMaterialOutboundTransactions,
  )
  const [issuanceRequests, setIssuanceRequests] = useState<MaterialIssuanceRequest[]>(mockMaterialIssuanceRequests)
  const [isDirectOutboundFormOpen, setIsDirectOutboundFormOpen] = useState(false)
  const [selectedRequestIds, setSelectedRequestIds] = useState<string[]>([]) // State for selected requests
  const { toast } = useToast()

  // 통계 계산
  const totalOut = outboundTransactions.length
  const pendingOutbound = outboundTransactions.filter((t) => t.status === "pending").length
  const completedOutbound = outboundTransactions.filter((t) => t.status === "completed").length

  const approvedIssuanceRequests = useMemo(
    () => issuanceRequests.filter((r) => r.status === "approved"),
    [issuanceRequests],
  )
  const pendingIssuanceRequestsCount = approvedIssuanceRequests.length

  // 직접 출고 폼 제출 핸들러
  const handleDirectOutboundSubmit = (data: any) => {
    const newTransaction: MaterialTransaction = {
      id: `OUT${String(outboundTransactions.length + 1).padStart(3, "0")}`,
      transactionType: "out",
      requestedAt: new Date().toISOString(),
      status: "completed", // Direct outbound is completed upon entry
      ...data,
    }
    setOutboundTransactions((prev) => [...prev, newTransaction])
    setIsDirectOutboundFormOpen(false)
    toast({
      title: "직접 출고 등록 완료",
      description: `${data.materialName} ${data.quantity}${data.unit} 직접 출고가 등록되었습니다.`,
    })
  }

  // 요청 기반 출고 처리 핸들러 (선택된 여러 요청 처리)
  const handleIssueSelectedRequests = () => {
    if (selectedRequestIds.length === 0) {
      toast({
        title: "알림",
        description: "출고 처리할 요청을 선택해주세요.",
        variant: "destructive",
      })
      return
    }

    const issuedRequests: MaterialIssuanceRequest[] = []
    const newOutboundTransactions: MaterialTransaction[] = []

    setIssuanceRequests((prev) =>
      prev.map((req) => {
        if (selectedRequestIds.includes(req.id) && req.status === "approved") {
          const updatedReq = {
            ...req,
            status: "issued" as const,
            issuedBy: "창고담당",
            issuedAt: new Date().toLocaleString(),
          }
          issuedRequests.push(updatedReq)

          // Create a new outbound transaction record
          const newOutboundTransaction: MaterialTransaction = {
            id: `OUT${String(outboundTransactions.length + newOutboundTransactions.length + 1).padStart(3, "0")}`,
            transactionType: "out",
            materialCode: updatedReq.materialCode,
            materialName: updatedReq.materialName,
            warehouseName: updatedReq.warehouseName || "주창고", // Default if not specified in request
            quantity: updatedReq.quantity,
            unit: updatedReq.unit,
            totalAmount: 0, // Assuming totalAmount might be calculated or added later
            requestedBy: updatedReq.requestedBy,
            requestedAt: updatedReq.requestedAt,
            status: "completed",
            referenceNo: updatedReq.id, // Link to the issuance request ID
            approvedBy: updatedReq.approvedBy,
            approvedAt: updatedReq.approvedAt,
            issuedBy: "창고담당",
            issuedAt: new Date().toLocaleString(),
          }
          newOutboundTransactions.push(newOutboundTransaction)
          return updatedReq
        }
        return req
      }),
    )

    setOutboundTransactions((prev) => [...prev, ...newOutboundTransactions])
    setSelectedRequestIds([]) // Clear selections after processing

    toast({
      title: "자재 출고 완료",
      description: `${issuedRequests.length}건의 요청이 출고 처리되었습니다.`,
    })
  }

  // 출고 트랜잭션 컬럼 정의
  const outboundColumns: Column<MaterialTransaction>[] = [
    {
      key: "materialCode",
      title: "자재코드",
      width: "100px",
      searchable: true,
    },
    {
      key: "materialName",
      title: "자재명",
      width: "180px",
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
      key: "warehouseName",
      title: "창고",
      width: "100px",
      searchable: true,
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

  // 요청 기반 출고를 위한 컬럼 정의 (MaterialIssuanceRequest 기준)
  const requestBasedOutboundColumns: Column<MaterialIssuanceRequest>[] = [
    {
      key: "select",
      title: (
        <Checkbox
          checked={selectedRequestIds.length === approvedIssuanceRequests.length && approvedIssuanceRequests.length > 0}
          onCheckedChange={(checked) => {
            if (checked) {
              setSelectedRequestIds(approvedIssuanceRequests.map((req) => req.id))
            } else {
              setSelectedRequestIds([])
            }
          }}
          aria-label="모두 선택"
        />
      ),
      width: "40px",
      render: (value: any, record: MaterialIssuanceRequest) => (
        <Checkbox
          checked={selectedRequestIds.includes(record.id)}
          onCheckedChange={(checked) => {
            setSelectedRequestIds((prev) => (checked ? [...prev, record.id] : prev.filter((id) => id !== record.id)))
          }}
          aria-label={`요청 ${record.id} 선택`}
        />
      ),
    },
    {
      key: "id",
      title: "요청번호",
      width: "100px",
      searchable: true,
    },
    {
      key: "materialCode",
      title: "자재코드",
      width: "100px",
      searchable: true,
    },
    {
      key: "materialName",
      title: "자재명",
      width: "180px",
      searchable: true,
    },
    {
      key: "quantity",
      title: "요청수량",
      width: "80px",
      align: "right" as const,
      render: (value: number, record: MaterialIssuanceRequest) => `${value.toLocaleString()} ${record.unit}`,
    },
    {
      key: "requestedBy",
      title: "요청자",
      width: "100px",
      searchable: true,
    },
    {
      key: "requestedAt",
      title: "요청일시",
      width: "150px",
      render: (value: string) => new Date(value).toLocaleString(),
      sortable: true,
    },
    {
      key: "purpose",
      title: "요청 목적",
      width: "200px",
    },
    {
      key: "status",
      title: "상태",
      width: "120px",
      render: (value: string) => {
        const statusConfig = {
          pending: { label: "대기", variant: "outline" as const },
          approved: { label: "승인", variant: "secondary" as const },
          rejected: { label: "반려", variant: "destructive" as const },
          issued: { label: "출고완료", variant: "default" as const },
          backordered: { label: "발주대기", variant: "warning" as const, className: "bg-yellow-500" },
        }
        const config = statusConfig[value as keyof typeof statusConfig]
        return (
          <Badge variant={config.variant} className={config.className}>
            {config.label}
          </Badge>
        )
      },
      filterable: true,
      filterOptions: [
        { label: "대기", value: "pending" },
        { label: "승인", value: "approved" },
        { label: "반려", value: "rejected" },
        { label: "출고완료", value: "issued" },
        { label: "발주대기", value: "backordered" },
      ],
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-2xl font-bold">자재 출고 관리</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="whitespace-nowrap"
            onClick={() =>
              toast({ title: "엑셀 내보내기", description: "출고 목록이 엑셀 파일로 내보내기 되었습니다." })
            }
          >
            <Download className="h-4 w-4 mr-2" />
            엑셀 내보내기
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="whitespace-nowrap"
            onClick={() => toast({ title: "엑셀 가져오기", description: "출고 목록을 엑셀 파일에서 가져왔습니다." })}
          >
            <Upload className="h-4 w-4 mr-2" />
            엑셀 가져오기
          </Button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 출고 건수</CardTitle>
            <ArrowDownCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalOut}</div>
            <p className="text-xs text-muted-foreground">건</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">요청 기반 출고 대기</CardTitle>
            <CardDescription>승인되어 출고 대기 중인 요청</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-orange-500 mr-2" />
              <span className="text-2xl font-bold text-orange-500">{pendingIssuanceRequestsCount}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">미처리 직접 출고</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingOutbound}</div>
            <p className="text-xs text-muted-foreground">건</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">완료된 출고</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedOutbound}</div>
            <p className="text-xs text-muted-foreground">건</p>
          </CardContent>
        </Card>
      </div>

      {/* 출고 목록 탭 */}
      <Card>
        <CardHeader>
          <CardTitle>자재 출고 내역</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="request-based">
            <TabsList>
              <TabsTrigger value="request-based">요청 기반 출고</TabsTrigger>
              <TabsTrigger value="direct-outbound">직접 출고</TabsTrigger>
              <TabsTrigger value="outbound-history">전체 출고 이력</TabsTrigger>
            </TabsList>

            <TabsContent value="request-based" className="mt-4">
              <DataTable
                data={approvedIssuanceRequests}
                columns={requestBasedOutboundColumns}
                searchPlaceholder="요청번호, 자재명, 요청자로 검색..."
                addButtonText={`선택 항목 출고 처리 (${selectedRequestIds.length})`}
                onAdd={handleIssueSelectedRequests}
                showExport={true}
                showImport={false}
                loading={false}
              />
            </TabsContent>

            <TabsContent value="direct-outbound" className="mt-4">
              <DataTable
                data={outboundTransactions.filter((t) => t.referenceNo?.startsWith("DIRECT-OUT") || !t.referenceNo)}
                columns={outboundColumns}
                onAdd={() => setIsDirectOutboundFormOpen(true)}
                addButtonText="새 직접 출고 등록"
                searchPlaceholder="자재코드, 자재명, 참조번호로 검색..."
                showExport={true}
                showImport={true}
              />
            </TabsContent>

            <TabsContent value="outbound-history" className="mt-4">
              <DataTable
                data={outboundTransactions}
                columns={outboundColumns}
                addButtonText="새 직접 출고 등록"
                onAdd={() => setIsDirectOutboundFormOpen(true)}
                searchPlaceholder="자재코드, 자재명, 참조번호로 검색..."
                showExport={true}
                showImport={true}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* 직접 출고 등록 다이얼로그 */}
      <Dialog open={isDirectOutboundFormOpen} onOpenChange={setIsDirectOutboundFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>직접 자재 출고 등록</DialogTitle>
          </DialogHeader>
          <MaterialOutboundForm
            onSubmit={handleDirectOutboundSubmit}
            onCancel={() => setIsDirectOutboundFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
