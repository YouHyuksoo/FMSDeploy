"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Plus, Target, TrendingDown, Calendar, AlertCircle, CheckCircle, XCircle, BarChart2, Settings } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

// 목표 유형 타입 정의
type TargetType = 'total' | 'scope1' | 'scope2' | 'scope3' | 'intensity';

// 목표 상태 타입
type TargetStatus = 'on_track' | 'at_risk' | 'off_track' | 'achieved' | 'not_started';

// 목표 인터페이스
interface CarbonTarget {
  id: string;
  name: string;
  description: string;
  type: TargetType;
  baselineYear: number;
  targetYear: number;
  baselineValue: number;
  targetValue: number;
  currentValue?: number;
  unit: string;
  status: TargetStatus;
  progress: number;
  createdAt: Date;
  updatedAt: Date;
}

// 목표 유형에 따른 라벨과 아이콘
const targetTypeConfig = {
  total: { label: '총 배출량', icon: <BarChart2 className="h-4 w-4" /> },
  scope1: { label: 'Scope 1', icon: <BarChart2 className="h-4 w-4" /> },
  scope2: { label: 'Scope 2', icon: <BarChart2 className="h-4 w-4" /> },
  scope3: { label: 'Scope 3', icon: <BarChart2 className="h-4 w-4" /> },
  intensity: { label: '배출집약도', icon: <TrendingDown className="h-4 w-4" /> },
};

// 상태에 따른 스타일
const statusConfig = {
  on_track: { label: '정상 진행 중', color: 'bg-green-500', icon: <CheckCircle className="h-4 w-4 text-green-500" /> },
  at_risk: { label: '위험', color: 'bg-yellow-500', icon: <AlertCircle className="h-4 w-4 text-yellow-500" /> },
  off_track: { label: '진행 지연', color: 'bg-red-500', icon: <XCircle className="h-4 w-4 text-red-500" /> },
  achieved: { label: '달성 완료', color: 'bg-blue-500', icon: <CheckCircle className="h-4 w-4 text-blue-500" /> },
  not_started: { label: '시작 전', color: 'bg-gray-300', icon: <div className="h-4 w-4 rounded-full border-2 border-gray-400" /> },
};

// 목업 데이터 생성 함수
const generateMockTargets = (): CarbonTarget[] => {
  const currentYear = new Date().getFullYear();
  
  return [
    {
      id: '1',
      name: '2030년 탄소중립 목표',
      description: '2050년까지 탄소중립 달성을 위한 중간 목표',
      type: 'total',
      baselineYear: 2023,
      targetYear: 2030,
      baselineValue: 10000, // tCO2e
      targetValue: 5000,    // 50% 감축
      currentValue: 8500,   // 현재 배출량
      unit: 'tCO₂e',
      status: 'on_track',
      progress: 30,
      createdAt: new Date(2023, 0, 1),
      updatedAt: new Date(),
    },
    {
      id: '2',
      name: '재생에너지 전환 확대',
      description: 'Scope 2 배출량 감축을 위한 재생에너지 사용 확대',
      type: 'scope2',
      baselineYear: 2023,
      targetYear: 2025,
      baselineValue: 5000,  // tCO2e
      targetValue: 3000,    // 40% 감축
      currentValue: 4200,   // 현재 배출량
      unit: 'tCO₂e',
      status: 'at_risk',
      progress: 40,
      createdAt: new Date(2023, 2, 15),
      updatedAt: new Date(),
    },
    {
      id: '3',
      name: '에너지 효율 개선',
      description: '생산 공정 에너지 효율 개선을 통한 배출량 감축',
      type: 'intensity',
      baselineYear: 2023,
      targetYear: 2024,
      baselineValue: 1.2,   // tCO2e/백만원
      targetValue: 1.0,     // 약 17% 개선
      currentValue: 1.15,   // 현재 집약도
      unit: 'tCO₂e/백만원',
      status: 'on_track',
      progress: 25,
      createdAt: new Date(2023, 5, 10),
      updatedAt: new Date(),
    },
    {
      id: '4',
      name: '폐기물 처리 최적화',
      description: '매립 폐기물 감소를 통한 Scope 3 배출량 감축',
      type: 'scope3',
      baselineYear: 2023,
      targetYear: 2025,
      baselineValue: 2000,  // tCO2e
      targetValue: 1000,    // 50% 감축
      currentValue: 1900,   // 현재 배출량
      unit: 'tCO₂e',
      status: 'off_track',
      progress: 10,
      createdAt: new Date(2023, 3, 20),
      updatedAt: new Date(),
    },
    {
      id: '5',
      name: '2023년 목표 달성',
      description: '2023년도 연간 감축 목표',
      type: 'total',
      baselineYear: 2022,
      targetYear: 2023,
      baselineValue: 10500, // tCO2e
      targetValue: 10000,   // 약 5% 감축
      currentValue: 9800,   // 실제 달성량
      unit: 'tCO₂e',
      status: 'achieved',
      progress: 100,
      createdAt: new Date(2023, 0, 1),
      updatedAt: new Date(2023, 11, 31),
    },
  ];
};

