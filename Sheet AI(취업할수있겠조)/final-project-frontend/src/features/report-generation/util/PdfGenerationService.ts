import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { devError, devLog } from '@/shared/util/logger';

export default class PdfGenerationService {
  static applyPdfCompatibleStyles(element: HTMLElement): void {
    element.classList.add('pdf-mode');

    const style = document.createElement('style');
    style.id = 'pdf-compatibility-styles';
    style.textContent = `
      /* PDF 모드 기본 설정 */
      .pdf-mode {
        font-family: 'Noto Sans KR', sans-serif !important;
        background: white !important;
        color: black !important;
      }
      
      .pdf-mode * {
        box-shadow: none !important;
        text-shadow: none !important;
      }
      
      .pdf-mode .no-print {
        display: none !important;
      }
      
      .pdf-mode .print-only {
        display: block !important;
      }
      
      /* 핵심 개선: 섹션별 페이지 나누기 제어 강화 */
      .pdf-mode .report-section {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
        page-break-before: auto !important;
        break-before: auto !important;
        margin-bottom: 25px !important;
        padding-bottom: 15px !important;
        border-bottom: 0px solid #e5e7eb !important;
        min-height: 100px !important;
      }
      
      /* 섹션 제목과 내용을 함께 유지 */
      .pdf-mode .report-section-header {
        page-break-after: avoid !important;
        break-after: avoid !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }
      
      .pdf-mode .report-section-title {
        page-break-after: avoid !important;
        break-after: avoid !important;
        margin-top: -7px !important;
        margin-bottom: 12px !important;
        font-weight: bold !important;
      }
      
      .pdf-mode .report-section-description {
        page-break-after: avoid !important;
        break-after: avoid !important;
        margin-top: -7px !important;
        margin-bottom: 12px !important;
      }
      
      /* 분석 내용 블록을 완전히 보호 */
      .pdf-mode .prose {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }
      
      .pdf-mode .prose p {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
        margin-bottom: 8px !important;
      }
      
      .pdf-mode .prose ul, .pdf-mode .prose ol {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }
      
      /* 제목들 */
      .pdf-mode h1, .pdf-mode h2, .pdf-mode h3, .pdf-mode h4 {
        page-break-after: avoid !important;
        break-after: avoid !important;
        break-inside: avoid !important;
        page-break-inside: avoid !important;
      }
      
      .pdf-mode .avoid-break {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }
      
      /* 재무안정성 분석 섹션 특별 처리 강화 */
      .pdf-mode .financial-stability {
        page-break-before: auto !important;
        page-break-after: avoid !important;
        break-before: auto !important;
        break-after: avoid !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
        min-height: 250px !important;
        margin-bottom: 30px !important;
      }
      
      /* 분석 섹션들 간격 및 구분 */
      .pdf-mode .analysis-section {
        margin-bottom: 25px !important;
        padding-bottom: 15px !important;
        border-bottom: 0px solid #e5e7eb !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }
      
      /* 뉴스 섹션 PDF 전용 스타일 - 제목과 내용을 한 페이지에 강화 */
      .pdf-mode .news-section {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
        page-break-before: auto !important;
        break-before: auto !important;
        margin-bottom: 30px !important;
        min-height: 250px !important;
        padding: 15px !important;
        border: 0px solid #e5e7eb !important;
        border-radius: 8px !important;
        background-color: #ffffff !important;
      }
      
      .pdf-mode .news-section h3 {
        page-break-after: avoid !important;
        break-after: avoid !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
        margin-bottom: 18px !important;
        font-size: 16px !important;
        font-weight: bold !important;
        color: #1f2937 !important;
      }
      
      .pdf-mode .news-container {
        page-break-before: avoid !important;
        break-before: avoid !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
        page-break-after: avoid !important;
        break-after: avoid !important;
        margin-top: 0 !important;
      }
      
      .pdf-mode .news-item {
        margin-bottom: 12px !important;
        padding: 12px !important;
        padding-bottom: 26px !important;
        border: 1px solid #d1d5db !important;
        border-radius: 6px !important;
        background-color: #ffffff !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
        page-break-before: avoid !important;
        break-before: avoid !important;
        page-break-after: avoid !important;
        break-after: avoid !important;
        min-height: 60px !important;
      }
      
      .pdf-mode .news-title {
        font-size: 14px !important;
        font-weight: 600 !important;
        color: #2563eb !important;
        margin-bottom: 8px !important;
        line-height: 1.4 !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }
      
      .pdf-mode .news-url {
        font-size: 11px !important;
        color: #6b7280 !important;
        word-break: break-all !important;
        line-height: 1.3 !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }
      
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
      .pdf-mode .text-yellow-500 { color: #eab308 !important; }
      .pdf-mode .text-orange-600 { color: #ea580c !important; }
      .pdf-mode .text-red-500 { color: #ef4444 !important; }
      .pdf-mode .text-white { color: #ffffff !important; }
      
      .pdf-mode .bg-blue-50 { background-color: #eff6ff !important; }
      .pdf-mode .bg-blue-500 { color: #ffffff !important; background-color: #3b82f6 !important; }
      .pdf-mode .bg-blue-600 { background-color: #2563eb !important; }
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
        margin-top: 7px !important;
      }
      
      .pdf-mode .summary-card-icon-container{
        margin-bottom: -21px !important;
      }
      
      .pdf-mode .summary-card-icon{
        margin-top: -10px !important;
        margin-left: 0.5px !important;
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
  }

  static removePdfCompatibleStyles(element: HTMLElement): void {
    element.classList.remove('pdf-mode');
    const style = document.getElementById('pdf-compatibility-styles');
    if (style) {
      style.remove();
    }
  }

  static async generateSmartPDF(
    elementToConvert: HTMLElement | null,
    fileName: string = 'report.pdf'
  ): Promise<boolean> {
    if (!elementToConvert) {
      devError('PDF 생성을 위한 요소를 찾을 수 없습니다.');
      return false;
    }

    try {
      devLog('스마트 PDF 생성 중...');

      // 1. PDF 호환 모드 활성화
      this.applyPdfCompatibleStyles(elementToConvert);
      await new Promise(resolve => setTimeout(resolve, 150));

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
        imageTimeout: 30000,
        logging: true,
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

          const printOnly = clonedDoc.querySelectorAll('.print-only');
          printOnly.forEach(el => {
            (el as HTMLElement).style.display = 'block';
          });

          // 이미지 로딩 상태 확인 및 대체
          const images = clonedDoc.querySelectorAll('img');
          devLog(`PDF 생성: ${images.length}개의 이미지 발견`);
          images.forEach((img, index) => {
            if (!img.complete) {
              devLog(`이미지 ${index + 1}가 아직 로드되지 않음: ${img.src}`);
            } else if (img.naturalWidth === 0) {
              devLog(`이미지 ${index + 1} 로드 실패: ${img.src}`);
              img.src =
                'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJmZWF0aGVyIGZlYXRoZXItaW1hZ2UiPjxyZWN0IHg9IjMiIHk9IjMiIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgcng9IjIiIHJ5PSIyIj48L3JlY3Q+PGNpcmNsZSBjeD0iOC41IiBjeT0iOC41IiByPSIxLjUiPjwvY2lyY2xlPjxwb2x5bGluZSBwb2ludHM9IjIxIDE1IDE2IDEwIDUgMjEiPjwvcG9seWxpbmU+PC9zdmc+';
            }
          });
        },
      });

      // 3. 개선된 페이지 나누기 포인트 찾기
      const breakPoints = await this.findOptimalBreakPoints(
        elementToConvert,
        contentHeight,
        fullCanvas.height
      );

      // 4. 각 페이지별로 캔버스 분할하여 PDF 생성
      let currentY = 0;
      let pageNumber = 0;

      devLog('페이지 나누기 지점:', breakPoints);
      devLog('전체 캔버스 높이:', fullCanvas.height);

      for (let i = 0; i < breakPoints.length; i++) {
        const nextBreakPoint = breakPoints[i];
        const pageHeight = nextBreakPoint - currentY;

        if (pageHeight <= 10) {
          devLog(`페이지 ${pageNumber + 1}의 높이가 너무 작음:`, pageHeight);
          continue;
        }

        devLog(
          `페이지 ${pageNumber + 1} 생성: ${currentY} ~ ${nextBreakPoint} (높이: ${pageHeight})`
        );

        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = fullCanvas.width;
        pageCanvas.height = pageHeight;

        const pageCtx = pageCanvas.getContext('2d');
        if (pageCtx) {
          pageCtx.drawImage(
            fullCanvas,
            0,
            currentY,
            fullCanvas.width,
            pageHeight,
            0,
            0,
            fullCanvas.width,
            pageHeight
          );

          if (pageNumber > 0) {
            pdf.addPage();
          }

          const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.95);
          const pdfPageHeight = (pageHeight * contentWidth) / fullCanvas.width;

          pdf.addImage(pageImgData, 'JPEG', margins.left, margins.top, contentWidth, pdfPageHeight);
        }

        currentY = nextBreakPoint;
        pageNumber++;
      }

      // 마지막 페이지 추가 (남은 내용이 있는 경우)
      if (currentY < fullCanvas.height) {
        const remainingHeight = fullCanvas.height - currentY;
        devLog(`마지막 페이지 추가: ${currentY} ~ ${fullCanvas.height} (높이: ${remainingHeight})`);

        if (remainingHeight > 10) {
          const pageCanvas = document.createElement('canvas');
          pageCanvas.width = fullCanvas.width;
          pageCanvas.height = remainingHeight;

          const pageCtx = pageCanvas.getContext('2d');
          if (pageCtx) {
            pageCtx.drawImage(
              fullCanvas,
              0,
              currentY,
              fullCanvas.width,
              remainingHeight,
              0,
              0,
              fullCanvas.width,
              remainingHeight
            );

            pdf.addPage();
            const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.95);
            const pdfPageHeight = (remainingHeight * contentWidth) / fullCanvas.width;
            pdf.addImage(
              pageImgData,
              'JPEG',
              margins.left,
              margins.top,
              contentWidth,
              pdfPageHeight
            );
          }
        }
      }

      pdf.save(fileName);
      devLog('스마트 PDF 생성 완료');
      return true;
    } catch (error) {
      devError('스마트 PDF 생성 중 오류:', error);
      throw error;
    } finally {
      if (elementToConvert) {
        this.removePdfCompatibleStyles(elementToConvert);
      }
    }
  }

  private static async findOptimalBreakPoints(
    element: HTMLElement,
    maxPageHeight: number,
    totalCanvasHeight: number
  ): Promise<number[]> {
    const scale = 2;
    const maxPagePixels = maxPageHeight * scale * (element.scrollWidth / 180);

    devLog('최대 페이지 픽셀 높이:', maxPagePixels);
    devLog('전체 캔버스 높이:', totalCanvasHeight);

    // 1. 더 정확한 섹션 선택자 사용 - report-section 우선순위 높임
    const sectionSelectors = [
      '.report-section', // 최우선: 메인 보고서 섹션
      '[data-section]', // 명시적 섹션 마커
      '.financial-stability', // 재무안정성 섹션 특별 처리
      '.news-section', // 뉴스 섹션
      'h1',
      'h2',
      'h3',
      'h4', // 제목들
      '.avoid-break', // 페이지 나누기 방지 요소
      '.section-header', // 섹션 헤더
      '.analysis-section', // 분석 섹션
      '.mb-8', // 큰 여백을 가진 섹션들
      '.bg-blue-50', // 요약 카드
      '[class*="analysis"]', // analysis가 포함된 클래스
      '.border-b', // 구분선이 있는 요소들
    ];

    const sections = Array.from(element.querySelectorAll(sectionSelectors.join(', ')))
      .filter(Boolean)
      .filter((el, index, arr) => arr.indexOf(el) === index); // 중복 제거

    // 2. 각 섹션의 정확한 위치 정보 수집
    const sectionPositions: {
      element: Element;
      top: number;
      height: number;
      bottom: number;
      isTitle: boolean;
      priority: number;
      text: string;
    }[] = [];

    const elementRect = element.getBoundingClientRect();

    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const relativeTop = (rect.top - elementRect.top) * scale;
      const height = rect.height * scale;
      const bottom = relativeTop + height;

      // 섹션 우선순위 계산 - report-section 최우선
      let priority = 1;
      const tagName = section.tagName.toLowerCase();
      const className = section.className || '';
      const text = section.textContent?.slice(0, 50) || '';

      // 메인 보고서 섹션들 최우선
      if (className.includes('report-section')) priority = 15;
      else if (className.includes('news-section') || text.includes('관련 최신 기사') || text.includes('뉴스')) priority = 14;
      else if (['h1', 'h2'].includes(tagName)) priority = 12;
      else if (className.includes('avoid-break')) priority = 11;
      else if (className.includes('financial-stability') || text.includes('재무안정성')) priority = 10;
      else if (['h3', 'h4'].includes(tagName)) priority = 8;
      else if (className.includes('bg-blue-50')) priority = 7;
      else if (className.includes('section-header')) priority = 6;
      else if (className.includes('analysis')) priority = 5;
      else if (text.includes('분석')) priority = 4;
      else if (text.includes('수익성') || text.includes('안정성') || text.includes('효율성')) priority = 3;

      sectionPositions.push({
        element: section,
        top: relativeTop,
        height: height,
        bottom: bottom,
        isTitle: ['h1', 'h2', 'h3', 'h4'].includes(tagName),
        priority: priority,
        text: text,
      });
    });

    // 위치에 따라 정렬
    sectionPositions.sort((a, b) => a.top - b.top);

    devLog('발견된 섹션 수:', sectionPositions.length);
    sectionPositions.forEach((section, index) => {
      const el = section.element as HTMLElement;
      devLog(
        `섹션 ${index + 1}: ${el.tagName}.${el.className} "${section.text.substring(0, 30)}..." - 위치: ${Math.round(section.top)}, 높이: ${Math.round(section.height)}, 우선순위: ${section.priority}`
      );
    });

    // 3. 개선된 페이지 분할 로직
    const breakPoints: number[] = [];
    let currentY = 0;

    while (currentY < totalCanvasHeight) {
      // 이상적인 다음 페이지 끝 위치
      let idealNextBreakPoint = Math.min(currentY + maxPagePixels, totalCanvasHeight);

      // 현재 위치에서 이상적인 지점 사이의 모든 섹션 찾기
      const candidateSections = sectionPositions.filter(
        section =>
          section.top > currentY &&
          section.top <= idealNextBreakPoint + maxPagePixels * 0.4
      );

      let bestBreakPoint = idealNextBreakPoint;

      if (candidateSections.length > 0) {
        // 4. 스마트 분할 점 선택
        let bestCandidate = candidateSections[0];
        let bestScore = -Infinity;

        for (const candidate of candidateSections) {
          // 점수 계산: 우선순위 + 이상적 위치와의 거리 + 섹션 크기 고려
          const distanceFromIdeal = Math.abs(candidate.top - idealNextBreakPoint);
          const distanceScore = Math.max(0, 1 - distanceFromIdeal / (maxPagePixels * 0.8));
          const priorityScore = candidate.priority / 15;
          const sizeScore = candidate.height < maxPagePixels * 0.85 ? 1 : 0.3;

          // 보너스 점수 계산
          const sectionBonus = candidate.element.className.includes('report-section') ? 0.3 : 0;
          const newsBonus = (candidate.element.className.includes('news-section') ||
                           candidate.text.includes('뉴스') ||
                           candidate.text.includes('관련 최신 기사')) ? 0.25 : 0;
          const specialBonus = candidate.text.includes('재무안정성') ? 0.2 : 0;

          const totalScore =
            priorityScore * 0.5 +
            distanceScore * 0.3 +
            sizeScore * 0.2 +
            sectionBonus +
            newsBonus +
            specialBonus;

          devLog(
            `후보 섹션 "${candidate.text.substring(0, 20)}...": 점수=${totalScore.toFixed(2)} (우선순위=${priorityScore.toFixed(2)}, 거리=${distanceScore.toFixed(2)}, 크기=${sizeScore.toFixed(2)}, 보너스=${(sectionBonus + newsBonus + specialBonus).toFixed(2)})`
          );

          if (totalScore > bestScore) {
            bestScore = totalScore;
            bestCandidate = candidate;
          }
        }

        bestBreakPoint = bestCandidate.top;
        devLog(`최적 분할점 선택: "${bestCandidate.text.substring(0, 30)}..." (점수: ${bestScore.toFixed(2)})`);

        // 5. 섹션이 너무 클 경우 처리
        if (bestCandidate.height > maxPagePixels * 1.2) {
          const quarterPoint = bestCandidate.top + bestCandidate.height * 0.25;
          const halfPoint = bestCandidate.top + bestCandidate.height * 0.5;
          const threeQuarterPoint = bestCandidate.top + bestCandidate.height * 0.75;

          // 가장 적절한 분할점 선택
          if (quarterPoint - currentY > maxPagePixels * 0.6) {
            bestBreakPoint = quarterPoint;
            devLog(`큰 섹션 1/4 지점 분할: ${quarterPoint}`);
          } else if (halfPoint - currentY > maxPagePixels * 0.4) {
            bestBreakPoint = halfPoint;
            devLog(`큰 섹션 중간 분할: ${halfPoint}`);
          } else if (threeQuarterPoint - currentY > maxPagePixels * 0.3) {
            bestBreakPoint = threeQuarterPoint;
            devLog(`큰 섹션 3/4 지점 분할: ${threeQuarterPoint}`);
          }
        }
      }

      // 6. 페이지 크기 검증
      const pageHeight = bestBreakPoint - currentY;

      // 최소 페이지 높이 보장
      if (pageHeight < maxPagePixels * 0.3 && bestBreakPoint < totalCanvasHeight) {
        bestBreakPoint = Math.min(currentY + maxPagePixels * 0.7, totalCanvasHeight);
        devLog(`최소 페이지 높이 보장: ${bestBreakPoint}`);
      }

      // 최대 페이지 높이 제한
      if (pageHeight > maxPagePixels * 1.5) {
        bestBreakPoint = currentY + maxPagePixels * 1.2;
        devLog(`최대 페이지 높이 제한: ${bestBreakPoint}`);
      }

      // 7. 마지막 페이지 처리
      const remainingHeight = totalCanvasHeight - bestBreakPoint;
      if (remainingHeight > 0 && remainingHeight < maxPagePixels * 0.3 && breakPoints.length > 0) {
        devLog(`마지막 페이지가 작아서 이전 페이지와 합침 (남은 높이: ${remainingHeight})`);
        break;
      }

      breakPoints.push(bestBreakPoint);
      currentY = bestBreakPoint;

      devLog(`페이지 ${breakPoints.length} 추가: ${Math.round(currentY)}px (높이: ${Math.round(pageHeight)}px)`);
    }

    // 마지막 페이지 추가
    if (breakPoints.length === 0 || breakPoints[breakPoints.length - 1] < totalCanvasHeight) {
      breakPoints.push(totalCanvasHeight);
    }

    devLog('최종 페이지 나누기 지점:', breakPoints.map(p => Math.round(p)));
    devLog('총 페이지 수:', breakPoints.length);

    return breakPoints;
  }
}