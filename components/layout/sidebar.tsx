"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Settings,
  Package,
  ClipboardCheck,
  Wrench,
  Users,
  AlertTriangle,
  Calendar,
  Brain,
  BarChart3,
  Map,
  LinkIcon,
  Smartphone,
  ChevronDown,
  ChevronRight,
  FileText,
  Bolt,
  Gauge,
  TrendingDown,
  Leaf,
  Target,
  LineChart,
  FileBarChart2
} from "lucide-react"
import { useTranslation } from "@/lib/language-context"

import type { MainNavItem } from "@/types"

interface DashboardConfig {
  mainNav: MainNavItem[]
}

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

const menuItems = [
  {
    titleKey: "sensor.title",
    title: "센서 관리",
    icon: Gauge,
    href: "/sensor",
    children: [
      { titleKey: "sensor.overview", title: "센서 현황", href: "/sensor" },
      { title: "센서 대시보드", href: "/sensor/dashboard" },
      { titleKey: "sensor.registration", title: "센서 등록", href: "/sensor/register" },
      { titleKey: "sensor.groups", title: "센서 그룹 관리", href: "/sensor/groups" },
      { titleKey: "sensor.types", title: "센서 유형 관리", href: "/sensor/types" },
      {
        titleKey: "sensor.analysis",
        title: "센서 데이터 분석",
        icon: BarChart3,
        href: "/sensor/analysis",
      },
    ],
  },
  {
    titleKey: "equipment.title",
    title: "설비정보관리",
    icon: Settings,
    href: "/equipment",
    children: [
      { titleKey: "equipment.overview", title: "설비통합조회", href: "/equipment/overview" },
      { titleKey: "equipment.master_management", title: "설비마스터관리", href: "/equipment/master" },
      { titleKey: "equipment.registration_management", title: "설비등록관리", href: "/equipment" },
      { titleKey: "equipment.bom_management", title: "설비BOM관리", href: "/equipment/bom" }, 
      { title: "설비사양관리", href: "/equipment/spec" },
      { title: "설비자료관리", href: "/equipment/docs" },
    ],
  },
  {
    titleKey: "materials",
    title: "보전자재관리",
    icon: Package,
    href: "/materials",
    children: [
      { title: "자재등록관리", href: "/materials" },
      { title: "자재마스터관리", href: "/materials/master" },
      { title: "재고마스터관리", href: "/materials/stock" },
      { title: "자재입고관리", href: "/materials/inbound" }, // Updated
      { title: "자재출고관리", href: "/materials/outbound" }, // New
      { title: "자재출고요청", href: "/materials/issuance-request" }, // Existing
    ],
  },
  {
    titleKey: "maintenanceTemplate",
    title: "보전템플릿",
    icon: FileText,
    href: "/maintenance-template",
    children: [
      { title: "템플릿 마스터 관리", href: "/maintenance-template/master" },
      { title: "템플릿 항목 관리", href: "/maintenance-template/standard" },
    ],
  },
  {
    titleKey: "inspection",
    title: "점검관리",
    icon: ClipboardCheck,
    href: "/inspection",
    children: [
      { title: "점검스케줄설정", href: "/inspection/schedule" },
      { title: "점검결과입력", href: "/inspection/result" },
      { title: "점검관리카렌더", href: "/inspection/calendar" },
    ],
  },
  {
    titleKey: "maintenance",
    title: "보전작업관리",
    icon: Wrench,
    href: "/maintenance",
    children: [
      { titleKey: "maintenance.request_management", title: "작업요청등록", href: "/maintenance/request" },
      { titleKey: "maintenance.plan_management", title: "작업계획배정", href: "/maintenance/plan" },
      { titleKey: "maintenance.complete_management", title: "작업완료처리", href: "/maintenance/complete" },
    ],
  },
  {
    titleKey: "energy.title",
    title: "에너지/탄소관리",
    icon: Bolt,
    href: "/energy",
    children: [
      { titleKey: "energy.dashboard", title: "에너지 대시보드", href: "/energy" },
      { titleKey: "energy.monitoring", title: "에너지 모니터링", href: "/energy/monitoring" },
      { titleKey: "energy.usage_analysis", title: "에너지 사용 분석", href: "/energy/analysis" },
      { titleKey: "energy.ai_prediction", title: "AI 예측 분석", href: "/energy/prediction" },
      { 
        titleKey: "carbon.management", 
        title: "탄소 관리", 
        icon: Leaf,
        href: "/carbon",
        children: [
          { titleKey: "carbon.tracking", title: "탄소 배출 현황", href: "/carbon" },
          { titleKey: "carbon.emission_factors", title: "배출계수 관리", href: "/carbon/emission-factors" },
          { titleKey: "carbon.reduction_targets", title: "감축 목표 관리", href: "/carbon/reduction-targets" },
          { titleKey: "carbon.esg_report", title: "ESG 보고서", href: "/carbon/esg-report" },
        ]
      },
    ],
  },
  {
    titleKey: "tpm",
    title: "TPM활동관리",
    icon: Users,
    href: "/tpm",
    children: [
      { titleKey: "tpm.activity_management", title: "TPM활동등록", href: "/tpm/activity" },
      { titleKey: "tpm.team_management", title: "분임조관리", href: "/tpm/team" },
    ],
  },
  {
    titleKey: "failure",
    title: "고장관리",
    icon: AlertTriangle,
    href: "/failure",
    children: [
      { titleKey: "failure.register_management", title: "고장등록", href: "/failure/desktop-register" },
      { titleKey: "failure.history_management", title: "고장이력조회", href: "/failure/history" },
    ],
  },
  {
    titleKey: "preventive",
    title: "예방정비",
    icon: Calendar,
    href: "/preventive",
    children: [
      { titleKey: "preventive.master_management", title: "예방정비마스터", href: "/preventive/master" },
      { titleKey: "preventive.order_management", title: "정비오더생성", href: "/preventive/order" },
      { titleKey: "preventive.calendar_management", title: "예방정비카렌더", href: "/preventive/calendar" },
    ],
  },
  {
    titleKey: "metering",
    title: "검침/검교정",
    icon: Gauge,
    href: "/metering",
    children: [
      { titleKey: "metering.reading_management", title: "검침관리", href: "/metering/reading" },
      { titleKey: "metering.calibration_management", title: "계측기검교정", href: "/metering/calibration" },
      { titleKey: "metering.analytics_management", title: "검침분석", href: "/metering/analytics" },
      { titleKey: "metering.calendar_management", title: "교정일정캘린더", href: "/metering/calendar" },
      { titleKey: "metering.budget_management", title: "예산관리", href: "/metering/budget" },
      { titleKey: "metering.cost_analysis", title: "비용분석", href: "/metering/cost-analysis" },
    ],
  },
  {
    titleKey: "prediction",
    title: "예지보전(AI)",
    icon: Brain,
    href: "/prediction",
    children: [
      { titleKey: "prediction.result_management", title: "예측결과조회", href: "/prediction/result" },
      { titleKey: "prediction.sensor_management", title: "센서데이터관리", href: "/prediction/sensor" },
    ],
  },
  {
    titleKey: "kpi",
    title: "KPI분석",
    icon: BarChart3,
    href: "/kpi",
    children: [
      { titleKey: "kpi.dashboard_management", title: "KPI 대시보드", href: "/kpi" },
      { titleKey: "kpi.mtbf_management", title: "MTBF/MTTR", href: "/kpi/mtbf" },
      { titleKey: "kpi.health_management", title: "설비건강지수", href: "/kpi/health" },
    ],
  },
  {
    titleKey: "location",
    title: "위치기반모니터링",
    icon: Map,
    href: "/location",
    children: [
      { titleKey: "location.layout_management", title: "설비배치도", href: "/location/layout" },
      { titleKey: "location.monitor_management", title: "실시간모니터링", href: "/location/monitor" },
    ],
  },
  {
    titleKey: "integration",
    title: "외부연동",
    icon: LinkIcon,
    href: "/integration",
    children: [
      { titleKey: "integration.erp_management", title: "ERP연동", href: "/integration/erp" },
      { titleKey: "integration.plc_management", title: "PLC연동", href: "/integration/plc" },
    ],
  },
  {
    titleKey: "mobile",
    title: "모바일QR점검",
    icon: Smartphone,
    href: "/mobile",
    children: [
      { titleKey: "mobile.qr_management", title: "QR스캔점검", href: "/mobile/qr" },
      { titleKey: "mobile.result_management", title: "모바일결과조회", href: "/mobile/result" },
      { titleKey: "mobile.failure_register", title: "고장 등록 (QR)", href: "/mobile-qr/failure-register" },
    ],
  },
  {
    titleKey: "system",
    title: "시스템관리",
    icon: Settings,
    href: "/system",
    children: [
      { titleKey: "system.organization_management", title: "조직관리", href: "/system/organization" },
      { titleKey: "system.users_management", title: "사용자관리", href: "/system/users" },
      { titleKey: "system.permissions_management", title: "권한관리", href: "/system/permissions" },
      { titleKey: "system.roles_management", title: "역할관리", href: "/system/permissions/roles" },
      { titleKey: "system.codes_management", title: "기초코드관리", href: "/system/codes" },
      { titleKey: "system.config_management", title: "환경설정", href: "/system/config" },
      { titleKey: "system.language_management", title: "다국어관리", href: "/system/language" },
      { titleKey: "system.theme_management", title: "테마설정", href: "/system/theme" },
    ],
  },
]

