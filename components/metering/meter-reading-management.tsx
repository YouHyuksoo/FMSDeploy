"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/common/data-table"
import { MeterReadingForm } from "./meter-reading-form"
import { ImportExportDialog } from "@/components/common/import-export-dialog"
import { Plus, Upload, Filter, RefreshCw, Settings } from "lucide-react"
import { MeterReading } from "@/types/metering"
import { mockMeterReadings } from "@/lib/mock-data/metering"
import { useToast } from "@/components/ui/use-toast"
import { PageHeader, PageActions } from "@/components/layout/page-header"

// 상수 정의
const meterTypeLabels: Record<string, string> = {
  electricity: "전력",
  water: "수도",
  gas: "가스",
  heat: "난방",
  steam: "스팀",
}

const meterReadingStatusLabels: Record<string, string> = {
  pending: "대기중",
  completed: "완료됨",
  confirmed: "확인됨",
  rejected: "반려됨",
}

// 컬럼 정의
const columns = [
  { key: "equipmentName", title: "설비명" },
  { key: "meterType", title: "검침 유형", render: (value: string) => meterTypeLabels[value] || value },
  { key: "readingDate", title: "검침 일시" },
  { key: "currentReading", title: "현재 검침값" },
  { key: "consumption", title: "사용량" },
  { key: "unit", title: "단위" },
  { key: "cost", title: "비용" },
  { key: "readBy", title: "검침자" },
  { 
    key: "status", 
    title: "상태", 
    render: (value: string) => (
      <Badge variant={value === 'confirmed' ? 'default' : 'secondary'}>
        {meterReadingStatusLabels[value] || value}
      </Badge>
    )
  },
]

const exportColumns = [
  { key: "equipmentName", title: "설비명" },
  { key: "meterType", title: "검침 유형" },
  { key: "readingDate", title: "검침 일시" },
  { key: "currentReading", title: "현재 검침값" },
  { key: "consumption", title: "사용량" },
  { key: "unit", title: "단위" },
  { key: "cost", title: "비용" },
  { key: "readBy", title: "검침자" },
  { key: "status", title: "상태" },
]

const importColumns = [
  { key: "equipmentName", title: "설비명", required: true },
  { key: "meterType", title: "검침 유형", required: true },
  { key: "readingDate", title: "검침 일시", required: true },
  { key: "currentReading", title: "현재 검침값", required: true, type: "number" },
  { key: "consumption", title: "사용량", type: "number" },
  { key: "unit", title: "단위" },
  { key: "cost", title: "비용", type: "number" },
  { key: "readBy", title: "검침자" },
  { key: "status", title: "상태" },
]

