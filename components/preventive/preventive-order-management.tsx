"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/common/data-table"
import { ImportExportDialog } from "@/components/common/import-export-dialog"
import { PreventiveOrderForm } from "./preventive-order-form"
import {
  mockPreventiveOrders,
  mockPreventiveMasters, // 추가
} from "@/lib/mock-data/preventive"
import { mockInspectionMasters } from "@/lib/mock-data/inspection-master" // 추가
import { preventiveOrderStatusLabels, preventivePriorityLabels } from "@/types/preventive"
import type { PreventiveOrder, PreventiveMaster } from "@/types/preventive" // PreventiveMaster 추가
import { Plus, FileDown } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { calculateNextScheduleDate, getTodayIsoDate } from "@/lib/utils" // 추가

export function PreventiveOrderManagement() {
  const [orders, setOrders] = useState<PreventiveOrder[]>(mockPreventiveOrders)
  // PreventiveMaster 상태도 관리 (실제 앱에서는 props 또는 context로 받을 수 있음)
  const [preventiveMasters, setPreventiveMasters] = useState<PreventiveMaster[]>(mockPreventiveMasters)
  const [selectedOrder, setSelectedOrder] = useState<PreventiveOrder | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isImportExportOpen, setIsImportExportOpen] = useState(false)
  const { toast } = useToast()

  // Populate masterTitle, equipmentName, assignedToName for display if not present in mockPreventiveOrders
  useEffect(() => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        const pm = preventiveMasters.find((m) => m.id === order.masterId)
        // In a real app, equipment and user names would be fetched or joined
        return {
          ...order,
          masterTitle: order.masterTitle || pm?.taskDescription || `PM ${order.masterId}`,
          equipmentName: order.equipmentName || `EQ ${pm?.equipmentId}`,
          assignedToName: order.assignedToName || `User ${order.assignedTo}`,
        }
      }),
    )
  }, [preventiveMasters])

  const columns = [
    {
      key: "masterTitle",
      title: "정비명",
      searchable: true,
      render: (value: any, order: PreventiveOrder) => order.masterTitle || "-",
    },
    {
      key: "equipmentName",
      title: "설비명",
      searchable: true,
      render: (value: any, order: PreventiveOrder) => order.equipmentName || "-",
    },
    {
      key: "scheduledDate",
      title: "예정일",
      render: (value: any, order: PreventiveOrder) =>
        order.scheduledDate ? new Date(order.scheduledDate).toLocaleDateString("ko-KR") : "-",
    },
    {
      key: "actualEndDate", // 실제완료일 컬럼 추가
      title: "완료일",
      render: (value: any, order: PreventiveOrder) =>
        order.actualEndDate ? new Date(order.actualEndDate).toLocaleDateString("ko-KR") : "-",
    },
    {
      key: "assignedToName",
      title: "담당자",
      render: (value: any, order: PreventiveOrder) => order.assignedToName || "-",
    },
    {
      key: "status",
      title: "상태",
      render: (value: any, order: PreventiveOrder) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            order.status === "completed"
              ? "bg-green-100 text-green-800"
              : order.status === "in_progress"
                ? "bg-blue-100 text-blue-800"
                : order.status === "overdue"
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-800"
          }`}
        >
          {order.status ? preventiveOrderStatusLabels[order.status] : "-"}
        </span>
      ),
    },
    {
      key: "priority",
      title: "우선순위",
      render: (value: any, order: PreventiveOrder) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            order.priority === "critical"
              ? "bg-red-100 text-red-800"
              : order.priority === "high"
                ? "bg-orange-100 text-orange-800"
                : order.priority === "medium"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-800"
          }`}
        >
          {order.priority ? preventivePriorityLabels[order.priority] : "-"}
        </span>
      ),
    },
    {
      key: "estimatedCost",
      title: "예상비용",
      render: (value: any, order: PreventiveOrder) =>
        order.estimatedCost !== undefined && order.estimatedCost !== null
          ? `₩${order.estimatedCost.toLocaleString()}`
          : "-",
    },
    {
      key: "actions",
      title: "작업",
      render: (value: any, order: PreventiveOrder) => (
        <Button variant="outline" size="sm" onClick={() => handleEdit(order)}>
          수정
        </Button>
      ),
    },
  ]

  const exportColumns = [
    { key: "masterTitle", title: "정비명", width: 30 },
    { key: "equipmentName", title: "설비명", width: 20 },
    { key: "scheduledDate", title: "예정일", width: 15 },
    { key: "actualEndDate", title: "완료일", width: 15 },
    { key: "assignedToName", title: "담당자", width: 15 },
    { key: "status", title: "상태", width: 10 },
    { key: "estimatedCost", title: "예상비용", width: 15 },
  ]

  const importColumns = [
    { key: "masterTitle", title: "정비명", required: true },
    { key: "equipmentName", title: "설비명", required: true },
    { key: "scheduledDate", title: "예정일", required: true },
    { key: "actualEndDate", title: "완료일" },
    { key: "assignedToName", title: "담당자", required: true },
    { key: "estimatedCost", title: "예상비용", required: true },
  ]

  const sampleData = [
    {
      masterTitle: "주간 정밀도 점검",
      equipmentName: "CNC 밀링머신 #1",
      scheduledDate: getTodayIsoDate(),
      actualEndDate: "",
      assignedToName: "김정비",
      estimatedCost: 50000,
    },
  ]

  const handleAdd = () => {
    setSelectedOrder(null)
    setIsFormOpen(true)
  }

  const handleEdit = (order: PreventiveOrder) => {
    setSelectedOrder(order)
    setIsFormOpen(true)
  }

  const updatePreventiveMasterSchedule = (completedOrder: PreventiveOrder) => {
    if (!completedOrder.masterId || !completedOrder.actualEndDate) {
      console.warn("Master ID or Actual End Date is missing for completed order.", completedOrder)
      return
    }

    const preventiveMaster = preventiveMasters.find((pm) => pm.id === completedOrder.masterId)
    if (!preventiveMaster) {
      console.warn(`Preventive Master with ID ${completedOrder.masterId} not found.`)
      return
    }

    const inspectionTemplate = mockInspectionMasters.find((it) => it.id === preventiveMaster.templateId)
    if (!inspectionTemplate || !inspectionTemplate.periodType || inspectionTemplate.periodValue === undefined) {
      console.warn(`Inspection Template (ID: ${preventiveMaster.templateId}) not found or has invalid period info.`)
      return
    }

    const newNextScheduleDate = calculateNextScheduleDate(
      completedOrder.actualEndDate,
      inspectionTemplate.periodType,
      inspectionTemplate.periodValue,
    )

    if (newNextScheduleDate) {
      const updatedPreventiveMasters = preventiveMasters.map((pm) =>
        pm.id === preventiveMaster.id
          ? {
              ...pm,
              lastExecutedDate: completedOrder.actualEndDate,
              nextScheduleDate: newNextScheduleDate,
              updatedAt: new Date().toISOString(),
              updatedBy: "system", // 또는 현재 사용자 ID
            }
          : pm,
      )
      // mockPreventiveMasters 배열을 직접 업데이트 (실제 앱에서는 API 호출 후 상태 업데이트)
      // 전역 상태 관리 라이브러리를 사용한다면 해당 스토어 업데이트
      mockPreventiveMasters.length = 0 // Clear and push to simulate update if needed by other components
      mockPreventiveMasters.push(...updatedPreventiveMasters)
      setPreventiveMasters(updatedPreventiveMasters) // 로컬 상태 업데이트

      toast({
        title: "예방정비 마스터 업데이트",
        description: `"${preventiveMaster.taskDescription || preventiveMaster.id}"의 다음 예정일이 ${newNextScheduleDate}로 업데이트되었습니다.`,
      })
    } else {
      toast({
        title: "다음 예정일 계산 불가",
        description: `"${preventiveMaster.taskDescription || preventiveMaster.id}"의 다음 예정일을 계산할 수 없습니다 (주기: ${inspectionTemplate.periodType}).`,
        variant: "destructive",
      })
    }
  }

  const handleSave = (orderData: Partial<PreventiveOrder>) => {
    let savedOrder: PreventiveOrder | undefined
    if (selectedOrder) {
      const updatedOrder = { ...selectedOrder, ...orderData, updatedAt: new Date().toISOString() }
      setOrders(orders.map((o) => (o.id === selectedOrder.id ? updatedOrder : o)))
      savedOrder = updatedOrder
      toast({
        title: "수정 완료",
        description: "정비오더가 수정되었습니다.",
      })
    } else {
      const newOrder: PreventiveOrder = {
        id: `po-${Date.now()}`,
        masterId: orderData.masterId || "pm-placeholder", // Ensure masterId is present
        equipmentId: orderData.equipmentId || "EQ-placeholder",
        assignedTo: orderData.assignedTo || "user-placeholder",
        createdBy: "admin",
        createdAt: new Date().toISOString(),
        updatedBy: "admin",
        updatedAt: new Date().toISOString(),
        attachments: [],
        ...orderData,
      } as PreventiveOrder // Type assertion might be needed if all fields aren't covered

      setOrders([...orders, newOrder])
      savedOrder = newOrder
      toast({
        title: "등록 완료",
        description: "정비오더가 등록되었습니다.",
      })
    }
    setIsFormOpen(false)

    // 작업 완료 시 PreventiveMaster 업데이트 로직 호출
    if (savedOrder && savedOrder.status === "completed" && savedOrder.actualEndDate) {
      updatePreventiveMasterSchedule(savedOrder)
    }
  }

  const handleImportComplete = async (data: PreventiveOrder[]) => {
    const newOrders = data.map(
      (item) =>
        ({
          id: `po-imported-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          masterId: item.masterId || "pm-imported-placeholder",
          equipmentId: item.equipmentId || "EQ-imported-placeholder",
          assignedTo: item.assignedTo || "user-imported-placeholder",
          createdBy: "importer",
          createdAt: new Date().toISOString(),
          updatedBy: "importer",
          updatedAt: new Date().toISOString(),
          attachments: [],
          ...item,
        }) as PreventiveOrder,
    )

    setOrders([...orders, ...newOrders])
    toast({
      title: "가져오기 완료",
      description: `${newOrders.length}개의 정비오더를 가져왔습니다.`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">정비오더생성</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsImportExportOpen(true)}>
            <FileDown className="h-4 w-4 mr-2" />
            가져오기/내보내기
          </Button>
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            등록
          </Button>
        </div>
      </div>

      <DataTable data={orders} columns={columns} />

      <PreventiveOrderForm
        order={selectedOrder}
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSave={handleSave}
        preventiveMasters={preventiveMasters} // Pass preventiveMasters to form for selection
      />

      <ImportExportDialog
        open={isImportExportOpen}
        onOpenChange={setIsImportExportOpen}
        title="정비오더"
        exportColumns={exportColumns}
        importColumns={importColumns}
        exportData={orders}
        onImportComplete={handleImportComplete}
        sampleData={sampleData}
      />
    </div>
  )
}
