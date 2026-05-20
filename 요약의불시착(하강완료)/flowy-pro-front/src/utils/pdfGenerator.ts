// @ts-ignore
import NanumHumanRegularBase64 from '../static/fonts/NanumHumanRegular.ttf.base64.js';
// @ts-ignore
import NanumHumanBoldBase64 from '../static/fonts/NanumHumanBold.ttf.base64.js';

/**
 * 회의 결과 PDF 생성 (window.pdfMake 직접 사용, vfs 오류 0%)
 * @param checked - 각 항목별 포함 여부
 * @param meetingInfo - 회의 기본 정보
 * @param summary - 회의 요약
 * @param tasks - 작업 목록
 * @param feedback - 피드백
 */
export function generateMeetingPDF({
  checked,
  meetingInfo,
  summary,
  tasks,
  feedback,
}: {
  checked: { [key: string]: boolean };
  meetingInfo: any;
  summary: any;
  tasks: any;
  feedback: any;
}) {
  // @ts-ignore
  const pdfMake = window.pdfMake;

  if (typeof pdfMake !== 'undefined') {
    if (!pdfMake.vfs) {
      pdfMake.vfs = {};
    }
    if (!pdfMake.fonts) {
      pdfMake.fonts = {};
    }

    pdfMake.vfs['NanumHumanRegular.ttf'] = NanumHumanRegularBase64;
    pdfMake.vfs['NanumHumanBold.ttf'] = NanumHumanBoldBase64;

    pdfMake.fonts['NanumHuman'] = {
      normal: 'NanumHumanRegular.ttf',
      bold: 'NanumHumanBold.ttf',
    };

    // 파일명 동적 생성
    const projectName = (meetingInfo.project || '').replace(/\s/g, '');
    const meetingTitle = (meetingInfo.title || '').replace(/\s/g, '');
    const meetingDate = (meetingInfo.date || '').split('T')[0];
    const itemMap: Record<string, string> = {
      info: '기본정보',
      basic: '기본정보',
      summary: '요약',
      tasks: '작업목록',
      feedback: '피드백',
    };
    let included = Object.entries(checked)
      .filter(([key, value]) => value && itemMap[key])
      .map(([key]) => itemMap[key])
      .filter((v, i, arr) => arr.indexOf(v) === i);
    const allItems = ['기본정보', '요약', '작업목록', '피드백'];
    let includedStr = included.join('_');
    if (
      included.length === allItems.length &&
      allItems.every((item) => included.includes(item))
    ) {
      includedStr = '전체';
    }
    const fileName = `${projectName}_${meetingTitle}_${meetingDate}_${includedStr}.pdf`;

    // PDF 본문 content 배열
    const content: any[] = [];

    // [회의 기본 정보]는 무조건 포함
    if (meetingInfo) {
      const infoSection: any[] = [
        { text: '[ 회의 기본 정보 ]', style: 'sectionTitle' },
        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 0,
              x2: 520,
              y2: 0,
              lineWidth: 1,
              lineColor: '#aaa',
            },
          ],
        },
        { text: `프로젝트: ${meetingInfo.project || ''}`, style: 'body' },
        { text: `회의 제목: ${meetingInfo.title || ''}`, style: 'body' },
        {
          text: `일시: ${
            meetingInfo.date ? formatDateTime(meetingInfo.date) : ''
          }`,
          style: 'body',
        },
        {
          text: `참석자: ${
            Array.isArray(meetingInfo.attendees)
              ? meetingInfo.attendees
                  .map((a: any) => a.user_name || a.name || a.toString())
                  .join(', ')
              : ''
          }`,
          style: 'body',
        },
      ];
      if (meetingInfo.agenda) {
        infoSection.push({
          text: `안건: ${meetingInfo.agenda}`,
          style: 'body',
        });
      }
      infoSection.push({
        text: '',
        margin: [0, 0, 0, 10] as [number, number, number, number],
      });
      content.push(...infoSection);
    }

    // [회의 요약]
    if (checked.summary && summary?.updated_summary_contents) {
      const summaryTableBody: any[] = [
        [
          { text: '항목', style: 'tableHeader' },
          { text: '내용', style: 'tableHeader' },
        ],
      ];
      Object.entries(summary.updated_summary_contents).forEach(
        ([section, arr]) => {
          summaryTableBody.push([
            section,
            Array.isArray(arr) ? arr.join('\n') : arr,
          ]);
        }
      );
      content.push(
        { text: '[ 회의 요약 ]', style: 'sectionTitle' },
        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 0,
              x2: 520,
              y2: 0,
              lineWidth: 1,
              lineColor: '#aaa',
            },
          ],
        },
        {
          table: {
            headerRows: 1,
            widths: ['25%', '*'],
            body: summaryTableBody,
          },
          layout: {
            fillColor: (rowIndex: number) =>
              rowIndex === 0 ? '#e6e6fa' : null,
          },
          margin: [0, 6, 0, 10] as [number, number, number, number],
        }
      );
    }

    // [작업 목록]
    if (checked.tasks && tasks && typeof tasks === 'object') {
      const taskTableBody: any[] = [
        [
          { text: '작업 내용', style: 'tableHeader' },
          { text: '담당자', style: 'tableHeader' },
          { text: '일정', style: 'tableHeader' },
        ],
      ];
      Object.entries(tasks).forEach(([assignee, arr]) => {
        if (!Array.isArray(arr) || arr.length === 0) return;
        arr.forEach((task: any) => {
          taskTableBody.push([
            task.action || '',
            task.assignee || assignee || '',
            formatScheduleDate(task.schedule || ''),
          ]);
        });
      });
      content.push(
        { text: '[ 작업 목록 ]', style: 'sectionTitle' },
        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 0,
              x2: 520,
              y2: 0,
              lineWidth: 1,
              lineColor: '#aaa',
            },
          ],
        },
        {
          table: {
            headerRows: 1,
            widths: ['*', '15%', '20%'],
            body: taskTableBody,
          },
          layout: {
            fillColor: (rowIndex: number) =>
              rowIndex === 0 ? '#e6e6fa' : null,
          },
          margin: [0, 6, 0, 10] as [number, number, number, number],
        }
      );
    }

    // [회의 피드백]
    const FEEDBACK_LABELS: Record<string, string> = {
      'e508d0b2-1bfd-42a2-9687-1ae6cd36c648': '총평',
      '6cb5e437-bc6b-4a37-a3c4-473d9c0bebe2': '불필요한 대화',
      'ab5a65c6-31a4-493b-93ff-c47e00925d17': '논의되지 않은 안건',
      '0a5a835d-53d0-43a6-b821-7c36f603a071': '회의 시간 분석',
      '73c0624b-e1af-4a2b-8e54-c1f8f7dab827': '',
    };
    // 피드백 라벨 스타일 추가
    const feedbackLabelStyle = {
      fontSize: 13, // 기존 body가 12라면 약 8% 증가
      bold: true,
      margin: [0, 8, 0, 2] as [number, number, number, number],
    };
    if (checked.feedback && Array.isArray(feedback)) {
      content.push(
        { text: '[ 회의 피드백 ]', style: 'sectionTitle' },
        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 0,
              x2: 520,
              y2: 0,
              lineWidth: 1,
              lineColor: '#aaa',
            },
          ],
        }
      );
      let hasFeedback = false;
      feedback.forEach((fbObj: any) => {
        const label = FEEDBACK_LABELS[fbObj.feedbacktype_id] || '기타';
        const details = fbObj.feedback_detail;
        const isGuide =
          fbObj.feedbacktype_id === '73c0624b-e1af-4a2b-8e54-c1f8f7dab827';
        if (Array.isArray(details)) {
          details.forEach((fbDetail: string) => {
            if (!isGuide) {
              content.push({ text: label, ...feedbackLabelStyle });
              content.push({
                text: fbDetail,
                style: 'body',
                margin: [16, 0, 0, 8],
              });
            } else {
              content.push({ text: fbDetail, style: 'body' });
            }
            hasFeedback = true;
          });
        } else if (typeof details === 'string') {
          if (!isGuide) {
            content.push({ text: label, ...feedbackLabelStyle });
            content.push({
              text: details,
              style: 'body',
              margin: [16, 0, 0, 8],
            });
          } else {
            content.push({ text: details, style: 'body' });
          }
          hasFeedback = true;
        }
      });
      if (!hasFeedback) {
        content.push({ text: '피드백이 없습니다.', style: 'body' });
      }
      content.push({
        text: '',
        margin: [0, 0, 0, 10] as [number, number, number, number],
      });
    }



    // pdfMake 문서 정의
    const docDefinition = {
      content,
      styles: {
        sectionTitle: {
          fontSize: 16,
          bold: true,
          color: '#000080',
          margin: [0, 10, 0, 6] as [number, number, number, number],
        },
        tableHeader: { fillColor: '#e6e6fa', bold: true, color: '#000080' },
        body: {
          fontSize: 12,
          margin: [0, 2, 0, 2] as [number, number, number, number],
        },
      },
      defaultStyle: { font: 'NanumHuman' },
    };

    pdfMake.createPdf(docDefinition).download(fileName);
  } else {
    alert('PDF 엔진이 아직 로드되지 않았습니다. 잠시 후 다시 시도해 주세요.');
  }
}

// 날짜 포맷 함수
function formatDateTime(dateString: string) {
  if (!dateString) return '';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}

// 일정(날짜) 포맷 함수: YYYY.MM.DD(요일) 형태로 변환
function formatScheduleDate(dateString: string) {
  // 이미 (요일)까지 붙어 있으면 그대로 반환
  if (!dateString) return '';
  if (dateString.match(/\(.*\)$/)) return dateString;
  // YYYY-MM-DD 또는 YYYY.MM.DD 등 다양한 구분자 처리
  let d = dateString.replace(/\./g, '-').replace(/\//g, '-');
  const date = new Date(d);
  if (isNaN(date.getTime())) return dateString;
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const week = ['일', '월', '화', '수', '목', '금', '토'];
  const day = week[date.getDay()];
  return `${yyyy}.${mm}.${dd}(${day})`;
}
