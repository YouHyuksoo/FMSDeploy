"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search, FileText, Download, Plus, FileBarChart2, FilePieChart, FileCheck, Calendar as CalendarIcon } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"

type ReportStatus = 'draft' | 'published' | 'archived'

type Report = {
  id: string
  title: string
  type: 'annual' | 'sustainability' | 'esg' | 'carbon'
  period: string
  status: ReportStatus
  createdAt: string
  updatedAt: string
  createdBy: string
}

export default function ESGReportPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState<ReportStatus | 'all'>('all')
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
    to: new Date()
  })
  
  const [reports, setReports] = useState<Report[]>([
    {
      id: "1",
      title: "2023년 지속가능경영보고서",
      type: "sustainability",
      period: "2023.01.01 - 2023.12.31",
      status: "published",
      createdAt: "2024-03-15",
      updatedAt: "2024-03-20",
      createdBy: "홍길동"
    },
    {
      id: "2",
      title: "2023년 ESG 성과 보고서",
      type: "esg",
      period: "2023.01.01 - 2023.12.31",
      status: "published",
      createdAt: "2024-03-10",
      updatedAt: "2024-03-15",
      createdBy: "김철수"
    },
    {
      id: "3",
      title: "2024년 상반기 탄소중립 보고서",
      type: "carbon",
      period: "2024.01.01 - 2024.06.30",
      status: "draft",
      createdAt: "2024-06-28",
      updatedAt: "2024-06-28",
      createdBy: "이영희"
    },
    {
      id: "4",
      title: "2022년 연간 보고서",
      type: "annual",
      period: "2022.01.01 - 2022.12.31",
      status: "archived",
      createdAt: "2023-03-10",
      updatedAt: "2023-03-15",
      createdBy: "홍길동"
    },
    {
      id: "5",
      title: "2024년 1분기 지속가능성 보고서",
      type: "sustainability",
      period: "2024.01.01 - 2024.03.31",
      status: "published",
      createdAt: "2024-04-05",
      updatedAt: "2024-04-10",
      createdBy: "박지영"
    }
  ])

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        report.period.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (activeTab === 'all') return matchesSearch
    return report.status === activeTab && matchesSearch
  })

  const getReportIcon = (type: string) => {
    switch (type) {
      case 'annual':
        return <FileText className="h-5 w-5 text-blue-500" />
      case 'sustainability':
        return <FileBarChart2 className="h-5 w-5 text-green-500" />
      case 'esg':
        return <FilePieChart className="h-5 w-5 text-purple-500" />
      case 'carbon':
        return <FileCheck className="h-5 w-5 text-orange-500" />
      default:
        return <FileText className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case 'published':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            발행 완료
          </span>
        )
      case 'draft':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            초안
          </span>
        )
      case 'archived':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            보관됨
          </span>
        )
      default:
        return null
    }
  }

  const getReportTypeLabel = (type: string) => {
    switch (type) {
      case 'annual':
        return '연간 보고서'
      case 'sustainability':
        return '지속가능성 보고서'
      case 'esg':
        return 'ESG 성과 보고서'
      case 'carbon':
        return '탄소중립 보고서'
      default:
        return type
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">ESG 보고서 생성</h2>
          <p className="text-muted-foreground">
            ESG 관련 보고서를 생성하고 관리하세요.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            새 보고서 생성
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">전체 보고서</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.length}</div>
            <p className="text-xs text-muted-foreground">총 보고서 수</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">발행 완료</CardTitle>
            <FileBarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reports.filter(r => r.status === 'published').length}
            </div>
            <p className="text-xs text-muted-foreground">검토 완료된 보고서</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">초안</CardTitle>
            <FilePieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reports.filter(r => r.status === 'draft').length}
            </div>
            <p className="text-xs text-muted-foreground">작성 중인 보고서</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">보관됨</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reports.filter(r => r.status === 'archived').length}
            </div>
            <p className="text-xs text-muted-foreground">보관된 보고서</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <CardTitle>보고서 목록</CardTitle>
              <CardDescription>
                생성된 ESG 관련 보고서 목록을 확인하고 관리할 수 있습니다.
              </CardDescription>
            </div>
            <div className="flex flex-col md:flex-row gap-2">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="보고서 검색..."
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="보고서 유형" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">모든 유형</SelectItem>
                    <SelectItem value="annual">연간 보고서</SelectItem>
                    <SelectItem value="sustainability">지속가능성 보고서</SelectItem>
                    <SelectItem value="esg">ESG 성과 보고서</SelectItem>
                    <SelectItem value="carbon">탄소중립 보고서</SelectItem>
                  </SelectContent>
                </Select>
                <DatePicker
                  mode="range"
                  date={dateRange}
                  onDateChange={setDateRange}
                  className="w-[240px]"
                />
              </div>
            </div>
          </div>
          <Tabs 
            value={activeTab} 
            onValueChange={(value) => setActiveTab(value as ReportStatus | 'all')}
            className="mt-4"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">전체</TabsTrigger>
              <TabsTrigger value="published">발행 완료</TabsTrigger>
              <TabsTrigger value="draft">초안</TabsTrigger>
              <TabsTrigger value="archived">보관됨</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredReports.length > 0 ? (
              <div className="border rounded-lg divide-y">
                {filteredReports.map((report) => (
                  <div key={report.id} className="p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 pt-1">
                          {getReportIcon(report.type)}
                        </div>
                        <div>
                          <h3 className="font-medium">{report.title}</h3>
                          <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <span>{getReportTypeLabel(report.type)}</span>
                            <span>•</span>
                            <span>{report.period}</span>
                            <span>•</span>
                            <span>작성자: {report.createdBy}</span>
                            <span>•</span>
                            <span>최종 수정: {report.updatedAt}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(report.status)}
                        <Button variant="outline" size="sm" className="ml-2">
                          <Download className="h-4 w-4 mr-2" />
                          다운로드
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">보고서가 없습니다</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {searchTerm ? '검색 결과가 없습니다.' : '새로운 ESG 보고서를 생성해보세요.'}
                </p>
                {!searchTerm && (
                  <Button className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    새 보고서 생성
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>보고서 유형별 현황</CardTitle>
            <CardDescription>
              보고서 유형별로 생성된 보고서 수를 확인하세요.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              보고서 유형별 현황 차트가 여기에 표시됩니다.
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>분기별 보고서 생성 추이</CardTitle>
            <CardDescription>
              분기별로 생성된 보고서 수를 확인하세요.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              분기별 보고서 생성 추이 차트가 여기에 표시됩니다.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
