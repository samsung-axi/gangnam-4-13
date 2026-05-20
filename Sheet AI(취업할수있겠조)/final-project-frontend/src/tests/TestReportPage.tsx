// 더미데이터 정의
import { useLocation, useNavigate } from 'react-router-dom';
import { useMemo, useRef, useState } from 'react';
import { Cell, Pie, PieChart } from 'recharts';
import Header from '@/shared/components/Header.tsx';

const dummyReportData = {
  json: {
    company_name: '삼성전자',
    report_data: {
      company_name: '삼성전자',
      subtitle: '금융 분석 | 신용평가',
      summary_content:
        '## 📘 신용분석 요약 카드\n\n기업명: 삼성전자\n평가일자: 2025년 06월 25일\n신용등급: A\n\n현재 등급 요약: \nA등급은 기업의 신용위험이 낮다는 것을 의미합니다. 삼성전자는 재무 건전성이 강하고, 사업 위험은 중간 수준이며, 산업 전망이 안정적이라는 평가를 받았습니다.\n\n주요 강점 키워드: \n강한 재무건전성, 안정적인 신용 전망, 높은 이익률\n\n주요 약점 키워드: \n시장 위험, 부채비율 증가, 매출증장 불확실성\n\n핵심 재무지표:\n- ROA: 6.70% (양호)\n- ROE: 8.57% (양호)\n- 부채비율: 27.93% (보통)\n- 영업이익률: 10.88% (우수)\n\n신용등급 변동 가능성:\n유지 가능성이 높으며, 그 이유는 현재의 재무 건전성과 안정적인 산업 전망, 그리고 높은 당기순이익률 때문입니다.',
      detailed_content: '상세한 분석 내용이 여기에 포함됩니다...',
      generation_date: '2025년 06월 25일',
      industry_name: '통신 및 방송장비 제조업',
      market_type: '유가증권시장',
    },
    sections: [
      {
        title: '기업 개요',
        description: '업력, 계열 구조, 산업 내 위치 등',
        content:
          "삼성전자는 1969년 설립된 통신 및 방송장비 제조업체로, 전 세계 전자산업의 주요 플레이어입니다. 유가증권시장에 상장되어 있으며, 매출액 300조원을 넘는 거대 기업입니다. 영업이익률과 당기순이익률은 각각 10.88%, 11.45%로 안정적인 수익성을 보여주고 있습니다. 총자산은 514조원에 달하며, 부채비율은 27.93%로 상대적으로 낮은 편입니다. ROA와 ROE는 각각 6.70%, 8.57%로 적정 수준을 유지하고 있습니다. 신용등급은 'A'로, 재무 건전성은 '강함', 사업 위험은 '보통', 산업 전망은 '안정적'으로 평가되었습니다.",
      },
      {
        title: '신용등급 평가 결과',
        description: '신용등급 현황 정리',
        content:
          "삼성전자의 신용등급은 'A'로, 재무 건전성은 '강함', 사업 위험은 '보통', 산업 전망은 '안정적'으로 평가되었습니다. 부채비율 27.93%는 적정 수준이며, ROA 6.70%, ROE 8.57%는 양호한 편입니다. 매출총자산회전율 0.58회는 자산 활용 효율을 보여줍니다. 신뢰도 점수는 85.0%로 높은 편입니다. 이를 통해 삼성전자의 신용 상태는 안정적이라고 볼 수 있습니다.",
      },
      {
        title: '재무상태 분석',
        description: '손익계산서, 재무상태표, 현금흐름표 분석',
        content:
          '삼성전자의 재무상태를 분석하면 다음과 같습니다.\n\n손익계산서를 보면, 매출액은 300조원에 달하며, 이 중 10.88%가 영업이익으로, 11.45%가 당기순이익으로 계상되었습니다. 이는 삼성전자가 안정적인 수익성을 유지하고 있음을 보여줍니다.\n\n재무상태표를 살펴보면, 총자산은 514조원으로, 이 중 27.93%가 부채로 구성되어 있습니다. 이는 삼성전자가 상대적으로 낮은 부채비율을 유지하고 있음을 의미합니다. 또한, 자본총계는 402조원으로, 총자산 대비 높은 비율을 차지하고 있어, 재무건전성이 높다고 판단할 수 있습니다.',
      },
      {
        title: '수익성 및 효율성 분석',
        description: 'ROE, ROA, 자산회전율 등 분석',
        content:
          '삼성전자의 수익성과 효율성을 분석해보면, ROA(총자산이익률)는 6.70%로, 총자산 대비 수익률을 나타내며, 이는 기업이 자산을 얼마나 효율적으로 이용하여 수익을 창출하는지를 보여줍니다. ROE(자기자본이익률)는 8.57%로, 자본을 얼마나 효율적으로 이용하여 수익을 창출하는지를 나타냅니다. 두 지표 모두 삼성전자의 수익 창출 능력이 높음을 보여줍니다.',
      },
      {
        title: '재무안정성 분석',
        description: '부채비율, 이자보상배수 등 분석',
        content:
          '삼성전자의 재무안정성은 매우 높은 편입니다. 부채비율이 27.93%로, 총자산 대비 부채의 비율이 낮아 재무적으로 안정적임을 확인할 수 있습니다. 이는 기업이 재무적 위험을 잘 관리하고 있음을 의미합니다. 또한 ROA와 ROE가 각각 6.70%, 8.57%로, 기업의 자산 및 자본을 효율적으로 운용하고 있음을 보여줍니다.',
      },
      {
        title: '산업 및 경쟁사 비교',
        description: '동종업계 내 위치 및 경쟁력',
        content:
          '삼성전자는 통신 및 방송장비 제조업에서 SK하이닉스, LG에너지솔루션 등과 경쟁하고 있습니다. 또한, 글로벌 시장에서는 화웨이, 에릭슨 등의 기업과 경쟁하고 있습니다. 삼성전자의 시장 점유율은 상당하지만, 경쟁은 매우 치열합니다.\n\n재무적으로 보면, 삼성전자의 영업이익률은 10.88%, 당기순이익률은 11.45%로 안정적입니다.',
      },
      {
        title: '리스크 요인 및 전망',
        description: '주요 리스크와 향후 전망',
        content:
          '삼성전자는 통신 및 방송장비 제조업에서 강력한 위치를 차지하고 있으며, 재무 건전성이 강하고 산업 전망이 안정적이라는 점에서 긍정적인 평가를 받고 있습니다. 그러나 몇 가지 리스크 요인을 고려해야 합니다.\n\n첫째, 재고 감소와 생산능력 증가는 수익성에 영향을 미칠 수 있습니다. 특히, 반도체 분야에서의 생산능력 상승은 시장 과잉과 가격 하락을 초래할 수 있습니다.',
      },
    ],
    credit_rating: {
      credit_rating: 'A',
      rating_details: {
        financial_strength: 'Strong',
        business_risk: 'Moderate',
        industry_outlook: 'Stable',
      },
      confidence_score: 0.85,
    },
    generated_at: '2025-06-25T19:02:30.649652',
    report_type: 'agent_based',
  },
};

const NewReportPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const reportRef = useRef<HTMLDivElement>(null);
  const [isPDFRendering, setIsPDFRendering] = useState(false);

  // 더미데이터 사용 (실제 API 호출 대신)
  const reportData = dummyReportData;

  // 신용등급 추출 (더미데이터 구조에 맞춤)
  const creditRating = useMemo(() => {
    if (reportData?.json?.credit_rating?.credit_rating) {
      return reportData.json.credit_rating.credit_rating;
    }
    return 'A'; // 기본값
  }, [reportData]);

  // 재무 지표 (더미데이터에서 추출)
  const financialMetrics = useMemo(() => {
    return {
      roa: 6.7,
      roe: 8.57,
      debtRatio: 27.93,
      operatingProfitMargin: 10.88,
    };
  }, []);

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

  // PDF 다운로드 함수 (기존과 동일)
  // 메모리 효율적인 PDF 생성 함수
  const downloadPDF = async () => {
    if (!reportRef.current) {
      return;
    }

    try {
      setIsPDFRendering(true);

      // 메모리 정리 함수
      const cleanupMemory = () => {
        if (window.gc) {
          window.gc(); // 가비지 컬렉션 강제 실행 (개발자 도구에서만 작동)
        }
      };

      const domtoimage = await import('dom-to-image');
      const jsPDF = (await import('jspdf')).default;

      console.log('PDF 생성 시작...');

      // 간단한 방법: 전체를 한 번에 캡처하고 자동 분할
      const element = reportRef.current;

      // 원본 스타일 저장
      const originalStyles = {
        maxWidth: element.style.maxWidth,
        width: element.style.width,
        transform: element.style.transform,
        position: element.style.position,
      };

      // PDF용 스타일 적용
      element.style.maxWidth = 'none';
      element.style.width = '794px';
      element.style.transform = 'scale(1)';
      element.style.position = 'static';

      await new Promise(resolve => setTimeout(resolve, 1000));

      const totalHeight = element.scrollHeight;
      const elementWidth = 794;

      console.log('요소 크기:', { width: elementWidth, height: totalHeight });

      // A4 페이지당 높이 (픽셀 기준)
      const pageHeightPx = 1000;
      const pageCount = Math.ceil(totalHeight / pageHeightPx);

      console.log(`총 ${pageCount}페이지로 분할 예정`);

      const pdf = new jsPDF('p', 'mm', 'a4');

      // 페이지별로 순차 처리 (메모리 절약)
      for (let page = 0; page < pageCount; page++) {
        console.log(`페이지 ${page + 1}/${pageCount} 생성 중...`);

        try {
          const yOffset = page * pageHeightPx;
          const remainingHeight = Math.min(pageHeightPx, totalHeight - yOffset);

          // 각 페이지별로 캡처
          const dataUrl = await domtoimage.toPng(element, {
            quality: 0.8, // 품질을 조금 낮춰서 메모리 절약
            bgcolor: '#ffffff',
            width: elementWidth,
            height: remainingHeight,
            style: {
              transform: `translateY(-${yOffset}px)`,
              transformOrigin: 'top left',
              margin: '0',
              padding: '0',
            },
          });

          if (page > 0) {
            pdf.addPage();
          }

          // 이미지를 즉시 PDF에 추가
          await new Promise((resolve, reject) => {
            const img = new Image();

            img.onload = () => {
              try {
                // A4 크기에 맞게 스케일링
                const pdfWidth = 210;
                const pdfHeight = 297;
                const margin = 10;

                const availableWidth = pdfWidth - margin * 2;
                const availableHeight = pdfHeight - margin * 2;

                const pxToMm = 25.4 / 96;
                const imgWidthMm = img.width * pxToMm;
                const imgHeightMm = img.height * pxToMm;

                const scale = Math.min(availableWidth / imgWidthMm, availableHeight / imgHeightMm);
                const finalWidth = imgWidthMm * scale;
                const finalHeight = imgHeightMm * scale;

                const x = (pdfWidth - finalWidth) / 2;
                const y = margin;

                pdf.addImage(dataUrl, 'PNG', x, y, finalWidth, finalHeight);

                // 이미지 메모리 해제
                img.src = '';
                resolve(void 0);
              } catch (error) {
                reject(error);
              }
            };

            img.onerror = reject;
            img.src = dataUrl;
          });

          // 페이지별 메모리 정리
          await new Promise(resolve => setTimeout(resolve, 100));
          cleanupMemory();
        } catch (pageError) {
          console.error(`페이지 ${page + 1} 생성 실패:`, pageError);
          // 에러가 나도 다음 페이지 계속 진행
        }
      }

      // 원본 스타일 복원
      Object.assign(element.style, originalStyles);

      const companyName = reportData?.json?.company_name || '삼성전자';
      pdf.save(`${companyName}_신용평가보고서_${pageCount}페이지.pdf`);

      console.log(`PDF 생성 완료: 총 ${pageCount}페이지`);
    } catch (error) {
      console.error('PDF 생성 실패:', error);
      alert('PDF 생성에 실패했습니다. 페이지를 새로고침 후 다시 시도해주세요.');
    } finally {
      setIsPDFRendering(false);
    }
  };

  // 더 간단한 백업 버전
  const downloadPDFSimple = async () => {
    if (!reportRef.current) {
      return;
    }

    try {
      setIsPDFRendering(true);
      console.log('간단한 PDF 생성 시작...');

      const domtoimage = await import('dom-to-image');
      const jsPDF = (await import('jspdf')).default;

      // 전체를 한 번에 캡처 (메모리 부족시 대안)
      const dataUrl = await domtoimage.toJpeg(reportRef.current, {
        quality: 0.7, // JPEG로 품질 낮춤
        bgcolor: '#ffffff',
        width: reportRef.current.offsetWidth,
        height: reportRef.current.scrollHeight,
      });

      console.log('이미지 캡처 완료');

      const pdf = new jsPDF('p', 'mm', 'a4');
      const img = new Image();

      img.onload = () => {
        console.log('PDF 생성 중...');

        const pdfWidth = 210;
        const pdfHeight = 297;
        const margin = 10;

        const availableWidth = pdfWidth - margin * 2;
        const availableHeight = pdfHeight - margin * 2;

        const widthRatio = availableWidth / (img.width * 0.264583);
        const heightRatio = availableHeight / (img.height * 0.264583);
        const ratio = Math.min(widthRatio, heightRatio);

        const finalWidth = img.width * 0.264583 * ratio;
        const finalHeight = img.height * 0.264583 * ratio;

        const x = (pdfWidth - finalWidth) / 2;
        const y = (pdfHeight - finalHeight) / 2;

        pdf.addImage(dataUrl, 'JPEG', x, y, finalWidth, finalHeight);

        const companyName = reportData?.json?.company_name || '삼성전자';
        pdf.save(`${companyName}_신용평가보고서_단순.pdf`);

        console.log('PDF 저장 완료');
      };

      img.src = dataUrl;
    } catch (error) {
      console.error('간단 PDF 생성 실패:', error);
      alert('PDF 생성에 실패했습니다.');
    } finally {
      setIsPDFRendering(false);
    }
  };

  // 헬퍼 함수들
  const getCompanyName = () => reportData?.json?.company_name || '삼성전자';
  const getSubtitle = () => reportData?.json?.report_data?.subtitle || '금융 분석 | 신용평가';
  const getGenerationDate = () =>
    reportData?.json?.report_data?.generation_date || '2025년 06월 25일';

  const handleBack = () => navigate(-1);

  // 신용등급 정보
  const ratingInfo = getRatingInfo(creditRating || 'A');

  // Recharts용 데이터
  const chartData = [
    { name: 'progress', value: ratingInfo.progress, fill: ratingInfo.color },
    { name: 'remaining', value: 100 - ratingInfo.progress, fill: '#e5e7eb' },
  ];

  return (
    <div>
      <Header onBack={handleBack} />
      <div className='flex justify-center p-5'>
        <button
          onClick={downloadPDF}
          className='px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium text-base shadow-lg hover:bg-blue-700 transition-colors'
        >
          PDF 다운로드
        </button>
      </div>

      {/* 리포트 컨텐츠 */}
      <div
        ref={reportRef}
        className='max-w-[794px] mx-auto bg-white shadow-md rounded-lg overflow-hidden'
      >
        {/* 헤더 부분 - 파란색 배경 */}
        <div className='bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8'>
          <h1 className='text-3xl font-bold mb-2'>{getCompanyName()} 신용등급 보고서</h1>
          <p className='text-blue-100 text-lg'>{getSubtitle()}</p>
        </div>

        {/* 메인 컨텐츠 */}
        <div className='p-8'>
          {/* 신용분석 요약 카드 */}
          <div className='bg-blue-50 rounded-lg p-6 mb-8 border-l-4 border-blue-500'>
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
                      <span className={`font-bold ml-0.5`} style={{ color: ratingInfo.color }}>
                        {creditRating || 'A'}
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
          <div className='mb-8'>
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
                  <div className={`text-6xl font-bold mb-2`} style={{ color: ratingInfo.color }}>
                    {creditRating || 'A'}
                  </div>
                  <div className='text-gray-600 text-sm font-medium'>투자 적격 등급</div>
                  <div className='text-gray-500 text-xs'>{ratingInfo.progress}% 신뢰도</div>
                </div>
              </div>
            </div>
          </div>

          {/* 섹션별 내용 */}
          {reportData?.json?.sections?.map((section: any, index: number) => (
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
          ))}

          {/* 푸터 */}
          <div className='mt-12 pt-6 border-t-2 border-gray-200 text-center'>
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

export default NewReportPage;
