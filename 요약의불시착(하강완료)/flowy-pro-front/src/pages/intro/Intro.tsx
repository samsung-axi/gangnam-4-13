import React from 'react';
import {
  IntroContainer,
  HeroSection,
  HeroTitle,
  HeroSubtitle,
  HeroDescription,
  FeatureSection,
  SectionTitle,
  FeatureGrid,
  FeatureCard,
  FeatureIcon,
  FeatureTitle,
  FeatureDescription,
  ProcessSection,
  ProcessStep,
  StepNumber,
  StepTitle,
  StepDescription,
  CTASection,
  CTATitle,
  CTADescription,
  CTAButton,
  DecorativeElement,
} from './Intro.styles';
import { useNavigate } from 'react-router-dom';
import {
  Mic,
  Users,
  Calendar as CalendarIcon,
  Search,
  Mail,
  CheckSquare,
  TrendingUp,
  PieChart,
  Download,
} from 'lucide-react';

const Intro: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Mic size={32} />,
      title: 'STT + 회의 요약',
      description:
        'AI 음성 인식으로 회의를 전사하고\n핵심 내용을 자동으로 요약합니다.',
    },
    {
      icon: <CheckSquare size={32} />,
      title: '할 일 자동 추출',
      description: '회의 내용을 분석하여 업무를\n자동으로 추출하고 할당합니다.',
    },
    {
      icon: <TrendingUp size={32} />,
      title: '회의 피드백 제공',
      description:
        '회의 효율성을 분석하고 개선점을\n제안하여 생산성을 높입니다.',
    },
    {
      icon: <Search size={32} />,
      title: '문서 양식 추천',
      description:
        '회의 내용을 기반으로 웹 및 DB 서칭을 통해 최적의 문서 템플릿을 추천합니다.',
    },
    {
      icon: <Mail size={32} />,
      title: '요약 메일 발송',
      description:
        '회의 요약과 할 일, 피드백 내용을\n참석자들에게 자동으로 메일 발송합니다.',
    },
    {
      icon: <Users size={32} />,
      title: '프로젝트별 회의 관리',
      description:
        '프로젝트별로 회의를 체계적으로 관리하고\n진행 상황을 한눈에 파악합니다.',
    },
    {
      icon: <Download size={32} />,
      title: 'PDF 다운로드',
      description:
        '회의록과 분석 결과를 PDF 형태로\n저장하고 다운로드할 수 있습니다.',
    },
    {
      icon: <PieChart size={32} />,
      title: '회의 현황 대시보드',
      description:
        '회의 통계와 효율성 지표를 시각화하여\n트렌드를 분석하고 개선합니다.',
    },
    {
      icon: <CalendarIcon size={32} />,
      title: '개인 일정 & 할 일 관리',
      description:
        '캘린더 연동으로 개인 회의 일정과\n할 일을 통합하여 관리합니다.',
    },
  ];

  const processSteps = [
    {
      title: '프로젝트 생성',
      description: '새 프로젝트를 생성하고\n참여자들을 초대합니다.',
    },
    {
      title: '회의분석 요청',
      description:
        '회의 정보를 입력하고 음성 파일을\n업로드/녹음하여 AI 분석을 시작합니다.',
    },
    {
      title: '분석결과 조회',
      description:
        'AI가 분석한 회의 결과를 조회하고\n할 일과 추천 문서, 피드백을 확인합니다.',
    },
    {
      title: '캘린더',
      description: '개인의 회의 일정과 할 일을 \n통합하여 관리합니다.',
    },
    {
      title: '챗봇',
      description: '서비스 이용과 관련된 문의사항을\n 실시간으로 답변합니다.',
    },
  ];

  return (
    <IntroContainer>
      <HeroSection>
        <DecorativeElement />
        <HeroTitle>
          스마트 회의 비서,
          <br />
          Flowy Pro
        </HeroTitle>
        <HeroSubtitle>지금, 회의를 혁신하세요</HeroSubtitle>
        <HeroDescription>
          음성 전사부터 문서 추천, 챗봇, 프로젝트 관리까지
          <br />
          모든 업무를 AI가 스마트하게 지원합니다.
        </HeroDescription>
        <CTAButton onClick={() => navigate('/insert_info')}>시작하기</CTAButton>
      </HeroSection>

      <FeatureSection>
        <SectionTitle>주요 기능</SectionTitle>
        <FeatureGrid>
          {features.map((feature, idx) => (
            <FeatureCard key={idx}>
              <FeatureIcon>{feature.icon}</FeatureIcon>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
            </FeatureCard>
          ))}
        </FeatureGrid>
      </FeatureSection>

      <ProcessSection>
        <SectionTitle>사용 방법</SectionTitle>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem',
            flexWrap: 'wrap',
          }}
        >
          {processSteps.map((step, idx) => (
            <ProcessStep key={idx}>
              <StepNumber>{idx + 1}</StepNumber>
              <StepTitle>{step.title}</StepTitle>
              <StepDescription>{step.description}</StepDescription>
            </ProcessStep>
          ))}
        </div>
      </ProcessSection>

      <CTASection>
        <CTATitle>효율적인 회의를 경험하세요</CTATitle>
        <CTADescription>
          Flowy Pro와 함께 회의의 모든 단계를 스마트하게 관리하세요.
        </CTADescription>
        <CTAButton onClick={() => navigate('/sign_up')}>시작하기</CTAButton>
      </CTASection>
    </IntroContainer>
  );
};

export default Intro;
