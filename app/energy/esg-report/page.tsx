"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, FileText, Calendar as CalendarIcon, BarChart, Globe, Users, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { DatePicker } from "@/components/ui/date-picker";

// 목업 데이터
const mockReportTemplates = [
  { id: 'gri', name: 'GRI 표준', description: '글로벌 보고 이니셔티브 표준에 따른 ESG 보고서' },
  { id: 'tcfd', name: 'TCFD 권고사항', description: '기후 관련 재무공시 태스크포스 권고사항' },
  { id: 'sasb', name: 'SASB 표준', description: '지속가능 회계 기준 위원회 표준' },
  { id: 'custom', name: '맞춤형', description: '사용자 정의 보고서 템플릿' },
];

const mockPerformanceData = {
  carbonEmissions: {
    total: 1250, // tCO2e
    scope1: 450,
    scope2: 650,
    scope3: 150,
    reduction: 8.5, // %
    target: 15, // %
    year: 2024
  },
  energy: {
    total: 12500, // MWh
    renewable: 18, // %
    efficiency: 5.2, // % improvement
  },
  social: {
    trainingHours: 1250,
    safetyIncidents: 3,
    employeeSatisfaction: 82, // %
  },
  governance: {
    boardDiversity: 35, // %
    ethicsTraining: 100, // %
    policyUpdates: 4,
  }
};

// 보고서 섹션 컴포넌트
const ReportSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-8">
    <h3 className="text-xl font-semibold mb-4 pb-2 border-b">{title}</h3>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

// 지표 카드 컴포넌트
const MetricCard = ({ 
  title, 
  value, 
  unit = '', 
  change, 
  description 
}: { 
  title: string; 
  value: string | number; 
  unit?: string; 
  change?: number; 
  description?: string; 
}) => (
  <Card className="h-full">
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">
        {typeof value === 'number' ? value.toLocaleString() : value} 
        {unit && <span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span>}
      </div>
      {change !== undefined && (
        <p className={`text-xs mt-1 ${
          change >= 0 ? 'text-green-600' : 'text-red-600'
        }`}>
          {change >= 0 ? '▲' : '▼'} {Math.abs(change)}% 전년 대비
        </p>
      )}
      {description && (
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      )}
    </CardContent>
  </Card>
);

