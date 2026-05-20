import React, { useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '@/shared/components/Header.tsx';
import { useQuery } from '@tanstack/react-query';
import api from '@/shared/config/axios.ts';
import { marked } from 'marked';
import FinancialMetricsChart from '@/features/report-generation/components/chart/FinancialMetricsChart.tsx';
import CreditRatingGauge from '@/features/report-generation/components/chart/CreditRatingGauge.tsx';
import FinancialHealthRadar from '@/features/report-generation/components/chart/FinancialHealthRadar.tsx';
import { useAtom } from 'jotai';
import { creditRatingAtom, financialDataAtom } from '@/shared/store/atoms.ts';

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

const ReportPageOld: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const reportContentRef = useRef<HTMLDivElement>(null);

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

  // 재무 지표 추출 로직을 컴포넌트 최상위 레벨로 이동
  const getFinancialSection = (sections: any[] = []) => {
    return sections?.find(
      (section: any) =>
        section.title.includes('재무') ||
        section.title.includes('금융') ||
        section.title.includes('분석')
    );
  };

  // 재무 데이터 추출 - 모든 조건부 반환 이전에 Hook 호출
  const financialDataForDirect = useMemo(() => {
    // reportData가 없거나 json 속성이 있는 경우
    if (!reportData || 'json' in reportData) {
      return null;
    }

    // 1. jotai atom에 저장된 재무 데이터가 있으면 사용
    if (storedFinancialData) {
      console.log('jotai atom에서 재무 데이터 가져옴:', storedFinancialData);
      return storedFinancialData;
    }

    // 2. reportData에 재무 데이터가 있는 경우
    if (reportData.report_data?.financial_data) {
      console.log('직접 구조에서 재무 데이터 찾음:', reportData.report_data.financial_data);
      return reportData.report_data.financial_data;
    }

    // 3. companyData에서 가져오기
    if (companyData?.financial_statements?.financial_data) {
      console.log(
        'companyData에서 재무 데이터 가져옴:',
        companyData.financial_statements.financial_data
      );
      return companyData.financial_statements.financial_data;
    }

    return null;
  }, [reportData, companyData, storedFinancialData]);

  // 재무 지표 추출 - Direct 구조용 (이것도 조건부 반환 이전에 호출)
  const financialMetricsForDirect = useMemo(() => {
    if (!financialDataForDirect) {
      return null;
    }

    // 재무 지표 데이터 변환 로직
    try {
      if (Array.isArray(financialDataForDirect.metrics)) {
        return financialDataForDirect.metrics;
      }

      // 다른 형태의 데이터가 있을 경우 변환 로직 추가
      return [];
    } catch (error) {
      console.error('재무 지표 변환 중 오류:', error);
      return [];
    }
  }, [financialDataForDirect]);

  // 재무 데이터 추출 - json 프로퍼티가 있는 경우용
  const financialDataForJson = useMemo(() => {
    // 항상 값을 반환하도록 수정
    if (!reportData || !('json' in reportData) || !reportData.json) {
      return null;
    }

    // 1. jotai atom에 저장된 재무 데이터가 있으면 사용
    if (storedFinancialData) {
      console.log('jotai atom에서 재무 데이터 가져옴:', storedFinancialData);
      return storedFinancialData;
    }

    // 2. reportData에 재무 데이터가 있는 경우
    if (reportData.json.report_data?.financial_data) {
      console.log('json 구조에서 재무 데이터 찾음:', reportData.json.report_data.financial_data);
      return reportData.json.report_data.financial_data;
    }

    // 3. companyData에서 가져오기
    if (companyData?.financial_statements?.financial_data) {
      console.log(
        'companyData에서 재무 데이터 가져옴:',
        companyData.financial_statements.financial_data
      );
      return companyData.financial_statements.financial_data;
    }

    return null;
  }, [reportData, companyData, storedFinancialData]);

  // 재무 지표 추출 - Json 구조용
  const financialMetricsForJson = useMemo(() => {
    if (!financialDataForJson) {
      return null;
    }

    // 재무 지표 데이터 변환 로직
    try {
      if (Array.isArray(financialDataForJson.metrics)) {
        return financialDataForJson.metrics;
      }

      // 다른 형태의 데이터가 있을 경우 변환 로직 추가
      return [];
    } catch (error) {
      console.error('재무 지표 변환 중 오류:', error);
      return [];
    }
  }, [financialDataForJson]);

  // 신용등급 계산
  const creditRatingForDirect = useMemo(() => {
    // 항상 값을 반환하도록 수정
    if (!reportData || 'json' in reportData) {
      return null;
    }

    // 1. jotai atom에 저장된 신용등급이 있으면 사용
    if (storedCreditRating) {
      console.log('jotai atom에서 신용등급 가져옴:', storedCreditRating);
      return storedCreditRating;
    }

    // 2. API에서 직접 제공하는 신용등급이 있으면 사용
    if (reportData.credit_rating) {
      console.log('API에서 제공된 신용등급:', reportData.credit_rating);
      // 객체 형태인 경우 credit_rating 속성 추출
      if (typeof reportData.credit_rating === 'object') {
        return reportData.credit_rating.credit_rating || null;
      }
      return reportData.credit_rating;
    }

    const report_data = reportData.report_data;
    const sections = reportData.sections || [];

    if (!report_data) {
      return null;
    }

    const financialSection = getFinancialSection(sections);

    if (financialSection) {
      console.log('재무 섹션 찾음:', financialSection.title);
      return extractCreditRating(financialSection.content);
    }

    console.log('재무 섹션을 찾을 수 없어 상세 내용에서 추출 시도');
    return extractCreditRating(report_data.detailed_content || '');
  }, [reportData, storedCreditRating]);

  // 신용등급 계산 - json 프로퍼티가 있는 경우용
  const creditRatingForJson = useMemo(() => {
    // 항상 값을 반환하도록 수정
    if (!reportData || !('json' in reportData) || !reportData.json) {
      return null;
    }

    // 1. jotai atom에 저장된 신용등급이 있으면 사용
    if (storedCreditRating) {
      console.log('jotai atom에서 신용등급 가져옴:', storedCreditRating);
      return storedCreditRating;
    }

    // 2. API에서 직접 제공하는 신용등급이 있으면 사용
    if (reportData.json.credit_rating) {
      console.log('API에서 제공된 신용등급 (json):', reportData.json.credit_rating);
      // 객체 형태인 경우 credit_rating 속성 추출
      if (typeof reportData.json.credit_rating === 'object') {
        return reportData.json.credit_rating.credit_rating || null;
      }
      return reportData.json.credit_rating;
    }

    const { report_data, sections = [] } = reportData.json;

    if (!report_data) {
      return null;
    }

    const financialSection = getFinancialSection(sections);

    if (financialSection) {
      console.log('재무 섹션 찾음:', financialSection.title);
      return extractCreditRating(financialSection.content);
    }

    console.log('재무 섹션을 찾을 수 없어 상세 내용에서 추출 시도');
    return extractCreditRating(report_data.detailed_content || '');
  }, [reportData, storedCreditRating]);

  const handleBack = () => {
    navigate(-1);
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
          zoom: 120% !important;
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
          /* 헤더와 푸터 제거 */
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
        
        .report-section {
          page-break-inside: avoid;
          overflow: visible !important;
          /* 카드 레이아웃만 제거하고 여백은 유지 */
          box-shadow: none !important;
          border: none !important;
          border-radius: 0 !important;
          background-color: transparent !important;
          /* margin과 padding은 제거하지 않음 */
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
        /* 특정 배경색 강제 적용 */
        .text-gray-500, .text-sm, .text-gray-600, .text-gray-700 {
          color: #6B7280 !important;
        }
        .bg-white, .bg-gray-50, .bg-gray-100 {
          background-color: #FFFFFF !important;
        }
        .bg-gray-200 {
          background-color: #E5E7EB !important;
        }
        
        /* 카드 레이아웃 관련 클래스 스타일 제거 (여백 유지) */
        .shadow, .shadow-sm, .shadow-md, .shadow-lg, .shadow-xl {
          box-shadow: none !important;
        }
        .rounded, .rounded-md, .rounded-lg, .rounded-xl {
          border-radius: 0 !important;
        }
        .border, .border-gray-100, .border-gray-200, .border-gray-300 {
          border: none !important;
        }
      }
      
      .financial-health-radar {
        zoom: 140% !important;
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

    // 문서 로딩 완료 후 인쇄 다이얼로그 표시
    printWindow.document.close();
    printWindow.onload = function () {
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        // 인쇄 후 창 닫기 (선택적)
        // printWindow.close();
      }, 1000); // 1초 지연으로 렌더링 완료 보장
    };
  };

  if (isLoading) {
    return (
      <div className='min-h-screen flex flex-col'>
        <Header onBack={handleBack} />
        <div className='flex-1 flex items-center justify-center'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4'></div>
            <h2 className='text-xl font-semibold text-gray-700'>보고서 생성 중...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (error || !reportData) {
    console.error('에러 또는 데이터 없음:', error, reportData);
    return (
      <div className='min-h-screen flex flex-col'>
        <Header onBack={handleBack} />
        <div className='flex-1 flex items-center justify-center'>
          <div className='text-center'>
            <h2 className='text-2xl font-bold text-gray-700 mb-4'>보고서를 찾을 수 없습니다</h2>
            <p className='text-gray-500 mb-6'>
              {error
                ? `오류 발생: ${(error as Error).message}`
                : '요청하신 보고서 데이터가 없습니다.'}
            </p>
            <button
              onClick={handleBack}
              className='px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition'
            >
              돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 디버깅을 위한 데이터 출력
  console.log('Report Data 전체:', reportData);

  // 응답 데이터 구조 확인
  const hasJsonProperty = reportData && 'json' in reportData;
  const hasReportData = hasJsonProperty && reportData.json && 'report_data' in reportData.json;
  const hasSections = hasJsonProperty && reportData.json && 'sections' in reportData.json;

  console.log('데이터 구조 확인:', {
    hasJsonProperty,
    hasReportData,
    hasSections,
    reportDataType: reportData ? typeof reportData : 'undefined',
    reportDataKeys: reportData ? Object.keys(reportData) : [],
  });

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // 마크다운을 HTML로 변환하는 함수
  const renderMarkdown = (content: string) => {
    if (!content) {
      return '';
    }
    return marked(content);
  };

  // 마크다운 텍스트에서 신용등급 추출
  const extractCreditRating = (content: string) => {
    if (!content) {
      return null;
    }

    // 신용등급 추출을 위한 정규식 패턴
    const creditRatingPattern = /신용\s*등급\s*[:|：]\s*([A-C][A-C]?[\+\-]?)/i;
    const ratingMatch = content.match(creditRatingPattern);

    if (ratingMatch && ratingMatch[1]) {
      console.log('추출된 신용등급:', ratingMatch[1]);
      return ratingMatch[1].toUpperCase();
    }

    // 다른 형태의 패턴도 시도
    const altPattern = /([A-C][A-C]?[\+\-]?)\s*등급/i;
    const altMatch = content.match(altPattern);

    if (altMatch && altMatch[1]) {
      console.log('대체 패턴으로 추출된 신용등급:', altMatch[1]);
      return altMatch[1].toUpperCase();
    }

    // 기본 등급 반환 (데이터가 없는 경우)
    console.log('신용등급을 찾을 수 없어 기본값 BBB 반환');
    return 'BBB';
  };

  // 보고서 데이터에서 섹션 내용 가져오기
  const renderReportContent = () => {
    // 데이터 구조 확인 및 로깅
    console.log('renderReportContent 호출됨, reportData:', reportData);

    if (!reportData) {
      console.error('reportData가 없음');
      return null;
    }

    // 응답이 직접 JSON 객체인 경우 (json 프로퍼티가 없는 경우)
    if (!('json' in reportData)) {
      console.log('json 프로퍼티가 없음, 직접 데이터 사용');
      // 직접 데이터 구조를 사용
      const report_data = reportData.report_data;
      const sections = reportData.sections || [];

      if (!report_data) {
        console.error('report_data가 없음');
        return null;
      }

      return (
        <div className='space-y-8'>
          {/* PDF 내보내기 버튼 */}
          <div className='flex justify-end mb-4'>
            <button
              onClick={() =>
                generatePDF(
                  reportContentRef.current,
                  `${report_data.company_name}_신용등급보고서.pdf`
                )
              }
              className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center gap-2'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4'
                />
              </svg>
              PDF 내보내기
            </button>
          </div>

          <div ref={reportContentRef}>
            {/* 요약 정보 */}
            <div className='report-section'>
              <div className='report-section-header'>
                <h1 className='text-2xl font-bold text-gray-800 mb-2'>
                  {report_data.company_name} 신용등급 보고서
                </h1>
                <h2 className='text-xl text-gray-600 mb-4'>{report_data.subtitle}</h2>
              </div>
              <div
                className='report-prose'
                dangerouslySetInnerHTML={{ __html: renderMarkdown(report_data.summary_content) }}
              />
            </div>

            {/* 신용등급 게이지 */}
            <CreditRatingGauge
              rating={typeof creditRatingForDirect === 'string' ? creditRatingForDirect : null}
            />

            {/* 재무 지표 차트 */}
            {financialMetricsForDirect && financialMetricsForDirect.length > 0 && (
              <FinancialMetricsChart
                metrics={financialMetricsForDirect}
                title='핵심 재무 지표'
                description='산업 평균과 비교한 기업의 주요 재무 지표'
              />
            )}

            {/* 재무건전성 레이더 차트 */}
            {financialDataForDirect && (
              <FinancialHealthRadar
                financialData={financialDataForDirect}
                title='재무 건전성 분석'
                description='주요 재무 지표를 기반으로 한 기업의 재무 건전성 분석'
              />
            )}

            {/* 각 섹션 */}
            {sections &&
              sections.map((section: any, index: number) => (
                <div key={index} className='report-section'>
                  <div className='report-section-header'>
                    <h2 className='report-section-title'>{section.title}</h2>
                    <p className='report-section-description'>{section.description}</p>
                  </div>
                  <div
                    className='report-prose'
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(section.content) }}
                  />
                </div>
              ))}

            {/* 상세 내용 */}
            {/*{report_data.detailed_content && (*/}
            {/*  <div className='report-section'>*/}
            {/*    <div className='report-section-header'>*/}
            {/*      <h2 className='report-section-title'>상세 보고서</h2>*/}
            {/*    </div>*/}
            {/*    <div*/}
            {/*      className='report-prose'*/}
            {/*      dangerouslySetInnerHTML={{ __html: renderMarkdown(report_data.detailed_content) }}*/}
            {/*    />*/}
            {/*  </div>*/}
            {/*)}*/}

            <div className='report-date'>
              생성일:{' '}
              {report_data.generation_date ||
                (reportData.generated_at ? formatDate(reportData.generated_at) : '날짜 정보 없음')}
            </div>
          </div>
        </div>
      );
    }

    // 기존 json 프로퍼티가 있는 경우의 처리
    if (!reportData.json) {
      console.error('reportData.json이 없음');
      return null;
    }

    const { report_data, sections = [] } = reportData.json;
    console.log('report_data:', report_data);
    console.log('sections:', sections);

    if (!report_data) {
      console.error('report_data가 없음');
      return null;
    }

    return (
      <div className='space-y-8'>
        {/* PDF 내보내기 버튼 */}
        <div className='flex justify-end mb-4'>
          <button
            onClick={() =>
              generatePDF(
                reportContentRef.current,
                `${report_data.company_name}_신용등급보고서.pdf`
              )
            }
            className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center gap-2'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4'
              />
            </svg>
            PDF 내보내기
          </button>
        </div>

        <div ref={reportContentRef}>
          {/* 요약 정보 */}
          <div className='report-section'>
            <div className='report-section-header'>
              <h1 className='text-2xl font-bold text-gray-800 mb-2'>{report_data.company_name}</h1>
              <h2 className='text-xl text-gray-600 mb-4'>{report_data.subtitle}</h2>
            </div>
            <div
              className='report-prose'
              dangerouslySetInnerHTML={{ __html: renderMarkdown(report_data.summary_content) }}
            />
          </div>

          {/* 신용등급 게이지 */}
          <CreditRatingGauge
            rating={typeof creditRatingForJson === 'string' ? creditRatingForJson : null}
          />

          {/* 재무 지표 차트 */}
          {financialMetricsForJson && financialMetricsForJson.length > 0 && (
            <FinancialMetricsChart
              metrics={financialMetricsForJson}
              title='핵심 재무 지표'
              description='산업 평균과 비교한 기업의 주요 재무 지표'
            />
          )}

          {/* 재무건전성 레이더 차트 */}
          {financialDataForJson && (
            <FinancialHealthRadar
              financialData={financialDataForJson}
              title='재무 건전성 분석'
              description='주요 재무 지표를 기반으로 한 기업의 재무 건전성 분석'
            />
          )}

          {/* 각 섹션 */}
          {sections &&
            sections.map((section: any, index: number) => (
              <div key={index} className='report-section'>
                <div className='report-section-header'>
                  <h2 className='report-section-title'>{section.title}</h2>
                  <p className='report-section-description'>{section.description}</p>
                </div>
                <div
                  className='report-prose'
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(section.content) }}
                />
              </div>
            ))}

          {/* 상세 내용 */}
          {/*{report_data.detailed_content && (*/}
          {/*  <div className='report-section'>*/}
          {/*    <div className='report-section-header'>*/}
          {/*      <h2 className='report-section-title'>상세 보고서</h2>*/}
          {/*    </div>*/}
          {/*    <div*/}
          {/*      className='report-prose'*/}
          {/*      dangerouslySetInnerHTML={{ __html: renderMarkdown(report_data.detailed_content) }}*/}
          {/*    />*/}
          {/*  </div>*/}
          {/*)}*/}

          <div className='report-date'>
            생성일:{' '}
            {report_data.generation_date ||
              (reportData.json.generated_at
                ? formatDate(reportData.json.generated_at)
                : '날짜 정보 없음')}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className='min-h-screen flex flex-col bg-gray-50'>
      <Header onBack={handleBack} />

      <div className='container mx-auto px-4 py-8 flex-1'>{renderReportContent()}</div>
    </div>
  );
};

export default ReportPageOld;
