// KPI 메트릭 타입 정의
export interface KpiMetrics {
  id: string
  equipmentId: string
  equipmentName: string
  mtbf: number // Mean Time Between Failures (hours)
  mttr: number // Mean Time To Repair (hours)
  availability: number // 가동률 (%)
  oee: number // Overall Equipment Effectiveness (%)
  healthScore: number // 건강점수 (0-100)
  healthGrade: "A" | "B" | "C" | "D" | "F"
  riskLevel: "low" | "medium" | "high" | "critical"
  trend: "improving" | "stable" | "declining"
  lastUpdated: string
}

// 설비 건강점수 상세
export interface EquipmentHealth {
  equipmentId: string
  equipmentName: string
  location: string
  healthScore: number
  healthGrade: "A" | "B" | "C" | "D" | "F"
  riskLevel: "low" | "medium" | "high" | "critical"
  lastMaintenance: string
  nextMaintenance: string
  issues: string[]
}

// KPI 트렌드 분석
export interface KpiTrend {
  date: string
  mtbf: number
  mttr: number
  availability: number
  oee: number
  healthScore: number
}

// KPI 벤치마크
export interface KpiBenchmark {
  metric: string
  industry: string
  worldClass: number
  average: number
  poor: number
  unit: string
}

// KPI 목표 설정
export interface KpiTarget {
  id: string
  equipmentId?: string
  equipmentType?: string
  metric: string
  targetValue: number
  unit: string
  period: "monthly" | "quarterly" | "yearly"
  year: number
  quarter?: number
  month?: number
  status: "active" | "achieved" | "missed" | "inactive"
  createdBy: string
  createdAt: string
  updatedAt: string
}

// KPI 알림 설정
export interface KpiAlert {
  id: string
  metric: string
  equipmentId?: string
  condition: "above" | "below" | "equal"
  threshold: number
  severity: "info" | "warning" | "critical"
  isActive: boolean
  recipients: string[]
  lastTriggered?: string
  createdAt: string
}

export const healthGradeLabels: Record<string, string> = {
  A: "우수",
  B: "양호",
  C: "보통",
  D: "주의",
  F: "위험",
}

export const riskLevelLabels: Record<string, string> = {
  low: "낮음",
  medium: "보통",
  high: "높음",
  critical: "위험",
}

export const trendLabels: Record<string, string> = {
  improving: "개선",
  stable: "안정",
  declining: "악화",
}

export const kpiMetricLabels: Record<string, string> = {
  mtbf: "MTBF (평균 고장 간격)",
  mttr: "MTTR (평균 수리 시간)",
  availability: "가동률",
  reliability: "신뢰도",
  maintainability: "보전성",
  oee: "종합설비효율",
  healthScore: "건강점수",
}

export const kpiUnitLabels: Record<string, string> = {
  mtbf: "시간",
  mttr: "시간",
  availability: "%",
  reliability: "%",
  maintainability: "%",
  oee: "%",
  healthScore: "점",
}
