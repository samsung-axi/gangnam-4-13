import { marked } from 'marked';

/**
 * 마크다운 텍스트를 HTML로 변환합니다.
 */
export const renderMarkdown = (content: string): string | Promise<string> => {
  if (!content) {
    return '';
  }
  return marked(content);
};

/**
 * 마크다운 텍스트에서 신용등급을 추출합니다.
 */
export const extractCreditRating = (content: string): string | null => {
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

/**
 * 재무 섹션을 찾습니다.
 */
export const getFinancialSection = (sections: any[] = []) => {
  return sections?.find(
    (section: any) =>
      section.title.includes('재무') ||
      section.title.includes('금융') ||
      section.title.includes('분석')
  );
};

/**
 * 날짜 문자열을 포맷팅합니다.
 */
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch (e) {
    return dateString; // 날짜 변환 실패 시 원본 문자열 반환
  }
};
