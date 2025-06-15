"use client"

import { FloorPlanEditor } from "@/components/location/floor-plan-editor"
import {
  sampleFloorPlan,
  initialPlacedEquipment,
  availableEquipmentForPalette,
} from "@/lib/mock-data/location-monitoring"
import { MainLayout } from "@/components/layout/main-layout" // MainLayout 추가

export default function LocationLayoutPage() {
  return (
    // MainLayout으로 감싸서 전체 레이아웃 일관성 유지
    <MainLayout>
      <FloorPlanEditor
        floorPlan={sampleFloorPlan}
        initialPlacedEquipment={initialPlacedEquipment}
        availablePaletteEquipment={availableEquipmentForPalette}
      />
    </MainLayout>
  )
}
