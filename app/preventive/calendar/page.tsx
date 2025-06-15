"use client"

import { useState, useEffect } from "react"
import { PreventiveMaintenanceCalendar } from "@/components/preventive/preventive-maintenance-calendar"
import { mockPreventiveScheduleRecords } from "@/lib/mock-data/preventive-schedule"
import type { PreventiveScheduleRecord } from "@/types/preventive"
import { Skeleton } from "@/components/ui/skeleton"

export default function PreventiveMaintenanceCalendarPage() {
  const [schedules, setSchedules] = useState<PreventiveScheduleRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setSchedules(mockPreventiveScheduleRecords)
      setLoading(false)
    }, 500) // Simulate network delay
  }, [])

  // const handleScheduleUpdate = (updatedSchedules: PreventiveScheduleRecord[]) => {
  //   setSchedules(updatedSchedules);
  //   // Here you would typically also call an API to save changes
  // };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-4 w-2/3 mt-2" />
        </div>
        <Skeleton className="h-[500px] w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">예방 정비 일정 캘린더</h1>
        <p className="text-muted-foreground">
          예방 정비 일정을 캘린더 형태로 확인하고 관리하세요.
          <span className="text-blue-600 font-medium"> 총 {schedules.length}개의 예방 정비 일정</span>이 등록되어
          있습니다.
        </p>
      </div>

      <PreventiveMaintenanceCalendar schedules={schedules} />
    </div>
  )
}
