"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CheckCircle, XCircle, Send, Clock, User, MessageSquare, AlertCircle, Archive, FileCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import type { EquipmentDocument, DocumentApproval, DocumentWorkflow } from "@/types/equipment-document"
import { useToast } from "@/hooks/use-toast"

interface DocumentApprovalWorkflowProps {
  document: EquipmentDocument
  approvals: DocumentApproval[]
  onStatusChange: (documentId: string, newStatus: string, comment?: string) => void
  currentUserRole: "author" | "reviewer" | "admin"
  currentUserId: string
}

export default function DocumentApprovalWorkflow({
  document,
  approvals,
  onStatusChange,
  currentUserRole,
  currentUserId,
}: DocumentApprovalWorkflowProps) {
  const { toast } = useToast()
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false)
  const [actionType, setActionType] = useState<"approve" | "reject" | "request_review" | null>(null)
  const [comment, setComment] = useState("")

  // 워크플로우 상태 계산
  const getWorkflowState = (): DocumentWorkflow => {
    const isAuthor = currentUserRole === "author"
    const isReviewer = currentUserRole === "reviewer" || currentUserRole === "admin"
    const isAdmin = currentUserRole === "admin"

    switch (document.status) {
      case "draft":
        return {
          currentStatus: "draft",
          canRequestReview: isAuthor || isAdmin,
          canApprove: false,
          canReject: false,
          canEdit: isAuthor || isAdmin,
          nextActions: isAuthor || isAdmin ? ["검토 요청"] : [],
        }
      case "review_requested":
        return {
          currentStatus: "review_requested",
          canRequestReview: false,
          canApprove: isReviewer,
          canReject: isReviewer,
          canEdit: false,
          nextActions: isReviewer ? ["승인", "반려"] : [],
        }
      case "review":
        return {
          currentStatus: "review",
          canRequestReview: false,
          canApprove: isReviewer,
          canReject: isReviewer,
          canEdit: false,
          nextActions: isReviewer ? ["승인", "반려"] : [],
        }
      case "approved":
        return {
          currentStatus: "approved",
          canRequestReview: false,
          canApprove: false,
          canReject: false,
          canEdit: false,
          nextActions: [],
        }
      case "rejected":
        return {
          currentStatus: "rejected",
          canRequestReview: isAuthor || isAdmin,
          canApprove: false,
          canReject: false,
          canEdit: isAuthor || isAdmin,
          nextActions: isAuthor || isAdmin ? ["수정 후 재검토 요청"] : [],
        }
      default:
        return {
          currentStatus: document.status,
          canRequestReview: false,
          canApprove: false,
          canReject: false,
          canEdit: false,
          nextActions: [],
        }
    }
  }

  const workflow = getWorkflowState()

  // 상태 아이콘 반환
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "draft":
        return <FileCheck className="h-4 w-4 text-gray-500" />
      case "review_requested":
        return <Send className="h-4 w-4 text-blue-500" />
      case "review":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "expired":
        return <AlertCircle className="h-4 w-4 text-orange-500" />
      case "archived":
        return <Archive className="h-4 w-4 text-purple-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  // 액션 아이콘 반환
  const getActionIcon = (action: string) => {
    switch (action) {
      case "approve":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "reject":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "request_review":
        return <Send className="h-4 w-4 text-blue-500" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  // 액션 실행
  const handleAction = (type: "approve" | "reject" | "request_review") => {
    setActionType(type)
    setComment("")
    setIsActionDialogOpen(true)
  }

  // 액션 확인
  const confirmAction = () => {
    if (!actionType) return

    let newStatus = document.status
    switch (actionType) {
      case "request_review":
        newStatus = "review_requested"
        break
      case "approve":
        newStatus = "approved"
        break
      case "reject":
        newStatus = "rejected"
        break
    }

    onStatusChange(document.id, newStatus, comment)
    setIsActionDialogOpen(false)
    setActionType(null)
    setComment("")

    const actionLabels = {
      request_review: "검토 요청",
      approve: "승인",
      reject: "반려",
    }

    toast({
      title: "성공",
      description: `문서가 ${actionLabels[actionType]}되었습니다.`,
    })
  }

  // 문서별 승인 이력 필터링
  const documentApprovals = approvals.filter((approval) => approval.documentId === document.id)

  return (
    <div className="space-y-4">
      {/* 현재 상태 및 액션 버튼 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon(document.status)}
              <span>문서 상태</span>
            </div>
            <Badge
              variant="outline"
              className={cn(
                document.status === "approved" && "border-green-500 text-green-700",
                document.status === "rejected" && "border-red-500 text-red-700",
                document.status === "review_requested" && "border-blue-500 text-blue-700",
                document.status === "review" && "border-yellow-500 text-yellow-700",
                document.status === "draft" && "border-gray-500 text-gray-700",
              )}
            >
              {document.status === "draft" && "초안"}
              {document.status === "review_requested" && "검토요청"}
              {document.status === "review" && "검토중"}
              {document.status === "approved" && "승인됨"}
              {document.status === "rejected" && "반려됨"}
              {document.status === "expired" && "만료됨"}
              {document.status === "archived" && "보관됨"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            {workflow.canRequestReview && (
              <Button onClick={() => handleAction("request_review")} size="sm">
                <Send className="h-4 w-4 mr-2" />
                검토 요청
              </Button>
            )}
            {workflow.canApprove && (
              <Button onClick={() => handleAction("approve")} size="sm" variant="default">
                <CheckCircle className="h-4 w-4 mr-2" />
                승인
              </Button>
            )}
            {workflow.canReject && (
              <Button onClick={() => handleAction("reject")} size="sm" variant="destructive">
                <XCircle className="h-4 w-4 mr-2" />
                반려
              </Button>
            )}
            {workflow.nextActions.length === 0 && (
              <p className="text-sm text-muted-foreground">사용 가능한 액션이 없습니다.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 승인 이력 */}
      {documentApprovals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              승인 이력
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {documentApprovals
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((approval) => (
                  <div key={approval.id} className="flex gap-3 p-3 border rounded-lg">
                    <div className="flex-shrink-0">{getActionIcon(approval.action)}</div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{approval.reviewerName}</span>
                        <Badge variant="outline" className="text-xs">
                          {approval.action === "approve" && "승인"}
                          {approval.action === "reject" && "반려"}
                          {approval.action === "request_review" && "검토요청"}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(approval.createdAt).toLocaleString()}
                      </div>
                      {approval.comment && <div className="text-sm bg-muted p-2 rounded">{approval.comment}</div>}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 액션 확인 다이얼로그 */}
      <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve" && "문서 승인"}
              {actionType === "reject" && "문서 반려"}
              {actionType === "request_review" && "검토 요청"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "approve" && "이 문서를 승인하시겠습니까?"}
              {actionType === "reject" && "이 문서를 반려하시겠습니까?"}
              {actionType === "request_review" && "이 문서의 검토를 요청하시겠습니까?"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="comment">
                {actionType === "reject" ? "반려 사유" : "의견"}
                {actionType === "reject" && <span className="text-red-500">*</span>}
              </Label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={
                  actionType === "approve"
                    ? "승인 의견을 입력하세요 (선택사항)"
                    : actionType === "reject"
                      ? "반려 사유를 입력하세요"
                      : "검토 요청 사유를 입력하세요 (선택사항)"
                }
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsActionDialogOpen(false)}>
              취소
            </Button>
            <Button
              onClick={confirmAction}
              disabled={actionType === "reject" && !comment.trim()}
              variant={actionType === "reject" ? "destructive" : "default"}
            >
              {actionType === "approve" && "승인"}
              {actionType === "reject" && "반려"}
              {actionType === "request_review" && "요청"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