export const dashboardConfig: DashboardConfig = {
  mainNav: [
    {
      title: "Documentation",
      href: "/docs",
    },
    {
      title: "Support",
      href: "/support",
      disabled: true,
    },
  ],
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [isMounted, setIsMounted] = useState(false)
  const { t: tCommon } = useTranslation('common')
  const { t: tMenu } = useTranslation('menu')

  // Helper function to get translated text with fallback
  const getTranslatedText = (item: { titleKey?: string; title: string }) => {
    if (!item.titleKey) return item.title;
    // Try to get translation with 'menu' namespace first, then fallback to common
    const translation = tMenu(item.titleKey, item.title) || tCommon(item.titleKey, item.title);
    return translation === item.titleKey ? item.title : translation;
  }

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev => {
      const newItems = prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
      return newItems
    })
  }

  // Load expanded items from localStorage on mount
  useEffect(() => {
    setIsMounted(true)
    const savedExpandedItems = localStorage.getItem('sidebarExpandedItems')
    if (savedExpandedItems) {
      setExpandedItems(JSON.parse(savedExpandedItems))
    }

    // Automatically expand parent of active child on initial load
    const activeParent = menuItems.find((item) =>
      item.children?.some((child) => pathname === child.href || pathname.startsWith(child.href + "/")),
    )
    if (activeParent) {
      const titleToUse = activeParent.titleKey || activeParent.title
      setExpandedItems(prev => {
        if (!prev.includes(titleToUse)) {
          return [...prev, titleToUse]
        }
        return prev
      })
    }
  }, [pathname])

  // Save expanded items to localStorage when they change
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('sidebarExpandedItems', JSON.stringify(expandedItems))
    }
  }, [expandedItems, isMounted])

  return (
    <div
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-background border-r border-border transition-all duration-300 flex flex-col",
        isOpen ? "w-64" : "w-16",
        !isMounted && "invisible" // Hide until mounted to prevent layout shift
      )}
      style={{
        transition: 'width 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        transform: 'translateZ(0)', // Force GPU acceleration
      }}
    >
      <div className="flex h-16 items-center justify-center border-b border-border">
        <Link href="/" passHref>
          <h2
            className={cn(
              "font-bold text-lg text-primary transition-opacity duration-300 cursor-pointer",
              isOpen ? "opacity-100" : "opacity-0",
            )}
          >
            FMS
          </h2>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isExpanded = expandedItems.includes(item.titleKey || item.title)
          const hasChildren = item.children && item.children.length > 0
          const isParentActive =
            hasChildren &&
            item.children.some((child) => pathname === child.href || pathname.startsWith(child.href + "/"))
          const isDirectActive = !hasChildren && (pathname === item.href || pathname.startsWith(item.href + "/"))

          return (
            <div key={item.titleKey || item.title} className="mb-1">
              {!hasChildren ? (
                <Link 
                  href={item.href} 
                  className={cn(
                    "flex items-center w-full h-10 px-3 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                    isDirectActive ? "bg-primary/10 text-primary hover:bg-primary/20" : "text-foreground"
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {isOpen && <span className="ml-3 truncate">{getTranslatedText(item)}</span>}
                </Link>
              ) : (
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start h-10 px-3 text-foreground hover:bg-accent hover:text-accent-foreground",
                    isParentActive && "bg-primary/10 text-primary hover:bg-primary/20"
                  )}
                  onClick={() => toggleExpanded(item.titleKey || item.title)}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {isOpen && (
                    <>
                      <span className="ml-3 truncate">{getTranslatedText(item)}</span>
                      <div className="ml-auto">
                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </div>
                    </>
                  )}
                </Button>
              )}

              {hasChildren && isExpanded && isOpen && (
                <div className="ml-6 mt-1 space-y-1">
                  {item.children.map((child) => {
                    const isChildActive = pathname === child.href || pathname.startsWith(child.href + "/")
                    return (
                      <Link 
                        key={child.href} 
                        href={child.href}
                        className={cn(
                          "flex items-center w-full h-8 px-3 text-sm rounded-md transition-colors",
                          isChildActive 
                            ? "bg-primary/10 text-primary hover:bg-primary/20" 
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        )}
                      >
                        <span className="truncate">{getTranslatedText(child)}</span>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </div>
  )
}
