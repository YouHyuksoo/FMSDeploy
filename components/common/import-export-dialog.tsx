"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ExportUtils, type ExportColumn, type ExportOptions } from "@/lib/utils/export-utils"
import { ImportUtils, type ImportColumn, type ImportResult, type ImportError } from "@/lib/utils/import-utils"
import { Download, FileSpreadsheet, AlertCircle, CheckCircle, X, FileText, Eye } from "lucide-react"

interface ImportExportDialogProps<T> {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  exportColumns: ExportColumn[]
  importColumns: ImportColumn[]
  exportData?: T[]
  onImportComplete: (data: T[]) => Promise<void>
  exportOptions?: ExportOptions
  sampleData?: Partial<T>[]
}

export function ImportExportDialog<T extends Record<string, any>>({
  open,
  onOpenChange,
  title,
  exportColumns,
  importColumns,
  exportData = [],
  onImportComplete,
  exportOptions = {},
  sampleData = [],
}: ImportExportDialogProps<T>) {
  const [activeTab, setActiveTab] = useState("export")
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importResult, setImportResult] = useState<ImportResult<T> | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExportExcel = () => {
    ExportUtils.exportToExcel(exportData, exportColumns, {
      filename: exportOptions.filename || title.toLowerCase().replace(/\s+/g, "_"),
      ...exportOptions,
    })
  }

  const handleExportCSV = () => {
    ExportUtils.exportToCSV(exportData, exportColumns, {
      filename: exportOptions.filename || title.toLowerCase().replace(/\s+/g, "_"),
      ...exportOptions,
    })
  }

  const handleDownloadTemplate = () => {
    ExportUtils.createTemplate(exportColumns, sampleData, {
      filename: `${title.toLowerCase().replace(/\s+/g, "_")}_template`,
      ...exportOptions,
    })
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setImportFile(file)
      setImportResult(null)
      setShowPreview(false)
    }
  }

  const handleImportProcess = async () => {
    if (!importFile) return

    setIsProcessing(true)
    try {
      const result = await ImportUtils.importFromFile<T>(importFile, importColumns)
      setImportResult(result)
      setShowPreview(true)
    } catch (error) {
      console.error("Import error:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleImportConfirm = async () => {
    if (!importResult || !importResult.success) return

    try {
      await onImportComplete(importResult.data)
      onOpenChange(false)
      resetImportState()
    } catch (error) {
      console.error("Import confirmation error:", error)
    }
  }

  const resetImportState = () => {
    setImportFile(null)
    setImportResult(null)
    setShowPreview(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const getErrorsByRow = (errors: ImportError[]) => {
    const errorsByRow: Record<number, ImportError[]> = {}
    errors.forEach((error) => {
      if (!errorsByRow[error.row]) {
        errorsByRow[error.row] = []
      }
      errorsByRow[error.row].push(error)
    })
    return errorsByRow
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{title} 데이터 관리</DialogTitle>
          <DialogDescription>데이터를 내보내거나 가져올 수 있습니다.</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="export">내보내기</TabsTrigger>
            <TabsTrigger value="import">가져오기</TabsTrigger>
          </TabsList>

          <TabsContent value="export" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-4">
                <div className="text-center p-6 border-2 border-dashed border-muted rounded-lg">
                  <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-green-600" />
                  <h3 className="font-semibold mb-2">Excel 파일</h3>
                  <p className="text-sm text-muted-foreground mb-4">스타일링과 서식이 포함된 Excel 파일로 내보내기</p>
                  <Button onClick={handleExportExcel} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Excel 다운로드
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-center p-6 border-2 border-dashed border-muted rounded-lg">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                  <h3 className="font-semibold mb-2">CSV 파일</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    가벼운 CSV 형식으로 내보내기 (다른 시스템 연동용)
                  </p>
                  <Button onClick={handleExportCSV} variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    CSV 다운로드
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-center p-6 border-2 border-dashed border-muted rounded-lg">
                  <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-purple-600" />
                  <h3 className="font-semibold mb-2">템플릿</h3>
                  <p className="text-sm text-muted-foreground mb-4">데이터 입력용 템플릿 파일 다운로드</p>
                  <Button onClick={handleDownloadTemplate} variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    템플릿 다운로드
                  </Button>
                </div>
              </div>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                현재 {exportData?.length || 0}개의 데이터가 내보내기 됩니다. 필터가 적용된 경우 필터된 데이터만
                내보내집니다.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="import" className="space-y-4">
            {!showPreview ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="import-file">파일 선택</Label>
                  <Input
                    id="import-file"
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileSelect}
                    ref={fileInputRef}
                  />
                  <p className="text-sm text-muted-foreground">Excel (.xlsx, .xls) 또는 CSV 파일을 선택하세요.</p>
                </div>

                {importFile && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      선택된 파일: {importFile.name} ({(importFile.size / 1024).toFixed(1)} KB)
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-2">
                  <Button onClick={handleImportProcess} disabled={!importFile || isProcessing} className="flex-1">
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        처리 중...
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        미리보기
                      </>
                    )}
                  </Button>
                  <Button onClick={handleDownloadTemplate} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    템플릿
                  </Button>
                </div>

                {isProcessing && (
                  <div className="space-y-2">
                    <Progress value={50} className="w-full" />
                    <p className="text-sm text-center text-muted-foreground">파일을 분석하고 있습니다...</p>
                  </div>
                )}
              </div>
            ) : (
              importResult && (
                <div className="space-y-4">
                  {/* 결과 요약 */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{importResult.summary.total}</div>
                      <div className="text-sm text-muted-foreground">총 행 수</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{importResult.summary.success}</div>
                      <div className="text-sm text-muted-foreground">성공</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">{importResult.summary.failed}</div>
                      <div className="text-sm text-muted-foreground">실패</div>
                    </div>
                  </div>

                  {/* 오류 목록 */}
                  {importResult.errors.length > 0 && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="font-medium mb-2">다음 오류를 수정해주세요:</div>
                        <ScrollArea className="h-32">
                          <div className="space-y-1">
                            {importResult.errors.slice(0, 10).map((error, index) => (
                              <div key={index} className="text-sm">
                                {error.row}행 {error.field && `(${error.field})`}: {error.message}
                              </div>
                            ))}
                            {importResult.errors.length > 10 && (
                              <div className="text-sm font-medium">... 외 {importResult.errors.length - 10}개 오류</div>
                            )}
                          </div>
                        </ScrollArea>
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* 데이터 미리보기 */}
                  {importResult.data.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">데이터 미리보기</h4>
                        <Badge variant="outline">{importResult.data.length}개 행</Badge>
                      </div>
                      <ScrollArea className="h-64 border rounded-lg">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              {importColumns.map((col) => (
                                <TableHead key={col.key}>{col.title}</TableHead>
                              ))}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {importResult.data.slice(0, 5).map((row, index) => (
                              <TableRow key={index}>
                                {importColumns.map((col) => (
                                  <TableCell key={col.key}>{String(row[col.key as keyof T] || "")}</TableCell>
                                ))}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </ScrollArea>
                      {importResult.data.length > 5 && (
                        <p className="text-sm text-muted-foreground text-center">
                          ... 외 {importResult.data.length - 5}개 행
                        </p>
                      )}
                    </div>
                  )}

                  {/* 액션 버튼 */}
                  <div className="flex gap-2">
                    <Button onClick={() => setShowPreview(false)} variant="outline">
                      <X className="h-4 w-4 mr-2" />
                      다시 선택
                    </Button>
                    <Button
                      onClick={handleImportConfirm}
                      disabled={!importResult.success || importResult.data.length === 0}
                      className="flex-1"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      가져오기 확정 ({importResult.data.length}개)
                    </Button>
                  </div>
                </div>
              )
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
