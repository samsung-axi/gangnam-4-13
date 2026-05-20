import React from 'react';
import { Document, Font, Page, PDFDownloadLink, StyleSheet, Text, View } from '@react-pdf/renderer';

// 로컬 한글 폰트 등록
Font.register({
  family: 'NotoSansKR',
  src: '/fonts/NotoSansKR-Regular.ttf', // public/fonts/ 폴더에 파일 필요
});

// 데이터 타입
export interface CreditReportData {
  company_name: string;
  report_data: {
    company_name: string;
    subtitle: string;
    summary_content: string;
    generation_date: string;
  };
  sections: Array<{
    title: string;
    description: string;
    content: string;
  }>;
  credit_rating: {
    credit_rating: string;
    rating_details: {
      financial_strength: string;
      business_risk: string;
      industry_outlook: string;
    };
  };
}

// 스크린샷 스타일을 기반으로 한 PDF 스타일 정의
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'NotoSansKR',
    backgroundColor: '#FFFFFF',
  },
  header: {
    marginBottom: 20,
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 10,
  },
  dateInfo: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'right',
    marginTop: 5,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 10,
    marginTop: 20,
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: 5,
  },
  creditRatingBox: {
    backgroundColor: '#F3F4F6',
    padding: 15,
    marginBottom: 20,
    borderRadius: 5,
  },
  creditRatingTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 10,
  },
  creditRating: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10B981', // 녹색 계열
    textAlign: 'center',
    marginBottom: 10,
  },
  ratingDetails: {
    marginTop: 10,
  },
  ratingDetailItem: {
    fontSize: 10,
    color: '#4B5563',
    marginBottom: 5,
  },
  section: {
    marginBottom: 15,
    paddingTop: 5,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 8,
  },
  content: {
    fontSize: 10,
    lineHeight: 1.5,
    color: '#4B5563',
    textAlign: 'justify',
  },
  summaryCard: {
    backgroundColor: '#F9FAFB',
    padding: 15,
    marginBottom: 20,
    borderRadius: 5,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#111827',
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  bulletPoint: {
    width: 10,
    fontSize: 10,
  },
  listItemText: {
    fontSize: 10,
    color: '#4B5563',
    flex: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 8,
    color: '#9CA3AF',
    textAlign: 'center',
    borderTop: '1px solid #e5e7eb',
    paddingTop: 10,
  },
});