export function MeterReadingManagement() {
  const [readings, setReadings] = useState<MeterReading[]>(mockMeterReadings)
  const [searchTerm, setSearchTerm] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isImportExportOpen, setIsImportExportOpen] = useState(false)
  const [selectedReading, setSelectedReading] = useState<MeterReading | null>(null)

  const filteredReadings = readings.filter(
    (reading) =>
      reading.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reading.readBy.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSubmit = (data: Partial<MeterReading>) => {
    if (selectedReading) {
      setReadings((prev) =>
        prev.map((reading) => (reading.id === selectedReading.id ? { ...reading, ...data } : reading)),
      )
    } else {
      const newReading: MeterReading = {
        ...(data as MeterReading),
        id: `MR${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setReadings((prev) => [...prev, newReading])
    }
    setSelectedReading(null)
  }

  const handleEdit = (reading: MeterReading) => {
    setSelectedReading(reading)
    setIsFormOpen(true)
  }

  const handleDelete = (id: string) => {
    setReadings((prev) => prev.filter((reading) => reading.id !== id))
  }

  const handleImportComplete = async (data: MeterReading[]) => {
    setReadings(data)
  }

  const columns = [
    {
      key: "equipmentName",
      title: "설비명",
      render: (value: any, reading: MeterReading) => reading.equipmentName || "-",
    },
    {
      key: "meterType",
      title: "계측기 유형",
      render: (value: any, reading: MeterReading) => meterTypeLabels[reading.meterType] || "-",
    },
    {
      key: "readingDate",
      title: "검침일자",
      render: (value: any, reading: MeterReading) =>
        reading.readingDate ? new Date(reading.readingDate).toLocaleDateString() : "-",
    },
    {
      key: "consumption",
      title: "사용량",
      render: (value: any, reading: MeterReading) => `${reading.consumption || 0} ${reading.unit || ""}`,
    },
    {
      key: "cost",
      title: "비용",
      render: (value: any, reading: MeterReading) => (reading.cost ? `₩${reading.cost.toLocaleString()}` : "-"),
    },
    {
      key: "readBy",
      title: "검침자",
      render: (value: any, reading: MeterReading) => reading.readBy || "-",
    },
    {
      key: "status",
      title: "상태",
      render: (value: any, reading: MeterReading) => (
        <Badge
          variant={
            reading.status === "confirmed" ? "default" : reading.status === "pending" ? "secondary" : "destructive"
          }
        >
          {meterReadingStatusLabels[reading.status] || "-"}
        </Badge>
      ),
    },
  ]

  const exportColumns = [
    { key: "equipmentName", title: "설비명" },
    { key: "meterType", title: "계측기 유형" },
    { key: "readingDate", title: "검침일자" },
    { key: "previousReading", title: "이전 검침값" },
    { key: "currentReading", title: "현재 검침값" },
    { key: "consumption", title: "사용량" },
    { key: "unit", title: "단위" },
    { key: "cost", title: "비용" },
    { key: "readBy", title: "검침자" },
    { key: "status", title: "상태" },
  ]

  const importColumns = [
    { key: "equipmentName", title: "설비명", required: true },
    { key: "meterType", title: "계측기 유형", required: true },
    { key: "readingDate", title: "검침일자", required: true },
    { key: "previousReading", title: "이전 검침값", required: true },
    { key: "currentReading", title: "현재 검침값", required: true },
    { key: "consumption", title: "사용량", required: false },
    { key: "unit", title: "단위", required: true },
    { key: "cost", title: "비용", required: false },
    { key: "readBy", title: "검침자", required: true },
    { key: "status", title: "상태", required: true },
  ]

  return (
    <div className="space-y-6">
      <PageHeader 
        title="검침관리" 
        description="검침 데이터를 관리하고 모니터링하세요."
      >
        <PageActions>
          <Button variant="outline" size="sm" onClick={() => setIsImportExportOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            가져오기/내보내기
          </Button>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            등록
          </Button>
        </PageActions>
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle>검침 목록</CardTitle>
        </CardHeader>
        <CardContent>

          <DataTable 
            data={filteredReadings} 
            columns={columns}
            searchPlaceholder="설비명, 검침자로 검색..."
            actions={[
              {
                key: 'edit',
                label: '수정',
                icon: () => <span>✏️</span>,
                onClick: (record) => handleEdit(record as MeterReading),
              },
              {
                key: 'delete',
                label: '삭제',
                icon: () => <span>🗑️</span>,
                onClick: (record) => handleDelete(record.id),
                variant: 'destructive' as const,
              },
            ]}
          />
        </CardContent>
      </Card>

      <MeterReadingForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setSelectedReading(null)
        }}
        onSubmit={handleSubmit}
        initialData={selectedReading}
      />

      <ImportExportDialog
        open={isImportExportOpen}
        onOpenChange={setIsImportExportOpen}
        title="검침 데이터"
        exportColumns={exportColumns}
        importColumns={importColumns}
        exportData={filteredReadings}
        onImportComplete={handleImportComplete}
        exportOptions={{ filename: "meter_readings" }}
        sampleData={[
          {
            equipmentName: "냉각기 #1",
            meterType: "electricity",
            readingDate: new Date().toISOString(),
            previousReading: 1000,
            currentReading: 1200,
            consumption: 200,
            unit: "kWh",
            cost: 20000,
            readBy: "홍길동",
            status: "confirmed",
          },
        ]}
      />
    </div>
  )
}
