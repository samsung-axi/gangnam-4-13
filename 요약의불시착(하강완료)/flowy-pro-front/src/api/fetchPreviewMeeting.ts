// 1. 확인 대기 중인 예정 회의 조회
export const fetchPendingPreviewMeeting = async (meetingId: string) => {
  try {
    console.log('🔍 fetchPendingPreviewMeeting 시작');
    console.log('환경변수 VITE_API_URL:', import.meta.env.VITE_API_URL);
    console.log('meetingId:', meetingId);
    console.log('현재 환경:', import.meta.env.MODE);
    console.log('개발 환경 여부:', import.meta.env.DEV);
    console.log('프로덕션 환경 여부:', import.meta.env.PROD);
    
    const url = `${import.meta.env.VITE_API_URL}/api/v1/meetings/pending?meeting_id=${meetingId}`;
    console.log('🔍 API 요청 URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('📡 응답 상태:', response.status);
    console.log('📡 응답 상태 텍스트:', response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ 서버 응답 내용:', errorText);
      throw new Error(`예정 회의 조회 실패: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ 응답 데이터:', data);
    return data;
  } catch (error) {
    console.error('fetchPendingPreviewMeeting 오류:', error);
    throw error;
  }
};

// 2. 예정 회의를 캘린더에 등록
export const confirmPreviewMeeting = async (meetingId: string, agentMeetingId: string, confirmData: any) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/meetings/${meetingId}/accept`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        agent_meeting_id: agentMeetingId,
        ...confirmData 
      }),
    });

    if (!response.ok) {
      throw new Error('캘린더 등록 실패');
    }

    return await response.json();
  } catch (error) {
    console.error('confirmPreviewMeeting 오류:', error);
    throw error;
  }
};

// 3. 예정 회의를 거부 처리
export const rejectPreviewMeeting = async (meetingId: string, agentMeetingId: string) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/meetings/${meetingId}/reject`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        agent_meeting_id: agentMeetingId 
      }),
    });

    if (!response.ok) {
      throw new Error('예정 회의 거부 실패');
    }

    return await response.json();
  } catch (error) {
    console.error('rejectPreviewMeeting 오류:', error);
    throw error;
  }
}; 