// 마크다운 스타일 텍스트를 플레인 텍스트로 변환 (간단한 버전)
const cleanText = (text: string) => {
  if (!text) {
    return '';
  }
  return text
    .replace(/#{1,6}\s/g, '') // 헤더 마크다운 제거
    .replace(/\*\*(.*?)\*\*/g, '$1') // 볼드 마크다운 제거
    .replace(/\*(.*?)\*/g, '$1') // 이탤릭 마크다운 제거
    .replace(/- /g, '• ') // 리스트 마커 변경
    .trim();
};

// 리스트 항목 추출 함수
const extractListItems = (text: string) => {
  if (!text) return [];
  const items = text.split('\n').filter(line => line.trim().startsWith('•') || line.trim().startsWith('-'));
  return items.map(item => item.replace(/^[•-]\s*/, '').trim());
};

// PDF 문서
const SimplePDF: React.FC<{ data: CreditReportData }> = ({ data }) => {
  // 요약 내용에서 주요 재무 지표 추출
  const financialMetrics = extractListItems(data.report_data.summary_content)
    .filter(item => item.includes(':') && 
      (item.includes('ROA') || item.includes('ROE') || item.includes('부채비율') || item.includes('영업이익률')));

  return (
    <Document>
      <Page size='A4' style={styles.page}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.title}>{data.company_name} 신용등급 보고서</Text>
          <Text style={styles.subtitle}>금융 분석 | 신용평가</Text>
          <Text style={styles.dateInfo}>생성일: {data.report_data.generation_date}</Text>
        </View>

        {/* 신용등급 요약 카드 */}
        <View style={styles.creditRatingBox}>
          <Text style={styles.creditRatingTitle}>신용등급</Text>
          <Text style={styles.creditRating}>{data.credit_rating.credit_rating}</Text>
          <View style={styles.ratingDetails}>
            <Text style={styles.ratingDetailItem}>
              재무건전성: {data.credit_rating.rating_details.financial_strength}
            </Text>
            <Text style={styles.ratingDetailItem}>
              사업위험: {data.credit_rating.rating_details.business_risk}
            </Text>
            <Text style={styles.ratingDetailItem}>
              산업전망: {data.credit_rating.rating_details.industry_outlook}
            </Text>
          </View>
        </View>

        {/* 요약 */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>신용분석 요약 카드</Text>
          <Text style={styles.content}>
            기업명: {data.company_name}{'\n'}
            평가일자: {data.report_data.generation_date}{'\n'}
            신용등급: {data.credit_rating.credit_rating}
          </Text>
          
          {/* 주요 강점/약점 키워드 */}
          <View style={{marginTop: 10}}>
            <Text style={styles.sectionTitle}>주요 강점 키워드</Text>
            <Text style={styles.content}>
              강한 재무건전성, 안정적인 산업 전망, 높은 이익률
            </Text>
          </View>
          
          <View style={{marginTop: 10}}>
            <Text style={styles.sectionTitle}>주요 약점 키워드</Text>
            <Text style={styles.content}>
              사업 위험, 부채비율, 매출총자산회전율
            </Text>
          </View>
          
          {/* 핵심 재무지표 */}
          <View style={{marginTop: 10}}>
            <Text style={styles.sectionTitle}>핵심 재무지표</Text>
            {financialMetrics.map((metric, index) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.bulletPoint}>•</Text>
                <Text style={styles.listItemText}>{metric}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 섹션들 */}
        <Text style={styles.sectionHeader}>요약</Text>
        <View style={styles.section}>
          <Text style={styles.content}>{cleanText(data.sections[0]?.content || '')}</Text>
        </View>
        
        <Text style={styles.sectionHeader}>기업 개요</Text>
        <View style={styles.section}>
          <Text style={styles.content}>{cleanText(data.sections[1]?.content || '')}</Text>
        </View>
      </Page>

      {/* 추가 페이지 - 나머지 섹션들 */}
      <Page size='A4' style={styles.page}>
        <Text style={styles.title}>{data.company_name} 신용평가보고서</Text>
        <Text style={styles.subtitle}>상세 분석</Text>

        <Text style={styles.sectionHeader}>재무 분석</Text>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>수익성 분석</Text>
          <Text style={styles.content}>
            ROA(총자산이익률): 6.70%로, {data.company_name}가 자산을 통해 얼마나 효율적으로 수익을 창출하는지를 나타냅니다.{'\n'}
            ROE(자기자본이익률): 8.57%로, 주주들이 투자한 자본에 대해 회사가 얼마나 효율적으로 이익을 창출하는지를 나타냅니다.{'\n'}
            영업이익률: 10.88%로, 매출액 대비 영업이익이 얼마나 창출되었는지를 나타냅니다.
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>안정성 분석</Text>
          <Text style={styles.content}>
            부채비율: 27.93%로, {data.company_name}의 총 자본 대비 부채의 비율을 나타냅니다. 상대적으로 낮은 부채비율은 재무 안정성을 나타냅니다.
          </Text>
        </View>

        <Text style={styles.sectionHeader}>신용등급 평가</Text>
        <View style={styles.section}>
          <Text style={styles.content}>{cleanText(data.sections[2]?.content || '')}</Text>
        </View>

        {/* 푸터 */}
        <View style={styles.footer}>
          <Text>
            {new Date().getFullYear()} 신용평가 보고서 | 본 문서는 자동 생성되었습니다.
          </Text>
        </View>
      </Page>
    </Document>
  );
};

// 다운로드 버튼
const PDFDownloader: React.FC<{ data: CreditReportData }> = ({ data }) => {
  return (
    <PDFDownloadLink
      document={<SimplePDF data={data} />}
      fileName={`${data.company_name}_신용평가보고서.pdf`}
      style={{
        padding: '10px 20px',
        backgroundColor: '#3B82F6',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '5px',
        display: 'inline-block',
        fontFamily: 'sans-serif',
        fontWeight: 'bold',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        cursor: 'pointer',
      }}
    >
      {({ loading }) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {loading ? (
            <>
              <span style={{ display: 'inline-block', animation: 'spin 2s linear infinite' }}>
                ⟳
              </span>
              PDF 생성 중...
            </>
          ) : (
            <>
              <span>📥</span>
              PDF 다운로드
            </>
          )}
        </div>
      )}
    </PDFDownloadLink>
  );
};

export { SimplePDF, PDFDownloader };
