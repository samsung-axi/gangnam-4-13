// 필요한 import 추가
import React, { useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Cell, Pie, PieChart } from 'recharts';
import api from '@/shared/config/axios.ts';
import { useAtom } from 'jotai';
import { creditRatingAtom, financialDataAtom } from '@/shared/store/atoms.ts';
import Header from '@/shared/components/Header.tsx';

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
    console.log('API 요청 데이터:', {
      company_name: companyName,
      financial_data: financialData,
      report_type: 'agent_based',
    });
    const response = await api.post('/api/query/financial', {
      company_name: companyName,
      financial_data: financialData,
      report_type: 'agent_based',
    });
    console.log('API 응답 데이터:', response.data);
    return response.data;
  } catch (error) {
    console.error('API 요청 오류:', error);
    throw error;
  }
};

// 신용등급에서 텍스트 추출 함수
const extractCreditRating = (content: string): string | null => {
  // 신용등급 패턴 찾기
  const ratingPattern = /신용등급[:\s]*(A{1,3}|B{1,3}|C{1,3}|D)(\+|-)?/i;
  const match = content.match(ratingPattern);
  if (match && match[1]) {
    return `${match[1]}${match[2] || ''}`;
  }
  return null;
};

const NewReportPagePdfOld: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const reportRef = useRef<HTMLDivElement>(null);

  // 위치 상태에서 초기 데이터 가져오기
  const initialData = location.state?.reportData as ReportData;
  const companyData = location.state?.companyData;

  // jotai atom에서 데이터 가져오기
  const [storedFinancialData] = useAtom(financialDataAtom);
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

  // 재무 섹션 찾기 함수
  const getFinancialSection = (sections: any[] = []) => {
    return sections?.find(
      (section: any) =>
        section.title.includes('재무') ||
        section.title.includes('금융') ||
        section.title.includes('분석')
    );
  };

  // 신용등급 계산 - json 프로퍼티가 있는 경우용
  const creditRating = useMemo(() => {
    if (!reportData) {
      return null;
    }

    // 1. jotai atom에 저장된 신용등급이 있으면 사용
    if (storedCreditRating) {
      console.log('jotai atom에서 신용등급 가져옴:', storedCreditRating);
      return storedCreditRating;
    }

    // 2. json 속성이 있는 경우
    if ('json' in reportData && reportData.json) {
      // API에서 직접 제공하는 신용등급이 있으면 사용
      if (reportData.json.credit_rating) {
        console.log('API에서 제공된 신용등급 (json):', reportData.json.credit_rating);
        // 객체 형태인 경우 credit_rating 속성 추출
        if (typeof reportData.json.credit_rating === 'object') {
          return reportData.json.credit_rating.credit_rating || 'A';
        }
        return reportData.json.credit_rating;
      }

      const { report_data, sections = [] } = reportData.json;

      if (!report_data) {
        return 'A';
      }

      const financialSection = getFinancialSection(sections);

      if (financialSection) {
        console.log('재무 섹션 찾음:', financialSection.title);
        return extractCreditRating(financialSection.content) || 'A';
      }

      console.log('재무 섹션을 찾을 수 없어 상세 내용에서 추출 시도');
      return extractCreditRating(report_data.detailed_content || '') || 'A';
    }
    // 3. json 속성이 없는 경우
    else {
      // API에서 직접 제공하는 신용등급이 있으면 사용
      if (reportData.credit_rating) {
        console.log('API에서 제공된 신용등급:', reportData.credit_rating);
        // 객체 형태인 경우 credit_rating 속성 추출
        if (typeof reportData.credit_rating === 'object') {
          return reportData.credit_rating.credit_rating || 'A';
        }
        return reportData.credit_rating;
      }

      const report_data = reportData.report_data;
      const sections = reportData.sections || [];

      if (!report_data) {
        return 'A';
      }

      const financialSection = getFinancialSection(sections);

      if (financialSection) {
        console.log('재무 섹션 찾음:', financialSection.title);
        return extractCreditRating(financialSection.content) || 'A';
      }

      console.log('재무 섹션을 찾을 수 없어 상세 내용에서 추출 시도');
      return extractCreditRating(report_data.detailed_content || '') || 'A';
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
      console.error('재무 지표 추출 중 오류:', error);
    }

    return metrics;
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

  // PDF 내보내기 함수 추가
  const generatePDF = (elementToConvert: HTMLElement | null, fileName: string = 'report.pdf') => {
    if (!elementToConvert) {
      console.error('PDF 생성을 위한 요소를 찾을 수 없습니다.');
      return;
    }

    // 스타일 복사를 위한 함수
    const copyStyles = (sourceDoc: Document, targetDoc: Document) => {
      Array.from(sourceDoc.styleSheets).forEach(styleSheet => {
        if (styleSheet.cssRules) {
          const newStyleEl = targetDoc.createElement('style');

          Array.from(styleSheet.cssRules).forEach(rule => {
            newStyleEl.appendChild(targetDoc.createTextNode(rule.cssText));
          });

          targetDoc.head.appendChild(newStyleEl);
        }
      });
    };

    // 새 창 열기
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('팝업이 차단되었습니다. 팝업 차단을 해제해주세요.');
      return;
    }

    // 새 문서 생성
    printWindow.document.write('<html><head><title>' + fileName + '</title>');
    printWindow.document.write(
      '<meta name="viewport" content="width=device-width, initial-scale=1.0">'
    );
    printWindow.document.write('</head><body>');
    printWindow.document.write('<div class="pdf-container">');
    printWindow.document.write(elementToConvert.innerHTML);
    printWindow.document.write('</div>');
    printWindow.document.write('</body></html>');

    // 스타일 복사
    copyStyles(document, printWindow.document);

    // 인쇄 최적화 스타일 추가
    const style = printWindow.document.createElement('style');
    style.textContent = `
      body {
        margin: 0;
        padding: 20px;
        overflow: visible !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
        font-size: 18px !important;
        transform: scale(1) !important;
        transform-origin: top left !important;
      }
      .pdf-container {
        width: 100%;
        height: auto !important;
        overflow: visible !important;
        page-break-inside: auto !important;
      }
      @media print {
        html, body {
          width: 100%;
          height: auto !important;
          margin: 0 !important;
          padding: 0 !important;
          overflow: visible !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
          font-size: 16px !important;
          transform: scale(1) !important;
          transform-origin: top left !important;
          zoom: 100% !important;
        }
        
        .pdf-container {
          width: 100%;
          height: auto !important;
          overflow: visible !important;
          page-break-inside: auto !important;
        }
        
        @page {
          size: A4;
          margin: 1cm 1cm 1cm 1cm;
          /* 브라우저 인쇄 헤더와 푸터 제거 시도 */
          margin-header: 0;
          margin-footer: 0;
          marks: none;
        }
        
        @page:first {
          margin-top: 1cm;
        }
        
        /* 첫 페이지 이후의 모든 페이지에 적용 */
        @page:not(:first) {
          margin-top: 3cm;
        }
        
        /* 페이지 나눔 관련 설정 */
        p, li, div {
          orphans: 3;
          widows: 3;
        }
        
        h1, h2, h3, h4, h5, h6 {
          page-break-after: avoid;
        }
        
        table, figure {
          page-break-inside: avoid;
        }
        
        /* 차트와 그래프 스타일 조정 */
        .recharts-wrapper {
          page-break-inside: avoid !important;
        }
        
        /* 페이지 나누기 방지 요소 */
        .no-page-break {
          page-break-inside: avoid !important;
        }
        
        /* 각 섹션 페이지 나누기 - 자동으로 변경 */
        .page-break {
          page-break-before: auto !important;
        }
        
        button, .no-print {
          display: none !important;
        }
        
        * {
          overflow: visible !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        
        /* 푸터 스타일 수정 - 마지막 섹션 이후에 표시 */
        .footer-container {
          text-align: center;
          page-break-inside: auto;
          background-color: white;
          border-top: 2px solid #e5e7eb;
          padding-top: 1cm;
          margin-top: auto;
        }
        
        /* 푸터 전용 페이지 설정 */
        .footer-page {
          display: flex;
          flex-direction: column;
          min-height: 100%;
          page-break-before: auto;
          page-break-inside: avoid;
        }
        
        /* 푸터 여백 자동 조정 */
        .footer-spacer {
          flex-grow: 1;
        }
      }
    `;
    printWindow.document.head.appendChild(style);

    // 헤더와 푸터 제거를 위한 추가 스크립트
    const script = printWindow.document.createElement('script');
    script.textContent = `
      function beforePrint() {
        // 브라우저 인쇄 설정 변경 시도
        const style = document.createElement('style');
        style.textContent = '@page { size: A4; margin: 0; }';
        document.head.appendChild(style);
      }
      window.addEventListener('beforeprint', beforePrint);
      
      // 인쇄 시 배경색 표시 설정
      function applyBackgroundColors() {
        // 모든 요소에 배경색 강제 적용
        const allElements = document.querySelectorAll('*');
        allElements.forEach(el => {
          const computedStyle = window.getComputedStyle(el);
          if (computedStyle.backgroundColor && computedStyle.backgroundColor !== 'rgba(0, 0, 0, 0)') {
            el.style.setProperty('background-color', computedStyle.backgroundColor, 'important');
          }
        });
      }
      
      // 문서 로드 완료 후 배경색 적용
      window.addEventListener('load', applyBackgroundColors);
    `;
    printWindow.document.head.appendChild(script);

    // 문서가 로드된 후 인쇄 대화상자 표시
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };
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
  const ratingInfo = getRatingInfo(creditRating || 'A');
  const industryInfo = getIndustryInfo();

  // Recharts용 데이터
  const chartData = [
    { name: 'progress', value: ratingInfo.progress, fill: ratingInfo.color },
    { name: 'remaining', value: 100 - ratingInfo.progress, fill: '#e5e7eb' },
  ];

  return (
    <>
      {/* 인쇄용 CSS 스타일 */}
      <style jsx>{`
        @media print {
          /* 페이지 설정 */
          @page {
            size: A4 portrait;
            margin: 15mm;
            /* 브라우저 기본 헤더/푸터 제거 */
            margin-header: 0;
            margin-footer: 0;
            marks: none;
          }

          /* 브라우저 헤더/푸터 제거를 위한 추가 설정 */
          html {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          /* 모든 요소에 적용되는 인쇄 설정 */
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* 화면 전용 요소 숨기기 */
          .no-print,
          header,
          nav,
          .header-container,
          button {
            display: none !important;
            visibility: hidden !important;
            height: 0 !important;
            position: absolute !important;
            top: -9999px !important;
          }

          /* 스크롤 제거 */
          html,
          body {
            overflow: visible !important;
            height: auto !important;
            width: auto !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          /* 페이지 브레이크 */
          .page-break {
            page-break-before: auto;
            margin-top: 20mm;
            clear: both;
          }

          .avoid-break {
            page-break-inside: avoid;
          }

          /* 색상 보정 - 인쇄시에도 색상 유지 */
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* 배경 그라데이션을 단색으로 변경 */
          .bg-gradient-to-r {
            background: #1e40af !important;
            background-image: none !important;
          }

          /* 그림자 제거하고 테두리 추가 */
          .shadow-md,
          .shadow-lg {
            box-shadow: none !important;
            border: 1px solid #e5e7eb !important;
          }

          /* 폰트 크기 조정 */
          body {
            font-size: 12pt !important;
            line-height: 1.4 !important;
          }

          /* 차트 영역 최적화 */
          .recharts-wrapper {
            print-color-adjust: exact !important;
            -webkit-print-color-adjust: exact !important;
          }

          /* 텍스트 색상 강제 적용 */
          .text-emerald-600 {
            color: #059669 !important;
          }

          .text-orange-600 {
            color: #ea580c !important;
          }

          .text-red-500 {
            color: #ef4444 !important;
          }

          .text-blue-600 {
            color: #2563eb !important;
          }

          .text-green-600 {
            color: #16a34a !important;
          }

          /* 배경색 강제 적용 */
          .bg-blue-50 {
            background-color: #eff6ff !important;
          }

          .bg-blue-500 {
            background-color: #3b82f6 !important;
          }

          /* 테두리 색상 */
          .border-blue-500 {
            border-color: #3b82f6 !important;
          }

          .border-gray-200 {
            border-color: #e5e7eb !important;
          }

          /* 보고서 컨테이너 스타일 수정 */
          .report-container {
            max-width: none !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            overflow: visible !important;
            position: relative !important;
          }

          /* 헤더 부분 완전히 숨기기 */
          #root > div > header,
          #root > header,
          .header-wrapper {
            display: none !important;
            visibility: hidden !important;
            height: 0 !important;
          }
        }

        @media screen {
          .print-only {
            display: none;
          }
        }
      `}</style>

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
                generatePDF(reportRef.current, `${getCompanyName()}_신용등급보고서.pdf`)
              }
              className='px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg font-medium text-base shadow-lg hover:bg-blue-700 transition-colors'
            >
              PDF 내보내기
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
                        <span className='font-bold ml-0.5' style={{ color: ratingInfo.color }}>
                          {creditRating || null}
                        </span>
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
            <div className='avoid-break'>
              <h3 className='text-2xl font-bold mb-6 text-gray-800'>신용등급</h3>
              <div className='flex items-center justify-center'>
                <div className='relative'>
                  <PieChart width={280} height={280}>
                    <Pie
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
                    </Pie>
                  </PieChart>
                  {/* 중앙 텍스트 */}
                  <div className='absolute inset-0 flex flex-col items-center justify-center'>
                    <div className='text-6xl font-bold mb-2' style={{ color: ratingInfo.color }}>
                      {creditRating || 'A'}
                    </div>
                    <div className='text-gray-600 text-sm font-medium'>투자 적격 등급</div>
                    <div className='text-gray-500 text-xs'>{ratingInfo.progress}% 신뢰도</div>
                  </div>
                </div>
              </div>
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
                <div key={index} className='mb-8'>
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

            {/* 푸터 페이지 */}
            <div className='footer-page'>
              {/* 푸터 여백 확보 */}
              <div className='footer-spacer'></div>

              {/* 푸터 */}
              <div className='footer-container text-center'>
                <div className='text-sm text-gray-500 mb-2'>
                  본 보고서는 AI에 의해 자동 생성되었으며, 참고용으로만 사용하시기 바랍니다.
                </div>
                <div className='text-sm text-gray-400'>{new Date().getFullYear()} SheetAI</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewReportPagePdfOld;
