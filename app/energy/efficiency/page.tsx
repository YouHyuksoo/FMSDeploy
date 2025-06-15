import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertTriangle, Clock } from "lucide-react"

export default function EnergyEfficiencyPage() {
  // 샘플 데이터 - 실제 데이터로 대체 필요
  const improvementProjects = [
    {
      id: 1,
      title: '고효율 모터 교체',
      description: '구형 모터를 고효율 IE4 등급 모터로 교체',
      status: 'completed',
      progress: 100,
      expectedSavings: 125000,
      actualSavings: 132000,
      roi: 2.1,
      completionDate: '2024-05-15',
      equipment: '프레스 #1, #2, #3',
    },
    {
      id: 2,
      title: 'LED 조명 교체',
      description: '기존 형광등을 LED 조명으로 교체',
      status: 'in-progress',
      progress: 65,
      expectedSavings: 85000,
      actualSavings: 0,
      roi: 1.8,
      completionDate: '2024-08-30',
      equipment: '전체 공장 조명',
    },
    {
      id: 3,
      title: '공조 시스템 최적화',
      description: '스마트 서모스탯 설치 및 공조 시스템 최적화',
      status: 'planned',
      progress: 0,
      expectedSavings: 210000,
      actualSavings: 0,
      roi: 3.2,
      completionDate: '2024-11-15',
      equipment: '중앙 공조 시스템',
    },
    {
      id: 4,
      title: '태양광 패널 설치',
      description: '지붕에 태양광 패널 설치',
      status: 'planned',
      progress: 0,
      expectedSavings: 450000,
      actualSavings: 0,
      roi: 5.5,
      completionDate: '2025-03-30',
      equipment: '공장 지붕',
    },
  ];

  const recommendations = [
    {
      id: 1,
      title: '압축공기 누수 점검',
      description: '압축공기 시스템에서 5개 지점에서 누수 발견',
      potentialSavings: 35000,
      implementationEffort: '낮음',
      priority: '높음',
    },
    {
      id: 2,
      title: '야간 전원 차단',
      description: '비가동 시간대에 대기전력 차단',
      potentialSavings: 28000,
      implementationEffort: '매우 낮음',
      priority: '중간',
    },
    {
      id: 3,
      title: '냉각수 펌프 속도 조절',
      description: 'VFD(가변속 드라이브) 설치로 에너지 절감',
      potentialSavings: 62000,
      implementationEffort: '중간',
      priority: '높음',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            완료
          </span>
        );
      case 'in-progress':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Clock className="w-3 h-3 mr-1" />
            진행 중
          </span>
        );
      case 'planned':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <AlertTriangle className="w-3 h-3 mr-1" />
            계획됨
          </span>
        );
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case '높음':
        return <span className="px-2 py-1 text-xs font-medium text-red-800 bg-red-100 rounded-full">높음</span>;
      case '중간':
        return <span className="px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full">중간</span>;
      case '낮음':
        return <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">낮음</span>;
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">에너지 효율 개선</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">연간 예상 절감액</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">💵</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7,920,000원</div>
            <p className="text-xs text-muted-foreground">+12.5% 전년 대비</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">진행 중인 프로젝트</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">🚧</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3개</div>
            <p className="text-xs text-muted-foreground">총 7개 중</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">평균 투자 회수 기간</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">⏱️</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.8년</div>
            <p className="text-xs text-muted-foreground">산업 평균 3.5년 대비</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">탄소 감축량</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">🌱</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">125 tCO₂e</div>
            <p className="text-xs text-muted-foreground">연간 예상 감축량</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>효율 개선 프로젝트</CardTitle>
            <CardDescription>진행 중이거나 계획된 에너지 효율 개선 프로젝트</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>프로젝트</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>진행률</TableHead>
                  <TableHead className="text-right">예상 절감액</TableHead>
                  <TableHead className="text-right">ROI</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {improvementProjects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">
                      <div>{project.title}</div>
                      <div className="text-sm text-muted-foreground">{project.description}</div>
                      <div className="text-xs text-muted-foreground mt-1">{project.equipment}</div>
                    </TableCell>
                    <TableCell>{getStatusBadge(project.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Progress value={project.progress} className="h-2" />
                        <span className="text-sm">{project.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {project.expectedSavings.toLocaleString()}원
                      {project.actualSavings > 0 && (
                        <div className="text-xs text-green-600">
                          실제: {project.actualSavings.toLocaleString()}원
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {project.roi}년
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>에너지 절감 권장사항</CardTitle>
            <CardDescription>AI가 분석한 에너지 절감 기회</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendations.map((rec) => (
                <div key={rec.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{rec.title}</h4>
                      <p className="text-sm text-muted-foreground">{rec.description}</p>
                    </div>
                    {getPriorityBadge(rec.priority)}
                  </div>
                  <div className="mt-3 flex justify-between items-center">
                    <div>
                      <div className="text-sm text-muted-foreground">예상 절감액</div>
                      <div className="font-medium">{rec.potentialSavings.toLocaleString()}원/년</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">구현 난이도</div>
                      <div className="font-medium">{rec.implementationEffort}</div>
                    </div>
                    <Button size="sm" variant="outline">자세히 보기</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>에너지 효율 벤치마킹</CardTitle>
            <CardDescription>유사 업계 대비 에너지 효율 지표</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { metric: '에너지 집약도', value: 0.85, industryAvg: 1.2, unit: 'kWh/개', better: 'lower' },
                { metric: '재생에너지 비율', value: 12.5, industryAvg: 8.2, unit: '%', better: 'higher' },
                { metric: '에너지 비용 대비 매출', value: 5.2, industryAvg: 4.8, unit: '배', better: 'higher' },
                { metric: '탄소 집약도', value: 0.45, industryAvg: 0.62, unit: 'tCO₂/백만원', better: 'lower' },
              ].map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">{item.metric}</span>
                    <span className="text-sm font-mono">
                      {item.value} {item.unit} 
                      <span className="text-muted-foreground">(업계 평균: {item.industryAvg}{item.unit})</span>
                    </span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full">
                    <div 
                      className={`h-full rounded-full ${
                        (item.better === 'lower' && item.value < item.industryAvg) || 
                        (item.better === 'higher' && item.value > item.industryAvg) 
                          ? 'bg-green-500' : 'bg-yellow-500'
                      }`} 
                      style={{ 
                        width: `${Math.min(100, (item.value / (item.industryAvg * 1.5)) * 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>에너지 효율 개선 로드맵</CardTitle>
            <CardDescription>향후 3년간의 효율 개선 계획</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="absolute left-4 h-full w-0.5 bg-gray-200"></div>
              <div className="space-y-8">
                {[
                  { 
                    year: '2024', 
                    items: [
                      '고효율 모터 교체 (완료)', 
                      'LED 조명 교체 (진행 중)',
                      '공조 시스템 최적화 (계획)'
                    ] 
                  },
                  { 
                    year: '2025', 
                    items: [
                      '태양광 패널 설치',
                      '에너지 저장 시스템(ESS) 도입',
                      '스마트 미터링 시스템 구축'
                    ] 
                  },
                  { 
                    year: '2026', 
                    items: [
                      '지열 냉난방 시스템 도입',
                      'AI 기반 에너지 최적화 시스템 구축',
                      '탄소 중립 인증 획득'
                    ] 
                  },
                ].map((item, index) => (
                  <div key={index} className="relative pl-8">
                    <div className="absolute left-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center -ml-4">
                      <span className="text-sm font-medium text-blue-800">{item.year}</span>
                    </div>
                    <div className="space-y-2">
                      {item.items.map((task, i) => (
                        <div key={i} className="p-3 bg-muted/50 rounded-md">
                          {task}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
