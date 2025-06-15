"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Thermometer, Droplets, Gauge, Zap, RadioTower, Wifi, HardDrive } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// 센서 유형에 따른 아이콘 컴포넌트
const SensorTypeIcon = ({ type }: { type: string }) => {
  const iconProps = { className: "h-5 w-5" };
  
  switch (type.toLowerCase()) {
    case 'temperature':
      return <Thermometer {...iconProps} className="text-red-500" />;
    case 'humidity':
      return <Droplets {...iconProps} className="text-blue-500" />;
    case 'pressure':
      return <Gauge {...iconProps} className="text-purple-500" />;
    case 'current':
    case 'voltage':
    case 'power':
      return <Zap {...iconProps} className="text-yellow-500" />;
    case 'vibration':
      return <RadioTower {...iconProps} className="text-green-500" />;
    case 'wifi':
      return <Wifi {...iconProps} className="text-indigo-500" />;
    default:
      return <HardDrive {...iconProps} className="text-gray-500" />;
  }
};

// 센서 유형에 따른 배지 색상
const getBadgeVariant = (type: string) => {
  const variants: Record<string, string> = {
    temperature: 'destructive',
    humidity: 'default',
    pressure: 'secondary',
    current: 'outline',
    voltage: 'outline',
    power: 'outline',
    vibration: 'default',
    wifi: 'secondary',
  };
  
  return variants[type.toLowerCase()] || 'outline';
};

export default function SensorTypesPage() {
  // 예시 데이터
  const sensorTypes = [
    { id: 1, name: 'Temperature', type: 'temperature', unit: '°C', description: '온도 측정 센서', count: 15 },
    { id: 2, name: 'Humidity', type: 'humidity', unit: '%', description: '습도 측정 센서', count: 12 },
    { id: 3, name: 'Pressure', type: 'pressure', unit: 'kPa', description: '압력 측정 센서', count: 8 },
    { id: 4, name: 'Vibration', type: 'vibration', unit: 'mm/s²', description: '진동 측정 센서', count: 10 },
    { id: 5, name: 'Current', type: 'current', unit: 'A', description: '전류 측정 센서', count: 5 },
    { id: 6, name: 'Voltage', type: 'voltage', unit: 'V', description: '전압 측정 센서', count: 5 },
    { id: 7, name: 'Power', type: 'power', unit: 'kW', description: '전력 측정 센서', count: 5 },
  ];

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">센서 유형 관리</h2>
          <p className="text-muted-foreground">시스템에서 사용되는 센서 유형을 관리하세요.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          유형 추가
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">전체 유형</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">📋</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sensorTypes.length}</div>
            <p className="text-xs text-muted-foreground">등록된 센서 유형 수</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">전체 센서</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">📊</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sensorTypes.reduce((sum, type) => sum + type.count, 0)}
            </div>
            <p className="text-xs text-muted-foreground">총 등록된 센서 수</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">가장 많은 유형</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">🏆</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sensorTypes.reduce((max, type) => (type.count > max.count ? type : max), sensorTypes[0]).name}
            </div>
            <p className="text-xs text-muted-foreground">
              {sensorTypes.reduce((max, type) => (type.count > max.count ? type : max), sensorTypes[0]).count}개 센서
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>센서 유형 목록</CardTitle>
              <CardDescription>시스템에서 사용 가능한 모든 센서 유형 목록입니다.</CardDescription>
            </div>
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input type="text" placeholder="유형 검색..." />
              <Button type="submit" size="icon" variant="outline">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>유형</TableHead>
                <TableHead>이름</TableHead>
                <TableHead>설명</TableHead>
                <TableHead className="text-right">센서 수</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sensorTypes.map((sensorType) => (
                <TableRow key={sensorType.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <SensorTypeIcon type={sensorType.type} />
                      <Badge variant={getBadgeVariant(sensorType.type) as any}>
                        {sensorType.type}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{sensorType.name}</TableCell>
                  <TableCell>{sensorType.description}</TableCell>
                  <TableCell className="text-right">{sensorType.count}개</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
