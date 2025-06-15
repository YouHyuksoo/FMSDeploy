import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bolt, LineChart, Zap, Leaf, FileText } from "lucide-react"
import Link from "next/link"

export default function EnergyManagementPage() {
  const quickActions = [
    {
      title: "실시간 모니터링",
      description: "에너지 사용 현황을 실시간으로 확인하세요.",
      icon: <Bolt className="h-6 w-6 text-blue-500" />,
      href: "/energy/monitoring",
      color: "bg-blue-100 dark:bg-blue-900/30"
    },
    {
      title: "사용 분석",
      description: "에너지 사용 패턴과 추이를 분석하세요.",
      icon: <LineChart className="h-6 w-6 text-green-500" />,
      href: "/energy/analysis",
      color: "bg-green-100 dark:bg-green-900/30"
    },
    {
      title: "효율 개선",
      description: "에너지 효율 개선 기회를 찾아보세요.",
      icon: <Zap className="h-6 w-6 text-yellow-500" />,
      href: "/energy/efficiency",
      color: "bg-yellow-100 dark:bg-yellow-900/30"
    },
    {
      title: "탄소 배출",
      description: "탄소 배출량을 추적하고 관리하세요.",
      icon: <Leaf className="h-6 w-6 text-emerald-500" />,
      href: "/energy/carbon",
      color: "bg-emerald-100 dark:bg-emerald-900/30"
    },
    {
      title: "배출계수 관리",
      description: "탄소 배출 계산을 위한 배출계수를 관리하세요.",
      icon: <FileText className="h-6 w-6 text-purple-500" />,
      href: "/energy/emission-factors",
      color: "bg-purple-100 dark:bg-purple-900/30"
    }
  ];

  const energyStats = [
    { name: '오늘 전력 사용량', value: '1,245 kWh', change: '+5.2%', changeType: 'increase' },
    { name: '이번 달 전기 요금', value: '12,450,000원', change: '-2.1%', changeType: 'decrease' },
    { name: '탄소 배출량', value: '1,245 tCO₂e', change: '-3.7%', changeType: 'decrease' },
    { name: '재생에너지 비율', value: '12.5%', change: '+2.3%', changeType: 'increase' },
  ]

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">에너지 관리 시스템</h2>
          <p className="text-muted-foreground">
            에너지 사용을 모니터링하고 효율을 개선하여 비용을 절감하세요.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {energyStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.name}
              </CardTitle>
              <div className="h-4 w-4 text-muted-foreground">
                {stat.changeType === 'increase' ? '📈' : '📉'}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${stat.changeType === 'increase' ? 'text-red-500' : 'text-green-500'}`}>
                {stat.change} 전월 대비
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((action, index) => (
          <Link key={index} href={action.href}>
            <Card className="cursor-pointer transition-all hover:shadow-md">
              <CardContent className="p-6">
                <div className={`${action.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                  {action.icon}
                </div>
                <h3 className="font-medium text-lg mb-1">{action.title}</h3>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>주요 에너지 소비 설비</CardTitle>
            <CardDescription>가장 많은 에너지를 소비하는 상위 5개 설비</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: '프레스 #1', usage: '245 kWh', percent: 85 },
                { name: '용접기 #2', usage: '198 kWh', percent: 70 },
                { name: '크레인 #1', usage: '176 kWh', percent: 62 },
                { name: '냉각기 #3', usage: '154 kWh', percent: 55 },
                { name: '컨베이어 #2', usage: '132 kWh', percent: 48 },
              ].map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{item.name}</span>
                    <span className="text-muted-foreground">{item.usage}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${item.percent}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>최근 에너지 경고</CardTitle>
            <CardDescription>최근 발생한 에너지 관련 경고 및 알림</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  type: 'warning',
                  title: '프레스 #1 과부하',
                  time: '10분 전',
                  description: '정격 전력 대비 15% 초과 사용 중'
                },
                {
                  type: 'alert',
                  title: '냉각수 온도 이상',
                  time: '1시간 전',
                  description: '냉각수 온도가 설정값을 초과했습니다.'
                },
                {
                  type: 'info',
                  title: '에너지 사용량 급증',
                  time: '3시간 전',
                  description: '평소보다 25% 많은 에너지가 소비되고 있습니다.'
                },
                {
                  type: 'success',
                  title: '에너지 절약 달성',
                  time: '1일 전',
                  description: '목표 대비 12% 에너지 절약을 달성했습니다.'
                },
              ].map((alert, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 mt-2 rounded-full ${
                    alert.type === 'warning' ? 'bg-yellow-500' :
                    alert.type === 'alert' ? 'bg-red-500' :
                    alert.type === 'info' ? 'bg-blue-500' : 'bg-green-500'
                  }`}></div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-medium">{alert.title}</h4>
                      <span className="text-xs text-muted-foreground">{alert.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{alert.description}</p>
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
            <CardTitle>에너지 효율 개선 제안</CardTitle>
            <CardDescription>에너지 사용 효율을 높일 수 있는 권장 사항</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  title: '고효율 모터 교체',
                  description: '구형 모터를 IE4 등급 고효율 모터로 교체',
                  savings: '연간 1,250,000원 절감',
                  cost: '비용: 2,500,000원',
                  roi: 'ROI: 2.0년'
                },
                {
                  title: 'LED 조명 교체',
                  description: '기존 형광등을 LED 조명으로 교체',
                  savings: '연간 850,000원 절감',
                  cost: '비용: 1,500,000원',
                  roi: 'ROI: 1.8년'
                },
                {
                  title: '스마트 서모스탯 설치',
                  description: '에너지 사용 패턴에 맞춘 자동 온도 조절',
                  savings: '연간 620,000원 절감',
                  cost: '비용: 1,800,000원',
                  roi: 'ROI: 2.9년'
                },
              ].map((suggestion, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h4 className="font-medium">{suggestion.title}</h4>
                  <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                  <div className="mt-2 flex justify-between text-sm">
                    <span className="text-green-600">{suggestion.savings}</span>
                    <span className="text-muted-foreground">{suggestion.cost}</span>
                    <span className="font-medium">{suggestion.roi}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>에너지 소비 예측</CardTitle>
            <CardDescription>향후 7일간의 에너지 소비 예측</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] bg-muted/40 rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">에너지 소비 예측 차트가 여기에 표시됩니다.</p>
            </div>
            <div className="mt-4 grid grid-cols-7 gap-2 text-center">
              {['월', '화', '수', '목', '금', '토', '일'].map((day, index) => (
                <div key={index}>
                  <div className="text-sm font-medium">{day}</div>
                  <div className="text-sm text-muted-foreground">1,2{index + 5}0 kWh</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
