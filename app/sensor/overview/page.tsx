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
import dynamic from "next/dynamic";
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
  Pencil,
  Trash2,
} from "lucide-react";
import { type Sensor } from "@/types/sensor";
import { mockSensors } from "@/lib/mock-data/sensor";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

const DataTable = dynamic(
  () => import("@/components/common/data-table").then((mod) => mod.DataTable),
  {
    ssr: false,
  }
);

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
    title: "센서 ID",
    sortable: true,
  },
  {
    key: "name",
    title: "센서명",
    sortable: true,
  },
  {
    key: "type",
    title: "센서 유형",
    render: (value: string) => {
      const typeMap: Record<string, string> = {
        temperature: "온도",
        humidity: "습도",
        vibration: "진동",
        power: "전력",
      };
      return typeMap[value] || value;
    },
    sortable: true,
  },
  {
    key: "group",
    title: "그룹",
    sortable: true,
  },
  {
    key: "location",
    title: "위치",
    sortable: true,
  },
  {
    key: "status",
    title: "상태",
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
    sortable: true,
  },
  {
    key: "lastValue",
    title: "최근 측정값",
    render: (value: number, record: Record<string, any>) =>
      `${value} ${record.unit}`,
    sortable: true,
  },
  {
    key: "lastUpdate",
    title: "최근 업데이트",
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
    sortable: true,
  },
];

const actions = [
  {
    key: "edit",
    icon: Pencil,
    label: "수정",
    onClick: (record: Record<string, any>) => {
      console.log("수정", record);
    },
  },
  {
    key: "delete",
    icon: Trash2,
    label: "삭제",
    onClick: (record: Record<string, any>) => {
      console.log("삭제", record);
    },
  },
];

export default function SensorOverviewPage() {
  const { toast } = useToast();
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [searchName, setSearchName] = useState("");
  const [searchGroup, setSearchGroup] = useState("");

  const handleSearch = () => {
    const filtered = mockSensors.filter((sensor) => {
      const nameMatch = searchName ? sensor.name.includes(searchName) : true;
      const groupMatch = searchGroup
        ? sensor.group.includes(searchGroup)
        : true;
      return nameMatch && groupMatch;
    });
    setSensors(filtered);
  };

  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <CardTitle>센서 현황</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Input
              placeholder="센서명"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="w-48"
            />
            <Input
              placeholder="그룹"
              value={searchGroup}
              onChange={(e) => setSearchGroup(e.target.value)}
              className="w-48"
            />
            <Button onClick={handleSearch}>조회</Button>
          </div>
          <DataTable
            data={sensors}
            columns={columns}
            actions={actions}
            showSearch
            showFilter
            showExport
            showImport
            showColumnSettings={true}
          />
        </CardContent>
      </Card>
    </div>
  );
}
