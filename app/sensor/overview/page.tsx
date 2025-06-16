"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/common/data-table";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Search,
  Thermometer,
  Droplets,
  Gauge,
  Zap,
  RadioTower,
  Wifi,
  HardDrive,
} from "lucide-react";
import { type Sensor } from "@/types/sensor";
import { mockSensors } from "@/lib/mock-data/sensor";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

// 센서 유형에 따른 아이콘 컴포넌트
const SensorTypeIcon = ({ type }: { type: string }) => {
  const iconProps = { className: "h-5 w-5" };

  switch (type.toLowerCase()) {
    case "temperature":
      return <Thermometer {...iconProps} className="text-red-500" />;
    case "humidity":
      return <Droplets {...iconProps} className="text-blue-500" />;
    case "pressure":
      return <Gauge {...iconProps} className="text-purple-500" />;
    case "current":
    case "voltage":
    case "power":
      return <Zap {...iconProps} className="text-yellow-500" />;
    case "vibration":
      return <RadioTower {...iconProps} className="text-green-500" />;
    case "wifi":
      return <Wifi {...iconProps} className="text-indigo-500" />;
    default:
      return <HardDrive {...iconProps} className="text-gray-500" />;
  }
};

// 센서 상태에 따른 배지 색상
const getStatusBadge = (status: string) => {
  const statusConfig = {
    active: { label: "정상", variant: "default" as const },
    warning: { label: "경고", variant: "destructive" as const },
    error: { label: "오류", variant: "destructive" as const },
    inactive: { label: "비활성", variant: "secondary" as const },
  };
  const config =
    statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive;
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

const columns = [
  {
    key: "id",
    label: "센서 ID",
  },
  {
    key: "name",
    label: "센서명",
  },
  {
    key: "type",
    label: "센서 유형",
    render: (value: string) => {
      const typeMap: Record<string, string> = {
        temperature: "온도",
        humidity: "습도",
        vibration: "진동",
        power: "전력",
      };
      return typeMap[value] || value;
    },
  },
  {
    key: "group",
    label: "그룹",
  },
  {
    key: "location",
    label: "위치",
  },
  {
    key: "status",
    label: "상태",
    render: (value: string) => {
      const statusMap: Record<
        string,
        {
          label: string;
          variant: "default" | "secondary" | "destructive" | "outline";
        }
      > = {
        active: { label: "정상", variant: "default" },
        warning: { label: "경고", variant: "secondary" },
        error: { label: "오류", variant: "destructive" },
        inactive: { label: "비활성", variant: "outline" },
      };
      const status = statusMap[value] || { label: value, variant: "outline" };
      return <Badge variant={status.variant}>{status.label}</Badge>;
    },
  },
  {
    key: "lastValue",
    label: "최근 측정값",
    render: (value: number, row: Sensor) => `${value} ${row.unit}`,
  },
  {
    key: "lastUpdate",
    label: "최근 업데이트",
    render: (value: string) => {
      const date = new Date(value);
      return date.toLocaleString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "UTC",
      });
    },
  },
];

const actions = [
  {
    icon: "Pencil",
    label: "수정",
    onClick: (row: Sensor) => {
      console.log("수정", row);
    },
  },
  {
    icon: "Trash2",
    label: "삭제",
    onClick: (row: Sensor) => {
      console.log("삭제", row);
    },
  },
];

export default function SensorOverviewPage() {
  const { toast } = useToast();
  const [sensors, setSensors] = useState<Sensor[]>(mockSensors);

  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <CardTitle>센서 현황</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={mockSensors}
            columns={columns}
            actions={actions}
            searchable
            sortable
            filterable
            showExport
            showImport
          />
        </CardContent>
      </Card>
    </div>
  );
}
