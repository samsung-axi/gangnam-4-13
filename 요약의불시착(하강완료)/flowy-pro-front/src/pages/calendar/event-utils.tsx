let eventGuid = 0;
// let todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today

// export type CalendarEvent = {
//   id: string;
//   title: string;
//   start: Date | string;
//   end?: Date | string;
//   type: 'meeting' | 'todo';
//   completed?: boolean; // todo용
// };

export type CalendarEvent = {
  id: string;
  user_id: string;
  project_id: string;
  title: string;
  start: Date | string; // ISO string
  end?: Date | string;
  type: 'meeting' | 'todo';
  completed?: boolean;
  created_at: string;
  updated_at: string;
  meeting_id?: string; // calendar와 meeting 1:1 연동
};

export const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: '1',
    user_id: '1111da59-ceb8-488d-a51c-ce18eece9620',
    project_id: '4663ef2e-eb96-4afc-b3a5-8ac113fdd6f9',
    title: '기능 정의 Kick-off',
    start: new Date(2025, 5, 2, 10, 0),
    end: new Date(2025, 5, 2, 11, 0),
    type: 'meeting',
    created_at: new Date(2025, 5, 2, 10, 0).toISOString(),
    updated_at: new Date(2025, 5, 2, 10, 0).toISOString(),
  },
  // {
  //   id: '2',
  //   user_id: '1',
  //   project_id: '1',
  //   title: '초기 화면 흐름 UX 회의',
  //   start: new Date(2025, 5, 5, 11, 0),
  //   end: new Date(2025, 5, 5, 12, 0),
  //   type: 'meeting',
  //   created_at: new Date(2025, 5, 5, 11, 0).toISOString(),
  //   updated_at: new Date(2025, 5, 5, 11, 0).toISOString(),
  // },
  // {
  //   id: '3',
  //   user_id: '1',
  //   project_id: '1',
  //   title: 'UI 디자인 시안 만들기',
  //   start: new Date(2025, 5, 5, 0, 0),
  //   type: 'todo',
  //   completed: false,
  //   created_at: new Date(2025, 5, 5, 0, 0).toISOString(),
  //   updated_at: new Date(2025, 5, 5, 0, 0).toISOString(),
  // },
  // {
  //   id: '4',
  //   user_id: '1',
  //   project_id: '1',
  //   title: 'API 명세서 작성',
  //   start: new Date(2025, 5, 5, 0, 0),
  //   type: 'todo',
  //   completed: true,
  //   created_at: new Date(2025, 5, 5, 0, 0).toISOString(),
  //   updated_at: new Date(2025, 5, 5, 0, 0).toISOString(),
  // },
  {
    id: '5',
    user_id: '1111da59-ceb8-488d-a51c-ce18eece9620',
    project_id: '4663ef2e-eb96-4afc-b3a5-8ac113fdd6f9',
    title: 'DB 설계 초안 작성',
    start: new Date(2025, 5, 6, 0, 0),
    type: 'todo',
    completed: false,
    created_at: new Date(2025, 5, 6, 0, 0).toISOString(),
    updated_at: new Date(2025, 5, 6, 0, 0).toISOString(),
  },
  // {
  //   id: '6',
  //   user_id: '1',
  //   project_id: '1',
  //   title: '회의록 정리',
  //   start: new Date(2025, 5, 7, 0, 0),
  //   type: 'todo',
  //   completed: false,
  //   created_at: new Date(2025, 5, 7, 0, 0).toISOString(),
  //   updated_at: new Date(2025, 5, 7, 0, 0).toISOString(),
  // },
  // {
  //   id: '7',
  //   user_id: '1',
  //   project_id: '1',
  //   title: '프로토타입 피드백 정리',
  //   start: new Date(2025, 5, 8, 0, 0),
  //   type: 'todo',
  //   completed: true,
  //   created_at: new Date(2025, 5, 8, 0, 0).toISOString(),
  //   updated_at: new Date(2025, 5, 8, 0, 0).toISOString(),
  // },
  // {
  //   id: '8',
  //   user_id: '1',
  //   project_id: '1',
  //   title: '테스트 케이스 작성',
  //   start: new Date(2025, 5, 9, 0, 0),
  //   type: 'todo',
  //   completed: false,
  //   created_at: new Date(2025, 5, 9, 0, 0).toISOString(),
  //   updated_at: new Date(2025, 5, 9, 0, 0).toISOString(),
  // },
];

export function createEventId() {
  return String(eventGuid++);
}
