"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Download, Upload, FileText, Trash2, Edit } from "lucide-react";

// 목업 데이터
const mockEmissionFactors = [
  {
    id: "1",
    sourceCode: "GRID_KR",
    sourceName: "한국전력",
    year: 2024,
    co2: 0.4153,
    unit: "kWh",
    origin: "KEMCO",
    description: "한국전력 배출계수 2024",
  },
  {
    id: "2",
    sourceCode: "NATURAL_GAS",
    sourceName: "천연가스",
    year: 2024,
    co2: 2.1,
    unit: "Nm³",
    origin: "IPCC",
    description: "천연가스 배출계수 2024",
  },
  {
    id: "3",
    sourceCode: "DIESEL",
    sourceName: "경유",
    year: 2024,
    co2: 2.68,
    unit: "liter",
    origin: "KEMCO",
    description: "경유 배출계수 2024",
  },
];

export default function EmissionFactorsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedOrigin, setSelectedOrigin] = useState<string>("all");
  const [isEditing, setIsEditing] = useState(false);
  const [currentFactor, setCurrentFactor] = useState<any>(null);

  // 필터링된 배출계수 목록
  const filteredFactors = mockEmissionFactors.filter((factor) => {
    const matchesSearch = 
      factor.sourceCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      factor.sourceName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = selectedYear === "all" || factor.year.toString() === selectedYear;
    const matchesOrigin = selectedOrigin === "all" || factor.origin === selectedOrigin;
    
    return matchesSearch && matchesYear && matchesOrigin;
  });

  // 연도 목록 (고유값)
  const years = Array.from(new Set(mockEmissionFactors.map(f => f.year))).sort((a, b) => b - a);
  
  // 출처 목록 (고유값)
  const origins = Array.from(new Set(mockEmissionFactors.map(f => f.origin)));

  // 배출계수 편집 핸들러
  const handleEdit = (factor: any) => {
    setCurrentFactor(factor);
    setIsEditing(true);
  };

  // 배출계수 삭제 핸들러
  const handleDelete = (id: string) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      // 실제 API 연동 시 여기서 DELETE 요청
      alert(`배출계수(ID: ${id})가 삭제되었습니다.`);
    }
  };

  // 배출계수 저장 핸들러
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // 실제 API 연동 시 여기서 PUT/POST 요청
    alert(`배출계수가 ${currentFactor.id ? '수정' : '추가'}되었습니다.`);
    setIsEditing(false);
    setCurrentFactor(null);
  };

  // CSV 내보내기
  const handleExport = () => {
    const headers = [
      '배출원 코드', '배출원명', '연도', 'CO2 배출계수', '단위', '출처', '비고'
    ];
    
    const csvContent = [
      headers.join(','),
      ...filteredFactors.map(factor => (
        [
          `"${factor.sourceCode}"`,
          `"${factor.sourceName}"`,
          factor.year,
          factor.co2,
          `"${factor.unit}"`,
          `"${factor.origin}"`,
          `"${factor.description || ''}"`
        ].join(',')
      ))
    ].join('\n');
    
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `배출계수_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV 가져오기 핸들러
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const csv = event.target?.result as string;
      // CSV 파싱 로직 (간단한 예시)
      console.log('업로드된 CSV:', csv);
      alert('CSV 파일이 업로드되었습니다. 미리보기 콘솔을 확인하세요.');
    };
    reader.readAsText(file);
    
    // 입력 초기화
    e.target.value = '';
  };

  // 편집 폼
  const renderEditForm = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{currentFactor?.id ? '배출계수 수정' : '새 배출계수 추가'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">배출원 코드</label>
              <Input 
                value={currentFactor?.sourceCode || ''} 
                onChange={(e) => setCurrentFactor({...currentFactor, sourceCode: e.target.value})}
                required 
              />
            </div>
            <div>
              <label className="text-sm font-medium">배출원명</label>
              <Input 
                value={currentFactor?.sourceName || ''} 
                onChange={(e) => setCurrentFactor({...currentFactor, sourceName: e.target.value})}
                required 
              />
            </div>
            <div>
              <label className="text-sm font-medium">연도</label>
              <Input 
                type="number" 
                value={currentFactor?.year || ''} 
                onChange={(e) => setCurrentFactor({...currentFactor, year: parseInt(e.target.value)})}
                required 
              />
            </div>
            <div>
              <label className="text-sm font-medium">CO₂ 배출계수</label>
              <Input 
                type="number" 
                step="0.0001"
                value={currentFactor?.co2 || ''} 
                onChange={(e) => setCurrentFactor({...currentFactor, co2: parseFloat(e.target.value)})}
                required 
              />
            </div>
            <div>
              <label className="text-sm font-medium">단위</label>
              <Input 
                value={currentFactor?.unit || ''} 
                onChange={(e) => setCurrentFactor({...currentFactor, unit: e.target.value})}
                required 
              />
            </div>
            <div>
              <label className="text-sm font-medium">출처</label>
              <Select 
                value={currentFactor?.origin || ''} 
                onValueChange={(value) => setCurrentFactor({...currentFactor, origin: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="출처 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="KEMCO">KEMCO</SelectItem>
                  <SelectItem value="IPCC">IPCC</SelectItem>
                  <SelectItem value="CUSTOM">사내정의</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">비고</label>
            <Input 
              value={currentFactor?.description || ''} 
              onChange={(e) => setCurrentFactor({...currentFactor, description: e.target.value})}
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                setIsEditing(false);
                setCurrentFactor(null);
              }}
            >
              취소
            </Button>
            <Button type="submit">저장</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">배출계수 관리</h2>
          <p className="text-muted-foreground">
            탄소 배출량 계산을 위한 배출계수를 관리합니다.
          </p>
        </div>
      </div>

      {isEditing ? (
        renderEditForm()
      ) : (
        <>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle>배출계수 목록</CardTitle>
                  <CardDescription>
                    현재 등록된 배출계수를 확인하고 관리하세요.
                  </CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    size="sm" 
                    onClick={() => {
                      setCurrentFactor({
                        sourceCode: '',
                        sourceName: '',
                        year: new Date().getFullYear(),
                        co2: 0,
                        unit: 'kWh',
                        origin: 'KEMCO',
                        description: ''
                      });
                      setIsEditing(true);
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" /> 새 배출계수
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleExport}>
                    <Download className="mr-2 h-4 w-4" /> 내보내기
                  </Button>
                  <input
                    type="file"
                    id="import-csv"
                    accept=".csv"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => document.getElementById('import-csv')?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" /> 가져오기
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="배출원 코드 또는 이름으로 검색..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="연도" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">모든 연도</SelectItem>
                      {years.map(year => (
                        <SelectItem key={year} value={year.toString()}>{year}년</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedOrigin} onValueChange={setSelectedOrigin}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="출처" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">모든 출처</SelectItem>
                      {origins.map(origin => (
                        <SelectItem key={origin} value={origin}>{origin}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>배출원 코드</TableHead>
                      <TableHead>배출원명</TableHead>
                      <TableHead>연도</TableHead>
                      <TableHead>CO₂ 배출계수</TableHead>
                      <TableHead>단위</TableHead>
                      <TableHead>출처</TableHead>
                      <TableHead>비고</TableHead>
                      <TableHead className="w-[100px]">관리</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFactors.length > 0 ? (
                      filteredFactors.map((factor) => (
                        <TableRow key={factor.id}>
                          <TableCell className="font-medium">{factor.sourceCode}</TableCell>
                          <TableCell>{factor.sourceName}</TableCell>
                          <TableCell>{factor.year}</TableCell>
                          <TableCell>{factor.co2.toFixed(4)}</TableCell>
                          <TableCell>{factor.unit}</TableCell>
                          <TableCell>{factor.origin}</TableCell>
                          <TableCell className="text-muted-foreground truncate max-w-[200px]">
                            {factor.description}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={() => handleEdit(factor)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => handleDelete(factor.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          검색 결과가 없습니다.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>사용 가이드</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">배출계수란?</h4>
                  <p className="text-sm text-muted-foreground">
                    에너지 사용량을 탄소 배출량으로 환산하기 위한 계수로, 에너지원별로 다른 값을 가집니다.
                    (예: 전기 1kWh = 0.4153kgCO₂e)
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">데이터 출처</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• KEMCO: 한국에너지공단 국가온실가스종합정보센터</li>
                    <li>• IPCC: 기후변화에 관한 정부간 협의체</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>배출계수 계산 예시</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-md">
                  <p className="font-mono text-sm">
                    <span className="text-muted-foreground">// 전기 사용량 1,000kWh의 탄소배출량 계산</span><br />
                    <span className="text-foreground">1,000 kWh × 0.4153 kgCO₂e/kWh = 415.3 kgCO₂e</span><br /><br />
                    
                    <span className="text-muted-foreground">// 천연가스 500 Nm³의 탄소배출량 계산</span><br />
                    <span className="text-foreground">500 Nm³ × 2.1 kgCO₂e/Nm³ = 1,050 kgCO₂e</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
