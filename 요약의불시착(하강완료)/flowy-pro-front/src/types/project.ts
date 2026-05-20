export interface Project {
  project_id: string;
  project_name: string;
  project_detail: string;
  project_created_date: string; // ISO8601 날짜 문자열
  project_updated_date: string;
  project_end_date?: string | null; // 값이 없을 수 있으므로 optional로 처리
  project_status: boolean;
  company_id: string;
}

export interface ProjectResponse {
  projectId: string;
  projectName: string;
  projectDetail: string;
  projectCreatedDate: string;
  users?: {
    user_id: string;
    user_name: string;
    role_id: string;
    role_name: string;
  }[];
}

export interface ProjectUser {
  project_user_id: string;
  user_id: string;
  project_id: string;
  role_id: string;
  project: Project;
  user_count: number;
}

export interface ProjectUserIdName {
  user_id: string;
  user_name: string;
  role_id?: string;
}

export interface ProjectRoleIdName {
  role_id: string;
  role_name: string;
}

export interface ProjectRequestBody {
  company_id: string;
  project_name: string;
  project_detail: string;
  project_status: boolean;
  project_users: {
    user_id: string;
    role_id: string;
  }[];
}

export type ProjectUpdateRequestBody = {
  project_id: string;
  project_name: string;
  project_detail: string;
  // project_status: boolean;
  project_users: {
    user_id: string;
    role_id: string;
  }[];
};

export interface Todo {
  action: string;
  assignee: string;
  context: string;
  schedule?: string;
}
[];
