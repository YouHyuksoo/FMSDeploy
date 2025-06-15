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
