"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/common/data-table"
import { CalibrationForm } from "./calibration-form"
import { ImportExportDialog } from "@/components/common/import-export-dialog"
import { mockCalibrationRecords } from "@/lib/mock-data/metering"
import type { CalibrationRecord } from "@/types/metering"
import { calibrationResultLabels, calibrationStatusLabels } from "@/types/metering"
import { Search, Plus, Upload, Filter, RefreshCw, Settings } from "lucide-react"

export function CalibrationManagement() {
  const [records, setRecords] = useState<CalibrationRecord[]>(mockCalibrationRecords)
  const [searchTerm, setSearchTerm] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isImportExportOpen, setIsImportExportOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<CalibrationRecord | null>(null)

  const filteredRecords = records.filter(
    (record) =>
      record.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.instrumentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.calibratedBy.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSubmit = (data: Partial<CalibrationRecord>) => {
    if (selectedRecord) {
      setRecords((prev) => prev.map((record) => (record.id === selectedRecord.id ? { ...record, ...data } : record)))
    } else {
      const newRecord: CalibrationRecord = {
        ...(data as CalibrationRecord),
        id: `CAL${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setRecords((prev) => [...prev, newRecord])
    }
    setSelectedRecord(null)
  }

  const handleEdit = (record: CalibrationRecord) => {
    setSelectedRecord(record)
    setIsFormOpen(true)
  }

  const handleDelete = (id: string) => {
    setRecords((prev) => prev.filter((record) => record.id !== id))
  }

  const handleImportComplete = async (data: CalibrationRecord[]) => {
    setRecords(data)
  }

  const columns = [
    {
      key: "equipmentName",
      title: "설비명",
      render: (value: any, record: CalibrationRecord) => record.equipmentName || "-",
    },
    {
      key: "instrumentType",
      title: "계측기 유형",
      render: (value: any, record: CalibrationRecord) => record.instrumentType || "-",
    },
    {
      key: "serialNumber",
      title: "시리얼 번호",
      render: (value: any, record: CalibrationRecord) => record.serialNumber || "-",
    },
    {
      key: "calibrationDate",
      title: "교정일자",
      render: (value: any, record: CalibrationRecord) =>
        record.calibrationDate ? new Date(record.calibrationDate).toLocaleDateString() : "-",
    },
    {
      key: "nextCalibrationDate",
      title: "다음 교정일자",
      render: (value: any, record: CalibrationRecord) =>
        record.nextCalibrationDate ? new Date(record.nextCalibrationDate).toLocaleDateString() : "-",
    },
    {
      key: "result",
      title: "교정 결과",
      render: (value: any, record: CalibrationRecord) => (
        <Badge
          variant={record.result === "pass" ? "default" : record.result === "conditional" ? "secondary" : "destructive"}
        >
          {calibrationResultLabels[record.result] || "-"}
        </Badge>
      ),
    },
    {
      key: "status",
      title: "상태",
      render: (value: any, record: CalibrationRecord) => (
        <Badge
          variant={
            record.status === "completed" ? "default" : record.status === "overdue" ? "destructive" : "secondary"
          }
        >
          {calibrationStatusLabels[record.status] || "-"}
        </Badge>
      ),
    },
  ]

  const exportColumns = [
    { key: "equipmentName", title: "설비명" },
    { key: "instrumentType", title: "계측기 유형" },
    { key: "serialNumber", title: "시리얼 번호" },
    { key: "calibrationDate", title: "교정일자" },
    { key: "nextCalibrationDate", title: "다음 교정일자" },
    { key: "accuracy", title: "정확도" },
    { key: "result", title: "교정 결과" },
    { key: "calibratedBy", title: "교정자" },
    { key: "calibrationAgency", title: "교정 기관" },
    { key: "certificateNumber", title: "인증서 번호" },
    { key: "status", title: "상태" },
  ]

  const importColumns = [
    { key: "equipmentName", title: "설비명", required: true },
    { key: "instrumentType", title: "계측기 유형", required: true },
    { key: "serialNumber", title: "시리얼 번호", required: true },
    { key: "calibrationDate", title: "교정일자", required: true },
    { key: "nextCalibrationDate", title: "다음 교정일자", required: true },
    { key: "accuracy", title: "정확도", required: false },
    { key: "result", title: "교정 결과", required: true },
    { key: "calibratedBy", title: "교정자", required: true },
    { key: "calibrationAgency", title: "교정 기관", required: true },
    { key: "certificateNumber", title: "인증서 번호", required: false },
    { key: "status", title: "상태", required: true },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">계측기검교정</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => setIsImportExportOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            가져오기/내보내기
          </Button>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            등록
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>검교정 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="설비명, 계측기 유형, 교정기관으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              필터
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              새로고침
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              설정
            </Button>
          </div>

          <DataTable data={filteredRecords} columns={columns} onEdit={handleEdit} onDelete={handleDelete} />
        </CardContent>
      </Card>

      <CalibrationForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setSelectedRecord(null)
        }}
        onSubmit={handleSubmit}
        initialData={selectedRecord}
      />

      <ImportExportDialog
        open={isImportExportOpen}
        onOpenChange={setIsImportExportOpen}
        title="검교정 데이터"
        exportColumns={exportColumns}
        importColumns={importColumns}
        exportData={filteredRecords}
        onImportComplete={handleImportComplete}
        exportOptions={{ filename: "calibration_records" }}
        sampleData={[
          {
            equipmentName: "압력계 #1",
            instrumentType: "압력계",
            serialNumber: "PC-001",
            calibrationDate: new Date().toISOString(),
            nextCalibrationDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
            accuracy: 0.01,
            result: "pass",
            calibratedBy: "김철수",
            calibrationAgency: "한국계측기술원",
            certificateNumber: "CERT-2023-001",
            status: "completed",
          },
        ]}
      />
    </div>
  )
}
