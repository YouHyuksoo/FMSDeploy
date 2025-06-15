"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, AlertCircle, CheckCircle, Clock, Wifi, WifiOff, Battery, BatteryCharging } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

// 목업 데이터: 센서 목록
const mockSensors = [
  {
    id: 'SNS-001',
    name: '1공장 온도 센서',
    type: 'temperature',
    location: '1공장 A라인',
    status: 'normal',
    value: 24.5,
    unit: '°C',
    lastUpdate: '2분 전',
    battery: 85,
    signal: 'excellent',
  },
  {
    id: 'SNS-002',
    name: '1공장 진동 센서',
    type: 'vibration',
    location: '1공장 B라인',
    status: 'warning',
    value: 5.2,
    unit: 'mm/s²',
    lastUpdate: '5분 전',
    battery: 42,
    signal: 'good',
  },
  {
    id: 'SNS-003',
    name: '1공장 전력 계측기',
    type: 'power',
    location: '1공장 전기실',
    status: 'error',
    value: 0,
    unit: 'kW',
    lastUpdate: '1시간 전',
    battery: 15,
    signal: 'poor',
  },
  {
    id: 'SNS-004',
    name: '사무실 온습도 센서',
    type: 'humidity',
    location: '본관 2층 사무실',
    status: 'normal',
    value: 45,
    unit: '%',
    lastUpdate: '1분 전',
    battery: 92,
    signal: 'excellent',
  },
  {
    id: 'SNS-005',
    name: '창고 온도 센서',
    type: 'temperature',
    location: '2공장 창고',
    status: 'normal',
    value: 18.2,
    unit: '°C',
    lastUpdate: '3분 전',
    battery: 67,
    signal: 'good',
  },
];

// 상태별 카운트 계산
const stats = {
  totalSensors: mockSensors.length,
  normalSensors: mockSensors.filter(s => s.status === 'normal').length,
  warningSensors: mockSensors.filter(s => s.status === 'warning').length,
  errorSensors: mockSensors.filter(s => s.status === 'error').length,
};

// 상태별 배지 스타일
const getStatusBadge = (status: string) => {
  switch (status) {
    case 'normal':
      return <Badge variant="outline" className="border-green-500 text-green-500">정상</Badge>;
    case 'warning':
      return <Badge variant="outline" className="border-yellow-500 text-yellow-500">경고</Badge>;
    case 'error':
      return <Badge variant="outline" className="border-red-500 text-red-500">오류</Badge>;
    default:
      return <Badge variant="outline">알 수 없음</Badge>;
  }
};

// 신호 강도 아이콘
const SignalIcon = ({ strength }: { strength: string }) => {
  switch (strength) {
    case 'excellent':
      return <Wifi className="h-4 w-4 text-green-500" />;
    case 'good':
      return <Wifi className="h-4 w-4 text-yellow-500" />;
    case 'poor':
      return <Wifi className="h-4 w-4 text-red-500" />;
    default:
      return <WifiOff className="h-4 w-4 text-gray-400" />;
  }
};

export default function SensorDashboardPage() {
  const [selectedSensorId, setSelectedSensorId] = React.useState<string | null>(mockSensors[0]?.id || null);
  
  // 선택된 센서 정보 가져오기
  const selectedSensor = React.useMemo(() => {
    return mockSensors.find(sensor => sensor.id === selectedSensorId) || mockSensors[0] || null;
  }, [selectedSensorId]);

  // 행 클릭 핸들러
  const handleRowClick = (sensorId: string) => {
    setSelectedSensorId(sensorId);
  };
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">센서 현황</h2>
          <p className="text-muted-foreground">등록된 센서의 실시간 상태를 확인하세요.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            센서 추가
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">전체 센서</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">📊</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSensors}</div>
            <p className="text-xs text-muted-foreground">총 등록된 센서 수</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">정상 작동</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.normalSensors}</div>
            <p className="text-xs text-muted-foreground">정상 작동 중인 센서</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">경고</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.warningSensors}</div>
            <p className="text-xs text-muted-foreground">주의가 필요한 센서</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">오류</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.errorSensors}</div>
            <p className="text-xs text-muted-foreground">이상이 감지된 센서</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>센서 목록</CardTitle>
            <CardDescription>등록된 센서 목록을 확인하세요.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>센서 ID</TableHead>
                  <TableHead>이름</TableHead>
                  <TableHead>위치</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead className="text-right">값</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockSensors.map((sensor) => {
                  const isSelected = selectedSensorId === sensor.id;
                  return (
                    <TableRow 
                      key={sensor.id} 
                      className={`cursor-pointer hover:bg-muted/50 ${isSelected ? 'bg-muted/30' : ''}`}
                      onClick={() => handleRowClick(sensor.id)}
                    >
                      <TableCell className="font-medium">{sensor.id}</TableCell>
                      <TableCell>{sensor.name}</TableCell>
                      <TableCell>{sensor.location}</TableCell>
                      <TableCell>{getStatusBadge(sensor.status)}</TableCell>
                      <TableCell className="text-right">
                        {sensor.status === 'error' ? 'N/A' : `${sensor.value} ${sensor.unit}`}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>센서 상태</CardTitle>
            <CardDescription>선택한 센서의 상세 정보를 확인하세요.</CardDescription>
          </CardHeader>
          <CardContent>
            {selectedSensor && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">{selectedSensor.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedSensor.id}</p>
                  </div>
                  {getStatusBadge(selectedSensor.status)}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">센서 유형</span>
                    <span className="font-medium">
                      {selectedSensor.type === 'temperature' ? '온도' : 
                       selectedSensor.type === 'humidity' ? '습도' : 
                       selectedSensor.type === 'vibration' ? '진동' : '전력'} 센서
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">현재 값</span>
                    <span className="font-mono font-medium">
                      {selectedSensor.value} {selectedSensor.unit}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">위치</span>
                    <span>{selectedSensor.location}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">마지막 업데이트</span>
                    <div className="flex items-center">
                      <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                      <span>{selectedSensor.lastUpdate}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center text-muted-foreground">
                      <Battery className="mr-1 h-3 w-3" />
                      배터리
                    </span>
                    <div className="flex items-center">
                      <span className="mr-2">{selectedSensor.battery}%</span>
                      <div className="h-2 w-24 rounded-full bg-muted">
                        <div 
                          className={`h-full rounded-full ${
                            selectedSensor.battery > 70 ? 'bg-green-500' : 
                            selectedSensor.battery > 30 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${selectedSensor.battery}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center text-muted-foreground">
                      <Wifi className="mr-1 h-3 w-3" />
                      신호 강도
                    </span>
                    <div className="flex items-center">
                      <SignalIcon strength={selectedSensor.signal} />
                      <span className="ml-1 capitalize">
                        {selectedSensor.signal === 'excellent' ? '매우 좋음' :
                         selectedSensor.signal === 'good' ? '양호' : '약함'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Button variant="outline" className="w-full">
                    상세 정보 보기
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
