import {
  LoginRequest,
  LoginResponse,
} from "../../interfaces/user-auth.interface";

export interface AuthRepository {
  signIn(request: LoginRequest): Promise<LoginResponse>;
}
