![NARRATIVA-TITLE](https://github.com/user-attachments/assets/97538156-f202-4b48-8543-9bbf835fda0e)

# Narrativa Frontend

![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.15-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-8.57.1-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20.8.0-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)

## 🗝️ 프로젝트 소개

`Narrativa_Frontend`는 AI 기반 스토리 생성 플랫폼인 Narrativa 프로젝트의 프론트엔드 모듈입니다.<br />
이 프로젝트는 사용자 입력을 기반으로 스토리를 생성하고 직관적인 UX/UI를 제공합니다.<br />
`React`, `Typescript`, `TailwindCSS` 등을 활용하여 유저친화적인 인터페이스와 효율적인 웹 애플리케이션을 개발합니다. <br />

## 🗝️ 설치 가이드

Narrativa_Frontend 프로젝트를 로컬 환경에서 클론하고, 빌드 및 실행하는 방법을 설명합니다.

### 1. 프로젝트 클론

```bash
git clone https://github.com/AI-X-4-A1-FINAL/Narrativa_Frontend.git
cd narrativa-frontend
```

### 2. 패키지 설치

```bash
npm install
```

### 3. 환경 설정

이 프로젝트는 **환경 변수**를 사용합니다. `.env` 파일은 보안상의 이유로 버전 관리에서 제외되며, 클론한 레포지토리에는 포함되어 있지 않습니다.

### 4. 실행

```bash
npm start
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
Narrativa_Frontend/
├── .github/
│   └── workflows/
├── public/
├── src/
│   └── action/
│   └── api/
│   └── components/
│   └── Contexts/
│   └── user_pages/
└── resources/
```

## 🗝️ 팀 정보

### **Team Member**

<a href="https://github.com/shaneee123" target="_blank">
  <img src="https://github.com/user-attachments/assets/6ec7ec21-a9b1-4ebe-932f-c78064dcabe7" 
       alt="se" 
       width="200" 
       height="auto" 
       style="max-width: 100%; height: auto;">
</a>
<a href="https://github.com/Yesssung" target="_blank">
  <img src="https://github.com/user-attachments/assets/2ce88918-3e99-4dba-97c1-ef54d0cd4d48" 
       alt="ys" 
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
