"use client"

import { CardDescription } from "@/components/ui/card"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/common/data-table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FileDown, FileUp, Clock, CheckCircle, XCircle, Package } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import MaterialIssuanceRequestForm from "./material-issuance-request-form"
import { mockMaterialIssuanceRequests } from "@/lib/mock-data/material-issuance"
import type { MaterialIssuanceRequest } from "@/types/material-issuance"
import type { Column } from "@/components/common/data-table"

export function MaterialIssuanceRequestManagement() {
  const [requests, setRequests] = useState<MaterialIssuanceRequest[]>(mockMaterialIssuanceRequests)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const { toast } = useToast()

  // 통계 계산
  const totalRequests = requests.length
  const pendingRequests = requests.filter((r) => r.status === "pending").length
  const approvedRequests = requests.filter((r) => r.status === "approved").length
  const issuedRequests = requests.filter((r) => r.status === "issued").length
  const backorderedRequests = requests.filter((r) => r.status === "backordered").length
  const rejectedRequests = requests.filter((r) => r.status === "rejected").length

  // 컬럼 정의
  const columns: Column<MaterialIssuanceRequest>[] = [
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
      key: "quantity",
      title: "요청수량",
      width: "100px",
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
      width: "250px",
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
    {
      key: "referenceNo",
      title: "참조번호",
      width: "120px",
      searchable: true,
    },
    {
      key: "actions",
      title: "작업",
      width: "80px",
      render: (value: any, record: MaterialIssuanceRequest) => (
        <div className="flex gap-2">
          {record.status === "pending" && (
            <>
              <Button variant="ghost" size="sm" onClick={() => handleApproveRequest(record.id)}>
                승인
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleRejectRequest(record.id)}>
                반려
              </Button>
            </>
          )}
          {record.status === "approved" && (
            <Button variant="ghost" size="sm" onClick={() => handleIssueRequest(record.id)}>
              출고
            </Button>
          )}
        </div>
      ),
    },
  ]

  const handleRequestSubmit = (data: Omit<MaterialIssuanceRequest, "id" | "requestedAt" | "status">) => {
    const newRequest: MaterialIssuanceRequest = {
      id: `IR${String(requests.length + 1).padStart(3, "0")}`,
      ...data,
      requestedAt: new Date().toLocaleString(),
      status: "pending", // Initial status is pending
    }
    setRequests((prev) => [...prev, newRequest])
    setIsFormOpen(false)
    toast({
      title: "요청 등록 완료",
      description: `${data.materialName} 출고 요청이 등록되었습니다.`,
    })
  }

  const handleApproveRequest = (id: string) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id
          ? { ...req, status: "approved", approvedBy: "관리자", approvedAt: new Date().toLocaleString() }
          : req,
      ),
    )
    toast({
      title: "요청 승인",
      description: "자재 출고 요청이 승인되었습니다.",
    })
  }

  const handleRejectRequest = (id: string) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id
          ? { ...req, status: "rejected", approvedBy: "관리자", approvedAt: new Date().toLocaleString() }
          : req,
      ),
    )
    toast({
      title: "요청 반려",
      description: "자재 출고 요청이 반려되었습니다.",
    })
  }

  const handleIssueRequest = (id: string) => {
    // In a real application, this would check stock and either issue or set to backordered
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, status: "issued", issuedBy: "창고담당", issuedAt: new Date().toLocaleString() } : req,
      ),
    )
    toast({
      title: "자재 출고",
      description: "자재가 성공적으로 출고되었습니다.",
    })
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">자재 출고 요청 관리</h1>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() =>
              toast({ title: "엑셀 내보내기", description: "출고 요청 목록이 엑셀 파일로 내보내기 되었습니다." })
            }
          >
            <FileDown className="mr-2 h-4 w-4" />
            엑셀 내보내기
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast({ title: "엑셀 가져오기", description: "출고 요청 목록을 엑셀 파일에서 가져왔습니다." })
            }
          >
            <FileUp className="mr-2 h-4 w-4" />
            엑셀 가져오기
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">총 요청</CardTitle>
            <CardDescription>전체 자재 출고 요청</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Package className="h-5 w-5 text-muted-foreground mr-2" />
              <span className="text-2xl font-bold">{totalRequests}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">대기 중</CardTitle>
            <CardDescription>승인 대기 중인 요청</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-orange-500 mr-2" />
              <span className="text-2xl font-bold text-orange-500">{pendingRequests}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">승인됨</CardTitle>
            <CardDescription>승인 완료된 요청</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-blue-500 mr-2" />
              <span className="text-2xl font-bold text-blue-500">{approvedRequests}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">출고 완료</CardTitle>
            <CardDescription>자재 출고가 완료된 요청</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Package className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-2xl font-bold text-green-500">{issuedRequests}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">반려/발주대기</CardTitle>
            <CardDescription>반려되거나 발주 대기 중인 요청</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <XCircle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-2xl font-bold text-red-500">{rejectedRequests + backorderedRequests}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>자재 출고 요청 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={requests}
            columns={columns}
            onAdd={() => setIsFormOpen(true)}
            addButtonText="새 요청 등록"
            searchPlaceholder="자재명, 요청자, 참조번호로 검색..."
            showExport={true}
            showImport={true}
          />
        </CardContent>
      </Card>
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>자재 출고 요청 등록</DialogTitle>
          </DialogHeader>
          <MaterialIssuanceRequestForm onSubmit={handleRequestSubmit} onCancel={() => setIsFormOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
