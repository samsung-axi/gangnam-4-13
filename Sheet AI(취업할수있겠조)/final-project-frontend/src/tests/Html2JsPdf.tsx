// 필요한 import 추가
import React, { useRef } from 'react';
import { Cell, Pie, PieChart } from 'recharts';

interface CreditReportData {
  company_name: string;
  report_data: {
    subtitle: string;
    summary_content: string;
    generation_date: string;
  };
  credit_rating: {
    credit_rating: string;
    rating_details: {
      financial_strength: string;
      business_risk: string;
      industry_outlook: string;
    };
  };
}

const FixedCreditReport: React.FC<{ data: CreditReportData }> = ({ data }) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isPDFRendering, setIsPDFRendering] = React.useState(false);

  const downloadPDF = async () => {
    if (!reportRef.current) {
      return;
    }

    try {
      // PDF 렌더링 시작 - 스타일 조정
      setIsPDFRendering(true);

      // 약간의 지연을 주어 리렌더링 완료 대기
      await new Promise(resolve => setTimeout(resolve, 100));

      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;

      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        height: reportRef.current.scrollHeight,
        width: reportRef.current.scrollWidth,
        logging: false,
        ignoreElements: element => {
          const style = window.getComputedStyle(element);
          return style.backgroundImage.includes('oklch');
        },
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`${data.company_name}_신용평가보고서.pdf`);
    } catch (error) {
      console.error('PDF 생성 실패:', error);
      alert('PDF 생성에 실패했습니다.');
    } finally {
      // PDF 렌더링 완료 - 원래 스타일로 복원
      setIsPDFRendering(false);
    }
  };

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

  const ratingInfo = getRatingInfo(data.credit_rating.credit_rating);

  // Recharts용 데이터
  const chartData = [
    { name: 'progress', value: ratingInfo.progress, fill: ratingInfo.color },
    { name: 'remaining', value: 100 - ratingInfo.progress, fill: '#e5e7eb' },
  ];

  // 인라인 스타일 정의
  const styles = {
    container: {
      maxWidth: '1024px',
      margin: '0 auto',
      padding: '24px',
      backgroundColor: '#f9fafb',
      minHeight: '100vh',
    },
    downloadButton: {
      marginBottom: '24px',
      textAlign: 'center' as const,
    },
    button: {
      padding: '12px 32px',
      backgroundColor: '#2563eb',
      color: 'white',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '500',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    },
    reportContainer: {
      width: '794px',
      margin: '0 auto',
      backgroundColor: 'white',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      borderRadius: '16px',
      overflow: 'hidden',
      position: 'relative' as const,
    },
    header: {
      background: 'linear-gradient(to right, #2563eb, #1e40af)',
      color: 'white',
      padding: '32px',
    },
    headerTitle: {
      fontSize: '32px',
      fontWeight: 'bold',
      marginBottom: '8px',
      margin: '0',
    },
    headerSubtitle: {
      color: '#bfdbfe',
      fontSize: '18px',
      margin: '0',
    },
    content: {
      padding: '32px',
    },
    summaryCard: {
      backgroundColor: '#eff6ff',
      borderLeft: '4px solid #3b82f6',
      borderRadius: '8px',
      padding: '24px',
      marginBottom: '32px',
    },
    cardHeader: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '16px',
      minHeight: '32px',
    },
    cardIconCircle: {
      width: '24px',
      height: '24px',
      backgroundColor: '#3b82f6',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: '12px',
      color: 'white',
      fontSize: '14px',
      flexShrink: 0,
    },
    cardIcon: {
      // pdf 렌더링 시 위치 조정
      ...(isPDFRendering && {
        marginTop: '-14px', // 살짝 위로 이동
      }),
    },
    cardTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#1f2937',
      margin: '0',
    },
    infoGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '32px',
      alignItems: 'start',
    },
    infoText: {
      color: '#374151',
      marginBottom: '12px',
      fontSize: '14px',
      lineHeight: '1.5',
    },
    label: {
      fontWeight: '600',
    },
    ratingValue: {
      marginLeft: '8px',
      fontWeight: 'bold',
      color: ratingInfo.color,
    },
    metricsSection: {
      marginTop: '24px',
      paddingTop: '24px',
      borderTop: '1px solid #d1d5db',
    },
    metricsTitle: {
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: '16px',
      fontSize: '16px',
    },
    metricsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '20px',
      textAlign: 'center' as const,
    },
    metricItem: {
      textAlign: 'center' as const,
    },
    metricValue: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '4px',
    },
    metricGreen: {
      color: '#059669',
    },
    metricYellow: {
      color: '#d97706',
    },
    metricBlue: {
      color: '#2563eb',
    },
    metricLabel: {
      fontSize: '12px',
      color: '#6b7280',
    },
    ratingSection: {
      marginBottom: '32px',
    },
    sectionTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '24px',
      paddingBottom: '8px',
      borderBottom: '2px solid #e5e7eb',
    },
    ratingContainer: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
    },
    chartContainer: {
      position: 'relative' as const,
      width: '250px',
      height: '250px',
      marginBottom: '30px',
    },
    chartInner: {
      position: 'absolute' as const,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      textAlign: 'center' as const,
      zIndex: 10,
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      // PDF 렌더링 시 위치 조정
    },
    ratingText: {
      fontSize: '48px',
      fontWeight: 'bold',
      color: ratingInfo.color,
      lineHeight: '1',
      margin: '0',
    },
    creditRating: {
      ...(isPDFRendering && {
        marginTop: '-14px', // 살짝 위로 이동
        marginBottom: '14px',
      }),
    },
    ratingSubtext: {
      fontSize: '13px',
      color: '#6b7280',
      margin: '4px 0',
    },
    progressText: {
      fontSize: '11px',
      color: '#9ca3af',
      margin: '0',
    },
    detailsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '20px',
      width: '100%',
      maxWidth: '600px',
    },
    detailCard: {
      textAlign: 'center' as const,
      padding: '24px 16px',
      borderRadius: '12px',
      minHeight: '140px',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'flex-start',
      gap: '8px',
    },
    detailCardGreen: {
      backgroundColor: '#f0fdf4',
    },
    detailCardYellow: {
      backgroundColor: '#fefce8',
    },
    detailCardBlue: {
      backgroundColor: '#eff6ff',
    },
    detailTitle: {
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: '8px',
      fontSize: '14px',
      lineHeight: '1.2',
    },
    detailValueGreen: {
      color: '#059669',
      fontWeight: '600',
      fontSize: '15px',
    },
    detailValueYellow: {
      color: '#d97706',
      fontWeight: '600',
      fontSize: '15px',
    },
    detailValueBlue: {
      color: '#2563eb',
      fontWeight: '600',
      fontSize: '15px',
    },
    descriptionSection: {
      backgroundColor: '#f9fafb',
      borderRadius: '8px',
      padding: '24px',
      marginBottom: '32px',
    },
    descriptionTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '16px',
    },
    descriptionText: {
      color: '#374151',
      lineHeight: '1.75',
      fontSize: '14px',
    },
    footer: {
      textAlign: 'center' as const,
      paddingTop: '24px',
      borderTop: '1px solid #e5e7eb',
    },
    footerText: {
      fontSize: '12px',
      color: '#9ca3af',
      marginBottom: '4px',
    },
    footerDate: {
      fontSize: '12px',
      color: '#6b7280',
    },
  };

  return (
    <div style={styles.container}>
      {/* PDF 다운로드 버튼 */}
      <div style={styles.downloadButton}>
        <button
          onClick={downloadPDF}
          style={styles.button}
          onMouseOver={e => {
            e.currentTarget.style.backgroundColor = '#1d4ed8';
          }}
          onMouseOut={e => {
            e.currentTarget.style.backgroundColor = '#2563eb';
          }}
        >
          📄 PDF 다운로드
        </button>
      </div>

      {/* PDF로 변환될 영역 */}
      <div ref={reportRef} style={styles.reportContainer}>
        {/* 헤더 */}
        <div style={styles.header}>
          <h1 style={styles.headerTitle}>{data.company_name} 신용등급 보고서</h1>
          <p style={styles.headerSubtitle}>{data.report_data.subtitle}</p>
        </div>

        {/* 메인 콘텐츠 */}
        <div style={styles.content}>
          {/* 신용분석 요약 카드 */}
          <div style={styles.summaryCard}>
            <div style={styles.cardHeader}>
              <div style={styles.cardIconCircle}>
                <span style={styles.cardIcon}>📊</span>
              </div>
              <h2 style={styles.cardTitle}>신용분석 요약 카드</h2>
            </div>

            <div style={styles.infoGrid}>
              <div>
                <p style={styles.infoText}>
                  <span style={styles.label}>기업명:</span> {data.company_name}
                </p>
                <p style={styles.infoText}>
                  <span style={styles.label}>평가일자:</span> {data.report_data.generation_date}
                </p>
                <p style={styles.infoText}>
                  <span style={styles.label}>신용등급:</span>
                  <span style={styles.ratingValue}>{data.credit_rating.credit_rating}</span>
                </p>
              </div>

              <div>
                <div style={styles.infoText}>
                  <span style={styles.label}>주요 강점 키워드:</span>
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    marginBottom: '16px',
                    lineHeight: '1.4',
                  }}
                >
                  강한 재무건전성, 안정적인 산업 전망, 높은 이익률
                </div>
                <div style={styles.infoText}>
                  <span style={styles.label}>주요 약점 키워드:</span>
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: '1.4' }}>
                  사업 위험, 부채비율, 매출총자산회전율
                </div>
              </div>
            </div>

            {/* 핵심 재무지표 */}
            <div style={styles.metricsSection}>
              <h3 style={styles.metricsTitle}>핵심 재무지표:</h3>
              <div style={styles.metricsGrid}>
                <div style={styles.metricItem}>
                  <div style={{ ...styles.metricValue, ...styles.metricGreen }}>6.70%</div>
                  <div style={styles.metricLabel}>ROA (양호)</div>
                </div>
                <div style={styles.metricItem}>
                  <div style={{ ...styles.metricValue, ...styles.metricGreen }}>8.57%</div>
                  <div style={styles.metricLabel}>ROE (양호)</div>
                </div>
                <div style={styles.metricItem}>
                  <div style={{ ...styles.metricValue, ...styles.metricYellow }}>27.93%</div>
                  <div style={styles.metricLabel}>부채비율 (보통)</div>
                </div>
                <div style={styles.metricItem}>
                  <div style={{ ...styles.metricValue, ...styles.metricBlue }}>10.88%</div>
                  <div style={styles.metricLabel}>영업이익률 (우수)</div>
                </div>
              </div>
            </div>
          </div>

          {/* 신용등급 섹션 */}
          <div style={styles.ratingSection}>
            <h2 style={styles.sectionTitle}>신용등급</h2>

            <div style={styles.ratingContainer}>
              {/* Recharts 원형 차트 */}
              <div style={styles.chartContainer}>
                <PieChart width={250} height={250}>
                  <Pie
                    data={chartData}
                    cx={125}
                    cy={125}
                    innerRadius={70}
                    outerRadius={100}
                    startAngle={90}
                    endAngle={-270}
                    dataKey='value'
                    stroke='none'
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>

                {/* 중앙 텍스트 */}
                <div style={styles.chartInner}>
                  <div style={styles.ratingText}>
                    <div style={styles.creditRating}>{data.credit_rating.credit_rating}</div>
                  </div>
                  <div style={styles.ratingSubtext}>투자 적격 등급</div>
                  <div style={styles.progressText}>{ratingInfo.progress}% 신뢰도</div>
                </div>
              </div>

              {/* 등급 세부사항 */}
              <div style={styles.detailsGrid}>
                <div style={{ ...styles.detailCard, ...styles.detailCardGreen }}>
                  <div
                    style={{
                      fontSize: '32px',
                      marginBottom: '12px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    💪
                  </div>
                  <div style={styles.detailTitle}>재무 건전성</div>
                  <div style={styles.detailValueGreen}>
                    {data.credit_rating.rating_details.financial_strength}
                  </div>
                </div>

                <div style={{ ...styles.detailCard, ...styles.detailCardYellow }}>
                  <div
                    style={{
                      fontSize: '32px',
                      marginBottom: '12px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    ⚡
                  </div>
                  <div style={styles.detailTitle}>사업 위험</div>
                  <div style={styles.detailValueYellow}>
                    {data.credit_rating.rating_details.business_risk}
                  </div>
                </div>

                <div style={{ ...styles.detailCard, ...styles.detailCardBlue }}>
                  <div
                    style={{
                      fontSize: '32px',
                      marginBottom: '12px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    📈
                  </div>
                  <div style={styles.detailTitle}>산업 전망</div>
                  <div style={styles.detailValueBlue}>
                    {data.credit_rating.rating_details.industry_outlook}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 신용등급 변동 가능성 */}
          <div style={styles.descriptionSection}>
            <h3 style={styles.descriptionTitle}>신용등급 변동 가능성:</h3>
            <p style={styles.descriptionText}>
              유지 가능성이 높으며, 그 이유는 {data.company_name}의 강한 재무건전성과 안정적인 산업
              전망 때문입니다. 그러나 사업 위험과 부채비율, 매출총자산회전율 등의 약점이 개선되지
              않을 경우 하향 조정될 수 있습니다.
            </p>
          </div>

          {/* 푸터 */}
          <div style={styles.footer}>
            <p style={styles.footerText}>
              본 보고서는 AI 기반 신용평가 시스템에 의해 생성되었습니다.
            </p>
            <p style={styles.footerDate}>생성일: {data.report_data.generation_date}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// 사용 예제
const ExampleUsage: React.FC = () => {
  const sampleData: CreditReportData = {
    company_name: '삼성전자',
    report_data: {
      subtitle: '금융 분석 | 신용평가',
      summary_content: "A 등급은 '강한 재무건전성'과 '안정적인 산업 전망'을 반영한 등급입니다.",
      generation_date: '2025년 06월 22일',
    },
    credit_rating: {
      credit_rating: 'A',
      rating_details: {
        financial_strength: 'Strong',
        business_risk: 'Moderate',
        industry_outlook: 'Stable',
      },
    },
  };

  return <FixedCreditReport data={sampleData} />;
};

export default ExampleUsage;
