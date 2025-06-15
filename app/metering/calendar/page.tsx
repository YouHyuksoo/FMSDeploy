"use client"

import { useState, useEffect } from "react"
import { CalibrationCalendar } from "@/components/metering/calibration-calendar"
import { mockCalibrationRecords } from "@/lib/mock-data/metering"
import type { CalibrationRecord } from "@/types/metering"

export default function CalibrationCalendarPage() {
  const [calibrations, setCalibrations] = useState<CalibrationRecord[]>([])

  // 계측기검교정 관리와 동일한 데이터 로드
  useEffect(() => {
    // 실제 환경에서는 API에서 데이터를 가져오겠지만,
    // 현재는 계측기검교정 관리와 동일한 목업 데이터 사용
    setCalibrations(mockCalibrationRecords)
  }, [])

  const handleCalibrationUpdate = (updatedCalibrations: CalibrationRecord[]) => {
    setCalibrations(updatedCalibrations)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">교정 일정 캘린더</h1>
        <p className="text-muted-foreground">
          계측기 교정 일정을 캘린더 형태로 확인하고 관리하세요.
          <span className="text-blue-600 font-medium"> 총 {calibrations.length}개의 교정 기록</span>이 등록되어
          있습니다.
        </p>
      </div>

      <CalibrationCalendar calibrations={calibrations} onCalibrationUpdate={handleCalibrationUpdate} />
    </div>
  )
}
