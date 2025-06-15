"use client"

import type React from "react"

import type { PlacedEquipment } from "@/types/location-monitoring"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Settings, AlertTriangle, CheckCircle, PowerOff, Wrench, Info } from "lucide-react"

interface EquipmentMapIconProps {
  equipment: PlacedEquipment
  onDragStart: (e: React.DragEvent<HTMLDivElement>, equipment: PlacedEquipment) => void
  onClick?: (equipment: PlacedEquipment) => void // 팝업용 클릭 핸들러 (향후 구현)
}

const getStatusStyles = (status: PlacedEquipment["status"]) => {
  switch (status) {
    case "running":
      return {
        icon: <CheckCircle className="h-5 w-5 text-white" />,
        bgColor: "bg-green-500 hover:bg-green-600",
        label: "가동중",
      }
    case "stopped":
      return {
        icon: <PowerOff className="h-5 w-5 text-white" />,
        bgColor: "bg-gray-500 hover:bg-gray-600",
        label: "정지",
      }
    case "maintenance":
      return {
        icon: <Wrench className="h-5 w-5 text-white" />,
        bgColor: "bg-blue-500 hover:bg-blue-600",
        label: "보전중",
      }
    case "failure":
      return {
        icon: <AlertTriangle className="h-5 w-5 text-white" />,
        bgColor: "bg-red-500 hover:bg-red-600",
        label: "고장",
      }
    default:
      return {
        icon: <Settings className="h-5 w-5 text-white" />,
        bgColor: "bg-gray-400 hover:bg-gray-500",
        label: "알수없음",
      }
  }
}

export function EquipmentMapIcon({ equipment, onDragStart, onClick }: EquipmentMapIconProps) {
  const statusInfo = getStatusStyles(equipment.status)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div
          draggable
          onDragStart={(e) => onDragStart(e, equipment)}
          style={{
            left: `${equipment.x}px`,
            top: `${equipment.y}px`,
            transform: "translate(-50%, -50%)", // 아이콘 중심을 x, y에 맞춤
          }}
          className={`absolute p-2 rounded-full shadow-lg cursor-grab active:cursor-grabbing transition-all ${statusInfo.bgColor} flex items-center justify-center text-white`}
          onClick={() => onClick?.(equipment)}
          title={equipment.name}
        >
          {statusInfo.icon}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="space-y-2">
          <h4 className="font-medium leading-none">{equipment.name}</h4>
          <p className="text-sm text-muted-foreground">{equipment.type}</p>
          <div className="flex items-center pt-2">
            <span className="text-xs text-muted-foreground">상태:</span>
            <Badge variant={equipment.status === "failure" ? "destructive" : "secondary"} className="ml-auto">
              {statusInfo.label}
            </Badge>
          </div>
          {/* 향후 센서 데이터 및 예측값 표시 영역 */}
          <div className="text-xs text-muted-foreground border-t pt-2 mt-2">
            <Info className="inline h-3 w-3 mr-1" />
            센서 데이터 및 예측값은 여기에 표시됩니다.
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
