# FMS (에너지/탄소 관리 시스템)

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## 개요

FMS(에너지/탄소 관리 시스템)는 기업의 에너지 사용과 탄소 배출을 모니터링하고 관리하기 위한 차세대 웹 애플리케이션입니다. 실시간 모니터링, 데이터 분석, 보고서 생성 기능을 통해 지속 가능한 비즈니스 운영을 지원합니다.

## 주요 기능

### 에너지 관리

- 실시간 에너지 사용 모니터링
- 에너지 사용 분석 및 시각화
- 에너지 효율 개선 제안
- 에너지 절감 목표 설정 및 추적

### 탄소 관리

- 탄소 배출 현황 모니터링
- 감축 목표 설정 및 관리
- AI 기반 탄소배출 예측
- ESG 보고서 생성

### TPM 활동 관리

- TPM 활동 추적 및 관리
- 유지보수 일정 관리
- 장비 효율성 모니터링

## AI & 사용자 협업 규칙

1. **다국어/국제화**

   - 모든 UI/알림/토스트 메시지는 반드시 다국어(i18n)로 처리한다.
   - 번역 키가 없으면 AI가 직접 모든 언어(ko, en, zh, ja)에 추가한다.
   - 템플릿 변수 치환이 필요한 경우, 번역 함수(t)가 이를 지원하도록 개선한다.

2. **코드 품질 및 일관성**

   - 임시방편(quick fix)이 아닌, 정상적이고 구조적으로 올바른 방법으로 문제를 해결한다.
   - 타입 오류, linter 오류 등은 무시하지 않고 반드시 근본적으로 해결한다.
   - 타입스크립트 타입 불일치, null/undefined 혼용 등은 타입 정의에 맞게 수정한다.
   - 기존 코드 스타일, 네이밍, 구조를 최대한 존중한다.

3. **사용자 경험**

   - 언어 변경, 새로고침, 라우팅 등 모든 상황에서 언어 상태가 일관되게 유지되어야 한다.
   - 번역이 깜빡이거나 fallback되는 현상은 허용하지 않는다.

4. **커뮤니케이션 및 역할 분담**

   - AI가 모든 반복적/기계적 작업(번역 키 추가, 코드 일괄 치환 등)을 직접 수행한다.
   - 사용자는 "이 키도 추가해", "다국어 안 됨" 등 요청만 하면 되고, 직접 파일을 수정할 필요가 없다.
   - AI는 사용자의 요청을 기다리지 않고, 필요한 경우 선제적으로 다국어 키/코드 개선을 제안하고 적용한다.

5. **문서화 및 명확성**

   - 번역 키, 코드 변경, 규칙 등은 명확하게 문서화/설명한다.
   - 추가로 필요한 번역/규칙/코드가 있으면 언제든 요청만 하면 AI가 바로 반영한다.

6. **기타**
   - Windows 환경, Next.js App Router, Tailwind CSS 등 프로젝트 기술 스택을 항상 준수한다.
   - 기존 화면(예: /app/equipment, /app/energy 등)과 UI/UX 일관성을 유지한다.

## 기술 스택

- **프론트엔드**: Next.js 13+, React 18+, TypeScript
- **스타일링**: Tailwind CSS, shadcn/ui
- **차트 라이브러리**: Recharts
- **아이콘**: Lucide React
- **상태 관리**: React Context API

## 시작하기

### 전제 조건

- Node.js 18.0.0 이상
- npm 또는 yarn 패키지 매니저

### 설치

1. 저장소 클론

   ```bash
   git clone [저장소 URL]
   cd FMS
   ```

2. 의존성 설치

   ```bash
   npm install
   # 또는
   yarn install
   ```

3. 개발 서버 실행

   ```bash
   npm run dev
   # 또는
   yarn dev
   ```

4. 브라우저에서 확인
   ```
   http://localhost:3000
   ```

## 프로젝트 구조

```
FMS/
├── app/                    # 앱 라우트
│   ├── api/                # API 라우트
│   ├── carbon/             # 탄소 관리 관련 페이지
│   ├── energy/             # 에너지 관리 관련 페이지
│   └── tpm/                # TPM 활동 관리 관련 페이지
├── components/             # 재사용 가능한 컴포넌트
│   ├── layout/             # 레이아웃 컴포넌트
│   └── ui/                 # UI 컴포넌트
├── lib/                    # 유틸리티 함수 및 상수
├── public/                 # 정적 파일
└── styles/                 # 전역 스타일
```

## 라이선스

이 프로젝트는 [MIT 라이선스](LICENSE)를 따릅니다.
