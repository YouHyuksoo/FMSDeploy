"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { SupportedLanguage, LanguageOption, TranslationData } from "@/types/language"

interface LanguageContextType {
  currentLanguage: SupportedLanguage
  setLanguage: (language: SupportedLanguage) => void
  t: (key: string, namespace?: string, fallback?: string) => string
  languages: LanguageOption[]
  isLoading: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// 지원 언어 목록
export const supportedLanguages: LanguageOption[] = [
  { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷" },
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
  { code: "zh", name: "Chinese", nativeName: "中文", flag: "🇨🇳" },
]

// Mock 번역 데이터
const mockTranslations: TranslationData = {
  menu: {
    // 에너지 관리
    'energy.title': { ko: '에너지관리', en: 'Energy Management', ja: 'エネルギー管理', zh: '能源管理' },
    'energy.monitoring': { ko: '에너지 모니터링', en: 'Energy Monitoring', ja: 'エネルギー監視', zh: '能源监控' },
    'energy.usage_analysis': { ko: '에너지 사용 분석', en: 'Energy Usage Analysis', ja: 'エネルギー使用分析', zh: '能源使用分析' },
    'energy.savings_dashboard': { ko: '에너지 절감 대시보드', en: 'Energy Savings Dashboard', ja: '省エネダッシュボード', zh: '节能仪表板' },
    'energy.carbon_tracking': { ko: '탄소 배출 추적', en: 'Carbon Emission Tracking', ja: '炭素排出量追跡', zh: '碳排放追踪' },
    
    // 설비 관리
    'equipment.title': { ko: '설비정보관리', en: 'Equipment Management', ja: '設備管理', zh: '设备管理' },
    'equipment.overview': { ko: '설비통합조회', en: 'Equipment Overview', ja: '設備一覧', zh: '设备总览' },
    'equipment.master_management': { ko: '설비마스터관리', en: 'Equipment Master', ja: '設備マスター管理', zh: '设备主数据管理' },
    'equipment.registration_management': { ko: '설비등록관리', en: 'Equipment Registration', ja: '設備登録管理', zh: '设备注册管理' },
    'equipment.bom_management': { ko: '설비BOM관리', en: 'Equipment BOM', ja: '設備BOM管理', zh: '设备BOM管理' },
    
    // 보전 작업 관리
    'maintenance.request_management': { ko: '작업요청등록', en: 'Work Request', ja: '作業依頼登録', zh: '工作请求' },
    'maintenance.plan_management': { ko: '작업계획배정', en: 'Work Plan', ja: '作業計画割当', zh: '工作计划' },
    'maintenance.complete_management': { ko: '작업완료처리', en: 'Work Completion', ja: '作業完了処理', zh: '工作完成' },
  },
  common: {
    save: { ko: "저장", en: "Save", ja: "保存", zh: "保存" },
    cancel: { ko: "취소", en: "Cancel", ja: "キャンセル", zh: "取消" },
    edit: { ko: "수정", en: "Edit", ja: "編集", zh: "编辑" },
    delete: { ko: "삭제", en: "Delete", ja: "削除", zh: "删除" },
    add: { ko: "추가", en: "Add", ja: "追加", zh: "添加" },
    view: { ko: "보기", en: "View", ja: "表示", zh: "查看" },
    search: { ko: "검색", en: "Search", ja: "検索", zh: "搜索" },
    loading: { ko: "로딩 중...", en: "Loading...", ja: "読み込み中...", zh: "加载中..." },
    success: { ko: "성공", en: "Success", ja: "成功", zh: "成功" },
    error: { ko: "오류", en: "Error", ja: "エラー", zh: "错误" },
    confirm: { ko: "확인", en: "Confirm", ja: "確認", zh: "确认" },
    close: { ko: "닫기", en: "Close", ja: "閉じる", zh: "关闭" },
    reset: { ko: "초기화", en: "Reset", ja: "リセット", zh: "重置" },
    export: { ko: "내보내기", en: "Export", ja: "エクスポート", zh: "导出" },
    import: { ko: "가져오기", en: "Import", ja: "インポート", zh: "导入" },
    active: { ko: "활성", en: "Active", ja: "アクティブ", zh: "活跃" },
    inactive: { ko: "비활성", en: "Inactive", ja: "非アクティブ", zh: "非活跃" },
    status: { ko: "상태", en: "Status", ja: "ステータス", zh: "状态" },
    name: { ko: "이름", en: "Name", ja: "名前", zh: "名称" },
    description: { ko: "설명", en: "Description", ja: "説明", zh: "描述" },
    created_at: { ko: "생성일시", en: "Created At", ja: "作成日時", zh: "创建时间" },
    updated_at: { ko: "수정일시", en: "Updated At", ja: "更新日時", zh: "更新时间" },
  },
  header: {
    title: {
      ko: "FMS - 설비관리시스템",
      en: "FMS - Facility Management System",
      ja: "FMS - 設備管理システム",
      zh: "FMS - 设备管理系统",
    },
    profile: { ko: "프로필", en: "Profile", ja: "プロフィール", zh: "个人资料" },
    settings: { ko: "설정", en: "Settings", ja: "設定", zh: "设置" },
    logout: { ko: "로그아웃", en: "Logout", ja: "ログアウト", zh: "登出" },
    notifications: { ko: "알림", en: "Notifications", ja: "通知", zh: "通知" },
    language: { ko: "언어", en: "Language", ja: "言語", zh: "语言" },
    theme: { ko: "테마 변경", en: "Change Theme", ja: "テーマ変更", zh: "更改主题" },
  },
  sidebar: {
    dashboard: { ko: "대시보드", en: "Dashboard", ja: "ダッシュボード", zh: "仪表板" },
    equipment: { ko: "설비정보관리", en: "Equipment Management", ja: "設備情報管理", zh: "设备信息管理" },
    materials: { ko: "보전자재관리", en: "Materials Management", ja: "保全資材管理", zh: "保全材料管理" },
    inspection: { ko: "점검관리", en: "Inspection Management", ja: "点検管理", zh: "检查管理" },
    maintenance: { ko: "보전작업관리", en: "Maintenance Management", ja: "保全作業管理", zh: "保全作业管理" },
    tpm: { ko: "TPM활동관리", en: "TPM Activity Management", ja: "TPM活動管理", zh: "TPM活动管理" },
    failure: { ko: "고장관리", en: "Failure Management", ja: "故障管理", zh: "故障管理" },
    preventive: { ko: "예방정비", en: "Preventive Maintenance", ja: "予防保全", zh: "预防维护" },
    metering: { ko: "검침/검교정", en: "Metering/Calibration", ja: "検針/検校正", zh: "抄表/校准" },
    prediction: { ko: "예지보전(AI)", en: "Predictive Maintenance (AI)", ja: "予知保全(AI)", zh: "预测维护(AI)" },
    kpi: { ko: "KPI분석", en: "KPI Analysis", ja: "KPI分析", zh: "KPI分析" },
    location: {
      ko: "위치기반모니터링",
      en: "Location-based Monitoring",
      ja: "位置ベースモニタリング",
      zh: "基于位置的监控",
    },
    integration: { ko: "외부연동", en: "External Integration", ja: "外部連携", zh: "外部集成" },
    mobile: { ko: "모바일QR점검", en: "Mobile QR Inspection", ja: "モバイルQR点検", zh: "移动QR检查" },
    system: { ko: "시스템관리", en: "System Management", ja: "システム管理", zh: "系统管理" },
    maintenanceTemplate: {
      ko: "보전템플릿",
      en: "Maintenance Templates",
      ja: "保全テンプレート",
      zh: "维护模板",
    },
  },
  dashboard: {
    title: { ko: "대시보드", en: "Dashboard", ja: "ダッシュボード", zh: "仪表板" },
    subtitle: {
      ko: "설비 관리 현황을 한눈에 확인하세요",
      en: "Check equipment management status at a glance",
      ja: "設備管理状況を一目で確認",
      zh: "一目了然地查看设备管理状态",
    },
    total_equipment: { ko: "총 설비 수", en: "Total Equipment", ja: "総設備数", zh: "设备总数" },
    failed_equipment: { ko: "고장 설비", en: "Failed Equipment", ja: "故障設備", zh: "故障设备" },
    inspection_rate: { ko: "점검 완료율", en: "Inspection Completion Rate", ja: "点検完了率", zh: "检查完成率" },
    pending_work: { ko: "대기 작업", en: "Pending Work", ja: "待機作業", zh: "待处理工作" },
    recent_failures: { ko: "최근 고장 이력", en: "Recent Failure History", ja: "最近の故障履歴", zh: "最近故障历史" },
    recent_failures_desc: {
      ko: "지난 7일간 발생한 주요 고장 현황",
      en: "Major failures in the last 7 days",
      ja: "過去7日間の主要故障状況",
      zh: "过去7天的主要故障情况",
    },
    todays_inspection: {
      ko: "금일 점검 예정",
      en: "Today's Scheduled Inspections",
      ja: "本日点検予定",
      zh: "今日计划检查",
    },
    todays_inspection_desc: {
      ko: "오늘 수행해야 할 점검 작업",
      en: "Inspection tasks to be performed today",
      ja: "今日実施すべき点検作業",
      zh: "今天要执行的检查任务",
    },
  },
  energy: {
    title: { ko: "에너지 관리", en: "Energy Management", ja: "エネルギー管理", zh: "能源管理" },
    monitoring: { ko: "에너지 모니터링", en: "Energy Monitoring", ja: "エネルギー監視", zh: "能源监控" },
    usage_analysis: { ko: "에너지 사용 분석", en: "Energy Usage Analysis", ja: "エネルギー使用分析", zh: "能源使用分析" },
    savings_dashboard: { ko: "에너지 절감 대시보드", en: "Energy Savings Dashboard", ja: "省エネダッシュボード", zh: "节能仪表板" },
    carbon_tracking: { ko: "탄소 배출 추적", en: "Carbon Emission Tracking", ja: "炭素排出量追跡", zh: "碳排放追踪" },
  },
  organization: {
    title: { ko: "조직관리", en: "Organization Management", ja: "組織管理", zh: "组织管理" },
    subtitle: {
      ko: "회사, 부서, 팀의 계층구조를 관리합니다",
      en: "Manage hierarchical structure of companies, departments, and teams",
      ja: "会社、部署、チームの階層構造を管理",
      zh: "管理公司、部门、团队的层次结构",
    },
    add_organization: { ko: "조직 추가", en: "Add Organization", ja: "組織追加", zh: "添加组织" },
    organization_code: { ko: "조직코드", en: "Organization Code", ja: "組織コード", zh: "组织代码" },
    organization_name: { ko: "조직명", en: "Organization Name", ja: "組織名", zh: "组织名称" },
    organization_type: { ko: "유형", en: "Type", ja: "タイプ", zh: "类型" },
    parent_organization: { ko: "상위조직", en: "Parent Organization", ja: "上位組織", zh: "上级组织" },
    sort_order: { ko: "순서", en: "Order", ja: "順序", zh: "顺序" },
    company: { ko: "회사", en: "Company", ja: "会社", zh: "公司" },
    department: { ko: "부서", en: "Department", ja: "部署", zh: "部门" },
    team: { ko: "팀", en: "Team", ja: "チーム", zh: "团队" },
  },
  user: {
    title: { ko: "사용자 관리", en: "User Management", ja: "ユーザー管理", zh: "用户管理" },
    subtitle: {
      ko: "시스템 사용자의 계정과 권한을 관리합니다",
      en: "Manage user accounts and permissions",
      ja: "システムユーザーのアカウントと権限を管理",
      zh: "管理系统用户的账户和权限",
    },
    add_user: { ko: "사용자 추가", en: "Add User", ja: "ユーザー追加", zh: "添加用户" },
    user_id: { ko: "사용자ID", en: "User ID", ja: "ユーザーID", zh: "用户ID" },
    email: { ko: "이메일", en: "Email", ja: "メール", zh: "邮箱" },
    level: { ko: "레벨", en: "Level", ja: "レベル", zh: "级别" },
    admin: { ko: "관리자", en: "Administrator", ja: "管理者", zh: "管理员" },
    manager: { ko: "매니저", en: "Manager", ja: "マネージャー", zh: "经理" },
    user: { ko: "사용자", en: "User", ja: "ユーザー", zh: "用户" },
    viewer: { ko: "조회자", en: "Viewer", ja: "閲覧者", zh: "查看者" },
    last_login: { ko: "최근 로그인", en: "Last Login", ja: "最終ログイン", zh: "最近登录" },
  },
  code: {
    title: { ko: "기초코드 관리", en: "Basic Code Management", ja: "基礎コード管理", zh: "基础代码管理" },
    subtitle: {
      ko: "시스템에서 사용하는 코드를 그룹별로 관리합니다",
      en: "Manage codes used in the system by groups",
      ja: "システムで使用するコードをグループ別に管理",
      zh: "按组管理系统中使用的代码",
    },
    code_groups: { ko: "코드 그룹", en: "Code Groups", ja: "コードグループ", zh: "代码组" },
    code_list: { ko: "코드 목록", en: "Code List", ja: "コードリスト", zh: "代码列表" },
    group_code: { ko: "그룹코드", en: "Group Code", ja: "グループコード", zh: "组代码" },
    group_name: { ko: "그룹명", en: "Group Name", ja: "グループ名", zh: "组名称" },
    code_count: { ko: "코드 수", en: "Code Count", ja: "コード数", zh: "代码数量" },
    code: { ko: "코드", en: "Code", ja: "コード", zh: "代码" },
    code_name: { ko: "코드명", en: "Code Name", ja: "コード名", zh: "代码名称" },
    value: { ko: "값", en: "Value", ja: "値", zh: "值" },
    parent_code: { ko: "상위코드", en: "Parent Code", ja: "上位コード", zh: "上级代码" },
  },
  theme: {
    title: { ko: "테마 설정", en: "Theme Settings", ja: "テーマ設定", zh: "主题设置" },
    subtitle: {
      ko: "시스템의 외관과 색상을 설정하세요",
      en: "Set the appearance and colors of the system",
      ja: "システムの外観と色を設定",
      zh: "设置系统的外观和颜色",
    },
    display_mode: { ko: "화면 모드", en: "Display Mode", ja: "画面モード", zh: "显示模式" },
    color_theme: { ko: "색상 테마", en: "Color Theme", ja: "カラーテーマ", zh: "颜色主题" },
    light: { ko: "라이트", en: "Light", ja: "ライト", zh: "浅色" },
    dark: { ko: "다크", en: "Dark", ja: "ダーク", zh: "深色" },
    system: { ko: "시스템", en: "System", ja: "システム", zh: "系统" },
    preview: { ko: "미리보기", en: "Preview", ja: "プレビュー", zh: "预览" },
    apply_theme: {
      ko: "테마 적용 및 새로고침",
      en: "Apply Theme and Refresh",
      ja: "テーマ適用と更新",
      zh: "应用主题并刷新",
    },
  },
  equipment: {
    title: { ko: "설비 관리", en: "Equipment Management", ja: "設備管理", zh: "设备管理" },
    subtitle: {
      ko: "생산 설비의 정보와 상태를 관리합니다",
      en: "Manage production equipment information and status",
      ja: "生産設備の情報と状態を管理",
      zh: "管理生产设备信息和状态",
    },
    add_equipment: { ko: "설비 추가", en: "Add Equipment", ja: "設備追加", zh: "添加设备" },
    equipment_code: { ko: "설비코드", en: "Equipment Code", ja: "設備コード", zh: "设备代码" },
    equipment_name: { ko: "설비명", en: "Equipment Name", ja: "設備名", zh: "设备名称" },
    equipment_type: { ko: "설비유형", en: "Equipment Type", ja: "設備タイプ", zh: "设备类型" },
    model: { ko: "모델", en: "Model", ja: "モデル", zh: "型号" },
    manufacturer: { ko: "제조사", en: "Manufacturer", ja: "メーカー", zh: "制造商" },
    serial_number: { ko: "시리얼번호", en: "Serial Number", ja: "シリアル番号", zh: "序列号" },
    location: { ko: "위치", en: "Location", ja: "場所", zh: "位置" },
    department: { ko: "담당부서", en: "Department", ja: "担当部署", zh: "负责部门" },
    install_date: { ko: "설치일자", en: "Install Date", ja: "設置日", zh: "安装日期" },
    warranty_end: { ko: "보증만료일", en: "Warranty End", ja: "保証期限", zh: "保修到期" },
    last_maintenance: { ko: "최근정비일", en: "Last Maintenance", ja: "最終保全日", zh: "最近维护" },
    next_maintenance: { ko: "다음정비일", en: "Next Maintenance", ja: "次回保全日", zh: "下次维护" },
    specifications: { ko: "사양", en: "Specifications", ja: "仕様", zh: "规格" },
    priority: { ko: "우선순위", en: "Priority", ja: "優先度", zh: "优先级" },

    // 상태
    status_running: { ko: "가동중", en: "Running", ja: "稼働中", zh: "运行中" },
    status_stopped: { ko: "정지", en: "Stopped", ja: "停止", zh: "停止" },
    status_maintenance: { ko: "정비중", en: "Maintenance", ja: "保全中", zh: "维护中" },
    status_failure: { ko: "고장", en: "Failure", ja: "故障", zh: "故障" },

    // 우선순위
    priority_critical: { ko: "긴급", en: "Critical", ja: "緊急", zh: "紧急" },
    priority_high: { ko: "높음", en: "High", ja: "高", zh: "高" },
    priority_normal: { ko: "보통", en: "Normal", ja: "通常", zh: "普通" },
    priority_low: { ko: "낮음", en: "Low", ja: "低", zh: "低" },

    // 설비 유형
    type_compressor: { ko: "압축기", en: "Compressor", ja: "コンプレッサー", zh: "压缩机" },
    type_conveyor: { ko: "컨베이어", en: "Conveyor", ja: "コンベア", zh: "输送机" },
    type_pump: { ko: "펌프", en: "Pump", ja: "ポンプ", zh: "泵" },
    type_robot: { ko: "로봇", en: "Robot", ja: "ロボット", zh: "机器人" },
    type_crane: { ko: "크레인", en: "Crane", ja: "クレーン", zh: "起重机" },

    // 액션
    view_details: { ko: "상세보기", en: "View Details", ja: "詳細表示", zh: "查看详情" },
    maintenance_history: { ko: "정비이력", en: "Maintenance History", ja: "保全履歴", zh: "维护历史" },
    schedule_maintenance: { ko: "정비예약", en: "Schedule Maintenance", ja: "保全予約", zh: "预约维护" },
    update_status: { ko: "상태변경", en: "Update Status", ja: "状態変更", zh: "更新状态" },

    // 필터
    filter_by_type: { ko: "유형별 필터", en: "Filter by Type", ja: "タイプ別フィルター", zh: "按类型筛选" },
    filter_by_status: { ko: "상태별 필터", en: "Filter by Status", ja: "状態別フィルター", zh: "按状态筛选" },
    filter_by_priority: {
      ko: "우선순위별 필터",
      en: "Filter by Priority",
      ja: "優先度別フィルター",
      zh: "按优先级筛选",
    },

    // 메시지
    equipment_added: {
      ko: "설비가 추가되었습니다",
      en: "Equipment has been added",
      ja: "設備が追加されました",
      zh: "设备已添加",
    },
    equipment_updated: {
      ko: "설비가 수정되었습니다",
      en: "Equipment has been updated",
      ja: "設備が更新되었습니다",
      zh: "设备已更新",
    },
    equipment_deleted: {
      ko: "설비가 삭제되었습니다",
      en: "Equipment has been deleted",
      ja: "設備が削除されました",
      zh: "设备已删除",
    },
    confirm_delete: {
      ko: "이 설비를 삭제하시겠습니까?",
      en: "Are you sure you want to delete this equipment?",
      ja: "この設備を削除しますか？",
      zh: "确定要删除此设备吗？",
    },

    // 폼 라벨
    basic_info: { ko: "기본 정보", en: "Basic Information", ja: "基本情報", zh: "基本信息" },
    technical_info: { ko: "기술 정보", en: "Technical Information", ja: "技術情報", zh: "技术信息" },
    maintenance_info: { ko: "정비 정보", en: "Maintenance Information", ja: "保全情報", zh: "维护信息" },
    additional_info: { ko: "추가 정보", en: "Additional Information", ja: "追加情報", zh: "附加信息" },
  },
  language: {
    // 메뉴 및 제목
    language_management: { ko: "다국어 관리", en: "Language Management", ja: "多言語管理", zh: "多语言管理" },
    language_management_desc: {
      ko: "시스템의 다국어 지원을 관리합니다",
      en: "Manage multilingual support for the system",
      ja: "システムの多言語サポートを管理",
      zh: "管理系统的多语言支持",
    },
    translation_dashboard: {
      ko: "번역 대시보드",
      en: "Translation Dashboard",
      ja: "翻訳ダッシュボード",
      zh: "翻译仪表板",
    },
    translation_dashboard_desc: {
      ko: "전체 번역 진행 상황을 확인합니다",
      en: "Check overall translation progress",
      ja: "全体の翻訳進捗を確認",
      zh: "查看整体翻译进度",
    },

    // 번역 키 관리
    translation_key_management: {
      ko: "번역 키 관리",
      en: "Translation Key Management",
      ja: "翻訳キー管理",
      zh: "翻译键管理",
    },
    translation_key_management_desc: {
      ko: "시스템에서 사용하는 번역 키를 관리합니다",
      en: "Manage translation keys used in the system",
      ja: "システムで使用する翻訳キーを管理",
      zh: "管理系统中使用的翻译键",
    },
    add_translation_key: { ko: "번역 키 추가", en: "Add Translation Key", ja: "翻訳キー追加", zh: "添加翻译键" },
    translation_key: { ko: "번역 키", en: "Translation Key", ja: "翻訳キー", zh: "翻译键" },
    namespace: { ko: "네임스페이스", en: "Namespace", ja: "ネームスペース", zh: "命名空间" },

    // 번역 관리
    translation_management: { ko: "번역 관리", en: "Translation Management", ja: "翻訳管理", zh: "翻译管理" },
    translation_management_desc: {
      ko: "언어별 번역 텍스트를 관리하고 승인합니다",
      en: "Manage and approve translation texts by language",
      ja: "言語別の翻訳テキストを管理・承認",
      zh: "按语言管理和批准翻译文本",
    },
    translation_text: { ko: "번역 텍스트", en: "Translation Text", ja: "翻訳テキスト", zh: "翻译文本" },
    translation_status: { ko: "번역 상태", en: "Translation Status", ja: "翻訳状態", zh: "翻译状态" },

    // 상태
    approved: { ko: "승인됨", en: "Approved", ja: "承認済み", zh: "已批准" },
    pending: { ko: "대기중", en: "Pending", ja: "保留中", zh: "待处理" },
    missing: { ko: "누락", en: "Missing", ja: "欠落", zh: "缺失" },
    completed: { ko: "완료", en: "Completed", ja: "完了", zh: "已完成" },

    // 액션
    approve: { ko: "승인", en: "Approve", ja: "承認", zh: "批准" },
    reject: { ko: "거부", en: "Reject", ja: "拒否", zh: "拒绝" },
    import_translations: { ko: "번역 가져오기", en: "Import Translations", ja: "翻訳インポート", zh: "导入翻译" },
    export_translations: { ko: "번역 내보내기", en: "Export Translations", ja: "翻訳エクスポート", zh: "导出翻译" },

    // 기타
    overall_progress: { ko: "전체 진행률", en: "Overall Progress", ja: "全体進捗", zh: "整体进度" },
    language_progress: { ko: "언어별 진행률", en: "Language Progress", ja: "言語別進捗", zh: "语言进度" },
    namespace_progress: {
      ko: "네임스페이스별 진행률",
      en: "Namespace Progress",
      ja: "ネームスペース別進捗",
      zh: "命名空间进度",
    },
    total_keys: { ko: "총 키 수", en: "Total Keys", ja: "総キー数", zh: "总键数" },
    namespaces: { ko: "네임스페이스", en: "Namespaces", ja: "ネームスペース", zh: "命名空间" },
    completed_translations: { ko: "완료된 번역", en: "Completed Translations", ja: "完了した翻訳", zh: "已完成翻译" },
    pending_translations: { ko: "대기 중인 번역", en: "Pending Translations", ja: "保留中の翻訳", zh: "待处理翻译" },
    translations: { ko: "번역", en: "Translations", ja: "翻訳", zh: "翻译" },
    translation_keys: { ko: "번역 키", en: "Translation Keys", ja: "翻訳キー", zh: "翻译键" },
    keys: { ko: "키", en: "Keys", ja: "キー", zh: "键" },
    no_translation: {
      ko: "번역이 없습니다. 클릭하여 추가하세요.",
      en: "No translation. Click to add.",
      ja: "翻訳がありません。クリックして追加してください。",
      zh: "没有翻译。点击添加。",
    },
    enter_translation: {
      ko: "번역을 입력하세요...",
      en: "Enter translation...",
      ja: "翻訳を入力してください...",
      zh: "输入翻译...",
    },
    search_keys: {
      ko: "번역 키 검색...",
      en: "Search translation keys...",
      ja: "翻訳キーを検索...",
      zh: "搜索翻译键...",
    },
    all_namespaces: { ko: "모든 네임스페이스", en: "All Namespaces", ja: "すべてのネームスペース", zh: "所有命名空间" },
    last_updated: { ko: "최종 수정", en: "Last Updated", ja: "最終更新", zh: "最后更新" },
  },
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>("ko")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 저장된 언어 설정 불러오기
    const savedLanguage = localStorage.getItem("fms-language") as SupportedLanguage
    if (savedLanguage && supportedLanguages.find((lang) => lang.code === savedLanguage)) {
      setCurrentLanguage(savedLanguage)
    } else {
      // 브라우저 언어 감지
      const browserLanguage = navigator.language.split("-")[0] as SupportedLanguage
      if (supportedLanguages.find((lang) => lang.code === browserLanguage)) {
        setCurrentLanguage(browserLanguage)
      }
    }
    setIsLoading(false)
  }, [])

  const setLanguage = (language: SupportedLanguage) => {
    setCurrentLanguage(language)
    localStorage.setItem("fms-language", language)
  }

  const t = (key: string, namespace = "common", fallback?: string): string => {
    const translation = mockTranslations[namespace]?.[key]?.[currentLanguage]

    if (translation) {
      return translation
    }

    // 한국어로 fallback
    const koreanTranslation = mockTranslations[namespace]?.[key]?.ko
    if (koreanTranslation) {
      return koreanTranslation
    }

    // 사용자 제공 fallback
    if (fallback) {
      return fallback
    }

    // 키 자체를 반환 (개발 중 누락된 번역 확인용)
    return `[${namespace}.${key}]`
  }

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        t,
        languages: supportedLanguages,
        isLoading,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

// 번역 훅 (더 간편한 사용을 위해)
export const useTranslation = (namespace: string = "common") => {
  const { t, currentLanguage } = useLanguage()

  return {
    t: (key: string, fallback?: string) => t(key, namespace, fallback),
    language: currentLanguage,
  }
}
