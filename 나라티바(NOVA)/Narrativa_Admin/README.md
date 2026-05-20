![NARRATIVA-TITLE](https://github.com/user-attachments/assets/97538156-f202-4b48-8543-9bbf835fda0e)

# Narrativa Admin

![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.15-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

## 🗝️ 프로젝트 소개

> 관리자 대시보드는 서비스 운영을 위한 종합 관리 플랫폼입니다.

- 주요 기능

  - Firebase를 이용한 소셜로그인

  - 데이터 분석 및 통계 시각화

  - 관리자 관리 및 권한 제어

  - 회원 관리 및 권한 제어

  - 공지사항 관리
 
  - 프롬프트 및 템플릿 관리

## 🗝️ 설치 가이드

Narrativa_Admin 프로젝트를 로컬 환경에서 클론하고, 빌드 및 실행하는 방법을 설명합니다.

### 1. 프로젝트 클론

```bash
$ git clone https://github.com/AI-X-4-A1-FINAL/Narrativa_Admin.git

$ cd narrativa-admin
```

### 2. 의존성 설치

```bash
$ npm install
```

### 3. 개발 서버 실행

```bash
$ npm run dev

# http://localhost:3000
```

### 알림
```
Narrativa-admin 을 로컬에서 사용하려면 Narrativa-Backend 및 Firebase 환경 변수가 필요합니다.
```

## 🗝️ 브랜치 관리 규칙

### 브랜치 구조

1. **메인 브랜치 (main)**

   - 프로덕션 배포용 안정 브랜치
   - PR을 통해서만 병합 가능

2. **개발 브랜치 (dev)**

   - 개발 중인 기능 통합 브랜치
   - 배포 전 최종 테스트 진행

3. **기능 브랜치 (feat/)**

   - 새로운 기능 개발용
   - 명명규칙: `feat/{기능명}`
   - 예: `feat/social-login`

4. **긴급 수정 브랜치 (hotfix/)**
   - 프로덕션 긴급 버그 수정용
   - 명명규칙: `hotfix/{이슈번호}`
   - 예: `hotfix/critical-bug`

### 브랜치 사용 예시

```bash
# 기능 브랜치 생성
git checkout -b feat/social-login

# 긴급 수정 브랜치 생성
git checkout -b hotfix/critical-bug
```

## 🗝️ 디렉토리 구조

```
NARRATIVA-ADMIN/
├── node_modules/            # 프로젝트 종속성 패키지
├── public/                  # 정적 파일 디렉토리
├── src/                     # 소스 코드
│   ├── assets/             # 이미지, 폰트 등 리소스 파일
│   ├── components/         # 재사용 가능한 컴포넌트
│   │   ├── Dashboard/      # 대시보드 관련 컴포넌트
│   │   ├── UserManagement/ # 회원 관리 관련 컴포넌트
│   │   └── Notice/         # 공지사항 관련 컴포넌트
│   ├── hooks/              # 커스텀 훅
│   ├── pages/              # 페이지 컴포넌트
│   ├── services/           # API 및 유틸리티 함수
│   └── types/              # TypeScript 타입 정의
├── .gitignore              # Git 무시 파일 목록
├── LICENSE                 # 라이센스 정보
├── package.json            # 프로젝트 설정 및 종속성
├── README.md               # 프로젝트 문서
├── tailwind.config.js      # Tailwind CSS 설정
└── tsconfig.json           # TypeScript 설정
```

## 🗝️ 팀 정보

### **Team Member**

<a href="https://github.com/stjoo0925" target="_blank">
  <img src="https://github.com/user-attachments/assets/bb285012-1e08-4bd7-9c63-d6f73c80f713" 
       alt="st" 
       width="200" 
       height="auto" 
       style="max-width: 100%; height: auto;">
</a>

## 🗝️ 문의 및 기여

프로젝트에 대한 문의사항이나 개선 제안은 이슈 탭에 등록해주세요.<br />
기여를 원하시는 분은 Fork & Pull Request를 통해 참여해주시면 감사하겠습니다.

## 🗝️ 라이선스

이 프로젝트는 [MIT 라이선스](LICENSE)를 따릅니다.

<br /><br />
![footer](https://github.com/user-attachments/assets/c30abbd9-8e89-4a4e-8823-33fe0cf843c9)
