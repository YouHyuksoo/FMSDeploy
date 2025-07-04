import type { EquipmentSpecification, SpecificationTemplate } from "@/types/equipment-specification"
import { mockEquipment } from "./equipment" // 설비 목록을 가져오기 위함

const now = new Date().toISOString()

// --- Specification Templates (Optional for now, but good for structure) ---
export const mockSpecificationTemplates: SpecificationTemplate[] = [
  {
    id: "TPL-PUMP-001",
    name: "표준 펌프 사양 템플릿",
    equipmentType: "펌프", // This should match an EquipmentType name or ID
    description: "일반적인 원심 펌프에 대한 표준 사양 템플릿입니다.",
    specificationGroups: [
      {
        id: "sg-pump-elec",
        name: "전기 사양",
        category: "electrical",
        order: 1,
        items: [
          { id: "si-pump-volt", name: "전압", value: "380", unit: "V", dataType: "string", required: true, order: 1 },
          { id: "si-pump-phase", name: "상", value: "3", unit: "Phase", dataType: "string", required: true, order: 2 },
          {
            id: "si-pump-power",
            name: "모터 전력",
            value: "",
            unit: "kW",
            dataType: "number",
            required: true,
            order: 3,
            description: "모터의 정격 출력을 kW 단위로 입력",
          },
        ],
      },
      {
        id: "sg-pump-mech",
        name: "기계 사양",
        category: "mechanical",
        order: 2,
        items: [
          { id: "si-pump-flow", name: "유량", value: "", unit: "m³/h", dataType: "number", required: true, order: 1 },
          { id: "si-pump-head", name: "양정", value: "", unit: "m", dataType: "number", required: true, order: 2 },
          {
            id: "si-pump-rpm",
            name: "회전수",
            value: "1750",
            unit: "RPM",
            dataType: "number",
            required: false,
            order: 3,
          },
        ],
      },
      {
        id: "sg-pump-dims",
        name: "물리적 치수",
        category: "physical",
        order: 3,
        items: [
          { id: "si-pump-width", name: "가로", value: "", unit: "mm", dataType: "number", required: false, order: 1 },
          { id: "si-pump-length", name: "세로", value: "", unit: "mm", dataType: "number", required: false, order: 2 },
          { id: "si-pump-height", name: "높이", value: "", unit: "mm", dataType: "number", required: false, order: 3 },
          { id: "si-pump-weight", name: "중량", value: "", unit: "kg", dataType: "number", required: false, order: 4 },
        ],
      },
    ],
    performanceIndicators: [
      {
        id: "pi-pump-eff",
        name: "펌프 효율",
        targetValue: 75,
        unit: "%",
        tolerance: 5,
        category: "efficiency",
        measurementMethod: "유량 및 압력 측정",
        frequency: "monthly",
        order: 1,
      },
    ],
    operatingConditions: [
      {
        id: "oc-pump-temp",
        parameter: "유체 온도",
        minValue: 0,
        maxValue: 80,
        unit: "°C",
        category: "temperature",
        critical: false,
        order: 1,
      },
    ],
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
]

// --- Equipment Specifications (Actual data for specific equipment) ---
export const mockEquipmentSpecifications: EquipmentSpecification[] = [
  {
    id: "SPEC-EQ001-V1",
    equipmentId: mockEquipment[0].id, // 'EQ001' (CNC 선반)
    equipmentCode: mockEquipment[0].code,
    equipmentName: mockEquipment[0].name,
    equipmentType: mockEquipment[0].type,
    version: "1.0",
    status: "active",
    specifications: [
      {
        id: "sg-cnc-main",
        name: "주요 제원",
        category: "technical",
        order: 1,
        items: [
          {
            id: "si-cnc-spindle",
            name: "주축 회전수",
            value: "6000",
            unit: "RPM",
            dataType: "number",
            required: true,
            order: 1,
            description: "최대 주축 회전 속도",
          },
          {
            id: "si-cnc-chuck",
            name: "척 크기",
            value: "8",
            unit: "inch",
            dataType: "string",
            required: true,
            order: 2,
          },
          {
            id: "si-cnc-axes",
            name: "제어 축수",
            value: "3",
            unit: "축",
            dataType: "number",
            required: true,
            order: 3,
          },
          {
            id: "si-cnc-power",
            name: "주축 모터 출력",
            value: "15",
            unit: "kW",
            dataType: "number",
            required: true,
            order: 4,
          },
        ],
      },
      {
        id: "sg-cnc-dims",
        name: "설치 공간",
        category: "physical",
        order: 2,
        items: [
          {
            id: "si-cnc-width",
            name: "기계 폭",
            value: "2500",
            unit: "mm",
            dataType: "number",
            required: true,
            order: 1,
          },
          {
            id: "si-cnc-depth",
            name: "기계 깊이",
            value: "1800",
            unit: "mm",
            dataType: "number",
            required: true,
            order: 2,
          },
          {
            id: "si-cnc-height",
            name: "기계 높이",
            value: "2200",
            unit: "mm",
            dataType: "number",
            required: true,
            order: 3,
          },
          {
            id: "si-cnc-weight",
            name: "기계 중량",
            value: "4500",
            unit: "kg",
            dataType: "number",
            required: true,
            order: 4,
          },
        ],
      },
    ],
    performanceIndicators: [
      {
        id: "pi-cnc-accuracy",
        name: "가공 정밀도",
        targetValue: 0.005,
        actualValue: 0.0045,
        unit: "mm",
        tolerance: 0.001,
        category: "accuracy",
        measurementMethod: "표준 시편 가공 후 측정",
        frequency: "weekly",
        lastMeasured: "2024-05-20T10:00:00Z",
        trend: "improving",
        order: 1,
      },
    ],
    operatingConditions: [
      {
        id: "oc-cnc-temp",
        parameter: "주변 온도",
        minValue: 15,
        maxValue: 30,
        optimalValue: 22,
        unit: "°C",
        category: "environment",
        critical: true,
        description: "정밀 가공을 위한 권장 온도 범위",
        order: 1,
      },
    ],
    safetyStandards: [
      {
        id: "ss-cnc-guard",
        standard: "ISO 16090-1",
        requirement: "작업 영역 안전 가드 설치 및 인터락 정상 작동",
        compliance: "compliant",
        verificationDate: "2024-03-15T00:00:00Z",
        responsible: "김안전",
        order: 1,
      },
    ],
    certifications: [
      {
        id: "cert-cnc-ce",
        name: "CE 인증",
        issuingBody: "TUV Rheinland",
        certificateNumber: "CE-2022-10-12345",
        issueDate: "2022-10-15T00:00:00Z",
        expiryDate: "2027-10-14T00:00:00Z",
        status: "valid",
        order: 1,
      },
    ],
    createdAt: now,
    updatedAt: now,
    createdBy: "admin",
    updatedBy: "admin",
    approvedBy: "manager_user",
    approvedAt: new Date(Date.now() - 86400000 * 5).toISOString(), // 5일 전
  },
  {
    id: "SPEC-EQ002-V1.2",
    equipmentId: mockEquipment[1].id, // 'EQ002' (용접 로봇)
    equipmentCode: mockEquipment[1].code,
    equipmentName: mockEquipment[1].name,
    equipmentType: mockEquipment[1].type,
    version: "1.2",
    status: "active",
    specifications: [
      {
        id: "sg-robot-reach",
        name: "작업 반경 및 하중",
        category: "mechanical",
        order: 1,
        items: [
          {
            id: "si-robot-reach",
            name: "최대 작업 반경",
            value: "1800",
            unit: "mm",
            dataType: "number",
            required: true,
            order: 1,
          },
          {
            id: "si-robot-payload",
            name: "가반 하중",
            value: "10",
            unit: "kg",
            dataType: "number",
            required: true,
            order: 2,
          },
        ],
      },
      {
        id: "sg-robot-power",
        name: "전원 사양",
        category: "electrical",
        order: 2,
        items: [
          {
            id: "si-robot-volt",
            name: "입력 전압",
            value: "440",
            unit: "V",
            dataType: "string",
            required: true,
            order: 1,
          },
          {
            id: "si-robot-capacity",
            name: "소비 전력",
            value: "5",
            unit: "kVA",
            dataType: "number",
            required: false,
            order: 2,
          },
        ],
      },
    ],
    performanceIndicators: [],
    operatingConditions: [],
    safetyStandards: [],
    certifications: [],
    createdAt: now,
    updatedAt: now,
    createdBy: "admin",
    updatedBy: "admin",
  },
]
