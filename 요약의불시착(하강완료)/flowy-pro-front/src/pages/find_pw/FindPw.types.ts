export interface CodeVerificationRequest {
  user_login_id: string;
  email: string;
  input_code: string;
}

export interface ChangePasswordRequest {
  new_password: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}
