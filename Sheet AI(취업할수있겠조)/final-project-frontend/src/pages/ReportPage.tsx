// 신용등급에 따른 색상과 진행률 결정 (null 처리 추가)
import React, { useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { creditRatingAtom } from '@/shared/store/atoms.ts';
import { devLog } from '@/shared/util/logger';
import Header from '@/shared/components/Header';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import api from '@/shared/config/axios.ts';
import { Cell, PieChart } from 'recharts';

// 리포트 데이터 인터페이스 정의
interface ReportData {
  json: {
    company_name: string;
    report_data: {
      company_name: string;
      subtitle: string;
      summary_content: string;
      detailed_content: string;
      generation_date: string;
      industry_name: string;
      market_type: string;
      financial_data?: any;
      sections?: {
        title: string;
        description: string;
        content: string;
      }[];
    };
    sections: {
      title: string;
      description?: string;
      content: string;
    }[];
    generated_at: string;
    report_type: string;
    credit_rating?: string;
  };
  company_name?: string;
  report_data?: {
    company_name: string;
    subtitle: string;
    summary_content: string;
    detailed_content: string;
    generation_date: string;
    industry_name: string;
    market_type: string;
    financial_data?: any;
    sections?: {
      title: string;
      description: string;
      content: string;
    }[];
  };
  sections?: {
    title: string;
    description?: string;
    content: string;
  }[];
  generated_at?: string;
  report_type?: string;
  credit_rating?: string;
}

// 보고서 데이터 가져오는 함수
const fetchReportData = async (companyName: string, financialData: any) => {
  try {
    devLog('API 요청 데이터:', {
      company_name: companyName,
      financial_data: financialData,
      report_type: 'agent_based',
    });
    const response = await api.post('/api/query/financial', {
      company_name: companyName,
      financial_data: financialData,
      report_type: 'agent_based',
    });
    devLog('API 응답 데이터:', response.data);
    return response.data;
  } catch (error) {
    devLog('API 요청 오류:', error);
    throw error;
  }
};

const ReportPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const reportRef = useRef<HTMLDivElement>(null);

  // PDF 생성 로딩 상태 추가
  const [isPdfGenerating, setIsPdfGenerating] = React.useState(false);

  // 위치 상태에서 초기 데이터 가져오기
  const initialData = location.state?.reportData as ReportData;
  const companyData = location.state?.companyData;

  // jotai atom에서 데이터 가져오기
  // const [storedFinancialData] = useAtom(financialDataAtom);
  const [storedCreditRating] = useAtom(creditRatingAtom);

  // React Query를 사용하여 데이터 가져오기 (초기 데이터가 없는 경우)
  const {
    data: reportData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['reportData', companyData?.company_name],
    queryFn: () =>
      fetchReportData(companyData?.company_name, companyData?.financial_statements?.financial_data),
    enabled: !!companyData && !initialData, // 초기 데이터가 없고 회사 데이터가 있을 때만 실행
    initialData: initialData, // 초기 데이터가 있으면 사용
  });

  // 신용등급 계산 - 추출 시도 없이 명확한 상태 반환
  const creditRating = useMemo(() => {
    if (!reportData) {
      return null;
    }

    // 1. jotai atom에 저장된 신용등급이 있으면 사용
    if (storedCreditRating) {
      devLog('jotai atom에서 신용등급 가져옴:', storedCreditRating);
      return storedCreditRating;
    }

    // 2. json 속성이 있는 경우
    if ('json' in reportData && reportData.json) {
      // API에서 직접 제공하는 신용등급이 있으면 사용
      if (reportData.json.credit_rating) {
        devLog('API에서 제공된 신용등급 (json):', reportData.json.credit_rating);
        // 객체 형태인 경우 credit_rating 속성 추출
        if (typeof reportData.json.credit_rating === 'object') {
          return reportData.json.credit_rating.credit_rating || null;
        }
        return reportData.json.credit_rating;
      }

      // 신용등급 정보가 없는 경우
      devLog('신용등급 정보를 찾을 수 없습니다.');
      return null;
    }
    // 3. json 속성이 없는 경우
    else {
      // API에서 직접 제공하는 신용등급이 있으면 사용
      if (reportData.credit_rating) {
        devLog('API에서 제공된 신용등급:', reportData.credit_rating);
        // 객체 형태인 경우 credit_rating 속성 추출
        if (typeof reportData.credit_rating === 'object') {
          return reportData.credit_rating.credit_rating || null;
        }
        return reportData.credit_rating;
      }

      // 신용등급 정보가 없는 경우
      devLog('신용등급 정보를 찾을 수 없습니다.');
      return null;
    }
  }, [reportData, storedCreditRating]);

  // 재무 지표 추출
  const financialMetrics = useMemo(() => {
    if (!reportData) {
      return {
        roa: 0,
        roe: 0,
        debtRatio: 0,
        operatingProfitMargin: 0,
      };
    }

    // 기본 지표 값
    let metrics = {
      roa: 6.7,
      roe: 8.57,
      debtRatio: 27.93,
      operatingProfitMargin: 10.88,
    };

    try {
      // 1. json 속성이 있는 경우
      if ('json' in reportData && reportData.json) {
        const content = reportData.json.report_data?.detailed_content || '';

        // ROA 추출
        const roaMatch = content.match(/ROA[:\s]*([0-9.]+)%/i);
        if (roaMatch && roaMatch[1]) {
          metrics.roa = parseFloat(roaMatch[1]);
        }

        // ROE 추출
        const roeMatch = content.match(/ROE[:\s]*([0-9.]+)%/i);
        if (roeMatch && roeMatch[1]) {
          metrics.roe = parseFloat(roeMatch[1]);
        }

        // 부채비율 추출
        const debtMatch = content.match(/부채비율[:\s]*([0-9.]+)%/i);
        if (debtMatch && debtMatch[1]) {
          metrics.debtRatio = parseFloat(debtMatch[1]);
        }

        // 영업이익률 추출
        const profitMatch = content.match(/영업이익률[:\s]*([0-9.]+)%/i);
        if (profitMatch && profitMatch[1]) {
          metrics.operatingProfitMargin = parseFloat(profitMatch[1]);
        }
      }
      // 2. json 속성이 없는 경우
      else if (reportData.report_data) {
        const content = reportData.report_data.detailed_content || '';

        // ROA 추출
        const roaMatch = content.match(/ROA[:\s]*([0-9.]+)%/i);
        if (roaMatch && roaMatch[1]) {
          metrics.roa = parseFloat(roaMatch[1]);
        }

        // ROE 추출
        const roeMatch = content.match(/ROE[:\s]*([0-9.]+)%/i);
        if (roeMatch && roeMatch[1]) {
          metrics.roe = parseFloat(roeMatch[1]);
        }

        // 부채비율 추출
        const debtMatch = content.match(/부채비율[:\s]*([0-9.]+)%/i);
        if (debtMatch && debtMatch[1]) {
          metrics.debtRatio = parseFloat(debtMatch[1]);
        }

        // 영업이익률 추출
        const profitMatch = content.match(/영업이익률[:\s]*([0-9.]+)%/i);
        if (profitMatch && profitMatch[1]) {
          metrics.operatingProfitMargin = parseFloat(profitMatch[1]);
        }
      }
    } catch (error) {
      devLog('재무 지표 추출 중 오류:', error);
    }

    return metrics;
  }, [reportData]);

  // color_grade에 따른 색상 매핑 함수 추가
  const getColorByGrade = (colorGrade: string | undefined): string => {
    switch (colorGrade) {
      case 'excellent':
        return '#22c55e'; // 녹색
      case 'good':
        return '#3b82f6'; // 파란색
      case 'average':
        return '#f59e0b'; // 주황색
      case 'poor':
        return '#ef4444'; // 빨간색
      default:
        return '#6b7280'; // 회색 (기본값)
    }
  };

  // 재무 지표별 color_grade 추출 함수
  const financialMetricsColorGrades = useMemo(() => {
    if (!reportData) {
      return {
        roa: undefined,
        roe: undefined,
        debtRatio: undefined,
        operatingProfitMargin: undefined,
      };
    }

    try {
      // 1. json 속성이 있는 경우
      if ('json' in reportData && reportData.json) {
        const metrics = reportData.json.report_data?.financial_metrics;
        return {
          roa: metrics?.roa?.color_grade,
          roe: metrics?.roe?.color_grade,
          debtRatio: metrics?.debt_ratio?.color_grade,
          operatingProfitMargin: metrics?.operating_profit_margin?.color_grade,
        };
      }
      // 2. json 속성이 없는 경우
      else if (reportData.report_data) {
        const metrics = reportData.report_data.financial_metrics;
        return {
          roa: metrics?.roa?.color_grade,
          roe: metrics?.roe?.color_grade,
          debtRatio: metrics?.debt_ratio?.color_grade,
          operatingProfitMargin: metrics?.operating_profit_margin?.color_grade,
        };
      }
    } catch (error) {
      devLog('재무 지표 색상 등급 추출 중 오류 발생:', error);
    }

    return {
      roa: undefined,
      roe: undefined,
      debtRatio: undefined,
      operatingProfitMargin: undefined,
    };
  }, [reportData]);

  // 뉴스 데이터 추출 함수
  const newsItems = useMemo(() => {
    if (!reportData) {
      return [];
    }

    try {
      // 1. json 속성이 있는 경우
      if ('json' in reportData && reportData.json) {
        return reportData.json.news_data || [];
      }
      // 2. json 속성이 없는 경우
      else if (reportData.report_data) {
        return reportData.report_data.news_data || [];
      }
    } catch (error) {
      devLog('뉴스 데이터 추출 중 오류 발생:', error);
    }

    return [];
  }, [reportData]);

  // 신용등급에 따른 색상과 진행률 결정
  const getRatingInfo = (rating: string) => {
    const configs = {
      AAA: { color: '#059669', progress: 95 },
      AA: { color: '#059669', progress: 90 },
      'A+': { color: '#10B981', progress: 85 },
      A: { color: '#10B981', progress: 80 },
      'A-': { color: '#10B981', progress: 75 },
      'B+': { color: '#F59E0B', progress: 70 },
      B: { color: '#F59E0B', progress: 65 },
      'B-': { color: '#F59E0B', progress: 60 },
      'C+': { color: '#EF4444', progress: 45 },
      C: { color: '#EF4444', progress: 35 },
      'C-': { color: '#EF4444', progress: 25 },
      D: { color: '#DC2626', progress: 15 },
    };

    return configs[rating as keyof typeof configs] || { color: '#6B7280', progress: 50 };
  };

  // PDF 생성을 위한 동적 색상 변환 시스템
  const applyPdfCompatibleStyles = (element: HTMLElement) => {
    // PDF 생성용 CSS 클래스 추가
    element.classList.add('pdf-mode');

    // PDF 호환 스타일 동적 추가
    const style = document.createElement('style');
    style.id = 'pdf-compatibility-styles';
    style.textContent = `
      /* PDF 모드에서만 적용되는 hex 색상 */
      .pdf-mode .bg-gradient-to-r {
        background: linear-gradient(to right, #2563eb, #1d4ed8) !important;
        background-image: linear-gradient(to right, #2563eb, #1d4ed8) !important;
      }
      
      .pdf-mode .text-blue-600 { color: #2563eb !important; }
      .pdf-mode .text-blue-100 { color: #dbeafe !important; }
      .pdf-mode .text-blue-800 { color: #1e40af !important; }
      .pdf-mode .text-gray-800 { color: #1f2937 !important; }
      .pdf-mode .text-gray-600 { color: #4b5563 !important; }
      .pdf-mode .text-gray-700 { color: #374151 !important; }
      .pdf-mode .text-gray-500 { color: #6b7280 !important; }
      .pdf-mode .text-gray-400 { color: #9ca3af !important; }
      .pdf-mode .text-emerald-600 { color: #059669 !important; }
      .pdf-mode .text-orange-600 { color: #ea580c !important; }
      .pdf-mode .text-red-500 { color: #ef4444 !important; }
      .pdf-mode .text-white { color: #ffffff !important; }
      
      .pdf-mode .bg-blue-50 { background-color: #eff6ff !important; }
      .pdf-mode .bg-blue-500 { background-color: #3b82f6 !important; }
      .pdf-mode .bg-white { background-color: #ffffff !important; }
      
      .pdf-mode .border-blue-500 { border-color: #3b82f6 !important; }
      .pdf-mode .border-gray-200 { border-color: #e5e7eb !important; }
      
      /* 신용등급 차트 중앙 텍스트 위치 조정 (PDF 전용) */
      .pdf-mode .credit-rating-center {
        transform: translateY(-5px) !important;
      }
      
      .pdf-mode .credit-rating-main {
        margin-top: -14px !important;
      }
      
      .pdf-mode .credit-rating-sub {
        margin-top: 7px !important;  /* 부가 텍스트 위쪽 여백 줄임 */
      }
      
      /* oklch나 최신 색상 함수 강제 오버라이드 */
      .pdf-mode [style*="oklch"], 
      .pdf-mode [style*="lab("], 
      .pdf-mode [style*="lch("],
      .pdf-mode [style*="color(display-p3"] {
        background: #ffffff !important;
        background-image: none !important;
        color: #000000 !important;
        border-color: #e5e7eb !important;
      }
    `;
    document.head.appendChild(style);
  };

  const removePdfCompatibleStyles = (element: HTMLElement) => {
    // PDF 모드 클래스 제거
    element.classList.remove('pdf-mode');

    // PDF 호환 스타일 제거
    const style = document.getElementById('pdf-compatibility-styles');
    if (style) {
      style.remove();
    }
  };

  // 스마트 PDF 생성 함수 (최종 버전 - 중복 방지 + 페이지 활용 최적화 + 로딩 상태)
  const generateSmartPDF = async (
    elementToConvert: HTMLElement | null,
    fileName: string = 'report.pdf'
  ) => {
    if (!elementToConvert) {
      devLog('PDF 생성을 위한 요소를 찾을 수 없습니다.');
      return;
    }

    // 로딩 상태 시작
    setIsPdfGenerating(true);

    try {
      devLog('스마트 PDF 생성 중...');

      // 1. PDF 호환 모드 활성화
      applyPdfCompatibleStyles(elementToConvert);
      await new Promise(resolve => setTimeout(resolve, 100));

      const A4_WIDTH = 210;
      const A4_HEIGHT = 297;
      const margins = { top: 15, bottom: 15, left: 15, right: 15 };
      const contentWidth = A4_WIDTH - margins.left - margins.right;
      const contentHeight = A4_HEIGHT - margins.top - margins.bottom;

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      // 2. 전체 콘텐츠를 한 번에 캡처
      const fullCanvas = await html2canvas(elementToConvert, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: elementToConvert.scrollWidth,
        height: elementToConvert.scrollHeight,
        onclone: (clonedDoc: Document) => {
          const noprint = clonedDoc.querySelectorAll('.no-print');
          noprint.forEach(el => el.remove());

          const reportContainer = clonedDoc.querySelector('.report-container');
          if (reportContainer) {
            reportContainer.classList.add('pdf-mode');
          }
        },
      });

      // 3. 페이지 나누기 포인트 찾기 (섹션 경계 + 자연스러운 분할점)
      const breakPoints = await findOptimalBreakPoints(
        elementToConvert,
        contentHeight,
        fullCanvas.height
      );

      // 4. 각 페이지별로 캔버스 분할하여 PDF 생성
      let currentY = 0;
      let pageNumber = 0;

      for (let i = 0; i < breakPoints.length; i++) {
        const nextBreakPoint = breakPoints[i];
        const pageHeight = nextBreakPoint - currentY;

        if (pageHeight <= 0) {
          continue;
        }

        // 새 페이지 캔버스 생성
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = fullCanvas.width;
        pageCanvas.height = pageHeight;

        const pageCtx = pageCanvas.getContext('2d');
        if (pageCtx) {
          // 해당 영역만 복사 (중복 없음)
          pageCtx.drawImage(
            fullCanvas,
            0,
            currentY, // 소스 시작 위치
            fullCanvas.width,
            pageHeight, // 소스 크기
            0,
            0, // 대상 시작 위치
            fullCanvas.width,
            pageHeight // 대상 크기
          );

          // 페이지 추가
          if (pageNumber > 0) {
            pdf.addPage();
          }

          // 이미지를 PDF에 추가
          const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.95);
          const pdfPageHeight = (pageHeight * contentWidth) / fullCanvas.width;

          pdf.addImage(pageImgData, 'JPEG', margins.left, margins.top, contentWidth, pdfPageHeight);
        }

        currentY = nextBreakPoint;
        pageNumber++;
      }

      pdf.save(fileName);
      devLog('스마트 PDF 생성 완료');
    } catch (error) {
      devLog('스마트 PDF 생성 중 오류:', error);
      alert('PDF 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      if (elementToConvert) {
        removePdfCompatibleStyles(elementToConvert);
      }
      // 로딩 상태 종료
      setIsPdfGenerating(false);
    }
  };

  // 최적의 페이지 나누기 포인트 찾기 함수
  const findOptimalBreakPoints = async (
    element: HTMLElement,
    maxPageHeight: number,
    totalCanvasHeight: number
  ): Promise<number[]> => {
    const scale = 2; // html2canvas scale과 동일
    const maxPagePixels = maxPageHeight * scale * (element.scrollWidth / 180); // 대략적인 픽셀 변환

    const breakPoints: number[] = [];
    let currentY = 0;

    // 주요 섹션들의 위치 계산
    const sections = [
      element.querySelector('.bg-gradient-to-r'), // 헤더
      element.querySelector('.bg-blue-50'), // 요약 카드
      element.querySelector('.avoid-break'), // 신용등급 차트
      ...Array.from(element.querySelectorAll('.mb-8')), // 분석 섹션들
    ].filter((section): section is Element => section !== null);

    // 각 섹션의 상대적 위치 계산
    const sectionPositions: { element: Element; top: number; height: number }[] = [];

    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      const relativeTop = (rect.top - elementRect.top) * scale;
      const height = rect.height * scale;

      sectionPositions.push({
        element: section,
        top: relativeTop,
        height: height,
      });
    });

    // 스마트 분할 로직
    while (currentY < totalCanvasHeight) {
      let nextBreakPoint = Math.min(currentY + maxPagePixels, totalCanvasHeight);

      // 현재 페이지 범위에서 섹션 경계 찾기
      let bestBreakPoint = nextBreakPoint;
      let minPenalty = Infinity;

      for (const section of sectionPositions) {
        const sectionStart = section.top;
        const sectionEnd = section.top + section.height;

        // 섹션이 현재 페이지 범위에 있는 경우
        if (sectionStart >= currentY && sectionStart <= nextBreakPoint) {
          // 섹션 시작 지점에서 나누는 것이 좋음
          if (sectionStart > currentY + maxPagePixels * 0.5) {
            // 페이지가 너무 비지 않게
            const penalty = Math.abs(sectionStart - nextBreakPoint);
            if (penalty < minPenalty) {
              minPenalty = penalty;
              bestBreakPoint = sectionStart;
            }
          }
        }

        // 섹션이 페이지 경계에 걸치는 경우
        if (sectionStart < nextBreakPoint && sectionEnd > nextBreakPoint) {
          // 섹션 끝에서 나누거나, 다음 페이지로 넘기기
          if (section.height < maxPagePixels * 0.8) {
            // 섹션이 충분히 작으면
            // 섹션 시작으로 이동 (다음 페이지에서 온전히 표시)
            bestBreakPoint = Math.max(currentY + maxPagePixels * 0.3, sectionStart);
          } else {
            // 섹션이 크면 섹션 내에서 자연스럽게 분할
            const middlePoint = sectionStart + section.height * 0.6;
            if (middlePoint > currentY + maxPagePixels * 0.4) {
              bestBreakPoint = middlePoint;
            }
          }
        }
      }

      // 페이지가 너무 작지 않게 최소 높이 보장
      bestBreakPoint = Math.max(bestBreakPoint, currentY + maxPagePixels * 0.3);

      breakPoints.push(bestBreakPoint);
      currentY = bestBreakPoint;
    }

    return breakPoints;
  };

  // 회사명 가져오기
  const getCompanyName = () => {
    if (!reportData) {
      return '보고서';
    }

    if ('json' in reportData && reportData.json) {
      return reportData.json.company_name || '보고서';
    }

    return reportData.company_name || '보고서';
  };

  // 부제목 가져오기
  const getSubtitle = () => {
    if (!reportData) {
      return '금융 분석 | 신용평가';
    }

    if ('json' in reportData && reportData.json && reportData.json.report_data) {
      return reportData.json.report_data.subtitle || '금융 분석 | 신용평가';
    }

    if (reportData.report_data) {
      return reportData.report_data.subtitle || '금융 분석 | 신용평가';
    }

    return '금융 분석 | 신용평가';
  };

  // 생성 날짜 가져오기
  const getGenerationDate = () => {
    if (!reportData) {
      return '2025년 06월 23일';
    }

    if ('json' in reportData && reportData.json && reportData.json.report_data) {
      return reportData.json.report_data.generation_date || '2025년 06월 23일';
    }

    if (reportData.report_data) {
      return reportData.report_data.generation_date || '2025년 06월 23일';
    }

    return '2025년 06월 23일';
  };

  // 업종 정보 가져오기
  const getIndustryInfo = () => {
    if (!reportData) {
      return { industry: '', market: '' };
    }

    if ('json' in reportData && reportData.json && reportData.json.report_data) {
      return {
        industry: reportData.json.report_data.industry_name || '',
        market: reportData.json.report_data.market_type || '',
      };
    }

    if (reportData.report_data) {
      return {
        industry: reportData.report_data.industry_name || '',
        market: reportData.report_data.market_type || '',
      };
    }

    return { industry: '', market: '' };
  };

  // 뒤로 가기 함수
  const handleBack = () => {
    navigate(-1);
  };

  // 로딩 중이거나 에러 발생 시 처리
  if (isLoading) {
    return <div>보고서를 불러오는 중입니다...</div>;
  }

  if (error) {
    return <div>오류가 발생했습니다: {(error as Error).message}</div>;
  }

  if (!reportData) {
    return <div>보고서 데이터가 없습니다.</div>;
  }

  // 신용등급 정보
  const ratingInfo = getRatingInfo(creditRating);
  // const industryInfo = getIndustryInfo();

  // Recharts용 데이터 (신용등급이 없는 경우 처리)
  const chartData = creditRating
    ? [
        { name: 'progress', value: ratingInfo.progress, fill: ratingInfo.color },
        { name: 'remaining', value: 100 - ratingInfo.progress, fill: '#e5e7eb' },
      ]
    : [{ name: 'unknown', value: 100, fill: '#f3f4f6' }];

  return (
    <div>
      {/* 헤더 - 인쇄 시 숨김 처리 */}
      <div className='no-print header-wrapper'>
        <Header onBack={handleBack} className='no-print header-container' />
      </div>

      {/* 화면 전용 컨트롤 */}
      <div className='no-print flex mx-auto justify-end py-5 max-w-[210mm]'>
        <div className='flex gap-4 items-end'>
          <button
            onClick={() =>
              generateSmartPDF(reportRef.current, `${getCompanyName()}_신용등급보고서.pdf`)
            }
            disabled={isPdfGenerating}
            className={`
              px-6 py-2 rounded-lg font-medium text-sm shadow-lg transition-all duration-200
              ${
                isPdfGenerating
                  ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                  : 'bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white'
              }
            `}
          >
            {isPdfGenerating ? (
              <div className='flex items-center gap-2'>
                <svg className='animate-spin h-4 w-4' viewBox='0 0 24 24'>
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                    fill='none'
                  />
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  />
                </svg>
                PDF 생성 중...
              </div>
            ) : (
              'PDF 내보내기'
            )}
          </button>
        </div>
      </div>

      {/* 보고서 본문 */}
      <div
        ref={reportRef}
        className='max-w-[210mm] mx-auto bg-white shadow-md rounded-lg overflow-hidden report-container'
      >
        {/* 헤더 부분 */}
        <div className='bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 avoid-break'>
          <h1 className='text-3xl font-bold mb-2'>{getCompanyName()} 신용등급 보고서</h1>
          <p className='text-blue-100 text-lg'>{getSubtitle()}</p>
        </div>

        {/* 메인 컨텐츠 */}
        <div className='p-8'>
          {/* 신용분석 요약 카드 */}
          <div className='bg-blue-50 rounded-lg p-6 mb-8 border-l-4 border-blue-500 avoid-break'>
            <div className='flex items-center mb-4'>
              <div className='bg-blue-500 rounded-full p-0.5 mr-3'>
                <span className='text-blue-600'>📊</span>
              </div>
              <h3 className='text-xl font-bold text-gray-800'>신용분석 요약 카드</h3>
            </div>
            <div>
              <div className='mb-6 flex'>
                <div className='flex flex-col gap-2'>
                  <div className='text-sm text-gray-600 mb-1'>
                    <span className='font-semibold text-gray-800'>기업명: </span>
                    <span>{getCompanyName()}</span>
                  </div>
                  <div className='text-sm text-gray-600 mb-1'>
                    <span className='font-semibold text-gray-800'>평가일자: </span>
                    {getGenerationDate()}
                  </div>
                  <div>
                    <div className='text-sm text-gray-600 mb-1'>
                      <span className='font-semibold text-gray-800'>신용등급: </span>
                      {creditRating ? (
                        <span className='font-bold ml-0.5' style={{ color: ratingInfo.color }}>
                          {creditRating}
                        </span>
                      ) : (
                        <span className='font-medium ml-0.5 text-gray-500 bg-gray-100 px-2 py-1 rounded text-xs'>
                          평가 불가
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className='m-auto' />
                <div className='flex flex-col gap-3'>
                  <div className='text-sm text-gray-600'>
                    <span className='font-semibold text-gray-800'>주요 강점 키워드: </span>
                  </div>
                  <div className='text-sm text-gray-700 break-words mb-1 font-light'>
                    강한 재무건전성, 안정적인 신용 전망, 높은 이익률
                  </div>
                  <div className='text-sm text-gray-600'>
                    <span className='font-semibold text-gray-800'>주요 약점 키워드: </span>
                  </div>
                  <div className='text-sm text-gray-700 break-words font-light'>
                    시장 위험, 부채비율 증가, 매출증장 불확실성
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className='text-sm font-semibold text-gray-700 mb-3'>핵심 재무지표:</div>
              <div className='grid grid-cols-4 gap-4 text-center'>
                <div>
                  <div
                    className={`text-2xl font-bold ${financialMetrics.roa > 5 ? 'text-emerald-600' : 'text-red-500'} mb-1`}
                    style={{ color: getColorByGrade(financialMetricsColorGrades.roa) }}
                  >
                    {financialMetrics.roa}%
                  </div>
                  <div className='text-xs text-gray-600'>
                    ROA ({financialMetrics.roa > 5 ? '양호' : '주의'})
                  </div>
                </div>
                <div>
                  <div
                    className={`text-2xl font-bold ${financialMetrics.roe > 8 ? 'text-emerald-600' : 'text-red-500'} mb-1`}
                    style={{ color: getColorByGrade(financialMetricsColorGrades.roe) }}
                  >
                    {financialMetrics.roe}%
                  </div>
                  <div className='text-xs text-gray-600'>
                    ROE ({financialMetrics.roe > 8 ? '양호' : '주의'})
                  </div>
                </div>
                <div>
                  <div
                    className={`text-2xl font-bold ${financialMetrics.debtRatio < 200 ? 'text-orange-600' : 'text-red-500'} mb-1`}
                    style={{ color: getColorByGrade(financialMetricsColorGrades.debtRatio) }}
                  >
                    {financialMetrics.debtRatio}%
                  </div>
                  <div className='text-xs text-gray-600'>
                    부채비율 ({financialMetrics.debtRatio < 200 ? '보통' : '주의'})
                  </div>
                </div>
                <div>
                  <div
                    className={`text-2xl font-bold ${financialMetrics.operatingProfitMargin > 10 ? 'text-emerald-600' : 'text-red-500'} mb-1`}
                    style={{
                      color: getColorByGrade(financialMetricsColorGrades.operatingProfitMargin),
                    }}
                  >
                    {financialMetrics.operatingProfitMargin}%
                  </div>
                  <div className='text-xs text-gray-600'>
                    영업이익률 ({financialMetrics.operatingProfitMargin > 10 ? '우수' : '주의'})
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 신용등급 섹션 */}
          <div className='avoid-break page-break'>
            <h3 className='text-2xl font-bold mb-6 text-gray-800'>신용등급</h3>
            <div className='flex items-center justify-center'>
              <div className='relative'>
                <PieChart width={280} height={280}>
                  <PieChart
                    data={chartData}
                    dataKey='value'
                    nameKey='name'
                    cx='50%'
                    cy='50%'
                    outerRadius={120}
                    innerRadius={80}
                    startAngle={90}
                    endAngle={-270}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </PieChart>
                </PieChart>
                {/* 중앙 텍스트 */}
                <div className='absolute inset-0 flex flex-col items-center justify-center credit-rating-center'>
                  {creditRating ? (
                    <>
                      <div
                        className='text-6xl font-bold mb-2 credit-rating-main'
                        style={{ color: ratingInfo.color }}
                      >
                        {creditRating}
                      </div>
                      <div className='text-gray-600 text-sm font-medium credit-rating-sub'>
                        {ratingInfo.message}
                      </div>
                      <div className='text-gray-500 text-xs credit-rating-sub'>
                        {ratingInfo.progress}% 신뢰도
                      </div>
                    </>
                  ) : (
                    <>
                      <div className='text-3xl font-bold mb-2 text-gray-400 credit-rating-main'>
                        ?
                      </div>
                      <div className='text-gray-500 text-sm font-medium text-center credit-rating-sub'>
                        신용등급
                        <br />
                        정보 없음
                      </div>
                      <div className='text-gray-400 text-xs mt-2 bg-yellow-50 px-3 py-1 rounded credit-rating-sub'>
                        평가 불가
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            {!creditRating && (
              <div className='mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg'>
                <div className='flex items-start'>
                  <div className='text-yellow-400 mr-3'>⚠️</div>
                  <div>
                    <p className='text-yellow-800 font-medium text-sm'>
                      신용등급 정보를 확인할 수 없습니다
                    </p>
                    <p className='text-yellow-700 text-xs mt-1'>
                      서버에서 신용등급 데이터를 제공받지 못했습니다. 관리자에게 문의해주세요.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 섹션별 내용 */}
          {(() => {
            const sections = (() => {
              if (!reportData) {
                return [];
              }

              if ('json' in reportData && reportData.json) {
                return reportData.json.sections || [];
              }

              return reportData.sections || [];
            })();

            return sections.map((section: any, index: number) => (
              <div key={index} className='mb-8 page-break'>
                <h3 className='text-xl font-bold mb-4 text-gray-800 border-b-2 border-gray-200 pb-2'>
                  {section.title}
                </h3>
                {section.description && (
                  <div className='bg-blue-50 p-4 rounded-lg mb-4'>
                    <p className='text-base font-medium text-blue-800'>{section.description}</p>
                  </div>
                )}
                <div className='text-base leading-relaxed text-gray-700 whitespace-pre-line'>
                  {section.content}
                </div>
              </div>
            ));
          })()}

          {/* 관련 뉴스 섹션 */}
          {newsItems.length > 0 && (
            <div className='mb-8 page-break'>
              <h3 className='text-xl font-bold mb-4 text-gray-800 border-b-2 border-gray-200 pb-2'>
                관련 뉴스
              </h3>
              <div className='grid grid-cols-1 gap-4'>
                {newsItems.map((news, index) => (
                  <div
                    key={index}
                    className='bg-white rounded-lg shadow p-4 border border-gray-200'
                  >
                    <div className='flex'>
                      {news.image_url && (
                        <div className='flex-shrink-0 mr-4'>
                          <img
                            src={news.image_url}
                            alt={news.title}
                            className='w-24 h-24 object-cover rounded'
                            onError={e => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                      <div className='flex-grow'>
                        <h4 className='text-lg font-semibold mb-1'>
                          <a
                            href={news.url}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-blue-600 hover:underline'
                          >
                            {news.title}
                          </a>
                        </h4>
                        {news.source && news.published_date && (
                          <div className='text-xs text-gray-500 mb-2'>
                            {news.source} · {news.published_date}
                          </div>
                        )}
                        {news.summary && <p className='text-sm text-gray-700'>{news.summary}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 푸터 */}
          <div className='footer-container text-center mt-16 pt-8 border-t-2 border-gray-200'>
            <div className='text-sm text-gray-500 mb-2'>
              본 보고서는 AI에 의해 자동 생성되었으며, 참고용으로만 사용하시기 바랍니다.
            </div>
            <div className='text-sm text-gray-400'>{new Date().getFullYear()} SheetAI</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