export default function ESGReportPage() {
  const [selectedTemplate, setSelectedTemplate] = useState('gri');
  const [reportPeriod, setReportPeriod] = useState({
    start: new Date(new Date().getFullYear(), 0, 1), // 올해 1월 1일
    end: new Date() // 오늘
  });
  const [companyInfo, setCompanyInfo] = useState({
    name: '한국기업 주식회사',
    industry: '제조업',
    employees: 250,
    location: '서울특별시',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('preview');
  
  // 보고서 생성 핸들러
  const handleGenerateReport = () => {
    setIsGenerating(true);
    // 실제로는 API 호출로 대체
    setTimeout(() => {
      setIsGenerating(false);
      setActiveTab('preview');
    }, 1500);
  };
  
  // PDF 다운로드 핸들러
  const handleDownloadPDF = () => {
    // 실제로는 PDF 생성 API 호출
    alert('PDF 다운로드가 시작됩니다. (데모에서는 실제 다운로드되지 않습니다)');
  };
  
  // 보고서 미리보기 렌더링
  const renderReportPreview = () => (
    <div className="bg-white p-8 shadow-sm border rounded-lg">
      {/* 표지 */}
      <div className="text-center py-20 border-b mb-8">
        <h1 className="text-3xl font-bold mb-2">ESG 지속가능경영보고서</h1>
        <p className="text-xl text-muted-foreground">
          {format(reportPeriod.start, 'yyyy년 MM월 dd일')} ~ {format(reportPeriod.end, 'yyyy년 MM월 dd일')}
        </p>
        <p className="mt-8 text-lg">{companyInfo.name}</p>
      </div>
      
      {/* 목차 */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">목차</h2>
        <ul className="space-y-2">
          <li>1. 회사 개요</li>
          <li>2. 환경(Environment) 성과</li>
          <li>3. 사회(Social) 성과</li>
          <li>4. 지배구조(Governance) 성과</li>
          <li>5. 향후 계획 및 목표</li>
        </ul>
      </div>
      
      {/* 1. 회사 개요 */}
      <ReportSection title="1. 회사 개요">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard 
            title="기업명" 
            value={companyInfo.name} 
            description="상장사"
          />
          <MetricCard 
            title="산업" 
            value={companyInfo.industry}
            description="주요 사업 분야"
          />
          <MetricCard 
            title="종업원 수" 
            value={companyInfo.employees}
            unit="명"
            description="정규직 기준"
          />
          <MetricCard 
            title="본사 위치" 
            value={companyInfo.location}
            description="주요 사업장"
          />
        </div>
        
        <div className="bg-muted p-4 rounded-lg">
          <h4 className="font-medium mb-2">CEO 메시지</h4>
          <p className="text-sm text-muted-foreground">
            {companyInfo.name}은(는) 지속가능한 미래를 위해 ESG 경영을 최우선 과제로 삼고 있습니다. 
            환경 보호, 사회적 책임, 투명한 지배구조를 바탕으로 이해관계자와의 상생을 도모하겠습니다.
          </p>
        </div>
      </ReportSection>
      
      {/* 2. 환경 성과 */}
      <ReportSection title="2. 환경(Environment) 성과">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <MetricCard 
            title="총 탄소 배출량" 
            value={mockPerformanceData.carbonEmissions.total}
            unit="tCO₂e"
            change={-mockPerformanceData.carbonEmissions.reduction}
            description={`${mockPerformanceData.carbonEmissions.year}년 목표: ${mockPerformanceData.carbonEmissions.target}% 감축`}
          />
          <MetricCard 
            title="재생에너지 비중" 
            value={mockPerformanceData.energy.renewable}
            unit="%"
            change={3.2}
            description="총 에너지 사용량 대비"
          />
          <MetricCard 
            title="에너지 효율 개선" 
            value={mockPerformanceData.energy.efficiency}
            unit="%"
            change={1.8}
            description="전년 대비 개선률"
          />
        </div>
        
        <div className="bg-muted p-4 rounded-lg mb-6">
          <h4 className="font-medium mb-2">주요 성과</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
              <span>태양광 발전 시설 도입으로 재생에너지 사용량 18% 달성</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
              <span>공정 개선을 통한 에너지 효율 5.2% 개선</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
              <span>폐기물 재활용률 92% 달성 (전년 대비 7%p 증가)</span>
            </li>
          </ul>
        </div>
      </ReportSection>
      
      {/* 3. 사회 성과 */}
      <ReportSection title="3. 사회(Social) 성과">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <MetricCard 
            title="교육 훈련 시간" 
            value={mockPerformanceData.social.trainingHours}
            unit="시간"
            change={15}
            description="연간 종업원 1인당"
          />
          <MetricCard 
            title="안전 사고 건수" 
            value={mockPerformanceData.social.safetyIncidents}
            unit="건"
            change={-2}
            description="감소 추세"
          />
          <MetricCard 
            title="종업원 만족도" 
            value={mockPerformanceData.social.employeeSatisfaction}
            unit="%"
            change={3}
            description="전사 설문 조사"
          />
        </div>
      </ReportSection>
      
      {/* 4. 지배구조 성과 */}
      <ReportSection title="4. 지배구조(Governance) 성과">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <MetricCard 
            title="이사회 성비" 
            value={mockPerformanceData.governance.boardDiversity}
            unit="%"
            change={5}
            description="여성 이사 비율"
          />
          <MetricCard 
            title="윤리 교육 이수율" 
            value={mockPerformanceData.governance.ethicsTraining}
            unit="%"
            change={0}
            description="전 임직원 대상"
          />
          <MetricCard 
            title="정책 개정 건수" 
            value={mockPerformanceData.governance.policyUpdates}
            unit="건"
            description="ESG 관련 정책"
          />
        </div>
      </ReportSection>
      
      {/* 5. 향후 계획 */}
      <ReportSection title="5. 향후 계획 및 목표">
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">환경(Environment)</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>2030년까지 탄소 중립(Net-Zero) 달성</li>
              <li>재생에너지 전환 가속화 (2030년까지 50% 달성 목표)</li>
              <li>순 제로 폐기물 인증 획득</li>
            </ul>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">사회(Social)</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>직원 복지 강화를 위한 프로그램 확대</li>
              <li>지역 사회 기여 활동 확대</li>
              <li>다양성과 포용성 강화</li>
            </ul>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">지배구조(Governance)</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>이사회 내 ESG 위원회 신설</li>
              <li>지속가능경영보고서 GRI 표준 준수</li>
              <li>ESG 리스크 관리 시스템 고도화</li>
            </ul>
          </div>
        </div>
      </ReportSection>
      
      <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
        <p>본 보고서는 {companyInfo.name}의 {format(new Date(), 'yyyy년 MM월 dd일')} 기준 정보를 바탕으로 작성되었습니다.</p>
        <p className="mt-2">© {new Date().getFullYear()} {companyInfo.name}. All rights reserved.</p>
      </div>
    </div>
  );
  
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">ESG 보고서 생성</h2>
          <p className="text-muted-foreground">
            기업의 환경, 사회, 지배구조(ESG) 성과를 보고서로 작성하세요.
          </p>
        </div>
        <Button 
          onClick={handleDownloadPDF}
          disabled={isGenerating}
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          PDF로 다운로드
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="setup">보고서 설정</TabsTrigger>
          <TabsTrigger value="preview" disabled={!isGenerating && activeTab === 'setup'}>
            미리보기
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="setup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>보고서 설정</CardTitle>
              <CardDescription>
                생성할 ESG 보고서의 기본 정보를 입력하세요.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="template">보고서 템플릿</Label>
                  <Select 
                    value={selectedTemplate} 
                    onValueChange={setSelectedTemplate}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="템플릿 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockReportTemplates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {mockReportTemplates.find(t => t.id === selectedTemplate)?.description}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label>보고 기간</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        시작일
                      </div>
                      <DatePicker
                        date={reportPeriod.start}
                        onSelect={(date) => setReportPeriod({...reportPeriod, start: date || new Date()})}
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        종료일
                      </div>
                      <DatePicker
                        date={reportPeriod.end}
                        onSelect={(date) => setReportPeriod({...reportPeriod, end: date || new Date()})}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">기업명</Label>
                  <Input 
                    id="companyName" 
                    value={companyInfo.name}
                    onChange={(e) => setCompanyInfo({...companyInfo, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">산업</Label>
                  <Input 
                    id="industry" 
                    value={companyInfo.industry}
                    onChange={(e) => setCompanyInfo({...companyInfo, industry: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>보고서 포함 항목</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <label className="flex items-center space-x-2 p-3 border rounded-md hover:bg-muted/50 cursor-pointer">
                    <input type="checkbox" className="h-4 w-4" defaultChecked />
                    <div>
                      <p className="font-medium">환경(Environment)</p>
                      <p className="text-xs text-muted-foreground">탄소 배출, 에너지 사용 등</p>
                    </div>
                  </label>
                  <label className="flex items-center space-x-2 p-3 border rounded-md hover:bg-muted/50 cursor-pointer">
                    <input type="checkbox" className="h-4 w-4" defaultChecked />
                    <div>
                      <p className="font-medium">사회(Social)</p>
                      <p className="text-xs text-muted-foreground">인권, 노동, 지역사회 등</p>
                    </div>
                  </label>
                  <label className="flex items-center space-x-2 p-3 border rounded-md hover:bg-muted/50 cursor-pointer">
                    <input type="checkbox" className="h-4 w-4" defaultChecked />
                    <div>
                      <p className="font-medium">지배구조(Governance)</p>
                      <p className="text-xs text-muted-foreground">이사회, 윤리 경영 등</p>
                    </div>
                  </label>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="additionalNotes">추가 메모</Label>
                <Textarea 
                  id="additionalNotes" 
                  placeholder="보고서에 포함시킬 추가 정보나 특이사항을 입력하세요."
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                onClick={handleGenerateReport}
                disabled={isGenerating}
                className="gap-2"
              >
                {isGenerating ? '생성 중...' : '보고서 생성'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>보고서 미리보기</CardTitle>
                  <CardDescription>
                    생성된 ESG 보고서를 미리보고 필요시 수정할 수 있습니다.
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setActiveTab('setup')}>
                    설정 수정
                  </Button>
                  <Button size="sm" className="gap-2" onClick={handleDownloadPDF}>
                    <Download className="h-4 w-4" /> 다운로드
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {renderReportPreview()}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
