"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { CalibrationRecord } from "@/types/metering"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { CheckCircle, XCircle, AlertTriangle, Clock, Edit, Trash2, Calendar } from "lucide-react"

interface CalibrationScheduleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  calibration: CalibrationRecord | null
}

export function CalibrationScheduleDialog({ open, onOpenChange, calibration }: CalibrationScheduleDialogProps) {
  if (!calibration) return null

  const getResultIcon = (result: string) => {
    switch (result) {
      case "pass":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "fail":
        return <XCircle className="h-5 w-5 text-red-600" />
      case "conditional":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      default:
        return <Clock className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">완료</Badge>
      case "scheduled":
        return <Badge className="bg-blue-500">예정</Badge>
      case "overdue":
        return <Badge variant="destructive">만료</Badge>
      case "canceled":
        return <Badge variant="secondary">취소</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getResultBadge = (result: string) => {
    switch (result) {
      case "pass":
        return <Badge className="bg-green-500">합격</Badge>
      case "fail":
        return <Badge variant="destructive">불합격</Badge>
      case "conditional":
        return <Badge className="bg-yellow-500">조건부합격</Badge>
      default:
        return <Badge variant="outline">{result}</Badge>
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              {getResultIcon(calibration.result)}
              {calibration.equipmentName} 교정 정보
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                수정
              </Button>
              <Button variant="outline" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                삭제
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* 기본 정보 */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                기본 정보
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">설비명</label>
                    <p className="text-sm font-medium">{calibration.equipmentName}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">계측기 유형</label>
                    <p className="text-sm">{calibration.instrumentType}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">시리얼 번호</label>
                    <p className="text-sm font-mono">{calibration.serialNumber}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">상태</label>
                    <div className="mt-1">{getStatusBadge(calibration.status)}</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">교정 결과</label>
                    <div className="mt-1">{getResultBadge(calibration.result)}</div>
                  </div>

                  {calibration.accuracy && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">정확도</label>
                      <p className="text-sm">{calibration.accuracy}%</p>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">교정 기관</label>
                    <p className="text-sm">{calibration.calibratedBy}</p>
                  </div>

                  {calibration.certificateNumber && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">인증서 번호</label>
                      <p className="text-sm font-mono">{calibration.certificateNumber}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 일정 정보 */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                일정 정보
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">교정 완료일</label>
                  <p className="text-sm font-medium">
                    {format(new Date(calibration.calibrationDate), "yyyy년 M월 d일 (E)", { locale: ko })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(calibration.calibrationDate), "yyyy-MM-dd")}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">다음 교정 예정일</label>
                  <p className="text-sm font-medium">
                    {format(new Date(calibration.nextCalibrationDate), "yyyy년 M월 d일 (E)", { locale: ko })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(calibration.nextCalibrationDate), "yyyy-MM-dd")}
                  </p>
                </div>
              </div>

              {/* 남은 일수 계산 */}
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">다음 교정까지</span>
                  <span className="text-sm font-bold">
                    {Math.ceil(
                      (new Date(calibration.nextCalibrationDate).getTime() - new Date().getTime()) /
                        (1000 * 60 * 60 * 24),
                    )}
                    일 남음
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 추가 정보 */}
          {calibration.notes && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">비고</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{calibration.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* 이력 정보 */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">이력 정보</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">등록일</label>
                  <p className="text-sm">{format(new Date(calibration.createdAt), "yyyy-MM-dd HH:mm")}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">최종 수정일</label>
                  <p className="text-sm">{format(new Date(calibration.updatedAt), "yyyy-MM-dd HH:mm")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 액션 버튼 */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            닫기
          </Button>
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            수정하기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
