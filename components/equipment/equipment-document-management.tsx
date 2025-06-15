"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Upload,
  Download,
  Eye,
  Trash2,
  Search,
  Filter,
  FileText,
  ImageIcon,
  File,
  CheckCircle,
  Clock,
  AlertCircle,
  Archive,
  Send,
  XCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { mockEquipmentDocuments, documentCategories, documentStatuses } from "@/lib/mock-data/equipment-documents"
import { mockEquipment } from "@/lib/mock-data/equipment"
import type { EquipmentDocument, DocumentFilter, DocumentFormData } from "@/types/equipment-document"
import { useToast } from "@/hooks/use-toast"
import DocumentApprovalWorkflow from "./document-approval-workflow"
import { mockDocumentApprovals } from "@/lib/mock-data/document-approvals"
import type { DocumentApproval } from "@/types/equipment-document"

export function EquipmentDocumentManagement() {
  const { toast } = useToast()
  const [documents, setDocuments] = useState<EquipmentDocument[]>(mockEquipmentDocuments)
  const [filter, setFilter] = useState<DocumentFilter>({
    pendingApproval: false,
  })
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<EquipmentDocument | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [formData, setFormData] = useState<DocumentFormData>({
    equipmentId: "",
    title: "",
    description: "",
    category: "manual",
    tags: [],
    expiryDate: "",
  })
  const [approvals, setApprovals] = useState<DocumentApproval[]>(mockDocumentApprovals)
  const [currentUserRole] = useState<"author" | "reviewer" | "admin">("reviewer") // 실제로는 인증 컨텍스트에서 가져옴
  const [currentUserId] = useState("user-002") // 실제로는 인증 컨텍스트에서 가져옴

  // 필터링된 문서 목록
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      // 승인 대기 필터 추가
      if (filter.pendingApproval && !(doc.status === "review_requested" || doc.status === "review")) {
        return false
      }

      if (filter.equipmentId && filter.equipmentId !== "all" && doc.equipmentId !== filter.equipmentId) return false
      if (filter.category && filter.category !== "all" && doc.category !== filter.category) return false
      if (filter.status && filter.status !== "all" && doc.status !== filter.status) return false
      if (filter.searchTerm) {
        const searchLower = filter.searchTerm.toLowerCase()
        return (
          doc.title.toLowerCase().includes(searchLower) ||
          doc.description?.toLowerCase().includes(searchLower) ||
          doc.equipmentName.toLowerCase().includes(searchLower) ||
          doc.tags.some((tag) => tag.toLowerCase().includes(searchLower))
        )
      }
      return true
    })
  }, [documents, filter])

  // 카테고리별 문서 통계
  const documentStats = useMemo(() => {
    const stats = documentCategories.map((category) => ({
      ...category,
      count: documents.filter((doc) => doc.category === category.value).length,
    }))
    return stats
  }, [documents])

  // 승인 대기 문서 통계
  const pendingApprovalCount = useMemo(() => {
    return documents.filter((doc) => doc.status === "review_requested" || doc.status === "review").length
  }, [documents])

  // 파일 아이콘 반환
  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
      case "doc":
      case "docx":
        return <FileText className="h-4 w-4" />
      case "jpg":
      case "png":
        return <ImageIcon className="h-4 w-4" />
      default:
        return <File className="h-4 w-4" />
    }
  }

  // 상태 아이콘 반환
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "review_requested":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "review":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "rejected":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "expired":
        return <AlertCircle className="h-4 w-4 text-orange-500" />
      case "archived":
        return <Archive className="h-4 w-4 text-purple-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  // 파일 크기 포맷
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  // 문서 상태 변경
  const handleStatusChange = (documentId: string, newStatus: string, comment?: string) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === documentId
          ? {
              ...doc,
              status: newStatus as any,
              updatedAt: new Date().toISOString(),
              updatedBy: "현재사용자",
              ...(newStatus === "approved" && {
                approvedAt: new Date().toISOString(),
                approvedBy: "현재사용자",
              }),
            }
          : doc,
      ),
    )

    // 승인 이력 추가
    const newApproval: DocumentApproval = {
      id: `approval-${Date.now()}`,
      documentId,
      reviewerId: currentUserId,
      reviewerName: "현재사용자",
      action: newStatus === "approved" ? "approve" : newStatus === "rejected" ? "reject" : "request_review",
      comment,
      createdAt: new Date().toISOString(),
    }

    setApprovals((prev) => [newApproval, ...prev])
  }

  // 문서 업로드
  const handleUpload = () => {
    if (!formData.equipmentId || !formData.title || !formData.file) {
      toast({
        title: "오류",
        description: "필수 항목을 모두 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    const newDocument: EquipmentDocument = {
      id: `doc-${Date.now()}`,
      equipmentId: formData.equipmentId,
      equipmentCode: mockEquipment.find((eq) => eq.id === formData.equipmentId)?.code || "",
      equipmentName: mockEquipment.find((eq) => eq.id === formData.equipmentId)?.name || "",
      title: formData.title,
      description: formData.description,
      category: formData.category,
      type: (formData.file.name.split(".").pop()?.toLowerCase() as any) || "other",
      filename: formData.file.name,
      originalName: formData.file.name,
      fileSize: formData.file.size,
      mimeType: formData.file.type,
      url: `/documents/${formData.file.name}`,
      version: "1.0",
      status: "draft",
      tags: formData.tags,
      uploadedAt: new Date().toISOString(),
      uploadedBy: "현재사용자",
      updatedAt: new Date().toISOString(),
      updatedBy: "현재사용자",
      expiryDate: formData.expiryDate,
      isActive: true,
    }

    setDocuments((prev) => [newDocument, ...prev])
    setIsUploadDialogOpen(false)
    setFormData({
      equipmentId: "",
      title: "",
      description: "",
      category: "manual",
      tags: [],
      expiryDate: "",
    })

    toast({
      title: "성공",
      description: "문서가 성공적으로 업로드되었습니다.",
    })
  }

  // 문서 다운로드
  const handleDownload = (document: EquipmentDocument) => {
    // 실제 구현에서는 파일 다운로드 로직 구현
    toast({
      title: "다운로드",
      description: `${document.originalName} 파일을 다운로드합니다.`,
    })
  }

  // 문서 삭제
  const handleDelete = (documentId: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== documentId))
    toast({
      title: "성공",
      description: "문서가 삭제되었습니다.",
    })
  }

  // 문서 보기
  const handleView = (document: EquipmentDocument) => {
    setSelectedDocument(document)
    setIsViewDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">설비 자료 관리</h1>
          <p className="text-muted-foreground">설비 관련 문서 및 자료를 관리합니다</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={filter.pendingApproval ? "default" : "outline"}
            onClick={() => setFilter((prev) => ({ ...prev, pendingApproval: !prev.pendingApproval }))}
          >
            <Clock className="h-4 w-4 mr-2" />
            승인 대기 ({pendingApprovalCount})
          </Button>
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                문서 업로드
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>문서 업로드</DialogTitle>
                <DialogDescription>새로운 설비 문서를 업로드합니다.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="equipment">설비 선택</Label>
                  <Select
                    value={formData.equipmentId}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, equipmentId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="설비를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockEquipment.map((equipment) => (
                        <SelectItem key={equipment.id} value={equipment.id}>
                          {equipment.code} - {equipment.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="title">문서 제목</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="문서 제목을 입력하세요"
                  />
                </div>
                <div>
                  <Label htmlFor="category">카테고리</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value: any) => setFormData((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="카테고리를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {documentCategories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="description">설명</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="문서에 대한 설명을 입력하세요"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="file">파일 선택</Label>
                  <Input
                    id="file"
                    type="file"
                    onChange={(e) => setFormData((prev) => ({ ...prev, file: e.target.files?.[0] }))}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.dwg,.jpg,.png"
                  />
                </div>
                <div>
                  <Label htmlFor="expiryDate">만료일 (선택사항)</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, expiryDate: e.target.value }))}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                  취소
                </Button>
                <Button onClick={handleUpload}>업로드</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* 승인 대기 통계 카드 */}
        <Card
          className={cn(
            "cursor-pointer transition-colors",
            filter.pendingApproval && "ring-2 ring-blue-500 bg-blue-50",
          )}
          onClick={() => setFilter((prev) => ({ ...prev, pendingApproval: !prev.pendingApproval }))}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">승인 대기</p>
                <p className="text-2xl font-bold text-blue-600">{pendingApprovalCount}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        {/* 기존 카테고리별 통계 카드들 */}
        {documentStats.map((stat) => (
          <Card key={stat.value}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.count}</p>
                </div>
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 필터 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            필터
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <Label>승인 대기 필터</Label>
              <div className="flex items-center space-x-2">
                <Button
                  variant={filter.pendingApproval ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter((prev) => ({ ...prev, pendingApproval: !prev.pendingApproval }))}
                  className="w-full"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  {filter.pendingApproval ? "승인 대기만 보기" : "전체 보기"}
                </Button>
              </div>
            </div>

            {/* 기존 필터들 */}
            <div>
              <Label>검색</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="제목, 설명, 태그로 검색..."
                  value={filter.searchTerm || ""}
                  onChange={(e) => setFilter((prev) => ({ ...prev, searchTerm: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label>설비</Label>
              <Select
                value={filter.equipmentId || "all"}
                onValueChange={(value) =>
                  setFilter((prev) => ({ ...prev, equipmentId: value === "all" ? undefined : value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="전체" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  {mockEquipment.map((equipment) => (
                    <SelectItem key={equipment.id} value={equipment.id}>
                      {equipment.code} - {equipment.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>카테고리</Label>
              <Select
                value={filter.category || "all"}
                onValueChange={(value: any) =>
                  setFilter((prev) => ({ ...prev, category: value === "all" ? undefined : value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="전체" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  {documentCategories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>상태</Label>
              <Select
                value={filter.status || "all"}
                onValueChange={(value: any) =>
                  setFilter((prev) => ({ ...prev, status: value === "all" ? undefined : value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="전체" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  {documentStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 문서 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>문서 목록 ({filteredDocuments.length}건)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>문서 정보</TableHead>
                <TableHead>설비</TableHead>
                <TableHead>카테고리</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>업로드일</TableHead>
                <TableHead>작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map((document) => (
                <TableRow key={document.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {getFileIcon(document.type)}
                        <span className="font-medium">{document.title}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {document.originalName} ({formatFileSize(document.fileSize)})
                      </div>
                      {document.description && (
                        <div className="text-sm text-muted-foreground">{document.description}</div>
                      )}
                      {document.tags.length > 0 && (
                        <div className="flex gap-1 flex-wrap">
                          {document.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{document.equipmentCode}</div>
                      <div className="text-sm text-muted-foreground">{document.equipmentName}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {documentCategories.find((cat) => cat.value === document.category)?.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(document.status)}
                      <Badge
                        variant="outline"
                        className={cn(
                          documentStatuses.find((s) => s.value === document.status)?.color === "green" &&
                            "border-green-500 text-green-700",
                          documentStatuses.find((s) => s.value === document.status)?.color === "yellow" &&
                            "border-yellow-500 text-yellow-700",
                          documentStatuses.find((s) => s.value === document.status)?.color === "red" &&
                            "border-red-500 text-red-700",
                          documentStatuses.find((s) => s.value === document.status)?.color === "blue" &&
                            "border-blue-500 text-blue-700",
                          documentStatuses.find((s) => s.value === document.status)?.color === "purple" &&
                            "border-purple-500 text-purple-700",
                          documentStatuses.find((s) => s.value === document.status)?.color === "orange" &&
                            "border-orange-500 text-orange-700",
                        )}
                      >
                        {documentStatuses.find((s) => s.value === document.status)?.label}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div>{new Date(document.uploadedAt).toLocaleDateString()}</div>
                      <div className="text-sm text-muted-foreground">{document.uploadedBy}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      {/* 상태별 액션 버튼 */}
                      <div className="flex space-x-2">
                        {document.status === "draft" &&
                          (currentUserRole === "author" || currentUserRole === "admin") && (
                            <Button
                              size="sm"
                              onClick={() => handleStatusChange(document.id, "review_requested", "검토를 요청합니다.")}
                            >
                              <Send className="h-4 w-4 mr-1" />
                              검토요청
                            </Button>
                          )}
                        {(document.status === "review_requested" || document.status === "review") &&
                          (currentUserRole === "reviewer" || currentUserRole === "admin") && (
                            <>
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => handleStatusChange(document.id, "approved", "승인되었습니다.")}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                승인
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => {
                                  const reason = prompt("반려 사유를 입력하세요:")
                                  if (reason) {
                                    handleStatusChange(document.id, "rejected", reason)
                                  }
                                }}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                반려
                              </Button>
                            </>
                          )}
                        {document.status === "rejected" &&
                          (currentUserRole === "author" || currentUserRole === "admin") && (
                            <Button
                              size="sm"
                              onClick={() =>
                                handleStatusChange(document.id, "review_requested", "수정 후 재검토를 요청합니다.")
                              }
                            >
                              <Send className="h-4 w-4 mr-1" />
                              재검토요청
                            </Button>
                          )}
                      </div>

                      {/* 기존 작업 버튼들 */}
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleView(document)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDownload(document)}>
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(document.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 문서 상세 보기 다이얼로그 */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>문서 상세 정보</DialogTitle>
          </DialogHeader>
          {selectedDocument && (
            <div className="space-y-6">
              {/* 승인 워크플로우 */}
              <DocumentApprovalWorkflow
                document={selectedDocument}
                approvals={approvals}
                onStatusChange={handleStatusChange}
                currentUserRole={currentUserRole}
                currentUserId={currentUserId}
              />

              {/* 기존 문서 상세 정보... */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>문서 제목</Label>
                    <p className="font-medium">{selectedDocument.title}</p>
                  </div>
                  <div>
                    <Label>파일명</Label>
                    <p className="text-sm">{selectedDocument.originalName}</p>
                  </div>
                  <div>
                    <Label>설비</Label>
                    <p>
                      {selectedDocument.equipmentCode} - {selectedDocument.equipmentName}
                    </p>
                  </div>
                  <div>
                    <Label>카테고리</Label>
                    <Badge variant="outline">
                      {documentCategories.find((cat) => cat.value === selectedDocument.category)?.label}
                    </Badge>
                  </div>
                  <div>
                    <Label>상태</Label>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(selectedDocument.status)}
                      <Badge variant="outline">
                        {documentStatuses.find((s) => s.value === selectedDocument.status)?.label}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label>버전</Label>
                    <p>{selectedDocument.version}</p>
                  </div>
                  <div>
                    <Label>파일 크기</Label>
                    <p>{formatFileSize(selectedDocument.fileSize)}</p>
                  </div>
                  <div>
                    <Label>업로드일</Label>
                    <p>{new Date(selectedDocument.uploadedAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <Label>업로드자</Label>
                    <p>{selectedDocument.uploadedBy}</p>
                  </div>
                  {selectedDocument.approvedBy && (
                    <div>
                      <Label>승인자</Label>
                      <p>{selectedDocument.approvedBy}</p>
                    </div>
                  )}
                  {selectedDocument.expiryDate && (
                    <div>
                      <Label>만료일</Label>
                      <p>{new Date(selectedDocument.expiryDate).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
                {selectedDocument.description && (
                  <div>
                    <Label>설명</Label>
                    <p className="text-sm">{selectedDocument.description}</p>
                  </div>
                )}
                {selectedDocument.tags.length > 0 && (
                  <div>
                    <Label>태그</Label>
                    <div className="flex gap-1 flex-wrap">
                      {selectedDocument.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              닫기
            </Button>
            {selectedDocument && (
              <Button onClick={() => handleDownload(selectedDocument)}>
                <Download className="h-4 w-4 mr-2" />
                다운로드
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
