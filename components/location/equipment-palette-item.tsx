"use client"

import type React from "react"

import type { DraggableEquipment } from "@/types/location-monitoring"
import { Card, CardContent } from "@/components/ui/card"
import { Settings, AlertTriangle, CheckCircle, PowerOff, Wrench } from "lucide-react" // PowerOff 추가

interface EquipmentPaletteItemProps {
  equipment: DraggableEquipment
}

const getStatusStyles = (status: DraggableEquipment["status"]) => {
  switch (status) {
    case "running":
      return { icon: <CheckCircle className="h-4 w-4 text-green-500" />, color: "border-green-500" }
    case "stopped":
      return { icon: <PowerOff className="h-4 w-4 text-gray-500" />, color: "border-gray-500" }
    case "maintenance":
      return { icon: <Wrench className="h-4 w-4 text-blue-500" />, color: "border-blue-500" }
    case "failure":
      return { icon: <AlertTriangle className="h-4 w-4 text-red-500" />, color: "border-red-500" }
    default:
      return { icon: <Settings className="h-4 w-4 text-gray-400" />, color: "border-gray-400" }
  }
}

export function EquipmentPaletteItem({ equipment }: EquipmentPaletteItemProps) {
  const statusInfo = getStatusStyles(equipment.status)

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("application/json", JSON.stringify(equipment))
    e.dataTransfer.effectAllowed = "move"
  }

  return (
    <Card
      draggable
      onDragStart={handleDragStart}
      className={`mb-2 cursor-grab active:cursor-grabbing border-l-4 ${statusInfo.color} hover:shadow-md transition-shadow`}
    >
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{equipment.name}</span>
          {statusInfo.icon}
        </div>
        <p className="text-xs text-muted-foreground">{equipment.type}</p>
      </CardContent>
    </Card>
  )
}
