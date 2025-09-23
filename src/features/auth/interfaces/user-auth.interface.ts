export interface LoginRequest {
  cedula: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
}