// 대시보드 요약 카드 컴포넌트
const SummaryCard = ({ title, value, description, icon, trend, trendValue }: { 
  title: string; 
  value: string; 
  description: string; 
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}) => (
  <Card>
    <CardHeader className="pb-2">
      <div className="flex items-center justify-between">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <div className="flex items-center mt-1">
        {trend && trendValue && (
          <span className={`text-xs font-medium ${
            trend === 'up' ? 'text-red-600' : 
            trend === 'down' ? 'text-green-600' : 'text-gray-500'
          } mr-1`}>
            {trend === 'up' ? '▲' : trend === 'down' ? '▼' : '•'} {trendValue}
          </span>
        )}
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </CardContent>
  </Card>
);

// 목표 진행 상황 표시 컴포넌트
const TargetProgress = ({ target }: { target: CarbonTarget }) => {
  const config = statusConfig[target.status];
  const typeConfig = targetTypeConfig[target.type];
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{target.name}</CardTitle>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              {target.baselineYear} → {target.targetYear}
            </span>
            <div className="flex items-center text-xs px-2 py-1 rounded-full bg-muted">
              {typeConfig.icon}
              <span className="ml-1">{typeConfig.label}</span>
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{target.description}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>진행률</span>
              <span className="font-medium">{target.progress}%</span>
            </div>
            <Progress value={target.progress} className="h-2" />
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground text-xs">기준년도</p>
              <p className="font-medium">{target.baselineYear}</p>
              <p>{target.baselineValue.toLocaleString()} {target.unit}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">목표</p>
              <p className="font-medium">{target.targetYear}</p>
              <p>{target.targetValue.toLocaleString()} {target.unit}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">현재</p>
              <p className="font-medium">{new Date().getFullYear()}</p>
              <p className="flex items-center">
                {target.currentValue?.toLocaleString()} {target.unit}
                <span className={`ml-2 text-xs ${
                  target.status === 'on_track' ? 'text-green-600' : 
                  target.status === 'at_risk' ? 'text-yellow-600' : 
                  target.status === 'off_track' ? 'text-red-600' : 'text-blue-600'
                }`}>
                  {statusConfig[target.status].label}
                </span>
              </p>
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-2 border-t">
            <div className="flex items-center text-sm">
              {config.icon}
              <span className="ml-2">{config.label}</span>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">상세 보기</Button>
              <Button variant="outline" size="sm">조치 계획</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function CarbonTargetsPage() {
  const [targets, setTargets] = useState<CarbonTarget[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // 필터링된 목표 가져오기
  const filteredTargets = targets.filter(target => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return target.status !== 'achieved' && target.status !== 'not_started';
    if (activeTab === 'completed') return target.status === 'achieved';
    if (activeTab === 'at_risk') return target.status === 'at_risk' || target.status === 'off_track';
    return target.type === activeTab;
  });
  
  // 대시보드 요약 통계 계산
  const stats = {
    totalTargets: targets.length,
    activeTargets: targets.filter(t => t.status !== 'achieved' && t.status !== 'not_started').length,
    onTrack: targets.filter(t => t.status === 'on_track').length,
    atRisk: targets.filter(t => t.status === 'at_risk' || t.status === 'off_track').length,
    completed: targets.filter(t => t.status === 'achieved').length,
    totalReduction: targets.reduce((sum, target) => {
      if (target.status === 'achieved' && target.currentValue !== undefined) {
        return sum + (target.baselineValue - target.currentValue);
      }
      return sum;
    }, 0),
  };
  
  // 초기 데이터 로드
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      // 실제로는 API 호출로 대체
      setTimeout(() => {
        setTargets(generateMockTargets());
        setIsLoading(false);
      }, 500);
    };
    
    fetchData();
  }, []);
  
  // 새 목표 추가 핸들러
  const handleAddTarget = (newTarget: Omit<CarbonTarget, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'progress' | 'currentValue'>) => {
    const newId = (targets.length + 1).toString();
    const currentYear = new Date().getFullYear();
    const isFutureTarget = newTarget.targetYear > currentYear;
    
    const target: CarbonTarget = {
      ...newTarget,
      id: newId,
      status: isFutureTarget ? 'not_started' : 'on_track',
      progress: 0,
      currentValue: newTarget.baselineValue,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setTargets([...targets, target]);
    setIsAddDialogOpen(false);
  };
  
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">탄소 배출 감축 목표</h2>
          <p className="text-muted-foreground">
            기업의 탄소 중립을 위한 감축 목표를 설정하고 추적하세요.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" /> 새 목표 추가
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>새 탄소 감축 목표 추가</DialogTitle>
                <DialogDescription>
                  새로운 탄소 배출 감축 목표를 설정하세요. 모든 필드를 입력해주세요.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">목표명</Label>
                  <Input
                    id="name"
                    placeholder="예: 2030년까지 Scope 1&2 50% 감축"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">설명</Label>
                  <textarea
                    id="description"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="목표에 대한 상세 설명을 입력하세요."
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>기준년도</Label>
                    <Input type="number" min="2000" max="2100" required />
                  </div>
                  <div className="space-y-2">
                    <Label>목표년도</Label>
                    <Input type="number" min={new Date().getFullYear() + 1} max="2100" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>기준 배출량</Label>
                    <Input type="number" min="0" step="0.01" required />
                  </div>
                  <div className="space-y-2">
                    <Label>목표 배출량</Label>
                    <Input type="number" min="0" step="0.01" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>목표 유형</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="목표 유형 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="total">총 배출량</SelectItem>
                      <SelectItem value="scope1">Scope 1 (직접 배출)</SelectItem>
                      <SelectItem value="scope2">Scope 2 (간접 배출 - 전력)</SelectItem>
                      <SelectItem value="scope3">Scope 3 (기타 간접 배출)</SelectItem>
                      <SelectItem value="intensity">배출집약도</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">취소</Button>
                </DialogClose>
                <Button type="submit">추가</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* 요약 카드 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard 
          title="전체 목표" 
          value={stats.totalTargets.toString()} 
          description="설정된 전체 목표 수"
          icon={<Target className="h-4 w-4" />}
        />
        <SummaryCard 
          title="진행 중인 목표" 
          value={stats.activeTargets.toString()} 
          description={`${stats.onTrack}개 정상, ${stats.atRisk}개 위험`}
          icon={<TrendingDown className="h-4 w-4" />}
          trend={stats.atRisk > 0 ? 'up' : 'neutral'}
          trendValue={stats.atRisk > 0 ? `${stats.atRisk}개 위험` : '모두 정상'}
        />
        <SummaryCard 
          title="달성한 목표" 
          value={stats.completed.toString()} 
          description="완료된 목표 수"
          icon={<CheckCircle className="h-4 w-4" />}
        />
        <SummaryCard 
          title="누적 감축량" 
          value={`${stats.totalReduction.toLocaleString()}`} 
          description="달성한 목표의 총 감축량"
          icon={<BarChart2 className="h-4 w-4" />}
          trend="down"
          trendValue="감소 중"
        />
      </div>
      
      {/* 필터 및 목표 목록 */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>감축 목표 관리</CardTitle>
              <CardDescription>
                설정된 탄소 배출 감축 목표를 확인하고 관리하세요.
              </CardDescription>
            </div>
            <div className="mt-4 md:mt-0">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="all">전체</TabsTrigger>
                  <TabsTrigger value="active">진행 중</TabsTrigger>
                  <TabsTrigger value="completed">완료</TabsTrigger>
                  <TabsTrigger value="at_risk">위험</TabsTrigger>
                  <TabsTrigger value="settings">
                    <Settings className="h-4 w-4" />
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredTargets.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
              {filteredTargets.map((target) => (
                <TargetProgress key={target.id} target={target} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Target className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">등록된 목표가 없습니다</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {activeTab === 'all' 
                  ? '새로운 감축 목표를 추가해보세요.' 
                  : '해당 조건에 맞는 목표가 없습니다.'}
              </p>
              <Button onClick={() => setActiveTab('all')} variant="outline">
                전체 목록 보기
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* 추가 차트 및 분석 섹션 */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>목표별 진척도</CardTitle>
            <CardDescription>각 목표별 진행 상황을 한눈에 확인하세요.</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <p>목표별 진척도 차트가 여기에 표시됩니다.</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>연간 감축 목표 대비 실적</CardTitle>
            <CardDescription>연도별 목표 대비 실제 감축 실적을 확인하세요.</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <p>연간 감축 실적 차트가 여기에 표시됩니다.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
