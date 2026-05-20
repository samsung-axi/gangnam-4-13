export type Feedback = {
  feedbacktype_id: string;
  meeting_id: string;
  feedback_id: string;
  feedback_detail: string | string[];
  feedback_created_date: string;
};

export type SummaryLog = {
  summary_log_id: string;
  updated_summary_contents: Record<string, any>; // 어떤 키든 올 수 있는 JSON
};

export type Project = {
  project_name: string;
  project_id: string;
  project_users?: {
    user: {
      user_id: string;
      user_name: string;
      user_email: string;
    };
  };
};

export type Meeting = {
  meeting_agenda: string;
  meeting_date: string;
  meeting_id: string;
  meeting_title: string;
};

export type ProjectUser = {
  user_id: string;
  user_name: string;
  role_id?: string; // 역할 정보 추가
};

export interface meetingInfo {
  project: string;
  title: string;
  date: string;
  attendees: {
    user_id: string;
    user_name: string;
  }[];
  agenda: string;
  project_users: {
    user_id: string;
    user_name: string;
    user_email: string;
  }[];
  meeting_id: string;
}
