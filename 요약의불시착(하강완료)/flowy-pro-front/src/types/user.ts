export interface User {
  user_id: string;
  user_name: string;
  user_email: string;
  user_login_id: string;
  user_login_type: string;
  user_password: string;
  user_phonenum: string;
  user_dept_name: string;
  user_team_name: string;
  user_jobname: string;
  user_company_id: string;
  // user_position_id: string;
  // user_sysrole_id: string;
  company_id: string;
  company_name: string;
}

// 마이페이지 수정 인터페이스
export interface UserUpdateRequest {
  user_name?: string;
  user_team_name?: string;
  user_dept_name?: string;
  user_phonenum?: string;
  user_password?: string;
}

// 마이페이지 인증 인터페이스
export interface LoginRequest {
  login_id: string;
  password: string;
}

// 토큰 유저 인터페이스
export interface TokenUser {
  sub: string;
  id: string;
  name: string;
  email: string;
  login_id: string;
  sysrole: string;
}
